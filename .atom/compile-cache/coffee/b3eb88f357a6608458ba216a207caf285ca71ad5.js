(function() {
  var MarkdownPreviewView, fs, markdownIt, mathjaxHelper, path, queryString, temp, url;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  MarkdownPreviewView = require('../lib/markdown-preview-view');

  markdownIt = require('../lib/markdown-it-helper');

  mathjaxHelper = require('../lib/mathjax-helper');

  url = require('url');

  queryString = require('querystring');

  require('./spec-helper');

  describe("MarkdownPreviewView", function() {
    var expectPreviewInSplitPane, filePath, preview, _ref;
    _ref = [], filePath = _ref[0], preview = _ref[1];
    beforeEach(function() {
      filePath = atom.project.getDirectories()[0].resolve('subdir/file.markdown');
      preview = new MarkdownPreviewView({
        filePath: filePath
      });
      jasmine.attachToDOM(preview.element);
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-ruby');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('markdown-preview-plus');
      });
      return this.addMatchers({
        toStartWith: function(expected) {
          return this.actual.slice(0, expected.length) === expected;
        }
      });
    });
    afterEach(function() {
      return preview.destroy();
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
    describe("::constructor", function() {
      return it("shows an error message when there is an error", function() {
        preview.showError("Not a real file");
        return expect(preview.text()).toContain("Failed");
      });
    });
    describe("serialization", function() {
      var newPreview;
      newPreview = null;
      afterEach(function() {
        return newPreview.destroy();
      });
      it("recreates the file when serialized/deserialized", function() {
        newPreview = atom.deserializers.deserialize(preview.serialize());
        jasmine.attachToDOM(newPreview.element);
        return expect(newPreview.getPath()).toBe(preview.getPath());
      });
      return it("serializes the editor id when opened for an editor", function() {
        preview.destroy();
        waitsForPromise(function() {
          return atom.workspace.open('new.markdown');
        });
        return runs(function() {
          preview = new MarkdownPreviewView({
            editorId: atom.workspace.getActiveTextEditor().id
          });
          jasmine.attachToDOM(preview.element);
          expect(preview.getPath()).toBe(atom.workspace.getActiveTextEditor().getPath());
          newPreview = atom.deserializers.deserialize(preview.serialize());
          jasmine.attachToDOM(newPreview.element);
          return expect(newPreview.getPath()).toBe(preview.getPath());
        });
      });
    });
    describe("header rendering", function() {
      it("should render headings with and without space", function() {
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        return runs(function() {
          var headlines;
          headlines = preview.find('h2');
          expect(headlines).toExist();
          expect(headlines.length).toBe(2);
          expect(headlines[0].outerHTML).toBe("<h2>Level two header without space</h2>");
          return expect(headlines[1].outerHTML).toBe("<h2>Level two header with space</h2>");
        });
      });
      return it("should render headings with and without space", function() {
        atom.config.set('markdown-preview-plus.useLazyHeaders', false);
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        return runs(function() {
          var headlines;
          headlines = preview.find('h2');
          expect(headlines).toExist();
          expect(headlines.length).toBe(1);
          return expect(headlines[0].outerHTML).toBe("<h2>Level two header with space</h2>");
        });
      });
    });
    describe("code block conversion to atom-text-editor tags", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return preview.renderMarkdown();
        });
      });
      it("removes line decorations on rendered code blocks", function() {
        var decorations, editor;
        editor = preview.find("atom-text-editor[data-grammar='text plain null-grammar']");
        decorations = editor[0].getModel().getDecorations({
          "class": 'cursor-line',
          type: 'line'
        });
        return expect(decorations.length).toBe(0);
      });
      describe("when the code block's fence name has a matching grammar", function() {
        return it("assigns the grammar on the atom-text-editor", function() {
          var jsEditor, rubyEditor;
          rubyEditor = preview.find("atom-text-editor[data-grammar='source ruby']");
          expect(rubyEditor).toExist();
          expect(rubyEditor[0].getModel().getText()).toBe("def func\n  x = 1\nend");
          jsEditor = preview.find("atom-text-editor[data-grammar='source js']");
          expect(jsEditor).toExist();
          return expect(jsEditor[0].getModel().getText()).toBe("if a === 3 {\n  b = 5\n}");
        });
      });
      return describe("when the code block's fence name doesn't have a matching grammar", function() {
        return it("does not assign a specific grammar", function() {
          var plainEditor;
          plainEditor = preview.find("atom-text-editor[data-grammar='text plain null-grammar']");
          expect(plainEditor).toExist();
          return expect(plainEditor[0].getModel().getText()).toBe("function f(x) {\n  return x++;\n}");
        });
      });
    });
    describe("image resolving", function() {
      beforeEach(function() {
        spyOn(markdownIt, 'decode').andCallThrough();
        return waitsForPromise(function() {
          return preview.renderMarkdown();
        });
      });
      describe("when the image uses a relative path", function() {
        return it("resolves to a path relative to the file", function() {
          var image;
          image = preview.find("img[alt=Image1]");
          expect(markdownIt.decode).toHaveBeenCalled();
          return expect(image.attr('src')).toStartWith(atom.project.getDirectories()[0].resolve('subdir/image1.png'));
        });
      });
      describe("when the image uses an absolute path that does not exist", function() {
        return it("resolves to a path relative to the project root", function() {
          var image;
          image = preview.find("img[alt=Image2]");
          expect(markdownIt.decode).toHaveBeenCalled();
          return expect(image.attr('src')).toStartWith(atom.project.getDirectories()[0].resolve('tmp/image2.png'));
        });
      });
      describe("when the image uses an absolute path that exists", function() {
        return it("adds a query to the URL", function() {
          preview.destroy();
          filePath = path.join(temp.mkdirSync('atom'), 'foo.md');
          fs.writeFileSync(filePath, "![absolute](" + filePath + ")");
          preview = new MarkdownPreviewView({
            filePath: filePath
          });
          jasmine.attachToDOM(preview.element);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            expect(markdownIt.decode).toHaveBeenCalled();
            return expect(preview.find("img[alt=absolute]").attr('src')).toStartWith("" + filePath + "?v=");
          });
        });
      });
      return describe("when the image uses a web URL", function() {
        return it("doesn't change the URL", function() {
          var image;
          image = preview.find("img[alt=Image3]");
          expect(markdownIt.decode).toHaveBeenCalled();
          return expect(image.attr('src')).toBe('https://raw.githubusercontent.com/Galadirith/markdown-preview-plus/master/assets/hr.png');
        });
      });
    });
    describe("image modification", function() {
      var dirPath, getImageVersion, img1Path, workspaceElement, _ref1;
      _ref1 = [], dirPath = _ref1[0], filePath = _ref1[1], img1Path = _ref1[2], workspaceElement = _ref1[3];
      beforeEach(function() {
        preview.destroy();
        jasmine.useRealClock();
        dirPath = temp.mkdirSync('atom');
        filePath = path.join(dirPath, 'image-modification.md');
        img1Path = path.join(dirPath, 'img1.png');
        fs.writeFileSync(filePath, "![img1](" + img1Path + ")");
        fs.writeFileSync(img1Path, "clearly not a png but good enough for tests");
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);
        return waitsForPromise(function() {
          return atom.packages.activatePackage("markdown-preview-plus");
        });
      });
      getImageVersion = function(imagePath, imageURL) {
        var urlQuery, urlQueryStr;
        expect(imageURL).toStartWith("" + imagePath + "?v=");
        urlQueryStr = url.parse(imageURL).query;
        urlQuery = queryString.parse(urlQueryStr);
        return urlQuery.v;
      };
      describe("when a local image is previewed", function() {
        return it("adds a timestamp query to the URL", function() {
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          expectPreviewInSplitPane();
          return runs(function() {
            var imageURL, imageVer;
            imageURL = preview.find("img[alt=img1]").attr('src');
            imageVer = getImageVersion(img1Path, imageURL);
            return expect(imageVer).not.toEqual('deleted');
          });
        });
      });
      describe("when a local image is modified during a preview #notwercker", function() {
        return it("rerenders the image with a more recent timestamp query", function() {
          var imageURL, imageVer, _ref2;
          _ref2 = [], imageURL = _ref2[0], imageVer = _ref2[1];
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          expectPreviewInSplitPane();
          runs(function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            imageVer = getImageVersion(img1Path, imageURL);
            expect(imageVer).not.toEqual('deleted');
            return fs.writeFileSync(img1Path, "still clearly not a png ;D");
          });
          waitsFor("image src attribute to update", function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            return !imageURL.endsWith(imageVer);
          });
          return runs(function() {
            var newImageVer;
            newImageVer = getImageVersion(img1Path, imageURL);
            expect(newImageVer).not.toEqual('deleted');
            return expect(parseInt(newImageVer)).toBeGreaterThan(parseInt(imageVer));
          });
        });
      });
      describe("when three images are previewed and all are modified #notwercker", function() {
        return it("rerenders the images with a more recent timestamp as they are modified", function() {
          var expectQueryValues, getImageElementsURL, img1URL, img1Ver, img2Path, img2URL, img2Ver, img3Path, img3URL, img3Ver, _ref2, _ref3, _ref4;
          _ref2 = [], img2Path = _ref2[0], img3Path = _ref2[1];
          _ref3 = [], img1Ver = _ref3[0], img2Ver = _ref3[1], img3Ver = _ref3[2];
          _ref4 = [], img1URL = _ref4[0], img2URL = _ref4[1], img3URL = _ref4[2];
          runs(function() {
            preview.destroy();
            img2Path = path.join(dirPath, 'img2.png');
            img3Path = path.join(dirPath, 'img3.png');
            fs.writeFileSync(img2Path, "i'm not really a png ;D");
            fs.writeFileSync(img3Path, "neither am i ;D");
            return fs.writeFileSync(filePath, "![img1](" + img1Path + ")\n![img2](" + img2Path + ")\n![img3](" + img3Path + ")");
          });
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          expectPreviewInSplitPane();
          getImageElementsURL = function() {
            return [preview.find("img[alt=img1]").attr('src'), preview.find("img[alt=img2]").attr('src'), preview.find("img[alt=img3]").attr('src')];
          };
          expectQueryValues = function(queryValues) {
            var _ref5;
            _ref5 = getImageElementsURL(), img1URL = _ref5[0], img2URL = _ref5[1], img3URL = _ref5[2];
            if (queryValues.img1 != null) {
              expect(img1URL).toStartWith("" + img1Path + "?v=");
              expect(img1URL).toBe("" + img1Path + "?v=" + queryValues.img1);
            }
            if (queryValues.img2 != null) {
              expect(img2URL).toStartWith("" + img2Path + "?v=");
              expect(img2URL).toBe("" + img2Path + "?v=" + queryValues.img2);
            }
            if (queryValues.img3 != null) {
              expect(img3URL).toStartWith("" + img3Path + "?v=");
              return expect(img3URL).toBe("" + img3Path + "?v=" + queryValues.img3);
            }
          };
          runs(function() {
            var _ref5;
            _ref5 = getImageElementsURL(), img1URL = _ref5[0], img2URL = _ref5[1], img3URL = _ref5[2];
            img1Ver = getImageVersion(img1Path, img1URL);
            img2Ver = getImageVersion(img2Path, img2URL);
            img3Ver = getImageVersion(img3Path, img3URL);
            return fs.writeFileSync(img1Path, "still clearly not a png ;D");
          });
          waitsFor("img1 src attribute to update", function() {
            img1URL = preview.find("img[alt=img1]").attr('src');
            return !img1URL.endsWith(img1Ver);
          });
          runs(function() {
            var newImg1Ver;
            expectQueryValues({
              img2: img2Ver,
              img3: img3Ver
            });
            newImg1Ver = getImageVersion(img1Path, img1URL);
            expect(newImg1Ver).not.toEqual('deleted');
            expect(parseInt(newImg1Ver)).toBeGreaterThan(parseInt(img1Ver));
            img1Ver = newImg1Ver;
            return fs.writeFileSync(img2Path, "still clearly not a png either ;D");
          });
          waitsFor("img2 src attribute to update", function() {
            img2URL = preview.find("img[alt=img2]").attr('src');
            return !img2URL.endsWith(img2Ver);
          });
          runs(function() {
            var newImg2Ver;
            expectQueryValues({
              img1: img1Ver,
              img3: img3Ver
            });
            newImg2Ver = getImageVersion(img2Path, img2URL);
            expect(newImg2Ver).not.toEqual('deleted');
            expect(parseInt(newImg2Ver)).toBeGreaterThan(parseInt(img2Ver));
            img2Ver = newImg2Ver;
            return fs.writeFileSync(img3Path, "you better believe i'm not a png ;D");
          });
          waitsFor("img3 src attribute to update", function() {
            img3URL = preview.find("img[alt=img3]").attr('src');
            return !img3URL.endsWith(img3Ver);
          });
          return runs(function() {
            var newImg3Ver;
            expectQueryValues({
              img1: img1Ver,
              img2: img2Ver
            });
            newImg3Ver = getImageVersion(img3Path, img3URL);
            expect(newImg3Ver).not.toEqual('deleted');
            return expect(parseInt(newImg3Ver)).toBeGreaterThan(parseInt(img3Ver));
          });
        });
      });
      describe("when a previewed image is deleted then restored", function() {
        return it("removes the query timestamp and restores the timestamp after a rerender", function() {
          var imageURL, imageVer, _ref2;
          _ref2 = [], imageURL = _ref2[0], imageVer = _ref2[1];
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          expectPreviewInSplitPane();
          runs(function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            imageVer = getImageVersion(img1Path, imageURL);
            expect(imageVer).not.toEqual('deleted');
            return fs.unlinkSync(img1Path);
          });
          waitsFor("image src attribute to update", function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            return !imageURL.endsWith(imageVer);
          });
          runs(function() {
            expect(imageURL).toBe(img1Path);
            fs.writeFileSync(img1Path, "clearly not a png but good enough for tests");
            return preview.renderMarkdown();
          });
          waitsFor("image src attribute to update", function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            return imageURL !== img1Path;
          });
          return runs(function() {
            var newImageVer;
            newImageVer = getImageVersion(img1Path, imageURL);
            return expect(parseInt(newImageVer)).toBeGreaterThan(parseInt(imageVer));
          });
        });
      });
      return describe("when a previewed image is renamed and then restored with its original name", function() {
        return it("removes the query timestamp and restores the timestamp after a rerender", function() {
          var imageURL, imageVer, _ref2;
          _ref2 = [], imageURL = _ref2[0], imageVer = _ref2[1];
          waitsForPromise(function() {
            return atom.workspace.open(filePath);
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
          });
          expectPreviewInSplitPane();
          runs(function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            imageVer = getImageVersion(img1Path, imageURL);
            expect(imageVer).not.toEqual('deleted');
            return fs.renameSync(img1Path, img1Path + "trol");
          });
          waitsFor("image src attribute to update", function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            return !imageURL.endsWith(imageVer);
          });
          runs(function() {
            expect(imageURL).toBe(img1Path);
            fs.renameSync(img1Path + "trol", img1Path);
            return preview.renderMarkdown();
          });
          waitsFor("image src attribute to update", function() {
            imageURL = preview.find("img[alt=img1]").attr('src');
            return imageURL !== img1Path;
          });
          return runs(function() {
            var newImageVer;
            newImageVer = getImageVersion(img1Path, imageURL);
            return expect(parseInt(newImageVer)).toBeGreaterThan(parseInt(imageVer));
          });
        });
      });
    });
    describe("gfm newlines", function() {
      describe("when gfm newlines are not enabled", function() {
        return it("creates a single paragraph with <br>", function() {
          atom.config.set('markdown-preview-plus.breakOnSingleNewline', false);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            return expect(preview.find("p:last-child br").length).toBe(0);
          });
        });
      });
      return describe("when gfm newlines are enabled", function() {
        return it("creates a single paragraph with no <br>", function() {
          atom.config.set('markdown-preview-plus.breakOnSingleNewline', true);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            return expect(preview.find("p:last-child br").length).toBe(1);
          });
        });
      });
    });
    describe("when core:save-as is triggered", function() {
      beforeEach(function() {
        preview.destroy();
        filePath = atom.project.getDirectories()[0].resolve('subdir/code-block.md');
        preview = new MarkdownPreviewView({
          filePath: filePath
        });
        return jasmine.attachToDOM(preview.element);
      });
      it("saves the rendered HTML and opens it", function() {
        var atomTextEditorStyles, createRule, expectedFilePath, expectedOutput, markdownPreviewStyles, outputPath;
        outputPath = temp.path({
          suffix: '.html'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('saved-html.html');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        createRule = function(selector, css) {
          return {
            selectorText: selector,
            cssText: "" + selector + " " + css
          };
        };
        markdownPreviewStyles = [
          {
            rules: [createRule(".markdown-preview", "{ color: orange; }")]
          }, {
            rules: [createRule(".not-included", "{ color: green; }"), createRule(".markdown-preview :host", "{ color: purple; }")]
          }
        ];
        atomTextEditorStyles = ["atom-text-editor .line { color: brown; }\natom-text-editor .number { color: cyan; }", "atom-text-editor :host .something { color: black; }", "atom-text-editor .hr { background: url(atom://markdown-preview-plus/assets/hr.png); }"];
        expect(fs.isFileSync(outputPath)).toBe(false);
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        runs(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          spyOn(preview, 'getDocumentStyleSheets').andReturn(markdownPreviewStyles);
          spyOn(preview, 'getTextEditorStyles').andReturn(atomTextEditorStyles);
          return atom.commands.dispatch(preview.element, 'core:save-as');
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          var savedHTML;
          expect(fs.isFileSync(outputPath)).toBe(true);
          savedHTML = atom.workspace.getActiveTextEditor().getText().replace(/<body class='markdown-preview'><div>/, '<body class=\'markdown-preview\'>').replace(/\n<\/div><\/body>/, '</body>');
          return expect(savedHTML).toBe(expectedOutput.replace(/\r\n/g, '\n'));
        });
      });
      return describe("text editor style extraction", function() {
        var extractedStyles, textEditorStyle, unrelatedStyle;
        extractedStyles = [][0];
        textEditorStyle = ".editor-style .extraction-test { color: blue; }";
        unrelatedStyle = ".something else { color: red; }";
        beforeEach(function() {
          atom.styles.addStyleSheet(textEditorStyle, {
            context: 'atom-text-editor'
          });
          atom.styles.addStyleSheet(unrelatedStyle, {
            context: 'unrelated-context'
          });
          return extractedStyles = preview.getTextEditorStyles();
        });
        it("returns an array containing atom-text-editor css style strings", function() {
          return expect(extractedStyles.indexOf(textEditorStyle)).toBeGreaterThan(-1);
        });
        return it("does not return other styles", function() {
          return expect(extractedStyles.indexOf(unrelatedStyle)).toBe(-1);
        });
      });
    });
    describe("when core:copy is triggered", function() {
      return it("writes the rendered HTML to the clipboard", function() {
        preview.destroy();
        preview.element.remove();
        filePath = atom.project.getDirectories()[0].resolve('subdir/code-block.md');
        preview = new MarkdownPreviewView({
          filePath: filePath
        });
        jasmine.attachToDOM(preview.element);
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        runs(function() {
          return atom.commands.dispatch(preview.element, 'core:copy');
        });
        waitsFor(function() {
          return atom.clipboard.read() !== "initial clipboard content";
        });
        return runs(function() {
          return expect(atom.clipboard.read()).toBe("<h1>Code Block</h1>\n<pre class=\"editor-colors lang-javascript\"><div class=\"line\"><span class=\"source js\"><span class=\"keyword control js\"><span>if</span></span><span>&nbsp;a&nbsp;</span><span class=\"keyword operator js\"><span>===</span></span><span>&nbsp;</span><span class=\"constant numeric js\"><span>3</span></span><span>&nbsp;</span><span class=\"meta brace curly js\"><span>{</span></span></span></div><div class=\"line\"><span class=\"source js\"><span>&nbsp;&nbsp;b&nbsp;</span><span class=\"keyword operator js\"><span>=</span></span><span>&nbsp;</span><span class=\"constant numeric js\"><span>5</span></span></span></div><div class=\"line\"><span class=\"source js\"><span class=\"meta brace curly js\"><span>}</span></span></span></div></pre>\n<p>encoding \u2192 issue</p>");
        });
      });
    });
    return describe("when maths rendering is enabled by default", function() {
      return it("notifies the user MathJax is loading when first preview is opened", function() {
        var workspaceElement;
        workspaceElement = [][0];
        preview.destroy();
        waitsForPromise(function() {
          return atom.packages.activatePackage('notifications');
        });
        runs(function() {
          workspaceElement = atom.views.getView(atom.workspace);
          return jasmine.attachToDOM(workspaceElement);
        });
        waitsForPromise(function() {
          return atom.workspace.open(filePath);
        });
        runs(function() {
          mathjaxHelper.resetMathJax();
          atom.config.set('markdown-preview-plus.enableLatexRenderingByDefault', true);
          return atom.commands.dispatch(workspaceElement, 'markdown-preview-plus:toggle');
        });
        expectPreviewInSplitPane();
        waitsFor("notification", function() {
          return workspaceElement.querySelector('atom-notification');
        });
        return runs(function() {
          var notification;
          notification = workspaceElement.querySelector('atom-notification.info');
          return expect(notification).toExist();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvc3BlYy9tYXJrZG93bi1wcmV2aWV3LXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0ZBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsOEJBQVIsQ0FIdEIsQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsMkJBQVIsQ0FKYixDQUFBOztBQUFBLEVBS0EsYUFBQSxHQUFnQixPQUFBLENBQVEsdUJBQVIsQ0FMaEIsQ0FBQTs7QUFBQSxFQU1BLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQU5OLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVIsQ0FQZCxDQUFBOztBQUFBLEVBU0EsT0FBQSxDQUFRLGVBQVIsQ0FUQSxDQUFBOztBQUFBLEVBV0EsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixRQUFBLGlEQUFBO0FBQUEsSUFBQSxPQUFzQixFQUF0QixFQUFDLGtCQUFELEVBQVcsaUJBQVgsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUFBLENBQThCLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBakMsQ0FBeUMsc0JBQXpDLENBQVgsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFjLElB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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/spec/markdown-preview-view-spec.coffee
