(function() {
  var WordJumper;

  WordJumper = require('../lib/word-jumper-deluxe');

  describe("LineJumper", function() {
    var editor, workspaceElement, _ref;
    _ref = [], editor = _ref[0], workspaceElement = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise(function() {
        return Promise.all([
          atom.packages.activatePackage("word-jumper-deluxe"), atom.workspace.open('sample.js').then(function(e) {
            return editor = e;
          })
        ]);
      });
    });
    return describe("moving and selecting right", function() {
      it("moves right 2-times", function() {
        var pos, _i;
        for (_i = 1; _i <= 2; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:move-right');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([0, 8]);
      });
      it("moves right 3-times", function() {
        var pos, _i;
        for (_i = 1; _i <= 3; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:move-right');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([0, 13]);
      });
      it("moves right 13-times", function() {
        var pos, _i;
        for (_i = 1; _i <= 13; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:move-right');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([0, 40]);
      });
      it("moves right 16-times", function() {
        var pos, _i;
        for (_i = 1; _i <= 16; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:move-right');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([1, 0]);
      });
      it("moves right 20-times and left 3-times", function() {
        var pos, _i, _j;
        for (_i = 1; _i <= 20; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:move-right');
        }
        for (_j = 1; _j <= 3; _j++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:move-left');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([1, 3]);
      });
      it("moves right 15-times and left 3-times", function() {
        var pos, _i, _j;
        for (_i = 1; _i <= 15; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:move-right');
        }
        for (_j = 1; _j <= 3; _j++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:move-left');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([0, 38]);
      });
      it("selects right 2-times", function() {
        var selectedText, _i;
        for (_i = 1; _i <= 2; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:select-right');
        }
        selectedText = editor.getLastSelection().getText();
        return expect(selectedText).toEqual("var test");
      });
      it("selects right 5-times and left 2-times", function() {
        var selectedText, _i, _j;
        for (_i = 1; _i <= 5; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:select-right');
        }
        for (_j = 1; _j <= 2; _j++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:select-left');
        }
        selectedText = editor.getLastSelection().getText();
        return expect(selectedText).toEqual("var testCamel");
      });
      it("does not select opening parenthesis", function() {
        var selectedText, _i;
        for (_i = 1; _i <= 39; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:move-right');
        }
        atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:select-left');
        selectedText = editor.getLastSelection().getText();
        return expect(selectedText).toEqual("argument");
      });
      return it("does not delete indentation space", function() {
        var selectedText, _i;
        for (_i = 1; _i <= 45; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:move-right');
        }
        atom.commands.dispatch(workspaceElement, 'word-jumper-deluxe:remove-left');
        selectedText = editor.lineTextForBufferRow(3);
        return expect(selectedText).toEqual("    _indented()");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy93b3JkLWp1bXBlci1kZWx1eGUvc3BlYy93b3JkLWp1bXBlci1kZWx1eGUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsMkJBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFFBQUEsOEJBQUE7QUFBQSxJQUFBLE9BQTZCLEVBQTdCLEVBQUMsZ0JBQUQsRUFBUywwQkFBVCxDQUFBO0FBQUEsSUFDQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7YUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLE9BQU8sQ0FBQyxHQUFSLENBQVk7VUFDVixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsb0JBQTlCLENBRFUsRUFFVixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsV0FBcEIsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxTQUFDLENBQUQsR0FBQTttQkFDcEMsTUFBQSxHQUFTLEVBRDJCO1VBQUEsQ0FBdEMsQ0FGVTtTQUFaLEVBRGM7TUFBQSxDQUFoQixFQUZTO0lBQUEsQ0FBWCxDQURBLENBQUE7V0FVQSxRQUFBLENBQVMsNEJBQVQsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLE1BQUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixZQUFBLE9BQUE7QUFBQSxhQUE4RSxxQkFBOUUsR0FBQTtBQUFBLFVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENB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

//# sourceURL=/Users/kswedberg/.atom/packages/word-jumper-deluxe/spec/word-jumper-deluxe-spec.coffee
