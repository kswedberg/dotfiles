(function() {
  var BufferedProcess, GitBridge, GitCmd, GitNotFoundError, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs');

  path = require('path');

  GitNotFoundError = (function(_super) {
    __extends(GitNotFoundError, _super);

    function GitNotFoundError(message) {
      this.name = 'GitNotFoundError';
      GitNotFoundError.__super__.constructor.call(this, message);
    }

    return GitNotFoundError;

  })(Error);

  GitCmd = null;

  GitBridge = (function() {
    GitBridge.process = function(args) {
      return new BufferedProcess(args);
    };

    function GitBridge() {}

    GitBridge.locateGitAnd = function(callback) {
      var errorHandler, exitHandler, possiblePath, search;
      possiblePath = atom.config.get('merge-conflicts.gitPath');
      if (possiblePath) {
        GitCmd = possiblePath;
        callback(null);
        return;
      }
      search = ['git', '/usr/local/bin/git', '"%PROGRAMFILES%\\Git\\bin\\git"', '"%LOCALAPPDATA%\\Programs\\Git\\bin\\git"'];
      possiblePath = search.shift();
      exitHandler = (function(_this) {
        return function(code) {
          if (code === 0) {
            GitCmd = possiblePath;
            callback(null);
            return;
          }
          return errorHandler();
        };
      })(this);
      errorHandler = (function(_this) {
        return function(e) {
          if (e != null) {
            e.handle();
            e.error.code = "NOTENOENT";
          }
          possiblePath = search.shift();
          if (possiblePath == null) {
            callback(new GitNotFoundError("Please set the 'Git Path' correctly in the Atom settings ", "for the Merge Conflicts package."));
            return;
          }
          return _this.process({
            command: possiblePath,
            args: ['--version'],
            exit: exitHandler
          }).onWillThrowError(errorHandler);
        };
      })(this);
      return this.process({
        command: possiblePath,
        args: ['--version'],
        exit: exitHandler
      }).onWillThrowError(errorHandler);
    };

    GitBridge._getActivePath = function() {
      var _ref;
      return (_ref = atom.workspace.getActivePaneItem()) != null ? typeof _ref.getPath === "function" ? _ref.getPath() : void 0 : void 0;
    };

    GitBridge.getActiveRepo = function(filepath) {
      var repo, rootDir, rootDirIndex;
      rootDir = atom.project.relativizePath(filepath || this._getActivePath())[0];
      if (rootDir != null) {
        rootDirIndex = atom.project.getPaths().indexOf(rootDir);
        repo = atom.project.getRepositories()[rootDirIndex];
      } else {
        repo = atom.project.getRepositories()[0];
      }
      return repo;
    };

    GitBridge._repoWorkDir = function(filepath) {
      return this.getActiveRepo(filepath).getWorkingDirectory();
    };

    GitBridge._repoGitDir = function(filepath) {
      return this.getActiveRepo(filepath).getPath();
    };

    GitBridge._statusCodesFrom = function(chunk, handler) {
      var indexCode, line, m, p, workCode, __, _i, _len, _ref, _results;
      _ref = chunk.split("\n");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        m = line.match(/^(.)(.) (.+)$/);
        if (m) {
          __ = m[0], indexCode = m[1], workCode = m[2], p = m[3];
          _results.push(handler(indexCode, workCode, p));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    GitBridge._checkHealth = function(callback) {
      if (!GitCmd) {
        console.trace("GitBridge method called before locateGitAnd");
        callback(new Error("GitBridge.locateGitAnd has not been called yet"));
        return false;
      }
      return true;
    };

    GitBridge.withConflicts = function(repo, handler) {
      var conflicts, errMessage, exitHandler, proc, stderrHandler, stdoutHandler;
      if (!this._checkHealth(handler)) {
        return;
      }
      conflicts = [];
      errMessage = [];
      stdoutHandler = (function(_this) {
        return function(chunk) {
          return _this._statusCodesFrom(chunk, function(index, work, p) {
            if (index === 'U' && work === 'U') {
              conflicts.push({
                path: p,
                message: 'both modified'
              });
            }
            if (index === 'A' && work === 'A') {
              return conflicts.push({
                path: p,
                message: 'both added'
              });
            }
          });
        };
      })(this);
      stderrHandler = function(line) {
        return errMessage.push(line);
      };
      exitHandler = function(code) {
        if (code === 0) {
          return handler(null, conflicts);
        } else {
          return handler(new Error(("abnormal git exit: " + code + "\n") + errMessage.join("\n")), null);
        }
      };
      proc = this.process({
        command: GitCmd,
        args: ['status', '--porcelain'],
        options: {
          cwd: repo.getWorkingDirectory()
        },
        stdout: stdoutHandler,
        stderr: stderrHandler,
        exit: exitHandler
      });
      return proc.process.on('error', function(err) {
        return handler(new GitNotFoundError(errMessage.join("\n")), null);
      });
    };

    GitBridge.isStaged = function(repo, filepath, handler) {
      var exitHandler, proc, staged, stderrHandler, stdoutHandler;
      if (!this._checkHealth(handler)) {
        return;
      }
      staged = true;
      stdoutHandler = (function(_this) {
        return function(chunk) {
          return _this._statusCodesFrom(chunk, function(index, work, p) {
            if (p === filepath) {
              return staged = index === 'M' && work === ' ';
            }
          });
        };
      })(this);
      stderrHandler = function(chunk) {
        return console.log("git status error: " + chunk);
      };
      exitHandler = function(code) {
        if (code === 0) {
          return handler(null, staged);
        } else {
          return handler(new Error("git status exit: " + code), null);
        }
      };
      proc = this.process({
        command: GitCmd,
        args: ['status', '--porcelain', filepath],
        options: {
          cwd: repo.getWorkingDirectory()
        },
        stdout: stdoutHandler,
        stderr: stderrHandler,
        exit: exitHandler
      });
      return proc.process.on('error', function(err) {
        return handler(new GitNotFoundError, null);
      });
    };

    GitBridge.checkoutSide = function(repo, sideName, filepath, callback) {
      var proc;
      if (!this._checkHealth(callback)) {
        return;
      }
      proc = this.process({
        command: GitCmd,
        args: ['checkout', "--" + sideName, filepath],
        options: {
          cwd: repo.getWorkingDirectory()
        },
        stdout: function(line) {
          return console.log(line);
        },
        stderr: function(line) {
          return console.log(line);
        },
        exit: function(code) {
          if (code === 0) {
            return callback(null);
          } else {
            return callback(new Error("git checkout exit: " + code));
          }
        }
      });
      return proc.process.on('error', function(err) {
        return callback(new GitNotFoundError);
      });
    };

    GitBridge.add = function(repo, filepath, callback) {
      repo.repo.add(filepath);
      return callback(null);
    };

    GitBridge.isRebasing = function() {
      var irebaseDir, irebaseStat, rebaseDir, rebaseStat, root;
      if (!this._checkHealth(function(e) {
        return atom.notifications.addError(e.message);
      })) {
        return;
      }
      root = this._repoGitDir();
      if (root == null) {
        return false;
      }
      rebaseDir = path.join(root, 'rebase-apply');
      rebaseStat = fs.statSyncNoException(rebaseDir);
      if (rebaseStat && rebaseStat.isDirectory()) {
        return true;
      }
      irebaseDir = path.join(root, 'rebase-merge');
      irebaseStat = fs.statSyncNoException(irebaseDir);
      return irebaseStat && irebaseStat.isDirectory();
    };

    return GitBridge;

  })();

  module.exports = {
    GitBridge: GitBridge,
    GitNotFoundError: GitNotFoundError
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvbGliL2dpdC1icmlkZ2UuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJTTtBQUVKLHVDQUFBLENBQUE7O0FBQWEsSUFBQSwwQkFBQyxPQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsa0JBQVIsQ0FBQTtBQUFBLE1BQ0Esa0RBQU0sT0FBTixDQURBLENBRFc7SUFBQSxDQUFiOzs0QkFBQTs7S0FGNkIsTUFKL0IsQ0FBQTs7QUFBQSxFQVdBLE1BQUEsR0FBUyxJQVhULENBQUE7O0FBQUEsRUFjTTtBQUdKLElBQUEsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsR0FBQTthQUFjLElBQUEsZUFBQSxDQUFnQixJQUFoQixFQUFkO0lBQUEsQ0FBVixDQUFBOztBQUVhLElBQUEsbUJBQUEsR0FBQSxDQUZiOztBQUFBLElBSUEsU0FBQyxDQUFBLFlBQUQsR0FBZSxTQUFDLFFBQUQsR0FBQTtBQUViLFVBQUEsK0NBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLENBQWYsQ0FBQTtBQUNBLE1BQUEsSUFBRyxZQUFIO0FBQ0UsUUFBQSxNQUFBLEdBQVMsWUFBVCxDQUFBO0FBQUEsUUFDQSxRQUFBLENBQVMsSUFBVCxDQURBLENBQUE7QUFFQSxjQUFBLENBSEY7T0FEQTtBQUFBLE1BTUEsTUFBQSxHQUFTLENBQ1AsS0FETyxFQUVQLG9CQUZPLEVBR1AsaUNBSE8sRUFJUCwyQ0FKTyxDQU5ULENBQUE7QUFBQSxNQWFBLFlBQUEsR0FBZSxNQUFNLENBQUMsS0FBUCxDQUFBLENBYmYsQ0FBQTtBQUFBLE1BZUEsV0FBQSxHQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUNaLFVBQUEsSUFBRyxJQUFBLEtBQVEsQ0FBWDtBQUNFLFlBQUEsTUFBQSxHQUFTLFlBQVQsQ0FBQTtBQUFBLFlBQ0EsUUFBQSxDQUFTLElBQVQsQ0FEQSxDQUFBO0FBRUEsa0JBQUEsQ0FIRjtXQUFBO2lCQUtBLFlBQUEsQ0FBQSxFQU5ZO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FmZCxDQUFBO0FBQUEsTUF1QkEsWUFBQSxHQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUNiLFVBQUEsSUFBRyxTQUFIO0FBQ0UsWUFBQSxDQUFDLENBQUMsTUFBRixDQUFBLENBQUEsQ0FBQTtBQUFBLFlBR0EsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFSLEdBQWUsV0FIZixDQURGO1dBQUE7QUFBQSxVQU1BLFlBQUEsR0FBZSxNQUFNLENBQUMsS0FBUCxDQUFBLENBTmYsQ0FBQTtBQVFBLFVBQUEsSUFBTyxvQkFBUDtBQUNFLFlBQUEsUUFBQSxDQUFhLElBQUEsZ0JBQUEsQ0FBaUIsMkRBQWpCLEVBQ1gsa0NBRFcsQ0FBYixDQUFBLENBQUE7QUFFQSxrQkFBQSxDQUhGO1dBUkE7aUJBYUEsS0FBQyxDQUFBLE9BQUQsQ0FBUztBQUFBLFlBQ1AsT0FBQSxFQUFTLFlBREY7QUFBQSxZQUVQLElBQUEsRUFBTSxDQUFDLFdBQUQsQ0FGQztBQUFBLFlBR1AsSUFBQSxFQUFNLFdBSEM7V0FBVCxDQUlFLENBQUMsZ0JBSkgsQ0FJb0IsWUFKcEIsRUFkYTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBdkJmLENBQUE7YUEyQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUztBQUFBLFFBQ1AsT0FBQSxFQUFTLFlBREY7QUFBQSxRQUVQLElBQUEsRUFBTSxDQUFDLFdBQUQsQ0FGQztBQUFBLFFBR1AsSUFBQSxFQUFNLFdBSEM7T0FBVCxDQUlFLENBQUMsZ0JBSkgsQ0FJb0IsWUFKcEIsRUE3Q2E7SUFBQSxDQUpmLENBQUE7O0FBQUEsSUF1REEsU0FBQyxDQUFBLGNBQUQsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxJQUFBOzRHQUFrQyxDQUFFLDRCQURyQjtJQUFBLENBdkRqQixDQUFBOztBQUFBLElBMERBLFNBQUMsQ0FBQSxhQUFELEdBQWdCLFNBQUMsUUFBRCxHQUFBO0FBQ2QsVUFBQSwyQkFBQTtBQUFBLE1BQUMsVUFBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsUUFBQSxJQUFZLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBeEMsSUFBWixDQUFBO0FBQ0EsTUFBQSxJQUFHLGVBQUg7QUFDRSxRQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF1QixDQUFDLE9BQXhCLENBQWdDLE9BQWhDLENBQWYsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUFBLENBQStCLENBQUEsWUFBQSxDQUR0QyxDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUFBLENBQStCLENBQUEsQ0FBQSxDQUF0QyxDQUpGO09BREE7QUFNQSxhQUFPLElBQVAsQ0FQYztJQUFBLENBMURoQixDQUFBOztBQUFBLElBbUVBLFNBQUMsQ0FBQSxZQUFELEdBQWUsU0FBQyxRQUFELEdBQUE7YUFBYyxJQUFDLENBQUEsYUFBRCxDQUFlLFFBQWYsQ0FBd0IsQ0FBQyxtQkFBekIsQ0FBQSxFQUFkO0lBQUEsQ0FuRWYsQ0FBQTs7QUFBQSxJQXFFQSxTQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsUUFBRCxHQUFBO2FBQWMsSUFBQyxDQUFBLGFBQUQsQ0FBZSxRQUFmLENBQXdCLENBQUMsT0FBekIsQ0FBQSxFQUFkO0lBQUEsQ0FyRWQsQ0FBQTs7QUFBQSxJQXVFQSxTQUFDLENBQUEsZ0JBQUQsR0FBbUIsU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO0FBQ2pCLFVBQUEsNkRBQUE7QUFBQTtBQUFBO1dBQUEsMkNBQUE7d0JBQUE7QUFDRSxRQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLGVBQVgsQ0FBSixDQUFBO0FBQ0EsUUFBQSxJQUFHLENBQUg7QUFDRSxVQUFDLFNBQUQsRUFBSyxnQkFBTCxFQUFnQixlQUFoQixFQUEwQixRQUExQixDQUFBO0FBQUEsd0JBQ0EsT0FBQSxDQUFRLFNBQVIsRUFBbUIsUUFBbkIsRUFBNkIsQ0FBN0IsRUFEQSxDQURGO1NBQUEsTUFBQTtnQ0FBQTtTQUZGO0FBQUE7c0JBRGlCO0lBQUEsQ0F2RW5CLENBQUE7O0FBQUEsSUE4RUEsU0FBQyxDQUFBLFlBQUQsR0FBZSxTQUFDLFFBQUQsR0FBQTtBQUNiLE1BQUEsSUFBQSxDQUFBLE1BQUE7QUFDRSxRQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsNkNBQWQsQ0FBQSxDQUFBO0FBQUEsUUFDQSxRQUFBLENBQWEsSUFBQSxLQUFBLENBQU0sZ0RBQU4sQ0FBYixDQURBLENBQUE7QUFFQSxlQUFPLEtBQVAsQ0FIRjtPQUFBO0FBS0EsYUFBTyxJQUFQLENBTmE7SUFBQSxDQTlFZixDQUFBOztBQUFBLElBc0ZBLFNBQUMsQ0FBQSxhQUFELEdBQWdCLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtBQUNkLFVBQUEsc0VBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsWUFBRCxDQUFjLE9BQWQsQ0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksRUFGWixDQUFBO0FBQUEsTUFHQSxVQUFBLEdBQWEsRUFIYixDQUFBO0FBQUEsTUFLQSxhQUFBLEdBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFDZCxLQUFDLENBQUEsZ0JBQUQsQ0FBa0IsS0FBbEIsRUFBeUIsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLENBQWQsR0FBQTtBQUN2QixZQUFBLElBQUcsS0FBQSxLQUFTLEdBQVQsSUFBaUIsSUFBQSxLQUFRLEdBQTVCO0FBQ0UsY0FBQSxTQUFTLENBQUMsSUFBVixDQUFlO0FBQUEsZ0JBQUEsSUFBQSxFQUFNLENBQU47QUFBQSxnQkFBUyxPQUFBLEVBQVMsZUFBbEI7ZUFBZixDQUFBLENBREY7YUFBQTtBQUdBLFlBQUEsSUFBRyxLQUFBLEtBQVMsR0FBVCxJQUFpQixJQUFBLEtBQVEsR0FBNUI7cUJBQ0UsU0FBUyxDQUFDLElBQVYsQ0FBZTtBQUFBLGdCQUFBLElBQUEsRUFBTSxDQUFOO0FBQUEsZ0JBQVMsT0FBQSxFQUFTLFlBQWxCO2VBQWYsRUFERjthQUp1QjtVQUFBLENBQXpCLEVBRGM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxoQixDQUFBO0FBQUEsTUFhQSxhQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBO2VBQ2QsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsSUFBaEIsRUFEYztNQUFBLENBYmhCLENBQUE7QUFBQSxNQWdCQSxXQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixRQUFBLElBQUcsSUFBQSxLQUFRLENBQVg7aUJBQ0UsT0FBQSxDQUFRLElBQVIsRUFBYyxTQUFkLEVBREY7U0FBQSxNQUFBO2lCQUdFLE9BQUEsQ0FBWSxJQUFBLEtBQUEsQ0FBTSxDQUFDLHFCQUFBLEdBQXFCLElBQXJCLEdBQTBCLElBQTNCLENBQUEsR0FBaUMsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBdkMsQ0FBWixFQUEyRSxJQUEzRSxFQUhGO1NBRFk7TUFBQSxDQWhCZCxDQUFBO0FBQUEsTUFzQkEsSUFBQSxHQUFPLElBQUMsQ0FBQSxPQUFELENBQVM7QUFBQSxRQUNkLE9BQUEsRUFBUyxNQURLO0FBQUEsUUFFZCxJQUFBLEVBQU0sQ0FBQyxRQUFELEVBQVcsYUFBWCxDQUZRO0FBQUEsUUFHZCxPQUFBLEVBQVM7QUFBQSxVQUFFLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFQO1NBSEs7QUFBQSxRQUlkLE1BQUEsRUFBUSxhQUpNO0FBQUEsUUFLZCxNQUFBLEVBQVEsYUFMTTtBQUFBLFFBTWQsSUFBQSxFQUFNLFdBTlE7T0FBVCxDQXRCUCxDQUFBO2FBK0JBLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBYixDQUFnQixPQUFoQixFQUF5QixTQUFDLEdBQUQsR0FBQTtlQUN2QixPQUFBLENBQVksSUFBQSxnQkFBQSxDQUFpQixVQUFVLENBQUMsSUFBWCxDQUFnQixJQUFoQixDQUFqQixDQUFaLEVBQXFELElBQXJELEVBRHVCO01BQUEsQ0FBekIsRUFoQ2M7SUFBQSxDQXRGaEIsQ0FBQTs7QUFBQSxJQXlIQSxTQUFDLENBQUEsUUFBRCxHQUFXLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNULFVBQUEsdURBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsWUFBRCxDQUFjLE9BQWQsQ0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVMsSUFGVCxDQUFBO0FBQUEsTUFJQSxhQUFBLEdBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFDZCxLQUFDLENBQUEsZ0JBQUQsQ0FBa0IsS0FBbEIsRUFBeUIsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLENBQWQsR0FBQTtBQUN2QixZQUFBLElBQXlDLENBQUEsS0FBSyxRQUE5QztxQkFBQSxNQUFBLEdBQVMsS0FBQSxLQUFTLEdBQVQsSUFBaUIsSUFBQSxLQUFRLElBQWxDO2FBRHVCO1VBQUEsQ0FBekIsRUFEYztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmhCLENBQUE7QUFBQSxNQVFBLGFBQUEsR0FBZ0IsU0FBQyxLQUFELEdBQUE7ZUFDZCxPQUFPLENBQUMsR0FBUixDQUFhLG9CQUFBLEdBQW9CLEtBQWpDLEVBRGM7TUFBQSxDQVJoQixDQUFBO0FBQUEsTUFXQSxXQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixRQUFBLElBQUcsSUFBQSxLQUFRLENBQVg7aUJBQ0UsT0FBQSxDQUFRLElBQVIsRUFBYyxNQUFkLEVBREY7U0FBQSxNQUFBO2lCQUdFLE9BQUEsQ0FBWSxJQUFBLEtBQUEsQ0FBTyxtQkFBQSxHQUFtQixJQUExQixDQUFaLEVBQStDLElBQS9DLEVBSEY7U0FEWTtNQUFBLENBWGQsQ0FBQTtBQUFBLE1BaUJBLElBQUEsR0FBTyxJQUFDLENBQUEsT0FBRCxDQUFTO0FBQUEsUUFDZCxPQUFBLEVBQVMsTUFESztBQUFBLFFBRWQsSUFBQSxFQUFNLENBQUMsUUFBRCxFQUFXLGFBQVgsRUFBMEIsUUFBMUIsQ0FGUTtBQUFBLFFBR2QsT0FBQSxFQUFTO0FBQUEsVUFBRSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBUDtTQUhLO0FBQUEsUUFJZCxNQUFBLEVBQVEsYUFKTTtBQUFBLFFBS2QsTUFBQSxFQUFRLGFBTE07QUFBQSxRQU1kLElBQUEsRUFBTSxXQU5RO09BQVQsQ0FqQlAsQ0FBQTthQTBCQSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQWIsQ0FBZ0IsT0FBaEIsRUFBeUIsU0FBQyxHQUFELEdBQUE7ZUFDdkIsT0FBQSxDQUFRLEdBQUEsQ0FBQSxnQkFBUixFQUE4QixJQUE5QixFQUR1QjtNQUFBLENBQXpCLEVBM0JTO0lBQUEsQ0F6SFgsQ0FBQTs7QUFBQSxJQXVKQSxTQUFDLENBQUEsWUFBRCxHQUFlLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsUUFBakIsRUFBMkIsUUFBM0IsR0FBQTtBQUNiLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxZQUFELENBQWMsUUFBZCxDQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxJQUFDLENBQUEsT0FBRCxDQUFTO0FBQUEsUUFDZCxPQUFBLEVBQVMsTUFESztBQUFBLFFBRWQsSUFBQSxFQUFNLENBQUMsVUFBRCxFQUFjLElBQUEsR0FBSSxRQUFsQixFQUE4QixRQUE5QixDQUZRO0FBQUEsUUFHZCxPQUFBLEVBQVM7QUFBQSxVQUFFLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFQO1NBSEs7QUFBQSxRQUlkLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtpQkFBVSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVosRUFBVjtRQUFBLENBSk07QUFBQSxRQUtkLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtpQkFBVSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVosRUFBVjtRQUFBLENBTE07QUFBQSxRQU1kLElBQUEsRUFBTSxTQUFDLElBQUQsR0FBQTtBQUNKLFVBQUEsSUFBRyxJQUFBLEtBQVEsQ0FBWDttQkFDRSxRQUFBLENBQVMsSUFBVCxFQURGO1dBQUEsTUFBQTttQkFHRSxRQUFBLENBQWEsSUFBQSxLQUFBLENBQU8scUJBQUEsR0FBcUIsSUFBNUIsQ0FBYixFQUhGO1dBREk7UUFBQSxDQU5RO09BQVQsQ0FGUCxDQUFBO2FBZUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFiLENBQWdCLE9BQWhCLEVBQXlCLFNBQUMsR0FBRCxHQUFBO2VBQ3ZCLFFBQUEsQ0FBUyxHQUFBLENBQUEsZ0JBQVQsRUFEdUI7TUFBQSxDQUF6QixFQWhCYTtJQUFBLENBdkpmLENBQUE7O0FBQUEsSUEwS0EsU0FBQyxDQUFBLEdBQUQsR0FBTSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLFFBQWpCLEdBQUE7QUFDSixNQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBVixDQUFjLFFBQWQsQ0FBQSxDQUFBO2FBQ0EsUUFBQSxDQUFTLElBQVQsRUFGSTtJQUFBLENBMUtOLENBQUE7O0FBQUEsSUE4S0EsU0FBQyxDQUFBLFVBQUQsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLG9EQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLFlBQUQsQ0FBYyxTQUFDLENBQUQsR0FBQTtlQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLENBQUMsQ0FBQyxPQUE5QixFQUQwQjtNQUFBLENBQWQsQ0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFHQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUhQLENBQUE7QUFJQSxNQUFBLElBQW9CLFlBQXBCO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FKQTtBQUFBLE1BTUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixFQUFnQixjQUFoQixDQU5aLENBQUE7QUFBQSxNQU9BLFVBQUEsR0FBYSxFQUFFLENBQUMsbUJBQUgsQ0FBdUIsU0FBdkIsQ0FQYixDQUFBO0FBUUEsTUFBQSxJQUFlLFVBQUEsSUFBYyxVQUFVLENBQUMsV0FBWCxDQUFBLENBQTdCO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FSQTtBQUFBLE1BVUEsVUFBQSxHQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixFQUFnQixjQUFoQixDQVZiLENBQUE7QUFBQSxNQVdBLFdBQUEsR0FBYyxFQUFFLENBQUMsbUJBQUgsQ0FBdUIsVUFBdkIsQ0FYZCxDQUFBO2FBWUEsV0FBQSxJQUFlLFdBQVcsQ0FBQyxXQUFaLENBQUEsRUFiSjtJQUFBLENBOUtiLENBQUE7O3FCQUFBOztNQWpCRixDQUFBOztBQUFBLEVBOE1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxTQUFYO0FBQUEsSUFDQSxnQkFBQSxFQUFrQixnQkFEbEI7R0EvTUYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/lib/git-bridge.coffee
