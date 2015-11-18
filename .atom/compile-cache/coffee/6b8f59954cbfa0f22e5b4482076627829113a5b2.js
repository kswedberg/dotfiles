(function() {
  describe('editor-registry', function() {
    var EditorRegistry, editorRegistry;
    EditorRegistry = require('../lib/editor-registry');
    editorRegistry = null;
    beforeEach(function() {
      waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open(__dirname + '/fixtures/file.txt');
      });
      if (editorRegistry != null) {
        editorRegistry.dispose();
      }
      return editorRegistry = new EditorRegistry;
    });
    describe('::create', function() {
      it('cries when invalid TextEditor was provided', function() {
        expect(function() {
          return editorRegistry.create();
        }).toThrow();
        return expect(function() {
          return editorRegistry.create(5);
        }).toThrow();
      });
      it("adds TextEditor to it's registry", function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return expect(editorRegistry.editorLinters.size).toBe(1);
      });
      return it('automatically clears the TextEditor from registry when destroyed', function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        atom.workspace.destroyActivePaneItem();
        return expect(editorRegistry.editorLinters.size).toBe(0);
      });
    });
    describe('::has', function() {
      return it('returns the status of existence', function() {
        var editor;
        editor = atom.workspace.getActiveTextEditor();
        expect(editorRegistry.has(1)).toBe(false);
        expect(editorRegistry.has(false)).toBe(false);
        expect(editorRegistry.has([])).toBe(false);
        expect(editorRegistry.has(editor)).toBe(false);
        editorRegistry.create(editor);
        expect(editorRegistry.has(editor)).toBe(true);
        atom.workspace.destroyActivePaneItem();
        return expect(editorRegistry.has(editor)).toBe(false);
      });
    });
    describe('::forEach', function() {
      return it('calls the callback once per editorLinter', function() {
        var timesCalled;
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        timesCalled = 0;
        editorRegistry.forEach(function() {
          return ++timesCalled;
        });
        editorRegistry.forEach(function() {
          return ++timesCalled;
        });
        return expect(timesCalled).toBe(2);
      });
    });
    describe('::ofTextEditor', function() {
      it('returns undefined when invalid key is provided', function() {
        expect(editorRegistry.ofTextEditor(null)).toBeUndefined();
        expect(editorRegistry.ofTextEditor(1)).toBeUndefined();
        expect(editorRegistry.ofTextEditor(5)).toBeUndefined();
        return expect(editorRegistry.ofTextEditor('asd')).toBeUndefined();
      });
      return it('returns editorLinter when valid key is provided', function() {
        var activeEditor;
        activeEditor = atom.workspace.getActiveTextEditor();
        expect(editorRegistry.ofTextEditor(activeEditor)).toBeUndefined();
        editorRegistry.create(activeEditor);
        return expect(editorRegistry.ofTextEditor(activeEditor)).toBeDefined();
      });
    });
    describe('::ofPath', function() {
      it('returns undefined when invalid key is provided', function() {
        expect(editorRegistry.ofPath(null)).toBeUndefined();
        expect(editorRegistry.ofPath(1)).toBeUndefined();
        expect(editorRegistry.ofPath(5)).toBeUndefined();
        return expect(editorRegistry.ofPath('asd')).toBeUndefined();
      });
      return it('returns editorLinter when valid key is provided', function() {
        var activeEditor, editorPath;
        activeEditor = atom.workspace.getActiveTextEditor();
        editorPath = activeEditor.getPath();
        expect(editorRegistry.ofPath(editorPath)).toBeUndefined();
        editorRegistry.create(activeEditor);
        return expect(editorRegistry.ofPath(editorPath)).toBeDefined();
      });
    });
    describe('::observe', function() {
      it('calls with the current editorLinters', function() {
        var timesCalled;
        timesCalled = 0;
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        editorRegistry.observe(function() {
          return ++timesCalled;
        });
        return expect(timesCalled).toBe(1);
      });
      return it('calls in the future with new editorLinters', function() {
        var timesCalled;
        timesCalled = 0;
        editorRegistry.observe(function() {
          return ++timesCalled;
        });
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return waitsForPromise(function() {
          return atom.workspace.open('someNonExistingFile').then(function() {
            editorRegistry.create(atom.workspace.getActiveTextEditor());
            return expect(timesCalled).toBe(2);
          });
        });
      });
    });
    return describe('::ofActiveTextEditor', function() {
      it('returns undefined if active pane is not a text editor', function() {
        return expect(editorRegistry.ofActiveTextEditor()).toBeUndefined();
      });
      return it('returns editorLinter when active pane is a text editor', function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return expect(editorRegistry.ofActiveTextEditor()).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9lZGl0b3ItcmVnaXN0cnktc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLDhCQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUFqQixDQUFBO0FBQUEsSUFDQSxjQUFBLEdBQWlCLElBRGpCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFmLENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFNBQUEsR0FBWSxvQkFBaEMsRUFGYztNQUFBLENBQWhCLENBQUEsQ0FBQTs7UUFHQSxjQUFjLENBQUUsT0FBaEIsQ0FBQTtPQUhBO2FBSUEsY0FBQSxHQUFpQixHQUFBLENBQUEsZUFMUjtJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFTQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsTUFBQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO0FBQy9DLFFBQUEsTUFBQSxDQUFPLFNBQUEsR0FBQTtpQkFDTCxjQUFjLENBQUMsTUFBZixDQUFBLEVBREs7UUFBQSxDQUFQLENBRUEsQ0FBQyxPQUZELENBQUEsQ0FBQSxDQUFBO2VBR0EsTUFBQSxDQUFPLFNBQUEsR0FBQTtpQkFDTCxjQUFjLENBQUMsTUFBZixDQUFzQixDQUF0QixFQURLO1FBQUEsQ0FBUCxDQUVBLENBQUMsT0FGRCxDQUFBLEVBSitDO01BQUEsQ0FBakQsQ0FBQSxD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

//# sourceURL=/Users/kswedberg/.atom/packages/linter/spec/editor-registry-spec.coffee
