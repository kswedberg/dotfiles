(function() {
  var ScopeNameProvider;

  ScopeNameProvider = require('../lib/scope-name-provider');

  describe('ScopeNameProvider', function() {
    var snp;
    snp = [][0];
    beforeEach(function() {
      snp = new ScopeNameProvider();
      return this.addMatchers({
        toEqualNull: function() {
          return this.actual == null;
        }
      });
    });
    describe('scope provision', function() {
      it('provides scope name based on file extension', function() {
        snp.registerExtension('blah', 'text.plain.test-grammar');
        return expect(snp.getScopeName('hogehoge.blah')).toBe('text.plain.test-grammar');
      });
      it('provides scope name based on regexp matcher', function() {
        snp.registerMatcher('spec\.coffee$', 'test.coffee.spec');
        return expect(snp.getScopeName('super-human-spec.coffee')).toBe('test.coffee.spec');
      });
      it('gives precedence to file extension above regexp matchers', function() {
        snp.registerExtension('blah', 'text.plain.test-grammar');
        snp.registerMatcher('spec\.blah$', 'test.blah.spec');
        return expect(snp.getScopeName('super-human-spec.blah')).toBe('text.plain.test-grammar');
      });
      return describe('regexp matcher', function() {
        it('can match start-of-string', function() {
          snp.registerMatcher('^spec', 'test.spec');
          expect(snp.getScopeName('spec-super-human.coffee')).toBe('test.spec');
          return expect(snp.getScopeName('super-human-spec.coffee')).toEqualNull();
        });
        it('can match mid-string', function() {
          snp.registerMatcher('sp.c', 'test.spec');
          expect(snp.getScopeName('spec-super-human.coffee')).toBe('test.spec');
          expect(snp.getScopeName('super-human-spec.coffee')).toBe('test.spec');
          return expect(snp.getScopeName('super-human-spock.coffee')).toBe('test.spec');
        });
        return it('can match end-of-string', function() {
          snp.registerMatcher('spec$', 'test.spec');
          expect(snp.getScopeName('spec-super-human')).toEqualNull();
          return expect(snp.getScopeName('super-human-spec')).toBe('test.spec');
        });
      });
    });
    return describe('registered scope name list provision', function() {
      it('initially has no scope names', function() {
        return expect(snp.getScopeNames()).toEqual([]);
      });
      it('updates the list as grammars are added', function() {
        snp.registerExtension('blah', 'text.plain.test-grammar');
        expect(snp.getScopeNames()).toEqual(['text.plain.test-grammar']);
        snp.registerExtension('hogehoge', 'text.plain.null-grammar');
        return expect(snp.getScopeNames()).toEqual(['text.plain.test-grammar', 'text.plain.null-grammar']);
      });
      return it('provides a list of unique grammars', function() {
        snp.registerExtension('blah', 'text.plain.test-grammar');
        expect(snp.getScopeNames()).toEqual(['text.plain.test-grammar']);
        snp.registerExtension('blah', 'text.plain.test-grammar');
        return expect(snp.getScopeNames()).toEqual(['text.plain.test-grammar']);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9maWxlLXR5cGVzL3NwZWMvc2NvcGUtbmFtZS1wcm92aWRlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTs7QUFBQSxFQUFBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSw0QkFBUixDQUFwQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixRQUFBLEdBQUE7QUFBQSxJQUFDLE1BQU8sS0FBUixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxHQUFBLEdBQVUsSUFBQSxpQkFBQSxDQUFBLENBQVYsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFELENBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSxTQUFBLEdBQUE7aUJBQUcsb0JBQUg7UUFBQSxDQUFiO09BREYsRUFGUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFPQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLE1BQUEsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUEsR0FBQTtBQUNoRCxRQUFBLEdBQUcsQ0FBQyxpQkFBSixDQUFzQixNQUF0QixFQUE4Qix5QkFBOUIsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxZQUFKLENBQWlCLGVBQWpCLENBQVAsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4Qyx5QkFBOUMsRUFGZ0Q7TUFBQSxDQUFsRCxDQUFBLENBQUE7QUFBQSxNQUlBLEVBQUEsQ0FBRyw2Q0FBSCxFQUFrRCxTQUFBLEdBQUE7QUFDaEQsUUFBQSxHQUFHLENBQUMsZUFBSixDQUFvQixlQUFwQixFQUFxQyxrQkFBckMsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLEdBQUcs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

//# sourceURL=/Users/kswedberg/.atom/packages/file-types/spec/scope-name-provider-spec.coffee
