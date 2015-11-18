(function() {
  var $, MarkdownPreviewView, cson, markdownIt, mathjaxHelper, path, temp;

  $ = require('atom-space-pen-views').$;

  path = require('path');

  temp = require('temp').track();

  cson = require('season');

  markdownIt = require('../lib/markdown-it-helper');

  mathjaxHelper = require('../lib/mathjax-helper');

  MarkdownPreviewView = require('../lib/markdown-preview-view');

  describe("Syncronization of source and preview", function() {
    var expectPreviewInSplitPane, fixturesPath, generateSelector, preview, waitsForQueuedMathJax, workspaceElement, _ref;
    _ref = [], preview = _ref[0], workspaceElement = _ref[1], fixturesPath = _ref[2];
    beforeEach(function() {
      var configDirPath;
      fixturesPath = path.join(__dirname, 'fixtures');
      jasmine.useRealClock();
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      configDirPath = temp.mkdirSync('atom-config-dir-');
      spyOn(atom, 'getConfigDirPath').andReturn(configDirPath);
      mathjaxHelper.resetMathJax();
      waitsForPromise(function() {
        return atom.packages.activatePackage("markdown-preview-plus");
      });
      waitsFor("LaTeX rendering to be enabled", function() {
        return atom.config.set('markdown-preview-plus.enableLatexRenderingByDefault', true);
      });
      waitsForPromise(function() {
        return atom.workspace.open(path.join(fixturesPath, 'sync.md'));
      });
      runs(function() {
        spyOn(mathjaxHelper, 'mathProcessor').andCallThrough();
        return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
      });
      expectPreviewInSplitPane();
      waitsFor("mathjaxHelper.mathProcessor to be called", function() {
        return mathjaxHelper.mathProcessor.calls.length;
      });
      waitsFor("MathJax to load", function() {
        return typeof MathJax !== "undefined" && MathJax !== null;
      });
      return waitsForQueuedMathJax();
    });
    afterEach(function() {
      preview.destroy();
      return mathjaxHelper.resetMathJax();
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
    waitsForQueuedMathJax = function() {
      var callback, done;
      done = [][0];
      callback = function() {
        return done = true;
      };
      runs(function() {
        return MathJax.Hub.Queue([callback]);
      });
      return waitsFor("queued MathJax operations to complete", function() {
        return done;
      });
    };
    generateSelector = function(token) {
      var element, selector, _i, _len, _ref1;
      selector = null;
      _ref1 = token.path;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        element = _ref1[_i];
        if (selector === null) {
          selector = ".update-preview > " + element.tag + ":eq(" + element.index + ")";
        } else {
          selector = "" + selector + " > " + element.tag + ":eq(" + element.index + ")";
        }
      }
      return selector;
    };
    describe("Syncronizing preview with source", function() {
      var sourceMap, tokens, _ref1;
      _ref1 = [], sourceMap = _ref1[0], tokens = _ref1[1];
      beforeEach(function() {
        sourceMap = cson.readFileSync(path.join(fixturesPath, 'sync-preview.cson'));
        return tokens = markdownIt.getTokens(preview.editor.getText(), true);
      });
      it("identifies the correct HTMLElement path", function() {
        var elementPath, i, sourceLine, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = sourceMap.length; _i < _len; _i++) {
          sourceLine = sourceMap[_i];
          elementPath = preview.getPathToToken(tokens, sourceLine.line);
          _results.push((function() {
            var _j, _ref2, _results1;
            _results1 = [];
            for (i = _j = 0, _ref2 = elementPath.length - 1; _j <= _ref2; i = _j += 1) {
              expect(elementPath[i].tag).toBe(sourceLine.path[i].tag);
              _results1.push(expect(elementPath[i].index).toBe(sourceLine.path[i].index));
            }
            return _results1;
          })());
        }
        return _results;
      });
      return it("scrolls to the correct HTMLElement", function() {
        var element, selector, sourceLine, syncElement, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = sourceMap.length; _i < _len; _i++) {
          sourceLine = sourceMap[_i];
          selector = generateSelector(sourceLine);
          if (selector != null) {
            element = preview.find(selector)[0];
          } else {
            continue;
          }
          syncElement = preview.syncPreview(preview.editor.getText(), sourceLine.line);
          _results.push(expect(element).toBe(syncElement));
        }
        return _results;
      });
    });
    return describe("Syncronizing source with preview", function() {
      return it("sets the editors cursor buffer location to the correct line", function() {
        var element, selector, sourceElement, sourceMap, syncLine, _i, _len, _results;
        sourceMap = cson.readFileSync(path.join(fixturesPath, 'sync-source.cson'));
        _results = [];
        for (_i = 0, _len = sourceMap.length; _i < _len; _i++) {
          sourceElement = sourceMap[_i];
          selector = generateSelector(sourceElement);
          if (selector != null) {
            element = preview.find(selector)[0];
          } else {
            continue;
          }
          syncLine = preview.syncSource(preview.editor.getText(), element);
          if (syncLine) {
            _results.push(expect(syncLine).toBe(sourceElement.line));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvc3BlYy9zeW5jLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1FQUFBOztBQUFBLEVBQUMsSUFBZSxPQUFBLENBQVEsc0JBQVIsRUFBZixDQUFELENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQWdCLE9BQUEsQ0FBUSxNQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQWdCLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBLENBRmhCLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQWdCLE9BQUEsQ0FBUSxRQUFSLENBSGhCLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWdCLE9BQUEsQ0FBUSwyQkFBUixDQUpoQixDQUFBOztBQUFBLEVBS0EsYUFBQSxHQUFnQixPQUFBLENBQVEsdUJBQVIsQ0FMaEIsQ0FBQTs7QUFBQSxFQU1BLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSw4QkFBUixDQU50QixDQUFBOztBQUFBLEVBUUEsUUFBQSxDQUFTLHNDQUFULEVBQWlELFNBQUEsR0FBQTtBQUMvQyxRQUFBLGdIQUFBO0FBQUEsSUFBQSxPQUE0QyxFQUE1QyxFQUFDLGlCQUFELEVBQVUsMEJBQVYsRUFBNEIsc0JBQTVCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGFBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsVUFBckIsQ0FBZixDQUFBO0FBQUEsTUFHQSxPQUFPLENBQUMsWUFBUixDQUFBLENBSEEsQ0FBQTtBQUFBLE1BSUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FB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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/spec/sync-spec.coffee
