(function() {
  var Fs, Path, readFile;

  Path = require("path");

  Fs = require("fs");

  readFile = function(path) {
    return Fs.readFileSync(Path.join(__dirname, "./fixtures/", path), "utf8");
  };

  describe("Emmet", function() {
    var editor, editorElement, simulateTabKeyEvent, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1];
    console.log(atom.keymaps.onDidMatchBinding(function(event) {
      return console.log('Matched keybinding', event);
    }));
    simulateTabKeyEvent = function() {
      var event;
      event = keydownEvent("tab", {
        target: editorElement
      });
      return atom.keymaps.handleKeyboardEvent(event.originalEvent);
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("tabbing.html");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("emmet");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("snippets");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-css", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-sass", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-php", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-html", {
          sync: true
        });
      });
      return runs(function() {
        var _ref1, _ref2;
        if ((_ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
          if ((_ref2 = _ref1.mainModule) != null) {
            _ref2.getEmitter();
          }
        }
        editor = atom.workspace.getActiveTextEditor();
        return editorElement = atom.views.getView(editor);
      });
    });
    describe("tabbing", function() {
      beforeEach(function() {
        atom.workspace.open('tabbing.html');
        return editor.setCursorScreenPosition([1, 4]);
      });
      return it("moves the cursor along", function() {
        var cursorPos;
        simulateTabKeyEvent();
        cursorPos = editor.getCursorScreenPosition();
        return expect(cursorPos.column).toBe(6);
      });
    });
    return describe("emmet:expand-abbreviation", function() {
      var expansion;
      expansion = null;
      return describe("for normal HTML", function() {
        beforeEach(function() {
          editor.setText(readFile("abbreviation/before/html-abbrv.html"));
          editor.moveToEndOfLine();
          return expansion = readFile("abbreviation/after/html-abbrv.html");
        });
        it("expands HTML abbreviations via commands", function() {
          atom.commands.dispatch(editorElement, "emmet:expand-abbreviation");
          return expect(editor.getText()).toBe(expansion);
        });
        it("expands HTML abbreviations via keybindings", function() {
          var event;
          event = keydownEvent('e', {
            shiftKey: true,
            metaKey: true,
            target: editorElement
          });
          atom.keymaps.handleKeyboardEvent(event.originalEvent);
          return expect(editor.getText()).toBe(expansion);
        });
        return it("expands HTML abbreviations via Tab", function() {
          console.log(atom.keymaps.findKeyBindings({
            keystrokes: 'tab'
          }));
          simulateTabKeyEvent();
          return expect(editor.getText()).toBe(expansion);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9lbW1ldC9zcGVjL2VtbWV0LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7V0FDVCxFQUFFLENBQUMsWUFBSCxDQUFnQixJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsYUFBckIsRUFBb0MsSUFBcEMsQ0FBaEIsRUFBMkQsTUFBM0QsRUFEUztFQUFBLENBSFgsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTtBQUNoQixRQUFBLGdEQUFBO0FBQUEsSUFBQSxPQUEwQixFQUExQixFQUFDLGdCQUFELEVBQVMsdUJBQVQsQ0FBQTtBQUFBLElBRUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFiLENBQStCLFNBQUMsS0FBRCxHQUFBO2FBQ3pDLE9BQU8sQ0FBQyxHQUFSLENBQVksb0JBQVosRUFBa0MsS0FBbEMsRUFEeUM7SUFBQSxDQUEvQixDQUFaLENBRkEsQ0FBQTtBQUFBLElBTUEsbUJBQUEsR0FBc0IsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLFlBQUEsQ0FBYSxLQUFiLEVBQW9CO0FBQUEsUUFBQyxNQUFBLEVBQVEsYUFBVDtPQUFwQixDQUFSLENBQUE7YUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFiLENBQWlDLEtBQUssQ0FBQyxhQUF2QyxFQUZvQjtJQUFBLENBTnRCLENBQUE7QUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/emmet/spec/emmet-spec.coffee
