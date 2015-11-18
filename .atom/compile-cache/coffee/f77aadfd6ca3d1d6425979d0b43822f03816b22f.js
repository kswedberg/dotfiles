(function() {
  describe('Blame', function() {
    var activationPromise, activeGutterElement, editorElement, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1], editorElement = _ref[2];
    activeGutterElement = function() {
      var editor, gutterElement;
      editor = atom.workspace.getActiveTextEditor();
      editorElement = atom.views.getView(editor);
      gutterElement = editorElement.shadowRoot.querySelector('.gutter[gutter-name=blame]');
      return gutterElement;
    };
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('blame');
    });
    describe('when the blame:toggle event is triggered', function() {
      return it('hides and shows the gutter', function() {
        waitsForPromise(function() {
          return atom.workspace.open('empty.txt');
        });
        waitsForPromise(function() {
          expect(activeGutterElement()).not.toExist();
          atom.commands.dispatch(workspaceElement, 'blame:toggle');
          return activationPromise;
        });
        return runs(function() {
          var gutterElement;
          gutterElement = activeGutterElement();
          expect(gutterElement).toExist();
          expect(gutterElement.style.display).toBe('');
          atom.commands.dispatch(workspaceElement, 'blame:toggle');
          return expect(gutterElement.style.display).toBe('none');
        });
      });
    });
    return describe('when when package is deativated', function() {
      return it('removes the gutter', function() {
        waitsForPromise(function() {
          return atom.workspace.open('empty.txt');
        });
        waitsForPromise(function() {
          expect(activeGutterElement()).not.toExist();
          atom.commands.dispatch(workspaceElement, 'blame:toggle');
          return activationPromise;
        });
        return runs(function() {
          expect(activeGutterElement()).toExist();
          atom.packages.deactivatePackage('blame');
          return expect(activeGutterElement()).not.toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibGFtZS9zcGVjL2JsYW1lLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBT0E7QUFBQSxFQUFBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtBQUNoQixRQUFBLDZFQUFBO0FBQUEsSUFBQSxPQUF1RCxFQUF2RCxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixFQUFzQyx1QkFBdEMsQ0FBQTtBQUFBLElBRUEsbUJBQUEsR0FBc0IsU0FBQSxHQUFBO0FBRXBCLFVBQUEscUJBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQURoQixDQUFBO0FBQUEsTUFFQSxhQUFBLEdBQWdCLGFBQWEsQ0FBQyxVQUM1QixDQUFDLGFBRGEsQ0FDQyw0QkFERCxDQUZoQixDQUFBO0FBS0EsYUFBTyxhQUFQLENBUG9CO0lBQUEsQ0FGdEIsQ0FBQTtBQUFBLElBV0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE9BQTlCLEVBRlg7SUFBQSxDQUFYLENBWEEsQ0FBQTtBQUFBLElBZUEsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTthQUNuRCxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBRS9CLFFBQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCLEVBQUg7UUFBQSxDQUFoQixDQUFBLENBQUE7QUFBQSxRQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO0FBRWQsVUFBQSxNQUFBLENBQU8sbUJBQUEsQ0FBQSxDQUFQLENBQTZCLENBQUMsR0FBRyxDQUFDLE9BQWxDLENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLGNBQXpDLENBRkEsQ0FBQTtBQUlBLGlCQUFPLGlCQUFQLENBTmM7UUFBQSxDQUFoQixDQUZBLENBQUE7ZUFVQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBRUgsY0FBQSxhQUFBO0FBQUEsVUFBQSxhQUFBLEdBQWdCLG1CQUFBLENBQUEsQ0FBaEIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLGFBQVAsQ0FBcUIsQ0FBQyxPQUF0QixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBM0IsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxFQUF6QyxDQUZBLENBQUE7QUFBQSxVQUlBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsY0FBekMsQ0FKQSxDQUFBO2lCQU1BLE1BQUEsQ0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQTNCLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsTUFBekMsRUFSRztRQUFBLENBQUwsRUFaK0I7TUFBQSxDQUFqQyxFQURtRDtJQUFBLENBQXJELENBZkEsQ0FBQTtXQXNDQSxRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQSxHQUFBO2FBQzFDLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFFdkIsUUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsV0FBcEIsRUFBSDtRQUFBLENBQWhCLENBQUEsQ0FBQTtBQUFBLFFBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7QUFFZCxVQUFBLE1BQUEsQ0FBTyxtQkFBQSxDQUFBLENBQVAsQ0FBNkIsQ0FBQyxHQUFHLENBQUMsT0FBbEMsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsY0FBekMsQ0FGQSxDQUFBO0FBSUEsaUJBQU8saUJBQVAsQ0FOYztRQUFBLENBQWhCLENBRkEsQ0FBQTtlQVVBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFFSCxVQUFBLE1BQUEsQ0FBTyxtQkFBQSxDQUFBLENBQVAsQ0FBNkIsQ0FBQyxPQUE5QixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBZCxDQUFnQyxPQUFoQyxDQURBLENBQUE7aUJBR0EsTUFBQSxDQUFPLG1CQUFBLENBQUEsQ0FBUCxDQUE2QixDQUFDLEdBQUcsQ0FBQyxPQUFsQyxDQUFBLEVBTEc7UUFBQSxDQUFMLEVBWnVCO01BQUEsQ0FBekIsRUFEMEM7SUFBQSxDQUE1QyxFQXZDZ0I7RUFBQSxDQUFsQixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/blame/spec/blame-spec.coffee
