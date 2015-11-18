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

    JSBeautify.prototype.name = "CSScomb";

    JSBeautify.prototype.options = {
      _: {
        configPath: true,
        predefinedConfig: true
      },
      CSS: true,
      LESS: true,
      Sass: true,
      SCSS: true
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CSON, Comb, comb, config, expandHomeDir, processedCSS, project, syntax, _ref;
        Comb = require('csscomb');
        expandHomeDir = require('expand-home-dir');
        CSON = require('season');
        config = null;
        try {
          project = (_ref = atom.project.getDirectories()) != null ? _ref[0] : void 0;
          try {
            config = CSON.readFileSync(project != null ? project.resolve('.csscomb.cson') : void 0);
          } catch (_error) {
            config = require(project != null ? project.resolve('.csscomb.json') : void 0);
          }
        } catch (_error) {
          try {
            config = CSON.readFileSync(expandHomeDir(options.configPath));
          } catch (_error) {
            config = Comb.getConfig(options.predefinedConfig);
          }
        }
        comb = new Comb(config);
        syntax = "css";
        switch (language) {
          case "LESS":
            syntax = "less";
            break;
          case "SCSS":
            syntax = "scss";
            break;
          case "Sass":
            syntax = "sass";
        }
        processedCSS = comb.processString(text, {
          syntax: syntax
        });
        return resolve(processedCSS);
      });
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9jc3Njb21iLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLElBQUEsR0FBTSxTQUFOLENBQUE7O0FBQUEseUJBRUEsT0FBQSxHQUFTO0FBQUEsTUFFUCxDQUFBLEVBQ0U7QUFBQSxRQUFBLFVBQUEsRUFBWSxJQUFaO0FBQUEsUUFDQSxnQkFBQSxFQUFrQixJQURsQjtPQUhLO0FBQUEsTUFLUCxHQUFBLEVBQUssSUFMRTtBQUFBLE1BTVAsSUFBQSxFQUFNLElBTkM7QUFBQSxNQU9QLElBQUEsRUFBTSxJQVBDO0FBQUEsTUFRUCxJQUFBLEVBQU0sSUFSQztLQUZULENBQUE7O0FBQUEseUJBYUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUlsQixZQUFBLDRFQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FBUCxDQUFBO0FBQUEsUUFDQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQkFBUixDQURoQixDQUFBO0FBQUEsUUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FGUCxDQUFBO0FBQUEsUUFJQSxNQUFBLEdBQVMsSUFKVCxDQUFBO0FBS0E7QUFDRSxVQUFBLE9BQUEsd0RBQXlDLENBQUEsQ0FBQSxVQUF6QyxDQUFBO0FBQ0E7QUFDRSxZQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsWUFBTCxtQkFBa0IsT0FBTyxDQUFFLE9BQVQsQ0FBaUIsZUFBakIsVUFBbEIsQ0FBVCxDQURGO1dBQUEsY0FBQTtBQUdFLFlBQUEsTUFBQSxHQUFTLE9BQUEsbUJBQVEsT0FBTyxDQUFFLE9BQVQsQ0FBaUIsZUFBakIsVUFBUixDQUFULENBSEY7V0FGRjtTQUFBLGNBQUE7QUFPRTtBQUNFLFlBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxZQUFMLENBQWtCLGFBQUEsQ0FBYyxPQUFPLENBQUMsVUFBdEIsQ0FBbEIsQ0FBVCxDQURGO1dBQUEsY0FBQTtBQUlFLFlBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBTyxDQUFDLGdCQUF2QixDQUFULENBSkY7V0FQRjtTQUxBO0FBQUEsUUFtQkEsSUFBQSxHQUFXLElBQUEsSUFBQSxDQUFLLE1BQUwsQ0FuQlgsQ0FBQTtBQUFBLFFBc0JBLE1BQUEsR0FBUyxLQXRCVCxDQUFBO0FBdUJBLGdCQUFPLFFBQVA7QUFBQSxlQUNPLE1BRFA7QUFFSSxZQUFBLE1BQUEsR0FBUyxNQUFULENBRko7QUFDTztBQURQLGVBR08sTUFIUDtBQUlJLFlBQUEsTUFBQSxHQUFTLE1BQVQsQ0FKSjtBQUdPO0FBSFAsZUFLTyxNQUxQO0FBTUksWUFBQSxNQUFBLEdBQVMsTUFBVCxDQU5KO0FBQUEsU0F2QkE7QUFBQSxRQStCQSxZQUFBLEdBQWUsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsSUFBbkIsRUFBeUI7QUFBQSxVQUN0QyxNQUFBLEVBQVEsTUFEOEI7U0FBekIsQ0EvQmYsQ0FBQTtlQW9DQSxPQUFBLENBQVEsWUFBUixFQXhDa0I7TUFBQSxDQUFULENBQVgsQ0FEUTtJQUFBLENBYlYsQ0FBQTs7c0JBQUE7O0tBRHdDLFdBSDFDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/csscomb.coffee
