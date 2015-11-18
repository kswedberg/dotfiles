(function() {
  describe("sorting lines", function() {
    var activationPromise, editor, editorView, reverseLines, sortLineCaseInsensitive, sortLines, uniqueLines, _ref;
    _ref = [], activationPromise = _ref[0], editor = _ref[1], editorView = _ref[2];
    sortLines = function(callback) {
      atom.commands.dispatch(editorView, "lines:sort");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    reverseLines = function(callback) {
      atom.commands.dispatch(editorView, "lines:reverse");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    uniqueLines = function(callback) {
      atom.commands.dispatch(editorView, "lines:unique");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    sortLineCaseInsensitive = function(callback) {
      atom.commands.dispatch(editorView, "lines:case-insensitive-sort");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        return activationPromise = atom.packages.activatePackage('lines');
      });
    });
    describe("when no lines are selected", function() {
      it("sorts all lines", function() {
        editor.setText("Hydrogen\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Helium\nHydrogen\nLithium");
        });
      });
      return it("sorts all lines, ignoring the trailing new line", function() {
        editor.setText("Hydrogen\nHelium\nLithium\n");
        editor.setCursorBufferPosition([0, 0]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Helium\nHydrogen\nLithium\n");
        });
      });
    });
    describe("when entire lines are selected", function() {
      return it("sorts the selected lines", function() {
        editor.setText("Hydrogen\nHelium\nLithium\nBeryllium\nBoron");
        editor.setSelectedBufferRange([[1, 0], [4, 0]]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nBeryllium\nHelium\nLithium\nBoron");
        });
      });
    });
    describe("when partial lines are selected", function() {
      return it("sorts the selected lines", function() {
        editor.setText("Hydrogen\nHelium\nLithium\nBeryllium\nBoron");
        editor.setSelectedBufferRange([[1, 3], [3, 2]]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nBeryllium\nHelium\nLithium\nBoron");
        });
      });
    });
    describe("when there are multiple selection ranges", function() {
      return it("sorts the lines in each selection range", function() {
        editor.setText("Hydrogen\nHelium    # selection 1\nBeryllium # selection 1\nCarbon\nFluorine  # selection 2\nAluminum  # selection 2\nGallium\nEuropium");
        editor.addSelectionForBufferRange([[1, 0], [3, 0]]);
        editor.addSelectionForBufferRange([[4, 0], [6, 0]]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nBeryllium # selection 1\nHelium    # selection 1\nCarbon\nAluminum  # selection 2\nFluorine  # selection 2\nGallium\nEuropium");
        });
      });
    });
    describe("reverse lines", function() {
      return it("reverses all lines", function() {
        editor.setText("Hydrogen\nAluminum\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return reverseLines(function() {
          return expect(editor.getText()).toBe("Lithium\nHelium\nAluminum\nHydrogen");
        });
      });
    });
    describe("uniqueing", function() {
      return it("uniques all lines but does not change order", function() {
        editor.setText("Hydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return uniqueLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nHelium\nLithium");
        });
      });
    });
    return describe("case-insensitive sorting", function() {
      return it("sorts all lines, ignoring case", function() {
        editor.setText("Hydrogen\nlithium\nhelium\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return sortLineCaseInsensitive(function() {
          return expect(editor.getText()).toBe("helium\nHelium\nHydrogen\nlithium\nLithium");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW5lcy9zcGVjL2xpbmVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxFQUFBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLDBHQUFBO0FBQUEsSUFBQSxPQUEwQyxFQUExQyxFQUFDLDJCQUFELEVBQW9CLGdCQUFwQixFQUE0QixvQkFBNUIsQ0FBQTtBQUFBLElBRUEsU0FBQSxHQUFZLFNBQUMsUUFBRCxHQUFBO0FBQ1YsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUMsWUFBbkMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLGtCQUFIO01BQUEsQ0FBaEIsQ0FEQSxDQUFBO2FBRUEsSUFBQSxDQUFLLFFBQUwsRUFIVTtJQUFBLENBRlosQ0FBQTtBQUFBLElBT0EsWUFBQSxHQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ2IsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUMsZUFBbkMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLGtCQUFIO01BQUEsQ0FBaEIsQ0FEQSxDQUFBO2FBRUEsSUFBQSxDQUFLLFFBQUwsRUFIYTtJQUFBLENBUGYsQ0FBQTtBQUFBLElBWUEsV0FBQSxHQUFjLFNBQUMsUUFBRCxHQUFBO0FBQ1osTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUMsY0FBbkMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLGtCQUFIO01BQUEsQ0FBaEIsQ0FEQSxDQUFBO2FBRUEsSUFBQSxDQUFLLFFBQUwsRUFI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

//# sourceURL=/Users/kswedberg/.atom/packages/lines/spec/lines-spec.coffee
