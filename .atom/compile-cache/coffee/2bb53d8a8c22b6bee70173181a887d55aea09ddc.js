(function() {
  var Goto;

  Goto = require('../lib/goto');

  describe("Goto", function() {
    var activationPromise, workspaceElement;
    activationPromise = null;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('goto');
    });
    return describe("when the goto:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(workspaceElement.find('.goto-view')).not.toExist();
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return expect(workspaceElement.find('.goto-view')).toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9nb3RvL3NwZWMvZ290by1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSLENBQVAsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFNBQUEsR0FBQTtBQUNmLFFBQUEsbUNBQUE7QUFBQSxJQUFBLGlCQUFBLEdBQW9CLElBQXBCLENBQUE7QUFBQSxJQUNBLGdCQUFBLEdBQW9CLElBRHBCLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTthQUNBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixNQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUhBLENBQUE7V0FPQSxRQUFBLENBQVMseUNBQVQsRUFBb0QsU0FBQSxHQUFBO2FBQ2xELEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsUUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsWUFBdEIsQ0FBUCxDQUEyQyxDQUFDLEdBQUcsQ0FBQyxPQUFoRCxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBTUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2Qsa0JBRGM7UUFBQSxDQUFoQixDQU5BLENBQUE7ZUFTQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUNILE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQixZQUF0QixDQUFQLENBQTJDLENBQUMsT0FBNUMsQ0FBQSxFQURHO1FBQUEsQ0FBTCxFQVZ3QztNQUFBLENBQTFDLEVBRGtEO0lBQUEsQ0FBcEQsRUFSZTtFQUFBLENBQWpCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/goto/spec/goto-spec.coffee
