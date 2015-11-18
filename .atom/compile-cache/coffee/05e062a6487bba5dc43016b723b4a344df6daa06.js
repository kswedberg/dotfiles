(function() {
  var $, $$, SelectListMultipleView, SelectStageHunks, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs-plus');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageHunks = (function(_super) {
    __extends(SelectStageHunks, _super);

    function SelectStageHunks() {
      return SelectStageHunks.__super__.constructor.apply(this, arguments);
    }

    SelectStageHunks.prototype.initialize = function(repo, data) {
      this.repo = repo;
      SelectStageHunks.__super__.initialize.apply(this, arguments);
      this.patch_header = data[0];
      if (data.length === 2) {
        return this.completed(this._generateObjects(data.slice(1)));
      }
      this.show();
      this.setItems(this._generateObjects(data.slice(1)));
      return this.focusFilterEditor();
    };

    SelectStageHunks.prototype.getFilterKey = function() {
      return 'pos';
    };

    SelectStageHunks.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-stage-button'
              }, 'Stage');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-stage-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageHunks.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageHunks.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageHunks.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    SelectStageHunks.prototype.viewForItem = function(item, matchedStr) {
      var viewItem;
      return viewItem = $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'inline-block highlight'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.pos);
              }
            });
            return _this.div({
              "class": 'text-warning gp-item-diff',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, item.diff);
          };
        })(this));
      });
    };

    SelectStageHunks.prototype.completed = function(items) {
      var patchPath, patch_full;
      this.cancel();
      if (items.length < 1) {
        return;
      }
      patch_full = this.patch_header;
      items.forEach(function(item) {
        return patch_full += (item != null ? item.patch : void 0);
      });
      patchPath = this.repo.getWorkingDirectory() + '/GITPLUS_PATCH';
      return fs.writeFile(patchPath, patch_full, {
        flag: 'w+'
      }, (function(_this) {
        return function(err) {
          if (!err) {
            return git.cmd(['apply', '--cached', '--', patchPath], {
              cwd: _this.repo.getWorkingDirectory()
            }).then(function(data) {
              data = (data != null) && data !== '' ? data : 'Hunk has been staged!';
              notifier.addSuccess(data);
              try {
                return fs.unlink(patchPath);
              } catch (_error) {}
            });
          } else {
            return notifier.addError(err);
          }
        };
      })(this));
    };

    SelectStageHunks.prototype._generateObjects = function(data) {
      var hunk, hunkSplit, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        hunk = data[_i];
        if (!(hunk !== '')) {
          continue;
        }
        hunkSplit = hunk.match(/(@@[ \-\+\,0-9]*@@.*)\n([\s\S]*)/);
        _results.push({
          pos: hunkSplit[1],
          diff: hunkSplit[2],
          patch: hunk
        });
      }
      return _results;
    };

    return SelectStageHunks;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvc2VsZWN0LXN0YWdlLWh1bmtzLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsT0FBVSxPQUFBLENBQVEsc0JBQVIsQ0FBVixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFESixDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUpYLENBQUE7O0FBQUEsRUFLQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVIsQ0FMekIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsK0JBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFRLElBQVIsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFBQSxrREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBSyxDQUFBLENBQUEsQ0FEckIsQ0FBQTtBQUVBLE1BQUEsSUFBa0QsSUFBSSxDQUFDLE1BQUwsS0FBZSxDQUFqRTtBQUFBLGVBQU8sSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsSUFBSyxTQUF2QixDQUFYLENBQVAsQ0FBQTtPQUZBO0FBQUEsTUFHQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFFBQUQsQ0FB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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/select-stage-hunks-view.coffee
