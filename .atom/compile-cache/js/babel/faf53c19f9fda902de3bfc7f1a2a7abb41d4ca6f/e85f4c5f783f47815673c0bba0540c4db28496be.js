Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jscsLibCliConfig = require('jscs/lib/cli-config');

var _jscsLibCliConfig2 = _interopRequireDefault(_jscsLibCliConfig);

'use babel';

var grammarScopes = ['source.js', 'source.js.jsx'];

var LinterJSCS = (function () {
  function LinterJSCS() {
    _classCallCheck(this, LinterJSCS);
  }

  _createClass(LinterJSCS, null, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      // Install dependencies using atom-package-deps
      require('atom-package-deps').install('linter-jscs');

      this.observer = atom.workspace.observeTextEditors(function (editor) {
        editor.getBuffer().onWillSave(function () {
          if (grammarScopes.indexOf(editor.getGrammar().scopeName) !== -1 && _this.fixOnSave) {
            process.nextTick(function () {
              _this.fixString();
            });
          }
        });
      });
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.observer.dispose();
    }
  }, {
    key: 'provideLinter',
    value: function provideLinter() {
      var _this2 = this;

      return {
        name: 'JSCS',
        grammarScopes: grammarScopes,
        scope: 'file',
        lintOnFly: true,
        lint: function lint(editor) {
          var JSCS = require('jscs');

          // We need re-initialize JSCS before every lint
          // or it will looses the errors, didn't trace the error
          // must be something with new 2.0.0 JSCS
          _this2.jscs = new JSCS();
          _this2.jscs.registerDefaultRules();

          var filePath = editor.getPath();
          var config = _jscsLibCliConfig2['default'].load(false, _path2['default'].join(_path2['default'].dirname(filePath), _this2.configPath));

          // Options passed to `jscs` from package configuration
          var options = { esnext: _this2.esnext, preset: _this2.preset };

          _this2.jscs.configure(config || options);

          // We don't have a config file present in project directory
          // let's return an empty array of errors
          if (!config && _this2.onlyConfig) return [];

          var text = editor.getText();
          var errors = _this2.jscs.checkString(text, filePath).getErrorList();

          return errors.map(function (_ref) {
            var rule = _ref.rule;
            var message = _ref.message;
            var line = _ref.line;
            var column = _ref.column;

            // Calculate range to make the error whole line
            // without the indentation at begining of line
            var indentLevel = editor.indentationForBufferRow(line - 1);
            var startCol = editor.getTabLength() * indentLevel;
            var endCol = editor.getBuffer().lineLengthForRow(line - 1);
            var range = [[line - 1, startCol], [line - 1, endCol]];

            var type = _this2.displayAs;
            var html = '<span class=\'badge badge-flexible\'>' + rule + '</span> ' + message;

            return { type: type, html: html, filePath: filePath, range: range };
          });
        }
      };
    }
  }, {
    key: 'fixString',
    value: function fixString() {
      if (this.isMissingConfig && this.onlyConfig) return;

      var editor = atom.workspace.getActiveTextEditor();
      var path = editor.getPath();
      var text = editor.getText();
      var fixedText = this.jscs.fixString(text, path).output;
      if (text === fixedText) return;

      var cursorPosition = editor.getCursorScreenPosition();
      editor.setText(fixedText);
      editor.setCursorScreenPosition(cursorPosition);
    }
  }, {
    key: 'config',
    value: {
      preset: {
        title: 'Preset',
        description: 'Preset option is ignored if a config file is found for the linter.',
        type: 'string',
        'default': 'airbnb',
        'enum': ['airbnb', 'crockford', 'google', 'grunt', 'idiomatic', 'jquery', 'mdcs', 'node-style-guide', 'wikimedia', 'wordpress', 'yandex']
      },
      esnext: {
        description: 'Attempts to parse your code as ES6+, JSX, and Flow using the babel-jscs package as the parser.',
        type: 'boolean',
        'default': false
      },
      onlyConfig: {
        title: 'Only Config',
        description: 'Disable linter if there is no config file found for the linter.',
        type: 'boolean',
        'default': false
      },
      fixOnSave: {
        title: 'Fix on save',
        description: 'Fix JavaScript on save',
        type: 'boolean',
        'default': false
      },
      displayAs: {
        title: 'Display errors as',
        type: 'string',
        'default': 'error',
        'enum': ['error', 'warning', 'jscs Warning', 'jscs Error']
      },
      configPath: {
        title: 'Config file path (Use relative path to your project)',
        type: 'string',
        'default': ''
      }
    },
    enumerable: true
  }, {
    key: 'preset',
    get: function get() {
      return atom.config.get('linter-jscs.preset');
    }
  }, {
    key: 'esnext',
    get: function get() {
      return atom.config.get('linter-jscs.esnext');
    }
  }, {
    key: 'onlyConfig',
    get: function get() {
      return atom.config.get('linter-jscs.onlyConfig');
    }
  }, {
    key: 'fixOnSave',
    get: function get() {
      return atom.config.get('linter-jscs.fixOnSave');
    }
  }, {
    key: 'displayAs',
    get: function get() {
      return atom.config.get('linter-jscs.displayAs');
    }
  }, {
    key: 'configPath',
    get: function get() {
      return atom.config.get('linter-jscs.configPath');
    }
  }]);

  return LinterJSCS;
})();

