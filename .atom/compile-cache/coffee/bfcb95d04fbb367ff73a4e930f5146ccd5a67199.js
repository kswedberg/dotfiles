(function() {
  var AdvancedFileView;

  AdvancedFileView = require('../lib/advanced-new-file-view');

  describe("AdvancedFileView", function() {
    var workSpaceElement;
    workSpaceElement = null;
    beforeEach(function() {
      workSpaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise(function() {
        return atom.packages.activatePackage('keybinding-resolver');
      });
    });
    return describe("when the advanced-new-file:toggle event is triggered", function() {
      return it("attaches and detaches the view", function() {
        expect(workSpaceElement.querySelector('.advanced-new-file')).not.toExist();
        atom.commands.dispatch(workSpaceElement, 'advanced-new-file:toggle');
        expect(workSpaceElement.querySelector('.advanced-new-file')).toExist();
        atom.commands.dispatch(workSpaceElement, 'advanced-new-file:toggle');
        expect(workSpaceElement.querySelector('.advanced-new-file')).not.toExist();
        atom.commands.dispatch(workSpaceElement, 'key-binding-resolver:toggle');
        return expect(workSpaceElement.querySelector('.key-binding-resolver')).toExist();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1uZXctZmlsZS9zcGVjL2FkdmFuY2VkLW5ldy1maWxlLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0JBQUE7O0FBQUEsRUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsK0JBQVIsQ0FBbkIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsUUFBQSxnQkFBQTtBQUFBLElBQUEsZ0JBQUEsR0FBbUIsSUFBbkIsQ0FBQTtBQUFBLElBQ0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIscUJBQTlCLEVBRGU7TUFBQSxDQUFoQixFQUhTO0lBQUEsQ0FBWCxDQURBLENBQUE7V0FPQSxRQUFBLENBQVMsc0RBQVQsRUFBaUUsU0FBQSxHQUFBO2FBQzdELEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFDakMsUUFBQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0Isb0JBQS9CLENBQVAsQ0FBNEQsQ0FBQyxHQUFHLENBQUMsT0FBakUsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsMEJBQXpDLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLG9CQUEvQixDQUFQLENBQTRELENBQUMsT0FBN0QsQ0FBQSxDQUhBLENBQUE7QUFBQSxRQUtBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsMEJBQXpDLENBTEEsQ0FBQTtBQUFBLFFBTUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLG9CQUEvQixDQUFQLENBQTRELENBQUMsR0FBRyxDQUFDLE9BQWpFLENBQUEsQ0FOQSxDQUFBO0FBQUEsUUFRQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLDZCQUF6QyxDQVJBLENBQUE7ZUFTQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsdUJBQS9CLENBQVAsQ0FBK0QsQ0FBQyxPQUFoRSxDQUFBLEVBVmlDO01BQUEsQ0FBckMsRUFENkQ7SUFBQSxDQUFqRSxFQVIyQjtFQUFBLENBQTdCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/advanced-new-file/spec/advanced-new-file-view-spec.coffee
