(function() {
  var $, PromptView, TextEditorView, View, method, noop, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  noop = function() {};

  method = function(delegate, method) {
    var _ref1;
    return (delegate != null ? (_ref1 = delegate[method]) != null ? _ref1.bind(delegate) : void 0 : void 0) || noop;
  };

  module.exports = PromptView = (function(_super) {
    __extends(PromptView, _super);

    function PromptView() {
      return PromptView.__super__.constructor.apply(this, arguments);
    }

    PromptView.attach = function() {
      return new PromptView;
    };

    PromptView.content = function() {
      return this.div({
        "class": 'emmet-prompt tool-panel panel-bottom'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'emmet-prompt__input'
          }, function() {
            return _this.subview('panelInput', new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    PromptView.prototype.initialize = function() {
      this.panelEditor = this.panelInput.getModel();
      this.panelEditor.onDidStopChanging((function(_this) {
        return function() {
          if (!_this.attached) {
            return;
          }
          return _this.handleUpdate(_this.panelEditor.getText());
        };
      })(this));
      atom.commands.add(this.panelInput.element, 'core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      return atom.commands.add(this.panelInput.element, 'core:cancel', (function(_this) {
        return function() {
          return _this.cancel();
        };
      })(this));
    };

    PromptView.prototype.show = function(delegate) {
      var text;
      this.delegate = delegate != null ? delegate : {};
      this.editor = this.delegate.editor;
      this.editorView = this.delegate.editorView;
      this.panelInput.element.setAttribute('placeholder', this.delegate.label || 'Enter abbreviation');
      this.updated = false;
      this.attach();
      text = this.panelEditor.getText();
      if (text) {
        this.panelEditor.selectAll();
        return this.handleUpdate(text);
      }
    };

    PromptView.prototype.undo = function() {
      if (this.updated) {
        return this.editor.undo();
      }
    };

    PromptView.prototype.handleUpdate = function(text) {
      this.undo();
      this.updated = true;
      return this.editor.transact((function(_this) {
        return function() {
          return method(_this.delegate, 'update')(text);
        };
      })(this));
    };

    PromptView.prototype.confirm = function() {
      this.handleUpdate(this.panelEditor.getText());
      this.trigger('confirm');
      method(this.delegate, 'confirm')();
      return this.detach();
    };

    PromptView.prototype.cancel = function() {
      this.undo();
      this.trigger('cancel');
      method(this.delegate, 'cancel')();
      return this.detach();
    };

    PromptView.prototype.detach = function() {
      var _ref1;
      if (!this.hasParent()) {
        return;
      }
      this.detaching = true;
      if ((_ref1 = this.prevPane) != null) {
        _ref1.activate();
      }
      PromptView.__super__.detach.apply(this, arguments);
      this.detaching = false;
      this.attached = false;
      this.trigger('detach');
      return method(this.delegate, 'hide')();
    };

    PromptView.prototype.attach = function() {
      this.attached = true;
      this.prevPane = atom.workspace.getActivePane();
      atom.workspace.addBottomPanel({
        item: this,
        visible: true
      });
      this.panelInput.focus();
      this.trigger('attach');
      return method(this.delegate, 'show')();
    };

    return PromptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9lbW1ldC9saWIvcHJvbXB0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1REFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksc0JBQUEsY0FBSixFQUFvQixZQUFBLElBQXBCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sU0FBQSxHQUFBLENBRFAsQ0FBQTs7QUFBQSxFQUdBLE1BQUEsR0FBUyxTQUFDLFFBQUQsRUFBVyxNQUFYLEdBQUE7QUFDUixRQUFBLEtBQUE7eUVBQWlCLENBQUUsSUFBbkIsQ0FBd0IsUUFBeEIsb0JBQUEsSUFBcUMsS0FEN0I7RUFBQSxDQUhULENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0wsaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFBLEdBQUE7YUFBRyxHQUFBLENBQUEsV0FBSDtJQUFBLENBQVQsQ0FBQTs7QUFBQSxJQUVBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHNDQUFQO09BQUwsRUFBb0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFFbkQsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLHFCQUFQO1dBQUwsRUFBbUMsU0FBQSxHQUFBO21CQUNsQyxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxjQUFBLENBQWU7QUFBQSxjQUFBLElBQUEsRUFBTSxJQUFOO2FBQWYsQ0FBM0IsRUFEa0M7VUFBQSxDQUFu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

//# sourceURL=/Users/kswedberg/.atom/packages/emmet/lib/prompt.coffee
