Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

'use babel';

var LinterRegistry = (function () {
  function LinterRegistry() {
    _classCallCheck(this, LinterRegistry);

    this.linters = new Set();
    this.locks = {
      Regular: new WeakSet(),
      Fly: new WeakSet()
    };

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.subscriptions.add(this.emitter);
  }

  _createClass(LinterRegistry, [{
    key: 'getLinters',
    value: function getLinters() {
      return this.linters;
    }
  }, {
    key: 'hasLinter',
    value: function hasLinter(linter) {
      return this.linters.has(linter);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      try {
        _validate2['default'].linter(linter);
        linter.deactivated = false;
        this.linters.add(linter);
      } catch (err) {
        _helpers2['default'].error(err);
      }
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      if (this.linters.has(linter)) {
        linter.deactivated = true;
        this.linters['delete'](linter);
      }
    }
  }, {
    key: 'lint',
    value: function lint(_ref) {
      var _this = this;

      var onChange = _ref.onChange;
      var editorLinter = _ref.editorLinter;

      var editor = editorLinter.editor;
      var lockKey = onChange ? 'Fly' : 'Regular';

      if (onChange && !atom.config.get('linter.lintOnFly') || // Lint-on-fly mismatch
      !editor.getPath() || // Not saved anywhere yet
      editor !== atom.workspace.getActiveTextEditor() || // Not active
      this.locks[lockKey].has(editorLinter) || // Already linting
      atom.config.get('linter.ignoreVCSIgnoredFiles') && _helpers2['default'].isPathIgnored(editor.getPath()) // Ignored by VCS
      ) {
          return;
        }

      this.locks[lockKey].add(editorLinter);
      var scopes = editor.scopeDescriptorForBufferPosition(editor.getCursorBufferPosition()).scopes;
      scopes.push('*');

      var promises = [];
      this.linters.forEach(function (linter) {
        if (_helpers2['default'].shouldTriggerLinter(linter, onChange, scopes)) {
          promises.push(new Promise(function (resolve) {
            resolve(linter.lint(editor));
          }).then(function (results) {
            if (results) {
              _this.emitter.emit('did-update-messages', { linter: linter, messages: results, editor: editor });
            }
          }, _helpers2['default'].error));
        }
      });
      return Promise.all(promises).then(function () {
        return _this.locks[lockKey]['delete'](editorLinter);
      });
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.linters.clear();
      this.subscriptions.dispose();
    }
  }]);

  return LinterRegistry;
})();

