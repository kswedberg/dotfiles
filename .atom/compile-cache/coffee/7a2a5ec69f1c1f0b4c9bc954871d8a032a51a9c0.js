(function() {
  "use strict";
  var Beautifier, JSBeautify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(_super) {
    __extends(JSBeautify, _super);

    function JSBeautify() {
      return JSBeautify.__super__.constructor.apply(this, arguments);
    }

    JSBeautify.prototype.name = "JS Beautify";

    JSBeautify.prototype.options = {
      HTML: true,
      XML: true,
      Handlebars: true,
      Mustache: true,
      Marko: true,
      JavaScript: true,
      JSON: true,
      CSS: {
        indent_size: true,
        indent_char: true,
        selector_separator_newline: true,
        newline_between_rules: true,
        preserve_newlines: true,
        wrap_line_length: true
      }
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      this.verbose("JS Beautify language " + language);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var beautifyCSS, beautifyHTML, beautifyJS, err;
          try {
            switch (language) {
              case "JSON":
              case "JavaScript":
                beautifyJS = require("js-beautify");
                text = beautifyJS(text, options);
                return resolve(text);
              case "Handlebars":
              case "Mustache":
                options.indent_handlebars = true;
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                return resolve(text);
              case "HTML (Liquid)":
              case "HTML":
              case "XML":
              case "Marko":
              case "Web Form/Control (C#)":
              case "Web Handler (C#)":
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                _this.debug("Beautified HTML: " + text);
                return resolve(text);
              case "CSS":
                beautifyCSS = require("js-beautify").css;
                text = beautifyCSS(text, options);
                return resolve(text);
            }
          } catch (_error) {
            err = _error;
            _this.error("JS Beautify error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9qcy1iZWF1dGlmeS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxJQUFBLEdBQU0sYUFBTixDQUFBOztBQUFBLHlCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsSUFBQSxFQUFNLElBREM7QUFBQSxNQUVQLEdBQUEsRUFBSyxJQUZFO0FBQUEsTUFHUCxVQUFBLEVBQVksSUFITDtBQUFBLE1BSVAsUUFBQSxFQUFVLElBSkg7QUFBQSxNQUtQLEtBQUEsRUFBTyxJQUxBO0FBQUEsTUFNUCxVQUFBLEVBQVksSUFOTDtBQUFBLE1BT1AsSUFBQSxFQUFNLElBUEM7QUFBQSxNQVFQLEdBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLElBQWI7QUFBQSxRQUNBLFdBQUEsRUFBYSxJQURiO0FBQUEsUUFFQSwwQkFBQSxFQUE0QixJQUY1QjtBQUFBLFFBR0EscUJBQUEsRUFBdUIsSUFIdkI7QUFBQSxRQUlBLGlCQUFBLEVBQW1CLElBSm5CO0FBQUEsUUFLQSxnQkFBQSxFQUFrQixJQUxsQjtPQVRLO0tBRlQsQ0FBQTs7QUFBQSx5QkFtQkEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBVSx1QkFBQSxHQUF1QixRQUFqQyxDQUFBLENBQUE7QUFDQSxhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ2xCLGNBQUEsMENBQUE7QUFBQTtBQUNFLG9CQUFPLFFBQVA7QUFBQSxtQkFDTyxNQURQO0FBQUEsbUJBQ2UsWUFEZjtBQUVJLGdCQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUixDQUFiLENBQUE7QUFBQSxnQkFDQSxJQUFBLEdBQU8sVUFBQSxDQUFXLElBQVgsRUFBaUIsT0FBakIsQ0FEUCxDQUFBO3VCQUVBLE9BQUEsQ0FBUSxJQUFSLEVBSko7QUFBQSxtQkFLTyxZQUxQO0FBQUEsbUJBS3FCLFVBTHJCO0FBT0ksZ0JBQUEsT0FBTyxDQUFDLGlCQUFSLEdBQTRCLElBQTVCLENBQUE7QUFBQSxnQkFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQyxJQUZ0QyxDQUFBO0FBQUEsZ0JBR0EsSUFBQSxHQUFPLFlBQUEsQ0FBYSxJQUFiLEVBQW1CLE9BQW5CLENBSFAsQ0FBQTt1QkFJQSxPQUFBLENBQVEsSUFBUixFQVhKO0FBQUEsbUJBWU8sZUFaUDtBQUFBLG1CQVl3QixNQVp4QjtBQUFBLG1CQVlnQyxLQVpoQztBQUFBLG1CQVl1QyxPQVp2QztBQUFBLG1CQVlnRCx1QkFaaEQ7QUFBQSxtQkFZeUUsa0JBWnpFO0FBYUksZ0JBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUMsSUFBdEMsQ0FBQTtBQUFBLGdCQUNBLElBQUEsR0FBTyxZQUFBLENBQWEsSUFBYixFQUFtQixPQUFuQixDQURQLENBQUE7QUFBQSxnQkFFQSxLQUFDLENBQUEsS0FBRCxDQUFRLG1CQUFBLEdBQW1CLElBQTNCLENBRkEsQ0FBQTt1QkFHQSxPQUFBLENBQVEsSUFBUixFQWhCSjtBQUFBLG1CQWlCTyxLQWpCUDtBQWtCSSxnQkFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQyxHQUFyQyxDQUFBO0FBQUEsZ0JBQ0EsSUFBQSxHQUFPLFdBQUEsQ0FBWSxJQUFaLEVBQWtCLE9BQWxCLENBRFAsQ0FBQTt1QkFFQSxPQUFBLENBQVEsSUFBUixFQXBCSjtBQUFBLGFBREY7V0FBQSxjQUFBO0FBdUJFLFlBREksWUFDSixDQUFBO0FBQUEsWUFBQSxLQUFDLENBQUEsS0FBRCxDQUFRLHFCQUFBLEdBQXFCLEdBQTdCLENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sR0FBUCxFQXhCRjtXQURrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQsQ0FBWCxDQUZRO0lBQUEsQ0FuQlYsQ0FBQTs7c0JBQUE7O0tBRHdDLFdBSDFDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/js-beautify.coffee
