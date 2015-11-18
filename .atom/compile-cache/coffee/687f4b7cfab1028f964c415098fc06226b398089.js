(function() {
  var CompositeDisposable, SyncedSidebar;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = SyncedSidebar = {
    subscriptions: null,
    activate: function(state) {
      if (this.subscriptions) {
        return;
      }
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.revealActiveFile();
        };
      })(this)));
      atom.commands.add('atom-workspace', {
        'pane:show-previous-item': function() {
          return atom.views.getView(atom.workspace).focus();
        }
      });
      return atom.commands.add('atom-workspace', {
        'pane:show-next-item': function() {
          return atom.views.getView(atom.workspace).focus();
        }
      });
    },
    deactivate: function() {
      this.subscriptions.dispose();
      return this.subscriptions = null;
    },
    revealActiveFile: function() {
      var selectedListItem, treeView;
      treeView = atom.views.getView(atom.workspace).querySelector('.tree-view');
      if (treeView) {
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:reveal-active-file');
        selectedListItem = treeView.querySelector('.list-tree .selected');
        if (selectedListItem) {
          return selectedListItem.scrollIntoViewIfNeeded();
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9zeW5jZWQtc2lkZWJhci9saWIvc3luY2VkLXNpZGViYXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixhQUFBLEdBQ2Y7QUFBQSxJQUFBLGFBQUEsRUFBZSxJQUFmO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFFUixNQUFBLElBQUcsSUFBQyxDQUFBLGFBQUo7QUFDRSxjQUFBLENBREY7T0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUhqQixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxnQkFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFuQixDQU5BLENBQUE7QUFBQSxNQVFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLHlCQUFBLEVBQTJCLFNBQUEsR0FBQTtpQkFDN0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFrQyxDQUFDLEtBQW5DLENBQUEsRUFENkQ7UUFBQSxDQUEzQjtPQUFwQyxDQVJBLENBQUE7YUFXQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DO0FBQUEsUUFBQSxxQkFBQSxFQUF1QixTQUFBLEdBQUE7aUJBQ3pELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBa0MsQ0FBQyxLQUFuQyxDQUFBLEVBRHlEO1FBQUEsQ0FBdkI7T0FBcEMsRUFiUTtJQUFBLENBRlY7QUFBQSxJQWtCQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixLQUZQO0lBQUEsQ0FsQlo7QUFBQSxJQXNCQSxnQkFBQSxFQUFrQixTQUFBLEdBQUE7QUFDaEIsVUFBQSwwQkFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBa0MsQ0FBQyxhQUFuQyxDQUFpRCxZQUFqRCxDQUFYLENBQUE7QUFHQSxNQUFBLElBQUcsUUFBSDtBQUNFLFFBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBdkIsRUFBMkQsOEJBQTNELENBQUEsQ0FBQTtBQUFBLFFBRUEsZ0JBQUEsR0FBbUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsc0JBQXZCLENBRm5CLENBQUE7QUFJQSxRQUFBLElBQUcsZ0JBQUg7aUJBQ0UsZ0JBQWdCLENBQUMsc0JBQWpCLENBQUEsRUFERjtTQUxGO09BSmdCO0lBQUEsQ0F0QmxCO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/synced-sidebar/lib/synced-sidebar.coffee
