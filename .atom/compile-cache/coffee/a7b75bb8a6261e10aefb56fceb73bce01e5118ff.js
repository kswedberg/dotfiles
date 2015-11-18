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
        if (name === this.currentBranchString) {
          this.execute();
        } else {
          git.cmd(['branch', '-r'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(data) {
              return new PullBranchListView(_this.repo, data, name, _this.extraArgs, _this.resolve);
            };
          })(this));
        }
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
      if (remote == null) {
        remote = '';
      }
      if (extraArgs == null) {
        extraArgs = '';
      }
      view = OutputViewManager["new"]();
      args = [this.mode];
      if (extraArgs.length > 0) {
        args.push(extraArgs);
      }
      args = args.concat([remote, this.tag]).filter(function(arg) {
        return arg !== '';
      });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmVtb3RlLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUdBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxVQUFBLEVBQUQsRUFBSyxzQkFBQSxjQURMLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQUxwQixDQUFBOztBQUFBLEVBTUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHlCQUFSLENBTnJCLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHVCQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEVBQWUsSUFBZixHQUFBO0FBQ1YsVUFBQSxLQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQURrQixJQUFDLENBQUEsT0FBQSxJQUNuQixDQUFBO0FBQUEsNkJBRHlCLE9BQTBCLElBQXpCLElBQUMsQ0FBQSxhQUFBLE1BQU0sSUFBQyxDQUFBLFlBQUEsS0FBSyxJQUFDLENBQUEsa0JBQUEsU0FDeEMsQ0FBQTtBQUFBLE1BQUEsMENBQUEsU0FBQSxDQUFBLENBQUE7O1FBQ0EsSUFBQyxDQUFBLE1BQU87T0FEUjs7UUFFQSxJQUFDLENBQUEsWUFBYTtPQUZkO0FBQUEsTUFHQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUpBLENBQUE7YUFLQSxJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLE9BQUYsRUFBWSxNQUFaLEdBQUE7QUFBcUIsVUFBcEIsS0FBQyxDQUFBLFVBQUEsT0FBbUIsQ0FBQTtBQUFBLFVBQVYsS0FBQyxDQUFBLFNBQUEsTUFBUyxDQUFyQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsRUFOSjtJQUFBLENBQVosQ0FBQTs7QUFBQSx1QkFRQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxjQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBWixDQUFSLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxLQUFLLENBQUMsTUFBTixDQUFhLFNBQUMsSUFBRCxHQUFBO2VBQVUsSUFBQSxLQUFVLEdBQXBCO01BQUEsQ0FBYixDQUFvQyxDQUFDLEdBQXJDLENBQXlDLFNBQUMsSUFBRCxHQUFBO2VBQVU7QUFBQSxVQUFFLElBQUEsRUFBTSxJQUFSO1VBQVY7TUFBQSxDQUF6QyxDQURWLENBQUE7QUFFQSxNQUFBLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7ZUFDRSxJQUFDLENBQUEsU0FBRCxDQUFXLE9BQVEsQ0FBQSxDQUFBLENBQW5CLEVBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFKRjtPQUhTO0lBQUEsQ0FSWCxDQUFBOztBQUFBLHVCQWlCQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsT0FBSDtJQUFBLENBakJkLENBQUE7O0FBQUEsdUJBbUJBLElBQUEsR0FBTSxTQUFBLEdBQUE7O1FBQ0osSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3QjtPQUFWO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxDQURBLENBQUE7YUFHQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxFQUpJO0lBQUEsQ0FuQk4sQ0FBQTs7QUFBQSx1QkF5QkEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtJQUFBLENBekJYLENBQUE7O0FBQUEsdUJBMkJBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixVQUFBLEtBQUE7aURBQU0sQ0FBRSxPQUFSLENBQUEsV0FESTtJQUFBLENBM0JOLENBQUE7O0FBQUEsdUJBOEJBLFdBQUEsR0FBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BRGEsT0FBRCxLQUFDLElBQ2IsQ0FBQTthQUFBLEVBQUEsQ0FBRyxTQUFBLEdBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJLElBQUosRUFEQztNQUFBLENBQUgsRUFEVztJQUFBLENBOUJiLENBQUE7O0FBQUEsdUJBa0NBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFVBQUEsSUFBQTtBQUFBLE1BRFcsT0FBRCxLQUFDLElBQ1gsQ0FBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsSUFBRCxLQUFTLE1BQVo7QUFDRSxRQUFBLElBQUcsSUFBQSxLQUFRLElBQUMsQ0FBQSxtQkFBWjtBQUNFLFVBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFBLENBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxFQUFXLElBQVgsQ0FBUixFQUEwQjtBQUFBLFlBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFMO1dBQTFCLENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFDLElBQUQsR0FBQTtxQkFBYyxJQUFBLGtCQUFBLENBQW1CLEtBQUMsQ0FBQSxJQUFwQixFQUEwQixJQUExQixFQUFnQyxJQUFoQyxFQUFzQyxLQUFDLENBQUEsU0FBdkMsRUFBa0QsS0FBQyxDQUFBLE9BQW5ELEVBQWQ7WUFBQSxFQUFBO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROLENBQUEsQ0FIRjtTQURGO09BQUEsTUFNSyxJQUFHLElBQUMsQ0FBQSxJQUFELEtBQVMsYUFBWjtBQUNILFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFSLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxFQUFlLFNBQWYsQ0FEQSxDQURHO09BQUEsTUFBQTtBQUlILFFBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxJQUFULENBQUEsQ0FKRztPQU5MO2FBV0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQVpTO0lBQUEsQ0FsQ1gsQ0FBQTs7QUFBQSx1QkFnREEsT0FBQSxHQUFTLFNBQUMsTUFBRCxFQUFZLFNBQVosR0FBQTtBQUNQLFVBQUEsaURBQUE7O1FBRFEsU0FBTztPQUNmOztRQURtQixZQUFVO09BQzdCO0FBQUEsTUFBQSxJQUFBLEdBQU8saUJBQWlCLENBQUMsS0FBRCxDQUFqQixDQUFBLENBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLENBQUMsSUFBQyxDQUFBLElBQUYsQ0FEUCxDQUFBO0FBRUEsTUFBQSxJQUFHLFNBQVMsQ0FBQyxNQUFWLEdBQW1CLENBQXRCO0FBQ0UsUUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsQ0FBQSxDQURGO09BRkE7QUFBQSxNQUlBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLENBQUMsTUFBRCxFQUFTLElBQUMsQ0FBQSxHQUFWLENBQVosQ0FBMkIsQ0FBQyxNQUE1QixDQUFtQyxTQUFDLEdBQUQsR0FBQTtlQUFTLEdBQUEsS0FBUyxHQUFsQjtNQUFBLENBQW5DLENBSlAsQ0FBQTtBQUFBLE1BS0EsT0FBQSxtRUFBZ0QsS0FMaEQsQ0FBQTtBQUFBLE1BTUEsT0FBQSxHQUFVLEVBQUEsR0FBRSxDQUFDLElBQUMsQ0FBQSxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBVCxDQUFBLENBQUEsR0FBdUIsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQWdCLENBQWhCLENBQXhCLENBQUYsR0FBNkMsUUFOdkQsQ0FBQTtBQUFBLE1BT0EsWUFBQSxHQUFlLFFBQVEsQ0FBQyxPQUFULENBQWlCLE9BQWpCLEVBQTBCO0FBQUEsUUFBQSxXQUFBLEVBQWEsSUFBYjtPQUExQixDQVBmLENBQUE7YUFRSSxJQUFBLGVBQUEsQ0FDRjtBQUFBLFFBQUEsT0FBQSxFQUFTLE9BQVQ7QUFBQSxRQUNBLElBQUEsRUFBTSxJQUROO0FBQUEsUUFFQSxPQUFBLEVBQ0U7QUFBQSxVQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtTQUhGO0FBQUEsUUFJQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7aUJBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWIsRUFBVjtRQUFBLENBSlI7QUFBQSxRQUtBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtpQkFBVSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBYixFQUFWO1FBQUEsQ0FMUjtBQUFBLFFBTUEsSUFBQSxFQUFNLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxJQUFELEdBQUE7QUFDSixZQUFBLElBQUcsSUFBQSxLQUFRLEdBQVg7QUFDRSxjQUFBLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FBQSxDQUFBO3FCQUNJLElBQUEsZUFBQSxDQUNGO0FBQUEsZ0JBQUEsT0FBQSxFQUFTLE9BQVQ7QUFBQSxnQkFDQSxJQUFBLEVBQU0sQ0FBQyxLQUFDLENBQUEsSUFBRixFQUFRLElBQVIsRUFBYyxNQUFkLEVBQXNCLE1BQXRCLENBRE47QUFBQSxnQkFFQSxPQUFBLEVBQ0U7QUFBQSxrQkFBQSxHQUFBLEVBQUssS0FBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7aUJBSEY7QUFBQSxnQkFJQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7eUJBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWIsRUFBVjtnQkFBQSxDQUpSO0FBQUEsZ0JBS0EsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO3lCQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFiLEVBQVY7Z0JBQUEsQ0FMUjtBQUFBLGdCQU1BLElBQUEsRUFBTSxTQUFDLElBQUQsR0FBQTtBQUNKLGtCQUFBLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxDQUFBO3lCQUNBLFlBQVksQ0FBQyxPQUFiLENBQUEsRUFGSTtnQkFBQSxDQU5OO2VBREUsRUFGTjthQUFBLE1BQUE7QUFhRSxjQUFBLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxDQUFBO3FCQUNBLFlBQVksQ0FBQyxPQUFiLENBQUEsRUFkRjthQURJO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOTjtPQURFLEVBVEc7SUFBQSxDQWhEVCxDQUFBOztvQkFBQTs7S0FEcUIsZUFUdkIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/remote-list-view.coffee
