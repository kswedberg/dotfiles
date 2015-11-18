(function() {
  "use strict";
  var Beautifier, CoffeeFormatter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = CoffeeFormatter = (function(_super) {
    __extends(CoffeeFormatter, _super);

    function CoffeeFormatter() {
      return CoffeeFormatter.__super__.constructor.apply(this, arguments);
    }

    CoffeeFormatter.prototype.name = "Coffee Formatter";

    CoffeeFormatter.prototype.options = {
      CoffeeScript: true
    };

    CoffeeFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CF, curr, i, len, lines, p, result, resultArr;
        CF = require("coffee-formatter");
        lines = text.split("\n");
        resultArr = [];
        i = 0;
        len = lines.length;
        while (i < len) {
          curr = lines[i];
          p = CF.formatTwoSpaceOperator(curr);
          p = CF.formatOneSpaceOperator(p);
          p = CF.shortenSpaces(p);
          resultArr.push(p);
          i++;
        }
        result = resultArr.join("\n");
        return resolve(result);
      });
    };

    return CoffeeFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9jb2ZmZWUtZm9ybWF0dGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLDJCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFFckIsc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDhCQUFBLElBQUEsR0FBTSxrQkFBTixDQUFBOztBQUFBLDhCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsWUFBQSxFQUFjLElBRFA7S0FGVCxDQUFBOztBQUFBLDhCQU1BLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFFUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFFbEIsWUFBQSw2Q0FBQTtBQUFBLFFBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxrQkFBUixDQUFMLENBQUE7QUFBQSxRQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FEUixDQUFBO0FBQUEsUUFFQSxTQUFBLEdBQVksRUFGWixDQUFBO0FBQUEsUUFHQSxDQUFBLEdBQUksQ0FISixDQUFBO0FBQUEsUUFJQSxHQUFBLEdBQU0sS0FBSyxDQUFDLE1BSlosQ0FBQTtBQU1BLGVBQU0sQ0FBQSxHQUFJLEdBQVYsR0FBQTtBQUNFLFVBQUEsSUFBQSxHQUFPLEtBQU0sQ0FBQSxDQUFBLENBQWIsQ0FBQTtBQUFBLFVBQ0EsQ0FBQSxHQUFJLEVBQUUsQ0FBQyxzQkFBSCxDQUEwQixJQUExQixDQURKLENBQUE7QUFBQSxVQUVBLENBQUEsR0FBSSxFQUFFLENBQUMsc0JBQUgsQ0FBMEIsQ0FBMUIsQ0FGSixDQUFBO0FBQUEsVUFHQSxDQUFBLEdBQUksRUFBRSxDQUFDLGFBQUgsQ0FBaUIsQ0FBakIsQ0FISixDQUFBO0FBQUEsVUFJQSxTQUFTLENBQUMsSUFBVixDQUFlLENBQWYsQ0FKQSxDQUFBO0FBQUEsVUFLQSxDQUFBLEVBTEEsQ0FERjtRQUFBLENBTkE7QUFBQSxRQWFBLE1BQUEsR0FBUyxTQUFTLENBQUMsSUFBVixDQUFlLElBQWYsQ0FiVCxDQUFBO2VBY0EsT0FBQSxDQUFRLE1BQVIsRUFoQmtCO01BQUEsQ0FBVCxDQUFYLENBRlE7SUFBQSxDQU5WLENBQUE7OzJCQUFBOztLQUY2QyxXQUgvQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/coffee-formatter.coffee
