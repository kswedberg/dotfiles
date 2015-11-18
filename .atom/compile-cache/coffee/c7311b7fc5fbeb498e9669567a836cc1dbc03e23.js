(function() {
  describe('Coffee-React grammar', function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-coffee-script');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('react');
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName('source.coffee.jsx');
      });
    });
    it('parses the grammar', function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe('source.coffee.jsx');
    });
    it('tokenizes CoffeeScript', function() {
      var tokens;
      tokens = grammar.tokenizeLine('foo = @bar').tokens;
      expect(tokens.length).toEqual(4);
      expect(tokens[0]).toEqual({
        value: 'foo ',
        scopes: ['source.coffee.jsx', 'variable.assignment.coffee', 'variable.assignment.coffee']
      });
      expect(tokens[1]).toEqual({
        value: '=',
        scopes: ['source.coffee.jsx', 'variable.assignment.coffee', 'variable.assignment.coffee', 'keyword.operator.coffee']
      });
      expect(tokens[2]).toEqual({
        value: ' ',
        scopes: ['source.coffee.jsx']
      });
      return expect(tokens[3]).toEqual({
        value: '@bar',
        scopes: ['source.coffee.jsx', 'variable.other.readwrite.instance.coffee']
      });
    });
    return describe('CJSX', function() {
      it('tokenizes CJSX', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div>hi</div>').tokens;
        expect(tokens.length).toEqual(7);
        expect(tokens[0]).toEqual({
          value: '<',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.begin.html']
        });
        expect(tokens[1]).toEqual({
          value: 'div',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.name.tag.other.html']
        });
        expect(tokens[2]).toEqual({
          value: '>',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.end.html']
        });
        expect(tokens[3]).toEqual({
          value: 'hi',
          scopes: ['source.coffee.jsx']
        });
        expect(tokens[4]).toEqual({
          value: '<',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.begin.html']
        });
        expect(tokens[5]).toEqual({
          value: '/div',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.name.tag.other.html']
        });
        return expect(tokens[6]).toEqual({
          value: '>',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.end.html']
        });
      });
      it('tokenizes props', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div className="span6"></div>').tokens;
        expect(tokens.length).toEqual(12);
        expect(tokens[2]).toEqual({
          value: ' ',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html']
        });
        expect(tokens[3]).toEqual({
          value: 'className',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.other.attribute-name.html']
        });
        expect(tokens[4]).toEqual({
          value: '=',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html']
        });
        expect(tokens[5]).toEqual({
          value: '"',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'punctuation.definition.string.begin.html']
        });
        expect(tokens[6]).toEqual({
          value: 'span6',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html']
        });
        return expect(tokens[7]).toEqual({
          value: '"',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'punctuation.definition.string.end.html']
        });
      });
      it('tokenizes props with digits', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div thing1="hi"></div>').tokens;
        return expect(tokens[3]).toEqual({
          value: 'thing1',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.other.attribute-name.html']
        });
      });
      it('tokenizes interpolated CoffeeScript strings', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div className="#{@var}"></div>').tokens;
        expect(tokens.length).toEqual(14);
        expect(tokens[6]).toEqual({
          value: '#{',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'source.coffee.embedded.source', 'punctuation.section.embedded.coffee']
        });
        expect(tokens[7]).toEqual({
          value: '@var',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'source.coffee.embedded.source', 'variable.other.readwrite.instance.coffee']
        });
        return expect(tokens[8]).toEqual({
          value: '}',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'source.coffee.embedded.source', 'punctuation.section.embedded.coffee']
        });
      });
      it('tokenizes embedded CoffeeScript', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div>{@var}</div>').tokens;
        expect(tokens.length).toEqual(9);
        expect(tokens[3]).toEqual({
          value: '{',
          scopes: ['source.coffee.jsx', 'meta.brace.curly.coffee']
        });
        expect(tokens[4]).toEqual({
          value: '@var',
          scopes: ['source.coffee.jsx', 'variable.other.readwrite.instance.coffee']
        });
        return expect(tokens[5]).toEqual({
          value: '}',
          scopes: ['source.coffee.jsx', 'meta.brace.curly.coffee']
        });
      });
      return it("doesn't tokenize inner CJSX as CoffeeScript", function() {
        var tokens;
        tokens = grammar.tokenizeLine("<div>it's and</div>").tokens;
        expect(tokens.length).toEqual(7);
        return expect(tokens[3]).toEqual({
          value: "it's and",
          scopes: ['source.coffee.jsx']
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9yZWFjdC9zcGVjL2NvZmZlZS1yZWFjdC1ncmFtbWFyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4Qix3QkFBOUIsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FBQTtBQUFBLE1BRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsT0FBOUIsRUFEYztNQUFBLENBQWhCLENBRkEsQ0FBQTthQUtBLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxtQkFBbEMsRUFEUDtNQUFBLENBQUwsRUFOUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFXQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLFVBQWhCLENBQUEsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFmLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsbUJBQS9CLEVBRnVCO0lBQUEsQ0FBekIsQ0FYQSxDQUFBO0FBQUEsSUFlQSxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFVBQUEsTUFBQTtBQUFBLE1BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixD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

//# sourceURL=/Users/kswedberg/.atom/packages/react/spec/coffee-react-grammar-spec.coffee
