Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

'use babel';

var EditorLinter = (function () {
  function EditorLinter(editor) {
    var _this = this;

    _classCallCheck(this, EditorLinter);

    if (typeof editor !== 'object' || typeof editor.markBufferRange !== 'function') {
      throw new Error('Given editor is not really an editor');
    }

    this.editor = editor;
    this.emitter = new _atom.Emitter();
    this.messages = new Set();
    this.markers = new Map();
    this.subscriptions = new _atom.CompositeDisposable();
    this.gutter = null;
    this.countLineMessages = 0;

    this.subscriptions.add(atom.config.observe('linter.underlineIssues', function (underlineIssues) {
      return _this.underlineIssues = underlineIssues;
    }));
    this.subscriptions.add(atom.config.observe('linter.showErrorInline', function (showBubble) {
      return _this.showBubble = showBubble;
    }));
    this.subscriptions.add(this.editor.onDidDestroy(function () {
      return _this.dispose();
    }));
    this.subscriptions.add(this.editor.onDidSave(function () {
      return _this.emitter.emit('should-lint', false);
    }));
    this.subscriptions.add(this.editor.onDidChangeCursorPosition(function (_ref) {
      var oldBufferPosition = _ref.oldBufferPosition;
      var newBufferPosition = _ref.newBufferPosition;

      if (newBufferPosition.row !== oldBufferPosition.row) {
        _this.calculateLineMessages(newBufferPosition.row);
      }
      _this.emitter.emit('should-update-bubble');
    }));
    this.subscriptions.add(atom.config.observe('linter.gutterEnabled', function (gutterEnabled) {
      _this.gutterEnabled = gutterEnabled;
      _this.handleGutter();
    }));
    // Using onDidChange instead of observe here 'cause the same function is invoked above
    this.subscriptions.add(atom.config.onDidChange('linter.gutterPosition', function () {
      return _this.handleGutter();
    }));
    this.subscriptions.add(this.onDidMessageAdd(function (message) {
      if (!_this.underlineIssues && !_this.gutterEnabled && !_this.showBubble || !message.range) {
        return; // No-Op
      }
      var marker = _this.editor.markBufferRange(message.range, { invalidate: 'inside' });
      _this.markers.set(message, marker);
      if (_this.underlineIssues) {
        _this.editor.decorateMarker(marker, {
          type: 'highlight',
          'class': 'linter-highlight ' + message['class']
        });
      }
      if (_this.gutterEnabled) {
        var item = document.createElement('span');
        item.className = 'linter-gutter linter-highlight ' + message['class'];
        _this.gutter.decorateMarker(marker, {
          'class': 'linter-row',
          item: item
        });
      }
    }));
    this.subscriptions.add(this.onDidMessageDelete(function (message) {
      if (_this.markers.has(message)) {
        _this.markers.get(message).destroy();
        _this.markers['delete'](message);
      }
    }));

    // TODO: Atom invokes onDid{Change, StopChanging} callbacks immediately. Workaround it
    atom.config.observe('linter.lintOnFlyInterval', function (interval) {
      if (_this.changeSubscription) {
        _this.changeSubscription.dispose();
      }
      _this.changeSubscription = _this.editor.onDidChange(_helpers2['default'].debounce(function () {
        _this.emitter.emit('should-lint', true);
      }, interval));
    });

    this.active = true;
  }

  _createClass(EditorLinter, [{
    key: 'handleGutter',
    value: function handleGutter() {
      if (this.gutter !== null) {
        this.removeGutter();
      }
      if (this.gutterEnabled) {
        this.addGutter();
      }
    }
  }, {
    key: 'addGutter',
    value: function addGutter() {
      var position = atom.config.get('linter.gutterPosition');
      this.gutter = this.editor.addGutter({
        name: 'linter',
        priority: position === 'Left' ? -100 : 100
      });
    }
  }, {
    key: 'removeGutter',
    value: function removeGutter() {
      if (this.gutter !== null) {
        try {
          // Atom throws when we try to remove a gutter container from a closed text editor
          this.gutter.destroy();
        } catch (err) {}
        this.gutter = null;
      }
    }
  }, {
    key: 'getMessages',
    value: function getMessages() {
      return this.messages;
    }
  }, {
    key: 'addMessage',
    value: function addMessage(message) {
      if (!this.messages.has(message)) {
        if (this.active) {
          message.currentFile = true;
        }
        this.messages.add(message);
        this.emitter.emit('did-message-add', message);
        this.emitter.emit('did-message-change', { message: message, type: 'add' });
      }
    }
  }, {
    key: 'deleteMessage',
    value: function deleteMessage(message) {
      if (this.messages.has(message)) {
        this.messages['delete'](message);
        this.emitter.emit('did-message-delete', message);
        this.emitter.emit('did-message-change', { message: message, type: 'delete' });
      }
    }
  }, {
    key: 'calculateLineMessages',
    value: function calculateLineMessages(row) {
      var _this2 = this;

      if (atom.config.get('linter.showErrorTabLine')) {
        if (row === null) {
          row = this.editor.getCursorBufferPosition().row;
        }
        this.countLineMessages = 0;
        this.messages.forEach(function (message) {
          if (message.currentLine = message.range && message.range.intersectsRow(row)) {
            _this2.countLineMessages++;
          }
        });
      } else {
        this.countLineMessages = 0;
      }
      this.emitter.emit('did-calculate-line-messages', this.countLineMessages);
      return this.countLineMessages;
    }
  }, {
    key: 'lint',
    value: function lint() {
      var onChange = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.emitter.emit('should-lint', onChange);
    }
  }, {
    key: 'onDidMessageAdd',
    value: function onDidMessageAdd(callback) {
      return this.emitter.on('did-message-add', callback);
    }
  }, {
    key: 'onDidMessageDelete',
    value: function onDidMessageDelete(callback) {
      return this.emitter.on('did-message-delete', callback);
    }
  }, {
    key: 'onDidMessageChange',
    value: function onDidMessageChange(callback) {
      return this.emitter.on('did-message-change', callback);
    }
  }, {
    key: 'onDidCalculateLineMessages',
    value: function onDidCalculateLineMessages(callback) {
      return this.emitter.on('did-calculate-line-messages', callback);
    }
  }, {
    key: 'onShouldUpdateBubble',
    value: function onShouldUpdateBubble(callback) {
      return this.emitter.on('should-update-bubble', callback);
    }
  }, {
    key: 'onShouldLint',
    value: function onShouldLint(callback) {
      return this.emitter.on('should-lint', callback);
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      if (this.markers.size) {
        this.markers.forEach(function (marker) {
          return marker.destroy();
        });
        this.markers.clear();
      }
      this.removeGutter();
      this.subscriptions.dispose();
      if (this.changeSubscription) {
        this.changeSubscription.dispose();
      }
      this.emitter.dispose();
      this.messages.clear();
    }
  }, {
    key: 'active',
    set: function set(value) {
      value = Boolean(value);
      if (value !== this._active) {
        this._active = value;
        if (this.messages.size) {
          this.messages.forEach(function (message) {
            return message.currentFile = value;
          });
        }
      }
    },
    get: function get() {
      return this._active;
    }
  }]);

  return EditorLinter;
})();