exports['default'] = LinterJSCS;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7OztnQ0FDQSxxQkFBcUI7Ozs7QUFINUMsV0FBVyxDQUFDOztBQUtaLElBQU0sYUFBYSxHQUFHLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDOztJQUVoQyxVQUFVO1dBQVYsVUFBVTswQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQWdFZCxvQkFBRzs7OztBQUVoQixhQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXBELFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUM1RCxjQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQU07QUFDbEMsY0FBSSxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxNQUFLLFNBQVMsRUFBRTtBQUNqRixtQkFBTyxDQUFDLFFBQVEsQ0FBQyxZQUFNO0FBQ3JCLG9CQUFLLFNBQVMsRUFBRSxDQUFDO2FBQ2xCLENBQUMsQ0FBQztXQUNKO1NBQ0YsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztXQUVnQixzQkFBRztBQUNsQixVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3pCOzs7V0FFbUIseUJBQUc7OztBQUNyQixhQUFPO0FBQ0wsWUFBSSxFQUFFLE1BQU07QUFDWixxQkFBYSxFQUFiLGFBQWE7QUFDYixhQUFLLEVBQUUsTUFBTTtBQUNiLGlCQUFTLEVBQUUsSUFBSTtBQUNmLFlBQUksRUFBRSxjQUFDLE1BQU0sRUFBSztBQUNoQixjQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFB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LENBQUM7S0FDOUM7OztTQUVvQixlQUFHO0FBQ3RCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUNsRDs7O1NBRW1CLGVBQUc7QUFDckIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQ2pEOzs7U0FFbUIsZUFBRztBQUNyQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDakQ7OztTQUVvQixlQUFHO0FBQ3RCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUNsRDs7O1NBOURrQixVQUFVOzs7cUJBQVYsVUFBVTtBQW1KOUIsQ0FBQyIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc2NzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGNvbmZpZ0ZpbGUgZnJvbSAnanNjcy9saWIvY2xpLWNvbmZpZyc7XG5cbmNvbnN0IGdyYW1tYXJTY29wZXMgPSBbJ3NvdXJjZS5qcycsICdzb3VyY2UuanMuanN4J107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlckpTQ1Mge1xuXG4gIHN0YXRpYyBjb25maWcgPSB7XG4gICAgcHJlc2V0OiB7XG4gICAgICB0aXRsZTogJ1ByZXNldCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1ByZXNldCBvcHRpb24gaXMgaWdub3JlZCBpZiBhIGNvbmZpZyBmaWxlIGlzIGZvdW5kIGZvciB0aGUgbGludGVyLicsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdhaXJibmInLFxuICAgICAgZW51bTogWydhaXJibmInLCAnY3JvY2tmb3JkJywgJ2dvb2dsZScsICdncnVudCcsICdpZGlvbWF0aWMnLCAnanF1ZXJ5JywgJ21kY3MnLCAnbm9kZS1zdHlsZS1ndWlkZScsICd3aWtpbWVkaWEnLCAnd29yZHByZXNzJywgJ3lhbmRleCddXG4gICAgfSxcbiAgICBlc25leHQ6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnQXR0ZW1wdHMgdG8gcGFyc2UgeW91ciBjb2RlIGFzIEVTNissIEpTWCwgYW5kIEZsb3cgdXNpbmcgdGhlIGJhYmVsLWpzY3MgcGFja2FnZSBhcyB0aGUgcGFyc2VyLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgb25seUNvbmZpZzoge1xuICAgICAgdGl0bGU6ICdPbmx5IENvbmZpZycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0Rpc2FibGUgbGludGVyIGlmIHRoZXJlIGlzIG5vIGNvbmZpZyBmaWxlIGZvdW5kIGZvciB0aGUgbGludGVyLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgZml4T25TYXZlOiB7XG4gICAgICB0aXRsZTogJ0ZpeCBvbiBzYXZlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRml4IEphdmFTY3JpcHQgb24gc2F2ZScsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIH0sXG4gICAgZGlzcGxheUFzOiB7XG4gICAgICB0aXRsZTogJ0Rpc3BsYXkgZXJyb3JzIGFzJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2Vycm9yJyxcbiAgICAgIGVudW06IFsnZXJyb3InLCAnd2FybmluZycsICdqc2NzIFdhcm5pbmcnLCAnanNjcyBFcnJvciddXG4gICAgfSxcbiAgICBjb25maWdQYXRoOiB7XG4gICAgICB0aXRsZTogJ0NvbmZpZyBmaWxlIHBhdGggKFVzZSByZWxhdGl2ZSBwYXRoIHRvIHlvdXIgcHJvamVjdCknLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnJ1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXQgcHJlc2V0KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLnByZXNldCcpO1xuICB9XG5cbiAgc3RhdGljIGdldCBlc25leHQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuZXNuZXh0Jyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IG9ubHlDb25maWcoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3Mub25seUNvbmZpZycpO1xuICB9XG5cbiAgc3RhdGljIGdldCBmaXhPblNhdmUoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuZml4T25TYXZlJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGRpc3BsYXlBcygpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5kaXNwbGF5QXMnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgY29uZmlnUGF0aCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5jb25maWdQYXRoJyk7XG4gIH1cblxuICBzdGF0aWMgYWN0aXZhdGUoKSB7XG4gICAgLy8gSW5zdGFsbCBkZXBlbmRlbmNpZXMgdXNpbmcgYXRvbS1wYWNrYWdlLWRlcHNcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1qc2NzJyk7XG5cbiAgICB0aGlzLm9ic2VydmVyID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5vbldpbGxTYXZlKCgpID0+IHtcbiAgICAgICAgaWYgKGdyYW1tYXJTY29wZXMuaW5kZXhPZihlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkgIT09IC0xICYmIHRoaXMuZml4T25TYXZlKSB7XG4gICAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpeFN0cmluZygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMub2JzZXJ2ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgc3RhdGljIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdKU0NTJyxcbiAgICAgIGdyYW1tYXJTY29wZXMsXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKGVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBKU0NTID0gcmVxdWlyZSgnanNjcycpO1xuXG4gICAgICAgIC8vIFdlIG5lZWQgcmUtaW5pdGlhbGl6ZSBKU0NTIGJlZm9yZSBldmVyeSBsaW50XG4gICAgICAgIC8vIG9yIGl0IHdpbGwgbG9vc2VzIHRoZSBlcnJvcnMsIGRpZG4ndCB0cmFjZSB0aGUgZXJyb3JcbiAgICAgICAgLy8gbXVzdCBiZSBzb21ldGhpbmcgd2l0aCBuZXcgMi4wLjAgSlNDU1xuICAgICAgICB0aGlzLmpzY3MgPSBuZXcgSlNDUygpO1xuICAgICAgICB0aGlzLmpzY3MucmVnaXN0ZXJEZWZhdWx0UnVsZXMoKTtcblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ0ZpbGUubG9hZChmYWxzZSxcbiAgICAgICAgICBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgdGhpcy5jb25maWdQYXRoKSk7XG5cbiAgICAgICAgLy8gT3B0aW9ucyBwYXNzZWQgdG8gYGpzY3NgIGZyb20gcGFja2FnZSBjb25maWd1cmF0aW9uXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGVzbmV4dDogdGhpcy5lc25leHQsIHByZXNldDogdGhpcy5wcmVzZXQgfTtcblxuICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKGNvbmZpZyB8fCBvcHRpb25zKTtcblxuICAgICAgICAvLyBXZSBkb24ndCBoYXZlIGEgY29uZmlnIGZpbGUgcHJlc2VudCBpbiBwcm9qZWN0IGRpcmVjdG9yeVxuICAgICAgICAvLyBsZXQncyByZXR1cm4gYW4gZW1wdHkgYXJyYXkgb2YgZXJyb3JzXG4gICAgICAgIGlmICghY29uZmlnICYmIHRoaXMub25seUNvbmZpZykgcmV0dXJuIFtdO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBlcnJvcnMgPSB0aGlzLmpzY3NcbiAgICAgICAgICAuY2hlY2tTdHJpbmcodGV4dCwgZmlsZVBhdGgpXG4gICAgICAgICAgLmdldEVycm9yTGlzdCgpO1xuXG4gICAgICAgIHJldHVybiBlcnJvcnMubWFwKCh7IHJ1bGUsIG1lc3NhZ2UsIGxpbmUsIGNvbHVtbiB9KSA9PiB7XG5cbiAgICAgICAgICAvLyBDYWxjdWxhdGUgcmFuZ2UgdG8gbWFrZSB0aGUgZXJyb3Igd2hvbGUgbGluZVxuICAgICAgICAgIC8vIHdpdGhvdXQgdGhlIGluZGVudGF0aW9uIGF0IGJlZ2luaW5nIG9mIGxpbmVcbiAgICAgICAgICBjb25zdCBpbmRlbnRMZXZlbCA9IGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhsaW5lIC0gMSk7XG4gICAgICAgICAgY29uc3Qgc3RhcnRDb2wgPSBlZGl0b3IuZ2V0VGFiTGVuZ3RoKCkgKiBpbmRlbnRMZXZlbDtcbiAgICAgICAgICBjb25zdCBlbmRDb2wgPSBlZGl0b3IuZ2V0QnVmZmVyKCkubGluZUxlbmd0aEZvclJvdyhsaW5lIC0gMSk7XG4gICAgICAgICAgY29uc3QgcmFuZ2UgPSBbW2xpbmUgLSAxLCBzdGFydENvbF0sIFtsaW5lIC0gMSwgZW5kQ29sXV07XG5cbiAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5kaXNwbGF5QXM7XG4gICAgICAgICAgY29uc3QgaHRtbCA9IGA8c3BhbiBjbGFzcz0nYmFkZ2UgYmFkZ2UtZmxleGlibGUnPiR7cnVsZX08L3NwYW4+ICR7bWVzc2FnZX1gO1xuXG4gICAgICAgICAgcmV0dXJuIHsgdHlwZSwgaHRtbCwgZmlsZVBhdGgsIHJhbmdlIH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZml4U3RyaW5nKCkge1xuICAgIGlmICh0aGlzLmlzTWlzc2luZ0NvbmZpZyAmJiB0aGlzLm9ubHlDb25maWcpIHJldHVybjtcblxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBwYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICBjb25zdCBmaXhlZFRleHQgPSB0aGlzLmpzY3MuZml4U3RyaW5nKHRleHQsIHBhdGgpLm91dHB1dDtcbiAgICBpZiAodGV4dCA9PT0gZml4ZWRUZXh0KSByZXR1cm47XG5cbiAgICBjb25zdCBjdXJzb3JQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpO1xuICAgIGVkaXRvci5zZXRUZXh0KGZpeGVkVGV4dCk7XG4gICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKGN1cnNvclBvc2l0aW9uKTtcbiAgfVxufTtcbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/linter-jscs/index.js
