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
          var textEditor;
          textEditor = atom.workspace.getActiveTextEditor();
          console.log(this.textEditor);
          return textEditor.focus();
        }
      });
      return atom.commands.add('atom-workspace', {
        'pane:show-next-item': function() {
          var textEditor;
          textEditor = atom.workspace.getActiveTextEditor();
          console.log(this.textEditor);
          return textEditor.focus();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9zeW5jZWQtc2lkZWJhci9saWIvc3luY2VkLXNpZGViYXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixhQUFBLEdBQ2Y7QUFBQSxJQUFBLGFBQUEsRUFBZSxJQUFmO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFFUixNQUFBLElBQUcsSUFBQyxDQUFBLGFBQUo7QUFDRSxjQUFBLENBREY7T0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUhqQixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxnQkFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFuQixDQU5BLENBQUE7QUFBQSxNQVFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLHlCQUFBLEVBQTJCLFNBQUEsR0FBQTtBQUU3RCxjQUFBLFVBQUE7QUFBQSxVQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBYixDQUFBO0FBQUEsVUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQUMsQ0FBQSxVQUFiLENBREEsQ0FBQTtpQkFFQSxVQUFVLENBQUMsS0FBWCxDQUFBLEVBSjZEO1FBQUEsQ0FBM0I7T0FBcEMsQ0FSQSxDQUFBO2FBYUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEscUJBQUEsRUFBdUIsU0FBQSxHQUFBO0FBRXpELGNBQUEsVUFBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFiLENBQUE7QUFBQSxVQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBQyxDQUFBLFVBQWIsQ0FEQSxDQUFBO2lCQUVBLFVBQVUsQ0FBQyxLQUFYLENBQUEsRUFKeUQ7UUFBQSxDQUF2QjtPQUFwQyxFQWZRO0lBQUEsQ0FGVjtBQUFBLElBdUJBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEtBRlA7SUFBQSxDQXZCWjtBQUFBLElBMkJBLGdCQUFBLEVBQWtCLFNBQUEsR0FBQTtBQUNoQixVQUFBLDBCQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFrQyxDQUFDLGFBQW5DLENBQWlELFlBQWpELENBQVgsQ0FBQTtBQUdBLE1BQUEsSUFBRyxRQUFIO0FBQ0UsUUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUF2QixFQUEyRCw4QkFBM0QsQ0FBQSxDQUFBO0FBQUEsUUFFQSxnQkFBQSxHQUFtQixRQUFRLENBQUMsYUFBVCxDQUF1QixzQkFBdkIsQ0FGbkIsQ0FBQTtBQUlBLFFBQUEsSUFBRyxnQkFBSDtpQkFDRSxnQkFBZ0IsQ0FBQyxzQkFBakIsQ0FBQSxFQURGO1NBTEY7T0FKZ0I7SUFBQSxDQTNCbEI7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/synced-sidebar/lib/synced-sidebar.coffee
