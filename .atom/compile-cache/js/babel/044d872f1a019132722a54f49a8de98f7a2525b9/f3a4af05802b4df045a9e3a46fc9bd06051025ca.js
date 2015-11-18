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
      require("atom-package-deps").install("linter-jscs");

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
          var config = _jscsLibCliConfig2['default'].load(false, _path2['default'].dirname(filePath));

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
  }]);

  return LinterJSCS;
})();

exports['default'] = LinterJSCS;
;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7OztnQ0FDQSxxQkFBcUI7Ozs7QUFINUMsV0FBVyxDQUFDOztBQUtaLElBQU0sYUFBYSxHQUFHLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDOztJQUVoQyxVQUFVO1dBQVYsVUFBVTswQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQXVEZCxvQkFBRzs7OztBQUVoQixhQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXBELFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUM1RCxjQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQU07QUFDbEMsY0FBSSxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxNQUFLLFNBQVMsRUFBRTtBQUNqRixtQkFBTyxDQUFDLFFBQVEsQ0FBQyxZQUFNO0FBQ3JCLG9CQUFLLFNBQVMsRUFBRSxDQUFDO2FBQ2xCLENBQUMsQ0FBQztXQUNKO1NBQ0YsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztXQUVnQixzQkFBRztBQUNsQixVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3pCOzs7V0FFbUIseUJBQUc7OztBQUNyQixhQUFPO0FBQ0wsWUFBSSxFQUFFLE1BQU07QUFDWixxQkFBYSxFQUFiLGFBQWE7QUFDYixhQUFLLEVBQUUsTUFBTTtBQUNiLGlCQUFTLEVBQUUsSUFBSTtBQUNmLFlBQUksRUFBRSxjQUFDLE1BQU0sRUFBSztBQUNoQixjQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFB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LENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQ2pEOzs7U0FFbUIsZUFBRztBQUNyQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDakQ7OztTQXJEa0IsVUFBVTs7O3FCQUFWLFVBQVU7QUF5STlCLENBQUMiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjb25maWdGaWxlIGZyb20gJ2pzY3MvbGliL2NsaS1jb25maWcnO1xuXG5jb25zdCBncmFtbWFyU2NvcGVzID0gWydzb3VyY2UuanMnLCAnc291cmNlLmpzLmpzeCddO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJKU0NTIHtcblxuICBzdGF0aWMgY29uZmlnID0ge1xuICAgIHByZXNldDoge1xuICAgICAgdGl0bGU6ICdQcmVzZXQnLFxuICAgICAgZGVzY3JpcHRpb246ICdQcmVzZXQgb3B0aW9uIGlzIGlnbm9yZWQgaWYgYSBjb25maWcgZmlsZSBpcyBmb3VuZCBmb3IgdGhlIGxpbnRlci4nLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnYWlyYm5iJyxcbiAgICAgIGVudW06IFsnYWlyYm5iJywgJ2Nyb2NrZm9yZCcsICdnb29nbGUnLCAnZ3J1bnQnLCAnaWRpb21hdGljJywgJ2pxdWVyeScsICdtZGNzJywgJ25vZGUtc3R5bGUtZ3VpZGUnLCAnd2lraW1lZGlhJywgJ3dvcmRwcmVzcycsICd5YW5kZXgnXVxuICAgIH0sXG4gICAgZXNuZXh0OiB7XG4gICAgICBkZXNjcmlwdGlvbjogJ0F0dGVtcHRzIHRvIHBhcnNlIHlvdXIgY29kZSBhcyBFUzYrLCBKU1gsIGFuZCBGbG93IHVzaW5nIHRoZSBiYWJlbC1qc2NzIHBhY2thZ2UgYXMgdGhlIHBhcnNlci4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIG9ubHlDb25maWc6IHtcbiAgICAgIHRpdGxlOiAnT25seSBDb25maWcnLFxuICAgICAgZGVzY3JpcHRpb246ICdEaXNhYmxlIGxpbnRlciBpZiB0aGVyZSBpcyBubyBjb25maWcgZmlsZSBmb3VuZCBmb3IgdGhlIGxpbnRlci4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGZpeE9uU2F2ZToge1xuICAgICAgdGl0bGU6ICdGaXggb24gc2F2ZScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZpeCBKYXZhU2NyaXB0IG9uIHNhdmUnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGRpc3BsYXlBczoge1xuICAgICAgdGl0bGU6ICdEaXNwbGF5IGVycm9ycyBhcycsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdlcnJvcicsXG4gICAgICBlbnVtOiBbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnanNjcyBXYXJuaW5nJywgJ2pzY3MgRXJyb3InXVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXQgcHJlc2V0KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLnByZXNldCcpO1xuICB9XG5cbiAgc3RhdGljIGdldCBlc25leHQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuZXNuZXh0Jyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IG9ubHlDb25maWcoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3Mub25seUNvbmZpZycpO1xuICB9XG5cbiAgc3RhdGljIGdldCBmaXhPblNhdmUoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MuZml4T25TYXZlJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGRpc3BsYXlBcygpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5kaXNwbGF5QXMnKTtcbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmF0ZSgpIHtcbiAgICAvLyBJbnN0YWxsIGRlcGVuZGVuY2llcyB1c2luZyBhdG9tLXBhY2thZ2UtZGVwc1xuICAgIHJlcXVpcmUoXCJhdG9tLXBhY2thZ2UtZGVwc1wiKS5pbnN0YWxsKFwibGludGVyLWpzY3NcIik7XG5cbiAgICB0aGlzLm9ic2VydmVyID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGVkaXRvci5nZXRCdWZmZXIoKS5vbldpbGxTYXZlKCgpID0+IHtcbiAgICAgICAgaWYgKGdyYW1tYXJTY29wZXMuaW5kZXhPZihlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkgIT09IC0xICYmIHRoaXMuZml4T25TYXZlKSB7XG4gICAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpeFN0cmluZygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMub2JzZXJ2ZXIuZGlzcG9zZSgpO1xuICB9XG5cbiAgc3RhdGljIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdKU0NTJyxcbiAgICAgIGdyYW1tYXJTY29wZXMsXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogKGVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBKU0NTID0gcmVxdWlyZSgnanNjcycpO1xuXG4gICAgICAgIC8vIFdlIG5lZWQgcmUtaW5pdGlhbGl6ZSBKU0NTIGJlZm9yZSBldmVyeSBsaW50XG4gICAgICAgIC8vIG9yIGl0IHdpbGwgbG9vc2VzIHRoZSBlcnJvcnMsIGRpZG4ndCB0cmFjZSB0aGUgZXJyb3JcbiAgICAgICAgLy8gbXVzdCBiZSBzb21ldGhpbmcgd2l0aCBuZXcgMi4wLjAgSlNDU1xuICAgICAgICB0aGlzLmpzY3MgPSBuZXcgSlNDUygpO1xuICAgICAgICB0aGlzLmpzY3MucmVnaXN0ZXJEZWZhdWx0UnVsZXMoKTtcblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGNvbmZpZ0ZpbGUubG9hZChmYWxzZSwgcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSk7XG5cbiAgICAgICAgLy8gT3B0aW9ucyBwYXNzZWQgdG8gYGpzY3NgIGZyb20gcGFja2FnZSBjb25maWd1cmF0aW9uXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGVzbmV4dDogdGhpcy5lc25leHQsIHByZXNldDogdGhpcy5wcmVzZXQgfTtcblxuICAgICAgICB0aGlzLmpzY3MuY29uZmlndXJlKGNvbmZpZyB8fCBvcHRpb25zKTtcblxuICAgICAgICAvLyBXZSBkb24ndCBoYXZlIGEgY29uZmlnIGZpbGUgcHJlc2VudCBpbiBwcm9qZWN0IGRpcmVjdG9yeVxuICAgICAgICAvLyBsZXQncyByZXR1cm4gYW4gZW1wdHkgYXJyYXkgb2YgZXJyb3JzXG4gICAgICAgIGlmICghY29uZmlnICYmIHRoaXMub25seUNvbmZpZykgcmV0dXJuIFtdO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBlcnJvcnMgPSB0aGlzLmpzY3NcbiAgICAgICAgICAuY2hlY2tTdHJpbmcodGV4dCwgZmlsZVBhdGgpXG4gICAgICAgICAgLmdldEVycm9yTGlzdCgpO1xuXG4gICAgICAgIHJldHVybiBlcnJvcnMubWFwKCh7IHJ1bGUsIG1lc3NhZ2UsIGxpbmUsIGNvbHVtbiB9KSA9PiB7XG5cbiAgICAgICAgICAvLyBDYWxjdWxhdGUgcmFuZ2UgdG8gbWFrZSB0aGUgZXJyb3Igd2hvbGUgbGluZVxuICAgICAgICAgIC8vIHdpdGhvdXQgdGhlIGluZGVudGF0aW9uIGF0IGJlZ2luaW5nIG9mIGxpbmVcbiAgICAgICAgICBjb25zdCBpbmRlbnRMZXZlbCA9IGVkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhsaW5lIC0gMSk7XG4gICAgICAgICAgY29uc3Qgc3RhcnRDb2wgPSBlZGl0b3IuZ2V0VGFiTGVuZ3RoKCkgKiBpbmRlbnRMZXZlbDtcbiAgICAgICAgICBjb25zdCBlbmRDb2wgPSBlZGl0b3IuZ2V0QnVmZmVyKCkubGluZUxlbmd0aEZvclJvdyhsaW5lIC0gMSk7XG4gICAgICAgICAgY29uc3QgcmFuZ2UgPSBbW2xpbmUgLSAxLCBzdGFydENvbF0sIFtsaW5lIC0gMSwgZW5kQ29sXV07XG5cbiAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5kaXNwbGF5QXM7XG4gICAgICAgICAgY29uc3QgaHRtbCA9IGA8c3BhbiBjbGFzcz0nYmFkZ2UgYmFkZ2UtZmxleGlibGUnPiR7cnVsZX08L3NwYW4+ICR7bWVzc2FnZX1gO1xuXG4gICAgICAgICAgcmV0dXJuIHsgdHlwZSwgaHRtbCwgZmlsZVBhdGgsIHJhbmdlIH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZml4U3RyaW5nKCkge1xuICAgIGlmICh0aGlzLmlzTWlzc2luZ0NvbmZpZyAmJiB0aGlzLm9ubHlDb25maWcpIHJldHVybjtcblxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBwYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKTtcbiAgICBjb25zdCBmaXhlZFRleHQgPSB0aGlzLmpzY3MuZml4U3RyaW5nKHRleHQsIHBhdGgpLm91dHB1dDtcbiAgICBpZiAodGV4dCA9PT0gZml4ZWRUZXh0KSByZXR1cm47XG5cbiAgICBjb25zdCBjdXJzb3JQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpO1xuICAgIGVkaXRvci5zZXRUZXh0KGZpeGVkVGV4dCk7XG4gICAgZWRpdG9yLnNldEN1cnNvclNjcmVlblBvc2l0aW9uKGN1cnNvclBvc2l0aW9uKTtcbiAgfVxufTtcbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/linter-jscs/index.js
