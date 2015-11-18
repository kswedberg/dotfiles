(function() {
  "use strict";
  var Beautifier, PrettyDiff,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PrettyDiff = (function(_super) {
    __extends(PrettyDiff, _super);

    function PrettyDiff() {
      return PrettyDiff.__super__.constructor.apply(this, arguments);
    }

    PrettyDiff.prototype.name = "Pretty Diff";

    PrettyDiff.prototype.options = {
      _: {
        inchar: "indent_char",
        insize: "indent_size",
        objsort: function(objsort) {
          return objsort || false;
        },
        preserve: [
          'preserve_newlines', function(preserve_newlines) {
            if (preserve_newlines === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        cssinsertlines: "newline_between_rules",
        comments: [
          "indent_comments", function(indent_comments) {
            if (indent_comments === false) {
              return "noindent";
            } else {
              return "indent";
            }
          }
        ],
        force: "force_indentation",
        quoteConvert: "convert_quotes",
        vertical: [
          'align_assignments', function(align_assignments) {
            if (align_assignments === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        wrap: "wrap_line_length",
        space: "space_after_anon_function",
        noleadzero: "no_lead_zero",
        endcomma: "end_with_comma",
        methodchain: [
          'break_chained_methods', function(break_chained_methods) {
            if (break_chained_methods === true) {
              return false;
            } else {
              return true;
            }
          }
        ]
      },
      CSV: true,
      ERB: true,
      EJS: true,
      HTML: true,
      XML: true,
      SVG: true,
      Spacebars: true,
      JSX: true,
      JavaScript: true,
      CSS: true,
      SCSS: true,
      Sass: true,
      JSON: true,
      TSS: true,
      Twig: true,
      LESS: true,
      Swig: true,
      Visualforce: true
    };

    PrettyDiff.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var args, lang, output, prettydiff, result, _;
          prettydiff = require("prettydiff");
          _ = require('lodash');
          lang = "auto";
          switch (language) {
            case "CSV":
              lang = "csv";
              break;
            case "EJS":
            case "Twig":
              lang = "ejs";
              break;
            case "ERB":
              lang = "html_ruby";
              break;
            case "Handlebars":
            case "Mustache":
            case "Spacebars":
            case "Swig":
              lang = "handlebars";
              break;
            case "SGML":
              lang = "markup";
              break;
            case "XML":
            case "Visualforce":
            case "SVG":
              lang = "xml";
              break;
            case "HTML":
              lang = "html";
              break;
            case "JavaScript":
              lang = "javascript";
              break;
            case "JSON":
              lang = "json";
              break;
            case "JSX":
              lang = "jsx";
              break;
            case "JSTL":
              lang = "jsp";
              break;
            case "CSS":
              lang = "css";
              break;
            case "LESS":
              lang = "less";
              break;
            case "SCSS":
            case "Sass":
              lang = "scss";
              break;
            case "TSS":
              lang = "tss";
              break;
            default:
              lang = "auto";
          }
          args = {
            source: text,
            lang: lang,
            mode: "beautify"
          };
          _.merge(options, args);
          _this.verbose('prettydiff', options);
          output = prettydiff.api(options);
          result = output[0];
          return resolve(result);
        };
      })(this));
    };

    return PrettyDiff;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9wcmV0dHlkaWZmLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLElBQUEsR0FBTSxhQUFOLENBQUE7O0FBQUEseUJBQ0EsT0FBQSxHQUFTO0FBQUEsTUFFUCxDQUFBLEVBQ0U7QUFBQSxRQUFBLE1BQUEsRUFBUSxhQUFSO0FBQUEsUUFDQSxNQUFBLEVBQVEsYUFEUjtBQUFBLFFBRUEsT0FBQSxFQUFTLFNBQUMsT0FBRCxHQUFBO2lCQUNQLE9BQUEsSUFBVyxNQURKO1FBQUEsQ0FGVDtBQUFBLFFBSUEsUUFBQSxFQUFVO1VBQUMsbUJBQUQsRUFBc0IsU0FBQyxpQkFBRCxHQUFBO0FBQzlCLFlBQUEsSUFBSSxpQkFBQSxLQUFxQixJQUF6QjtxQkFDRSxNQURGO2FBQUEsTUFBQTtxQkFDYSxPQURiO2FBRDhCO1VBQUEsQ0FBdEI7U0FKVjtBQUFBLFFBUUEsY0FBQSxFQUFnQix1QkFSaEI7QUFBQSxRQVNBLFFBQUEsRUFBVTtVQUFDLGlCQUFELEVBQW9CLFNBQUMsZUFBRCxHQUFBO0FBQzVCLFlBQUEsSUFBSSxlQUFBLEtBQW1CLEtBQXZCO3FCQUNFLFdBREY7YUFBQSxNQUFBO3FCQUNrQixTQURsQjthQUQ0QjtVQUFBLENBQXBCO1NBVFY7QUFBQSxRQWFBLEtBQUEsRUFBTyxtQkFiUDtBQUFBLFFBY0EsWUFBQSxFQUFjLGdCQWRkO0FBQUEs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

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/prettydiff.coffee
