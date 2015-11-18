(function() {
  var CoffeeCompileEditor, fs;

  CoffeeCompileEditor = require('../lib/coffee-compile-editor');

  fs = require('fs');

  describe("CoffeeCompileEditor", function() {
    var compiled, editor;
    compiled = null;
    editor = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-coffee-script');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('coffee-compile');
      });
      return waitsForPromise(function() {
        return atom.project.open('test.coffee').then(function(o) {
          return editor = o;
        });
      });
    });
    return it("should compile and display compiled js with no errors", function() {
      spyOn(CoffeeCompileEditor.prototype, "renderCompiled");
      compiled = new CoffeeCompileEditor({
        sourceEditor: editor
      });
      compiled.renderCompiled();
      return expect(CoffeeCompileEditor.prototype.renderCompiled).toHaveBeenCalled();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9zcGVjL2NvZmZlZS1jb21waWxlLWVkaXRvci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTs7QUFBQSxFQUFBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSw4QkFBUixDQUF0QixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsUUFBQSxnQkFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLElBQVgsQ0FBQTtBQUFBLElBQ0EsTUFBQSxHQUFXLElBRFgsQ0FBQTtBQUFBLElBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsd0JBQTlCLEVBRGM7TUFBQSxDQUFoQixDQUFBLENBQUE7QUFBQSxNQUdBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGdCQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FIQSxDQUFBO2FBTUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQWIsQ0FBa0IsYUFBbEIsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxTQUFDLENBQUQsR0FBQTtpQkFDcEMsTUFBQSxHQUFTLEVBRDJCO1FBQUEsQ0FBdEMsRUFEYztNQUFBLENBQWhCLEVBUFM7SUFBQSxDQUFYLENBSEEsQ0FBQTtXQWNBLEVBQUEsQ0FBRyx1REFBSCxFQUE0RCxTQUFBLEdBQUE7QUFDMUQsTUFBQSxLQUFBLENBQU0sbUJBQW1CLENBQUMsU0FBMUIsRUFBcUMsZ0JBQXJDLENBQUEsQ0FBQTtBQUFBLE1BRUEsUUFBQSxHQUFlLElBQUEsbUJBQUEsQ0FBb0I7QUFBQSxRQUFDLFlBQUEsRUFBYyxNQUFmO09BQXBCLENBRmYsQ0FBQTtBQUFBLE1BR0EsUUFBUSxDQUFDLGNBQVQsQ0FBQSxDQUhBLENBQUE7YUFLQSxNQUFBLENBQU8sbUJBQW1CLENBQUMsU0FBUyxDQUFDLGNBQXJDLENBQW9ELENBQUMsZ0JBQXJELENBQUEsRUFOMEQ7SUFBQSxDQUE1RCxFQWY4QjtFQUFBLENBQWhDLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/spec/coffee-compile-editor-spec.coffee
