(function() {
  var cjsx_transform, coffee, configManager;

  coffee = require('coffee-script');

  configManager = require('../config-manager');

  cjsx_transform = null;

  module.exports = {
    id: 'coffee-compile',
    selector: ['source.coffee', 'source.coffee.jsx', 'source.litcoffee', 'text.plain', 'text.plain.null-grammar'],
    compiledScope: 'source.js',
    preCompile: function(code, editor) {
      if (configManager.get('compileCjsx')) {
        if (!cjsx_transform) {
          cjsx_transform = require('coffee-react-transform');
        }
        code = cjsx_transform(code);
      }
      return code;
    },
    compile: function(code, editor) {
      var bare, literate;
      literate = editor.getGrammar().scopeName === "source.litcoffee";
      bare = configManager.get('noTopLevelFunctionWrapper');
      if (bare == null) {
        bare = true;
      }
      return coffee.compile(code, {
        bare: bare,
        literate: literate
      });
    },
    postCompile: function(code, editor) {
      return code;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9saWIvcHJvdmlkZXJzL2NvZmZlZS1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQWlCLE9BQUEsQ0FBUSxlQUFSLENBQWpCLENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQURqQixDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixJQUZqQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsRUFBQSxFQUFJLGdCQUFKO0FBQUEsSUFDQSxRQUFBLEVBQVUsQ0FDUixlQURRLEVBRVIsbUJBRlEsRUFHUixrQkFIUSxFQUlSLFlBSlEsRUFLUix5QkFMUSxDQURWO0FBQUEsSUFRQSxhQUFBLEVBQWUsV0FSZjtBQUFBLElBU0EsVUFBQSxFQUFZLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUNWLE1BQUEsSUFBRyxhQUFhLENBQUMsR0FBZCxDQUFrQixhQUFsQixDQUFIO0FBQ0UsUUFBQSxJQUFBLENBQUEsY0FBQTtBQUNFLFVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FBakIsQ0FERjtTQUFBO0FBQUEsUUFHQSxJQUFBLEdBQU8sY0FBQSxDQUFlLElBQWYsQ0FIUCxDQURGO09BQUE7QUFNQSxhQUFPLElBQVAsQ0FQVTtJQUFBLENBVFo7QUFBQSxJQWtCQSxPQUFBLEVBQVMsU0FBQyxJQUFELEVBQU8sTUFBUCxHQUFBO0FBQ1AsVUFBQSxjQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXBCLEtBQWlDLGtCQUE1QyxDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQVEsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsMkJBQWxCLENBRlIsQ0FBQTs7UUFHQSxPQUFRO09BSFI7QUFLQSxhQUFPLE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZixFQUFxQjtBQUFBLFFBQUMsTUFBQSxJQUFEO0FBQUEsUUFBTyxVQUFBLFFBQVA7T0FBckIsQ0FBUCxDQU5PO0lBQUEsQ0FsQlQ7QUFBQSxJQTBCQSxXQUFBLEVBQWEsU0FBQyxJQUFELEVBQU8sTUFBUCxHQUFBO0FBQ1gsYUFBTyxJQUFQLENBRFc7SUFBQSxDQTFCYjtHQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/lib/providers/coffee-provider.coffee
