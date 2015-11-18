(function() {
  var moveToPosition;

  module.exports.gotoSymbol = function(symbol) {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    if (editor && symbol.path !== editor.getPath()) {
      return atom.workspace.open(symbol.path).done(function() {
        return moveToPosition(symbol.position);
      });
    } else {
      return moveToPosition(symbol.position);
    }
  };

  moveToPosition = function(position) {
    var editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      editor.setCursorBufferPosition(position);
      return editor.moveToFirstCharacterOfLine();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9nb3RvL2xpYi9zeW1ib2wtdXRpbHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQWYsR0FBNEIsU0FBQyxNQUFELEdBQUE7QUFDMUIsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUNBLElBQUEsSUFBRyxNQUFBLElBQVcsTUFBTSxDQUFDLElBQVAsS0FBZSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQTdCO2FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLE1BQU0sQ0FBQyxJQUEzQixDQUFnQyxDQUFDLElBQWpDLENBQXNDLFNBQUEsR0FBQTtlQUNwQyxjQUFBLENBQWUsTUFBTSxDQUFDLFFBQXRCLEVBRG9DO01BQUEsQ0FBdEMsRUFERjtLQUFBLE1BQUE7YUFJRSxjQUFBLENBQWUsTUFBTSxDQUFDLFFBQXRCLEVBSkY7S0FGMEI7RUFBQSxDQUE1QixDQUFBOztBQUFBLEVBUUEsY0FBQSxHQUFpQixTQUFDLFFBQUQsR0FBQTtBQUNmLFFBQUEsTUFBQTtBQUFBLElBQUEsSUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVo7QUFDRSxNQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixRQUEvQixDQUFBLENBQUE7YUFDQSxNQUFNLENBQUMsMEJBQVAsQ0FBQSxFQUZGO0tBRGU7RUFBQSxDQVJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/goto/lib/symbol-utils.coffee
