Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _editorconfig = require('editorconfig');

var _editorconfig2 = _interopRequireDefault(_editorconfig);

var _commandsGenerate = require('./commands/generate');

var _commandsGenerate2 = _interopRequireDefault(_commandsGenerate);

function init(editor) {
	(0, _commandsGenerate2['default'])();

	if (!editor) {
		return;
	}

	var file = editor.getURI();

	var lineEndings = {
		crlf: '\r\n',
		lf: '\n'
	};

	if (!file) {
		return;
	}

	_editorconfig2['default'].parse(file).then(function (config) {
		if (Object.keys(config).length === 0) {
			return;
		}

		var indentStyle = config.indent_style || (editor.getSoftTabs() ? 'space' : 'tab');

		if (indentStyle === 'tab') {
			editor.setSoftTabs(false);

			if (config.tab_width) {
				editor.setTabLength(config.tab_width);
			}
		} else if (indentStyle === 'space') {
			editor.setSoftTabs(true);

			if (config.indent_size) {
				editor.setTabLength(config.indent_size);
			}
		}

		if (config.end_of_line && config.end_of_line in lineEndings) {
			(function () {
				var preferredLineEnding = lineEndings[config.end_of_line];
				var buffer = editor.getBuffer();
				buffer.setPreferredLineEnding(preferredLineEnding);
				buffer.backwardsScanInRange(/\r?\n/g, buffer.getRange(), function (_ref) {
					var replace = _ref.replace;

					replace(preferredLineEnding);
				});
			})();
		}

		if (config.charset) {
			// by default Atom uses charset name without any dashes in them
			// (i.e. 'utf16le' instead of 'utf-16le').
			editor.setEncoding(config.charset.replace(/-/g, '').toLowerCase());
		}
	});
}

