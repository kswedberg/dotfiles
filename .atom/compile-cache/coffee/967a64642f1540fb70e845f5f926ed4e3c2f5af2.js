(function() {
  var ChangeCase, Commands, makeCommand;

  ChangeCase = require('change-case');

  Commands = {
    camel: 'camelCase',
    constant: 'constantCase',
    dot: 'dotCase',
    lower: 'lowerCase',
    lowerFirst: 'lowerCaseFirst',
    param: 'paramCase',
    pascal: 'pascalCase',
    path: 'pathCase',
    sentence: 'sentenceCase',
    snake: 'snakeCase',
    "switch": 'switchCase',
    title: 'titleCase',
    upper: 'upperCase',
    upperFirst: 'upperCaseFirst'
  };

  module.exports = {
    activate: function(state) {
      var command, _results;
      _results = [];
      for (command in Commands) {
        _results.push(makeCommand(command));
      }
      return _results;
    }
  };

  makeCommand = function(command) {
    return atom.commands.add('atom-workspace', "change-case:" + command, function() {
      var converter, cursor, editor, method, newText, options, position, range, text, _i, _len, _ref, _results;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      method = Commands[command];
      converter = ChangeCase[method];
      options = {};
      options.wordRegex = /^[\t ]*$|[^\s\/\\\(\)"':,\.;<>~!@#\$%\^&\*\|\+=\[\]\{\}`\?]+/g;
      _ref = editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        position = cursor.getBufferPosition();
        range = cursor.getCurrentWordBufferRange(options);
        text = editor.getTextInBufferRange(range);
        newText = converter(text);
        _results.push(editor.setTextInBufferRange(range, newText));
      }
      return _results;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jaGFuZ2UtY2FzZS9saWIvY2hhbmdlLWNhc2UuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxhQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUFPLFdBQVA7QUFBQSxJQUNBLFFBQUEsRUFBVSxjQURWO0FBQUEsSUFFQSxHQUFBLEVBQUssU0FGTDtBQUFBLElBR0EsS0FBQSxFQUFPLFdBSFA7QUFBQSxJQUlBLFVBQUEsRUFBWSxnQkFKWjtBQUFBLElBS0EsS0FBQSxFQUFPLFdBTFA7QUFBQSxJQU1BLE1BQUEsRUFBUSxZQU5SO0FBQUEsSUFPQSxJQUFBLEVBQU0sVUFQTjtBQUFBLElBUUEsUUFBQSxFQUFVLGNBUlY7QUFBQSxJQVNBLEtBQUEsRUFBTyxXQVRQO0FBQUEsSUFVQSxRQUFBLEVBQVEsWUFWUjtBQUFBLElBV0EsS0FBQSxFQUFPLFdBWFA7QUFBQSxJQVlBLEtBQUEsRUFBTyxXQVpQO0FBQUEsSUFhQSxVQUFBLEVBQVksZ0JBYlo7R0FIRixDQUFBOztBQUFBLEVBa0JBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFVBQUEsaUJBQUE7QUFBQTtXQUFBLG1CQUFBLEdBQUE7QUFDRSxzQkFBQSxXQUFBLENBQVksT0FBWixFQUFBLENBREY7QUFBQTtzQkFEUTtJQUFBLENBQVY7R0FuQkYsQ0FBQTs7QUFBQSxFQXVCQSxXQUFBLEdBQWMsU0FBQyxPQUFELEdBQUE7V0FDWixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQXFDLGNBQUEsR0FBYyxPQUFuRCxFQUE4RCxTQUFBLEdBQUE7QUFDNUQsVUFBQSxvR0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFDQSxNQUFBLElBQWMsY0FBZDtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBQUEsTUFHQSxNQUFBLEdBQVMsUUFBUyxDQUFBLE9BQUEsQ0FIbEIsQ0FBQTtBQUFBLE1BSUEsU0FBQSxHQUFZLFVBQVcsQ0FBQSxNQUFBLENBSnZCLENBQUE7QUFBQSxNQU1BLE9BQUEsR0FBVSxFQU5WLENBQUE7QUFBQSxNQU9BLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLCtEQVBwQixDQUFBO0FBUUE7QUFBQTtXQUFBLDJDQUFBOzBCQUFBO0FBQ0UsUUFBQSxRQUFBLEdBQVcsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBWCxDQUFBO0FBQUEsUUFFQSxLQUFBLEdBQVEsTUFBTSxDQUFDLHlCQUFQLENBQWlDLE9BQWpDLENBRlIsQ0FBQTtBQUFBLFFBR0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQUhQLENBQUE7QUFBQSxRQUlBLE9BQUEsR0FBVSxTQUFBLENBQVUsSUFBVixDQUpWLENBQUE7QUFBQSxzQkFLQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBNUIsRUFBbUMsT0FBbkMsRUFMQSxDQURGO0FBQUE7c0JBVDREO0lBQUEsQ0FBOUQsRUFEWTtFQUFBLENBdkJkLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/change-case/lib/change-case.coffee
