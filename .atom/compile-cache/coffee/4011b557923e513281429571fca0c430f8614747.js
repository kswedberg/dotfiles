(function() {
  module.exports = {
    activate: function(state) {
      return atom.packages.activatePackage('language-smarty').then(function() {
        var path;
        path = require('path');
        return atom.workspace.observeTextEditors(function(editor) {
          if (path.extname(editor.getPath()) === ".tpl") {
            return editor.setGrammar(atom.grammars.grammarForScopeName('text.html.smarty'));
          }
        });
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1zbWFydHkvaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixpQkFBOUIsQ0FBZ0QsQ0FBQyxJQUFqRCxDQUFzRCxTQUFBLEdBQUE7QUFDbEQsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQsR0FBQTtBQUM5QixVQUFBLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWIsQ0FBQSxLQUFrQyxNQUFyQzttQkFDRSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFkLENBQWtDLGtCQUFsQyxDQUFsQixFQURGO1dBRDhCO1FBQUEsQ0FBbEMsRUFGa0Q7TUFBQSxDQUF0RCxFQURNO0lBQUEsQ0FBVjtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/language-smarty/index.coffee
