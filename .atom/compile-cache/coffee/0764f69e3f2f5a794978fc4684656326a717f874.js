(function() {
  var WordJumper;

  WordJumper = require('../lib/word-jumper');

  describe("LineJumper", function() {
    var editor, workspaceElement, _ref;
    _ref = [], editor = _ref[0], workspaceElement = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise(function() {
        return Promise.all([
          atom.packages.activatePackage("word-jumper"), atom.workspace.open('sample.js').then(function(e) {
            return editor = e;
          })
        ]);
      });
    });
    return describe("moving and selecting right", function() {
      it("moves right 2-times", function() {
        var pos, _i;
        for (_i = 1; _i <= 2; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:move-right');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([0, 8]);
      });
      it("moves right 3-times", function() {
        var pos, _i;
        for (_i = 1; _i <= 3; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:move-right');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([0, 13]);
      });
      it("moves right 13-times", function() {
        var pos, _i;
        for (_i = 1; _i <= 13; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:move-right');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([0, 40]);
      });
      it("moves right 16-times", function() {
        var pos, _i;
        for (_i = 1; _i <= 16; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:move-right');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([1, 0]);
      });
      it("moves right 20-times and left 3-times", function() {
        var pos, _i, _j;
        for (_i = 1; _i <= 20; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:move-right');
        }
        for (_j = 1; _j <= 3; _j++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:move-left');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([1, 3]);
      });
      it("moves right 15-times and left 3-times", function() {
        var pos, _i, _j;
        for (_i = 1; _i <= 15; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:move-right');
        }
        for (_j = 1; _j <= 3; _j++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:move-left');
        }
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([0, 36]);
      });
      it("selectes right 2-times", function() {
        var selectedText, _i;
        for (_i = 1; _i <= 2; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:select-right');
        }
        selectedText = editor.getLastSelection().getText();
        return expect(selectedText).toEqual("var test");
      });
      return it("selectes right 5-times and left 2-times", function() {
        var selectedText, _i, _j;
        for (_i = 1; _i <= 5; _i++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:select-right');
        }
        for (_j = 1; _j <= 2; _j++) {
          atom.commands.dispatch(workspaceElement, 'word-jumper:select-left');
        }
        selectedText = editor.getLastSelection().getText();
        return expect(selectedText).toEqual("var testCamel");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy93b3JkLWp1bXBlci9zcGVjL3dvcmQtanVtcGVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG9CQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUNyQixRQUFBLDhCQUFBO0FBQUEsSUFBQSxPQUE2QixFQUE3QixFQUFDLGdCQUFELEVBQVMsMEJBQVQsQ0FBQTtBQUFBLElBQ0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxPQUFPLENBQUMsR0FBUixDQUFZO1VBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGFBQTlCLENBRFUsRUFFVixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsV0FBcEIsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxTQUFDLENBQUQsR0FBQTttQkFDcEMsTUFBQSxHQUFTLEVBRDJCO1VBQUEsQ0FBdEMsQ0FGVTtTQUFaLEVBRGM7TUFBQSxDQUFoQixFQUZTO0lBQUEsQ0FBWCxDQURBLENBQUE7V0FVQSxRQUFBLENBQVMsNEJBQVQsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLE1BQUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixZQUFBLE9BQUE7QUFBQSxhQUF1RSxxQkFBdkUsR0FBQTtBQUFBLFVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5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

//# sourceURL=/Users/kswedberg/.atom/packages/word-jumper/spec/word-jumper-spec.coffee
