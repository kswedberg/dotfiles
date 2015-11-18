(function() {
  var fs, util;

  util = require('../lib/util');

  fs = require('fs');

  describe("util", function() {
    var editor;
    editor = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open('coffee-compile-fixtures.coffee').then(function(o) {
          return editor = o;
        });
      });
    });
    describe('getTextEditorById', function() {
      it('should find the right editor', function() {
        var id;
        id = editor.id;
        return expect(util.getTextEditorById(id)).toBe(editor);
      });
      return it('should not find the editor', function() {
        var id;
        id = editor.id + 1;
        return expect(util.getTextEditorById(id)).toBe(null);
      });
    });
    describe('compile', function() {
      it('should compile bare', function() {
        var expected;
        expected = "hello(world);\n";
        return expect(util.compile('hello world', editor)).toBe(expected);
      });
      return it('should compile with wrapper', function() {
        var expected;
        atom.config.set('coffee-compile.noTopLevelFunctionWrapper', false);
        expected = "(function() {\n  hello(world);\n\n}).call(this);\n";
        return expect(util.compile('hello world', editor)).toBe(expected);
      });
    });
    describe('compile litcoffee', function() {
      var litcoffeeEditor;
      litcoffeeEditor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-coffee-script');
        });
        return waitsForPromise(function() {
          return atom.workspace.open('test.litcoffee').then(function(o) {
            return litcoffeeEditor = o;
          });
        });
      });
      return it('should compile literate', function() {
        var expected, source;
        source = "This is a test\n\n    test = ->\n      hello world";
        expected = "var test;\n\ntest = function() {\n  return hello(world);\n};\n";
        return expect(util.compile(source, litcoffeeEditor)).toBe(expected);
      });
    });
    describe('getSelectedCode', function() {
      var text;
      text = "# This is a test\nmodule.exports =\n  hello: ->\n    console.log 'leave me alone'";
      beforeEach(function() {
        return editor.setText(text);
      });
      it('should return all text in editor', function() {
        return expect(util.getSelectedCode(editor)).toBe(text);
      });
      return it('should return selected text in editor', function() {
        editor.setSelectedBufferRange([[0, 0], [0, 16]]);
        return expect(util.getSelectedCode(editor)).toBe("# This is a test");
      });
    });
    return describe('compileToFile', function() {
      var filePath;
      filePath = null;
      beforeEach(function() {
        filePath = editor.getPath();
        return filePath = filePath.replace(".coffee", ".js");
      });
      afterEach(function() {
        if (fs.existsSync(filePath)) {
          return fs.unlink(filePath);
        }
      });
      return it('should create a js file', function() {
        waitsForPromise(function() {
          return util.compileToFile(editor);
        });
        return runs(function() {
          return expect(fs.existsSync(filePath)).toBe(true);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9zcGVjL3V0aWwtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsUUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsYUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLE1BQVQsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZ0NBQXBCLENBQXFELENBQUMsSUFBdEQsQ0FBMkQsU0FBQyxDQUFELEdBQUE7aUJBQ3pELE1BQUEsR0FBUyxFQURnRDtRQUFBLENBQTNELEVBRGM7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQU9BLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsTUFBQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFlBQUEsRUFBQTtBQUFBLFFBQUEsRUFBQSxHQUFLLE1BQU0sQ0FBQyxFQUFaLENBQUE7ZUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLGlCQUFMLENBQXVCLEVBQXZCLENBQVAsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxNQUF2QyxFQUZpQztNQUFBLENBQW5DLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsWUFBQSxFQUFBO0FBQUEsUUFBQSxFQUFBLEdBQUssTUFBTSxDQUFDLEVBQVAsR0FBWSxDQUFqQixDQUFBO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxpQkFBTCxDQUF1QixFQUF2QixDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsSUFBdkMsRUFGK0I7TUFBQSxDQUFqQyxFQUw0QjtJQUFBLENBQTlCLENBUEEsQ0FBQTtBQUFBLElBZ0JBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUNsQixNQUFBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsWUFBQSxRQUFBO0FBQUEsUUFBQSxRQUFBLEdBQVcsaUJBQVgsQ0FBQTtlQUtBLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLGFBQWIsRUFBNEIsTUFBNUIsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELFFBQWpELEVBTndCO01BQUEsQ0FBMUIsQ0FBQSxDQUFBO2FBUUEsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxZQUFBLFFBQUE7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQ0FBaEIsRUFBNEQsS0FBNUQsQ0FBQSxDQUFBO0FBQUEsUUFFQSxRQUFBLEdBQVcsb0RBRlgsQ0FBQTtlQVVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLGFBQWIsRUFBNEIsTUFBNUIsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELFFBQWpELEVBWGdDO01BQUEsQ0FBbEMsRUFUa0I7SUFBQSxDQUFwQixDQWhCQSxDQUFBO0FBQUEsSUFzQ0EsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixVQUFBLGVBQUE7QUFBQSxNQUFBLGVBQUEsR0FBa0IsSUFBbEIsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHdCQUE5QixFQURjO1FBQUEsQ0FBaEIsQ0FBQSxDQUFBO2VBR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGdCQUFwQixDQUFxQyxDQUFDLElBQXRDLENBQTJDLFNBQUMsQ0FBRCxHQUFBO21CQUN6QyxlQUFBLEdBQWtCLEVBRHVCO1VBQUEsQ0FBM0MsRUFEYztRQUFBLENBQWhCLEVBSlM7TUFBQSxDQUFYLENBRkEsQ0FBQTthQVVBLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsWUFBQSxnQkFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLG9EQUFULENBQUE7QUFBQSxRQU9BLFFBQUEsR0FBVyxnRUFQWCxDQUFBO2VBZ0JBLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQWIsRUFBcUIsZUFBckIsQ0FBUCxDQUE2QyxDQUFDLElBQTlDLENBQW1ELFFBQW5ELEVBakI0QjtNQUFBLENBQTlCLEVBWDRCO0lBQUEsQ0FBOUIsQ0F0Q0EsQ0FBQTtBQUFBLElBb0VBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sbUZBQVAsQ0FBQTtBQUFBLE1BT0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZixFQURTO01BQUEsQ0FBWCxDQVBBLENBQUE7QUFBQSxNQVVBLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7ZUFDckMsTUFBQSxDQUFPLElBQUksQ0FBQyxlQUFMLENBQXFCLE1BQXJCLENBQVAsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxJQUExQyxFQURxQztNQUFBLENBQXZDLENBVkEsQ0FBQTthQWFBLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsUUFBQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQVQsQ0FBOUIsQ0FBQSxDQUFBO2VBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxlQUFMLENBQXFCLE1BQXJCLENBQVAsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxrQkFBMUMsRUFIMEM7TUFBQSxDQUE1QyxFQWQwQjtJQUFBLENBQTVCLENBcEVBLENBQUE7V0F1RkEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQVgsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBWCxDQUFBO2VBQ0EsUUFBQSxHQUFXLFFBQVEsQ0FBQyxPQUFULENBQWlCLFNBQWpCLEVBQTRCLEtBQTVCLEVBRkY7TUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLE1BTUEsU0FBQSxDQUFVLFNBQUEsR0FBQTtBQUNSLFFBQUEsSUFBdUIsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQXZCO2lCQUFBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFBO1NBRFE7TUFBQSxDQUFWLENBTkEsQ0FBQTthQVNBLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsUUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxJQUFJLENBQUMsYUFBTCxDQUFtQixNQUFuQixFQURjO1FBQUEsQ0FBaEIsQ0FBQSxDQUFBO2VBR0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFDSCxNQUFBLENBQU8sRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQVAsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxJQUFyQyxFQURHO1FBQUEsQ0FBTCxFQUo0QjtNQUFBLENBQTlCLEVBVndCO0lBQUEsQ0FBMUIsRUF4RmU7RUFBQSxDQUFqQixDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/spec/util-spec.coffee
