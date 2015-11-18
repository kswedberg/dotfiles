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

  getTemplate = function() {
    return git.getConfig('commit.template').then(function(filePath) {
      if (filePath) {
        return fs.readFileSync(Path.get(filePath.trim())).toString().trim();
      } else {
        return '';
      }
    });
  };

  prepFile = function(status, filePath) {
    return git.getConfig('core.commentchar').then(function(commentchar) {
      commentchar = commentchar ? commentchar.trim() : '#';
      status = status.replace(/\s*\(.*\)\n/g, "\n");
      status = status.trim().replace(/\n/g, "\n" + commentchar + " ");
      return getTemplate().then(function(template) {
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
