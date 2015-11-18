(function() {
  var IndentToggleOnPaste;

  module.exports = IndentToggleOnPaste = {
    activate: function() {
      return atom.commands.add("atom-text-editor:not([mini])", {
        "indent-toggle-on-paste:paste": (function(_this) {
          return function() {
            return _this.paste();
          };
        })(this)
      });
    },
    paste: function() {
      var bCurrentConfigValue;
      bCurrentConfigValue = atom.config.get("editor.autoIndentOnPaste");
      atom.config.set("editor.autoIndentOnPaste", !bCurrentConfigValue);
      atom.workspace.getActiveTextEditor().pasteText();
      return atom.config.set("editor.autoIndentOnPaste", bCurrentConfigValue);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9pbmRlbnQtdG9nZ2xlLW9uLXBhc3RlL2xpYi9pbmRlbnQtdG9nZ2xlLW9uLXBhc3RlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLG1CQUFBLEdBQ2I7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsOEJBQWxCLEVBQ0k7QUFBQSxRQUFBLDhCQUFBLEVBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxLQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDO09BREosRUFETTtJQUFBLENBQVY7QUFBQSxJQUlBLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFDSCxVQUFBLG1CQUFBO0FBQUEsTUFBQSxtQkFBQSxHQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBQXRCLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsQ0FBQSxtQkFBNUMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyxTQUFyQyxDQUFBLENBRkEsQ0FBQTthQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsbUJBQTVDLEVBSkc7SUFBQSxDQUpQO0dBREosQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/indent-toggle-on-paste/lib/indent-toggle-on-paste.coffee
