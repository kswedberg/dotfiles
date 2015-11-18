(function() {
  var $, CompositeDisposable, ConflictedEditor, GitBridge, MergeConflictsView, MergeState, ResolverView, View, handleErr, path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  path = require('path');

  GitBridge = require('../git-bridge').GitBridge;

  MergeState = require('../merge-state').MergeState;

  ConflictedEditor = require('../conflicted-editor').ConflictedEditor;

  ResolverView = require('./resolver-view').ResolverView;

  handleErr = require('./error-view').handleErr;

  MergeConflictsView = (function(_super) {
    __extends(MergeConflictsView, _super);

    function MergeConflictsView() {
      return MergeConflictsView.__super__.constructor.apply(this, arguments);
    }

    MergeConflictsView.prototype.instance = null;

    MergeConflictsView.content = function(state, pkg) {
      return this.div({
        "class": 'merge-conflicts tool-panel panel-bottom padded clearfix'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            _this.text('Conflicts');
            _this.span({
              "class": 'pull-right icon icon-fold',
              click: 'minimize'
            }, 'Hide');
            return _this.span({
              "class": 'pull-right icon icon-unfold',
              click: 'restore'
            }, 'Show');
          });
          return _this.div({
            outlet: 'body'
          }, function() {
            _this.div({
              "class": 'conflict-list'
            }, function() {
              return _this.ul({
                "class": 'block list-group',
                outlet: 'pathList'
              }, function() {
                var message, p, _i, _len, _ref1, _ref2, _results;
                _ref1 = state.conflicts;
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  _ref2 = _ref1[_i], p = _ref2.path, message = _ref2.message;
                  _results.push(_this.li({
                    click: 'navigate',
                    "data-path": p,
                    "class": 'list-item navigate'
                  }, function() {
                    _this.span({
                      "class": 'inline-block icon icon-diff-modified status-modified path'
                    }, p);
                    return _this.div({
                      "class": 'pull-right'
                    }, function() {
                      _this.button({
                        click: 'stageFile',
                        "class": 'btn btn-xs btn-success inline-block-tight stage-ready',
                        style: 'display: none'
                      }, 'Stage');
                      _this.span({
                        "class": 'inline-block text-subtle'
                      }, message);
                      _this.progress({
                        "class": 'inline-block',
                        max: 100,
                        value: 0
                      });
                      return _this.span({
                        "class": 'inline-block icon icon-dash staged'
                      });
                    });
                  }));
                }
                return _results;
              });
            });
            return _this.div({
              "class": 'footer block pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-sm',
                click: 'quit'
              }, 'Quit');
            });
          });
        };
      })(this));
    };

    MergeConflictsView.prototype.initialize = function(state, pkg) {
      this.state = state;
      this.pkg = pkg;
      this.subs = new CompositeDisposable;
      this.subs.add(this.pkg.onDidResolveConflict((function(_this) {
        return function(event) {
          var found, li, listElement, p, progress, _i, _len, _ref1;
          p = _this.state.repo.relativize(event.file);
          found = false;
          _ref1 = _this.pathList.children();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            listElement = _ref1[_i];
            li = $(listElement);
            if (li.data('path') === p) {
              found = true;
              progress = li.find('progress')[0];
              progress.max = event.total;
              progress.value = event.resolved;
              if (event.total === event.resolved) {
                li.find('.stage-ready').show();
              }
            }
          }
          if (!found) {
            return console.error("Unrecognized conflict path: " + p);
          }
        };
      })(this)));
      this.subs.add(this.pkg.onDidStageFile((function(_this) {
        return function() {
          return _this.refresh();
        };
      })(this)));
      return this.subs.add(atom.commands.add(this.element, {
        'merge-conflicts:entire-file-ours': this.sideResolver('ours'),
        'merge-conflicts:entire-file-theirs': this.sideResolver('theirs')
      }));
    };

    MergeConflictsView.prototype.navigate = function(event, element) {
      var fullPath, repoPath;
      repoPath = element.find(".path").text();
      fullPath = path.join(this.state.repo.getWorkingDirectory(), repoPath);
      return atom.workspace.open(fullPath);
    };

    MergeConflictsView.prototype.minimize = function() {
      this.addClass('minimized');
      return this.body.hide('fast');
    };

    MergeConflictsView.prototype.restore = function() {
      this.removeClass('minimized');
      return this.body.show('fast');
    };

    MergeConflictsView.prototype.quit = function() {
      var detail;
      this.pkg.didQuitConflictResolution();
      detail = "Careful, you've still got conflict markers left!\n";
      if (this.state.isRebase) {
        detail += '"git rebase --abort"';
      } else {
        detail += '"git merge --abort"';
      }
      detail += " if you just want to give up on this one.";
      return this.finish(function() {
        return atom.notifications.addWarning("Maybe Later", {
          detail: detail,
          dismissable: true
        });
      });
    };

    MergeConflictsView.prototype.refresh = function() {
      return this.state.reread((function(_this) {
        return function(err, state) {
          var detail, icon, item, p, _i, _len, _ref1;
          if (handleErr(err)) {
            return;
          }
          _ref1 = _this.pathList.find('li');
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            p = $(item).data('path');
            icon = $(item).find('.staged');
            icon.removeClass('icon-dash icon-check text-success');
            if (_.contains(_this.state.conflictPaths(), p)) {
              icon.addClass('icon-dash');
            } else {
              icon.addClass('icon-check text-success');
              _this.pathList.find("li[data-path='" + p + "'] .stage-ready").hide();
            }
          }
          if (_this.state.isEmpty()) {
            _this.pkg.didCompleteConflictResolution();
            detail = "That's everything. ";
            if (_this.state.isRebase) {
              detail += '"git rebase --continue" at will to resume rebasing.';
            } else {
              detail += '"git commit" at will to finish the merge.';
            }
            return _this.finish(function() {
              return atom.notifications.addSuccess("Merge Complete", {
                detail: detail,
                dismissable: true
              });
            });
          }
        };
      })(this));
    };

    MergeConflictsView.prototype.finish = function(andThen) {
      this.subs.dispose();
      this.hide('fast', (function(_this) {
        return function() {
          MergeConflictsView.instance = null;
          return _this.remove();
        };
      })(this));
      return andThen();
    };

    MergeConflictsView.prototype.sideResolver = function(side) {
      return (function(_this) {
        return function(event) {
          var p;
          p = $(event.target).closest('li').data('path');
          return GitBridge.checkoutSide(_this.state.repo, side, p, function(err) {
            var full;
            if (handleErr(err)) {
              return;
            }
            full = path.join(_this.state.repo.getWorkingDirectory(), p);
            _this.pkg.didResolveConflict({
              file: full,
              total: 1,
              resolved: 1
            });
            return atom.workspace.open(p);
          });
        };
      })(this);
    };

    MergeConflictsView.prototype.stageFile = function(event, element) {
      var e, filePath, repoPath, _i, _len, _ref1;
      repoPath = element.closest('li').data('path');
      filePath = path.join(GitBridge.getActiveRepo().getWorkingDirectory(), repoPath);
      _ref1 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        e = _ref1[_i];
        if (e.getPath() === filePath) {
          e.save();
        }
      }
      return GitBridge.add(this.state.repo, repoPath, (function(_this) {
        return function(err) {
          if (handleErr(err)) {
            return;
          }
          return _this.pkg.didStageFile({
            file: filePath
          });
        };
      })(this));
    };

    MergeConflictsView.detect = function(pkg) {
      var repo;
      if (this.instance != null) {
        return;
      }
      repo = GitBridge.getActiveRepo();
      if (repo == null) {
        atom.notifications.addWarning("No git repository found", {
          detail: "Tip: if you have multiple projects open, open an editor in the one containing conflicts."
        });
        return;
      }
      return MergeState.read(repo, (function(_this) {
        return function(err, state) {
          var view;
          if (handleErr(err)) {
            return;
          }
          if (!state.isEmpty()) {
            view = new MergeConflictsView(state, pkg);
            _this.instance = view;
            atom.workspace.addBottomPanel({
              item: view
            });
            return _this.instance.subs.add(atom.workspace.observeTextEditors(function(editor) {
              return _this.markConflictsIn(state, editor, pkg);
            }));
          } else {
            return atom.notifications.addInfo("Nothing to Merge", {
              detail: "No conflicts here!",
              dismissable: true
            });
          }
        };
      })(this));
    };

    MergeConflictsView.markConflictsIn = function(state, editor, pkg) {
      var e, fullPath, repoPath;
      if (state.isEmpty()) {
        return;
      }
      fullPath = editor.getPath();
      repoPath = state.repo.relativize(fullPath);
      if (repoPath == null) {
        return;
      }
      if (!_.contains(state.conflictPaths(), repoPath)) {
        return;
      }
      e = new ConflictedEditor(state, pkg, editor);
      return e.mark();
    };

    return MergeConflictsView;

  })(View);

  module.exports = {
    MergeConflictsView: MergeConflictsView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvbGliL3ZpZXcvbWVyZ2UtY29uZmxpY3RzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBS0MsWUFBYSxPQUFBLENBQVEsZUFBUixFQUFiLFNBTEQsQ0FBQTs7QUFBQSxFQU1DLGFBQWMsT0FBQSxDQUFRLGdCQUFSLEVBQWQsVUFORCxDQUFBOztBQUFBLEVBT0MsbUJBQW9CLE9BQUEsQ0FBUSxzQkFBUixFQUFwQixnQkFQRCxDQUFBOztBQUFBLEVBU0MsZUFBZ0IsT0FBQSxDQUFRLGlCQUFSLEVBQWhCLFlBVEQsQ0FBQTs7QUFBQSxFQVVDLFlBQWEsT0FBQSxDQUFRLGNBQVIsRUFBYixTQVZELENBQUE7O0FBQUEsRUFZTTtBQUVKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxpQ0FBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUFBLElBRUEsa0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxLQUFELEVBQVEsR0FBUixHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHlEQUFQO09BQUwsRUFBdUUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtB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

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/lib/view/merge-conflicts-view.coffee
