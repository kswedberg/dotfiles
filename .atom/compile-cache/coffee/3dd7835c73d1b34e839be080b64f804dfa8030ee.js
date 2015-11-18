(function() {
  var DiffHelper, shellescape, tmp;

  shellescape = require('shell-escape');

  tmp = require('temporary');

  module.exports = DiffHelper = (function() {
    DiffHelper.prototype.defaults = {
      'treeViewSelector': '.tree-view'
    };

    DiffHelper.prototype.myWorkspaceView = null;

    DiffHelper.prototype.baseCommand = 'diff --strip-trailing-cr --label "left" --label "right" -u ';

    function DiffHelper(aWorkspaceView) {
      this.myWorkspaceView = aWorkspaceView;
    }

    DiffHelper.prototype.selectedFiles = function() {
      var treeView;
      treeView = this.myWorkspaceView.find(this.defaults.treeViewSelector).view();
      if (treeView === null) {
        console.error('tree-view not found or already set');
        throw "Error";
      } else {
        return treeView.selectedPaths();
      }
    };

    DiffHelper.prototype.execDiff = function(files, kallback) {
      var cmd, exec;
      cmd = this.buildCommand(files);
      exec = require('child_process').exec;
      return exec(cmd, kallback);
    };

    DiffHelper.prototype.buildCommand = function(files) {
      if (files.length > 2) {
        throw "Error";
      }
      return this.baseCommand + shellescape(files);
    };

    DiffHelper.prototype.createTempFile = function(contents) {
      var tmpfile;
      tmpfile = new tmp.File();
      tmpfile.writeFileSync(contents);
      return tmpfile.path;
    };

    return DiffHelper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxjQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBYyxPQUFBLENBQVEsV0FBUixDQURkLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0oseUJBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxrQkFBQSxFQUFvQixZQUFwQjtLQURGLENBQUE7O0FBQUEseUJBRUEsZUFBQSxHQUFpQixJQUZqQixDQUFBOztBQUFBLHlCQUlBLFdBQUEsR0FBYSw2REFKYixDQUFBOztBQU1hLElBQUEsb0JBQUMsY0FBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsZUFBRCxHQUFtQixjQUFuQixDQURXO0lBQUEsQ0FOYjs7QUFBQSx5QkFTQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxRQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLGVBQWUsQ0FBQyxJQUFqQixDQUFzQixJQUFDLENBQUEsUUFBUSxDQUFDLGdCQUFoQyxDQUFpRCxDQUFDLElBQWxELENBQUEsQ0FBWCxDQUFBO0FBQ0EsTUFBQSxJQUFHLFFBQUEsS0FBWSxJQUFmO0FBQ0UsUUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLG9DQUFkLENBQUEsQ0FBQTtBQUNBLGNBQU0sT0FBTixDQUZGO09BQUEsTUFBQTtlQUlFLFFBQVEsQ0FBQyxhQUFULENBQUEsRUFKRjtPQUZhO0lBQUEsQ0FUZixDQUFBOztBQUFBLHlCQWlCQSxRQUFBLEdBQVUsU0FBQyxLQUFELEVBQVEsUUFBUixHQUFBO0FBQ1IsVUFBQSxTQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU8sSUFBQyxDQUFBLFlBQUQsQ0FBYyxLQUFkLENBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsSUFEaEMsQ0FBQTthQUVBLElBQUEsQ0FBSyxHQUFMLEVBQVUsUUFBVixFQUhRO0lBQUEsQ0FqQlYsQ0FBQTs7QUFBQSx5QkFzQkEsWUFBQSxHQUFjLFNBQUMsS0FBRCxHQUFBO0FBQ1osTUFBQSxJQUFHLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBbEI7QUFDRSxjQUFNLE9BQU4sQ0FERjtPQUFBO2FBR0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxXQUFBLENBQVksS0FBWixFQUpIO0lBQUEsQ0F0QmQsQ0FBQTs7QUFBQSx5QkE0QkEsY0FBQSxHQUFnQixTQUFDLFFBQUQsR0FBQTtBQUNkLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFjLElBQUEsR0FBRyxDQUFDLElBQUosQ0FBQSxDQUFkLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxhQUFSLENBQXNCLFFBQXRCLENBREEsQ0FBQTthQUVBLE9BQU8sQ0FBQyxLQUhNO0lBQUEsQ0E1QmhCLENBQUE7O3NCQUFBOztNQUxKLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/atom-cli-diff/lib/helpers/diff-helper.coffee