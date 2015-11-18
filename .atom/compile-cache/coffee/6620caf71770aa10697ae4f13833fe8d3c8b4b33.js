
/*
Requires http://uncrustify.sourceforge.net/
 */

(function() {
  "use strict";
  var Beautifier, Uncrustify, cfg, expandHomeDir, path, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('../beautifier');

  cfg = require("./cfg");

  path = require("path");

  expandHomeDir = require('expand-home-dir');

  _ = require('lodash');

  module.exports = Uncrustify = (function(_super) {
    __extends(Uncrustify, _super);

    function Uncrustify() {
      return Uncrustify.__super__.constructor.apply(this, arguments);
    }

    Uncrustify.prototype.name = "Uncrustify";

    Uncrustify.prototype.options = {
      C: true,
      "C++": true,
      "C#": true,
      "Objective-C": true,
      D: true,
      Pawn: true,
      Vala: true,
      Java: true,
      Arduino: true
    };

    Uncrustify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var basePath, configPath, editor;
        configPath = options.configPath;
        if (!configPath) {
          return cfg(options, function(error, cPath) {
            if (error) {
              throw error;
            }
            return resolve(cPath);
          });
        } else {
          editor = atom.workspace.getActiveTextEditor();
          if (editor != null) {
            basePath = path.dirname(editor.getPath());
            configPath = path.resolve(basePath, configPath);
            return resolve(configPath);
          } else {
            return reject(new Error("No Uncrustify Config Path set! Please configure Uncrustify with Atom Beautify."));
          }
        }
      }).then((function(_this) {
        return function(configPath) {
          var lang, outputFile;
          configPath = expandHomeDir(configPath);
          lang = "C";
          switch (language) {
            case "C":
              lang = "C";
              break;
            case "C++":
              lang = "CPP";
              break;
            case "C#":
              lang = "CS";
              break;
            case "Objective-C":
            case "Objective-C++":
              lang = "OC+";
              break;
            case "D":
              lang = "D";
              break;
            case "Pawn":
              lang = "PAWN";
              break;
            case "Vala":
              lang = "VALA";
              break;
            case "Java":
              lang = "JAVA";
              break;
            case "Arduino":
              lang = "CPP";
          }
          return _this.run("uncrustify", ["-c", configPath, "-f", _this.tempFile("input", text), "-o", outputFile = _this.tempFile("output", text), "-l", lang], {
            help: {
              link: "http://sourceforge.net/projects/uncrustify/"
            }
          }).then(function() {
            return _this.readFile(outputFile);
          });
        };
      })(this));
    };

    return Uncrustify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy91bmNydXN0aWZ5L2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFHQSxZQUhBLENBQUE7QUFBQSxNQUFBLG1EQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FKYixDQUFBOztBQUFBLEVBS0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBTE4sQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQU5QLENBQUE7O0FBQUEsRUFPQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQkFBUixDQVBoQixDQUFBOztBQUFBLEVBUUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBUkosQ0FBQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxJQUFBLEdBQU0sWUFBTixDQUFBOztBQUFBLHlCQUNBLE9BQUEsR0FBUztBQUFBLE1BQ1AsQ0FBQSxFQUFHLElBREk7QUFBQSxNQUVQLEtBQUEsRUFBTyxJQUZBO0FBQUEsTUFHUCxJQUFBLEVBQU0sSUFIQztBQUFBLE1BSVAsYUFBQSxFQUFlLElBSlI7QUFBQSxNQUtQLENBQUEsRUFBRyxJQUxJO0FBQUEsTUFNUCxJQUFBLEVBQU0sSUFOQztBQUFBLE1BT1AsSUFBQSxFQUFNLElBUEM7QUFBQSxNQVFQLElBQUEsRUFBTSxJQVJDO0FBQUEsTUFTUCxPQUFBLEVBQVMsSUFURjtLQURULENBQUE7O0FBQUEseUJBYUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIs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

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/uncrustify/index.coffee
