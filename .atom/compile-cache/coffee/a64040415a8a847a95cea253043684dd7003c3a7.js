(function() {
  describe("Tag autocomplete tests", function() {
    var buffer, editor, languageMode, _ref;
    _ref = [], editor = _ref[0], buffer = _ref[1], languageMode = _ref[2];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      waitsForPromise(function() {
        return atom.workspace.open("foofoo", {
          autoIndent: false
        }).then(function(o) {
          var grammar;
          editor = o;
          buffer = editor.buffer, languageMode = editor.languageMode;
          grammar = atom.grammars.grammarForScopeName("source.js.jsx");
          return editor.setGrammar(grammar);
        });
      });
      return afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
    });
    return describe("tag handling", function() {
      it("should autocomplete tag", function() {
        editor.insertText('<p');
        editor.insertText('>');
        return expect(editor.getText()).toBe('<p></p>');
      });
      it("should not autocomplete tag attributes", function() {
        editor.insertText('<p attr={ 1');
        editor.insertText('>');
        return expect(editor.getText()).toBe('<p attr={ 1>');
      });
      it("should not autocomplete tag attributes with arrow functions", function() {
        editor.insertText('<p attr={number =');
        editor.insertText('>');
        return expect(editor.getText()).toBe('<p attr={number =>');
      });
      it("should not autocomplete tag attributes when insterted between", function() {
        editor.insertText('<p attr={ 1 }');
        editor.setCursorBufferPosition([0, 11]);
        editor.insertText('>');
        return expect(editor.getText()).toBe('<p attr={ 1> }');
      });
      it("should remove closing tag", function() {
        editor.insertText('<p');
        editor.insertText('>');
        expect(editor.getText()).toBe('<p></p>');
        editor.backspace();
        return expect(editor.getText()).toBe('<p');
      });
      return it("should add extra line break when new line added between open and close tag", function() {
        editor.insertText('<p></p>');
        editor.setCursorBufferPosition([0, 3]);
        editor.insertText('\n');
        expect(editor.buffer.getLines()[0]).toBe('<p>');
        expect(editor.buffer.getLines()[2]).toBe('</p>');
        editor.setText("");
        editor.insertText('<p\n  attr=""></p>');
        editor.setCursorBufferPosition([1, 10]);
        editor.insertText('\n');
        expect(editor.buffer.getLines()[0]).toBe('<p');
        expect(editor.buffer.getLines()[1]).toBe('  attr="">');
        return expect(editor.buffer.getLines()[3]).toBe('</p>');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9yZWFjdC9zcGVjL2F1dG9jb21wbGV0ZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFFBQUEsa0NBQUE7QUFBQSxJQUFBLE9BQWlDLEVBQWpDLEVBQUMsZ0JBQUQsRUFBUyxnQkFBVCxFQUFpQixzQkFBakIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsT0FBOUIsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FBQTtBQUFBLE1BR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDWixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsUUFBcEIsRUFBOEI7QUFBQSxVQUFBLFVBQUEsRUFBWSxLQUFaO1NBQTlCLENBQWdELENBQUMsSUFBakQsQ0FBc0QsU0FBQyxDQUFELEdBQUE7QUFDcEQsY0FBQSxPQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsQ0FBVCxDQUFBO0FBQUEsVUFDQyxnQkFBQSxNQUFELEVBQVMsc0JBQUEsWUFEVCxDQUFBO0FBQUEsVUFFQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxlQUFsQyxDQUZWLENBQUE7aUJBR0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsRUFKb0Q7UUFBQSxDQUF0RCxFQURZO01BQUEsQ0FBaEIsQ0FIQSxDQUFBO2FBVUEsU0FBQSxDQUFVLFNBQUEsR0FBQTtBQUNSLFFBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUksQ0FB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

//# sourceURL=/Users/kswedberg/.atom/packages/react/spec/autocomplete-spec.coffee
