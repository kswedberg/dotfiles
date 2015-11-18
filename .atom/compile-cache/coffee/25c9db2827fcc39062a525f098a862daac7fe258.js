(function() {
  describe("React tests", function() {
    var sampleCorrectAddonsES6File, sampleCorrectAddonsFile, sampleCorrectES6File, sampleCorrectFile, sampleCorrectNativeFile, sampleInvalidFile;
    sampleCorrectFile = require.resolve('./fixtures/sample-correct.js');
    sampleCorrectNativeFile = require.resolve('./fixtures/sample-correct-native.js');
    sampleCorrectES6File = require.resolve('./fixtures/sample-correct-es6.js');
    sampleCorrectAddonsES6File = require.resolve('./fixtures/sample-correct-addons-es6.js');
    sampleCorrectAddonsFile = require.resolve('./fixtures/sample-correct-addons.js');
    sampleInvalidFile = require.resolve('./fixtures/sample-invalid.js');
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-javascript");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      return afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
    });
    return describe("should select correct grammar", function() {
      it("should select source.js.jsx if file has require('react')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has require('react-native')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectNativeFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has require('react/addons')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectAddonsFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has react es6 import", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectES6File, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has react/addons es6 import", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectAddonsES6File, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      return it("should select source.js if file doesnt have require('react')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleInvalidFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js');
            return editor.destroy();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9yZWFjdC9zcGVjL2F0b20tcmVhY3Qtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsd0lBQUE7QUFBQSxJQUFBLGlCQUFBLEdBQW9CLE9BQU8sQ0FBQyxPQUFSLENBQWdCLDhCQUFoQixDQUFwQixDQUFBO0FBQUEsSUFDQSx1QkFBQSxHQUEwQixPQUFPLENBQUMsT0FBUixDQUFnQixxQ0FBaEIsQ0FEMUIsQ0FBQTtBQUFBLElBRUEsb0JBQUEsR0FBdUIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0Isa0NBQWhCLENBRnZCLENBQUE7QUFBQSxJQUdBLDBCQUFBLEdBQTZCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLHlDQUFoQixDQUg3QixDQUFBO0FBQUEsSUFJQSx1QkFBQSxHQUEwQixPQUFPLENBQUMsT0FBUixDQUFnQixxQ0FBaEIsQ0FKMUIsQ0FBQTtBQUFBLElBS0EsaUJBQUEsR0FBb0IsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsOEJBQWhCLENBTHBCLENBQUE7QUFBQSxJQU9BLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHFCQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO0FBQUEsTUFHQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixPQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FIQSxDQUFBO2FBTUEsU0FBQSxDQUFVLFNBQUEsR0FBQTtBQUNSLFFBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFBLENB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

//# sourceURL=/Users/kswedberg/.atom/packages/react/spec/atom-react-spec.coffee
