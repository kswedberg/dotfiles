(function() {
  var fs, fsUtil, path;

  fs = require('fs');

  fsUtil = require('../lib/fs-util');

  path = require('path');

  describe("fs util", function() {
    var testPath;
    testPath = "/home/test/github/coffee-compile/lib/fs-util.coffee";
    describe("toExt", function() {
      return it("should convert to js extension", function() {
        var output;
        output = fsUtil.toExt(testPath, 'js');
        return expect(output).toBe("/home/test/github/coffee-compile/lib/fs-util.js");
      });
    });
    describe("resolvePath", function() {
      beforeEach(function() {
        return atom.project.setPaths(["/home/test/github/coffee-compile"]);
      });
      afterEach(function() {
        return atom.config.unset('coffee-compile');
      });
      it("should return same path", function() {
        var output;
        output = fsUtil.resolvePath(testPath);
        return expect(output).toBe(testPath);
      });
      it("should return an updated path", function() {
        var output;
        atom.config.set("coffee-compile.destination", "test/folder");
        output = fsUtil.resolvePath(testPath);
        return expect(output).toBe("/home/test/github/coffee-compile/test/folder/lib/fs-util.coffee");
      });
      it("should flatten path", function() {
        var output;
        atom.config.set("coffee-compile.flatten", true);
        output = fsUtil.resolvePath(testPath);
        return expect(output).toBe("/home/test/github/coffee-compile/fs-util.coffee");
      });
      return it("should join cwd path", function() {
        var cwdTestPath, output;
        atom.config.set("coffee-compile.cwd", "lib");
        cwdTestPath = "/home/test/github/coffee-compile/lib/more/folder/fs-util.coffee";
        output = fsUtil.resolvePath(cwdTestPath);
        return expect(output).toBe("/home/test/github/coffee-compile/more/folder/fs-util.coffee");
      });
    });
    describe("writeFile", function() {
      var editor, filePath;
      editor = null;
      filePath = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('coffee-compile-fixtures.coffee').then(function(o) {
            return editor = o;
          });
        });
        return runs(function() {
          var folder;
          filePath = editor.getPath();
          folder = path.dirname(filePath);
          return filePath = path.join(folder, "test/lib", "coffee-compile-fixtures.js");
        });
      });
      afterEach(function() {
        if (fs.existsSync(filePath)) {
          return fs.unlink(filePath);
        }
      });
      return it("should make folders and create a js file", function() {
        waitsForPromise(function() {
          return fsUtil.writeFile(filePath, "test");
        });
        return runs(function() {
          return expect(fs.existsSync(filePath)).toBe(true);
        });
      });
    });
    return describe("isPathInSrc", function() {
      beforeEach(function() {
        return atom.project.setPaths(["/home/test/github/coffee-compile"]);
      });
      afterEach(function() {
        return atom.config.unset('coffee-compile');
      });
      it("should return true when lib is in source", function() {
        var output;
        atom.config.set("coffee-compile.source", ["lib/", "src/"]);
        output = fsUtil.isPathInSrc(testPath);
        return expect(output).toBe(true);
      });
      it("should return false when the file is not in the source folder", function() {
        var output;
        atom.config.set("coffee-compile.source", ["does-not-exist/"]);
        output = fsUtil.isPathInSrc(testPath);
        return expect(output).toBe(false);
      });
      it("should return true when root is source", function() {
        var output;
        atom.config.set("coffee-compile.source", ["."]);
        output = fsUtil.isPathInSrc(testPath);
        return expect(output).toBe(true);
      });
      it("should return true when root is source (as a string)", function() {
        var output;
        atom.config.set("coffee-compile.source", ".");
        output = fsUtil.isPathInSrc(testPath);
        return expect(output).toBe(true);
      });
      it("should return true when root is invalid value and default to ['.']", function() {
        var output;
        atom.config.set("coffee-compile.source", void 0);
        output = fsUtil.isPathInSrc(testPath);
        return expect(output).toBe(true);
      });
      it("should be relative to cwd and return true", function() {
        var cwdTestPath, output;
        atom.config.set("coffee-compile.cwd", "lib/");
        atom.config.set("coffee-compile.source", ["more/"]);
        cwdTestPath = "/home/test/github/coffee-compile/lib/more/folder/fs-util.coffee";
        output = fsUtil.isPathInSrc(cwdTestPath);
        return expect(output).toBe(true);
      });
      return it("should not be relative to cwd and return false", function() {
        var cwdTestPath, output;
        atom.config.set("coffee-compile.cwd", "spec");
        atom.config.set("coffee-compile.source", ["."]);
        cwdTestPath = "/home/test/github/coffee-compile/lib/more/folder/fs-util.coffee";
        output = fsUtil.isPathInSrc(cwdTestPath);
        return expect(output).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9zcGVjL2ZzLXV0aWwtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0JBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxnQkFBUixDQURULENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsUUFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLHFEQUFYLENBQUE7QUFBQSxJQUVBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTthQUNoQixFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxLQUFQLENBQWEsUUFBYixFQUF1QixJQUF2QixDQUFULENBQUE7ZUFDQSxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsSUFBZixDQUFvQixpREFBcEIsRUFGbUM7TUFBQSxDQUFyQyxFQURnQjtJQUFBLENBQWxCLENBRkEsQ0FBQTtBQUFBLElBT0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixDQUFDLGtDQUFELENBQXRCLEVBRFM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsU0FBQSxDQUFVLFNBQUEsR0FBQTtlQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBWixDQUFrQixn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

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/spec/fs-util-spec.coffee
