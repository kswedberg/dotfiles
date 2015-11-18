(function() {
  describe("changing case", function() {
    var editor, workspaceView, _ref;
    _ref = [], workspaceView = _ref[0], editor = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('change-case');
      });
      return runs(function() {
        workspaceView = atom.views.getView(atom.workspace);
        editor = atom.workspace.getActiveTextEditor();
        editor.selectAll();
        return editor.backspace();
      });
    });
    describe("when empty editor", function() {
      return it("should do nothing", function() {
        editor.setText('');
        atom.commands.dispatch(workspaceView, 'change-case:camel');
        return expect(editor.getText()).toBe('');
      });
    });
    return describe("when text is selected", function() {
      return it("should camelcase selected text", function() {
        editor.setText('WorkspaceView');
        editor.moveToBottom();
        editor.selectToTop();
        editor.selectAll();
        atom.commands.dispatch(workspaceView, 'change-case:camel');
        return expect(editor.getText()).toBe('workspaceView');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jaGFuZ2UtY2FzZS9zcGVjL2NoYW5nZS1jYXNlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLDJCQUFBO0FBQUEsSUFBQSxPQUEwQixFQUExQixFQUFDLHVCQUFELEVBQWdCLGdCQUFoQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixXQUFwQixFQURjO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO0FBQUEsTUFHQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixhQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FIQSxDQUFBO2FBTUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsYUFBQSxHQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWhCLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsUUFFQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBRkEsQ0FBQTtlQUdBLE1BQU0sQ0FBQyxTQUFQLENBQUEsRUFKRztNQUFBLENBQUwsRUFQUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFlQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO2FBQzVCLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLEVBQWYsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsbUJBQXRDLENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixFQUE5QixFQUhzQjtNQUFBLENBQXhCLEVBRDRCO0lBQUEsQ0FBOUIsQ0FmQSxDQUFBO1dBcUJBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7YUFDaEMsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsZUFBZixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFNLENBQUMsV0FBUCxDQUFBLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUhBLENBQUE7QUFBQSxRQUlBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixhQUF2QixFQUFzQyxtQkFBdEMsQ0FKQSxDQUFBO2VBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGVBQTlCLEVBTm1DO01BQUEsQ0FBckMsRUFEZ0M7SUFBQSxDQUFsQyxFQXRCd0I7RUFBQSxDQUExQixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/change-case/spec/change-case-spec.coffee
