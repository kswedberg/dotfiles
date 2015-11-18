(function() {
  var Entities, entitiesCoderDecoder;

  Entities = null;

  module.exports = {
    activate: function(state) {
      atom.commands.add('atom-workspace', 'html-entities:encode', function() {
        return entitiesCoderDecoder('encode');
      });
      return atom.commands.add('atom-workspace', 'html-entities:decode', function() {
        return entitiesCoderDecoder('decode');
      });
    }
  };

  entitiesCoderDecoder = function(action) {
    var editor, entities, selectedText;
    editor = atom.workspace.getActiveTextEditor();
    if (editor == null) {
      return;
    }
    if (Entities == null) {
      Entities = require('html-entities').AllHtmlEntities;
    }
    entities = new Entities();
    selectedText = editor.getSelectedText();
    if (selectedText && action === 'decode') {
      return editor.insertText(entities.decode(selectedText));
    } else if (selectedText) {
      return editor.insertText(entities.encode(selectedText));
    } else if (action === 'decode') {
      return editor.setText(entities.decode(editor.getText()));
    } else {
      return editor.setText(entities.encode(editor.getText()));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9odG1sLWVudGl0aWVzL2xpYi9odG1sLWVudGl0aWVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxJQUFYLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msc0JBQXBDLEVBQTRELFNBQUEsR0FBQTtlQUMxRCxvQkFBQSxDQUFxQixRQUFyQixFQUQwRDtNQUFBLENBQTVELENBQUEsQ0FBQTthQUdBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msc0JBQXBDLEVBQTRELFNBQUEsR0FBQTtlQUMxRCxvQkFBQSxDQUFxQixRQUFyQixFQUQwRDtNQUFBLENBQTVELEVBSlE7SUFBQSxDQUFWO0dBSEYsQ0FBQTs7QUFBQSxFQVVBLG9CQUFBLEdBQXVCLFNBQUMsTUFBRCxHQUFBO0FBQ3JCLFFBQUEsOEJBQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQ0EsSUFBQSxJQUFjLGNBQWQ7QUFBQSxZQUFBLENBQUE7S0FEQTs7TUFHQSxXQUFZLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUM7S0FIckM7QUFBQSxJQUlBLFFBQUEsR0FBZSxJQUFBLFFBQUEsQ0FBQSxDQUpmLENBQUE7QUFBQSxJQU1BLFlBQUEsR0FBZSxNQUFNLENBQUMsZUFBUCxDQUFBLENBTmYsQ0FBQTtBQU9BLElBQUEsSUFBRyxZQUFBLElBQWlCLE1BQUEsS0FBVSxRQUE5QjthQUNFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFFBQVEsQ0FBQyxNQUFULENBQWdCLFlBQWhCLENBQWxCLEVBREY7S0FBQSxNQUdLLElBQUcsWUFBSDthQUNILE1BQU0sQ0FBQyxVQUFQLENBQWtCLFFBQVEsQ0FBQyxNQUFULENBQWdCLFlBQWhCLENBQWxCLEVBREc7S0FBQSxNQUdBLElBQUcsTUFBQSxLQUFVLFFBQWI7YUFDSCxNQUFNLENBQUMsT0FBUCxDQUFlLFFBQVEsQ0FBQyxNQUFULENBQWdCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBaEIsQ0FBZixFQURHO0tBQUEsTUFBQTthQUlILE1BQU0sQ0FBQyxPQUFQLENBQWUsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFoQixDQUFmLEVBSkc7S0FkZ0I7RUFBQSxDQVZ2QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/html-entities/lib/html-entities.coffee
