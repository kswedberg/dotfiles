
/*
Requires https://github.com/google/yapf
 */

(function() {
  "use strict";
  var Beautifier, Yapf,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = Yapf = (function(_super) {
    __extends(Yapf, _super);

    function Yapf() {
      return Yapf.__super__.constructor.apply(this, arguments);
    }

    Yapf.prototype.name = "yapf";

    Yapf.prototype.options = {
      Python: false
    };

    Yapf.prototype.beautify = function(text, language, options) {
      return this.run("yapf", [["--style=pep8"], this.tempFile("input", text)], {
        help: {
          link: "https://github.com/google/yapf"
        }
      });
    };

    return Yapf;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy95YXBmLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQSxZQUpBLENBQUE7QUFBQSxNQUFBLGdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FMYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFFckIsMkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLG1CQUFBLElBQUEsR0FBTSxNQUFOLENBQUE7O0FBQUEsbUJBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxNQUFBLEVBQVEsS0FERDtLQUZULENBQUE7O0FBQUEsbUJBTUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssTUFBTCxFQUFhLENBQ1gsQ0FBQyxjQUFELENBRFcsRUFFWCxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FGVyxDQUFiLEVBR0s7QUFBQSxRQUFBLElBQUEsRUFBTTtBQUFBLFVBQ1AsSUFBQSxFQUFNLGdDQURDO1NBQU47T0FITCxFQURRO0lBQUEsQ0FOVixDQUFBOztnQkFBQTs7S0FGa0MsV0FQcEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/yapf.coffee
