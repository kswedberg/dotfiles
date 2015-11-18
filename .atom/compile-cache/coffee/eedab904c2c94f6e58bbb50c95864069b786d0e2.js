(function() {
  var $$, BufferedProcess, ListView, OutputViewManager, PullBranchListView, SelectListView, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  PullBranchListView = require('./pull-branch-list-view');

  module.exports = ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data, _arg) {
      var _ref1;
      this.repo = repo;
      this.data = data;
      _ref1 = _arg != null ? _arg : {}, this.mode = _ref1.mode, this.tag = _ref1.tag, this.extraArgs = _ref1.extraArgs;
      ListView.__super__.initialize.apply(this, arguments);
      if (this.tag == null) {
        this.tag = '';
      }
      if (this.extraArgs == null) {
        this.extraArgs = [];
      }
      this.show();
      this.parseData();
      return this.result = new Promise((function(_this) {
        return function(resolve, reject) {
          _this.resolve = resolve;
          _this.reject = reject;
        };
      })(this));
    };

    ListView.prototype.parseData = function() {
      var items, remotes;
      items = this.data.split("\n");
      remotes = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item
        };
      });
      if (remotes.length === 1) {
        return this.confirmed(remotes[0]);
      } else {
        this.setItems(remotes);
        return this.focusFilterEditor();
      }
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(_arg) {
      var name;
      name = _arg.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      if (this.mode === 'pull') {
        git.cmd(['branch', '-r'], {
          cwd: this.repo.getWorkingDirectory()
        }).then((function(_this) {
          return function(data) {
            return new PullBranchListView(_this.repo, data, name, _this.extraArgs, _this.resolve);
          };
        })(this));
      } else if (this.mode === 'fetch-prune') {
        this.mode = 'fetch';
        this.execute(name, '--prune');
      } else {
        this.execute(name);
      }
      return this.cancel();
    };

    ListView.prototype.execute = function(remote, extraArgs) {
      var args, command, message, startMessage, view, _ref1;
      if (extraArgs == null) {
        extraArgs = '';
      }
      view = OutputViewManager["new"]();
      args = [this.mode];
      if (extraArgs.length > 0) {
        args.push(extraArgs);
      }
      args = args.concat([remote, this.tag]);
      command = (_ref1 = atom.config.get('git-plus.gitPath')) != null ? _ref1 : 'git';
      message = "" + (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
      startMessage = notifier.addInfo(message, {
        dismissable: true
      });
      return new BufferedProcess({
        command: command,
        args: args,
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
            if (code === 128) {
              view.reset();
              return new BufferedProcess({
                command: command,
                args: [_this.mode, '-u', remote, 'HEAD'],
                options: {
                  cwd: _this.repo.getWorkingDirectory()
                },
                stdout: function(data) {
                  return view.addLine(data.toString());
                },
                stderr: function(data) {
                  return view.addLine(data.toString());
                },
                exit: function(code) {
                  view.finish();
                  return startMessage.dismiss();
                }
              });
            } else {
              view.finish();
              return startMessage.dismiss();
            }
          };
        })(this)
      });
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmVtb3RlLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUdBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxVQUFBLEVBQUQsRUFBSyxzQkFBQSxjQURMLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQUxwQixDQUFBOztBQUFBLEVBTUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHlCQUFSLENBTnJCLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHVCQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEVBQWUsSUFBZixHQUFBO0FBQ1YsVUFBQSxLQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQURrQixJQUFDLENBQUEsT0FBQSxJQUNuQixDQUFBO0FBQUEsNkJBRHlCLE9BQTBCLElBQXpCLElBQUMsQ0FBQSxhQUFBLE1BQU0sSUFBQyxDQUFBLFlBQUEsS0FBSyxJQUFDLENBQUEsa0JBQUEsU0FDeEMsQ0FBQTtBQUFBLE1BQUEsMENBQUEsU0FBQSxDQUFBLENBQUE7O1FBQ0EsSUFBQyxDQUFBLE1BQU87T0FEUjs7UUFFQSxJQUFDLENBQUEsWUFBYTtP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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/remote-list-view.coffee
