(function() {
  var DiffHelper, DiffView;

  DiffView = require("./diff-view");

  DiffHelper = require('./helpers/diff-helper');

  module.exports = {
    diffHelper: null,
    diffView: null,
    activate: function(state) {
      atom.commands.add('atom-workspace', 'diff:selected', (function(_this) {
        return function() {
          return _this.selected();
        };
      })(this));
      atom.commands.add('atom-workspace', 'diff:clipboard', (function(_this) {
        return function() {
          return _this.clipboard();
        };
      })(this));
      if (this.diffView !== null && this.diffView.hasParent()) {
        return this.diffView.destroy();
      } else {
        return this.diffView = new DiffView(state);
      }
    },
    deactivate: function() {
      this.diffView.destroy();
      return this.diffHelper = null;
    },
    serialize: function() {
      return {
        diffViewState: this.diffView.serialize()
      };
    },
    selected: function() {
      var p, selectedPaths;
      if (this.diffHelper == null) {
        this.diffHelper = new DiffHelper();
      }
      this.treeView = atom.workspace.getLeftPanels()[0].getItem();
      selectedPaths = this.treeView.selectedPaths();
      if (selectedPaths.length !== 2) {
        console.error("wrong number of arguments for this command");
        throw new Error("wrong number of arguments for this command");
      }
      return p = this.diffHelper.execDiff(selectedPaths, (function(_this) {
        return function(error, stdout, stderr) {
          if (error != null) {
            console.log("there was an error " + error);
          }
          return atom.workspace.open(_this.diffHelper.createTempFile(stdout));
        };
      })(this));
    },
    clipboard: function() {
      var p, selectedPaths;
      if (this.diffHelper == null) {
        this.diffHelper = new DiffHelper();
      }
      selectedPaths = [atom.workspace.getActivePaneItem().getPath(), this.diffHelper.createTempFileFromClipboard(atom.clipboard)];
      if (selectedPaths.length !== 2) {
        console.error("wrong number of arguments for this command");
        throw new Error("Error");
      }
      if ((selectedPaths[0] != null) && (selectedPaths[1] != null)) {
        return p = this.diffHelper.execDiff(selectedPaths, (function(_this) {
          return function(error, stdout, stderr) {
            if (error !== null) {
              console.log("there was an error " + error);
            }
            return atom.workspace.open(_this.diffHelper.createTempFile(stdout));
          };
        })(this));
      } else {
        console.error("either there is no active editor or no clipboard data");
        throw new Error("Error");
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWNsaS1kaWZmL2xpYi9kaWZmLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvQkFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUFYLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHVCQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFVBQUEsRUFBWSxJQUFaO0FBQUEsSUFDQSxRQUFBLEVBQVUsSUFEVjtBQUFBLElBR0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGVBQXBDLEVBQXFELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckQsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGdCQUFwQyxFQUFzRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxTQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRELENBREEsQ0FBQTtBQUdBLE1BQUEsSUFBRyxJQUFDLENBQUEsUUFBRCxLQUFhLElBQWIsSUFBc0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLENBQUEsQ0FBekI7ZUFDRSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBQSxFQURGO09BQUEsTUFBQTtl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

//# sourceURL=/Users/kswedberg/.atom/packages/atom-cli-diff/lib/diff.coffee
