(function() {
  var CompositeDisposable, GitCommit, GitPush, Path, fs, git, notifier, os;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  os = require('os');

  git = require('../git');

  notifier = require('../notifier');

  GitPush = require('./git-push');

  module.exports = GitCommit = (function() {
    GitCommit.prototype.dir = function() {
      if (this.submodule != null ? this.submodule : this.submodule = git.getSubmodule()) {
        return this.submodule.getWorkingDirectory();
      } else {
        return this.repo.getWorkingDirectory();
      }
    };

    GitCommit.prototype.filePath = function() {
      return Path.join(this.repo.getPath(), 'COMMIT_EDITMSG');
    };

    function GitCommit(repo, _arg) {
      var _ref;
      this.repo = repo;
      _ref = _arg != null ? _arg : {}, this.amend = _ref.amend, this.andPush = _ref.andPush, this.stageChanges = _ref.stageChanges;
      this.currentPane = atom.workspace.getActivePane();
      this.disposables = new CompositeDisposable;
      if (this.amend == null) {
        this.amend = '';
      }
      this.isAmending = this.amend.length > 0;
      this.commentchar = '#';
      git.cmd({
        args: ['config', '--get', 'core.commentchar'],
        stdout: (function(_this) {
          return function(data) {
            if (data.trim() !== '') {
              return _this.commentchar = data.trim();
            }
          };
        })(this)
      });
      if (this.stageChanges) {
        git.add(this.repo, {
          update: true,
          exit: (function(_this) {
            return function(code) {
              return _this.getStagedFiles();
            };
          })(this)
        });
      } else {
        this.getStagedFiles();
      }
    }

    GitCommit.prototype.getStagedFiles = function() {
      return git.stagedFiles(this.repo, (function(_this) {
        return function(files) {
          if (_this.amend !== '' || files.length >= 1) {
            return git.cmd({
              args: ['status'],
              cwd: _this.repo.getWorkingDirectory(),
              stdout: function(data) {
                return _this.prepFile(data);
              }
            });
          } else {
            _this.cleanup();
            return notifier.addInfo('Nothing to commit.');
          }
        };
      })(this));
    };

    GitCommit.prototype.prepFile = function(status) {
      status = status.replace(/\s*\(.*\)\n/g, "\n");
      status = status.trim().replace(/\n/g, "\n" + this.commentchar + " ");
      return this.getTemplate().then((function(_this) {
        return function(template) {
          fs.writeFileSync(_this.filePath(), "" + (_this.amend.length > 0 ? _this.amend : template) + "\n" + _this.commentchar + " Please enter the commit message for your changes. Lines starting\n" + _this.commentchar + " with '" + _this.commentchar + "' will be ignored, and an empty message aborts the commit.\n" + _this.commentchar + "\n" + _this.commentchar + " " + status);
          return _this.showFile();
        };
      })(this));
    };

    GitCommit.prototype.getTemplate = function() {
      return new Promise(function(resolve, reject) {
        return git.cmd({
          args: ['config', '--get', 'commit.template'],
          stdout: (function(_this) {
            return function(data) {
              return resolve((data.trim() !== '' ? fs.readFileSync(Path.get(data.trim())) : ''));
            };
          })(this)
        });
      });
    };

    GitCommit.prototype.showFile = function() {
      return atom.workspace.open(this.filePath(), {
        searchAllPanes: true
      }).done((function(_this) {
        return function(textEditor) {
          if (atom.config.get('git-plus.openInPane')) {
            return _this.splitPane(atom.config.get('git-plus.splitPane'), textEditor);
          } else {
            _this.disposables.add(textEditor.onDidSave(function() {
              return _this.commit();
            }));
            return _this.disposables.add(textEditor.onDidDestroy(function() {
              if (_this.isAmending) {
                return _this.undoAmend();
              } else {
                return _this.cleanup();
              }
            }));
          }
        };
      })(this));
    };

    GitCommit.prototype.splitPane = function(splitDir, oldEditor) {
      var directions, hookEvents, options, pane;
      pane = atom.workspace.paneForURI(this.filePath());
      options = {
        copyActiveItem: true
      };
      hookEvents = (function(_this) {
        return function(textEditor) {
          oldEditor.destroy();
          _this.disposables.add(textEditor.onDidSave(function() {
            return _this.commit();
          }));
          return _this.disposables.add(textEditor.onDidDestroy(function() {
            if (_this.isAmending) {
              return _this.undoAmend();
            } else {
              return _this.cleanup();
            }
          }));
        };
      })(this);
      directions = {
        left: (function(_this) {
          return function() {
            pane = pane.splitLeft(options);
            return hookEvents(pane.getActiveEditor());
          };
        })(this),
        right: function() {
          pane = pane.splitRight(options);
          return hookEvents(pane.getActiveEditor());
        },
        up: function() {
          pane = pane.splitUp(options);
          return hookEvents(pane.getActiveEditor());
        },
        down: function() {
          pane = pane.splitDown(options);
          return hookEvents(pane.getActiveEditor());
        }
      };
      return directions[splitDir]();
    };

    GitCommit.prototype.commit = function() {
      var args;
      args = ['commit', '--cleanup=strip', "--file=" + (this.filePath())];
      return git.cmd({
        args: args,
        options: {
          cwd: this.dir()
        },
        stdout: (function(_this) {
          return function(data) {
            notifier.addSuccess(data);
            if (_this.andPush) {
              new GitPush(_this.repo);
            }
            _this.isAmending = false;
            _this.destroyCommitEditor();
            if (_this.currentPane.alive) {
              _this.currentPane.activate();
            }
            return git.refresh();
          };
        })(this),
        stderr: (function(_this) {
          return function(err) {
            return _this.destroyCommitEditor();
          };
        })(this)
      });
    };

    GitCommit.prototype.destroyCommitEditor = function() {
      this.cleanup();
      return atom.workspace.getPanes().some(function(pane) {
        return pane.getItems().some(function(paneItem) {
          var _ref;
          if (paneItem != null ? typeof paneItem.getURI === "function" ? (_ref = paneItem.getURI()) != null ? _ref.includes('COMMIT_EDITMSG') : void 0 : void 0 : void 0) {
            if (pane.getItems().length === 1) {
              pane.destroy();
            } else {
              paneItem.destroy();
            }
            return true;
          }
        });
      });
    };

    GitCommit.prototype.undoAmend = function(err) {
      if (err == null) {
        err = '';
      }
      return git.cmd({
        args: ['reset', 'ORIG_HEAD'],
        stdout: function() {
          return notifier.addError("" + err + ": Commit amend aborted!");
        },
        stderr: function() {
          return notifier.addError('ERROR! Undoing the amend failed! Please fix your repository manually!');
        },
        exit: (function(_this) {
          return function() {
            _this.isAmending = false;
            return _this.destroyCommitEditor();
          };
        })(this)
      });
    };

    GitCommit.prototype.cleanup = function() {
      if (this.currentPane.alive) {
        this.currentPane.activate();
      }
      this.disposables.dispose();
      try {
        return fs.unlinkSync(this.filePath());
      } catch (_error) {}
    };

    return GitCommit;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jb21taXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9FQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsRUFLQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FMTixDQUFBOztBQUFBLEVBTUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBTlgsQ0FBQTs7QUFBQSxFQU9BLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQVBWLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBSUosd0JBQUEsR0FBQSxHQUFLLFNBQUEsR0FBQTtBQUVILE1BQUEsNkJBQUcsSUFBQyxDQUFBLFlBQUQsSUFBQyxDQUFBLFlBQWEsR0FBRyxDQUFDLFlBQUosQ0FBQSxDQUFqQjtlQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsbUJBQVgsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxFQUhGO09BRkc7SUFBQSxDQUFMLENBQUE7O0FBQUEsd0JBVUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsQ0FBVixFQUEyQixnQkFBM0IsRUFBSDtJQUFBLENBVlYsQ0FBQTs7QUFZ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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-commit.coffee