exports['default'] = EditorLinter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9lZGl0b3ItbGludGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07O3VCQUM3QixXQUFXOzs7O0FBSC9CLFdBQVcsQ0FBQTs7SUFLVSxZQUFZO0FBQ3BCLFdBRFEsWUFBWSxDQUNuQixNQUFNLEVBQUU7OzswQkFERCxZQUFZOztBQUU3QixRQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxPQUFPLE1BQU0sQ0FBQyxlQUFlLEtBQUssVUFBVSxFQUFFO0FBQzlFLFlBQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtLQUN4RDs7QUFFRCxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF1QixDQUFBO0FBQzVDLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUE7O0FBRTFCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLFVBQUEsZUFBZTthQUNsRixNQUFLLGVBQWUsR0FBRyxlQUFlO0tBQUEsQ0FDdkMsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsVUFBQSxVQUFVO2FBQzdFLE1BQUssVUFBVSxHQUFHLFVBQVU7S0FBQSxDQUM3QixDQUFDLENBQUE7QUFDRixRQUFJLENB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QUMsS0FBSyxDQUFDLENBQUE7QUFDdEIsVUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUMxQixZQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtBQUNwQixZQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQ3RCLGNBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTzttQkFBSSxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUs7V0FBQSxDQUFDLENBQUE7U0FDOUQ7T0FDRjtLQUNGO1NBQ1MsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNwQjs7O1NBNUZrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLWxpbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdG9yTGludGVyIHtcbiAgY29uc3RydWN0b3IoZWRpdG9yKSB7XG4gICAgaWYgKHR5cGVvZiBlZGl0b3IgIT09ICdvYmplY3QnIHx8IHR5cGVvZiBlZGl0b3IubWFya0J1ZmZlclJhbmdlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dpdmVuIGVkaXRvciBpcyBub3QgcmVhbGx5IGFuIGVkaXRvcicpXG4gICAgfVxuXG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMubWFya2VycyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy5ndXR0ZXIgPSBudWxsXG4gICAgdGhpcy5jb3VudExpbmVNZXNzYWdlcyA9IDBcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLnVuZGVybGluZUlzc3VlcycsIHVuZGVybGluZUlzc3VlcyA9PlxuICAgICAgdGhpcy51bmRlcmxpbmVJc3N1ZXMgPSB1bmRlcmxpbmVJc3N1ZXNcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLnNob3dFcnJvcklubGluZScsIHNob3dCdWJibGUgPT5cbiAgICAgIHRoaXMuc2hvd0J1YmJsZSA9IHNob3dCdWJibGVcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lZGl0b3Iub25EaWREZXN0cm95KCgpID0+XG4gICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgICkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVkaXRvci5vbkRpZFNhdmUoKCkgPT5cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIGZhbHNlKVxuICAgICkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKCh7b2xkQnVmZmVyUG9zaXRpb24sIG5ld0J1ZmZlclBvc2l0aW9ufSkgPT4ge1xuICAgICAgaWYgKG5ld0J1ZmZlclBvc2l0aW9uLnJvdyAhPT0gb2xkQnVmZmVyUG9zaXRpb24ucm93KSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlTGluZU1lc3NhZ2VzKG5ld0J1ZmZlclBvc2l0aW9uLnJvdylcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtdXBkYXRlLWJ1YmJsZScpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuZ3V0dGVyRW5hYmxlZCcsIGd1dHRlckVuYWJsZWQgPT4ge1xuICAgICAgdGhpcy5ndXR0ZXJFbmFibGVkID0gZ3V0dGVyRW5hYmxlZFxuICAgICAgdGhpcy5oYW5kbGVHdXR0ZXIoKVxuICAgIH0pKVxuICAgIC8vIFVzaW5nIG9uRGlkQ2hhbmdlIGluc3RlYWQgb2Ygb2JzZXJ2ZSBoZXJlICdjYXVzZSB0aGUgc2FtZSBmdW5jdGlvbiBpcyBpbnZva2VkIGFib3ZlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGludGVyLmd1dHRlclBvc2l0aW9uJywgKCkgPT5cbiAgICAgIHRoaXMuaGFuZGxlR3V0dGVyKClcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5vbkRpZE1lc3NhZ2VBZGQobWVzc2FnZSA9PiB7XG4gICAgICBpZiAoIXRoaXMudW5kZXJsaW5lSXNzdWVzICYmICF0aGlzLmd1dHRlckVuYWJsZWQgJiYgIXRoaXMuc2hvd0J1YmJsZSB8fCAhbWVzc2FnZS5yYW5nZSkge1xuICAgICAgICByZXR1cm4gLy8gTm8tT3BcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1hcmtlciA9IHRoaXMuZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShtZXNzYWdlLnJhbmdlLCB7aW52YWxpZGF0ZTogJ2luc2lkZSd9KVxuICAgICAgdGhpcy5tYXJrZXJzLnNldChtZXNzYWdlLCBtYXJrZXIpXG4gICAgICBpZiAodGhpcy51bmRlcmxpbmVJc3N1ZXMpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgICAgdHlwZTogJ2hpZ2hsaWdodCcsXG4gICAgICAgICAgY2xhc3M6IGBsaW50ZXItaGlnaGxpZ2h0ICR7bWVzc2FnZS5jbGFzc31gXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5ndXR0ZXJFbmFibGVkKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgaXRlbS5jbGFzc05hbWUgPSBgbGludGVyLWd1dHRlciBsaW50ZXItaGlnaGxpZ2h0ICR7bWVzc2FnZS5jbGFzc31gXG4gICAgICAgIHRoaXMuZ3V0dGVyLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICAgIGNsYXNzOiAnbGludGVyLXJvdycsXG4gICAgICAgICAgaXRlbVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5vbkRpZE1lc3NhZ2VEZWxldGUobWVzc2FnZSA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXJzLmhhcyhtZXNzYWdlKSkge1xuICAgICAgICB0aGlzLm1hcmtlcnMuZ2V0KG1lc3NhZ2UpLmRlc3Ryb3koKVxuICAgICAgICB0aGlzLm1hcmtlcnMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICAvLyBUT0RPOiBBdG9tIGludm9rZXMgb25EaWR7Q2hhbmdlLCBTdG9wQ2hhbmdpbmd9IGNhbGxiYWNrcyBpbW1lZGlhdGVseS4gV29ya2Fyb3VuZCBpdFxuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50T25GbHlJbnRlcnZhbCcsIChpbnRlcnZhbCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgfVxuICAgICAgdGhpcy5jaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLmVkaXRvci5vbkRpZENoYW5nZShIZWxwZXJzLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1saW50JywgdHJ1ZSlcbiAgICAgIH0sIGludGVydmFsKSlcbiAgICB9KVxuXG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gIH1cblxuICBzZXQgYWN0aXZlKHZhbHVlKSB7XG4gICAgdmFsdWUgPSBCb29sZWFuKHZhbHVlKVxuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fYWN0aXZlKSB7XG4gICAgICB0aGlzLl9hY3RpdmUgPSB2YWx1ZVxuICAgICAgaWYgKHRoaXMubWVzc2FnZXMuc2l6ZSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiBtZXNzYWdlLmN1cnJlbnRGaWxlID0gdmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBhY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVxuICB9XG5cbiAgaGFuZGxlR3V0dGVyKCkge1xuICAgIGlmICh0aGlzLmd1dHRlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5yZW1vdmVHdXR0ZXIoKVxuICAgIH1cbiAgICBpZiAodGhpcy5ndXR0ZXJFbmFibGVkKSB7XG4gICAgICB0aGlzLmFkZEd1dHRlcigpXG4gICAgfVxuICB9XG5cbiAgYWRkR3V0dGVyKCkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuZ3V0dGVyUG9zaXRpb24nKVxuICAgIHRoaXMuZ3V0dGVyID0gdGhpcy5lZGl0b3IuYWRkR3V0dGVyKHtcbiAgICAgIG5hbWU6ICdsaW50ZXInLFxuICAgICAgcHJpb3JpdHk6IHBvc2l0aW9uID09PSAnTGVmdCcgPyAtMTAwIDogMTAwXG4gICAgfSlcbiAgfVxuXG4gIHJlbW92ZUd1dHRlcigpIHtcbiAgICBpZiAodGhpcy5ndXR0ZXIgIT09IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIEF0b20gdGhyb3dzIHdoZW4gd2UgdHJ5IHRvIHJlbW92ZSBhIGd1dHRlciBjb250YWluZXIgZnJvbSBhIGNsb3NlZCB0ZXh0IGVkaXRvclxuICAgICAgICB0aGlzLmd1dHRlci5kZXN0cm95KClcbiAgICAgIH0gY2F0Y2ggKGVycikge31cbiAgICAgIHRoaXMuZ3V0dGVyID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGdldE1lc3NhZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzXG4gIH1cblxuICBhZGRNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBpZiAoIXRoaXMubWVzc2FnZXMuaGFzKG1lc3NhZ2UpKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgbWVzc2FnZS5jdXJyZW50RmlsZSA9IHRydWVcbiAgICAgIH1cbiAgICAgIHRoaXMubWVzc2FnZXMuYWRkKG1lc3NhZ2UpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW1lc3NhZ2UtYWRkJywgbWVzc2FnZSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtbWVzc2FnZS1jaGFuZ2UnLCB7bWVzc2FnZSwgdHlwZTogJ2FkZCd9KVxuICAgIH1cbiAgfVxuXG4gIGRlbGV0ZU1lc3NhZ2UobWVzc2FnZSkge1xuICAgIGlmICh0aGlzLm1lc3NhZ2VzLmhhcyhtZXNzYWdlKSkge1xuICAgICAgdGhpcy5tZXNzYWdlcy5kZWxldGUobWVzc2FnZSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtbWVzc2FnZS1kZWxldGUnLCBtZXNzYWdlKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1tZXNzYWdlLWNoYW5nZScsIHttZXNzYWdlLCB0eXBlOiAnZGVsZXRlJ30pXG4gICAgfVxuICB9XG5cbiAgY2FsY3VsYXRlTGluZU1lc3NhZ2VzKHJvdykge1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5zaG93RXJyb3JUYWJMaW5lJykpIHtcbiAgICAgIGlmIChyb3cgPT09IG51bGwpIHtcbiAgICAgICAgcm93ID0gdGhpcy5lZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKS5yb3dcbiAgICAgIH1cbiAgICAgIHRoaXMuY291bnRMaW5lTWVzc2FnZXMgPSAwXG4gICAgICB0aGlzLm1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICAgIGlmIChtZXNzYWdlLmN1cnJlbnRMaW5lID0gbWVzc2FnZS5yYW5nZSAmJiBtZXNzYWdlLnJhbmdlLmludGVyc2VjdHNSb3cocm93KSkge1xuICAgICAgICAgIHRoaXMuY291bnRMaW5lTWVzc2FnZXMrK1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvdW50TGluZU1lc3NhZ2VzID0gMFxuICAgIH1cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNhbGN1bGF0ZS1saW5lLW1lc3NhZ2VzJywgdGhpcy5jb3VudExpbmVNZXNzYWdlcylcbiAgICByZXR1cm4gdGhpcy5jb3VudExpbmVNZXNzYWdlc1xuICB9XG5cbiAgbGludChvbkNoYW5nZSA9IGZhbHNlKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1saW50Jywgb25DaGFuZ2UpXG4gIH1cblxuICBvbkRpZE1lc3NhZ2VBZGQoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtbWVzc2FnZS1hZGQnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uRGlkTWVzc2FnZURlbGV0ZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1tZXNzYWdlLWRlbGV0ZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgb25EaWRNZXNzYWdlQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLW1lc3NhZ2UtY2hhbmdlJywgY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZENhbGN1bGF0ZUxpbmVNZXNzYWdlcyhjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jYWxjdWxhdGUtbGluZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG5cbiAgb25TaG91bGRVcGRhdGVCdWJibGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtdXBkYXRlLWJ1YmJsZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgb25TaG91bGRMaW50KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLWxpbnQnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uRGlkRGVzdHJveShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgaWYgKHRoaXMubWFya2Vycy5zaXplKSB7XG4gICAgICB0aGlzLm1hcmtlcnMuZm9yRWFjaChtYXJrZXIgPT4gbWFya2VyLmRlc3Ryb3koKSlcbiAgICAgIHRoaXMubWFya2Vycy5jbGVhcigpXG4gICAgfVxuICAgIHRoaXMucmVtb3ZlR3V0dGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuY2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmNoYW5nZVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICAgIHRoaXMubWVzc2FnZXMuY2xlYXIoKVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/kswedberg/.atom/packages/linter/lib/editor-linter.js