exports['default'] = LinterRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7d0JBQzVCLFlBQVk7Ozs7dUJBQ2IsV0FBVzs7OztBQUovQixXQUFXLENBQUE7O0lBTVUsY0FBYztBQUN0QixXQURRLGNBQWMsR0FDbkI7MEJBREssY0FBYzs7QUFFL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxhQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUU7QUFDdEIsU0FBRyxFQUFFLElBQUksT0FBTyxFQUFFO0tBQ25CLENBQUE7O0FBRUQsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQVhrQixjQUFjOztXQVl2QixzQkFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNwQjs7O1dBQ1EsbUJBQUMsTUFBTSxFQUFFO0FBQ2hCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDaEM7OztXQUNRLG1CQUFDLE1BQU0sRUFBRTtBQUNoQixVQUFJO0FBQ0YsOEJBQVMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3ZCLGNBQU0sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFBO0FBQzFCLFlBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO09BQ3pCLENBQUMsT0FBTyxHQUFHLEVBQUU7QUFDWiw2QkFBUSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7T0FDbkI7S0FDRjs7O1dBQ1csc0JBQUMsTUFBTSxFQUFFO0FBQ25CLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7QUFDNUIsY0FBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7QUFDekIsWUFBSSxDQUFDLE9BQU8sVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO09BQzVCO0tBQ0Y7OztXQUNHLGNBQUMsSUFBd0IsRUFBRTs7O1VBQXpCLFFBQVEsR0FBVCxJQUF3QixDQUF2QixRQUFRO1VBQUUsWUFBWSxHQUF2QixJQUF3QixDQUFiLFlBQVk7O0FBQzFCLFVBQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUE7QUFDbEMsVUFBTSxPQUFPLEdBQUcsUUFBUSxHQUFHLEtBQUssR0FBRyxTQUFTLENBQUE7O0FBRTVDLFVBQ0UsQUFBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztBQUNqRCxPQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7QUFDakIsWUFBTSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUU7QUFDL0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO0FBQ3BDLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLElBQzlDLHFCQUFRLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQUFBQztRQUMxQztBQUNBLGlCQUFNO1NBQ1A7O0FBRUQsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDckMsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGdDQUFnQyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFBO0FBQy9GLFlBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRWhCLFVBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNuQixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUM3QixZQUFJLHFCQUFRLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7QUFDekQsa0JBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUU7QUFDMUMsbUJBQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7V0FDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUNqQixnQkFBSSxPQUFPLEVBQUU7QUFDWCxvQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUMsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUMsQ0FBQyxDQUFBO2FBQzlFO1dBQ0YsRUFBRSxxQkFBUSxLQUFLLENBQUMsQ0FBQyxDQUFBO1NBQ25CO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsYUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztlQUNoQyxNQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBTyxDQUFDLFlBQVksQ0FBQztPQUFBLENBQ3pDLENBQUE7S0FDRjs7O1dBQ2tCLDZCQUFDLFFBQVEsRUFBRTtBQUM1QixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDcEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBMUVrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IFZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlclJlZ2lzdHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5saW50ZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5sb2NrcyA9IHtcbiAgICAgIFJlZ3VsYXI6IG5ldyBXZWFrU2V0KCksXG4gICAgICBGbHk6IG5ldyBXZWFrU2V0KClcbiAgICB9XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG4gIGdldExpbnRlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMubGludGVyc1xuICB9XG4gIGhhc0xpbnRlcihsaW50ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5saW50ZXJzLmhhcyhsaW50ZXIpXG4gIH1cbiAgYWRkTGludGVyKGxpbnRlcikge1xuICAgIHRyeSB7XG4gICAgICBWYWxpZGF0ZS5saW50ZXIobGludGVyKVxuICAgICAgbGludGVyLmRlYWN0aXZhdGVkID0gZmFsc2VcbiAgICAgIHRoaXMubGludGVycy5hZGQobGludGVyKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgSGVscGVycy5lcnJvcihlcnIpXG4gICAgfVxuICB9XG4gIGRlbGV0ZUxpbnRlcihsaW50ZXIpIHtcbiAgICBpZiAodGhpcy5saW50ZXJzLmhhcyhsaW50ZXIpKSB7XG4gICAgICBsaW50ZXIuZGVhY3RpdmF0ZWQgPSB0cnVlXG4gICAgICB0aGlzLmxpbnRlcnMuZGVsZXRlKGxpbnRlcilcbiAgICB9XG4gIH1cbiAgbGludCh7b25DaGFuZ2UsIGVkaXRvckxpbnRlcn0pIHtcbiAgICBjb25zdCBlZGl0b3IgPSBlZGl0b3JMaW50ZXIuZWRpdG9yXG4gICAgY29uc3QgbG9ja0tleSA9IG9uQ2hhbmdlID8gJ0ZseScgOiAnUmVndWxhcidcblxuICAgIGlmIChcbiAgICAgIChvbkNoYW5nZSAmJiAhYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIubGludE9uRmx5JykpIHx8IC8vIExpbnQtb24tZmx5IG1pc21hdGNoXG4gICAgICAhZWRpdG9yLmdldFBhdGgoKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCAvLyBOb3Qgc2F2ZWQgYW55d2hlcmUgeWV0XG4gICAgICBlZGl0b3IgIT09IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSAgICB8fCAvLyBOb3QgYWN0aXZlXG4gICAgICB0aGlzLmxvY2tzW2xvY2tLZXldLmhhcyhlZGl0b3JMaW50ZXIpICAgICAgICAgICAgICB8fCAvLyBBbHJlYWR5IGxpbnRpbmdcbiAgICAgIChhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5pZ25vcmVWQ1NJZ25vcmVkRmlsZXMnKSAmJlxuICAgICAgICBIZWxwZXJzLmlzUGF0aElnbm9yZWQoZWRpdG9yLmdldFBhdGgoKSkpICAgICAgICAgICAgLy8gSWdub3JlZCBieSBWQ1NcbiAgICApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMubG9ja3NbbG9ja0tleV0uYWRkKGVkaXRvckxpbnRlcilcbiAgICBjb25zdCBzY29wZXMgPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnNjb3Blc1xuICAgIHNjb3Blcy5wdXNoKCcqJylcblxuICAgIGNvbnN0IHByb21pc2VzID0gW11cbiAgICB0aGlzLmxpbnRlcnMuZm9yRWFjaChsaW50ZXIgPT4ge1xuICAgICAgaWYgKEhlbHBlcnMuc2hvdWxkVHJpZ2dlckxpbnRlcihsaW50ZXIsIG9uQ2hhbmdlLCBzY29wZXMpKSB7XG4gICAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgIHJlc29sdmUobGludGVyLmxpbnQoZWRpdG9yKSlcbiAgICAgICAgfSkudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICBpZiAocmVzdWx0cykge1xuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCB7bGludGVyLCBtZXNzYWdlczogcmVzdWx0cywgZWRpdG9yfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sIEhlbHBlcnMuZXJyb3IpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+XG4gICAgICB0aGlzLmxvY2tzW2xvY2tLZXldLmRlbGV0ZShlZGl0b3JMaW50ZXIpXG4gICAgKVxuICB9XG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmxpbnRlcnMuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuIl19
//# sourceURL=/Users/kswedberg/.atom/packages/linter/lib/linter-registry.js
