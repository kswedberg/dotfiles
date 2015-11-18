(function() {
  var CompositeDisposable, Path, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, dir, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile, splitPane,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  splitPane = require('../splitPane');

  disposables = new CompositeDisposable;

  prettifyStagedFiles = function(data) {
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

  prettyifyPreviousFile = function(data) {
    return {
      mode: data[0],
      path: data.substring(1)
    };
  };

  prettifyFileStatuses = function(files) {
    return files.map(function(_arg) {
      var mode, path;
      mode = _arg.mode, path = _arg.path;
      switch (mode) {
        case 'M':
          return "modified:   " + path;
        case 'A':
          return "new file:   " + path;
        case 'D':
          return "removed:   " + path;
        case 'R':
          return "renamed:   " + path;
      }
    });
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      var args;
      if (files.length >= 1) {
        args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          return prettifyStagedFiles(data);
        });
      } else {
        return Promise.reject("Nothing to commit.");
      }
    });
  };

  getGitStatus = function(repo) {
    return git.cmd(['status'], {
      cwd: repo.getWorkingDirectory()
    });
  };

  diffFiles = function(previousFiles, currentFiles) {
    var currentPaths;
    previousFiles = previousFiles.map(function(p) {
      return prettyifyPreviousFile(p);
    });
    currentPaths = currentFiles.map(function(_arg) {
      var path;
      path = _arg.path;
      return path;
    });
    return previousFiles.filter(function(p) {
      var _ref;
      return (_ref = p.path, __indexOf.call(currentPaths, _ref) >= 0) === false;
    });
  };

  parse = function(prevCommit) {
    var lines, message, prevChangedFiles;
    lines = prevCommit.split(/\n/).filter(function(line) {
      return line !== '';
    });
    message = [];
    prevChangedFiles = [];
    lines.forEach(function(line) {
      if (!/(([ MADRCU?!])\s(.*))/.test(line)) {
        return message.push(line);
      } else {
        return prevChangedFiles.push(line.replace(/[ MADRCU?!](\s)(\s)*/, line[0]));
      }
    });
    return [message.join('\n'), prevChangedFiles];
  };

  cleanupUnstagedText = function(status) {
    var text, unstagedFiles;
    unstagedFiles = status.indexOf("Changes not staged for commit:");
    if (unstagedFiles >= 0) {
      text = status.substring(unstagedFiles);
      return status = "" + (status.substring(0, unstagedFiles - 1)) + "\n" + (text.replace(/\s*\(.*\)\n/g, ""));
    } else {
      return status;
    }
  };

  prepFile = function(_arg) {
    var filePath, message, prevChangedFiles, status;
    message = _arg.message, prevChangedFiles = _arg.prevChangedFiles, status = _arg.status, filePath = _arg.filePath;
    return git.getConfig('core.commentchar', Path.dirname(filePath)).then(function(commentchar) {
      commentchar = commentchar.length > 0 ? commentchar.trim() : '#';
      status = cleanupUnstagedText(status);
      status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, "\n" + commentchar + " ").replace("committed:\n" + commentchar, "committed:\n" + (prevChangedFiles.map(function(f) {
        return "" + commentchar + "   " + f;
      }).join("\n")));
      return fs.writeFileSync(filePath, "" + message + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status);
    });
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

  dir = function(repo) {
    return (git.getSubmodule() || repo).getWorkingDirectory();
  };

  commit = function(directory, filePath) {
    var args;
    args = ['commit', '--amend', '--cleanup=strip', "--file=" + filePath];
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

  module.exports = function(repo) {
    var currentPane, cwd, filePath;
    currentPane = atom.workspace.getActivePane();
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    cwd = repo.getWorkingDirectory();
    return git.cmd(['whatchanged', '-1', '--name-status', '--format=%B'], {
      cwd: cwd
    }).then(function(amend) {
      return parse(amend);
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg[0], prevChangedFiles = _arg[1];
      return getStagedFiles(repo).then(function(files) {
        return [message, prettifyFileStatuses(diffFiles(prevChangedFiles, files))];
      });
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg[0], prevChangedFiles = _arg[1];
      return getGitStatus(repo).then(function(status) {
        return prepFile({
          message: message,
          prevChangedFiles: prevChangedFiles,
          status: status,
          filePath: filePath
        });
      }).then(function() {
        return showFile(filePath);
      });
    }).then(function(textEditor) {
      disposables.add(textEditor.onDidSave(function() {
        return commit(dir(repo), filePath);
      }));
      return disposables.add(textEditor.onDidDestroy(function() {
        return cleanup(currentPane, filePath);
      }));
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jb21taXQtYW1lbmQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBRQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUpYLENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FMWixDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLEdBQUEsQ0FBQSxtQkFQZCxDQUFBOztBQUFBLEVBU0EsbUJBQUEsR0FBc0IsU0FBQyxJQUFELEdBQUE7QUFDcEIsUUFBQSxPQUFBO0FBQUEsSUFBQSxJQUFhLElBQUEsS0FBUSxFQUFyQjtBQUFBLGFBQU8sRUFBUCxDQUFBO0tBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUIsYUFEeEIsQ0FBQTs7O0FBRUs7V0FBQSxzREFBQTt1QkFBQTtBQUNILHNCQUFBO0FBQUEsVUFBQyxNQUFBLElBQUQ7QUFBQSxVQUFPLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBbEI7VUFBQSxDQURHO0FBQUE7O1NBSGU7RUFBQSxDQVR0QixDQUFBOztBQUFBLEVBZUEscUJBQUEsR0FBd0IsU0FBQyxJQUFELEdBQUE7V0FDdEI7QUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-commit-amend.coffee
