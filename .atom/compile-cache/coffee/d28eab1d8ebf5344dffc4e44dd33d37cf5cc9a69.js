(function() {
  module.exports = function(splitDir, oldEditor) {
    var directions, options, pane;
    pane = atom.workspace.paneForURI(oldEditor.getURI());
    options = {
      copyActiveItem: true
    };
    directions = {
      left: function() {
        return pane.splitLeft(options);
      },
      right: function() {
        return pane.splitRight(options);
      },
      up: function() {
        return pane.splitUp(options);
      },
      down: function() {
        return pane.splitDown(options);
      }
    };
    pane = directions[splitDir]().getActiveEditor();
    oldEditor.destroy();
    return pane;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvc3BsaXRQYW5lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFFBQUQsRUFBVyxTQUFYLEdBQUE7QUFDZixRQUFBLHlCQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFmLENBQTBCLFNBQVMsQ0FBQyxNQUFWLENBQUEsQ0FBMUIsQ0FBUCxDQUFBO0FBQUEsSUFDQSxPQUFBLEdBQVU7QUFBQSxNQUFFLGNBQUEsRUFBZ0IsSUFBbEI7S0FEVixDQUFBO0FBQUEsSUFFQSxVQUFBLEdBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFBLEdBQUE7ZUFDSixJQUFJLENBQUMsU0FBTCxDQUFlLE9BQWYsRUFESTtNQUFBLENBQU47QUFBQSxNQUVBLEtBQUEsRUFBTyxTQUFBLEdBQUE7ZUFDTCxJQUFJLENBQUMsVUFBTCxDQUFnQixPQUFoQixFQURLO01BQUEsQ0FGUDtBQUFBLE1BSUEsRUFBQSxFQUFJLFNBQUEsR0FBQTtlQUNGLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBYixFQURFO01BQUEsQ0FKSjtBQUFBLE1BTUEsSUFBQSxFQUFNLFNBQUEsR0FBQTtlQUNKLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZixFQURJO01BQUEsQ0FOTjtLQUhGLENBQUE7QUFBQSxJQVdBLElBQUEsR0FBTyxVQUFXLENBQUEsUUFBQSxDQUFYLENBQUEsQ0FBc0IsQ0FBQyxlQUF2QixDQUFBLENBWFAsQ0FBQTtBQUFBLElBWUEsU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQVpBLENBQUE7V0FhQSxLQWRlO0VBQUEsQ0FBakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/splitPane.coffee
