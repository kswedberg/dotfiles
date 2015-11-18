(function() {
  var MarkdownPreviewView, fs, markdownIt, pandocHelper, path, queryString, temp, url;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  MarkdownPreviewView = require('../lib/markdown-preview-view');

  markdownIt = require('../lib/markdown-it-helper');

  pandocHelper = require('../lib/pandoc-helper.coffee');

  url = require('url');

  queryString = require('querystring');

  require('./spec-helper');

  describe("MarkdownPreviewView when Pandoc is enabled", function() {
    var filePath, html, preview, _ref;
    _ref = [], html = _ref[0], preview = _ref[1], filePath = _ref[2];
    beforeEach(function() {
      var htmlPath;
      filePath = atom.project.getDirectories()[0].resolve('subdir/file.markdown');
      htmlPath = atom.project.getDirectories()[0].resolve('subdir/file-pandoc.html');
      html = fs.readFileSync(htmlPath, {
        encoding: 'utf-8'
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('markdown-preview-plus');
      });
      runs(function() {
        atom.config.set('markdown-preview-plus.enablePandoc', true);
        spyOn(pandocHelper, 'renderPandoc').andCallFake(function(text, filePath, renderMath, cb) {
          return cb(null, html);
        });
        preview = new MarkdownPreviewView({
          filePath: filePath
        });
        return jasmine.attachToDOM(preview.element);
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
    return describe("image resolving", function() {
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
          expect(markdownIt.decode).not.toHaveBeenCalled();
          return expect(image.attr('src')).toStartWith(atom.project.getDirectories()[0].resolve('subdir/image1.png'));
        });
      });
      describe("when the image uses an absolute path that does not exist", function() {
        return it("resolves to a path relative to the project root", function() {
          var image;
          image = preview.find("img[alt=Image2]");
          expect(markdownIt.decode).not.toHaveBeenCalled();
          return expect(image.attr('src')).toStartWith(atom.project.getDirectories()[0].resolve('tmp/image2.png'));
        });
      });
      describe("when the image uses an absolute path that exists", function() {
        return it("adds a query to the URL", function() {
          preview.destroy();
          filePath = path.join(temp.mkdirSync('atom'), 'foo.md');
          fs.writeFileSync(filePath, "![absolute](" + filePath + ")");
          jasmine.unspy(pandocHelper, 'renderPandoc');
          spyOn(pandocHelper, 'renderPandoc').andCallFake(function(text, filePath, renderMath, cb) {
            return cb(null, "<div class=\"figure\">\n<img src=\"" + filePath + "\" alt=\"absolute\"><p class=\"caption\">absolute</p>\n</div>");
          });
          preview = new MarkdownPreviewView({
            filePath: filePath
          });
          jasmine.attachToDOM(preview.element);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            expect(markdownIt.decode).not.toHaveBeenCalled();
            return expect(preview.find("img[alt=absolute]").attr('src')).toStartWith("" + filePath + "?v=");
          });
        });
      });
      return describe("when the image uses a web URL", function() {
        return it("doesn't change the URL", function() {
          var image;
          image = preview.find("img[alt=Image3]");
          expect(markdownIt.decode).not.toHaveBeenCalled();
          return expect(image.attr('src')).toBe('https://raw.githubusercontent.com/Galadirith/markdown-preview-plus/master/assets/hr.png');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvc3BlYy9tYXJrZG93bi1wcmV2aWV3LXZpZXctcGFuZG9jLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtFQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLDhCQUFSLENBSHRCLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLDJCQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLFlBQUEsR0FBZSxPQUFBLENBQVEsNkJBQVIsQ0FMZixDQUFBOztBQUFBLEVBTUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBTk4sQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQVBkLENBQUE7O0FBQUEsRUFTQSxPQUFBLENBQVEsZUFBUixDQVRBLENBQUE7O0FBQUEsRUFXQSxRQUFBLENBQVMsNENBQVQsRUFBdUQsU0FBQSxHQUFBO0FBQ3JELFFBQUEsNkJBQUE7QUFBQSxJQUFBLE9BQTRCLEVBQTVCLEVBQUMsY0FBRCxFQUFPLGlCQUFQLEVBQWdCLGtCQUFoQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxRQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQUEsQ0FBOEIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFqQyxDQUF5QyxzQkFBekMs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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/spec/markdown-preview-view-pandoc-spec.coffee
