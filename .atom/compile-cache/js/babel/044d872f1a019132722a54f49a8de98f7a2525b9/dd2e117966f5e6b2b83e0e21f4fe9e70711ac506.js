Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _uiBottomPanel = require('./ui/bottom-panel');

var _uiBottomPanel2 = _interopRequireDefault(_uiBottomPanel);

var _uiBottomContainer = require('./ui/bottom-container');

var _uiBottomContainer2 = _interopRequireDefault(_uiBottomContainer);

var _uiMessageElement = require('./ui/message-element');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _uiMessageBubble = require('./ui/message-bubble');

'use babel';

var LinterViews = (function () {
  function LinterViews(scope, editorRegistry) {
    var _this = this;

    _classCallCheck(this, LinterViews);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.bottomPanel = new _uiBottomPanel2['default'](scope);
    this.bottomContainer = _uiBottomContainer2['default'].create(scope);
    this.editors = editorRegistry;
    this.bottomBar = null; // To be added when status-bar service is consumed
    this.bubble = null;
    this.bubbleRange = null;

    this.subscriptions.add(this.bottomPanel);
    this.subscriptions.add(this.bottomContainer);
    this.subscriptions.add(this.emitter);

    this.count = {
      Line: 0,
      File: 0,
      Project: 0
    };
    this.messages = [];
    this.subscriptions.add(atom.config.observe('linter.showErrorInline', function (showBubble) {
      return _this.showBubble = showBubble;
    }));
    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(function (paneItem) {
      var isEditor = false;
      _this.editors.forEach(function (editorLinter) {
        isEditor = (editorLinter.active = editorLinter.editor === paneItem) || isEditor;
      });
      _this.updateCounts();
      _this.bottomPanel.refresh();
      _this.bottomContainer.visibility = isEditor;
    }));
    this.subscriptions.add(this.bottomContainer.onDidChangeTab(function (scope) {
      _this.emitter.emit('did-update-scope', scope);
      atom.config.set('linter.showErrorPanel', true);
      _this.bottomPanel.refresh(scope);
    }));
    this.subscriptions.add(this.bottomContainer.onShouldTogglePanel(function () {
      atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
    }));

    this._renderBubble = this.renderBubble;
    this.subscriptions.add(atom.config.observe('linter.inlineTooltipInterval', function (bubbleInterval) {
      return _this.renderBubble = _helpers2['default'].debounce(_this._renderBubble, bubbleInterval);
    }));
  }

  _createClass(LinterViews, [{
    key: 'render',
    value: function render(_ref) {
      var added = _ref.added;
      var removed = _ref.removed;
      var messages = _ref.messages;

      this.messages = messages;
      this.notifyEditorLinters({ added: added, removed: removed });
      this.bottomPanel.setMessages({ added: added, removed: removed });
      this.updateCounts();
    }
  }, {
    key: 'updateCounts',
    value: function updateCounts() {
      var activeEditorLinter = this.editors.ofActiveTextEditor();

      this.count.Project = this.messages.length;
      this.count.File = activeEditorLinter ? activeEditorLinter.getMessages().size : 0;
      this.count.Line = activeEditorLinter ? activeEditorLinter.countLineMessages : 0;
      this.bottomContainer.setCount(this.count);
    }
  }, {
    key: 'renderBubble',
    value: function renderBubble(editorLinter) {
      if (!this.showBubble || !editorLinter.messages.size) {
        return;
      }
      var point = editorLinter.editor.getCursorBufferPosition();
      if (this.bubbleRange && this.bubbleRange.containsPoint(point)) {
        return; // The marker remains the same
      } else if (this.bubble) {
          this.bubble.destroy();
          this.bubble = null;
        }
      for (var entry of editorLinter.markers) {
        var bubbleRange = entry[1].getBufferRange();
        if (bubbleRange.containsPoint(point)) {
          this.bubbleRange = bubbleRange;
          this.bubble = editorLinter.editor.decorateMarker(entry[1], {
            type: 'overlay',
            item: (0, _uiMessageBubble.create)(entry[0])
          });
          return;
        }
      }
      this.bubbleRange = null;
    }
  }, {
    key: 'notifyEditorLinters',
    value: function notifyEditorLinters(_ref2) {
      var _this2 = this;

      var added = _ref2.added;
      var removed = _ref2.removed;

      var editorLinter = undefined;
      removed.forEach(function (message) {
        if (message.filePath && (editorLinter = _this2.editors.ofPath(message.filePath))) {
          editorLinter.deleteMessage(message);
        }
      });
      added.forEach(function (message) {
        if (message.filePath && (editorLinter = _this2.editors.ofPath(message.filePath))) {
          editorLinter.addMessage(message);
        }
      });
      editorLinter = this.editors.ofActiveTextEditor();
      if (editorLinter) {
        editorLinter.calculateLineMessages(null);
        this.renderBubble(editorLinter);
      }
    }
  }, {
    key: 'notifyEditorLinter',
    value: function notifyEditorLinter(editorLinter) {
      var path = editorLinter.editor.getPath();
      if (!path) return;
      this.messages.forEach(function (message) {
        if (message.filePath && message.filePath === path) {
          editorLinter.addMessage(message);
        }
      });
    }
  }, {
    key: 'attachBottom',
    value: function attachBottom(statusBar) {
      var _this3 = this;

      this.subscriptions.add(atom.config.observe('linter.statusIconPosition', function (position) {
        if (_this3.bottomBar) {
          _this3.bottomBar.destroy();
        }
        _this3.bottomBar = statusBar['add' + position + 'Tile']({
          item: _this3.bottomContainer,
          priority: position === 'Left' ? -100 : 100
        });
      }));
    }
  }, {
    key: 'onDidUpdateScope',
    value: function onDidUpdateScope(callback) {
      return this.emitter.on('did-update-scope', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      // No need to notify editors of this, we're being disposed means the package is
      // being deactivated. They'll be disposed automatically by the registry.
      this.subscriptions.dispose();
      if (this.bottomBar) {
        this.bottomBar.destroy();
      }
      if (this.bubble) {
        this.bubble.destroy();
        this.bubbleRange = null;
      }
    }
  }]);

  return LinterViews;
})();

