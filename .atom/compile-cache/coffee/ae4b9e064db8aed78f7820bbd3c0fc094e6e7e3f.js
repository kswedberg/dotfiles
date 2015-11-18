(function() {
  var $, bibFile, cslFile, file, fs, pandocHelper, path, temp, tempPath, wrench;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  wrench = require('wrench');

  $ = require('atom-space-pen-views').$;

  pandocHelper = require('../lib/pandoc-helper.coffee');

  bibFile = 'test.bib';

  cslFile = 'foo.csl';

  tempPath = null;

  file = null;

  require('./spec-helper');

  describe("Markdown preview plus pandoc helper", function() {
    var preview, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], preview = _ref[1];
    beforeEach(function() {
      var fixturesPath;
      fixturesPath = path.join(__dirname, 'fixtures');
      tempPath = temp.mkdirSync('atom');
      wrench.copyDirSyncRecursive(fixturesPath, tempPath, {
        forceDelete: true
      });
      atom.project.setPaths([tempPath]);
      jasmine.useRealClock();
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return waitsForPromise(function() {
        return atom.packages.activatePackage("markdown-preview-plus");
      });
    });
    describe("PandocHelper::findFileRecursive", function() {
      var fR;
      fR = pandocHelper.__testing__.findFileRecursive;
      it("should return bibFile in the same directory", function() {
        return runs(function() {
          var bibPath, found;
          bibPath = path.join(tempPath, 'subdir', bibFile);
          fs.writeFileSync(bibPath, '');
          found = fR(path.join(tempPath, 'subdir', 'simple.md'), bibFile);
          return expect(found).toEqual(bibPath);
        });
      });
      it("should return bibFile in a parent directory", function() {
        return runs(function() {
          var bibPath, found;
          bibPath = path.join(tempPath, bibFile);
          fs.writeFileSync(bibPath, '');
          found = fR(path.join(tempPath, 'subdir', 'simple.md'), bibFile);
          return expect(found).toEqual(bibPath);
        });
      });
      return it("shouldn't return bibFile in a out of scope directory", function() {
        return runs(function() {
          var found;
          fs.writeFileSync(path.join(tempPath, '..', bibFile), '');
          found = fR(path.join(tempPath, 'subdir', 'simple.md'), bibFile);
          return expect(found).toEqual(false);
        });
      });
    });
    describe("PandocHelper::getArguments", function() {
      var getArguments;
      getArguments = pandocHelper.__testing__.getArguments;
      it('should work with empty arguments', function() {
        var result;
        atom.config.set('markdown-preview-plus.pandocArguments', []);
        result = getArguments(null);
        return expect(result.length).toEqual(0);
      });
      it('should filter empty arguments', function() {
        var args, result;
        args = {
          foo: 'bar',
          empty: null,
          none: 'lala',
          empty2: false,
          empty3: void 0
        };
        result = getArguments(args);
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual('--foo=bar');
        return expect(result[1]).toEqual('--none=lala');
      });
      it('should load user arguments', function() {
        var args, result;
        atom.config.set('markdown-preview-plus.pandocArguments', ['-v', '--smart', 'rem', '--filter=/foo/bar', '--filter-foo /foo/baz']);
        args = {};
        result = getArguments(args);
        expect(result.length).toEqual(4);
        expect(result[0]).toEqual('-v');
        expect(result[1]).toEqual('--smart');
        expect(result[2]).toEqual('--filter=/foo/bar');
        return expect(result[3]).toEqual('--filter-foo=/foo/baz');
      });
      return it('should combine user arguments and given arguments', function() {
        var args, result;
        atom.config.set('markdown-preview-plus.pandocArguments', ['-v', '--filter-foo /foo/baz']);
        args = {
          foo: 'bar',
          empty3: void 0
        };
        result = getArguments(args);
        expect(result.length).toEqual(3);
        expect(result[0]).toEqual('--foo=bar');
        expect(result[1]).toEqual('-v');
        return expect(result[2]).toEqual('--filter-foo=/foo/baz');
      });
    });
    return describe("PandocHelper::setPandocOptions", function() {
      var fallBackBib, fallBackCsl, setPandocOptions;
      fallBackBib = '/foo/fallback.bib';
      fallBackCsl = '/foo/fallback.csl';
      setPandocOptions = pandocHelper.__testing__.setPandocOptions;
      beforeEach(function() {
        file = path.join(tempPath, 'subdir', 'simple.md');
        atom.config.set('markdown-preview-plus.pandocBibliography', true);
        atom.config.set('markdown-preview-plus.pandocBIBFile', bibFile);
        atom.config.set('markdown-preview-plus.pandocBIBFileFallback', fallBackBib);
        atom.config.set('markdown-preview-plus.pandocCSLFile', cslFile);
        return atom.config.set('markdown-preview-plus.pandocCSLFileFallback', fallBackCsl);
      });
      it("shouldn't set pandoc bib options if citations are disabled", function() {
        return runs(function() {
          var config;
          atom.config.set('markdown-preview-plus.pandocBibliography', false);
          fs.writeFileSync(path.join(tempPath, bibFile), '');
          config = setPandocOptions(file);
          return expect(config.args.bibliography).toEqual(void 0);
        });
      });
      it("shouldn't set pandoc bib options if no fallback file exists", function() {
        return runs(function() {
          var config;
          atom.config.set('markdown-preview-plus.pandocBIBFileFallback');
          config = setPandocOptions(file);
          return expect(config.args.bibliography).toEqual(void 0);
        });
      });
      it("should set pandoc bib options if citations are enabled and project bibFile exists", function() {
        return runs(function() {
          var bibPath, config;
          bibPath = path.join(tempPath, bibFile);
          fs.writeFileSync(bibPath, '');
          config = setPandocOptions(file);
          return expect(config.args.bibliography).toEqual(bibPath);
        });
      });
      it("should set pandoc bib options if citations are enabled and use fallback", function() {
        return runs(function() {
          var config;
          config = setPandocOptions(file);
          return expect(config.args.bibliography).toEqual(fallBackBib);
        });
      });
      it("shouldn't set pandoc csl options if citations are disabled", function() {
        return runs(function() {
          var config;
          atom.config.set('markdown-preview-plus.pandocBibliography', false);
          fs.writeFileSync(path.join(tempPath, cslFile), '');
          config = setPandocOptions(file);
          return expect(config.args.csl).toEqual(void 0);
        });
      });
      it("shouldn't set pandoc csl options if no fallback file exists", function() {
        return runs(function() {
          var config;
          atom.config.set('markdown-preview-plus.pandocCSLFileFallback');
          config = setPandocOptions(file);
          return expect(config.args.csl).toEqual(void 0);
        });
      });
      it("should set pandoc csl options if citations are enabled and project cslFile exists", function() {
        return runs(function() {
          var config, cslPath;
          cslPath = path.join(tempPath, cslFile);
          fs.writeFileSync(cslPath, '');
          config = setPandocOptions(file);
          return expect(config.args.csl).toEqual(cslPath);
        });
      });
      return it("should set pandoc csl options if citations are enabled and use fallback", function() {
        return runs(function() {
          var config;
          config = setPandocOptions(file);
          return expect(config.args.csl).toEqual(fallBackCsl);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvc3BlYy9tYXJrZG93bi1wcmV2aWV3LXBhbmRvYy1oZWxwZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUVBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FIVCxDQUFBOztBQUFBLEVBSUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUpELENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsT0FBQSxDQUFRLDZCQUFSLENBTGYsQ0FBQTs7QUFBQSxFQU9BLE9BQUEsR0FBVSxVQVBWLENBQUE7O0FBQUEsRUFRQSxPQUFBLEdBQVUsU0FSVixDQUFBOztBQUFBLEVBVUEsUUFBQSxHQUFXLElBVlgsQ0FBQTs7QUFBQSxFQVdBLElBQUEsR0FBTyxJQVhQLENBQUE7O0FBQUEsRUFhQSxPQUFBLENBQVEsZUFBUixDQWJBLENBQUE7O0FBQUEsRUFlQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLFFBQUEsK0JBQUE7QUFBQSxJQUFBLE9BQThCLEVBQTlCLEVBQUMsMEJBQUQsRUFBbUIsaUJBQW5CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLFlBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsVUFBckIsQ0FBZixDQUFBO0FBQUEsTUFD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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/spec/markdown-preview-pandoc-helper-spec.coffee
