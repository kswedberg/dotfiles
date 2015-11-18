(function() {
  var BranchListView, DeleteBranchListView, git, notifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('./branch-list-view');

  module.exports = DeleteBranchListView = (function(_super) {
    __extends(DeleteBranchListView, _super);

    function DeleteBranchListView() {
      return DeleteBranchListView.__super__.constructor.apply(this, arguments);
    }

    DeleteBranchListView.prototype.initialize = function(repo, data, _arg) {
      this.repo = repo;
      this.data = data;
      this.isRemote = (_arg != null ? _arg : {}).isRemote;
      return DeleteBranchListView.__super__.initialize.apply(this, arguments);
    };

    DeleteBranchListView.prototype.confirmed = function(_arg) {
      var branch, name, remote;
      name = _arg.name;
      if (name.startsWith("*")) {
        name = name.slice(1);
      }
      if (!this.isRemote) {
        this["delete"](name);
      } else {
        branch = name.substring(name.indexOf('/') + 1);
        remote = name.substring(0, name.indexOf('/'));
        this["delete"](branch, remote);
      }
      return this.cancel();
    };

    DeleteBranchListView.prototype["delete"] = function(branch, remote) {
      if (remote == null) {
        remote = '';
      }
      if (remote.length === 0) {
        return git.cmd({
          args: ['branch', '-D', branch],
          cwd: this.repo.getWorkingDirectory(),
          stdout: function(data) {
            return notifier.addSuccess(data.toString());
          }
        });
      } else {
        return git.cmd({
          args: ['push', remote, '--delete', branch],
          cwd: this.repo.getWorkingDirectory(),
          stderr: function(data) {
            return notifier.addSuccess(data.toString());
          }
        });
      }
    };

    return DeleteBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvZGVsZXRlLWJyYW5jaC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUZqQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFUTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxtQ0FBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsSUFBVCxFQUFlLElBQWYsR0FBQTtBQUFrQyxNQUFqQyxJQUFDLENBQUEsT0FBQSxJQUFnQyxDQUFBO0FBQUEsTUFBMUIsSUFBQyxDQUFBLE9BQUEsSUFBeUIsQ0FBQTtBQUFBLE1BQWxCLElBQUMsQ0FBQSwyQkFBRixPQUFZLElBQVYsUUFBaUIsQ0FBQTthQUFBLHNEQUFBLFNBQUEsRUFBbEM7SUFBQSxDQUFaLENBQUE7O0FBQUEsbUNBRUEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsVUFBQSxvQkFBQTtBQUFBLE1BRFcsT0FBRCxLQUFDLElBQ1gsQ0FBQTtBQUFBLE1BQUEsSUFBRyxJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixDQUFIO0FBQ0UsUUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYLENBQVAsQ0FERjtPQUFBO0FBR0EsTUFBQSxJQUFBLENBQUEsSUFBUSxDQUFBLFFBQVI7QUFDRSxRQUFBLElBQUMsQ0FBQSxRQUFBLENBQUQsQ0FBUSxJQUFSLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBYixDQUFBLEdBQW9CLENBQW5DLENBQVQsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZixFQUFrQixJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBbEIsQ0FEVCxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsUUFBQSxDQUFELENBQVEsTUFBUixFQUFnQixNQUFoQixDQUZBLENBSEY7T0FIQTthQVVBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFYUztJQUFBLENBRlgsQ0FBQTs7QUFBQSxtQ0FlQSxTQUFBLEdBQVEsU0FBQyxNQUFELEVBQVMsTUFBVCxHQUFBOztRQUFTLFNBQVM7T0FDeEI7QUFBQSxNQUFBLElBQUcsTUFBTSxDQUFDLE1BQVAsS0FBaUIsQ0FBcEI7ZUFDRSxHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sQ0FBQyxRQUFELEVBQVcsSUFBWCxFQUFpQixNQUFqQixDQUFOO0FBQUEsVUFDQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBREw7QUFBQSxVQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTttQkFBVSxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFJLENBQUMsUUFBTCxDQUFBLENBQXBCLEVBQVY7VUFBQSxDQUZSO1NBREYsRUFERjtPQUFBLE1BQUE7ZUFNRSxHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixVQUFqQixFQUE2QixNQUE3QixDQUFOO0FBQUEsVUFDQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBREw7QUFBQSxVQUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTttQkFBVSxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFJLENBQUMsUUFBTCxDQUFBLENBQXBCLEVBQVY7VUFBQSxDQUZSO1NBREYsRUFORjtPQURNO0lBQUEsQ0FmUixDQUFBOztnQ0FBQTs7S0FEaUMsZUFOckMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/delete-branch-view.coffee
