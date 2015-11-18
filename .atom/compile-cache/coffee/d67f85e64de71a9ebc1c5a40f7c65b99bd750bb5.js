(function() {
  var hasCommand;

  hasCommand = require('./spec-helper').hasCommand;

  describe('Set Syntax', function() {
    var workspaceElement;
    workspaceElement = [][0];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('set-syntax');
      });
    });
    describe('activation', function() {
      return it('adds the commands', function() {
        return expect(hasCommand(workspaceElement, 'set-syntax:JavaScript')).toBeTruthy();
      });
    });
    return describe('deactivation', function() {
      beforeEach(function() {
        return atom.packages.deactivatePackage('set-syntax');
      });
      return it('removes the commands', function() {
        return expect(hasCommand(workspaceElement, 'set-syntax:JavaScript')).toBeFalsy();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9zZXQtc3ludGF4L3NwZWMvbWFpbi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsZUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUNyQixRQUFBLGdCQUFBO0FBQUEsSUFBQyxtQkFBb0IsS0FBckIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO0FBQUEsTUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixxQkFBOUIsRUFEYztNQUFBLENBQWhCLENBRkEsQ0FBQTthQUtBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFlBQTlCLEVBRGM7TUFBQSxDQUFoQixFQU5TO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVdBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTthQUNyQixFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO2VBQ3RCLE1BQUEsQ0FBTyxVQUFBLENBQVcsZ0JBQVgsRUFBNkIsdUJBQTdCLENBQVAsQ0FBNkQsQ0FBQyxVQUE5RCxDQUFBLEVBRHNCO01BQUEsQ0FBeEIsRUFEcUI7SUFBQSxDQUF2QixDQVhBLENBQUE7V0FlQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBZCxDQUFnQyxZQUFoQyxFQURTO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQSxHQUFBO2VBQ3pCLE1BQUEsQ0FBTyxVQUFBLENBQVcsZ0JBQVgsRUFBNkIsdUJBQTdCLENBQVAsQ0FBNkQsQ0FBQyxTQUE5RCxDQUFBLEVBRHlCO01BQUEsQ0FBM0IsRUFKdUI7SUFBQSxDQUF6QixFQWhCcUI7RUFBQSxDQUF2QixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/set-syntax/spec/main-spec.coffee
