(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, scope, softTabs, tabLength, _ref, _ref1;

  scope = ['source.sql'];

  tabLength = (_ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.tabLength', {
    scope: scope
  }) : void 0) != null ? _ref : 4;

  softTabs = (_ref1 = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.softTabs', {
    scope: scope
  }) : void 0) != null ? _ref1 : true;

  defaultIndentSize = (softTabs ? tabLength : 1);

  defaultIndentChar = (softTabs ? " " : "\t");

  defaultIndentWithTabs = !softTabs;

  module.exports = {
    name: "SQL",
    namespace: "sql",

    /*
    Supported Grammars
     */
    grammars: ["SQL (Rails)", "SQL"],

    /*
    Supported extensions
     */
    extensions: ["sql"],
    options: {
      indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indentation size/length"
      },
      keywords: {
        type: 'string',
        "default": "upper",
        description: "Change case of keywords",
        "enum": ["lower", "upper", "capitalize"]
      },
      identifiers: {
        type: 'string',
        "default": "lower",
        description: "Change case of identifiers",
        "enum": ["lower", "upper", "capitalize"]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvc3FsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxvR0FBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxDQUFDLFlBQUQsQ0FBUixDQUFBOztBQUFBLEVBQ0EsU0FBQTs7Z0NBQWlFLENBRGpFLENBQUE7O0FBQUEsRUFFQSxRQUFBOztpQ0FBK0QsSUFGL0QsQ0FBQTs7QUFBQSxFQUdBLGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixTQUFqQixHQUFnQyxDQUFqQyxDQUhwQixDQUFBOztBQUFBLEVBSUEsaUJBQUEsR0FBb0IsQ0FBSSxRQUFILEdBQWlCLEdBQWpCLEdBQTBCLElBQTNCLENBSnBCLENBQUE7O0FBQUEsRUFLQSxxQkFBQSxHQUF3QixDQUFBLFFBTHhCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBRWYsSUFBQSxFQUFNLEtBRlM7QUFBQSxJQUdmLFNBQUEsRUFBVyxLQUhJO0FBS2Y7QUFBQTs7T0FMZTtBQUFBLElBUWYsUUFBQSxFQUFVLENBQ1IsYUFEUSxFQUVSLEtBRlEsQ0FSSztBQWFmO0FBQUE7O09BYmU7QUFBQSxJQWdCZixVQUFBLEVBQVksQ0FDVixLQURVLENBaEJHO0FBQUEsSUFvQmYsT0FBQSxFQUVFO0FBQUEsTUFBQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsaUJBRFQ7QUFBQSxRQUVBLE9BQUEsRUFBUyxDQUZUO0FBQUEsUUFHQSxXQUFBLEVBQWEseUJBSGI7T0FERjtBQUFBLE1BS0EsUUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLE9BRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSx5QkFGYjtBQUFBLFFBR0EsTUFBQSxFQUFNLENBQUMsT0FBRCxFQUFTLE9BQVQsRUFBaUIsWUFBakIsQ0FITjtPQU5GO0FBQUEsTUFVQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsT0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDRCQUZiO0FBQUEsUUFHQSxNQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVMsT0FBVCxFQUFpQixZQUFqQixDQUhOO09BWEY7S0F0QmE7R0FQakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/languages/sql.coffee
