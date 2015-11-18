(function() {
  var AdvancedFileView;

  AdvancedFileView = require('../lib/advanced-open-file-view');

  describe("AdvancedFileView", function() {
    var workSpaceElement;
    workSpaceElement = null;
    beforeEach(function() {
      workSpaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise(function() {
        return atom.packages.activatePackage('keybinding-resolver');
      });
    });
    return describe("when the advanced-open-file:toggle event is triggered", function() {
      return it("attaches and detaches the view", function() {
        expect(workSpaceElement.querySelector('.advanced-open-file')).not.toExist();
        atom.commands.dispatch(workSpaceElement, 'advanced-open-file:toggle');
        expect(workSpaceElement.querySelector('.advanced-open-file')).toExist();
        atom.commands.dispatch(workSpaceElement, 'advanced-open-file:toggle');
        expect(workSpaceElement.querySelector('.advanced-open-file')).not.toExist();
        atom.commands.dispatch(workSpaceElement, 'key-binding-resolver:toggle');
        return expect(workSpaceElement.querySelector('.key-binding-resolver')).toExist();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvc3BlYy9hZHZhbmNlZC1vcGVuLWZpbGUtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxnQ0FBUixDQUFuQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLGdCQUFBO0FBQUEsSUFBQSxnQkFBQSxHQUFtQixJQUFuQixDQUFBO0FBQUEsSUFDQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixxQkFBOUIsRUFEZTtNQUFBLENBQWhCLEVBSFM7SUFBQSxDQUFYLENBREEsQ0FBQTtXQU9BLFFBQUEsQ0FBUyx1REFBVCxFQUFrRSxTQUFBLEdBQUE7YUFDOUQsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUEsR0FBQTtBQUNqQyxRQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixxQkFBL0IsQ0FBUCxDQUE2RCxDQUFDLEdBQUcsQ0FBQyxPQUFsRSxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QywyQkFBekMsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IscUJBQS9CLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFBLENBSEEsQ0FBQTtBQUFBLFFBS0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QywyQkFBekMsQ0FMQSxDQUFBO0FBQUEsUUFNQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IscUJBQS9CLENBQVAsQ0FBNkQsQ0FBQyxHQUFHLENBQUMsT0FBbEUsQ0FBQSxDQU5BLENBQUE7QUFBQSxRQVFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsNkJBQXpDLENBUkEsQ0FBQTtlQVNBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQix1QkFBL0IsQ0FBUCxDQUErRCxDQUFDLE9BQWhFLENBQUEsRUFWaUM7TUFBQSxDQUFyQyxFQUQ4RDtJQUFBLENBQWxFLEVBUjJCO0VBQUEsQ0FBN0IsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/spec/advanced-open-file-view-spec.coffee
