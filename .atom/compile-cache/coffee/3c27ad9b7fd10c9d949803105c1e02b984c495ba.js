(function() {
  var config;

  config = require("../lib/config");

  describe("config", function() {
    it("get default value", function() {
      return expect(config.get("fileExtension")).toEqual(".markdown");
    });
    it("get engine value", function() {
      config.set("siteEngine", "jekyll");
      expect(config.getEngine("codeblock.before")).not.toBeNull();
      expect(config.getEngine("imageTag")).not.toBeDefined();
      config.set("siteEngine", "not-exists");
      return expect(config.getEngine("imageTag")).not.toBeDefined();
    });
    it("get default value from engine or user config", function() {
      config.set("siteEngine", "jekyll");
      expect(config.get("codeblock.before")).toEqual(config.getEngine("codeblock.before"));
      config.set("codeblock.before", "changed");
      return expect(config.get("codeblock.before")).toEqual("changed");
    });
    it("get modified value", function() {
      atom.config.set("markdown-writer.test", "special");
      return expect(config.get("test")).toEqual("special");
    });
    return it("set key and value", function() {
      config.set("test", "value");
      return expect(atom.config.get("markdown-writer.test")).toEqual("value");
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvc3BlYy9jb25maWctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQUFULENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7QUFDakIsSUFBQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO2FBQ3RCLE1BQUEsQ0FBTyxNQUFNLENBQUMsR0FBUCxDQUFXLGVBQVgsQ0FBUCxDQUFtQyxDQUFDLE9BQXBDLENBQTRDLFdBQTVDLEVBRHNCO0lBQUEsQ0FBeEIsQ0FBQSxDQUFBO0FBQUEsSUFHQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLE1BQUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxZQUFYLEVBQXlCLFFBQXpCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxTQUFQLENBQWlCLGtCQUFqQixDQUFQLENBQTRDLENBQUMsR0FBRyxDQUFDLFFBQWpELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLFNBQVAsQ0FBaUIsVUFBakIsQ0FBUCxDQUFvQyxDQUFDLEdBQUcsQ0FBQyxXQUF6QyxDQUFBLENBRkEsQ0FBQTtBQUFBLE1BSUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxZQUFYLEVBQXlCLFlBQXpCLENBSkEsQ0FBQTthQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsU0FBUCxDQUFpQixVQUFqQixDQUFQLENBQW9DLENBQUMsR0FBRyxDQUFDLFdBQXpDLENBQUEsRUFOcUI7SUFBQSxDQUF2QixDQUhBLENBQUE7QUFBQSxJQVdBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBLEdBQUE7QUFDakQsTUFBQSxNQUFNLENBQUMsR0FBUCxDQUFXLFlBQVgsRUFBeUIsUUFBekIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLEdBQVAsQ0FBVyxrQkFBWCxDQUFQLENBQ0UsQ0FBQyxPQURILENBQ1csTUFBTSxDQUFDLFNBQVAsQ0FBaUIsa0JBQWpCLENBRFgsQ0FEQSxDQUFBO0FBQUEsTUFJQSxNQUFNLENBQUMsR0FBUCxDQUFXLGtCQUFYLEVBQStCLFNBQS9CLENBSkEsQ0FBQTthQUtBLE1BQUEsQ0FBTyxNQUFNLENBQUMsR0FBUCxDQUFXLGtCQUFYLENBQVAsQ0FDRSxDQUFDLE9BREgsQ0FDVyxTQURYLEVBTmlEO0lBQUEsQ0FBbkQsQ0FYQSxDQUFBO0FBQUEsSUFvQkEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsU0FBeEMsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxHQUFQLENBQVcsTUFBWCxDQUFQLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsU0FBbkMsRUFGdUI7SUFBQSxDQUF6QixDQXBCQSxDQUFBO1dBd0JBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsTUFBQSxNQUFNLENBQUMsR0FBUCxDQUFXLE1BQVgsRUFBbUIsT0FBbkIsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsQ0FBUCxDQUErQyxDQUFDLE9BQWhELENBQXdELE9BQXhELEVBRnNCO0lBQUEsQ0FBeEIsRUF6QmlCO0VBQUEsQ0FBbkIsQ0FGQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/spec/config-spec.coffee
