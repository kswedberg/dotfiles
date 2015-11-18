(function() {
  var CoffeeCompileEditor, util;

  CoffeeCompileEditor = require('../lib/coffee-compile-editor');

  util = require('../lib/util');

  describe('CoffeeCompile', function() {
    var editor, workspaceElement;
    editor = null;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise('language-coffee-script to activate', function() {
        return atom.packages.activatePackage('language-coffee-script');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('coffee-compile');
      });
      waitsForPromise(function() {
        return atom.workspace.open('coffee-compile-fixtures.coffee').then(function(o) {
          return editor = o;
        });
      });
      return runs(function() {
        return spyOn(CoffeeCompileEditor.prototype, 'renderCompiled').andCallThrough();
      });
    });
    describe('compile on save', function() {
      beforeEach(function() {
        return spyOn(util, 'compileToFile');
      });
      it('should call util.compileToFile', function() {
        atom.config.set('coffee-compile.compileOnSave', true);
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'coffee-compile:compile');
        });
        waitsFor(function() {
          return util.compileToFile.callCount > 0;
        });
        return runs(function() {
          return expect(util.compileToFile).toHaveBeenCalled();
        });
      });
      return it('should not call util.compileToFile', function() {
        atom.config.set('coffee-compile.compileOnSave', false);
        return runs(function() {
          atom.commands.dispatch(workspaceElement, 'coffee-compile:compile');
          return expect(util.compileToFile).not.toHaveBeenCalled();
        });
      });
    });
    describe('compile on save without preview', function() {
      beforeEach(function() {
        return spyOn(util, 'compileToFile');
      });
      describe('when compileOnSaveWithoutPreview = true', function() {
        beforeEach(function() {
          return atom.config.set('coffee-compile.compileOnSaveWithoutPreview', true);
        });
        it('should call util.compileToFile on editor save', function() {
          runs(function() {
            return editor.save();
          });
          waitsFor(function() {
            return util.compileToFile.callCount > 0;
          });
          return runs(function() {
            return expect(util.compileToFile).toHaveBeenCalled();
          });
        });
        return it('should call util.compileToFile on save command', function() {
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'core:save');
          });
          waitsFor(function() {
            return util.compileToFile.callCount > 0;
          });
          return runs(function() {
            return expect(util.compileToFile).toHaveBeenCalled();
          });
        });
      });
      return describe('when compileOnSaveWithoutPreview = false', function() {
        beforeEach(function() {
          atom.config.set('coffee-compile.compileOnSaveWithoutPreview', true);
          return atom.config.set('coffee-compile.compileOnSaveWithoutPreview', false);
        });
        it('should not call util.compileToFile on editor save', function() {
          return runs(function() {
            editor.save();
            return expect(util.compileToFile).not.toHaveBeenCalled();
          });
        });
        return it('should not call util.compileToFile on save command', function() {
          return runs(function() {
            atom.commands.dispatch(workspaceElement, 'core:save');
            return expect(util.compileToFile).not.toHaveBeenCalled();
          });
        });
      });
    });
    describe('open a new pane with default value', function() {
      beforeEach(function() {
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'coffee-compile:compile');
        });
        return waitsFor('renderCompiled to be called', function() {
          return CoffeeCompileEditor.prototype.renderCompiled.callCount > 0;
        });
      });
      it('should always split to the right', function() {
        return runs(function() {
          var compiledPane, editorPane, _ref;
          expect(atom.workspace.paneContainer.root.orientation).toBe('horizontal');
          expect(atom.workspace.getPanes()).toHaveLength(2);
          _ref = atom.workspace.getPanes(), editorPane = _ref[0], compiledPane = _ref[1];
          return expect(editorPane.items).toHaveLength(1);
        });
      });
      return it('should focus on compiled pane', function() {
        return runs(function() {
          var compiledPane, editorPane, _ref;
          _ref = atom.workspace.getPanes(), editorPane = _ref[0], compiledPane = _ref[1];
          return expect(compiledPane.isActive()).toBe(true);
        });
      });
    });
    describe('open a new pane with config', function() {
      it('should split to the left', function() {
        runs(function() {
          atom.config.set('coffee-compile.split', 'Left');
          return atom.commands.dispatch(workspaceElement, 'coffee-compile:compile');
        });
        waitsFor('renderCompiled to be called', function() {
          return CoffeeCompileEditor.prototype.renderCompiled.callCount > 0;
        });
        return runs(function() {
          var compiledPane, editorPane, _ref;
          expect(atom.workspace.paneContainer.root.orientation).toBe('horizontal');
          expect(atom.workspace.getPanes()).toHaveLength(2);
          _ref = atom.workspace.getPanes(), compiledPane = _ref[0], editorPane = _ref[1];
          expect(editorPane.items).toHaveLength(1);
          return expect(editorPane.items[0]).toBe(editor);
        });
      });
      it('should split to the bottom', function() {
        runs(function() {
          atom.config.set('coffee-compile.split', 'Down');
          return atom.commands.dispatch(workspaceElement, 'coffee-compile:compile');
        });
        waitsFor('renderCompiled to be called', function() {
          return CoffeeCompileEditor.prototype.renderCompiled.callCount > 0;
        });
        return runs(function() {
          var compiledPane, editorPane, _ref;
          expect(atom.workspace.paneContainer.root.orientation).toBe('vertical');
          expect(atom.workspace.getPanes()).toHaveLength(2);
          _ref = atom.workspace.getPanes(), editorPane = _ref[0], compiledPane = _ref[1];
          expect(editorPane.items).toHaveLength(1);
          return expect(editorPane.items[0]).toBe(editor);
        });
      });
      return it('should split to the up', function() {
        runs(function() {
          atom.config.set('coffee-compile.split', 'Up');
          return atom.commands.dispatch(workspaceElement, 'coffee-compile:compile');
        });
        waitsFor('renderCompiled to be called', function() {
          return CoffeeCompileEditor.prototype.renderCompiled.callCount > 0;
        });
        return runs(function() {
          var compiledPane, editorPane, _ref;
          expect(atom.workspace.paneContainer.root.orientation).toBe('vertical');
          expect(atom.workspace.getPanes()).toHaveLength(2);
          _ref = atom.workspace.getPanes(), compiledPane = _ref[0], editorPane = _ref[1];
          expect(editorPane.items).toHaveLength(1);
          return expect(editorPane.items[0]).toBe(editor);
        });
      });
    });
    return describe('focus editor after compile', function() {
      var callback;
      callback = null;
      beforeEach(function() {
        callback = jasmine.createSpy('pane');
        atom.config.set('coffee-compile.focusEditorAfterCompile', true);
        return atom.workspace.onDidOpen(callback);
      });
      return it('should focus editor when option is set', function() {
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'coffee-compile:compile');
        });
        waitsFor(function() {
          return callback.callCount > 0;
        });
        return runs(function() {
          var compiledPane, editorPane, _ref;
          _ref = atom.workspace.getPanes(), editorPane = _ref[0], compiledPane = _ref[1];
          return expect(editorPane.isActive()).toBe(true);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9zcGVjL2NvZmZlZS1jb21waWxlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLDhCQUFSLENBQXRCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFFBQUEsd0JBQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxJQUFULENBQUE7QUFBQSxJQUNBLGdCQUFBLEdBQW1CLElBRG5CLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBREEsQ0FBQTtBQUFBLE1BR0EsZUFBQSxDQUFnQixvQ0FBaEIsRUFBc0QsU0FBQSxHQUFBO2VBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4Qix3QkFBOUIsRUFEb0Q7TUFBQSxDQUF0RCxDQUhBLENBQUE7QUFBQSxNQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGdCQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FOQSxDQUFBO0FBQUEsTUFTQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixnQ0FBcEIsQ0FBcUQsQ0FBQyxJQUF0RCxDQUEyRCxTQUFD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

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/spec/coffee-compile-spec.coffee
