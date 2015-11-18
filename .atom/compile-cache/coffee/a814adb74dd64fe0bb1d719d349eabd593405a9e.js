(function() {
  "use strict";
  var Beautifier, CoffeeFmt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = CoffeeFmt = (function(_super) {
    __extends(CoffeeFmt, _super);

    function CoffeeFmt() {
      return CoffeeFmt.__super__.constructor.apply(this, arguments);
    }

    CoffeeFmt.prototype.name = "coffee-fmt";

    CoffeeFmt.prototype.options = {
      CoffeeScript: {
        tab: [
          "indent_size", "indent_char", "indent_with_tabs", function(indentSize, indentChar, indentWithTabs) {
            if (indentWithTabs) {
              return "\t";
            }
            return Array(indentSize + 1).join(indentChar);
          }
        ]
      }
    };

    CoffeeFmt.prototype.beautify = function(text, language, options) {
      this.verbose('beautify', language, options);
      return new this.Promise(function(resolve, reject) {
        var e, fmt, results;
        options.newLine = "\n";
        fmt = require('coffee-fmt');
        try {
          results = fmt.format(text, options);
          return resolve(results);
        } catch (_error) {
          e = _error;
          return reject(e);
        }
      });
    };

    return CoffeeFmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9jb2ZmZWUtZm10LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLHFCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsZ0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHdCQUFBLElBQUEsR0FBTSxZQUFOLENBQUE7O0FBQUEsd0JBRUEsT0FBQSxHQUFTO0FBQUEsTUFFUCxZQUFBLEVBQ0U7QUFBQSxRQUFBLEdBQUEsRUFBSztVQUFDLGFBQUQsRUFDSCxhQURHLEVBQ1ksa0JBRFosRUFFSCxTQUFDLFVBQUQsRUFBYSxVQUFiLEVBQXlCLGNBQXpCLEdBQUE7QUFDRSxZQUFBLElBQWUsY0FBZjtBQUFBLHFCQUFPLElBQVAsQ0FBQTthQUFBO21CQUNBLEtBQUEsQ0FBTSxVQUFBLEdBQVcsQ0FBakIsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixVQUF6QixFQUZGO1VBQUEsQ0FGRztTQUFMO09BSEs7S0FGVCxDQUFBOztBQUFBLHdCQWFBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsVUFBVCxFQUFxQixRQUFyQixFQUErQixPQUEvQixDQUFBLENBQUE7QUFDQSxhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFFbEIsWUFBQSxlQUFBO0FBQUEsUUFBQSxPQUFPLENBQUMsT0FBUixHQUFrQixJQUFsQixDQUFBO0FBQUEsUUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFlBQVIsQ0FGTixDQUFBO0FBSUE7QUFDRSxVQUFBLE9BQUEsR0FBVSxHQUFHLENBQUMsTUFBSixDQUFXLElBQVgsRUFBaUIsT0FBakIsQ0FBVixDQUFBO2lCQUVBLE9BQUEsQ0FBUSxPQUFSLEVBSEY7U0FBQSxjQUFBO0FBS0UsVUFESSxVQUNKLENBQUE7aUJBQUEsTUFBQSxDQUFPLENBQVAsRUFMRjtTQU5rQjtNQUFBLENBQVQsQ0FBWCxDQUZRO0lBQUEsQ0FiVixDQUFBOztxQkFBQTs7S0FEdUMsV0FIekMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/coffee-fmt.coffee
