(function() {
  var $$, GitShow, RemoteListView, SelectListView, TagView, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  GitShow = require('../models/git-show');

  notifier = require('../notifier');

  RemoteListView = require('../views/remote-list-view');

  module.exports = TagView = (function(_super) {
    __extends(TagView, _super);

    function TagView() {
      return TagView.__super__.constructor.apply(this, arguments);
    }

    TagView.prototype.initialize = function(repo, tag) {
      this.repo = repo;
      this.tag = tag;
      TagView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagView.prototype.parseData = function() {
      var items;
      items = [];
      items.push({
        tag: this.tag,
        cmd: 'Show',
        description: 'git show'
      });
      items.push({
        tag: this.tag,
        cmd: 'Push',
        description: 'git push [remote]'
      });
      items.push({
        tag: this.tag,
        cmd: 'Checkout',
        description: 'git checkout'
      });
      items.push({
        tag: this.tag,
        cmd: 'Verify',
        description: 'git tag --verify'
      });
      items.push({
        tag: this.tag,
        cmd: 'Delete',
        description: 'git tag --delete'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagView.prototype.cancelled = function() {
      return this.hide();
    };

    TagView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    TagView.prototype.viewForItem = function(_arg) {
      var cmd, description, tag;
      tag = _arg.tag, cmd = _arg.cmd, description = _arg.description;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, cmd);
            return _this.div({
              "class": 'text-warning'
            }, "" + description + " " + tag);
          };
        })(this));
      });
    };

    TagView.prototype.getFilterKey = function() {
      return 'cmd';
    };

    TagView.prototype.confirmed = function(_arg) {
      var args, cmd, tag;
      tag = _arg.tag, cmd = _arg.cmd;
      this.cancel();
      switch (cmd) {
        case 'Show':
          GitShow(this.repo, tag);
          return;
        case 'Push':
          git.cmd({
            args: ['remote'],
            cwd: this.repo.getWorkingDirectory(),
            stdout: (function(_this) {
              return function(data) {
                return new RemoteListView(_this.repo, data, {
                  mode: 'push',
                  tag: _this.tag
                });
              };
            })(this)
          });
          return;
        case 'Checkout':
          args = ['checkout', tag];
          break;
        case 'Verify':
          args = ['tag', '--verify', tag];
          break;
        case 'Delete':
          args = ['tag', '--delete', tag];
      }
      return git.cmd({
        args: args,
        cwd: this.repo.getWorkingDirectory(),
        stdout: function(data) {
          return notifier.addSuccess(data.toString());
        }
      });
    };

    return TagView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvdGFnLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxVQUFBLEVBQUQsRUFBSyxzQkFBQSxjQUFMLENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FGTixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUixDQUhWLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVIsQ0FMakIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0JBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFTLEdBQVQsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFEa0IsSUFBQyxDQUFBLE1BQUEsR0FDbkIsQ0FBQTtBQUFBLE1BQUEseUNBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxFQUhVO0lBQUEsQ0FBWixDQUFBOztBQUFBLHNCQUtBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxJQUFOLENBQVc7QUFBQSxRQUFDLEdBQUEsRUFBSyxJQUFDLENBQUEsR0FB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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/tag-view.coffee
