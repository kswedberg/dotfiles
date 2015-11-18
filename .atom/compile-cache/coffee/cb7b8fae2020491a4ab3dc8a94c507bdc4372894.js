(function() {
  describe('HTML Entities Package', function() {
    var editor, workspaceElement, _ref;
    _ref = [], editor = _ref[0], workspaceElement = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.packages.activatePackage('html-entities');
      });
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe('html encode', function() {
      beforeEach(function() {
        editor.setText('<html>');
        return atom.commands.dispatch(workspaceElement, 'html-entities:encode');
      });
      return it('encodes html entities', function() {
        return expect(editor.getText()).toBe('&lt;html&gt;');
      });
    });
    return describe('html decode', function() {
      beforeEach(function() {
        editor.setText('&amp;áéí&gt;');
        return atom.commands.dispatch(workspaceElement, 'html-entities:decode');
      });
      return it('decodes html entities', function() {
        return expect(editor.getText()).toBe('&áéí>');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9odG1sLWVudGl0aWVzL3NwZWMvaHRtbC1lbnRpdGllcy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFFBQUEsOEJBQUE7QUFBQSxJQUFBLE9BQTZCLEVBQTdCLEVBQUMsZ0JBQUQsRUFBUywwQkFBVCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCLEVBRGM7TUFBQSxDQUFoQixDQUZBLENBQUE7QUFBQSxNQUtBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUEsRUFEWTtNQUFBLENBQWhCLENBTEEsQ0FBQTthQVFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLEVBRE47TUFBQSxDQUFMLEVBVFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBY0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxRQUFmLENBQUEsQ0FBQTtlQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsc0JBQXpDLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7ZUFDMUIsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGNBQTlCLEVBRDBCO01BQUEsQ0FBNUIsRUFMc0I7SUFBQSxDQUF4QixDQWRBLENBQUE7V0FzQkEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxjQUFmLENBQUEsQ0FBQTtlQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsc0JBQXpDLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7ZUFDMUIsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLE9BQTlCLEVBRDBCO01BQUEsQ0FBNUIsRUFMc0I7SUFBQSxDQUF4QixFQXZCZ0M7RUFBQSxDQUFsQyxDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/html-entities/spec/html-entities-spec.coffee
