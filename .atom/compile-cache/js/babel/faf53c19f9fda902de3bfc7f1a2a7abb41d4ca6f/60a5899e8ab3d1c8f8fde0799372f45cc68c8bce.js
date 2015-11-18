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
      if (!this.jscs) return;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7OztnQ0FDQSxxQkFBcUI7Ozs7QUFINUMsV0FBVyxDQUFDOztBQUtaLElBQU0sYUFBYSxHQUFHLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDOztJQUVoQyxVQUFVO1dBQVYsVUFBVTswQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQWdFZCxvQkFBRzs7OztBQUVoQixhQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXBELFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUM1RCxjQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQU07QUFDbEMsY0FBSSxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxNQUFLLFNBQVMsRUFBRTtBQUNqRixtQkFBTyxDQUFDLFFBQVEsQ0FBQyxZQUFNO0FBQ3JCLG9CQUFLLFNBQVMsRUFBRSxDQUFDO2FBQ2xCLENBQUMsQ0FBQztXQUNKO1NBQ0YsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztXQUVnQixzQkFBRztBQUNsQixVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3pCOzs7V0FFbUIseUJBQUc7OztBQUNyQixhQUFPO0FBQ0wsWUFBSSxFQUFFLE1BQU07QUFDWixxQkFBYSxFQUFiLGFBQWE7QUFDYixhQUFLLEVBQUUsTUFBTTtBQUNiLGlCQUFTLEVBQUUsSUFBSTtBQUNmLFlBQUksRUFBRSxjQUFDLE1BQU0sRUFBSztBQUNoQixjQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFB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SUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUM5Qzs7O1NBRW9CLGVBQUc7QUFDdEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQ2xEOzs7U0FFbUIsZUFBRztBQUNyQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDakQ7OztTQUVtQixlQUFHO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUNqRDs7O1NBRW9CLGVBQUc7QUFDdEIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQ2xEOzs7U0E5RGtCLFVBQVU7OztxQkFBVixVQUFVO0FBb0o5QixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3MvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY29uZmlnRmlsZSBmcm9tICdqc2NzL2xpYi9jbGktY29uZmlnJztcblxuY29uc3QgZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLmpzJywgJ3NvdXJjZS5qcy5qc3gnXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGludGVySlNDUyB7XG5cbiAgc3RhdGljIGNvbmZpZyA9IHtcbiAgICBwcmVzZXQ6IHtcbiAgICAgIHRpdGxlOiAnUHJlc2V0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJlc2V0IG9wdGlvbiBpcyBpZ25vcmVkIGlmIGEgY29uZmlnIGZpbGUgaXMgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ2FpcmJuYicsXG4gICAgICBlbnVtOiBbJ2FpcmJuYicsICdjcm9ja2ZvcmQnLCAnZ29vZ2xlJywgJ2dydW50JywgJ2lkaW9tYXRpYycsICdqcXVlcnknLCAnbWRjcycsICdub2RlLXN0eWxlLWd1aWRlJywgJ3dpa2ltZWRpYScsICd3b3JkcHJlc3MnLCAneWFuZGV4J11cbiAgICB9LFxuICAgIGVzbmV4dDoge1xuICAgICAgZGVzY3JpcHRpb246ICdBdHRlbXB0cyB0byBwYXJzZSB5b3VyIGNvZGUgYXMgRVM2KywgSlNYLCBhbmQgRmxvdyB1c2luZyB0aGUgYmFiZWwtanNjcyBwYWNrYWdlIGFzIHRoZSBwYXJzZXIuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBvbmx5Q29uZmlnOiB7XG4gICAgICB0aXRsZTogJ09ubHkgQ29uZmlnJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSBsaW50ZXIgaWYgdGhlcmUgaXMgbm8gY29uZmlnIGZpbGUgZm91bmQgZm9yIHRoZSBsaW50ZXIuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBmaXhPblNhdmU6IHtcbiAgICAgIHRpdGxlOiAnRml4IG9uIHNhdmUnLFxuICAgICAgZGVzY3JpcHRpb246ICdGaXggSmF2YVNjcmlwdCBvbiBzYXZlJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBkaXNwbGF5QXM6IHtcbiAgICAgIHRpdGxlOiAnRGlzcGxheSBlcnJvcnMgYXMnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnZXJyb3InLFxuICAgICAgZW51bTogWydlcnJvcicsICd3YXJuaW5nJywgJ2pzY3MgV2FybmluZycsICdqc2NzIEVycm9yJ11cbiAgICB9LFxuICAgIGNvbmZpZ1BhdGg6IHtcbiAgICAgIHRpdGxlOiAnQ29uZmlnIGZpbGUgcGF0aCAoVXNlIHJlbGF0aXZlIHBhdGggdG8geW91ciBwcm9qZWN0KScsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcnXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldCBwcmVzZXQoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnbGludGVyLWpzY3MucHJlc2V0Jyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGVzbmV4dCgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5lc25leHQnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgb25seUNvbmZpZygpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5vbmx5Q29uZmlnJyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGZpeE9uU2F2ZSgpIHtcbiAgICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItanNjcy5maXhPblNhdmUnKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgZGlzcGxheUFzKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmRpc3BsYXlBcycpO1xuICB9XG5cbiAgc3RhdGljIGdldCBjb25maWdQYXRoKCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1qc2NzLmNvbmZpZ1BhdGgnKTtcbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmF0ZSgpIHtcbiAgICAvLyBJbnN0YWxsIGRlcGVuZGVuY2llcyB1c2luZyBhdG9tLXBhY2thZ2UtZGVwc1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWpzY3MnKTtcblxuICAgIHRoaXMub2JzZXJ2ZXIgPSBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUoKCkgPT4ge1xuICAgICAgICBpZiAoZ3JhbW1hclNjb3Blcy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKSAhPT0gLTEgJiYgdGhpcy5maXhPblNhdmUpIHtcbiAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZml4U3RyaW5nKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5vYnNlcnZlci5kaXNwb3NlKCk7XG4gIH1cblxuICBzdGF0aWMgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0pTQ1MnLFxuICAgICAgZ3JhbW1hclNjb3BlcyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiAoZWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IEpTQ1MgPSByZXF1aXJlKCdqc2NzJyk7XG5cbiAgICAgICAgLy8gV2UgbmVlZCByZS1pbml0aWFsaXplIEpTQ1MgYmVmb3JlIGV2ZXJ5IGxpbnRcbiAgICAgICAgLy8gb3IgaXQgd2lsbCBsb29zZXMgdGhlIGVycm9ycywgZGlkbid0IHRyYWNlIHRoZSBlcnJvclxuICAgICAgICAvLyBtdXN0IGJlIHNvbWV0aGluZyB3aXRoIG5ldyAyLjAuMCBKU0NTXG4gICAgICAgIHRoaXMuanNjcyA9IG5ldyBKU0NTKCk7XG4gICAgICAgIHRoaXMuanNjcy5yZWdpc3RlckRlZmF1bHRSdWxlcygpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gY29uZmlnRmlsZS5sb2FkKGZhbHNlLFxuICAgICAgICAgIHBhdGguam9pbihwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCB0aGlzLmNvbmZpZ1BhdGgpKTtcblxuICAgICAgICAvLyBPcHRpb25zIHBhc3NlZCB0byBganNjc2AgZnJvbSBwYWNrYWdlIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgZXNuZXh0OiB0aGlzLmVzbmV4dCwgcHJlc2V0OiB0aGlzLnByZXNldCB9O1xuXG4gICAgICAgIHRoaXMuanNjcy5jb25maWd1cmUoY29uZmlnIHx8IG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIFdlIGRvbid0IGhhdmUgYSBjb25maWcgZmlsZSBwcmVzZW50IGluIHByb2plY3QgZGlyZWN0b3J5XG4gICAgICAgIC8vIGxldCdzIHJldHVybiBhbiBlbXB0eSBhcnJheSBvZiBlcnJvcnNcbiAgICAgICAgaWYgKCFjb25maWcgJiYgdGhpcy5vbmx5Q29uZmlnKSByZXR1cm4gW107XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IHRoaXMuanNjc1xuICAgICAgICAgIC5jaGVja1N0cmluZyh0ZXh0LCBmaWxlUGF0aClcbiAgICAgICAgICAuZ2V0RXJyb3JMaXN0KCk7XG5cbiAgICAgICAgcmV0dXJuIGVycm9ycy5tYXAoKHsgcnVsZSwgbWVzc2FnZSwgbGluZSwgY29sdW1uIH0pID0+IHtcblxuICAgICAgICAgIC8vIENhbGN1bGF0ZSByYW5nZSB0byBtYWtlIHRoZSBlcnJvciB3aG9sZSBsaW5lXG4gICAgICAgICAgLy8gd2l0aG91dCB0aGUgaW5kZW50YXRpb24gYXQgYmVnaW5pbmcgb2YgbGluZVxuICAgICAgICAgIGNvbnN0IGluZGVudExldmVsID0gZWRpdG9yLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KGxpbmUgLSAxKTtcbiAgICAgICAgICBjb25zdCBzdGFydENvbCA9IGVkaXRvci5nZXRUYWJMZW5ndGgoKSAqIGluZGVudExldmVsO1xuICAgICAgICAgIGNvbnN0IGVuZENvbCA9IGVkaXRvci5nZXRCdWZmZXIoKS5saW5lTGVuZ3RoRm9yUm93KGxpbmUgLSAxKTtcbiAgICAgICAgICBjb25zdCByYW5nZSA9IFtbbGluZSAtIDEsIHN0YXJ0Q29sXSwgW2xpbmUgLSAxLCBlbmRDb2xdXTtcblxuICAgICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmRpc3BsYXlBcztcbiAgICAgICAgICBjb25zdCBodG1sID0gYDxzcGFuIGNsYXNzPSdiYWRnZSBiYWRnZS1mbGV4aWJsZSc+JHtydWxlfTwvc3Bhbj4gJHttZXNzYWdlfWA7XG5cbiAgICAgICAgICByZXR1cm4geyB0eXBlLCBodG1sLCBmaWxlUGF0aCwgcmFuZ2UgfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmaXhTdHJpbmcoKSB7XG4gICAgaWYgKHRoaXMuaXNNaXNzaW5nQ29uZmlnICYmIHRoaXMub25seUNvbmZpZykgcmV0dXJuO1xuICAgIGlmICghdGhpcy5qc2NzKSByZXR1cm47XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgY29uc3QgcGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgY29uc3QgZml4ZWRUZXh0ID0gdGhpcy5qc2NzLmZpeFN0cmluZyh0ZXh0LCBwYXRoKS5vdXRwdXQ7XG4gICAgaWYgKHRleHQgPT09IGZpeGVkVGV4dCkgcmV0dXJuO1xuXG4gICAgY29uc3QgY3Vyc29yUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKTtcbiAgICBlZGl0b3Iuc2V0VGV4dChmaXhlZFRleHQpO1xuICAgIGVkaXRvci5zZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbihjdXJzb3JQb3NpdGlvbik7XG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/kswedberg/.atom/packages/linter-jscs/index.js