var activate = function activate() {
	atom.workspace.observeTextEditors(init);
};
exports.activate = activate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzRCQUN5QixjQUFjOzs7O2dDQUNaLHFCQUFxQjs7OztBQUVoRCxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDckIscUNBQWdCLENBQUM7O0FBRWpCLEtBQUksQ0FBQyxNQUFNLEVBQUU7QUFDWixTQUFPO0VBQ1A7O0FBRUQsS0FBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUU3QixLQUFNLFdBQVcsR0FBRztBQUNuQixNQUFJLEVBQUUsTUFBTTtBQUNaLElBQUUsRUFBRSxJQUFJO0VBQ1IsQ0FBQzs7QUFFRixLQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1YsU0FBTztFQUNQOztBQUVELDJCQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDdkMsTUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckMsVUFBTztHQUNQOztBQUVELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEtBQUssTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUEsQUFBQyxDQUFDOztBQUVwRixNQUFJLFdBQVcsS0FBSyxLQUFLLEVBQUU7QUFDMUIsU0FBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFMUIsT0FBSSxNQUFNLENBQUMsU0FBUyxFQUFFO0FBQ3JCLFVBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3RDO0dBQ0QsTUFBTSxJQUFJLFdBQVcsS0FBSyxPQUFPLEVBQUU7QUFDbkMsU0FBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekIsT0FBSSxNQUFNLENBQUMsV0FBVyxFQUFFO0FBQ3ZCLFVBQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDO0dBQ0Q7O0FBRUQsTUFBSSxNQUFNLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxXQUFXLElBQUksV0FBVyxFQUFFOztBQUM1RCxRQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDNUQsUUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2xDLFVBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ25ELFVBQU0sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLFVBQUMsSUFBUyxFQUFLO1NBQWIsT0FBTyxHQUFSLElBQVMsQ0FBUixPQUFPOztBQUNqRSxZQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUM3QixDQUFDLENBQUM7O0dBQ0g7O0FBRUQsTUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFOzs7QUFHbkIsU0FBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztHQUNuRTtFQUNELENBQUMsQ0FBQztDQUNIOztBQUVNLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxHQUFTO0FBQzdCLEtBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDeEMsQ0FBQyIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbmltcG9ydCBlZGl0b3Jjb25maWcgZnJvbSAnZWRpdG9yY29uZmlnJztcbmltcG9ydCBnZW5lcmF0ZUNvbmZpZyBmcm9tICcuL2NvbW1hbmRzL2dlbmVyYXRlJztcblxuZnVuY3Rpb24gaW5pdChlZGl0b3IpIHtcblx0Z2VuZXJhdGVDb25maWcoKTtcblxuXHRpZiAoIWVkaXRvcikge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGZpbGUgPSBlZGl0b3IuZ2V0VVJJKCk7XG5cblx0Y29uc3QgbGluZUVuZGluZ3MgPSB7XG5cdFx0Y3JsZjogJ1xcclxcbicsXG5cdFx0bGY6ICdcXG4nXG5cdH07XG5cblx0aWYgKCFmaWxlKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0ZWRpdG9yY29uZmlnLnBhcnNlKGZpbGUpLnRoZW4oY29uZmlnID0+IHtcblx0XHRpZiAoT2JqZWN0LmtleXMoY29uZmlnKS5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpbmRlbnRTdHlsZSA9IGNvbmZpZy5pbmRlbnRfc3R5bGUgfHwgKGVkaXRvci5nZXRTb2Z0VGFicygpID8gJ3NwYWNlJyA6ICd0YWInKTtcblxuXHRcdGlmIChpbmRlbnRTdHlsZSA9PT0gJ3RhYicpIHtcblx0XHRcdGVkaXRvci5zZXRTb2Z0VGFicyhmYWxzZSk7XG5cblx0XHRcdGlmIChjb25maWcudGFiX3dpZHRoKSB7XG5cdFx0XHRcdGVkaXRvci5zZXRUYWJMZW5ndGgoY29uZmlnLnRhYl93aWR0aCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChpbmRlbnRTdHlsZSA9PT0gJ3NwYWNlJykge1xuXHRcdFx0ZWRpdG9yLnNldFNvZnRUYWJzKHRydWUpO1xuXG5cdFx0XHRpZiAoY29uZmlnLmluZGVudF9zaXplKSB7XG5cdFx0XHRcdGVkaXRvci5zZXRUYWJMZW5ndGgoY29uZmlnLmluZGVudF9zaXplKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoY29uZmlnLmVuZF9vZl9saW5lICYmIGNvbmZpZy5lbmRfb2ZfbGluZSBpbiBsaW5lRW5kaW5ncykge1xuXHRcdFx0Y29uc3QgcHJlZmVycmVkTGluZUVuZGluZyA9IGxpbmVFbmRpbmdzW2NvbmZpZy5lbmRfb2ZfbGluZV07XG5cdFx0XHRjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG5cdFx0XHRidWZmZXIuc2V0UHJlZmVycmVkTGluZUVuZGluZyhwcmVmZXJyZWRMaW5lRW5kaW5nKTtcblx0XHRcdGJ1ZmZlci5iYWNrd2FyZHNTY2FuSW5SYW5nZSgvXFxyP1xcbi9nLCBidWZmZXIuZ2V0UmFuZ2UoKSwgKHtyZXBsYWNlfSkgPT4ge1xuXHRcdFx0XHRyZXBsYWNlKHByZWZlcnJlZExpbmVFbmRpbmcpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKGNvbmZpZy5jaGFyc2V0KSB7XG5cdFx0XHQvLyBieSBkZWZhdWx0IEF0b20gdXNlcyBjaGFyc2V0IG5hbWUgd2l0aG91dCBhbnkgZGFzaGVzIGluIHRoZW1cblx0XHRcdC8vIChpLmUuICd1dGYxNmxlJyBpbnN0ZWFkIG9mICd1dGYtMTZsZScpLlxuXHRcdFx0ZWRpdG9yLnNldEVuY29kaW5nKGNvbmZpZy5jaGFyc2V0LnJlcGxhY2UoLy0vZywgJycpLnRvTG93ZXJDYXNlKCkpO1xuXHRcdH1cblx0fSk7XG59XG5cbmV4cG9ydCBjb25zdCBhY3RpdmF0ZSA9ICgpID0+IHtcblx0YXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGluaXQpO1xufTtcbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/editorconfig/index.js
