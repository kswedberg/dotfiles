Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _atom = require('atom');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

'use babel';

exports['default'] = {
  config: _config2['default'],
  activate: function activate() {
    atom.commands.add('atom-workspace', 'jscs-fixer:fix', fixFile);
  }
};

var fixFile = function fixFile() {
  var _atom$project$getPaths = atom.project.getPaths();

  var _atom$project$getPaths2 = _slicedToArray(_atom$project$getPaths, 1);

  var rootDir = _atom$project$getPaths2[0];

  var editor = atom.workspace.getActiveTextEditor();
  var configuration = atom.config.get('jscs-fixer');

  if (rootDir && editor && editor.getPath) {
    var filePath = editor.getPath();
    var rulesFilePath = _path2['default'].join(rootDir, '.jscsrc');

    if (!filePath) {
      return atom.notifications.addWarning('Save the file before fixing it.', { dismissable: true });
    }

    var command = configuration.jscsPath;
    var args = ['' + filePath, '--fix'];
    var options = { cwd: _path2['default'].dirname(filePath) };

    if (_fs2['default'].existsSync(rulesFilePath)) {
      args.push('--config ' + rulesFilePath);
    } else {
      args.push('--preset=' + configuration.defaultPreset);
    }

    if (atom.config.get('jscs-fixer.esprima')) {
      args.push('--esprima=' + configuration.esprimaPath);
    }

    new _atom.BufferedNodeProcess({ command: command, args: args, options: options, stdout: stdout, stderr: stderr, exit: exit });
  }
};

