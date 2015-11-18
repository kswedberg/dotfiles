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
      if (!remote) {
        return git.cmd(['branch', '-D', branch], {
          cwd: this.repo.getWorkingDirectory()
        }).then(function(data) {
          return notifier.addSuccess(data);
        });
      } else {
        return git.cmd(['push', remote, '--delete', branch], {
          cwd: this.repo.getWorkingDirectory()
        })["catch"](function(data) {
          return notifier.addSuccess(data);
        });
      }
    };

    return DeleteBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvZGVsZXRlLWJyYW5jaC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUZqQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFUTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxtQ0FBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsSUFBVCxFQUFlLElBQWYsR0FBQTtBQUFrQyxNQUFqQyxJQUFDLENBQUEsT0FBQSxJQUFnQyxDQUFBO0FBQUEsTUFBMUIsSUFBQyxDQUFBLE9BQUEsSUFBeUIsQ0FBQTtBQUFBLE1BQWxCLElBQUMsQ0FBQSwyQkFBRixPQUFZLElBQVYsUUFBaUIsQ0FBQTthQUFBLHNEQUFBLFNBQUEsRUFBbEM7SUFBQSxDQUFaLENBQUE7O0FBQUEsbUNBRUEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsVUFBQSxvQkFBQTtBQUFBLE1BRFcsT0FBRCxLQUFDLElBQ1gsQ0FBQTtBQUFBLE1BQUEsSUFBd0IsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBeEI7QUFBQSxRQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQVgsQ0FBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxJQUFRLENBQUEsUUFBUjtBQUNFLFFBQUEsSUFBQyxDQUFBLFFBQUEsQ0FBRCxDQUFRLElBQVIsQ0FBQSxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQUEsR0FBb0IsQ0FBbkMsQ0FBVCxDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBYixDQUFsQixDQURULENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxRQUFBLENBQUQsQ0FBUSxNQUFSLEVBQWdCLE1BQWhCLENBRkEsQ0FIRjtPQURBO2FBT0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQVJTO0lBQUEsQ0FGWCxDQUFBOztBQUFBLG1DQVlBLFNBQUEsR0FBUSxTQUFDLE1BQUQsRUFBUyxNQUFULEdBQUE7QUFDTixNQUFBLElBQUEsQ0FBQSxNQUFBO2VBQ0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsRUFBVyxJQUFYLEVBQWlCLE1BQWpCLENBQVIsRUFBa0M7QUFBQSxVQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtTQUFsQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO2lCQUFVLFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCLEVBQVY7UUFBQSxDQUROLEVBREY7T0FBQSxNQUFBO2VBSUUsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLFVBQWpCLEVBQTZCLE1BQTdCLENBQVIsRUFBOEM7QUFBQSxVQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtTQUE5QyxDQUNBLENBQUMsT0FBRCxDQURBLENBQ08sU0FBQyxJQUFELEdBQUE7aUJBQVUsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsSUFBcEIsRUFBVjtRQUFBLENBRFAsRUFKRjtPQURNO0lBQUEsQ0FaUixDQUFBOztnQ0FBQTs7S0FEaUMsZUFOckMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/delete-branch-view.coffee
