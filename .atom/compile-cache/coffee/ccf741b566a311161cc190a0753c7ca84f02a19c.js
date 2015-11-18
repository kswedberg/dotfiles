(function() {
  var toggleQuotes;

  toggleQuotes = require('./toggle-quotes').toggleQuotes;

  module.exports = {
    config: {
      quoteCharacters: {
        type: 'string',
        "default": '"\''
      }
    },
    activate: function() {
      return this.subscription = atom.commands.add('atom-text-editor', 'toggle-quotes:toggle', function() {
        var editor;
        if (editor = atom.workspace.getActiveTextEditor()) {
          return toggleQuotes(editor);
        }
      });
    },
    deactivate: function() {
      return this.subscription.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUMsZUFBZ0IsT0FBQSxDQUFRLGlCQUFSLEVBQWhCLFlBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsZUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FERjtLQURGO0FBQUEsSUFLQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxzQkFBdEMsRUFBOEQsU0FBQSxHQUFBO0FBQzVFLFlBQUEsTUFBQTtBQUFBLFFBQUEsSUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVo7aUJBQ0UsWUFBQSxDQUFhLE1BQWIsRUFERjtTQUQ0RTtNQUFBLENBQTlELEVBRFI7SUFBQSxDQUxWO0FBQUEsSUFVQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsRUFEVTtJQUFBLENBVlo7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/toggle-quotes/lib/main.coffee
