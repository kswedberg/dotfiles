(function() {
  var CompositeDisposable, GitBridge, ResolverView, View, handleErr,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('space-pen').View;

  GitBridge = require('../git-bridge').GitBridge;

  handleErr = require('./error-view').handleErr;

  ResolverView = (function(_super) {
    __extends(ResolverView, _super);

    function ResolverView() {
      return ResolverView.__super__.constructor.apply(this, arguments);
    }

    ResolverView.content = function(editor, state, pkg) {
      return this.div({
        "class": 'overlay from-top resolver'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block text-highlight'
          }, "We're done here");
          _this.div({
            "class": 'block'
          }, function() {
            _this.div({
              "class": 'block text-info'
            }, function() {
              return _this.text("You've dealt with all of the conflicts in this file.");
            });
            return _this.div({
              "class": 'block text-info'
            }, function() {
              _this.span({
                outlet: 'actionText'
              }, 'Save and stage');
              return _this.text(' this file for commit?');
            });
          });
          _this.div({
            "class": 'pull-left'
          }, function() {
            return _this.button({
              "class": 'btn btn-primary',
              click: 'dismiss'
            }, 'Maybe Later');
          });
          return _this.div({
            "class": 'pull-right'
          }, function() {
            return _this.button({
              "class": 'btn btn-primary',
              click: 'resolve'
            }, 'Stage');
          });
        };
      })(this));
    };

    ResolverView.prototype.initialize = function(editor, state, pkg) {
      this.editor = editor;
      this.state = state;
      this.pkg = pkg;
      this.subs = new CompositeDisposable();
      this.refresh();
      this.subs.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)));
      return this.subs.add(atom.commands.add(this.element, 'merge-conflicts:quit', (function(_this) {
        return function() {
          return _this.dismiss();
        };
      })(this)));
    };

    ResolverView.prototype.detached = function() {
      return this.subs.dispose();
    };

    ResolverView.prototype.getModel = function() {
      return null;
    };

    ResolverView.prototype.relativePath = function() {
      return this.state.repo.relativize(this.editor.getURI());
    };

    ResolverView.prototype.refresh = function() {
      return GitBridge.isStaged(this.state.repo, this.relativePath(), (function(_this) {
        return function(err, staged) {
          var modified, needsSaved, needsStaged;
          if (handleErr(err)) {
            return;
          }
          modified = _this.editor.isModified();
          needsSaved = modified;
          needsStaged = modified || !staged;
          if (!(needsSaved || needsStaged)) {
            _this.hide('fast', function() {
              return this.remove();
            });
            _this.pkg.didStageFile({
              file: _this.editor.getURI()
            });
            return;
          }
          if (needsSaved) {
            return _this.actionText.text('Save and stage');
          } else if (needsStaged) {
            return _this.actionText.text('Stage');
          }
        };
      })(this));
    };

    ResolverView.prototype.resolve = function() {
      this.editor.save();
      return GitBridge.add(this.state.repo, this.relativePath(), (function(_this) {
        return function(err) {
          if (handleErr(err)) {
            return;
          }
          return _this.refresh();
        };
      })(this));
    };

    ResolverView.prototype.dismiss = function() {
      return this.hide('fast', (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this));
    };

    return ResolverView;

  })(View);

  module.exports = {
    ResolverView: ResolverView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvbGliL3ZpZXcvcmVzb2x2ZXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkRBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsV0FBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUdDLFlBQWEsT0FBQSxDQUFRLGVBQVIsRUFBYixTQUhELENBQUE7O0FBQUEsRUFLQyxZQUFhLE9BQUEsQ0FBUSxjQUFSLEVBQWIsU0FMRCxDQUFBOztBQUFBLEVBUU07QUFFSixtQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsR0FBaEIsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTywyQkFBUDtPQUFMLEVBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkMsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sc0JBQVA7V0FBTCxFQUFvQyxpQkFBcEMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxpQkFBUDthQUFMLEVBQStCLFNBQUEsR0FBQTtxQkFDN0IsS0FBQyxDQUFBLElBQUQsQ0FBTSxzREFBTixFQUQ2QjtZQUFBLENBQS9CLENBQUEs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

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/lib/view/resolver-view.coffee
