(function() {
  module.exports = {
    hasCommand: function(element, name) {
      var command, commands, found, _i, _len;
      commands = atom.commands.findCommands({
        target: element
      });
      for (_i = 0, _len = commands.length; _i < _len; _i++) {
        command = commands[_i];
        if (command.name === name) {
          found = true;
        }
      }
      return found;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9zZXQtc3ludGF4L3NwZWMvc3BlYy1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBT0U7QUFBQSxJQUFBLFVBQUEsRUFBWSxTQUFDLE9BQUQsRUFBVSxJQUFWLEdBQUE7QUFDVixVQUFBLGtDQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFkLENBQTJCO0FBQUEsUUFBQSxNQUFBLEVBQVEsT0FBUjtPQUEzQixDQUFYLENBQUE7QUFDQSxXQUFBLCtDQUFBOytCQUFBO1lBQTBDLE9BQU8sQ0FBQyxJQUFSLEtBQWdCO0FBQTFELFVBQUEsS0FBQSxHQUFRLElBQVI7U0FBQTtBQUFBLE9BREE7YUFHQSxNQUpVO0lBQUEsQ0FBWjtHQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/set-syntax/spec/spec-helper.coffee
