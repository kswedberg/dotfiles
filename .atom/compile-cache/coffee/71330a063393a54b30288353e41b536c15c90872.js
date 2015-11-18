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

    PullBranchListView.prototype.parseData = function() {
      var branches, currentBranch, items;
      this.currentBranchString = '== Current ==';
      currentBranch = {
        name: this.currentBranchString
      };
      items = this.data.split("\n");
      branches = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item.replace(/\s/g, '')
        };
      });
      if (branches.length === 1) {
        this.pull(branches[0]);
      } else {
        this.setItems([currentBranch].concat(branches));
      }
      return this.focusFilterEditor();
    };

    PullBranchListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      if (name === this.currentBranchString) {
        this.pull();
      } else {
        this.pull(name.substring(name.indexOf('/') + 1));
      }
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
        args: ['pull'].concat(this.extraArgs, this.remote, remoteBranch).filter(function(arg) {
          return arg !== '';
        }),
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcHVsbC1icmFuY2gtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnRkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQURwQixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBSGpCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUdRO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGlDQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEVBQWdCLE1BQWhCLEVBQXlCLFNBQXpCLEVBQXFDLE9BQXJDLEdBQUE7QUFBaUQsTUFBaEQsSUFBQyxDQUFBLE9BQUEsSUFBK0MsQ0FBQTtBQUFBLE1BQXpDLElBQUMsQ0FBQSxPQUFBLElBQXdDLENBQUE7QUFBQSxNQUFsQyxJQUFDLENBQUEsU0FBQSxNQUFpQyxDQUFBO0FBQUEsTUFBekIsSUFBQyxDQUFBLFlBQUEsU0FBd0IsQ0FBQTtBQUFBLE1BQWIsSUFBQyxDQUFBLFVBQUEsT0FBWSxDQUFBO2FBQUEsb0RBQUEsU0FBQSxFQUFqRDtJQUFBLENBQVosQ0FBQTs7QUFBQSxpQ0FFQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSw4QkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLG1CQUFELEdBQXVCLGVBQXZCLENBQUE7QUFBQSxNQUNBLGFBQUEsR0FDRTtBQUFBLFFBQUEsSUFBQSxF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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/pull-branch-list-view.coffee
