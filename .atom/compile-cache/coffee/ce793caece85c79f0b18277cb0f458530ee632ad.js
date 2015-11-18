(function() {
  var DiffHelper, DiffView, ScrollView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ScrollView = require('atom').ScrollView;

  DiffHelper = require('./helpers/diff-helper');

  module.exports = DiffView = (function(_super) {
    __extends(DiffView, _super);

    function DiffView() {
      return DiffView.__super__.constructor.apply(this, arguments);
    }

    DiffView.prototype.myWorkspaceView = null;

    DiffView.prototype.diffHelper = null;

    DiffView.content = function() {
      return this.div({
        "class": 'diff-view'
      });
    };

    DiffView.prototype.initialize = function(state) {
      DiffView.__super__.initialize.call(this, state);
      return this.diffHelper = new DiffHelper(atom.workspaceView);
    };

    DiffView.prototype.serialize = function() {};

    DiffView.prototype.destroy = function() {
      return this.detach();
    };

    DiffView.prototype.selected = function() {
      var p, selectedPaths;
      selectedPaths = this.diffHelper.selectedFiles();
      if (selectedPaths.length !== 2) {
        console.error("wrong number of arguments for this command");
        throw "Error";
      }
      return p = this.diffHelper.execDiff(selectedPaths, (function(_this) {
        return function(error, stdout, stderr) {
          if (error !== null) {
            console.log("there was an error " + error);
          }
          return atom.workspaceView.open(_this.diffHelper.createTempFile(stdout));
        };
      })(this));
    };

    return DiffView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSx1QkFBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBR0osK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHVCQUFBLGVBQUEsR0FBaUIsSUFBakIsQ0FBQTs7QUFBQSx1QkFDQSxVQUFBLEdBQVksSUFEWixDQUFBOztBQUFBLElBR0EsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sV0FBUDtPQUFMLEVBRFE7SUFBQSxDQUhWLENBQUE7O0FBQUEsdUJBS0EsVUFBQSxHQUFZLFNBQUMsS0FBRCxHQUFBO0FBQ1YsTUFBQSx5Q0FBTSxLQUFOLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFXLElBQUksQ0FBQyxhQUFoQixFQUZSO0lBQUEsQ0FMWixDQUFBOztBQUFBLHVCQVNBLFNBQUEsR0FBVyxTQUFBLEdBQUEsQ0FUWCxDQUFBOztBQUFBLHVCQVdBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUCxJQUFDLENBQUEsTUFBRCxDQUFBLEVBRE87SUFBQSxDQVhULENBQUE7O0FBQUEsdUJBY0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLFVBQVUsQ0FBQyxhQUFaLENBQUEsQ0FBaEIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxhQUFhLENBQUMsTUFBZCxLQUF3QixDQUEzQjtBQUNFLFFBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyw0Q0FBZCxDQUFBLENBQUE7QUFDQSxjQUFNLE9BQU4sQ0FGRjtPQUZBO2FBTUEsQ0FBQSxHQUFJLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFxQixhQUFyQixFQUFvQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixNQUFoQixHQUFBO0FBQ3BDLFVBQUEsSUFBSSxLQUFBLEtBQVMsSUFBYjtBQUNFLFlBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxxQkFBQSxHQUF3QixLQUFwQyxDQUFBLENBREY7V0FBQTtpQkFFQSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLEtBQUMsQ0FBQSxVQUFVLENBQUMsY0FBWixDQUEyQixNQUEzQixDQUF4QixFQUhvQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDLEVBUEk7SUFBQSxDQWRWLENBQUE7O29CQUFBOztLQUhxQixXQUp2QixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/kswedberg/.atom/packages/atom-cli-diff/lib/diff-view.coffee