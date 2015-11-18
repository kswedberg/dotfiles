(function() {
  var $, MarkdownPreviewView, fs, path, temp, wrench;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  wrench = require('wrench');

  MarkdownPreviewView = require('../lib/markdown-preview-view');

  $ = require('atom-space-pen-views').$;

  require('./spec-helper');

  describe("Markdown preview plus package", function() {
    var expectPreviewInSplitPane, preview, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], preview = _ref[1];
    beforeEach(function() {
      var fixturesPath, tempPath;
      fixturesPath = path.join(__dirname, 'fixtures');
      tempPath = temp.mkdirSync('atom');
      wrench.copyDirSyncRecursive(fixturesPath, tempPath, {
        forceDelete: true
      });
      atom.project.setPaths([tempPath]);
      jasmine.useRealClock();
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.packages.activatePackage("markdown-preview-plus");
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-gfm');
      });
    });
    afterEach(function() {
      if (preview instanceof MarkdownPreviewView) {
        preview.destroy();
      }
      return preview = null;
    });
    expectPreviewInSplitPane = function() {
      runs(function() {
        return expect(atom.workspace.getPanes()).toHaveLength(2);
      });
      waitsFor("markdown preview to be created", function() {
        return preview = atom.workspace.getPanes()[1].getActiveItem();
      });
      return runs(function() {
        expect(preview).toBeInstanceOf(MarkdownPreviewView);
        return expect(preview.getPath()).toBe(atom.workspace.getActivePaneItem().getPath());
      });
    };
    describe("when a preview has not been created for the file", function() {
      it("displays a markdown preview in a split pane", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          var editorPane;
          editorPane = atom.workspace.getPanes()[0];
          expect(editorPane.getItems()).toHaveLength(1);
          return expect(editorPane.isActive()).toBe(true);
        });
      });
      describe("when the editor's path does not exist", function() {
        return it("splits the current pane to the right with a markdown preview for the file", function() {
          waitsForPromise(function() {
            return atom.workspace.open("new.markdown");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
      describe("when the editor does not have a path", function() {
        return it("splits the current pane to the right with a markdown preview for the file", function() {
          waitsForPromise(function() {
            return atom.workspace.open("");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
      describe("when the path contains a space", function() {
        return it("renders the preview", function() {
          waitsForPromise(function() {
            return atom.workspace.open("subdir/file with space.md");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
      return describe("when the path contains accented characters", function() {
        return it("renders the preview", function() {
          waitsForPromise(function() {
            return atom.workspace.open("subdir/áccéntéd.md");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
    });
    describe("when a preview has been created for the file", function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        return expectPreviewInSplitPane();
      });
      it("closes the existing preview when toggle is triggered a second time on the editor and when the preview is its panes active item", function() {
        var editorPane, previewPane, _ref1;
        atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        _ref1 = atom.workspace.getPanes(), editorPane = _ref1[0], previewPane = _ref1[1];
        expect(editorPane.isActive()).toBe(true);
        return expect(previewPane.getActiveItem()).toBeUndefined();
      });
      it("activates the existing preview when toggle is triggered a second time on the editor and when the preview is not its panes active item #nottravis", function() {
        var editorPane, previewPane, _ref1;
        _ref1 = atom.workspace.getPanes(), editorPane = _ref1[0], previewPane = _ref1[1];
        editorPane.activate();
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        waitsFor("second markdown preview to be created", function() {
          return previewPane.getItems().length === 2;
        });
        runs(function() {
          preview = previewPane.getActiveItem();
          expect(preview).toBeInstanceOf(MarkdownPreviewView);
          expect(previewPane.getActiveItemIndex()).toBe(1);
          expect(preview.getPath()).toBe(editorPane.getActiveItem().getPath());
          expect(preview.getPath()).toBe(atom.workspace.getActivePaneItem().getPath());
          editorPane.activate();
          editorPane.activateItemAtIndex(0);
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        waitsFor("first preview to be activated", function() {
          return previewPane.getActiveItemIndex() === 0;
        });
        return runs(function() {
          preview = previewPane.getActiveItem();
          expect(previewPane.getItems().length).toBe(2);
          expect(preview.getPath()).toBe(editorPane.getActiveItem().getPath());
          return expect(preview.getPath()).toBe(atom.workspace.getActivePaneItem().getPath());
        });
      });
      it("closes the existing preview when toggle is triggered on it and it has focus", function() {
        var editorPane, previewPane, _ref1;
        _ref1 = atom.workspace.getPanes(), editorPane = _ref1[0], previewPane = _ref1[1];
        previewPane.activate();
        atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        return expect(previewPane.getActiveItem()).toBeUndefined();
      });
      describe("when the editor is modified", function() {
        it("re-renders the preview", function() {
          var markdownEditor;
          spyOn(preview, 'showLoading');
          markdownEditor = atom.workspace.getActiveTextEditor();
          markdownEditor.setText("Hey!");
          waitsFor(function() {
            return preview.text().indexOf("Hey!") >= 0;
          });
          return runs(function() {
            return expect(preview.showLoading).not.toHaveBeenCalled();
          });
        });
        it("invokes ::onDidChangeMarkdown listeners", function() {
          var listener, markdownEditor;
          markdownEditor = atom.workspace.getActiveTextEditor();
          preview.onDidChangeMarkdown(listener = jasmine.createSpy('didChangeMarkdownListener'));
          runs(function() {
            return markdownEditor.setText("Hey!");
          });
          return waitsFor("::onDidChangeMarkdown handler to be called", function() {
            return listener.callCount > 0;
          });
        });
        describe("when the preview is in the active pane but is not the active item", function() {
          return it("re-renders the preview but does not make it active", function() {
            var markdownEditor, previewPane;
            markdownEditor = atom.workspace.getActiveTextEditor();
            previewPane = atom.workspace.getPanes()[1];
            previewPane.activate();
            waitsForPromise(function() {
              return atom.workspace.open();
            });
            runs(function() {
              return markdownEditor.setText("Hey!");
            });
            waitsFor(function() {
              return preview.text().indexOf("Hey!") >= 0;
            });
            return runs(function() {
              expect(previewPane.isActive()).toBe(true);
              return expect(previewPane.getActiveItem()).not.toBe(preview);
            });
          });
        });
        describe("when the preview is not the active item and not in the active pane", function() {
          return it("re-renders the preview and makes it active", function() {
            var editorPane, markdownEditor, previewPane, _ref1;
            markdownEditor = atom.workspace.getActiveTextEditor();
            _ref1 = atom.workspace.getPanes(), editorPane = _ref1[0], previewPane = _ref1[1];
            previewPane.splitRight({
              copyActiveItem: true
            });
            previewPane.activate();
            waitsForPromise(function() {
              return atom.workspace.open();
            });
            runs(function() {
              editorPane.activate();
              return markdownEditor.setText("Hey!");
            });
            waitsFor(function() {
              return preview.text().indexOf("Hey!") >= 0;
            });
            return runs(function() {
              expect(editorPane.isActive()).toBe(true);
              return expect(previewPane.getActiveItem()).toBe(preview);
            });
          });
        });
        return describe("when the liveUpdate config is set to false", function() {
          return it("only re-renders the markdown when the editor is saved, not when the contents are modified", function() {
            var didStopChangingHandler;
            atom.config.set('markdown-preview-plus.liveUpdate', false);
            didStopChangingHandler = jasmine.createSpy('didStopChangingHandler');
            atom.workspace.getActiveTextEditor().getBuffer().onDidStopChanging(didStopChangingHandler);
            atom.workspace.getActiveTextEditor().setText('ch ch changes');
            waitsFor(function() {
              return didStopChangingHandler.callCount > 0;
            });
            runs(function() {
              expect(preview.text()).not.toContain("ch ch changes");
              return atom.workspace.getActiveTextEditor().save();
            });
            return waitsFor(function() {
              return preview.text().indexOf("ch ch changes") >= 0;
            });
          });
        });
      });
      return describe("when a new grammar is loaded", function() {
        return it("re-renders the preview", function() {
          var grammarAdded;
          atom.workspace.getActiveTextEditor().setText("```javascript\nvar x = y;\n```");
          waitsFor("markdown to be rendered after its text changed", function() {
            return preview.find("atom-text-editor").data("grammar") === "text plain null-grammar";
          });
          grammarAdded = false;
          runs(function() {
            return atom.grammars.onDidAddGrammar(function() {
              return grammarAdded = true;
            });
          });
          waitsForPromise(function() {
            expect(atom.packages.isPackageActive('language-javascript')).toBe(false);
            return atom.packages.activatePackage('language-javascript');
          });
          waitsFor("grammar to be added", function() {
            return grammarAdded;
          });
          return waitsFor("markdown to be rendered after grammar was added", function() {
            return preview.find("atom-text-editor").data("grammar") !== "source js";
          });
        });
      });
    });
    describe("when the markdown preview view is requested by file URI", function() {
      return it("opens a preview editor and watches the file for changes", function() {
        waitsForPromise("atom.workspace.open promise to be resolved", function() {
          return atom.workspace.open("markdown-preview-plus://" + (atom.project.getDirectories()[0].resolve('subdir/file.markdown')));
        });
        runs(function() {
          preview = atom.workspace.getActivePaneItem();
          expect(preview).toBeInstanceOf(MarkdownPreviewView);
          spyOn(preview, 'renderMarkdownText');
          return preview.file.emitter.emit('did-change');
        });
        return waitsFor("markdown to be re-rendered after file changed", function() {
          return preview.renderMarkdownText.callCount > 0;
        });
      });
    });
    describe("when the editor's grammar it not enabled for preview", function() {
      return it("does not open the markdown preview", function() {
        atom.config.set('markdown-preview-plus.grammars', []);
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        return runs(function() {
          spyOn(atom.workspace, 'open').andCallThrough();
          atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          return expect(atom.workspace.open).not.toHaveBeenCalled();
        });
      });
    });
    describe("when the editor's path changes on #win32 and #darwin", function() {
      return it("updates the preview's title", function() {
        var titleChangedCallback;
        titleChangedCallback = jasmine.createSpy('titleChangedCallback');
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        runs(function() {
          var filePath;
          expect(preview.getTitle()).toBe('file.markdown Preview');
          preview.onDidChangeTitle(titleChangedCallback);
          filePath = atom.workspace.getActiveTextEditor().getPath();
          return fs.renameSync(filePath, path.join(path.dirname(filePath), 'file2.md'));
        });
        waitsFor(function() {
          return preview.getTitle() === "file2.md Preview";
        });
        return runs(function() {
          expect(titleChangedCallback).toHaveBeenCalled();
          return preview.destroy();
        });
      });
    });
    describe("when the URI opened does not have a markdown-preview-plus protocol", function() {
      return it("does not throw an error trying to decode the URI (regression)", function() {
        waitsForPromise(function() {
          return atom.workspace.open('%');
        });
        return runs(function() {
          return expect(atom.workspace.getActiveTextEditor()).toBeTruthy();
        });
      });
    });
    describe("when markdown-preview-plus:copy-html is triggered", function() {
      it("copies the HTML to the clipboard", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        return runs(function() {
          atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:copy-html');
          expect(atom.clipboard.read()).toBe("<p><em>italic</em></p>\n<p><strong>bold</strong></p>\n<p>encoding \u2192 issue</p>");
          atom.workspace.getActiveTextEditor().setSelectedBufferRange([[0, 0], [1, 0]]);
          atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:copy-html');
          return expect(atom.clipboard.read()).toBe("<p><em>italic</em></p>");
        });
      });
      return describe("code block tokenization", function() {
        preview = null;
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-ruby');
          });
          waitsForPromise(function() {
            return atom.packages.activatePackage('markdown-preview-plus');
          });
          waitsForPromise(function() {
            return atom.workspace.open("subdir/file.markdown");
          });
          return runs(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:copy-html');
            return preview = $('<div>').append(atom.clipboard.read());
          });
        });
        describe("when the code block's fence name has a matching grammar", function() {
          return it("tokenizes the code block with the grammar", function() {
            return expect(preview.find("pre span.entity.name.function.ruby")).toExist();
          });
        });
        describe("when the code block's fence name doesn't have a matching grammar", function() {
          return it("does not tokenize the code block", function() {
            return expect(preview.find("pre.lang-kombucha .line .null-grammar").children().length).toBe(2);
          });
        });
        describe("when the code block contains empty lines", function() {
          return it("doesn't remove the empty lines", function() {
            expect(preview.find("pre.lang-python").children().length).toBe(6);
            expect(preview.find("pre.lang-python div:nth-child(2)").text().trim()).toBe('');
            expect(preview.find("pre.lang-python div:nth-child(4)").text().trim()).toBe('');
            return expect(preview.find("pre.lang-python div:nth-child(5)").text().trim()).toBe('');
          });
        });
        return describe("when the code block is nested in a list", function() {
          return it("detects and styles the block", function() {
            return expect(preview.find("pre.lang-javascript")).toHaveClass('editor-colors');
          });
        });
      });
    });
    describe("when main::copyHtml() is called directly", function() {
      var mpp;
      mpp = null;
      beforeEach(function() {
        return mpp = atom.packages.getActivePackage('markdown-preview-plus').mainModule;
      });
      it("copies the HTML to the clipboard by default", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        return runs(function() {
          mpp.copyHtml();
          expect(atom.clipboard.read()).toBe("<p><em>italic</em></p>\n<p><strong>bold</strong></p>\n<p>encoding \u2192 issue</p>");
          atom.workspace.getActiveTextEditor().setSelectedBufferRange([[0, 0], [1, 0]]);
          mpp.copyHtml();
          return expect(atom.clipboard.read()).toBe("<p><em>italic</em></p>");
        });
      });
      it("passes the HTML to a callback if supplied as the first argument", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        return runs(function() {
          expect(mpp.copyHtml(function(html) {
            return html;
          })).toBe("<p><em>italic</em></p>\n<p><strong>bold</strong></p>\n<p>encoding \u2192 issue</p>");
          atom.workspace.getActiveTextEditor().setSelectedBufferRange([[0, 0], [1, 0]]);
          return expect(mpp.copyHtml(function(html) {
            return html;
          })).toBe("<p><em>italic</em></p>");
        });
      });
      return describe("when LaTeX rendering is enabled by default", function() {
        beforeEach(function() {
          spyOn(atom.clipboard, 'write').andCallThrough();
          waitsFor("LaTeX rendering to be enabled", function() {
            return atom.config.set('markdown-preview-plus.enableLatexRenderingByDefault', true);
          });
          waitsForPromise(function() {
            return atom.workspace.open("subdir/simple.md");
          });
          return runs(function() {
            return atom.workspace.getActiveTextEditor().setText('$$\\int_3^4$$');
          });
        });
        it("copies the HTML with maths blocks as svg's to the clipboard by default", function() {
          mpp.copyHtml();
          waitsFor("atom.clipboard.write to have been called", function() {
            return atom.clipboard.write.callCount === 1;
          });
          return runs(function() {
            var clipboard;
            clipboard = atom.clipboard.read();
            expect(clipboard.match(/MathJax\_SVG\_Hidden/).length).toBe(1);
            return expect(clipboard.match(/class\=\"MathJax\_SVG\"/).length).toBe(1);
          });
        });
        it("scales the svg's if the scaleMath parameter is passed", function() {
          mpp.copyHtml(null, 200);
          waitsFor("atom.clipboard.write to have been called", function() {
            return atom.clipboard.write.callCount === 1;
          });
          return runs(function() {
            var clipboard;
            clipboard = atom.clipboard.read();
            return expect(clipboard.match(/font\-size\: 200%/).length).toBe(1);
          });
        });
        return it("passes the HTML to a callback if supplied as the first argument", function() {
          var html;
          html = null;
          mpp.copyHtml(function(proHTML) {
            return html = proHTML;
          });
          waitsFor("markdown to be parsed and processed by MathJax", function() {
            return html != null;
          });
          return runs(function() {
            expect(html.match(/MathJax\_SVG\_Hidden/).length).toBe(1);
            return expect(html.match(/class\=\"MathJax\_SVG\"/).length).toBe(1);
          });
        });
      });
    });
    describe("sanitization", function() {
      it("removes script tags and attributes that commonly contain inline scripts", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/evil.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect($(preview[0]).find("div.update-preview").html()).toBe("<p>hello</p>\n\n\n<p>sad\n<img>\nworld</p>");
        });
      });
      return it("remove the first <!doctype> tag at the beginning of the file", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/doctype-tag.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect($(preview[0]).find("div.update-preview").html()).toBe("<p>content\n&lt;!doctype html&gt;</p>");
        });
      });
    });
    describe("when the markdown contains an <html> tag", function() {
      return it("does not throw an exception", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/html-tag.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect($(preview[0]).find("div.update-preview").html()).toBe("content");
        });
      });
    });
    describe("when the markdown contains a <pre> tag", function() {
      return it("does not throw an exception", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/pre-tag.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview.find('atom-text-editor')).toExist();
        });
      });
    });
    return describe("GitHub style markdown preview", function() {
      beforeEach(function() {
        return atom.config.set('markdown-preview-plus.useGitHubStyle', false);
      });
      it("renders markdown using the default style when GitHub styling is disabled", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview.element.getAttribute('data-use-github-style')).toBeNull();
        });
      });
      it("renders markdown using the GitHub styling when enabled", function() {
        atom.config.set('markdown-preview-plus.useGitHubStyle', true);
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview.element.getAttribute('data-use-github-style')).toBe('');
        });
      });
      return it("updates the rendering style immediately when the configuration is changed", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          expect(preview.element.getAttribute('data-use-github-style')).toBeNull();
          atom.config.set('markdown-preview-plus.useGitHubStyle', true);
          expect(preview.element.getAttribute('data-use-github-style')).not.toBeNull();
          atom.config.set('markdown-preview-plus.useGitHubStyle', false);
          return expect(preview.element.getAttribute('data-use-github-style')).toBeNull();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvc3BlYy9tYXJrZG93bi1wcmV2aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhDQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUlBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSw4QkFBUixDQUp0QixDQUFBOztBQUFBLEVBS0MsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUxELENBQUE7O0FBQUEsRUFPQSxPQUFBLENBQVEsZUFBUixDQVBBLENBQUE7O0FBQUEsRUFTQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFFBQUEseURBQUE7QUFBQSxJQUFBLE9BQThCLEVBQTlCLEVBQUMsMEJBQUQsRUFBbUIsaUJBQW5CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLHNCQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCLENBQWYsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLElBQUksQ0FBQyxTQUFMLENBQWUsTUFBZixDQURYLENBQUE7QUFBQSxNQUVBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixZQUE1QixFQUEwQyxRQUExQyxFQUFvRDtBQUFBLFFBQUEsV0FBQSxFQUFhLElBQWI7T0FBcEQs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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/spec/markdown-preview-spec.coffee
