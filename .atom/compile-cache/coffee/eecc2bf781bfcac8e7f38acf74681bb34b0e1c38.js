(function() {
  describe('linter-registry', function() {
    var EditorLinter, LinterRegistry, getLinter, getMessage, linterRegistry, _ref;
    LinterRegistry = require('../lib/linter-registry');
    EditorLinter = require('../lib/editor-linter');
    linterRegistry = null;
    _ref = require('./common'), getLinter = _ref.getLinter, getMessage = _ref.getMessage;
    beforeEach(function() {
      waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('file.txt');
      });
      if (linterRegistry != null) {
        linterRegistry.dispose();
      }
      return linterRegistry = new LinterRegistry;
    });
    describe('::addLinter', function() {
      it('adds error notification if linter is invalid', function() {
        linterRegistry.addLinter({});
        return expect(atom.notifications.getNotifications().length).toBe(1);
      });
      it('pushes linter into registry when valid', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linterRegistry.linters.size).toBe(1);
      });
      return it('set deactivated to false on linter', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linter.deactivated).toBe(false);
      });
    });
    describe('::hasLinter', function() {
      it('returns true if present', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linterRegistry.hasLinter(linter)).toBe(true);
      });
      return it('returns false if not', function() {
        var linter;
        linter = getLinter();
        return expect(linterRegistry.hasLinter(linter)).toBe(false);
      });
    });
    describe('::deleteLinter', function() {
      it('deletes the linter from registry', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        expect(linterRegistry.hasLinter(linter)).toBe(true);
        linterRegistry.deleteLinter(linter);
        return expect(linterRegistry.hasLinter(linter)).toBe(false);
      });
      return it('sets deactivated to true on linter', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        linterRegistry.deleteLinter(linter);
        return expect(linter.deactivated).toBe(true);
      });
    });
    describe('::lint', function() {
      it("doesn't lint if textEditor isn't active one", function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          modifiesBuffer: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        return waitsForPromise(function() {
          return atom.workspace.open('test2.txt').then(function() {
            return expect(linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            })).toBeUndefined();
          });
        });
      });
      it("doesn't lint if textEditor doesn't have a path", function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        return waitsForPromise(function() {
          return atom.workspace.open('someNonExistingFile.txt').then(function() {
            return expect(linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            })).toBeUndefined();
          });
        });
      });
      return it('disallows two co-current lints of same type', function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        expect(linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        })).toBeDefined();
        return expect(linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        })).toBeUndefined();
      });
    });
    return describe('::onDidUpdateMessages', function() {
      return it('is triggered whenever messages change', function() {
        var editorLinter, info, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          scope: 'file',
          lint: function() {
            return [
              {
                type: 'Error',
                text: 'Something'
              }
            ];
          }
        };
        info = void 0;
        linterRegistry.addLinter(linter);
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          return info = linterInfo;
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(info).toBeDefined();
            return expect(info.messages.length).toBe(1);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9saW50ZXItcmVnaXN0cnktc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUEsR0FBQTtBQUMxQixRQUFBLHlFQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUFqQixDQUFBO0FBQUEsSUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSLENBRGYsQ0FBQTtBQUFBLElBRUEsY0FBQSxHQUFpQixJQUZqQixDQUFBO0FBQUEsSUFHQSxPQUEwQixPQUFBLENBQVEsVUFBUixDQUExQixFQUFDLGlCQUFBLFNBQUQsRUFBWSxrQkFBQSxVQUhaLENBQUE7QUFBQSxJQUtBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFmLENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFVBQXBCLEVBRmM7TUFBQSxDQUFoQixDQUFBLENBQUE7O1FBR0EsY0FBYyxDQUFFLE9BQWhCLENBQUE7T0FIQTthQUlBLGNBQUEsR0FBaUIsR0FBQSxDQUFBLGVBTFI7SUFBQSxDQUFYLENBTEEsQ0FBQTtBQUFBLElBWUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLE1BQUEsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxRQUFBLGNBQWMsQ0FBQyxTQUFmLENBQXlCLEVBQXpCLENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFuQixDQUFBLENBQXFDLENBQUMsTUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/linter/spec/linter-registry-spec.coffee
