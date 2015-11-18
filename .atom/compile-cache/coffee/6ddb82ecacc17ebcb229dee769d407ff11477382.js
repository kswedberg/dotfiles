(function() {
  "use strict";
  var Beautifier, Checker, JSCSFixer, checker, cliConfig,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  Checker = null;

  cliConfig = null;

  checker = null;

  module.exports = JSCSFixer = (function(_super) {
    __extends(JSCSFixer, _super);

    function JSCSFixer() {
      return JSCSFixer.__super__.constructor.apply(this, arguments);
    }

    JSCSFixer.prototype.name = "JSCS Fixer";

    JSCSFixer.prototype.options = {
      JavaScript: false
    };

    JSCSFixer.prototype.beautify = function(text, language, options) {
      this.verbose("JSCS Fixer language " + language);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var config, editor, err, path, result;
          try {
            if (checker == null) {
              cliConfig = require('jscs/lib/cli-config');
              Checker = require('jscs');
              checker = new Checker();
              checker.registerDefaultRules();
            }
            editor = atom.workspace.getActiveTextEditor();
            path = editor != null ? editor.getPath() : void 0;
            config = path != null ? cliConfig.load(void 0, atom.project.relativizePath(path)[0]) : void 0;
            if (config == null) {
              throw new Error("No JSCS config found.");
            }
            checker.configure(config);
            result = checker.fixString(text, path);
            if (result.errors.getErrorCount() > 0) {
              _this.error(result.errors.getErrorList().reduce(function(res, err) {
                return "" + res + "<br> Line " + err.line + ": " + err.message;
              }, "JSCS Fixer error:"));
            }
            return resolve(result.output);
          } catch (_error) {
            err = _error;
            _this.error("JSCS Fixer error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSCSFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9qc2NzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLGtEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxJQUpaLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsSUFMVixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsZ0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHdCQUFBLElBQUEsR0FBTSxZQUFOLENBQUE7O0FBQUEsd0JBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxVQUFBLEVBQVksS0FETDtLQUZULENBQUE7O0FBQUEsd0JBTUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBVSxzQkFBQSxHQUFzQixRQUFoQyxDQUFBLENBQUE7QUFDQSxhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ2xCLGNBQUEsaUNBQUE7QUFBQTtBQUNFLFlBQUEsSUFBSSxlQUFKO0FBQ0UsY0FBQSxTQUFBLEdBQVksT0FBQSxDQUFRLHFCQUFSLENBQVosQ0FBQTtBQUFBLGNBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxNQUFSLENBRFYsQ0FBQTtBQUFBLGNBRUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFBLENBRmQsQ0FBQTtBQUFBLGNBR0EsT0FBTyxDQUFDLG9CQUFSLENBQUEsQ0FIQSxDQURGO2FBQUE7QUFBQSxZQUtBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FMVCxDQUFBO0FBQUEsWUFNQSxJQUFBLEdBQVUsY0FBSCxHQUFnQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQWhCLEdBQXNDLE1BTjdDLENBQUE7QUFBQSxZQU9BLE1BQUEsR0FBWSxZQUFILEdBQWMsU0FBUyxDQUFDLElBQVYsQ0FBZSxNQUFmLEVBQTBCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixJQUE1QixDQUFrQyxDQUFBLENBQUEsQ0FBNUQsQ0FBZCxHQUFtRixNQVA1RixDQUFBO0FBUUEsWUFBQSxJQUFJLGNBQUo7QUFDRSxvQkFBVSxJQUFBLEtBQUEsQ0FBTSx1QkFBTixDQUFWLENBREY7YUFSQTtBQUFBLFlBVUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsTUFBbEIsQ0FWQSxDQUFBO0FBQUEsWUFXQSxNQUFBLEdBQVMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEIsQ0FYVCxDQUFBO0FBWUEsWUFBQSxJQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBZCxDQUFBLENBQUEsR0FBZ0MsQ0FBbkM7QUFDRSxjQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFkLENBQUEsQ0FBNEIsQ0FBQyxNQUE3QixDQUFvQyxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7dUJBQ3pDLEVBQUEsR0FBRyxHQUFILEdBQU8sWUFBUCxHQUFtQixHQUFHLENBQUMsSUFBdkIsR0FBNEIsSUFBNUIsR0FBZ0MsR0FBRyxDQUFDLFFBREs7Y0FBQSxDQUFwQyxFQUVMLG1CQUZLLENBQVAsQ0FBQSxDQURGO2FBWkE7bUJBaUJBLE9BQUEsQ0FBUSxNQUFNLENBQUMsTUFBZixFQWxCRjtXQUFBLGNBQUE7QUFxQkUsWUFESSxZQUNKLENBQUE7QUFBQSxZQUFBLEtBQUMsQ0FBQSxLQUFELENBQVEsb0JBQUEsR0FBb0IsR0FBNUIsQ0FBQSxDQUFBO21CQUNBLE1BQUEsQ0FBTyxHQUFQLEVBdEJGO1dBRGtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVCxDQUFYLENBRlE7SUFBQSxDQU5WLENBQUE7O3FCQUFBOztLQUR1QyxXQVB6QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/jscs.coffee
