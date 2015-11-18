(function() {
  "use strict";
  var Beautifier, TypeScriptFormatter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = TypeScriptFormatter = (function(_super) {
    __extends(TypeScriptFormatter, _super);

    function TypeScriptFormatter() {
      return TypeScriptFormatter.__super__.constructor.apply(this, arguments);
    }

    TypeScriptFormatter.prototype.name = "TypeScript Formatter";

    TypeScriptFormatter.prototype.options = {
      TypeScript: true
    };

    TypeScriptFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var e, format, formatterUtils, opts, result;
          format = require("typescript-formatter/lib/formatter");
          formatterUtils = require("typescript-formatter/lib/utils");
          opts = formatterUtils.createDefaultFormatCodeOptions();
          opts.TabSize = options.tab_width || options.indent_size;
          opts.IndentSize = options.indent_size;
          opts.IndentStyle = 'space';
          opts.convertTabsToSpaces = true;
          _this.verbose('typescript', text, opts);
          try {
            result = format(text, opts);
            _this.verbose(result);
            return resolve(result);
          } catch (_error) {
            e = _error;
            return reject(e);
          }
        };
      })(this));
    };

    return TypeScriptFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy90eXBlc2NyaXB0LWZvcm1hdHRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSwrQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLDBDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxrQ0FBQSxJQUFBLEdBQU0sc0JBQU4sQ0FBQTs7QUFBQSxrQ0FDQSxPQUFBLEdBQVM7QUFBQSxNQUNQLFVBQUEsRUFBWSxJQURMO0tBRFQsQ0FBQTs7QUFBQSxrQ0FLQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUVsQixjQUFBLHVDQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLG9DQUFSLENBQVQsQ0FBQTtBQUFBLFVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsZ0NBQVIsQ0FEakIsQ0FBQTtBQUFBLFVBR0EsSUFBQSxHQUFPLGNBQWMsQ0FBQyw4QkFBZixDQUFBLENBSFAsQ0FBQTtBQUFBLFVBSUEsSUFBSSxDQUFDLE9BQUwsR0FBZSxPQUFPLENBQUMsU0FBUixJQUFxQixPQUFPLENBQUMsV0FKNUMsQ0FBQTtBQUFBLFVBS0EsSUFBSSxDQUFDLFVBQUwsR0FBa0IsT0FBTyxDQUFDLFdBTDFCLENBQUE7QUFBQSxVQU1BLElBQUksQ0FBQyxXQUFMLEdBQW1CLE9BTm5CLENBQUE7QUFBQSxVQU9BLElBQUksQ0FBQyxtQkFBTCxHQUEyQixJQVAzQixDQUFBO0FBQUEsVUFRQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0IsQ0FSQSxDQUFBO0FBU0E7QUFDRSxZQUFBLE1BQUEsR0FBUyxNQUFBLENBQU8sSUFBUCxFQUFhLElBQWIsQ0FBVCxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLE1BQVQsQ0FEQSxDQUFBO21CQUVBLE9BQUEsQ0FBUSxNQUFSLEVBSEY7V0FBQSxjQUFBO0FBS0UsWUFESSxVQUNKLENBQUE7QUFBQSxtQkFBTyxNQUFBLENBQU8sQ0FBUCxDQUFQLENBTEY7V0FYa0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFULENBQVgsQ0FEUTtJQUFBLENBTFYsQ0FBQTs7K0JBQUE7O0tBRGlELFdBSG5ELENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/typescript-formatter.coffee
