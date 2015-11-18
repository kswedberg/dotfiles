(function() {
  var emojiCheatSheet, packagesToTest;

  emojiCheatSheet = require('../lib/emoji-cheat-sheet');

  packagesToTest = {
    gfm: {
      name: 'language-gfm',
      file: 'test.md'
    }
  };

  describe("Emojis autocompletions", function() {
    var editor, getCompletions, provider, _ref;
    _ref = [], editor = _ref[0], provider = _ref[1];
    getCompletions = function() {
      var cursor, end, prefix, request, start;
      cursor = editor.getLastCursor();
      start = cursor.getBeginningOfCurrentWordBufferPosition();
      end = cursor.getBufferPosition();
      prefix = editor.getTextInRange([start, end]);
      request = {
        editor: editor,
        bufferPosition: end,
        scopeDescriptor: cursor.getScopeDescriptor(),
        prefix: prefix
      };
      return provider.getSuggestions(request);
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('autocomplete-emojis');
      });
      runs(function() {
        return provider = atom.packages.getActivePackage('autocomplete-emojis').mainModule.getProvider();
      });
      return waitsFor(function() {
        return Object.keys(provider.properties).length > 0;
      });
    });
    Object.keys(packagesToTest).forEach(function(packageLabel) {
      return describe("" + packageLabel + " files", function() {
        beforeEach(function() {
          atom.config.set('autocomplete-emojis.enableUnicodeEmojis', true);
          atom.config.set('autocomplete-emojis.enableMarkdownEmojis', true);
          waitsForPromise(function() {
            return atom.packages.activatePackage(packagesToTest[packageLabel].name);
          });
          waitsForPromise(function() {
            return atom.workspace.open(packagesToTest[packageLabel].file);
          });
          return runs(function() {
            return editor = atom.workspace.getActiveTextEditor();
          });
        });
        it("returns no completions without a prefix", function() {
          editor.setText('');
          return expect(getCompletions().length).toBe(0);
        });
        it("returns no completions with an improper prefix", function() {
          editor.setText(':');
          editor.setCursorBufferPosition([0, 0]);
          expect(getCompletions().length).toBe(0);
          editor.setCursorBufferPosition([0, 1]);
          expect(getCompletions().length).toBe(0);
          editor.setText(':*');
          editor.setCursorBufferPosition([0, 1]);
          return expect(getCompletions().length).toBe(0);
        });
        it("autocompletes emojis with a proper prefix", function() {
          var completions;
          editor.setText(":sm");
          editor.setCursorBufferPosition([0, 3]);
          completions = getCompletions();
          expect(completions.length).toBe(96);
          expect(completions[0].text).toBe('😄');
          expect(completions[0].replacementPrefix).toBe(':sm');
          expect(completions[49].text).toBe(':smirk:');
          expect(completions[49].replacementPrefix).toBe(':sm');
          expect(completions[49].rightLabelHTML).toMatch(/smirk\.png/);
          expect(completions[50].text).toBe(':smile:');
          expect(completions[50].replacementPrefix).toBe(':sm');
          expect(completions[50].rightLabelHTML).toMatch(/smile\.png/);
          editor.setText(":+");
          editor.setCursorBufferPosition([0, 2]);
          completions = getCompletions();
          expect(completions.length).toBe(2);
          expect(completions[0].text).toBe('👍');
          expect(completions[0].replacementPrefix).toBe(':+');
          expect(completions[1].text).toBe(':+1:');
          expect(completions[1].replacementPrefix).toBe(':+');
          return expect(completions[1].rightLabelHTML).toMatch(/\+1\.png/);
        });
        it("autocompletes markdown emojis with '::'", function() {
          var completions;
          editor.setText("::sm");
          editor.setCursorBufferPosition([0, 4]);
          completions = getCompletions();
          expect(completions.length).toBe(47);
          expect(completions[0].text).toBe(':smirk:');
          expect(completions[0].replacementPrefix).toBe('::sm');
          expect(completions[0].rightLabelHTML).toMatch(/smirk\.png/);
          expect(completions[1].text).toBe(':smile:');
          expect(completions[1].replacementPrefix).toBe('::sm');
          return expect(completions[1].rightLabelHTML).toMatch(/smile\.png/);
        });
        it("autocompletes unicode emojis with a proper prefix", function() {
          var completions;
          atom.config.set('autocomplete-emojis.enableUnicodeEmojis', true);
          atom.config.set('autocomplete-emojis.enableMarkdownEmojis', false);
          editor.setText(":sm");
          editor.setCursorBufferPosition([0, 3]);
          completions = getCompletions();
          expect(completions.length).toBe(49);
          expect(completions[0].text).toBe('😄');
          return expect(completions[0].replacementPrefix).toBe(':sm');
        });
        it("autocompletes markdown emojis with a proper prefix", function() {
          var completions;
          atom.config.set('autocomplete-emojis.enableUnicodeEmojis', false);
          atom.config.set('autocomplete-emojis.enableMarkdownEmojis', true);
          editor.setText(":sm");
          editor.setCursorBufferPosition([0, 3]);
          completions = getCompletions();
          expect(completions.length).toBe(47);
          expect(completions[0].text).toBe(':smirk:');
          return expect(completions[0].replacementPrefix).toBe(':sm');
        });
        return it("autocompletes no emojis", function() {
          var completions;
          atom.config.set('autocomplete-emojis.enableUnicodeEmojis', false);
          atom.config.set('autocomplete-emojis.enableMarkdownEmojis', false);
          editor.setText(":sm");
          editor.setCursorBufferPosition([0, 3]);
          completions = getCompletions();
          return expect(completions.length).toBe(0);
        });
      });
    });
    return describe('when the autocomplete-emojis:showCheatSheet event is triggered', function() {
      var workspaceElement;
      workspaceElement = null;
      beforeEach(function() {
        return workspaceElement = atom.views.getView(atom.workspace);
      });
      return it('opens Emoji Cheat Sheet in browser', function() {
        spyOn(emojiCheatSheet, 'openUrlInBrowser');
        atom.commands.dispatch(workspaceElement, 'autocomplete-emojis:show-cheat-sheet');
        return expect(emojiCheatSheet.openUrlInBrowser).toHaveBeenCalledWith('http://www.emoji-cheat-sheet.com/');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZW1vamlzL3NwZWMvYXV0b2NvbXBsZXRlLWVtb2ppcy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDBCQUFSLENBQWxCLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQ0U7QUFBQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLGNBQU47QUFBQSxNQUNBLElBQUEsRUFBTSxTQUROO0tBREY7R0FIRixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxRQUFBLHNDQUFBO0FBQUEsSUFBQSxPQUFxQixFQUFyQixFQUFDLGdCQUFELEVBQVMsa0JBQVQsQ0FBQTtBQUFBLElBRUEsY0FBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLG1DQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxNQUFNLENBQUMsdUNBQVAsQ0FBQSxDQURSLENBQUE7QUFBQSxNQUVBLEdBQUEsR0FBTSxNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUZOLENBQUE7QUFBQSxNQUdBLE1BQUEsR0FBUyxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLEtBQUQsRUFBUSxHQUFSLENBQXRCLENBSFQsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsTUFBUjtBQUFBLFFBQ0EsY0FBQSxFQUFnQixHQURoQjtBQUFBLFFBRUEsZUFBQSxFQUFpQixNQUFNLENBQUMsa0JBQVAsQ0FBQSxDQUZqQjtBQUFBLFFBR0EsTUFBQSxFQUFRLE1B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

//# sourceURL=/Users/kswedberg/.atom/packages/autocomplete-emojis/spec/autocomplete-emojis-spec.coffee
