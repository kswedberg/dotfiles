(function() {
  var CompositeDisposable, GitPull, GitPush, Path, cleanup, commit, destroyCommitEditor, dir, disposables, fs, getStagedFiles, getTemplate, git, notifier, prepFile, showFile, splitPane;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  splitPane = require('../splitPane');

  GitPush = require('./git-push');

  GitPull = require('./git-pull');

  disposables = new CompositeDisposable;

  dir = function(repo) {
    return (git.getSubmodule() || repo).getWorkingDirectory();
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      if (files.length >= 1) {
        return git.cmd(['status'], {
          cwd: repo.getWorkingDirectory()
        });
      } else {
        return Promise.reject("Nothing to commit.");
      }
    });
  };

  getTemplate = function(cwd) {
    return git.getConfig('commit.template', cwd).then(function(filePath) {
      if (filePath) {
        return fs.readFileSync(Path.get(filePath.trim())).toString().trim();
      } else {
        return '';
      }
    });
  };

  prepFile = function(status, filePath) {
    var cwd;
    cwd = Path.dirname(filePath);
    return git.getConfig('core.commentchar', cwd).then(function(commentchar) {
      commentchar = commentchar ? commentchar.trim() : '#';
      status = status.replace(/\s*\(.*\)\n/g, "\n");
      status = status.trim().replace(/\n/g, "\n" + commentchar + " ");
      return getTemplate(cwd).then(function(template) {
        return fs.writeFileSync(filePath, "" + template + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status);
      });
    });
  };

  destroyCommitEditor = function() {
    var _ref;
    return (_ref = atom.workspace) != null ? _ref.getPanes().some(function(pane) {
      return pane.getItems().some(function(paneItem) {
        var _ref1;
        if (paneItem != null ? typeof paneItem.getURI === "function" ? (_ref1 = paneItem.getURI()) != null ? _ref1.includes('COMMIT_EDITMSG') : void 0 : void 0 : void 0) {
          if (pane.getItems().length === 1) {
            pane.destroy();
          } else {
            paneItem.destroy();
          }
          return true;
        }
      });
    }) : void 0;
  };

  commit = function(directory, filePath) {
    var args;
    args = ['commit', '--cleanup=strip', "--file=" + filePath];
    return git.cmd(args, {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor();
      return git.refresh();
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.alive) {
      currentPane.activate();
    }
    disposables.dispose();
    try {
      return fs.unlinkSync(filePath);
    } catch (_error) {}
  };

  showFile = function(filePath) {
    return atom.workspace.open(filePath, {
      searchAllPanes: true
    }).then(function(textEditor) {
      if (atom.config.get('git-plus.openInPane')) {
        return splitPane(atom.config.get('git-plus.splitPane'), textEditor);
      } else {
        return textEditor;
      }
    });
  };

  module.exports = function(repo, _arg) {
    var andPush, currentPane, filePath, init, stageChanges, startCommit, _ref;
    _ref = _arg != null ? _arg : {}, stageChanges = _ref.stageChanges, andPush = _ref.andPush;
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    currentPane = atom.workspace.getActivePane();
    init = function() {
      return getStagedFiles(repo).then(function(status) {
        return prepFile(status, filePath);
      });
    };
    startCommit = function() {
      return showFile(filePath).then(function(textEditor) {
        disposables.add(textEditor.onDidSave(function() {
          return commit(dir(repo), filePath).then(function() {
            if (andPush) {
              return GitPull(repo).then(function() {
                return GitPush(repo);
              });
            }
          });
        }));
        return disposables.add(textEditor.onDidDestroy(function() {
          return cleanup(currentPane, filePath);
        }));
      });
    };
    if (stageChanges) {
      return git.add(repo, {
        update: stageChanges
      }).then(function() {
        return init().then(function() {
          return startCommit();
        });
      });
    } else {
      return init().then(function() {
        return startCommit();
      })["catch"](function(message) {
        return notifier.addInfo(message);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jb21taXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtMQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUpOLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FMWCxDQUFBOztBQUFBLEVBTUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBTlosQ0FBQTs7QUFBQSxFQU9BLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQVBWLENBQUE7O0FBQUEsRUFRQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FSVixDQUFBOztBQUFBLEVBVUEsV0FBQSxHQUFjLEdBQUEsQ0FBQSxtQkFWZCxDQUFBOztBQUFBLEVBWUEsR0FBQSxHQUFNLFNBQUMsSUFBRCxHQUFBO1dBQ0osQ0FBQyxHQUFHLENBQUMsWUFBSixDQUFBLENBQUEsSUFBc0IsSUFBdkIsQ0FBNEIsQ0FBQyxtQkFBN0IsQ0FBQSxFQURJO0VBQUEsQ0FaTixDQUFBOztBQUFBLEVBZUEsY0FBQSxHQUFpQixTQUFDLElBQUQsR0FBQTtXQUNmLEdBQUcsQ0FBQyxXQUFKLENBQWdCLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQyxLQUFELEdBQUE7QUFDekIsTUFBQSxJQUFHLEtBQUssQ0FBQyxNQUFOLElBQWdCLENBQW5CO2VBQ0UsR0FBRyxD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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-commit.coffee