exports['default'] = LinterViews;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItdmlld3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7NkJBQ3pCLG1CQUFtQjs7OztpQ0FDZix1QkFBdUI7Ozs7Z0NBQzdCLHNCQUFzQjs7dUJBQ3hCLFdBQVc7Ozs7K0JBQ00scUJBQXFCOztBQVAxRCxXQUFXLENBQUE7O0lBU1UsV0FBVztBQUNuQixXQURRLFdBQVcsQ0FDbEIsS0FBSyxFQUFFLGNBQWMsRUFBRTs7OzBCQURoQixXQUFXOztBQUU1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUFnQixLQUFLLENBQUMsQ0FBQTtBQUN6QyxRQUFJLENBQUMsZUFBZSxHQUFHLCtCQUFnQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDcEQsUUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUE7QUFDN0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUE7QUFDckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDbEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7O0FBRXZCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN4QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBOztBQUVwQyxRQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsVUFBSSxFQUFFLENBQUM7QUFDUCxVQUFJLEVBQUUsQ0FBQztBQUNQLGFBQU8sRUFBRSxDQUFDO0tBQ1gsQ0FBQTtBQUNELFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLFVBQUEsVUFBVTthQUM3RSxNQUFLLFVBQVUsR0FBRyxVQUFVO0tBQUEsQ0FDN0IsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUMxRSxVQUFJLFFBQVEsR0FBRyxLQUFLLENBQUE7QUFDcEIsWUFBSyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMsWUFBWSxFQUFFO0FBQzFDLGdCQUFRLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFBLElBQUssUUFBUSxDQUFBO09BQ2hGLENBQUMsQ0FBQTtBQUNGLFlBQUssWUFBWSxFQUFFLENBQUE7QUFDbkIsWUFBSyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDMUIsWUFBSyxlQUFlLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQTtLQUMzQyxDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ2xFLFlBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUM5QyxZQUFLLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDaEMsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLFlBQVc7QUFDekUsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUE7S0FDcEYsQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFBO0FBQ3RDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDhCQUE4QixFQUFFLFVBQUEsY0FBYzthQUN2RixNQUFLLFlBQVksR0FBRyxxQkFBUSxRQUFRLENBQUMsTUFBSyxhQUFhLEVBQUUsY0FBYyxDQUFDO0tBQUEsQ0FDekUsQ0FBQyxDQUFBO0dBQ0g7O2VBOUNrQixXQUFXOztXQStDeEIsZ0JBQUMsSUFBMEIsRUFBRTtVQUEzQixLQUFLLEdBQU4sSUFBMEIsQ0FBekIsS0FBSztVQUFFLE9BQU8sR0FBZixJQUEwQixDQUFsQixPQUFPO1VBQUUsUUFBUSxHQUF6QixJQUEwQixDQUFULFFBQVE7O0FBQzlCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFVBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDLEtBQUssRUFBTCxLQUFLLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBQyxDQUFDLENBQUE7QUFDMUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBQyxLQUFLLEVBQUwsS0FBSyxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUMsQ0FBQyxDQUFBO0FBQzlDLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtLQUNwQjs7O1dBQ1csd0JBQUc7QUFDYixVQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQTs7QUFFNUQsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUE7QUFDekMsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQTtBQUNoRixVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUE7QUFDL0UsVUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQzFDOzs7V0FDVyxzQkFBQyxZQUFZLEVBQUU7QUFDekIsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtBQUNuRCxlQUFNO09BQ1A7QUFDRCxVQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUE7QUFDM0QsVUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzdELGVBQU07T0FDUCxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUN0QixjQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3JCLGNBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO1NBQ25CO0FBQ0QsV0FBSyxJQUFJLEtBQUssSUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFO0FBQ3RDLFlBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUM3QyxZQUFJLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDcEMsY0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsY0FBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDekQsZ0JBQUksRUFBRSxTQUFTO0FBQ2YsZ0JBQUksRUFBRSw2QkFBYSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDN0IsQ0FBQyxDQUFBO0FBQ0YsaUJBQU07U0FDUDtPQUNGO0FBQ0QsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7S0FDeEI7OztXQUNrQiw2QkFBQyxLQUFnQixFQUFFOzs7VUFBakIsS0FBSyxHQUFOLEtBQWdCLENBQWYsS0FBSztVQUFFLE9BQU8sR0FBZixLQUFnQixDQUFSLE9BQU87O0FBQ2pDLFVBQUksWUFBWSxZQUFBLENBQUE7QUFDaEIsYUFBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUN6QixZQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssWUFBWSxHQUFHLE9BQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUEsQUFBQyxFQUFFO0FBQzlFLHNCQUFZLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ3BDO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsV0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUN2QixZQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssWUFBWSxHQUFHLE9BQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUEsQUFBQyxFQUFFO0FBQzlFLHNCQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ2pDO09BQ0YsQ0FBQyxDQUFBO0FBQ0Ysa0JBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUE7QUFDaEQsVUFBSSxZQUFZLEVBQUU7QUFDaEIsb0JBQVksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN4QyxZQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFBO09BQ2hDO0tBQ0Y7OztXQUNpQiw0QkFBQyxZQUFZLEVBQUU7QUFDL0IsVUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMxQyxVQUFJLENBQUMsSUFBSSxFQUFFLE9BQU07QUFDakIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUU7QUFDdEMsWUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFO0FBQ2pELHNCQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ2pDO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztXQUNXLHNCQUFDLFNBQVMsRUFBRTs7O0FBQ3RCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFLFVBQUEsUUFBUSxFQUFJO0FBQ2xGLFlBQUksT0FBSyxTQUFTLEVBQUU7QUFDbEIsaUJBQUssU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFBO1NBQ3pCO0FBQ0QsZUFBSyxTQUFTLEdBQUcsU0FBUyxTQUFPLFFBQVEsVUFBTyxDQUFDO0FBQy9DLGNBQUksRUFBRSxPQUFLLGVBQWU7QUFDMUIsa0JBQVEsRUFBRSxRQUFRLEtBQUssTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUc7U0FDM0MsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFDLENBQUE7S0FDSjs7O1dBRWUsMEJBQUMsUUFBUSxFQUFFO0FBQ3pCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDckQ7OztXQUNNLG1CQUFHOzs7QUFHUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3pCO0FBQ0QsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNyQixZQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtPQUN4QjtLQUNGOzs7U0ExSWtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItdmlld3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgQm90dG9tUGFuZWwgZnJvbSAnLi91aS9ib3R0b20tcGFuZWwnXG5pbXBvcnQgQm90dG9tQ29udGFpbmVyIGZyb20gJy4vdWkvYm90dG9tLWNvbnRhaW5lcidcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi91aS9tZXNzYWdlLWVsZW1lbnQnXG5pbXBvcnQgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQge2NyZWF0ZSBhcyBjcmVhdGVCdWJibGV9IGZyb20gJy4vdWkvbWVzc2FnZS1idWJibGUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlclZpZXdzIHtcbiAgY29uc3RydWN0b3Ioc2NvcGUsIGVkaXRvclJlZ2lzdHJ5KSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmJvdHRvbVBhbmVsID0gbmV3IEJvdHRvbVBhbmVsKHNjb3BlKVxuICAgIHRoaXMuYm90dG9tQ29udGFpbmVyID0gQm90dG9tQ29udGFpbmVyLmNyZWF0ZShzY29wZSlcbiAgICB0aGlzLmVkaXRvcnMgPSBlZGl0b3JSZWdpc3RyeVxuICAgIHRoaXMuYm90dG9tQmFyID0gbnVsbCAvLyBUbyBiZSBhZGRlZCB3aGVuIHN0YXR1cy1iYXIgc2VydmljZSBpcyBjb25zdW1lZFxuICAgIHRoaXMuYnViYmxlID0gbnVsbFxuICAgIHRoaXMuYnViYmxlUmFuZ2UgPSBudWxsXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYm90dG9tUGFuZWwpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbUNvbnRhaW5lcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcblxuICAgIHRoaXMuY291bnQgPSB7XG4gICAgICBMaW5lOiAwLFxuICAgICAgRmlsZTogMCxcbiAgICAgIFByb2plY3Q6IDBcbiAgICB9XG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuc2hvd0Vycm9ySW5saW5lJywgc2hvd0J1YmJsZSA9PlxuICAgICAgdGhpcy5zaG93QnViYmxlID0gc2hvd0J1YmJsZVxuICAgICkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKHBhbmVJdGVtID0+IHtcbiAgICAgIGxldCBpc0VkaXRvciA9IGZhbHNlXG4gICAgICB0aGlzLmVkaXRvcnMuZm9yRWFjaChmdW5jdGlvbihlZGl0b3JMaW50ZXIpIHtcbiAgICAgICAgaXNFZGl0b3IgPSAoZWRpdG9yTGludGVyLmFjdGl2ZSA9IGVkaXRvckxpbnRlci5lZGl0b3IgPT09IHBhbmVJdGVtKSB8fCBpc0VkaXRvclxuICAgICAgfSlcbiAgICAgIHRoaXMudXBkYXRlQ291bnRzKClcbiAgICAgIHRoaXMuYm90dG9tUGFuZWwucmVmcmVzaCgpXG4gICAgICB0aGlzLmJvdHRvbUNvbnRhaW5lci52aXNpYmlsaXR5ID0gaXNFZGl0b3JcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuYm90dG9tQ29udGFpbmVyLm9uRGlkQ2hhbmdlVGFiKHNjb3BlID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLXNjb3BlJywgc2NvcGUpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5zaG93RXJyb3JQYW5lbCcsIHRydWUpXG4gICAgICB0aGlzLmJvdHRvbVBhbmVsLnJlZnJlc2goc2NvcGUpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbUNvbnRhaW5lci5vblNob3VsZFRvZ2dsZVBhbmVsKGZ1bmN0aW9uKCkge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCAhYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnKSlcbiAgICB9KSlcblxuICAgIHRoaXMuX3JlbmRlckJ1YmJsZSA9IHRoaXMucmVuZGVyQnViYmxlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuaW5saW5lVG9vbHRpcEludGVydmFsJywgYnViYmxlSW50ZXJ2YWwgPT5cbiAgICAgIHRoaXMucmVuZGVyQnViYmxlID0gSGVscGVycy5kZWJvdW5jZSh0aGlzLl9yZW5kZXJCdWJibGUsIGJ1YmJsZUludGVydmFsKVxuICAgICkpXG4gIH1cbiAgcmVuZGVyKHthZGRlZCwgcmVtb3ZlZCwgbWVzc2FnZXN9KSB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgdGhpcy5ub3RpZnlFZGl0b3JMaW50ZXJzKHthZGRlZCwgcmVtb3ZlZH0pXG4gICAgdGhpcy5ib3R0b21QYW5lbC5zZXRNZXNzYWdlcyh7YWRkZWQsIHJlbW92ZWR9KVxuICAgIHRoaXMudXBkYXRlQ291bnRzKClcbiAgfVxuICB1cGRhdGVDb3VudHMoKSB7XG4gICAgY29uc3QgYWN0aXZlRWRpdG9yTGludGVyID0gdGhpcy5lZGl0b3JzLm9mQWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICB0aGlzLmNvdW50LlByb2plY3QgPSB0aGlzLm1lc3NhZ2VzLmxlbmd0aFxuICAgIHRoaXMuY291bnQuRmlsZSA9IGFjdGl2ZUVkaXRvckxpbnRlciA/IGFjdGl2ZUVkaXRvckxpbnRlci5nZXRNZXNzYWdlcygpLnNpemUgOiAwXG4gICAgdGhpcy5jb3VudC5MaW5lID0gYWN0aXZlRWRpdG9yTGludGVyID8gYWN0aXZlRWRpdG9yTGludGVyLmNvdW50TGluZU1lc3NhZ2VzIDogMFxuICAgIHRoaXMuYm90dG9tQ29udGFpbmVyLnNldENvdW50KHRoaXMuY291bnQpXG4gIH1cbiAgcmVuZGVyQnViYmxlKGVkaXRvckxpbnRlcikge1xuICAgIGlmICghdGhpcy5zaG93QnViYmxlIHx8ICFlZGl0b3JMaW50ZXIubWVzc2FnZXMuc2l6ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHBvaW50ID0gZWRpdG9yTGludGVyLmVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgaWYgKHRoaXMuYnViYmxlUmFuZ2UgJiYgdGhpcy5idWJibGVSYW5nZS5jb250YWluc1BvaW50KHBvaW50KSkge1xuICAgICAgcmV0dXJuIC8vIFRoZSBtYXJrZXIgcmVtYWlucyB0aGUgc2FtZVxuICAgIH0gZWxzZSBpZiAodGhpcy5idWJibGUpIHtcbiAgICAgIHRoaXMuYnViYmxlLmRlc3Ryb3koKVxuICAgICAgdGhpcy5idWJibGUgPSBudWxsXG4gICAgfVxuICAgIGZvciAobGV0IGVudHJ5IG9mIGVkaXRvckxpbnRlci5tYXJrZXJzKSB7XG4gICAgICBjb25zdCBidWJibGVSYW5nZSA9IGVudHJ5WzFdLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIGlmIChidWJibGVSYW5nZS5jb250YWluc1BvaW50KHBvaW50KSkge1xuICAgICAgICB0aGlzLmJ1YmJsZVJhbmdlID0gYnViYmxlUmFuZ2VcbiAgICAgICAgdGhpcy5idWJibGUgPSBlZGl0b3JMaW50ZXIuZWRpdG9yLmRlY29yYXRlTWFya2VyKGVudHJ5WzFdLCB7XG4gICAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICAgIGl0ZW06IGNyZWF0ZUJ1YmJsZShlbnRyeVswXSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYnViYmxlUmFuZ2UgPSBudWxsXG4gIH1cbiAgbm90aWZ5RWRpdG9yTGludGVycyh7YWRkZWQsIHJlbW92ZWR9KSB7XG4gICAgbGV0IGVkaXRvckxpbnRlclxuICAgIHJlbW92ZWQuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmZpbGVQYXRoICYmIChlZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvcnMub2ZQYXRoKG1lc3NhZ2UuZmlsZVBhdGgpKSkge1xuICAgICAgICBlZGl0b3JMaW50ZXIuZGVsZXRlTWVzc2FnZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pXG4gICAgYWRkZWQuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmZpbGVQYXRoICYmIChlZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvcnMub2ZQYXRoKG1lc3NhZ2UuZmlsZVBhdGgpKSkge1xuICAgICAgICBlZGl0b3JMaW50ZXIuYWRkTWVzc2FnZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pXG4gICAgZWRpdG9yTGludGVyID0gdGhpcy5lZGl0b3JzLm9mQWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKGVkaXRvckxpbnRlcikge1xuICAgICAgZWRpdG9yTGludGVyLmNhbGN1bGF0ZUxpbmVNZXNzYWdlcyhudWxsKVxuICAgICAgdGhpcy5yZW5kZXJCdWJibGUoZWRpdG9yTGludGVyKVxuICAgIH1cbiAgfVxuICBub3RpZnlFZGl0b3JMaW50ZXIoZWRpdG9yTGludGVyKSB7XG4gICAgY29uc3QgcGF0aCA9IGVkaXRvckxpbnRlci5lZGl0b3IuZ2V0UGF0aCgpXG4gICAgaWYgKCFwYXRoKSByZXR1cm5cbiAgICB0aGlzLm1lc3NhZ2VzLmZvckVhY2goZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgaWYgKG1lc3NhZ2UuZmlsZVBhdGggJiYgbWVzc2FnZS5maWxlUGF0aCA9PT0gcGF0aCkge1xuICAgICAgICBlZGl0b3JMaW50ZXIuYWRkTWVzc2FnZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgYXR0YWNoQm90dG9tKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLnN0YXR1c0ljb25Qb3NpdGlvbicsIHBvc2l0aW9uID0+IHtcbiAgICAgIGlmICh0aGlzLmJvdHRvbUJhcikge1xuICAgICAgICB0aGlzLmJvdHRvbUJhci5kZXN0cm95KClcbiAgICAgIH1cbiAgICAgIHRoaXMuYm90dG9tQmFyID0gc3RhdHVzQmFyW2BhZGQke3Bvc2l0aW9ufVRpbGVgXSh7XG4gICAgICAgIGl0ZW06IHRoaXMuYm90dG9tQ29udGFpbmVyLFxuICAgICAgICBwcmlvcml0eTogcG9zaXRpb24gPT09ICdMZWZ0JyA/IC0xMDAgOiAxMDBcbiAgICAgIH0pXG4gICAgfSkpXG4gIH1cblxuICBvbkRpZFVwZGF0ZVNjb3BlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1zY29wZScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgLy8gTm8gbmVlZCB0byBub3RpZnkgZWRpdG9ycyBvZiB0aGlzLCB3ZSdyZSBiZWluZyBkaXNwb3NlZCBtZWFucyB0aGUgcGFja2FnZSBpc1xuICAgIC8vIGJlaW5nIGRlYWN0aXZhdGVkLiBUaGV5J2xsIGJlIGRpc3Bvc2VkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIHJlZ2lzdHJ5LlxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBpZiAodGhpcy5ib3R0b21CYXIpIHtcbiAgICAgIHRoaXMuYm90dG9tQmFyLmRlc3Ryb3koKVxuICAgIH1cbiAgICBpZiAodGhpcy5idWJibGUpIHtcbiAgICAgIHRoaXMuYnViYmxlLmRlc3Ryb3koKVxuICAgICAgdGhpcy5idWJibGVSYW5nZSA9IG51bGxcbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/linter/lib/linter-views.js
