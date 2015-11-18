Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var init = function init() {
	var configFile = _path2['default'].join(atom.project.getPaths()[0], '.editorconfig');

	var conf = {
		core: atom.config.get('core'),
		editor: atom.config.get('editor'),
		whitespace: atom.config.get('whitespace')
	};

	var indent = conf.editor.softTabs ? 'indent_style = space\nindent_size = ' + conf.editor.tabLength : 'indent_style = tab';

	var endOfLine = process.platform === 'win32' ? 'crlf' : 'lf';
	var charset = conf.core.fileEncoding.replace('utf8', 'utf-8') || 'utf-8';

	var ret = 'root = true\n\n[*]\n' + indent + '\nend_of_line = ' + endOfLine + '\ncharset = ' + charset + '\ntrim_trailing_whitespace = ' + conf.whitespace.removeTrailingWhitespace + '\ninsert_final_newline = ' + conf.whitespace.ensureSingleTrailingNewline + '\n\n[*.md]\ntrim_trailing_whitespace = false\n';

	_fs2['default'].access(configFile, function (err) {
		if (err) {
			_fs2['default'].writeFile(configFile, ret, function (err) {
				if (err) {
					atom.notifications.addError(err);
					return;
				}

				atom.notifications.addSuccess('.editorconfig file successfully generated', {
					detail: 'An .editorconfig file was successfully generated in your project based on your current settings.'
				});
			});
		} else {
			atom.notifications.addError('An .editorconfig file already exists in your project root.');
		}
	});
};

exports['default'] = function () {
	atom.commands.add('atom-workspace', 'EditorConfig:generate-config', init);
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvZWRpdG9yY29uZmlnL2NvbW1hbmRzL2dlbmVyYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztrQkFDZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7QUFGdkIsV0FBVyxDQUFDOztBQUlaLElBQU0sSUFBSSxHQUFHLFNBQVAsSUFBSSxHQUFTO0FBQ2xCLEtBQU0sVUFBVSxHQUFHLGtCQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDOztBQUUxRSxLQUFNLElBQUksR0FBRztBQUNaLE1BQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFDN0IsUUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNqQyxZQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO0VBQ3pDLENBQUM7O0FBRUYsS0FBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLDRDQUNPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUM1RCxvQkFBb0IsQ0FBQzs7QUFFeEIsS0FBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztBQUMvRCxLQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQzs7QUFFM0UsS0FBTSxHQUFHLDRCQUlSLE1BQU0sd0JBQ1EsU0FBUyxvQkFDYixPQUFPLHFDQUNVLElBQUksQ0FBQyxVQUFVLENBQUMsd0JBQXdCLGlDQUM1QyxJQUFJLENBQUMsVUFBVSxDQUFDLDJCQUEyQixtREFJbkUsQ0FBQzs7QUFFRCxpQkFBRyxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQUEsR0FBRyxFQUFJO0FBQzVCLE1BQUksR0FBRyxFQUFFO0FBQ1IsbUJBQUcsU0FBUyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsVUFBQSxHQUFHLEVBQUk7QUFDcEMsUUFBSSxHQUFHLEVBQUU7QUFDUixTQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQyxZQUFPO0tBQ1A7O0FBRUQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsMkNBQTJDLEVBQUU7QUFDMUUsV0FBTSxFQUFFLGtHQUFrRztLQUMxRyxDQUFDLENBQUM7SUFDSCxDQUFDLENBQUM7R0FDSCxNQUFNO0FBQ04sT0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsNERBQTRELENBQUMsQ0FBQztHQUMxRjtFQUNELENBQUMsQ0FBQztDQUNILENBQUM7O3FCQUVhLFlBQU07QUFDcEIsS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsOEJBQThCLEVBQUUsSUFBSSxDQUFDLENBQUM7Q0FDMUUiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9lZGl0b3Jjb25maWcvY29tbWFuZHMvZ2VuZXJhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgaW5pdCA9ICgpID0+IHtcblx0Y29uc3QgY29uZmlnRmlsZSA9IHBhdGguam9pbihhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSwgJy5lZGl0b3Jjb25maWcnKTtcblxuXHRjb25zdCBjb25mID0ge1xuXHRcdGNvcmU6IGF0b20uY29uZmlnLmdldCgnY29yZScpLFxuXHRcdGVkaXRvcjogYXRvbS5jb25maWcuZ2V0KCdlZGl0b3InKSxcblx0XHR3aGl0ZXNwYWNlOiBhdG9tLmNvbmZpZy5nZXQoJ3doaXRlc3BhY2UnKVxuXHR9O1xuXG5cdGNvbnN0IGluZGVudCA9IGNvbmYuZWRpdG9yLnNvZnRUYWJzID9cblx0XHRcdFx0YGluZGVudF9zdHlsZSA9IHNwYWNlXFxuaW5kZW50X3NpemUgPSAke2NvbmYuZWRpdG9yLnRhYkxlbmd0aH1gIDpcblx0XHRcdFx0J2luZGVudF9zdHlsZSA9IHRhYic7XG5cblx0Y29uc3QgZW5kT2ZMaW5lID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/ICdjcmxmJyA6ICdsZic7XG5cdGNvbnN0IGNoYXJzZXQgPSBjb25mLmNvcmUuZmlsZUVuY29kaW5nLnJlcGxhY2UoJ3V0ZjgnLCAndXRmLTgnKSB8fCAndXRmLTgnO1xuXG5cdGNvbnN0IHJldCA9XG5gcm9vdCA9IHRydWVcblxuWypdXG4ke2luZGVudH1cbmVuZF9vZl9saW5lID0gJHtlbmRPZkxpbmV9XG5jaGFyc2V0ID0gJHtjaGFyc2V0fVxudHJpbV90cmFpbGluZ193aGl0ZXNwYWNlID0gJHtjb25mLndoaXRlc3BhY2UucmVtb3ZlVHJhaWxpbmdXaGl0ZXNwYWNlfVxuaW5zZXJ0X2ZpbmFsX25ld2xpbmUgPSAke2NvbmYud2hpdGVzcGFjZS5lbnN1cmVTaW5nbGVUcmFpbGluZ05ld2xpbmV9XG5cblsqLm1kXVxudHJpbV90cmFpbGluZ193aGl0ZXNwYWNlID0gZmFsc2VcbmA7XG5cblx0ZnMuYWNjZXNzKGNvbmZpZ0ZpbGUsIGVyciA9PiB7XG5cdFx0aWYgKGVycikge1xuXHRcdFx0ZnMud3JpdGVGaWxlKGNvbmZpZ0ZpbGUsIHJldCwgZXJyID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihlcnIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKCcuZWRpdG9yY29uZmlnIGZpbGUgc3VjY2Vzc2Z1bGx5IGdlbmVyYXRlZCcsIHtcblx0XHRcdFx0XHRkZXRhaWw6ICdBbiAuZWRpdG9yY29uZmlnIGZpbGUgd2FzIHN1Y2Nlc3NmdWxseSBnZW5lcmF0ZWQgaW4geW91ciBwcm9qZWN0IGJhc2VkIG9uIHlvdXIgY3VycmVudCBzZXR0aW5ncy4nXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignQW4gLmVkaXRvcmNvbmZpZyBmaWxlIGFscmVhZHkgZXhpc3RzIGluIHlvdXIgcHJvamVjdCByb290LicpO1xuXHRcdH1cblx0fSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG5cdGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdFZGl0b3JDb25maWc6Z2VuZXJhdGUtY29uZmlnJywgaW5pdCk7XG59O1xuIl19
//# sourceURL=/Users/kswedberg/.atom/packages/editorconfig/commands/generate.js
