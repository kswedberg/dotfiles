(function() {
  var OpenCheatSheet, utils;

  utils = require("../utils");

  module.exports = OpenCheatSheet = (function() {
    function OpenCheatSheet() {}

    OpenCheatSheet.prototype.trigger = function(e) {
      if (!this.hasPreview()) {
        e.abortKeyBinding();
      }
      return atom.workspace.open(this.cheatsheetURL(), {
        split: 'right',
        searchAllPanes: true
      });
    };

    OpenCheatSheet.prototype.hasPreview = function() {
      return !!atom.packages.activePackages['markdown-preview'];
    };

    OpenCheatSheet.prototype.cheatsheetURL = function() {
      var cheatsheet;
      cheatsheet = utils.getPackagePath("CHEATSHEET.md");
      return "markdown-preview://" + (encodeURI(cheatsheet));
    };

    return OpenCheatSheet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbW1hbmRzL29wZW4tY2hlYXQtc2hlZXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007Z0NBQ0o7O0FBQUEsNkJBQUEsT0FBQSxHQUFTLFNBQUMsQ0FBRCxHQUFBO0FBQ1AsTUFBQSxJQUFBLENBQUEsSUFBNEIsQ0FBQSxVQUFELENBQUEsQ0FBM0I7QUFBQSxRQUFBLENBQUMsQ0FBQyxlQUFGLENBQUEsQ0FBQSxDQUFBO09BQUE7YUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFwQixFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sT0FBUDtBQUFBLFFBQWdCLGNBQUEsRUFBZ0IsSUFBaEM7T0FERixFQUhPO0lBQUEsQ0FBVCxDQUFBOztBQUFBLDZCQU1BLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixDQUFBLENBQUMsSUFBSyxDQUFDLFFBQVEsQ0FBQyxjQUFlLENBQUEsa0JBQUEsRUFEckI7SUFBQSxDQU5aLENBQUE7O0FBQUEsNkJBU0EsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLEtBQUssQ0FBQyxjQUFOLENBQXFCLGVBQXJCLENBQWIsQ0FBQTthQUNDLHFCQUFBLEdBQW9CLENBQUMsU0FBQSxDQUFVLFVBQVYsQ0FBRCxFQUZSO0lBQUEsQ0FUZixDQUFBOzswQkFBQTs7TUFKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/commands/open-cheat-sheet.coffee
