(function() {
  var DiffView;

  DiffView = require("./diff-view");

  module.exports = {
    diffView: null,
    activate: function(state) {
      atom.workspaceView.command('diff:selected', (function(_this) {
        return function() {
          return _this.diffView.selected();
        };
      })(this));
      if (this.diffView !== null && this.diffView.hasParent()) {
        return this.diffView.destroy();
      } else {
        return this.diffView = new DiffView(state);
      }
    },
    deactivate: function() {},
    serialize: function() {
      return {
        diffViewState: this.diffView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixlQUEzQixFQUE0QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxRQUFRLENBQUMsUUFBVixDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QyxDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcsSUFBQyxDQUFBLFFBQUQsS0FBYSxJQUFiLElBQXNCLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixDQUFBLENBQXpCO2VBQ0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLFFBQUEsQ0FBUyxLQUFULEVBSGxCO09BRlE7SUFBQSxDQUZWO0FBQUEsSUFTQSxVQUFBLEVBQVksU0FBQSxHQUFBLENBVFo7QUFBQSxJQVdBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsYUFBQSxFQUFlLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixDQUFBLENBQWY7UUFEUztJQUFBLENBWFg7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/kswedberg/.atom/packages/atom-cli-diff/lib/diff.coffee