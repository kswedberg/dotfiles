(function() {
  var OpenCheatSheet;

  OpenCheatSheet = require("../../lib/commands/open-cheat-sheet");

  describe("OpenCheatSheet", function() {
    return it("returns correct cheatsheetURL", function() {
      var cmd;
      cmd = new OpenCheatSheet();
      expect(cmd.cheatsheetURL()).toMatch("markdown-preview://");
      return expect(cmd.cheatsheetURL()).toMatch("CHEATSHEET.md");
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvc3BlYy9jb21tYW5kcy9vcGVuLWNoZWF0LXNoZWV0LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxxQ0FBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtXQUN6QixFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFVLElBQUEsY0FBQSxDQUFBLENBQVYsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxhQUFKLENBQUEsQ0FBUCxDQUEyQixDQUFDLE9BQTVCLENBQW9DLHFCQUFwQyxDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLGFBQUosQ0FBQSxDQUFQLENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsZUFBcEMsRUFIa0M7SUFBQSxDQUFwQyxFQUR5QjtFQUFBLENBQTNCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/spec/commands/open-cheat-sheet-spec.coffee
