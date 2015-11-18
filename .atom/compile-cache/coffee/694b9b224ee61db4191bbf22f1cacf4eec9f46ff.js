(function() {
  var BranchListView, BufferedProcess, OutputViewManager, PullBranchListView, notifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  OutputViewManager = require('../output-view-manager');

  notifier = require('../notifier');

  BranchListView = require('./branch-list-view');

  module.exports = PullBranchListView = (function(_super) {
    __extends(PullBranchListView, _super);

    function PullBranchListView() {
      return PullBranchListView.__super__.constructor.apply(this, arguments);
    }

    PullBranchListView.prototype.initialize = function(repo, data, remote, extraArgs, resolve) {
      this.repo = repo;
      this.data = data;
      this.remote = remote;
      this.extraArgs = extraArgs;
      this.resolve = resolve;
      return PullBranchListView.__super__.initialize.apply(this, arguments);
    };

    PullBranchListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      this.pull(name.substring(name.indexOf('/') + 1));
      return this.cancel();
    };

    PullBranchListView.prototype.pull = function(remoteBranch) {
      var startMessage, view, _ref;
      if (remoteBranch == null) {
        remoteBranch = '';
      }
      view = OutputViewManager["new"]();
      startMessage = notifier.addInfo("Pulling...", {
        dismissable: true
      });
      return new BufferedProcess({
        command: (_ref = atom.config.get('git-plus.gitPath')) != null ? _ref : 'git',
        args: ['pull'].concat(this.extraArgs, this.remote, remoteBranch),
        options: {
          cwd: this.repo.getWorkingDirectory()
        },
        stdout: function(data) {
          return view.addLine(data.toString());
        },
        stderr: function(data) {
          return view.addLine(data.toString());
        },
        exit: (function(_this) {
          return function(code) {
            _this.resolve();
            view.finish();
            return startMessage.dismiss();
          };
        })(this)
      });
    };

    return PullBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcHVsbC1icmFuY2gtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnRkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQURwQixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBSGpCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUdRO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGlDQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEVBQWdCLE1BQWhCLEVBQXlCLFNBQXpCLEVBQXFDLE9BQXJDLEdBQUE7QUFBaUQsTUFBaEQsSUFBQyxDQUFBLE9BQUEsSUFBK0MsQ0FBQTtBQUFBLE1BQXpDLElBQUMsQ0FBQSxPQUFBLElBQXdDLENBQUE7QUFBQSxNQUFsQyxJQUFDLENBQUEsU0FBQSxNQUFpQyxDQUFBO0FBQUEsTUFBekIsSUFBQyxDQUFBLFlBQUEsU0FBd0IsQ0FBQTtBQUFBLE1BQWIsSUFBQyxDQUFBLFVBQUEsT0FBWSxDQUFBO2FBQUEsb0RBQUEsU0FBQSxFQUFqRDtJQUFBLENBQVosQ0FBQTs7QUFBQSxpQ0FFQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxVQUFBLElBQUE7QUFBQSxNQURXLE9BQUQsS0FBQyxJQUNYLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBQSxHQUFvQixDQUFuQyxDQUFOLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFGUztJQUFBLENBRlgsQ0FBQTs7QUFBQSxpQ0FNQSxJQUFBLEdBQU0sU0FBQyxZQUFELEdBQUE7QUFDSixVQUFBLHdCQUFBOztRQURLLGVBQWE7T0FDbEI7QUFBQSxNQUFBLElBQUEsR0FBTyxpQkFBaUIsQ0FBQyxLQUFELENBQWpCLENBQUEsQ0FBUCxDQUFBO0FBQUEsTUFDQSxZQUFBLEdBQWUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsWUFBakIsRUFBK0I7QUFBQSxRQUFBLFdBQUEsRUFBYSxJQUFiO09BQS9CLENBRGYsQ0FBQTthQUVJLElBQUEsZUFBQSxDQUNGO0FBQUEsUUFBQSxPQUFBLGdFQUErQyxLQUEvQztBQUFBLFFBQ0EsSUFBQSxFQUFNLENBQUMsTUFBRCxDQUFRLENBQUMsTUFBVCxDQUFnQixJQUFDLENBQUEsU0FBakIsRUFBNEIsSUFBQyxDQUFBLE1BQTdCLEVBQXFDLFlBQXJDLENBRE47QUFBQSxRQUVBLE9BQUEsRUFDRTtBQUFBLFVBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFMO1NBSEY7QUFBQSxRQUlBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtpQkFBVSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBYixFQUFWO1FBQUEsQ0FKUjtBQUFBLFFBS0EsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2lCQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFiLEVBQVY7UUFBQSxDQUxSO0FBQUEsUUFNQSxJQUFBLEVBQU0sQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLElBQUQsR0FBQTtBQUNKLFlBQUEsS0FBQyxDQUFBLE9BQUQsQ0FBQSxDQUFBLENBQUE7QUFBQSxZQUNBLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FEQSxDQUFBO21CQUVBLFlBQVksQ0FBQyxPQUFiLENBQUEsRUFISTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTk47T0FERSxFQUhBO0lBQUEsQ0FOTixDQUFBOzs4QkFBQTs7S0FEK0IsZUFSbkMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/pull-branch-list-view.coffee
