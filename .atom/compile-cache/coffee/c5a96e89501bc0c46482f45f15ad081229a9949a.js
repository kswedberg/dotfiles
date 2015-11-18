(function() {
  var BufferedProcess, RepoListView, dir, getRepo, getRepoForCurrentFile, getSubmodule, gitAdd, gitCmd, gitDiff, gitRefresh, gitResetHead, gitStagedFiles, gitStatus, gitUnstagedFiles, gitUntrackedFiles, notifier, relativize, _getGitPath, _prettify, _prettifyDiff, _prettifyUntracked;

  BufferedProcess = require('atom').BufferedProcess;

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  gitCmd = function(_arg) {
    var args, c_stdout, command, cwd, error, exit, options, stderr, stdout, _ref;
    _ref = _arg != null ? _arg : {}, args = _ref.args, cwd = _ref.cwd, options = _ref.options, stdout = _ref.stdout, stderr = _ref.stderr, exit = _ref.exit;
    command = _getGitPath();
    if (options == null) {
      options = {};
    }
    if (options.cwd == null) {
      options.cwd = cwd;
    }
    if (stderr == null) {
      stderr = function(data) {
        return notifier.addError(data.toString());
      };
    }
    if ((stdout != null) && (exit == null)) {
      c_stdout = stdout;
      stdout = function(data) {
        if (this.save == null) {
          this.save = '';
        }
        return this.save += data;
      };
      exit = function(exit) {
        c_stdout(this.save != null ? this.save : this.save = '');
        return this.save = null;
      };
    }
    try {
      return new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    } catch (_error) {
      error = _error;
      return notifier.addError('Git Plus is unable to locate git command. Please ensure process.env.PATH can access git.');
    }
  };

  gitStatus = function(repo, stdout) {
    return gitCmd({
      args: ['status', '--porcelain', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return stdout(data.length > 2 ? data.split('\0') : []);
      }
    });
  };

  gitStagedFiles = function(repo, stdout) {
    var files;
    files = [];
    return gitCmd({
      args: ['diff-index', '--cached', 'HEAD', '--name-status', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return files = _prettify(data);
      },
      stderr: function(data) {
        if (data.toString().includes("ambiguous argument 'HEAD'")) {
          return files = [1];
        } else {
          notifier.addError(data.toString());
          return files = [];
        }
      },
      exit: function(code) {
        return stdout(files);
      }
    });
  };

  gitUnstagedFiles = function(repo, _arg, stdout) {
    var showUntracked;
    showUntracked = (_arg != null ? _arg : {}).showUntracked;
    return gitCmd({
      args: ['diff-files', '--name-status', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data), stdout);
        } else {
          return stdout(_prettify(data));
        }
      }
    });
  };

  gitUntrackedFiles = function(repo, dataUnstaged, stdout) {
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    return gitCmd({
      args: ['ls-files', '-o', '--exclude-standard', '-z'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return stdout(dataUnstaged.concat(_prettifyUntracked(data)));
      }
    });
  };

  gitDiff = function(repo, path, stdout) {
    return gitCmd({
      args: ['diff', '-p', '-U1', path],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return stdout(_prettifyDiff(data));
      }
    });
  };

  gitRefresh = function() {
    atom.project.getRepositories().forEach(function(r) {
      return r != null ? r.refreshStatus() : void 0;
    });
    return gitCmd({
      args: ['add', '--refresh', '--', '.'],
      stderr: function(data) {}
    });
  };

  gitAdd = function(repo, _arg) {
    var args, exit, file, stderr, stdout, update, _ref;
    _ref = _arg != null ? _arg : {}, file = _ref.file, stdout = _ref.stdout, stderr = _ref.stderr, exit = _ref.exit, update = _ref.update;
    args = ['add'];
    if (update) {
      args.push('--update');
    } else {
      args.push('--all');
    }
    if (file) {
      args.push(file);
    } else {
      '.';
    }
    if (exit == null) {
      exit = function(code) {
        if (code === 0) {
          return notifier.addSuccess("Added " + (file != null ? file : 'all files'));
        }
      };
    }
    return gitCmd({
      args: args,
      cwd: repo.getWorkingDirectory(),
      stdout: stdout != null ? stdout : void 0,
      stderr: stderr != null ? stderr : void 0,
      exit: exit
    });
  };

  gitResetHead = function(repo) {
    return gitCmd({
      args: ['reset', 'HEAD'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return notifier.addSuccess('All changes unstaged');
      }
    });
  };

  _getGitPath = function() {
    var p, _ref;
    p = (_ref = atom.config.get('git-plus.gitPath')) != null ? _ref : 'git';
    console.log("Git-plus: Using git at", p);
    return p;
  };

  _prettify = function(data) {
    var files, i, mode;
    data = data.split('\0').slice(0, -1);
    return files = (function() {
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
    var file, files;
    if (data == null) {
      return [];
    }
    data = data.split('\0').slice(0, -1);
    return files = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        file = data[_i];
        _results.push({
          mode: '?',
          path: file
        });
      }
      return _results;
    })();
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

  dir = function(andSubmodules) {
    if (andSubmodules == null) {
      andSubmodules = true;
    }
    return new Promise(function(resolve, reject) {
      var submodule;
      if (andSubmodules && (submodule = getSubmodule())) {
        return resolve(submodule.getWorkingDirectory());
      } else {
        return getRepo().then(function(repo) {
          return resolve(repo.getWorkingDirectory());
        });
      }
    });
  };

  relativize = function(path) {
    var _ref, _ref1, _ref2, _ref3;
    return (_ref = (_ref1 = (_ref2 = getSubmodule(path)) != null ? _ref2.relativize(path) : void 0) != null ? _ref1 : (_ref3 = atom.project.getRepositories()[0]) != null ? _ref3.relativize(path) : void 0) != null ? _ref : path;
  };

  getSubmodule = function(path) {
    var repo, _ref, _ref1, _ref2;
    if (path == null) {
      path = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
    }
    return repo = (_ref1 = atom.project.getRepositories().filter(function(r) {
      return r != null ? r.repo.submoduleForPath(path) : void 0;
    })[0]) != null ? (_ref2 = _ref1.repo) != null ? _ref2.submoduleForPath(path) : void 0 : void 0;
  };

  getRepo = function() {
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

  module.exports.cmd = gitCmd;

  module.exports.stagedFiles = gitStagedFiles;

  module.exports.unstagedFiles = gitUnstagedFiles;

  module.exports.diff = gitDiff;

  module.exports.refresh = gitRefresh;

  module.exports.status = gitStatus;

  module.exports.reset = gitResetHead;

  module.exports.add = gitAdd;

  module.exports.dir = dir;

  module.exports.relativize = relativize;

  module.exports.getSubmodule = getSubmodule;

  module.exports.getRepo = getRepo;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvZ2l0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvUkFBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUZYLENBQUE7O0FBQUEsRUFjQSxNQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxRQUFBLHdFQUFBO0FBQUEsMEJBRFEsT0FBMkMsSUFBMUMsWUFBQSxNQUFNLFdBQUEsS0FBSyxlQUFBLFNBQVMsY0FBQSxRQUFRLGNBQUEsUUFBUSxZQUFBLElBQzdDLENBQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxXQUFBLENBQUEsQ0FBVixDQUFBOztNQUNBLFVBQVc7S0FEWDs7TUFFQSxPQUFPLENBQUMsTUFBTztLQUZmOztNQUdBLFNBQVUsU0FBQyxJQUFELEdBQUE7ZUFBVSxRQUFRLENBQUMsUUFBVCxDQUFrQixJQUFJLENBQUMsUUFBTCxDQUFBLENBQWxCLEVBQVY7TUFBQTtLQUhWO0FBS0EsSUFBQSxJQUFHLGdCQUFBLElBQWdCLGNBQW5CO0FBQ0UsTUFBQSxRQUFBLEdBQVcsTUFBWCxDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7O1VBQ1AsSUFBQyxDQUFBLE9BQVE7U0FBVDtlQUNBLElBQUMsQ0FBQSxJQUFELElBQVMsS0FGRjtNQUFBLENBRFQsQ0FBQTtBQUFBLE1BSUEsSUFBQSxHQUFPLFNBQUMsSUFBRCxHQUFBO0FBQ0wsUUFBQSxRQUFBLHFCQUFTLElBQUMsQ0FBQSxPQUFELElBQUMsQ0FBQSxPQUFRLEVB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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/git.coffee
