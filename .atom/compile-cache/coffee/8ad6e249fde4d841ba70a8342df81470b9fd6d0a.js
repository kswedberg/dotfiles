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
      atom.commands.add('body', {
        'pane:show-previous-item': function() {
          return atom.views.getView(atom.workspace).focus();
        }
      });
      return atom.commands.add('body', {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9zeW5jZWQtc2lkZWJhci9saWIvc3luY2VkLXNpZGViYXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixhQUFBLEdBQ2Y7QUFBQSxJQUFBLGFBQUEsRUFBZSxJQUFmO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFFUixNQUFBLElBQUcsSUFBQyxDQUFBLGFBQUo7QUFDRSxjQUFBLENBREY7T0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUhqQixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxnQkFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFuQixDQU5BLENBQUE7QUFBQSxNQVFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixNQUFsQixFQUEwQjtBQUFBLFFBQUEseUJBQUEsRUFBMkIsU0FBQSxHQUFBO2lCQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWtDLENBQUMsS0FBbkMsQ0FBQSxFQURtRDtRQUFBLENBQTNCO09BQTFCLENBUkEsQ0FBQTthQVdBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixNQUFsQixFQUEwQjtBQUFBLFFBQUEscUJBQUEsRUFBdUIsU0FBQSxHQUFBO2lCQUMvQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWtDLENBQUMsS0FBbkMsQ0FBQSxFQUQrQztRQUFBLENBQXZCO09BQTFCLEVBYlE7SUFBQSxDQUZWO0FBQUEsSUFrQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsS0FGUDtJQUFBLENBbEJaO0FBQUEsSUFzQkEsZ0JBQUEsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLFVBQUEsMEJBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQWtDLENBQUMsYUFBbkMsQ0FBaUQsWUFBakQsQ0FBWCxDQUFBO0FBR0EsTUFBQSxJQUFHLFFBQUg7QUFDRSxRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQXZCLEVBQTJELDhCQUEzRCxDQUFBLENBQUE7QUFBQSxRQUVBLGdCQUFBLEdBQW1CLFFBQVEsQ0FBQyxhQUFULENBQXVCLHNCQUF2QixDQUZuQixDQUFBO0FBSUEsUUFBQSxJQUFHLGdCQUFIO2lCQUNFLGdCQUFnQixDQUFDLHNCQUFqQixDQUFBLEVBREY7U0FMRjtPQUpnQjtJQUFBLENBdEJsQjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/synced-sidebar/lib/synced-sidebar.coffee