var stdout = function stdout(msg) {
  if (atom.config.get('jscs-fixer.notifications')) {
    atom.notifications.addWarning(msg, { dismissable: true });
  }
};
var stderr = function stderr(msg) {
  if (atom.config.get('jscs-fixer.notifications')) {
    atom.notifications.addError(msg, { dismissable: true });
  }
};
var exit = function exit(code) {
  if (atom.config.get('jscs-fixer.notifications') && code === 0) {
    atom.notifications.addInfo('File Fixed', { dismissable: true });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvanNjcy1maXhlci9saWIvanNjc2ZpeGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O2tCQUNSLElBQUk7Ozs7b0JBQ2UsTUFBTTs7c0JBQ3JCLFVBQVU7Ozs7QUFMN0IsV0FBVyxDQUFDOztxQkFPRztBQUNiLFFBQU0scUJBQUE7QUFDTixVQUFRLEVBQUEsb0JBQUc7QUFBQyxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQTtHQUFDO0NBQzVFOztBQUVELElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxHQUFTOytCQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFOzs7O01BQWxDLE9BQU87O0FBQ2QsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ25ELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUVuRCxNQUFJLE9BQU8sSUFBSyxNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sQUFBQyxFQUFFO0FBQ3pDLFFBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUMvQixRQUFJLGFBQWEsR0FBRyxrQkFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFBOztBQUVqRCxRQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsYUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxpQ0FBaUMsRUFDeEMsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtLQUNuRDs7QUFFRCxRQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFBO0FBQ3BDLFFBQUksSUFBSSxHQUFHLE1BQUksUUFBUSxFQUFJLE9BQU8sQ0FBQyxDQUFBO0FBQ25DLFFBQUksT0FBTyxHQUFHLEVBQUMsR0FBRyxFQUFFLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFBOztBQUUzQyxRQUFJLGdCQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUNoQyxVQUFJLENBQUMsSUFBSSxlQUFhLGFBQWEsQ0FBRyxDQUFBO0tBQ3ZDLE1BQU07QUFDTCxVQUFJLENBQUMsSUFBSSxlQUFhLGFBQWEsQ0FBQyxhQUFhLENBQUcsQ0FBQTtLQUNyRDs7QUFFRCxRQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7QUFDekMsVUFBSSxDQUFDLElBQUksZ0JBQWMsYUFBYSxDQUFDLFdBQVcsQ0FBRyxDQUFBO0tBQ3BEOztBQUVELGtDQUF3QixFQUFDLE9BQU8sRUFBUCxPQUFPLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFDLENBQUMsQ0FBQTtHQUN4RTtDQUNGLENBQUE7O0FBRUQsSUFBTSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksR0FBRyxFQUFLO0FBQ3RCLE1BQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsRUFBRTtBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtHQUN4RDtDQUNGLENBQUE7QUFDRCxJQUFNLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxHQUFHLEVBQUs7QUFDdEIsTUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxFQUFFO0FBQy9DLFFBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO0dBQ3REO0NBQ0YsQ0FBQTtBQUNELElBQU0sSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFJLElBQUksRUFBSztBQUNyQixNQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtBQUM3RCxRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtHQUM5RDtDQUNGLENBQUEiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9qc2NzLWZpeGVyL2xpYi9qc2NzZml4ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCB7QnVmZmVyZWROb2RlUHJvY2Vzc30gZnJvbSAnYXRvbSdcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29uZmlnLFxuICBhY3RpdmF0ZSgpIHthdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnanNjcy1maXhlcjpmaXgnLCBmaXhGaWxlKX1cbn1cblxuY29uc3QgZml4RmlsZSA9ICgpID0+IHtcbiAgY29uc3QgW3Jvb3REaXJdID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gIGNvbnN0IGNvbmZpZ3VyYXRpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ2pzY3MtZml4ZXInKVxuXG4gIGlmIChyb290RGlyICYmIChlZGl0b3IgJiYgZWRpdG9yLmdldFBhdGgpKSB7XG4gICAgbGV0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgIGxldCBydWxlc0ZpbGVQYXRoID0gcGF0aC5qb2luKHJvb3REaXIsICcuanNjc3JjJylcblxuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnU2F2ZSB0aGUgZmlsZSBiZWZvcmUgZml4aW5nIGl0LicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZGlzbWlzc2FibGU6IHRydWV9KVxuICAgIH1cblxuICAgIGxldCBjb21tYW5kID0gY29uZmlndXJhdGlvbi5qc2NzUGF0aFxuICAgIGxldCBhcmdzID0gW2Ake2ZpbGVQYXRofWAsICctLWZpeCddXG4gICAgbGV0IG9wdGlvbnMgPSB7Y3dkOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpfVxuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocnVsZXNGaWxlUGF0aCkpIHtcbiAgICAgIGFyZ3MucHVzaChgLS1jb25maWcgJHtydWxlc0ZpbGVQYXRofWApXG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3MucHVzaChgLS1wcmVzZXQ9JHtjb25maWd1cmF0aW9uLmRlZmF1bHRQcmVzZXR9YClcbiAgICB9XG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdqc2NzLWZpeGVyLmVzcHJpbWEnKSkge1xuICAgICAgYXJncy5wdXNoKGAtLWVzcHJpbWE9JHtjb25maWd1cmF0aW9uLmVzcHJpbWFQYXRofWApXG4gICAgfVxuXG4gICAgbmV3IEJ1ZmZlcmVkTm9kZVByb2Nlc3Moe2NvbW1hbmQsIGFyZ3MsIG9wdGlvbnMsIHN0ZG91dCwgc3RkZXJyLCBleGl0fSlcbiAgfVxufVxuXG5jb25zdCBzdGRvdXQgPSAobXNnKSA9PiB7XG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2pzY3MtZml4ZXIubm90aWZpY2F0aW9ucycpKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcobXNnLCB7ZGlzbWlzc2FibGU6IHRydWV9KVxuICB9XG59XG5jb25zdCBzdGRlcnIgPSAobXNnKSA9PiB7XG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2pzY3MtZml4ZXIubm90aWZpY2F0aW9ucycpKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKG1zZywge2Rpc21pc3NhYmxlOiB0cnVlfSlcbiAgfVxufVxuY29uc3QgZXhpdCA9IChjb2RlKSA9PiB7XG4gIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2pzY3MtZml4ZXIubm90aWZpY2F0aW9ucycpICYmIGNvZGUgPT09IDApIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnRmlsZSBGaXhlZCcsIHtkaXNtaXNzYWJsZTogdHJ1ZX0pXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/jscs-fixer/lib/jscsfixer.js
