(function() {
  "use strict";
  var Beautifier, TidyMarkdown,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = TidyMarkdown = (function(_super) {
    __extends(TidyMarkdown, _super);

    function TidyMarkdown() {
      return TidyMarkdown.__super__.constructor.apply(this, arguments);
    }

    TidyMarkdown.prototype.name = "Tidy Markdown";

    TidyMarkdown.prototype.options = {
      Markdown: false
    };

    TidyMarkdown.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, tidyMarkdown;
        tidyMarkdown = require('tidy-markdown');
        cleanMarkdown = tidyMarkdown(text);
        return resolve(cleanMarkdown);
      });
    };

    return TidyMarkdown;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy90aWR5LW1hcmtkb3duLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsbUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDJCQUFBLElBQUEsR0FBTSxlQUFOLENBQUE7O0FBQUEsMkJBQ0EsT0FBQSxHQUFTO0FBQUEsTUFDUCxRQUFBLEVBQVUsS0FESDtLQURULENBQUE7O0FBQUEsMkJBS0EsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNsQixZQUFBLDJCQUFBO0FBQUEsUUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVIsQ0FBZixDQUFBO0FBQUEsUUFDQSxhQUFBLEdBQWdCLFlBQUEsQ0FBYSxJQUFiLENBRGhCLENBQUE7ZUFFQSxPQUFBLENBQVEsYUFBUixFQUhrQjtNQUFBLENBQVQsQ0FBWCxDQURRO0lBQUEsQ0FMVixDQUFBOzt3QkFBQTs7S0FEMEMsV0FINUMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/tidy-markdown.coffee
