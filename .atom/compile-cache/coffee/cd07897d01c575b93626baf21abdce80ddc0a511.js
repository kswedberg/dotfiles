(function() {
  var Disposable, coffeeProvider, pluginManager;

  pluginManager = require('../lib/plugin-manager');

  coffeeProvider = require('../lib/providers/coffee-provider');

  Disposable = require('atom').Disposable;

  describe("pluginManager", function() {
    beforeEach(function() {
      pluginManager.plugins.length = 0;
      return pluginManager.languages = {};
    });
    describe("register", function() {
      it("should register successfully and return a Disposable", function() {
        var output;
        output = pluginManager.register(coffeeProvider);
        return expect(output instanceof Disposable).toBe(true);
      });
      it("should push functions to all 3 compilers", function() {
        var compile, language, postCompile, preCompile;
        preCompile = function(code) {
          return code;
        };
        compile = function(code) {
          return code;
        };
        postCompile = function(code) {
          return code;
        };
        pluginManager.register({
          id: 'some-test',
          selector: ['source.invalid'],
          preCompile: preCompile,
          compile: compile,
          postCompile: postCompile
        });
        language = pluginManager.languages['source.invalid'];
        expect(language.preCompilers[0]).toBe(preCompile);
        expect(language.compilers[0]).toBe(compile);
        return expect(language.postCompilers[0]).toBe(postCompile);
      });
      it("should not push when function does not exist", function() {
        var language, preCompile;
        preCompile = function(code) {
          return code;
        };
        pluginManager.register({
          id: 'some-test',
          selector: ['source.invalid'],
          preCompile: preCompile
        });
        language = pluginManager.languages['source.invalid'];
        expect(language.preCompilers[0]).toBe(preCompile);
        expect(language.compilers[0]).toBeUndefined();
        return expect(language.postCompilers[0]).toBeUndefined();
      });
      it("should use the same function for multiple languages", function() {
        var language, language2, preCompile;
        preCompile = function(code) {
          return code;
        };
        pluginManager.register({
          id: 'some-test',
          selector: ['source.invalid', 'source.valid'],
          preCompile: preCompile
        });
        language = pluginManager.languages['source.invalid'];
        expect(language.preCompilers[0]).toBe(preCompile);
        language2 = pluginManager.languages['source.valid'];
        return expect(language2.preCompilers[0]).toBe(preCompile);
      });
      it("should warn when package is already activated", function() {
        pluginManager.register(coffeeProvider);
        spyOn(console, 'warn');
        pluginManager.register(coffeeProvider);
        return expect(console.warn).toHaveBeenCalled();
      });
      return it("should pushed to plugins array", function() {
        pluginManager.register(coffeeProvider);
        return expect(pluginManager.plugins[0]).toBe(coffeeProvider);
      });
    });
    describe("unregister", function() {
      it("should not unregister a non-registered plugin", function() {
        var somePlugin;
        somePlugin = {
          id: 'some-plugin',
          selector: ['source.invalid'],
          preCompile: function(code) {
            return code;
          }
        };
        pluginManager.register(coffeeProvider);
        expect(pluginManager.plugins.length).toBe(1);
        expect(pluginManager.languages['source.coffee']).toBeDefined();
        pluginManager.unregister(somePlugin);
        expect(pluginManager.plugins.length).toBe(1);
        return expect(pluginManager.languages['source.coffee']).toBeDefined();
      });
      return it("should unregister correctly", function() {
        var language;
        pluginManager.register(coffeeProvider);
        expect(pluginManager.plugins.length).toBe(1);
        expect(pluginManager.languages['source.coffee']).toBeDefined();
        pluginManager.unregister(coffeeProvider);
        expect(pluginManager.plugins.length).toBe(0);
        language = pluginManager.languages['source.coffee'];
        expect(language.preCompilers.length).toBe(0);
        expect(language.compilers.length).toBe(0);
        return expect(language.postCompilers.length).toBe(0);
      });
    });
    describe("getLanguageByScope", function() {
      beforeEach(function() {
        return pluginManager.register(coffeeProvider);
      });
      it("should get language scope", function() {
        var output;
        output = pluginManager.getLanguageByScope("source.coffee");
        return expect(output).toBeDefined();
      });
      return it("should not get anything", function() {
        var output;
        output = pluginManager.getLanguageByScope("source.css");
        return expect(output).toBeUndefined();
      });
    });
    describe("isScopeSupported", function() {
      beforeEach(function() {
        return pluginManager.register(coffeeProvider);
      });
      it("should get language scope", function() {
        var output;
        output = pluginManager.isScopeSupported("source.coffee");
        return expect(output).toBe(true);
      });
      return it("should not get anything", function() {
        var output;
        output = pluginManager.isScopeSupported("source.css");
        return expect(output).toBe(false);
      });
    });
    describe("isPlainText", function() {
      it("should return true", function() {
        expect(pluginManager.isPlainText('text.plain.null-grammar')).toBe(true);
        return expect(pluginManager.isPlainText('other.null-grammar')).toBe(true);
      });
      return it("should return false", function() {
        return expect(pluginManager.isPlainText('source.coffee')).toBe(false);
      });
    });
    return describe("isEditorLanguageSupported", function() {
      var createFakeEditor;
      createFakeEditor = function(scopeName) {
        return {
          getGrammar: function() {
            return {
              scopeName: scopeName
            };
          }
        };
      };
      beforeEach(function() {
        return pluginManager.register(coffeeProvider);
      });
      it("should be supported for plain text preview", function() {
        var fakeEditor;
        fakeEditor = createFakeEditor('text.plain');
        return expect(pluginManager.isEditorLanguageSupported(fakeEditor)).toBe(true);
      });
      it("should not be supported for plain text compile", function() {
        var fakeEditor;
        fakeEditor = createFakeEditor('text.plain');
        return expect(pluginManager.isEditorLanguageSupported(fakeEditor, true)).toBe(false);
      });
      it("should be supported for coffee preview", function() {
        var fakeEditor;
        fakeEditor = createFakeEditor('source.coffee');
        return expect(pluginManager.isEditorLanguageSupported(fakeEditor)).toBe(true);
      });
      return it("should be supported for coffee compile", function() {
        var fakeEditor;
        fakeEditor = createFakeEditor('source.coffee');
        return expect(pluginManager.isEditorLanguageSupported(fakeEditor, true)).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9zcGVjL3BsdWdpbi1tYW5hZ2VyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsdUJBQVIsQ0FBaEIsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGtDQUFSLENBRGpCLENBQUE7O0FBQUEsRUFFQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFGRCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUVULE1BQUEsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUF0QixHQUErQixDQUEvQixDQUFBO2FBQ0EsYUFBYSxDQUFDLFNBQWQsR0FBMEIsR0FIakI7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBS0EsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLE1BQUEsRUFBQSxDQUFHLHNEQUFILEVBQTJELFNBQUEsR0FBQTtBQUN6RCxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxhQUFhLENBQUMsUUFBZCxDQUF1QixjQUF2QixDQUFULENBQUE7ZUFFQSxNQUFBLENBQU8sTUFBQSxZQUFrQixVQUF6QixDQUFvQyxDQUFDLElBQXJDLENBQTBDLElBQTFDLEVBSHlEO01BQUEsQ0FBM0QsQ0FBQSxDQUFBO0FBQUEsTUFLQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQSxHQUFBO0FBQzdDLFlBQUEsMENBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxTQUFDLElBQUQsR0FBQTtBQUFVLGlCQUFPLElBQVAsQ0FBVjtRQUFBLENBQWIsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxHQUFVLFNBQUMsSUFBRCxHQUFBO0FBQVUsaUJBQU8sSUFBUCxDQUFWO1FBQUEsQ0FEVixDQUFBO0FBQUEsUUFFQSxXQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFBVSxpQkFBTyxJQUFQLENBQVY7UUFBQSxDQUZkLENBQUE7QUFBQSxRQUlBLGFBQWEsQ0FBQyxRQUFkLENBQ0U7QUFBQSxVQUFBLEVBQUEsRUFBSSxXQUFKO0FBQUEsVUFDQSxRQUFBLEVBQVUsQ0FBQyxnQkFBRCxDQURWO0FBQUEsVUFFQSxVQUFBLEVBQVksVUFGWjtBQUFBLFVBR0EsT0FBQSxFQUFTLE9BSFQ7QUFBQSxVQUlBLFdBQUEsRUFBYSxXQUpiO1NBREYsQ0FKQSxDQUFBO0FBQUEsUUFXQSxRQUFBLEdBQVcsYUFBYSxDQUFDLFNBQVUsQ0FBQSxnQkFBQSxDQVhuQyxDQUFBO0FBQUEsUUFZQSxNQUFBLENBQU8sUUFBUSxDQUFDLFlBQWEsQ0FBQSxDQUFBLENBQTdCLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsVUFBdEMsQ0FaQSxDQUFBO0FBQUEsUUFhQSxNQUFBLENBQU8sUUFBUSxDQUFDLFNBQVUsQ0FBQSxDQUFBLENBQTFCLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsT0FBbkMsQ0FiQSxDQUFBO2VBY0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxhQUFjLENBQUEsQ0FBQSxDQUE5QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLFdBQXZDLEVBZjZDO01BQUEsQ0FBL0MsQ0FMQSxDQUFBO0FBQUEsTUFzQkEsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxZQUFBLG9CQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFBVSxpQkFBTyxJQUFQLENBQVY7UUFBQSxDQUFiLENBQUE7QUFBQSxRQUVBLGFBQWEsQ0FBQyxRQUFkLENBQ0U7QUFBQSxVQUFBLEVBQUEsRUFBSSxXQUFKO0FBQUEsVUFDQSxRQUFBLEVBQVUsQ0FBQyxnQkFBRCxDQURWO0FBQUEsVUFFQSxVQUFBLEVBQVksVUFGWjtTQURGLENBRkEsQ0FBQTtBQUFBLFFBT0EsUUFBQSxHQUFXLGFBQWEsQ0FBQyxTQUFVLENBQUEsZ0JBQUEsQ0FQbkMsQ0FBQTtBQUFBLFFBUUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxZQUFhLENBQUEsQ0FBQSxDQUE3QixDQUFnQyxDQUFDLElBQWpDLENBQXNDLFVBQXRDLENBUkEsQ0FBQTtBQUFBLFFBU0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxTQUFVLENBQUEsQ0FBQSxDQUExQixDQUE2QixDQUFDLGFBQTlCLENBQUEsQ0FUQSxDQUFBO2VBVUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxhQUFjLENBQUEsQ0FBQSxDQUE5QixDQUFpQyxDQUFDLGFBQWxDLENBQUEsRUFYaUQ7TUFBQSxDQUFuRCxDQXRCQSxDQUFBO0FBQUEsTUFtQ0EsRUFBQSxDQUFHLHFEQUFILEVBQTBELFNBQUEsR0FBQTtBQUN4RCxZQUFBLCtCQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFBVSxpQkFBTyxJQUFQLENBQVY7UUFBQSxDQUFiLENBQUE7QUFBQSxRQUVBLGFBQWEsQ0FBQyxRQUFkLENBQ0U7QUFBQSxVQUFBLEVBQUEsRUFBSSxXQUFKO0FBQUEsVUFDQSxRQUFBLEVBQVUsQ0FBQyxnQkFBRCxFQUFtQixjQUFuQixDQURWO0FBQUEsVUFFQSxVQUFBLEVBQVksVUFGWjtTQURGLENBRkEsQ0FBQTtBQUFBLFFBT0EsUUFBQSxHQUFXLGFBQWEsQ0FBQyxTQUFVLENBQUEsZ0JBQUEsQ0FQbkMsQ0FBQTtBQUFBLFFBUUEsTUFBQSxDQUFPLFFBQVEsQ0FBQyxZQUFhLENBQUEsQ0FBQSxDQUE3QixDQUFnQyxDQUFDLElBQWpDLENBQXNDLFVBQXRDLENBUkEsQ0FBQTtBQUFBLFFBVUEsU0FBQSxHQUFZLGFBQWEsQ0FBQyxTQUFVLENBQUEsY0FBQSxDQVZwQyxDQUFBO2VBV0EsTUFBQSxDQUFPLFNBQVMsQ0FBQyxZQUFhLENBQUEsQ0FBQSxDQUE5QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLFVBQXZDLEVBWndEO01BQUEsQ0FBMUQsQ0FuQ0EsQ0FBQTtBQUFBLE1BaURBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsUUFBQSxhQUFhLENBQUMsUUFBZCxDQUF1QixjQUF2QixDQUFBLENBQUE7QUFBQSxRQUVBLEtBQUEsQ0FBTSxPQUFOLEVBQWUsTUFBZixDQUZBLENBQUE7QUFBQSxRQUlBLGFBQWEsQ0FBQyxRQUFkLENBQXVCLGNBQXZCLENBSkEsQ0FBQTtlQU1BLE1BQUEsQ0FBTyxPQUFPLENBQUMsSUFBZixDQUFvQixDQUFDLGdCQUFyQixDQUFBLEVBUGtEO01BQUEsQ0FBcEQsQ0FqREEsQ0FBQTthQTBEQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLFFBQUEsYUFBYSxDQUFDLFFBQWQsQ0FBdUIsY0FBdkIsQ0FBQSxDQUFBO2VBRUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUE3QixDQUFnQyxDQUFDLElBQWpDLENBQXNDLGNBQXRDLEVBSG1DO01BQUEsQ0FBckMsRUEzRG1CO0lBQUEsQ0FBckIsQ0FMQSxDQUFBO0FBQUEsSUFxRUEsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLE1BQUEsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtBQUNsRCxZQUFBLFVBQUE7QUFBQSxRQUFBLFVBQUEsR0FDRTtBQUFBLFVBQUEsRUFBQSxFQUFJLGFBQUo7QUFBQSxVQUNBLFFBQUEsRUFBVSxDQUFDLGdCQUFELENBRFY7QUFBQSxVQUVBLFVBQUEsRUFBWSxTQUFDLElBQUQsR0FBQTtBQUFVLG1CQUFPLElBQVAsQ0FBVjtVQUFBLENBRlo7U0FERixDQUFBO0FBQUEsUUFLQSxhQUFhLENBQUMsUUFBZCxDQUF1QixjQUF2QixDQUxBLENBQUE7QUFBQSxRQU9BLE1BQUEsQ0FBTyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQTdCLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsQ0FBMUMsQ0FQQSxDQUFBO0FBQUEsUUFRQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVUsQ0FBQSxlQUFBLENBQS9CLENBQWdELENBQUMsV0FBakQsQ0FBQSxDQVJBLENBQUE7QUFBQSxRQVVBLGFBQWEsQ0FBQyxVQUFkLENBQXlCLFVBQXpCLENBVkEsQ0FBQTtBQUFBLFFBWUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBN0IsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxDQUExQyxDQVpBLENBQUE7ZUFhQSxNQUFBLENBQU8sYUFBYSxDQUFDLFNBQVUsQ0FBQSxlQUFBLENBQS9CLENBQWdELENBQUMsV0FBakQsQ0FBQSxFQWRrRDtNQUFBLENBQXBELENBQUEsQ0FBQTthQWdCQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFlBQUEsUUFBQTtBQUFBLFFBQUEsYUFBYSxDQUFDLFFBQWQsQ0FBdUIsY0FBdkIsQ0FBQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUE3QixDQUFvQyxDQUFDLElBQXJDLENBQTBDLENBQTFDLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxTQUFVLENBQUEsZUFBQSxDQUEvQixDQUFnRCxDQUFDLFdBQWpELENBQUEsQ0FIQSxDQUFBO0FBQUEsUUFLQSxhQUFhLENBQUMsVUFBZCxDQUF5QixjQUF6QixDQUxBLENBQUE7QUFBQSxRQU9BLE1BQUEsQ0FBTyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQTdCLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsQ0FBMUMsQ0FQQSxDQUFBO0FBQUEsUUFTQSxRQUFBLEdBQVcsYUFBYSxDQUFDLFNBQVUsQ0FBQSxlQUFBLENBVG5DLENBQUE7QUFBQSxRQVVBLE1BQUEsQ0FBTyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQTdCLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsQ0FBMUMsQ0FWQSxDQUFBO0FBQUEsUUFXQSxNQUFBLENBQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUExQixDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQXZDLENBWEEsQ0FBQTtlQVlBLE1BQUEsQ0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQTlCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBM0MsRUFiZ0M7TUFBQSxDQUFsQyxFQWpCcUI7SUFBQSxDQUF2QixDQXJFQSxDQUFBO0FBQUEsSUFxR0EsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxhQUFhLENBQUMsUUFBZCxDQUF1QixjQUF2QixFQURTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUdBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsWUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsYUFBYSxDQUFDLGtCQUFkLENBQWlDLGVBQWpDLENBQVQsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxXQUFmLENBQUEsRUFGOEI7TUFBQSxDQUFoQyxDQUhBLENBQUE7YUFPQSxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLGFBQWEsQ0FBQyxrQkFBZCxDQUFpQyxZQUFqQyxDQUFULENBQUE7ZUFDQSxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsYUFBZixDQUFBLEVBRjRCO01BQUEsQ0FBOUIsRUFSNkI7SUFBQSxDQUEvQixDQXJHQSxDQUFBO0FBQUEsSUFpSEEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxhQUFhLENBQUMsUUFBZCxDQUF1QixjQUF2QixFQURTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUdBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsWUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsYUFBYSxDQUFDLGdCQUFkLENBQStCLGVBQS9CLENBQVQsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxJQUFmLENBQW9CLElBQXBCLEVBRjhCO01BQUEsQ0FBaEMsQ0FIQSxDQUFBO2FBT0EsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUEsR0FBQTtBQUM1QixZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxhQUFhLENBQUMsZ0JBQWQsQ0FBK0IsWUFBL0IsQ0FBVCxDQUFBO2VBQ0EsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLElBQWYsQ0FBb0IsS0FBcEIsRUFGNEI7TUFBQSxDQUE5QixFQVIyQjtJQUFBLENBQTdCLENBakhBLENBQUE7QUFBQSxJQTZIQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsTUFBQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxXQUFkLENBQTBCLHlCQUExQixDQUFQLENBQTRELENBQUMsSUFBN0QsQ0FBa0UsSUFBbEUsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxXQUFkLENBQTBCLG9CQUExQixDQUFQLENBQXVELENBQUMsSUFBeEQsQ0FBNkQsSUFBN0QsRUFGdUI7TUFBQSxDQUF6QixDQUFBLENBQUE7YUFJQSxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO2VBQ3hCLE1BQUEsQ0FBTyxhQUFhLENBQUMsV0FBZCxDQUEwQixlQUExQixDQUFQLENBQWtELENBQUMsSUFBbkQsQ0FBd0QsS0FBeEQsRUFEd0I7TUFBQSxDQUExQixFQUxzQjtJQUFBLENBQXhCLENBN0hBLENBQUE7V0FxSUEsUUFBQSxDQUFTLDJCQUFULEVBQXNDLFNBQUEsR0FBQTtBQUNwQyxVQUFBLGdCQUFBO0FBQUEsTUFBQSxnQkFBQSxHQUFtQixTQUFDLFNBQUQsR0FBQTtlQUNqQjtBQUFBLFVBQUEsVUFBQSxFQUFZLFNBQUEsR0FBQTttQkFBRztBQUFBLGNBQUMsV0FBQSxTQUFEO2NBQUg7VUFBQSxDQUFaO1VBRGlCO01BQUEsQ0FBbkIsQ0FBQTtBQUFBLE1BR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGFBQWEsQ0FBQyxRQUFkLENBQXVCLGNBQXZCLEVBRFM7TUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLE1BTUEsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxZQUFBLFVBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxnQkFBQSxDQUFpQixZQUFqQixDQUFiLENBQUE7ZUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLHlCQUFkLENBQXdDLFVBQXhDLENBQVAsQ0FBMkQsQ0FBQyxJQUE1RCxDQUFpRSxJQUFqRSxFQUgrQztNQUFBLENBQWpELENBTkEsQ0FBQTtBQUFBLE1BV0EsRUFBQSxDQUFHLGdEQUFILEVBQXFELFNBQUEsR0FBQTtBQUNuRCxZQUFBLFVBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxnQkFBQSxDQUFpQixZQUFqQixDQUFiLENBQUE7ZUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLHlCQUFkLENBQXdDLFVBQXhDLEVBQW9ELElBQXBELENBQVAsQ0FBaUUsQ0FBQyxJQUFsRSxDQUF1RSxLQUF2RSxFQUhtRDtNQUFBLENBQXJELENBWEEsQ0FBQTtBQUFBLE1BZ0JBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsWUFBQSxVQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsZ0JBQUEsQ0FBaUIsZUFBakIsQ0FBYixDQUFBO2VBRUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyx5QkFBZCxDQUF3QyxVQUF4QyxDQUFQLENBQTJELENBQUMsSUFBNUQsQ0FBaUUsSUFBakUsRUFIMkM7TUFBQSxDQUE3QyxDQWhCQSxDQUFBO2FBcUJBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsWUFBQSxVQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsZ0JBQUEsQ0FBaUIsZUFBakIsQ0FBYixDQUFBO2VBRUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyx5QkFBZCxDQUF3QyxVQUF4QyxFQUFvRCxJQUFwRCxDQUFQLENBQWlFLENBQUMsSUFBbEUsQ0FBdUUsSUFBdkUsRUFIMkM7TUFBQSxDQUE3QyxFQXRCb0M7SUFBQSxDQUF0QyxFQXRJd0I7RUFBQSxDQUExQixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/spec/plugin-manager-spec.coffee
