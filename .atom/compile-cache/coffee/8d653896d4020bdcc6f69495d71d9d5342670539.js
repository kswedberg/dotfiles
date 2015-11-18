(function() {
  var BlameGutterView, CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  BlameGutterView = require('./blame-gutter-view');

  module.exports = {
    gitBlameMeView: null,
    modalPanel: null,
    subscriptions: null,
    config: {
      defaultWidth: {
        title: 'Default width (px)',
        type: 'integer',
        "default": 250,
        minimum: 50,
        maximum: 500
      }
    },
    activate: function(state) {
      this.state = state != null ? state : {};
      this.gutters = new Map;
      this.disposables = new CompositeDisposable;
      return this.disposables.add(atom.commands.add('atom-workspace', {
        'blame:toggle': (function(_this) {
          return function() {
            return _this.toggleBlameGutter();
          };
        })(this)
      }));
    },
    toggleBlameGutter: function() {
      var editor, gutter;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      gutter = this.gutters.get(editor);
      if (gutter) {
        return gutter.toggleVisible();
      } else {
        gutter = new BlameGutterView(this.state, editor);
        this.disposables.add(gutter);
        return this.gutters.set(editor, gutter);
      }
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    serialize: function() {
      return this.state;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibGFtZS9saWIvaW5pdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0NBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRGxCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxjQUFBLEVBQWdCLElBQWhCO0FBQUEsSUFDQSxVQUFBLEVBQVksSUFEWjtBQUFBLElBRUEsYUFBQSxFQUFlLElBRmY7QUFBQSxJQUlBLE1BQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0JBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsR0FGVDtBQUFBLFFBR0EsT0FBQSxFQUFTLEVBSFQ7QUFBQSxRQUlBLE9BQUEsRUFBUyxHQUpUO09BREY7S0FMRjtBQUFBLElBWUEsUUFBQSxFQUFVLFNBQUUsS0FBRixHQUFBO0FBRVIsTUFGUyxJQUFDLENBQUEsd0JBQUEsUUFBUSxFQUVsQixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxHQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQURmLENBQUE7YUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDbkUsS0FBQyxDQUFBLGlCQUFELENBQUEsRUFEbUU7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtPQUFwQyxDQUFqQixFQUxRO0lBQUEsQ0FaVjtBQUFBLElBb0JBLGlCQUFBLEVBQW1CLFNBQUEsR0FBQTtBQUVqQixVQUFBLGNBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsTUFBQTtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBQUEsTUFHQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULENBQWEsTUFBYixDQUhULENBQUE7QUFLQSxNQUFBLElBQUcsTUFBSDtlQUNFLE1BQU0sQ0FBQyxhQUFQLENBQUEsRUFERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE1BQUEsR0FBYSxJQUFBLGVBQUEsQ0FBZ0IsSUFBQyxDQUFBLEtBQWpCLEVBQXdCLE1BQXhCLENBQWIsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLE1BQWpCLENBREEsQ0FBQTtlQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLE1BQWIsRUFBcUIsTUFBckIsRUFMRjtPQVBpQjtJQUFBLENBcEJuQjtBQUFBLElBa0NBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxFQURVO0lBQUEsQ0FsQ1o7QUFBQSxJQXFDQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLE1BQUo7SUFBQSxDQXJDWDtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/blame/lib/init.coffee
