
/*
Requires [perltidy](http://perltidy.sourceforge.net)
 */

(function() {
  "use strict";
  var Beautifier, PerlTidy,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PerlTidy = (function(_super) {
    __extends(PerlTidy, _super);

    function PerlTidy() {
      return PerlTidy.__super__.constructor.apply(this, arguments);
    }

    PerlTidy.prototype.name = "Perltidy";

    PerlTidy.prototype.options = {
      Perl: true
    };

    PerlTidy.prototype.cli = function(options) {
      if (options.perltidy_path == null) {
        return new Error("'Perl Perltidy Path' not set!" + " Please set this in the Atom Beautify package settings.");
      } else {
        return options.perltidy_path;
      }
    };

    PerlTidy.prototype.beautify = function(text, language, options) {
      var _ref;
      return this.run("perltidy", ['--standard-output', '--standard-error-output', '--quiet', ((_ref = options.perltidy_profile) != null ? _ref.length : void 0) ? "--profile=" + options.perltidy_profile : void 0, this.tempFile("input", text)], {
        help: {
          link: "http://perltidy.sourceforge.net/"
        }
      });
    };

    return PerlTidy;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9wZXJsdGlkeS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBR0EsWUFIQSxDQUFBO0FBQUEsTUFBQSxvQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBSmIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx1QkFBQSxJQUFBLEdBQU0sVUFBTixDQUFBOztBQUFBLHVCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsSUFBQSxFQUFNLElBREM7S0FGVCxDQUFBOztBQUFBLHVCQU1BLEdBQUEsR0FBSyxTQUFDLE9BQUQsR0FBQTtBQUNILE1BQUEsSUFBTyw2QkFBUDtBQUNFLGVBQVcsSUFBQSxLQUFBLENBQU0sK0JBQUEsR0FDZix5REFEUyxDQUFYLENBREY7T0FBQSxNQUFBO0FBSUUsZUFBTyxPQUFPLENBQUMsYUFBZixDQUpGO09BREc7SUFBQSxDQU5MLENBQUE7O0FBQUEsdUJBYUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLFVBQUEsSUFBQTthQUFBLElBQUMsQ0FBQSxHQUFELENBQUssVUFBTCxFQUFpQixDQUNmLG1CQURlLEVBRWYseUJBRmUsRUFHZixTQUhlLG1EQUlvRCxDQUFFLGdCQUFyRSxHQUFDLFlBQUEsR0FBWSxPQUFPLENBQUMsZ0JBQXJCLEdBQUEsTUFKZSxFQUtmLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUxlLENBQWpCLEVBTUs7QUFBQSxRQUFBLElBQUEsRUFBTTtBQUFBLFVBQ1AsSUFBQSxFQUFNLGtDQURDO1NBQU47T0FOTCxFQURRO0lBQUEsQ0FiVixDQUFBOztvQkFBQTs7S0FEc0MsV0FOeEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/perltidy.coffee
