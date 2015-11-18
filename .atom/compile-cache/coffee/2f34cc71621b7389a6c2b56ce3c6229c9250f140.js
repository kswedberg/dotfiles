(function() {
  var toggleQuotes;

  toggleQuotes = require('../lib/toggle-quotes').toggleQuotes;

  describe("ToggleQuotes", function() {
    beforeEach(function() {
      return atom.config.set('toggle-quotes.quoteCharacters', '\'"');
    });
    describe("toggleQuotes(editor) js", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-javascript');
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-json');
        });
        waitsForPromise(function() {
          return atom.workspace.open();
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("console.log(\"Hello World\");\nconsole.log('Hello World');\nconsole.log(\"Hello 'World'\");\nconsole.log('Hello \"World\"');\nconsole.log('');");
          return editor.setGrammar(atom.grammars.selectGrammar('test.js'));
        });
      });
      describe("when the cursor is not inside a quoted string", function() {
        return it("does nothing", function() {
          return expect(function() {
            return toggleQuotes(editor);
          }).not.toThrow();
        });
      });
      describe("when the cursor is inside an empty single quoted string", function() {
        return it("switches the quotes to double", function() {
          editor.setCursorBufferPosition([4, 13]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(4)).toBe('console.log("");');
          return expect(editor.getCursorBufferPosition()).toEqual([4, 13]);
        });
      });
      describe("when the cursor is inside a double quoted string", function() {
        describe("when using default config", function() {
          return it("switches the double quotes to single quotes", function() {
            editor.setCursorBufferPosition([0, 16]);
            toggleQuotes(editor);
            expect(editor.lineTextForBufferRow(0)).toBe("console.log('Hello World');");
            return expect(editor.getCursorBufferPosition()).toEqual([0, 16]);
          });
        });
        return describe("when using custom config of backticks", function() {
          return it("switches the double quotes to backticks", function() {
            atom.config.set('toggle-quotes.quoteCharacters', '\'"`');
            editor.setCursorBufferPosition([0, 16]);
            toggleQuotes(editor);
            expect(editor.lineTextForBufferRow(0)).toBe("console.log(`Hello World`);");
            return expect(editor.getCursorBufferPosition()).toEqual([0, 16]);
          });
        });
      });
      describe("when the cursor is inside a single quoted string", function() {
        return it("switches the quotes to double", function() {
          editor.setCursorBufferPosition([1, 16]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(1)).toBe('console.log("Hello World");');
          return expect(editor.getCursorBufferPosition()).toEqual([1, 16]);
        });
      });
      describe("when the cursor is inside a single-quoted string that is nested within a double quoted string", function() {
        return it("switches the outer quotes to single and escapes the inner quotes", function() {
          editor.setCursorBufferPosition([2, 22]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(2)).toBe("console.log('Hello \\'World\\'');");
          expect(editor.getCursorBufferPosition()).toEqual([2, 22]);
          toggleQuotes(editor);
          return expect(editor.lineTextForBufferRow(2)).toBe('console.log("Hello \'World\'");');
        });
      });
      describe("when the cursor is inside a double-quoted string that is nested within a single quoted string", function() {
        return it("switches the outer quotes to double and escapes the inner quotes", function() {
          editor.setCursorBufferPosition([3, 22]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(3)).toBe('console.log("Hello \\"World\\"");');
          expect(editor.getCursorBufferPosition()).toEqual([3, 22]);
          toggleQuotes(editor);
          return expect(editor.lineTextForBufferRow(3)).toBe("console.log('Hello \"World\"');");
        });
      });
      describe("when the cursor is inside multiple quoted strings", function() {
        return it("switches the quotes of both quoted strings separately and leaves the cursors where they were, and does so atomically", function() {
          editor.setCursorBufferPosition([0, 16]);
          editor.addCursorAtBufferPosition([1, 16]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(0)).toBe("console.log('Hello World');");
          expect(editor.lineTextForBufferRow(1)).toBe('console.log("Hello World");');
          expect(editor.getCursors()[0].getBufferPosition()).toEqual([0, 16]);
          expect(editor.getCursors()[1].getBufferPosition()).toEqual([1, 16]);
          editor.undo();
          expect(editor.lineTextForBufferRow(0)).toBe('console.log("Hello World");');
          expect(editor.lineTextForBufferRow(1)).toBe("console.log('Hello World');");
          expect(editor.getCursors()[0].getBufferPosition()).toEqual([0, 16]);
          return expect(editor.getCursors()[1].getBufferPosition()).toEqual([1, 16]);
        });
      });
      return describe("when the cursor is on an invalid region", function() {
        describe("when it is quoted", function() {
          return it("toggles the quotes", function() {
            editor.setGrammar(atom.grammars.selectGrammar('test.json'));
            editor.setText("{'invalid': true}");
            editor.setCursorBufferPosition([0, 4]);
            toggleQuotes(editor);
            return expect(editor.getText()).toBe('{"invalid": true}');
          });
        });
        return describe("when it is not quoted", function() {
          return it("does not toggle the quotes", function() {
            editor.setGrammar(atom.grammars.selectGrammar('test.json'));
            editor.setText("{invalid: true}");
            editor.setCursorBufferPosition([0, 4]);
            toggleQuotes(editor);
            return expect(editor.getText()).toBe('{invalid: true}');
          });
        });
      });
    });
    describe("toggleQuotes(editor) python", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-python');
        });
        waitsForPromise(function() {
          return atom.workspace.open();
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("print(u\"Hello World\")\nprint(r'')");
          return editor.setGrammar(atom.grammars.selectGrammar('test.py'));
        });
      });
      describe("when cursor is inside a double quoted unicode string", function() {
        return it("switches quotes to single excluding unicode character", function() {
          editor.setCursorBufferPosition([0, 16]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(0)).toBe("print(u'Hello World')");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 16]);
        });
      });
      return describe("when cursor is inside an empty single quoted raw string", function() {
        return it("switches quotes to double", function() {
          editor.setCursorBufferPosition([1, 8]);
          toggleQuotes(editor);
          expect(editor.lineTextForBufferRow(1)).toBe('print(r"")');
          return expect(editor.getCursorBufferPosition()).toEqual([1, 8]);
        });
      });
    });
    return it("activates when a command is triggered", function() {
      var activatePromise;
      activatePromise = atom.packages.activatePackage('toggle-quotes');
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      runs(function() {
        var editor;
        editor = atom.workspace.getActiveTextEditor();
        return atom.commands.dispatch(atom.views.getView(editor), 'toggle-quotes:toggle');
      });
      return waitsForPromise(function() {
        return activatePromise;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL3NwZWMvdG9nZ2xlLXF1b3Rlcy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUMsZUFBZ0IsT0FBQSxDQUFRLHNCQUFSLEVBQWhCLFlBQUQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsK0JBQWhCLEVBQWlELEtBQWpELEVBRFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBR0EsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFULENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixxQkFBOUIsRUFEYztRQUFBLENBQWhCLENBQUEsQ0FBQTtBQUFBLFFBR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCLEVBRGM7UUFBQSxDQUFoQixDQUhBLENBQUE7QUFBQSxRQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLEVBRGM7UUFBQSxDQUFoQixDQU5BLENBQUE7ZUFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxnSkFBZixDQURBLENBQUE7aUJBUUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFkLENBQTRCLFNBQTVCLENBQWxCLEVBVEc7UUFBQSxDQUFMLEVBVlM7TUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLE1BdUJBLFFBQUEsQ0FBUywrQ0FBVCxFQUEwRCxTQUFBLEdBQUE7ZUFDeEQsRUFBQSxDQUFHLGNBQUgsRUFBbUIsU0FBQSxHQUFBO2lCQUNqQixNQUFBLENBQU8sU0FBQSxHQUFBO21CQUFHLFlBQUEsQ0FBYSxNQUFiLEVBQUg7VUFBQSxDQUFQLENBQStCLENBQUMsR0FBRyxDQUFDLE9BQXBDLENBQUEsRUFEaUI7UUFBQSxDQUFuQixFQUR3RDtNQUFBLENBQTFELENBdkJBLENBQUE7QUFBQSxNQTJCQSxRQUFBLENBQVMseURBQVQsRUFBb0UsU0FBQSxHQUFBO2VBQ2xFLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsVUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvQixDQUFBLENBQUE7QUFBQSxVQUNBLFlBQUEsQ0FBYSxNQUFiLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUE1QixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsa0JBQTVDLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakQsRUFKa0M7UUFBQSxDQUFwQyxFQURrRTtNQUFBLENBQXBFLENBM0JBLENBQUE7QUFBQSxNQWtDQSxRQUFBLENBQVMsa0RBQVQsRUFBNkQsU0FBQSxHQUFBO0FBQzNELFFBQUEsUUFBQSxDQUFTLDJCQUFULEVBQXNDLFNBQUEsR0FBQTtpQkFDcEMsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUEsR0FBQTtBQUNoRCxZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFlBQ0EsWUFBQSxDQUFhLE1BQWIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0Qyw2QkFBNUMsQ0FGQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqRCxFQUpnRDtVQUFBLENBQWxELEVBRG9DO1FBQUEsQ0FBdEMsQ0FBQSxDQUFBO2VBT0EsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUEsR0FBQTtpQkFDaEQsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtBQUM1QyxZQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsRUFBaUQsTUFBakQsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvQixDQURBLENBQUE7QUFBQSxZQUVBLFlBQUEsQ0FBYSxNQUFiLENBRkEsQ0FBQTtBQUFBLFlBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUE1QixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsNkJBQTVDLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakQsRUFMNEM7VUFBQSxDQUE5QyxFQURnRDtRQUFBLENBQWxELEVBUjJEO01BQUEsQ0FBN0QsQ0FsQ0EsQ0FBQTtBQUFBLE1Ba0RBLFFBQUEsQ0FBUyxrREFBVCxFQUE2RCxTQUFBLEdBQUE7ZUFDM0QsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxVQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFVBQ0EsWUFBQSxDQUFhLE1BQWIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0Qyw2QkFBNUMsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqRCxFQUprQztRQUFBLENBQXBDLEVBRDJEO01BQUEsQ0FBN0QsQ0FsREEsQ0FBQTtBQUFBLE1BeURBLFFBQUEsQ0FBUywrRkFBVCxFQUEwRyxTQUFBLEdBQUE7ZUFDeEcsRUFBQSxDQUFHLGtFQUFILEVBQXVFLFNBQUEsR0FBQTtBQUNyRSxVQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxFQUFKLENBQS9CLENBQUEsQ0FBQTtBQUFBLFVBQ0EsWUFBQSxDQUFhLE1BQWIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxtQ0FBNUMsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakQsQ0FIQSxDQUFBO0FBQUEsVUFLQSxZQUFBLENBQWEsTUFBYixDQUxBLENBQUE7aUJBTUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUE1QixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsaUNBQTVDLEVBUHFFO1FBQUEsQ0FBdkUsRUFEd0c7TUFBQSxDQUExRyxDQXpEQSxDQUFBO0FBQUEsTUFtRUEsUUFBQSxDQUFTLCtGQUFULEVBQTBHLFNBQUEsR0FBQTtlQUN4RyxFQUFBLENBQUcsa0VBQUgsRUFBdUUsU0FBQSxHQUFBO0FBQ3JFLFVBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxZQUFBLENBQWEsTUFBYixDQURBLENBQUE7QUFBQSxVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsQ0FBNUIsQ0FBUCxDQUFzQyxDQUFDLElBQXZDLENBQTRDLG1DQUE1QyxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFqRCxDQUhBLENBQUE7QUFBQSxVQUtBLFlBQUEsQ0FBYSxNQUFiLENBTEEsQ0FBQTtpQkFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxpQ0FBNUMsRUFQcUU7UUFBQSxDQUF2RSxFQUR3RztNQUFBLENBQTFHLENBbkVBLENBQUE7QUFBQSxNQTZFQSxRQUFBLENBQVMsbURBQVQsRUFBOEQsU0FBQSxHQUFBO2VBQzVELEVBQUEsQ0FBRyxzSEFBSCxFQUEySCxTQUFBLEdBQUE7QUFDekgsVUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvQixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQWpDLENBREEsQ0FBQTtBQUFBLFVBRUEsWUFBQSxDQUFhLE1BQWIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0Qyw2QkFBNUMsQ0FIQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0Qyw2QkFBNUMsQ0FKQSxDQUFBO0FBQUEsVUFLQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFvQixDQUFBLENBQUEsQ0FBRSxDQUFDLGlCQUF2QixDQUFBLENBQVAsQ0FBa0QsQ0FBQyxPQUFuRCxDQUEyRCxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNELENBTEEsQ0FBQTtBQUFBLFVBTUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBb0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxpQkFBdkIsQ0FBQSxDQUFQLENBQWtELENBQUMsT0FBbkQsQ0FBMkQsQ0FBQyxDQUFELEVBQUksRUFBSixDQUEzRCxDQU5BLENBQUE7QUFBQSxVQVFBLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FSQSxDQUFBO0FBQUEsVUFTQSxNQUFBLENBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0Qyw2QkFBNUMsQ0FUQSxDQUFBO0FBQUEsVUFVQSxNQUFBLENBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0Qyw2QkFBNUMsQ0FWQSxDQUFBO0FBQUEsVUFXQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFvQixDQUFBLENBQUEsQ0FBRSxDQUFDLGlCQUF2QixDQUFBLENBQVAsQ0FBa0QsQ0FBQyxPQUFuRCxDQUEyRCxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNELENBWEEsQ0FBQTtpQkFZQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFvQixDQUFBLENBQUEsQ0FBRSxDQUFDLGlCQUF2QixDQUFBLENBQVAsQ0FBa0QsQ0FBQyxPQUFuRCxDQUEyRCxDQUFDLENBQUQsRUFBSSxFQUFKLENBQTNELEVBYnlIO1FBQUEsQ0FBM0gsRUFENEQ7TUFBQSxDQUE5RCxDQTdFQSxDQUFBO2FBNkZBLFFBQUEsQ0FBUyx5Q0FBVCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsUUFBQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO2lCQUM1QixFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFlBQUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFkLENBQTRCLFdBQTVCLENBQWxCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxtQkFBZixDQURBLENBQUE7QUFBQSxZQUVBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBRkEsQ0FBQTtBQUFBLFlBR0EsWUFBQSxDQUFhLE1BQWIsQ0FIQSxDQUFBO21CQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQkFBOUIsRUFMdUI7VUFBQSxDQUF6QixFQUQ0QjtRQUFBLENBQTlCLENBQUEsQ0FBQTtlQVFBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7aUJBQ2hDLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsWUFBQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWQsQ0FBNEIsV0FBNUIsQ0FBbEIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsT0FBUCxDQUFlLGlCQUFmLENBREEsQ0FBQTtBQUFBLFlBRUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FGQSxDQUFBO0FBQUEsWUFHQSxZQUFBLENBQWEsTUFBYixDQUhBLENBQUE7bUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlCQUE5QixFQUwrQjtVQUFBLENBQWpDLEVBRGdDO1FBQUEsQ0FBbEMsRUFUa0Q7TUFBQSxDQUFwRCxFQTlGa0M7SUFBQSxDQUFwQyxDQUhBLENBQUE7QUFBQSxJQWtIQSxRQUFBLENBQVMsNkJBQVQsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGlCQUE5QixFQURjO1FBQUEsQ0FBaEIsQ0FBQSxDQUFBO0FBQUEsUUFHQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxFQURjO1FBQUEsQ0FBaEIsQ0FIQSxDQUFBO2VBTUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUscUNBQWYsQ0FEQSxDQUFBO2lCQUtBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBZCxDQUE0QixTQUE1QixDQUFsQixFQU5HO1FBQUEsQ0FBTCxFQVBTO01BQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxNQWlCQSxRQUFBLENBQVMsc0RBQVQsRUFBaUUsU0FBQSxHQUFBO2VBQy9ELEVBQUEsQ0FBRyx1REFBSCxFQUE0RCxTQUFBLEdBQUE7QUFDMUQsVUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksRUFBSixDQUEvQixDQUFBLENBQUE7QUFBQSxVQUNBLFlBQUEsQ0FBYSxNQUFiLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUE1QixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsdUJBQTVDLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBakQsRUFKMEQ7UUFBQSxDQUE1RCxFQUQrRDtNQUFBLENBQWpFLENBakJBLENBQUE7YUF3QkEsUUFBQSxDQUFTLHlEQUFULEVBQW9FLFNBQUEsR0FBQTtlQUNsRSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFVBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxZQUFBLENBQWEsTUFBYixDQURBLENBQUE7QUFBQSxVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsQ0FBNUIsQ0FBUCxDQUFzQyxDQUFDLElBQXZDLENBQTRDLFlBQTVDLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBakQsRUFKOEI7UUFBQSxDQUFoQyxFQURrRTtNQUFBLENBQXBFLEVBekJzQztJQUFBLENBQXhDLENBbEhBLENBQUE7V0FrSkEsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxVQUFBLGVBQUE7QUFBQSxNQUFBLGVBQUEsR0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCLENBQWxCLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUEsRUFEYztNQUFBLENBQWhCLENBRkEsQ0FBQTtBQUFBLE1BS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7ZUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQXZCLEVBQW1ELHNCQUFuRCxFQUZHO01BQUEsQ0FBTCxDQUxBLENBQUE7YUFTQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLGdCQUFIO01BQUEsQ0FBaEIsRUFWMEM7SUFBQSxDQUE1QyxFQW5KdUI7RUFBQSxDQUF6QixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/toggle-quotes/spec/toggle-quotes-spec.coffee
