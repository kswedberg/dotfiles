(function() {
  var Linter, LinterTidy, linterPath,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  LinterTidy = (function(_super) {
    __extends(LinterTidy, _super);

    LinterTidy.syntax = ['text.html.basic'];

    LinterTidy.prototype.cmd = 'tidy -quiet -utf8';

    LinterTidy.prototype.executablePath = null;

    LinterTidy.prototype.linterName = 'tidy';

    LinterTidy.prototype.errorStream = 'stderr';

    LinterTidy.prototype.regex = 'line (?<line>\\d+) column (?<col>\\d+) - ((?<error>Error)|(?<warning>Warning)): (?<message>.+)';

    function LinterTidy(editor) {
      LinterTidy.__super__.constructor.call(this, editor);
      this.executablePathListener = atom.config.observe('linter-tidy.tidyExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-tidy.tidyExecutablePath');
        };
      })(this));
    }

    LinterTidy.prototype.destroy = function() {
      return this.executablePathListener.dispose();
    };

    return LinterTidy;

  })(Linter);

  module.exports = LinterTidy;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXItdGlkeS9saWIvbGludGVyLXRpZHkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLElBQXRELENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLEVBQUEsR0FBRyxVQUFILEdBQWMsYUFBdEIsQ0FEVCxDQUFBOztBQUFBLEVBR007QUFHSixpQ0FBQSxDQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE1BQUQsR0FBUyxDQUFDLGlCQUFELENBQVQsQ0FBQTs7QUFBQSx5QkFJQSxHQUFBLEdBQUssbUJBSkwsQ0FBQTs7QUFBQSx5QkFNQSxjQUFBLEdBQWdCLElBTmhCLENBQUE7O0FBQUEseUJBUUEsVUFBQSxHQUFZLE1BUlosQ0FBQTs7QUFBQSx5QkFVQSxXQUFBLEdBQWEsUUFWYixDQUFBOztBQUFBLHlCQWFBLEtBQUEsR0FBTyxnR0FiUCxDQUFBOztBQWVhLElBQUEsb0JBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSw0Q0FBTSxNQUFOLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLHNCQUFELEdBQTBCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixnQ0FBcEIsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDOUUsS0FBQyxDQUFBLGNBQUQsR0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixFQUQ0RDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRELENBRjFCLENBRFc7SUFBQSxDQWZiOztBQUFBLHlCQXFCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLHNCQUFzQixDQUFDLE9BQXhCLENBQUEsRUFETztJQUFBLENBckJULENBQUE7O3NCQUFBOztLQUh1QixPQUh6QixDQUFBOztBQUFBLEVBOEJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBOUJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/linter-tidy/lib/linter-tidy.coffee
