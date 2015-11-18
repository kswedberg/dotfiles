(function() {
  var CompositeDisposable, InputView, Os, Path, TextEditorView, View, fs, git, prepFile, showCommitFilePath, showFile, showObject, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  showCommitFilePath = function(objectHash) {
    return Path.join(Os.tmpDir(), "" + objectHash + ".diff");
  };

  showObject = function(repo, objectHash, file) {
    var args;
    args = ['show', '--color=never', '--format=full'];
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    args.push(objectHash);
    if (file != null) {
      args.push('--', file);
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      if (data.length > 0) {
        return prepFile(data, objectHash);
      }
    });
  };

  prepFile = function(text, objectHash) {
    return fs.writeFile(showCommitFilePath(objectHash), text, {
      flag: 'w+'
    }, function(err) {
      if (err) {
        return notifier.addError(err);
      } else {
        return showFile(objectHash);
      }
    });
  };

  showFile = function(objectHash) {
    var disposables, split;
    disposables = new CompositeDisposable;
    split = atom.config.get('git-plus.openInPane') ? atom.config.get('git-plus.splitPane') : void 0;
    return atom.workspace.open(showCommitFilePath(objectHash), {
      split: split,
      activatePane: true
    }).then(function(textBuffer) {
      if (textBuffer != null) {
        return disposables.add(textBuffer.onDidDestroy(function() {
          disposables.dispose();
          try {
            return fs.unlinkSync(showCommitFilePath(objectHash));
          } catch (_error) {}
        }));
      }
    });
  };

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('objectHash', new TextEditorView({
            mini: true,
            placeholderText: 'Commit hash to show'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.objectHash.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            var name, text;
            text = _this.objectHash.getModel().getText().split(' ');
            name = text.length === 2 ? text[1] : text[0];
            showObject(_this.repo, text);
            return _this.destroy();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.disposables) != null) {
        _ref1.dispose();
      }
      return (_ref2 = this.panel) != null ? _ref2.destroy() : void 0;
    };

    return InputView;

  })(View);

  module.exports = function(repo, objectHash, file) {
    if (objectHash == null) {
      return new InputView(repo);
    } else {
      return showObject(repo, objectHash, file);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zaG93LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpSUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBSUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUpELENBQUE7O0FBQUEsRUFLQSxPQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxzQkFBQSxjQUFELEVBQWlCLFlBQUEsSUFMakIsQ0FBQTs7QUFBQSxFQU9BLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQVBOLENBQUE7O0FBQUEsRUFTQSxrQkFBQSxHQUFxQixTQUFDLFVBQUQsR0FBQTtXQUNuQixJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBVixFQUF1QixFQUFBLEdBQUcsVUFBSCxHQUFjLE9BQXJDLEVBRG1CO0VBQUEsQ0FUckIsQ0FBQTs7QUFBQSxFQVlBLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxVQUFQLEVBQW1CLElBQW5CLEdBQUE7QUFDWCxRQUFBLElBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxlQUFULEVBQTBCLGVBQTFCLENBQVAsQ0FBQTtBQUNBLElBQUEsSUFBMkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixDQUEzQjtBQUFBLE1BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxhQUFW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

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/git-plus/lib/models/git-show.coffee
