(function() {
  var FRONT_MATTER_REGEX, FrontMatter, os, yaml;

  os = require("os");

  yaml = require("js-yaml");

  FRONT_MATTER_REGEX = /^(?:---\s*$)?([^:]+:[\s\S]*?)^---\s*$/m;

  module.exports = FrontMatter = (function() {
    function FrontMatter(editor) {
      this.editor = editor;
      this.content = {};
      this.leadingFence = true;
      this.isEmpty = true;
      this.parseError = null;
      this._findFrontMatter((function(_this) {
        return function(match) {
          var error;
          try {
            _this.content = yaml.safeLoad(match.match[1].trim());
            _this.leadingFence = match.matchText.startsWith("---");
            return _this.isEmpty = false;
          } catch (_error) {
            error = _error;
            _this.parseError = error;
            return atom.confirm({
              message: "[Markdown Writer] Error!",
              detailedMessage: "Invalid Front Matter:\n" + error.message,
              buttons: ['OK']
            });
          }
        };
      })(this));
    }

    FrontMatter.prototype._findFrontMatter = function(onMatch) {
      return this.editor.buffer.scan(FRONT_MATTER_REGEX, onMatch);
    };

    FrontMatter.prototype.normalizeField = function(field) {
      if (!this.content[field]) {
        return this.content[field] = [];
      } else if (typeof this.content[field] === "string") {
        return this.content[field] = [this.content[field]];
      } else {
        return this.content[field];
      }
    };

    FrontMatter.prototype.has = function(field) {
      return this.content[field] != null;
    };

    FrontMatter.prototype.get = function(field) {
      return this.content[field];
    };

    FrontMatter.prototype.set = function(field, content) {
      return this.content[field] = content;
    };

    FrontMatter.prototype.setIfExists = function(field, content) {
      if (this.has(field)) {
        return this.content[field] = content;
      }
    };

    FrontMatter.prototype.getContentText = function() {
      var text;
      text = yaml.safeDump(this.content);
      if (this.leadingFence) {
        return ["---", "" + text + "---", ""].join(os.EOL);
      } else {
        return ["" + text + "---", ""].join(os.EOL);
      }
    };

    FrontMatter.prototype.save = function() {
      return this._findFrontMatter((function(_this) {
        return function(match) {
          return match.replace(_this.getContentText());
        };
      })(this));
    };

    return FrontMatter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2hlbHBlcnMvZnJvbnQtbWF0dGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5Q0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0Esa0JBQUEsR0FBcUIsd0NBSHJCLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBQyxNQUFELEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBRFgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFGaEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUhYLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFKZCxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ2hCLGNBQUEsS0FBQTtBQUFBO0FBQ0UsWUFBQSxLQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBSyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFmLENBQUEsQ0FBZCxDQUFYLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxZQUFELEdBQWdCLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBaEIsQ0FBMkIsS0FBM0IsQ0FEaEIsQ0FBQTttQkFFQSxLQUFDLENBQUEsT0FBRCxHQUFXLE1BSGI7V0FBQSxjQUFBO0FBS0UsWUFESSxjQUNKLENBQUE7QUFBQSxZQUFBLEtBQUMsQ0FBQSxVQUFELEdBQWMsS0FBZCxDQUFBO21CQUNBLElBQUksQ0FBQyxPQUFMLENBQ0U7QUFBQSxjQUFBLE9BQUEsRUFBUywwQkFBVDtBQUFBLGNBQ0EsZUFBQSxFQUFrQix5QkFBQSxHQUF5QixLQUFLLENBQUMsT0FEakQ7QUFBQSxjQUVBLE9BQUEsRUFBUyxDQUFDLElBQUQsQ0FGVDthQURGLEVBTkY7V0FEZ0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQixDQVBBLENBRFc7SUFBQSxDQUFiOztBQUFBLDBCQW9CQSxnQkFBQSxHQUFrQixTQUFDLE9BQUQsR0FBQTthQUNoQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFmLENBQW9CLGtCQUFwQixFQUF3QyxPQUF4QyxFQURnQjtJQUFBLENBcEJsQixDQUFBOztBQUFBLDBCQXdCQSxjQUFBLEdBQWdCLFNBQUMsS0FBRCxHQUFBO0FBQ2QsTUFBQSxJQUFHLENBQUEsSUFBRSxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQWI7ZUFDRSxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FBVCxHQUFrQixHQURwQjtPQUFBLE1BRUssSUFBRyxNQUFBLENBQUEsSUFBUSxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQWhCLEtBQTBCLFFBQTdCO2VBQ0gsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQVQsR0FBa0IsQ0FBQyxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsQ0FBVixFQURmO09BQUEsTUFBQTtlQUdILElBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQSxFQUhOO09BSFM7SUFBQSxDQXhCaEIsQ0FBQTs7QUFBQSwwQkFnQ0EsR0FBQSxHQUFLLFNBQUMsS0FBRCxHQUFBO2FBQVcsNEJBQVg7SUFBQSxDQWhDTCxDQUFBOztBQUFBLDBCQWtDQSxHQUFBLEdBQUssU0FBQyxLQUFELEdBQUE7YUFBVyxJQUFDLENBQUEsT0FBUSxDQUFBLEtBQUEsRUFBcEI7SUFBQSxDQWxDTCxDQUFBOztBQUFBLDBCQW9DQSxHQUFBLEdBQUssU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO2FBQW9CLElBQUMsQ0FBQSxPQUFRLENBQUEsS0FBQSxDQUFULEdBQWtCLFFBQXRDO0lBQUEsQ0FwQ0wsQ0FBQTs7QUFBQSwwQkFzQ0EsV0FBQSxHQUFhLFNBQUMsS0FBRCxFQUFRLE9BQVIsR0FBQTtBQUNYLE1BQUEsSUFBNkIsSUFBQyxDQUFBLEdBQUQsQ0FBSyxLQUFMLENBQTdCO2VBQUEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxLQUFBLENBQVQsR0FBa0IsUUFBbEI7T0FEVztJQUFBLENBdENiLENBQUE7O0FBQUEsMEJBeUNBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFDLENBQUEsT0FBZixDQUFQLENBQUE7QUFDQSxNQUFBLElBQUcsSUFBQyxDQUFBLFlBQUo7ZUFDRSxDQUFDLEtBQUQsRUFBUSxFQUFBLEdBQUcsSUFBSCxHQUFRLEtBQWhCLEVBQXNCLEVBQXRCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsRUFBRSxDQUFDLEdBQWxDLEVBREY7T0FBQSxNQUFBO2VBR0UsQ0FBQyxFQUFBLEdBQUcsSUFBSCxHQUFRLEtBQVQsRUFBZSxFQUFmLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsRUFBRSxDQUFDLEdBQTNCLEVBSEY7T0FGYztJQUFBLENBekNoQixDQUFBOztBQUFBLDBCQWdEQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQ0osSUFBQyxDQUFBLGdCQUFELENBQWtCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFBVyxLQUFLLENBQUMsT0FBTixDQUFjLEtBQUMsQ0FBQSxjQUFELENBQUEsQ0FBZCxFQUFYO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEIsRUFESTtJQUFBLENBaEROLENBQUE7O3VCQUFBOztNQWRGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/helpers/front-matter.coffee
