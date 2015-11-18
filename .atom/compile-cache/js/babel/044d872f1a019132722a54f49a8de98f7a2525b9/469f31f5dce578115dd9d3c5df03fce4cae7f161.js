Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

exports['default'] = {
  jscsPath: {
    title: 'Path to JSCS binary',
    type: 'string',
    'default': _path2['default'].join(__dirname, '..', 'node_modules', 'jscs', 'bin', 'jscs')
  },
  defaultPreset: {
    title: 'Default preset',
    description: 'What preset to use if no rules file is found.',
    'enum': ['airbnb', 'crockford', 'google', 'grunt', 'jquery', 'mdcs', 'wikimedia', 'yandex'],
    type: 'string',
    'default': 'google'
  },
  esprima: {
    title: 'ES2015 and JSX Support',
    description: 'Attempts to parse your ES2015 and JSX code using the\n                  esprima-fb version of the esprima parser.',
    type: 'boolean',
    'default': false
  },
  esprimaPath: {
    title: 'Path to esprima parser folder',
    type: 'string',
    'default': _path2['default'].join(__dirname, '..', 'node_modules', 'esprima-fb')
  },
  notifications: {
    title: 'Enable editor notifications',
    description: 'If enabled, notifications will be shown after each attempt\n                  to fix a file. Shows both success and error messages.',
    type: 'boolean',
    'default': true
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvanNjcy1maXhlci9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFaUIsTUFBTTs7OztBQUZ2QixXQUFXLENBQUM7O3FCQUlHO0FBQ2IsVUFBUSxFQUFFO0FBQ1IsU0FBSyxFQUFFLHFCQUFxQjtBQUM1QixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsa0JBQUssSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDO0dBQzNFO0FBQ0QsZUFBYSxFQUFFO0FBQ2IsU0FBSyxFQUFFLGdCQUFnQjtBQUN2QixlQUFXLEVBQUUsK0NBQStDO0FBQzVELFlBQU0sQ0FDSixRQUFRLEVBQ1IsV0FBVyxFQUNYLFFBQVEsRUFDUixPQUFPLEVBQ1AsUUFBUSxFQUNSLE1BQU0sRUFDTixXQUFXLEVBQ1gsUUFBUSxDQUNUO0FBQ0QsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLFFBQVE7R0FDbEI7QUFDRCxTQUFPLEVBQUU7QUFDUCxTQUFLLEVBQUUsd0JBQXdCO0FBQy9CLGVBQVcscUhBQzZDO0FBQ3hELFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0dBQ2Y7QUFDRCxhQUFXLEVBQUU7QUFDWCxTQUFLLEVBQUUsK0JBQStCO0FBQ3RDLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsWUFBWSxDQUFDO0dBQ2xFO0FBQ0QsZUFBYSxFQUFFO0FBQ2IsU0FBSyxFQUFFLDZCQUE2QjtBQUNwQyxlQUFXLHVJQUN5RDtBQUNwRSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtHQUNkO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9qc2NzLWZpeGVyL2xpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBqc2NzUGF0aDoge1xuICAgIHRpdGxlOiAnUGF0aCB0byBKU0NTIGJpbmFyeScsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ25vZGVfbW9kdWxlcycsICdqc2NzJywgJ2JpbicsICdqc2NzJylcbiAgfSxcbiAgZGVmYXVsdFByZXNldDoge1xuICAgIHRpdGxlOiAnRGVmYXVsdCBwcmVzZXQnLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hhdCBwcmVzZXQgdG8gdXNlIGlmIG5vIHJ1bGVzIGZpbGUgaXMgZm91bmQuJyxcbiAgICBlbnVtOiBbXG4gICAgICAnYWlyYm5iJyxcbiAgICAgICdjcm9ja2ZvcmQnLFxuICAgICAgJ2dvb2dsZScsXG4gICAgICAnZ3J1bnQnLFxuICAgICAgJ2pxdWVyeScsXG4gICAgICAnbWRjcycsXG4gICAgICAnd2lraW1lZGlhJyxcbiAgICAgICd5YW5kZXgnXG4gICAgXSxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnZ29vZ2xlJyxcbiAgfSxcbiAgZXNwcmltYToge1xuICAgIHRpdGxlOiAnRVMyMDE1IGFuZCBKU1ggU3VwcG9ydCcsXG4gICAgZGVzY3JpcHRpb246IGBBdHRlbXB0cyB0byBwYXJzZSB5b3VyIEVTMjAxNSBhbmQgSlNYIGNvZGUgdXNpbmcgdGhlXG4gICAgICAgICAgICAgICAgICBlc3ByaW1hLWZiIHZlcnNpb24gb2YgdGhlIGVzcHJpbWEgcGFyc2VyLmAsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlXG4gIH0sXG4gIGVzcHJpbWFQYXRoOiB7XG4gICAgdGl0bGU6ICdQYXRoIHRvIGVzcHJpbWEgcGFyc2VyIGZvbGRlcicsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ25vZGVfbW9kdWxlcycsICdlc3ByaW1hLWZiJylcbiAgfSxcbiAgbm90aWZpY2F0aW9uczoge1xuICAgIHRpdGxlOiAnRW5hYmxlIGVkaXRvciBub3RpZmljYXRpb25zJyxcbiAgICBkZXNjcmlwdGlvbjogYElmIGVuYWJsZWQsIG5vdGlmaWNhdGlvbnMgd2lsbCBiZSBzaG93biBhZnRlciBlYWNoIGF0dGVtcHRcbiAgICAgICAgICAgICAgICAgIHRvIGZpeCBhIGZpbGUuIFNob3dzIGJvdGggc3VjY2VzcyBhbmQgZXJyb3IgbWVzc2FnZXMuYCxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/kswedberg/.atom/packages/jscs-fixer/lib/config.js
