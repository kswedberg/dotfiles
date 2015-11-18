(function() {
  var $$, GotoView, SelectListView, fs, path, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  fs = require('fs');

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  utils = require('./symbol-utils');

  module.exports = GotoView = (function(_super) {
    __extends(GotoView, _super);

    function GotoView() {
      return GotoView.__super__.constructor.apply(this, arguments);
    }

    GotoView.prototype.initialize = function() {
      GotoView.__super__.initialize.apply(this, arguments);
      this.addClass('goto-view fuzzy-finder');
      this.currentEditor = null;
      return this.cancelPosition = null;
    };

    GotoView.prototype.destroy = function() {
      var _ref1;
      this.cancel();
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    GotoView.prototype.cancel = function() {
      GotoView.__super__.cancel.apply(this, arguments);
      this.restoreCancelPosition();
      this.currentEditor = null;
      return this.cancelPosition = null;
    };

    GotoView.prototype.populate = function(symbols, editor) {
      this.rememberCancelPosition(editor);
      this.setItems(symbols);
      return this.show();
    };

    GotoView.prototype.rememberCancelPosition = function(editor) {
      if (!editor || !atom.config.get('goto.autoScroll')) {
        return;
      }
      this.currentEditor = editor;
      return this.cancelPosition = {
        position: editor.getCursorBufferPosition(),
        selections: editor.getSelectedBufferRanges()
      };
    };

    GotoView.prototype.restoreCancelPosition = function() {
      if (this.currentEditor && this.cancelPosition) {
        this.currentEditor.setCursorBufferPosition(this.cancelPosition.position);
        if (this.cancelPosition.selections) {
          return this.currentEditor.setSelectedBufferRanges(this.cancelPosition.selections);
        }
      }
    };

    GotoView.prototype.forgetCancelPosition = function() {
      this.currentEditor = null;
      return this.cancelPosition = null;
    };

    GotoView.prototype.getFilterKey = function() {
      return 'name';
    };

    GotoView.prototype.scrollToItemView = function(view) {
      var symbol;
      GotoView.__super__.scrollToItemView.apply(this, arguments);
      symbol = this.getSelectedItem();
      return this.onItemSelected(symbol);
    };

    GotoView.prototype.onItemSelected = function(symbol) {
      var _ref1;
      return (_ref1 = this.currentEditor) != null ? _ref1.setCursorBufferPosition(symbol.position) : void 0;
    };

    GotoView.prototype.viewForItem = function(symbol) {
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            var dir, text;
            _this.div(symbol.name, {
              "class": 'primary-line'
            });
            dir = path.basename(symbol.path);
            text = "" + dir + " " + (symbol.position.row + 1);
            return _this.div(text, {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    GotoView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No symbols found';
      } else {
        return GotoView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    GotoView.prototype.confirmed = function(symbol) {
      this.forgetCancelPosition();
      if (!fs.existsSync(symbol.path)) {
        this.setError('Selected file does not exist');
        return setTimeout(((function(_this) {
          return function() {
            return _this.setError();
          };
        })(this)), 2000);
      } else if (atom.workspace.getActiveTextEditor()) {
        this.cancel();
        return utils.gotoSymbol(symbol);
      }
    };

    GotoView.prototype.show = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    GotoView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    GotoView.prototype.cancelled = function() {
      return this.hide();
    };

    return GotoView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9nb3RvL2xpYi9nb3RvLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLG1EQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFVBQUEsRUFBRCxFQUFLLHNCQUFBLGNBRkwsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsZ0JBQVIsQ0FIUixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx1QkFBQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSwwQ0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSx3QkFBVixDQURBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBSmpCLENBQUE7YUFRQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQVRSO0lBQUEsQ0FBWixDQUFBOztBQUFBLHVCQWdCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxLQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsQ0FBQTtpREFDTSxDQUFFLE9BQVIsQ0FBQSxXQUZPO0lBQUEsQ0FoQlQsQ0FBQTs7QUFBQSx1QkFvQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsc0NBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxxQkFBRCxDQUFBLENBREEsQ0FBQTtB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

//# sourceURL=/Users/kswedberg/.atom/packages/goto/lib/goto-view.coffee
