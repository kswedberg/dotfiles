(function() {
  var BufferedProcess, Path, RepoListView, getRepoForCurrentFile, git, gitUntrackedFiles, notifier, _prettify, _prettifyDiff, _prettifyUntracked;

  BufferedProcess = require('atom').BufferedProcess;

  Path = require('flavored-path');

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  gitUntrackedFiles = function(repo, dataUnstaged) {
    var args;
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    args = ['ls-files', '-o', '--exclude-standard'];
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return dataUnstaged.concat(_prettifyUntracked(data));
    });
  };

  _prettify = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = _i += 2) {
        mode = data[i];
        _results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return _results;
    })();
  };

  _prettifyUntracked = function(data) {
    if (data === '') {
      return [];
    }
    data = data.split(/\n/).filter(function(d) {
      return d !== '';
    });
    return data.map(function(file) {
      return {
        mode: '?',
        path: file
      };
    });
  };

  _prettifyDiff = function(data) {
    var line, _ref;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(_ref = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = data.slice(1);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        _results.push('@@' + line);
      }
      return _results;
    })())), _ref;
    return data;
  };

  getRepoForCurrentFile = function() {
    return new Promise(function(resolve, reject) {
      var directory, path, project, _ref;
      project = atom.project;
      path = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      directory = project.getDirectories().filter(function(d) {
        return d.contains(path);
      })[0];
      if (directory != null) {
        return project.repositoryForDirectory(directory).then(function(repo) {
          var submodule;
          submodule = repo.repo.submoduleForPath(path);
          if (submodule != null) {
            return resolve(submodule);
          } else {
            return resolve(repo);
          }
        })["catch"](function(e) {
          return reject(e);
        });
      } else {
        return reject("no current file");
      }
    });
  };

  module.exports = git = {
    cmd: function(args, options) {
      if (options == null) {
        options = {};
      }
      return new Promise(function(resolve, reject) {
        var output, _ref;
        output = '';
        try {
          return new BufferedProcess({
            command: (_ref = atom.config.get('git-plus.gitPath')) != null ? _ref : 'git',
            args: args,
            options: options,
            stdout: function(data) {
              return output += data.toString();
            },
            stderr: function(data) {
              return reject(data.toString());
            },
            exit: function(code) {
              return resolve(output);
            }
          });
        } catch (_error) {
          notifier.addError('Git Plus is unable to locate the git command. Please ensure process.env.PATH can access git.');
          return reject("Couldn't find git");
        }
      });
    },
    getConfig: function(setting, workingDirectory) {
      if (workingDirectory == null) {
        workingDirectory = null;
      }
      if (workingDirectory != null) {
        return git.cmd(['config', '--get', setting], {
          cwd: workingDirectory
        });
      } else {
        return git.cmd(['config', '--get', setting], {
          cwd: Path.get('~')
        });
      }
    },
    reset: function(repo) {
      return git.cmd(['reset', 'HEAD'], {
        cwd: repo.getWorkingDirectory()
      }).then(function() {
        return notifier.addSuccess('All changes unstaged');
      });
    },
    status: function(repo) {
      return git.cmd(['status', '--porcelain', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (data.length > 2) {
          return data.split('\0');
        } else {
          return [];
        }
      });
    },
    refresh: function() {
      return atom.project.getRepositories().forEach(function(repo) {
        if (repo != null) {
          repo.refreshStatus();
          return git.cmd(['add', '--refresh', '--', '.'], {
            cwd: repo.getWorkingDirectory()
          });
        }
      });
    },
    relativize: function(path) {
      var _ref, _ref1, _ref2, _ref3;
      return (_ref = (_ref1 = (_ref2 = git.getSubmodule(path)) != null ? _ref2.relativize(path) : void 0) != null ? _ref1 : (_ref3 = atom.project.getRepositories()[0]) != null ? _ref3.relativize(path) : void 0) != null ? _ref : path;
    },
    diff: function(repo, path) {
      return git.cmd(['diff', '-p', '-U1', path], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettifyDiff(data);
      });
    },
    stagedFiles: function(repo, stdout) {
      var args;
      args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettify(data);
      })["catch"](function(error) {
        if (error.includes("ambiguous argument 'HEAD'")) {
          return Promise.resolve([1]);
        } else {
          notifier.addError(error);
          return Promise.resolve([]);
        }
      });
    },
    unstagedFiles: function(repo, _arg) {
      var args, showUntracked;
      showUntracked = (_arg != null ? _arg : {}).showUntracked;
      args = ['diff-files', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data));
        } else {
          return _prettify(data);
        }
      });
    },
    add: function(repo, _arg) {
      var args, file, update, _ref;
      _ref = _arg != null ? _arg : {}, file = _ref.file, update = _ref.update;
      args = ['add'];
      if (update) {
        args.push('--update');
      } else {
        args.push('--all');
      }
      args.push(file ? file : '.');
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(output) {
        if (output !== false) {
          notifier.addSuccess("Added " + (file != null ? file : 'all files'));
          return true;
        }
      });
    },
    getRepo: function() {
      return new Promise(function(resolve, reject) {
        return getRepoForCurrentFile().then(function(repo) {
          return resolve(repo);
        })["catch"](function(e) {
          var repos;
          repos = atom.project.getRepositories().filter(function(r) {
            return r != null;
          });
          if (repos.length === 0) {
            return reject("No repos found");
          } else if (repos.length > 1) {
            return resolve(new RepoListView(repos).result);
          } else {
            return resolve(repos[0]);
          }
        });
      });
    },
    getSubmodule: function(path) {
      var _ref, _ref1, _ref2;
      if (path == null) {
        path = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      }
      return (_ref1 = atom.project.getRepositories().filter(function(r) {
        var _ref2;
        return r != null ? (_ref2 = r.repo) != null ? _ref2.submoduleForPath(path) : void 0 : void 0;
      })[0]) != null ? (_ref2 = _ref1.repo) != null ? _ref2.submoduleForPath(path) : void 0 : void 0;
    },
    dir: function(andSubmodules) {
      if (andSubmodules == null) {
        andSubmodules = true;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var submodule;
          if (andSubmodules && (submodule = git.getSubmodule())) {
            return resolve(submodule.getWorkingDirectory());
          } else {
            return git.getRepo().then(function(repo) {
              return resolve(repo.getWorkingDirectory());
            });
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvZ2l0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwSUFBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUixDQUhmLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FKWCxDQUFBOztBQUFBLEVBTUEsaUJBQUEsR0FBb0IsU0FBQyxJQUFELEVBQU8sWUFBUCxHQUFBO0FBQ2xCLFFBQUEsSUFBQTs7TUFEeUIsZUFBYTtLQUN0QztBQUFBLElBQUEsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsb0JBQW5CLENBQVAsQ0FBQTtXQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO0FBQUEsTUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFELEdBQUE7YUFDSixZQUFZLENBQUMsTUFBYixDQUFvQixrQkFBQSxDQUFtQixJQUFuQixDQUFwQixFQURJO0lBQUEsQ0FETixFQUZrQjtFQUFBLENBTnBCLENBQUE7O0FBQUEsRUFZQSxTQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixRQUFBLE9BQUE7QUFBQSxJQUFBLElBQWEsSUFBQSxLQUFRLEVBQXJCO0FBQUEsYUFBTyxFQUFQLENBQUE7S0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFpQixhQUR4QixDQUFBOzs7QUFF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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/git.coffee
