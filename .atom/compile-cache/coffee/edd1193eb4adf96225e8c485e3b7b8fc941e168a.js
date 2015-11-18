(function() {
  describe("atom wrap in tag", function() {
    var activationPromise, packageLoaded, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    packageLoaded = function(callback) {
      atom.commands.dispatch(workspaceElement, 'wrap-in-tag:wrap');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    beforeEach(function() {
      activationPromise = atom.packages.activatePackage('atom-wrap-in-tag');
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return waitsForPromise(function() {
        return atom.workspace.open('./test.html');
      });
    });
    it('Should check if "atom-wrap-in-tag" package is loaded', function() {
      return packageLoaded(function() {
        return expect(atom.packages.loadedPackages["atom-wrap-in-tag"]).toBeDefined();
      });
    });
    describe("When file is loaded", function() {
      return it("should have test.html opened in an editor", function() {
        return expect(atom.workspace.getActiveTextEditor().getText().trim()).toBe("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
      });
    });
    return describe("When file have selection", function() {
      return it("Should have 'ipsum dolor' selected", function() {
        atom.workspace.getActiveTextEditor().setSelectedBufferRange([[0, 6], [0, 17]]);
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'wrap-in-tag:wrap');
        return expect(atom.workspace.getActiveTextEditor().getText().trim()).toBe("Lorem <p>ipsum dolor</p> sit amet, consectetur adipiscing elit.");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLXdyYXAtaW4tdGFnL3NwZWMvd3JhcC1pbi10YWctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUUzQixRQUFBLHdEQUFBO0FBQUEsSUFBQSxPQUF3QyxFQUF4QyxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixDQUFBO0FBQUEsSUFFQSxhQUFBLEdBQWdCLFNBQUMsUUFBRCxHQUFBO0FBQ2QsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGtCQUF6QyxDQUFBLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsa0JBQUg7TUFBQSxDQUFoQixDQURBLENBQUE7YUFFQSxJQUFBLENBQUssUUFBTCxFQUhjO0lBQUEsQ0FGaEIsQ0FBQTtBQUFBLElBT0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUVULE1BQUEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGtCQUE5QixDQUFwQixDQUFBO0FBQUEsTUFDQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBRG5CLENBQUE7QUFBQSxNQUVBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQUZBLENBQUE7YUFJQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixhQUFwQixFQURjO01BQUEsQ0FBaEIsRUFOUztJQUFBLENBQVgsQ0FQQSxDQUFBO0FBQUEsSUFnQkEsRUFBQSxDQUFHLHNEQUFILEVBQTJELFNBQUEsR0FBQTthQUN6RCxhQUFBLENBQWMsU0FBQSxHQUFBO2VBQ1osTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBZSxDQUFBLGtCQUFBLENBQXBDLENBQXdELENBQUMsV0FBekQsQ0FBQSxFQURZO01BQUEsQ0FBZCxFQUR5RDtJQUFBLENBQTNELENBaEJBLENBQUE7QUFBQSxJQW9CQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO2FBQzlCLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7ZUFDOUMsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLE9BQXJDLENBQUEsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFBLENBQVAsQ0FBNkQsQ0FBQyxJQUE5RCxDQUFtRSwwREFBbkUsRUFEOEM7TUFBQSxDQUFoRCxFQUQ4QjtJQUFBLENBQWhDLENBcEJBLENBQUE7V0EwQkEsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUEsR0FBQTthQUNuQyxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQW9DLENBQUMsc0JBQXJDLENBQTRELENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFULENBQTVELENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBdkIsRUFBMkQsa0JBQTNELENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyxPQUFyQyxDQUFBLENBQThDLENBQUMsSUFBL0MsQ0FBQSxDQUFQLENBQTZELENBQUMsSUFBOUQsQ0FBbUUsaUVBQW5FLEVBSHVDO01BQUEsQ0FBekMsRUFEbUM7SUFBQSxDQUFyQyxFQTVCMkI7RUFBQSxDQUE3QixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/atom-wrap-in-tag/spec/wrap-in-tag-spec.coffee
