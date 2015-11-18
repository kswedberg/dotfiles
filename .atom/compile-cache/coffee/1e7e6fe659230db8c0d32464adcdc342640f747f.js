(function() {
  var JavascriptSnippetsView;

  JavascriptSnippetsView = require('./javascript-snippets-view');

  module.exports = {
    javascriptSnippetsView: null,
    activate: function(state) {
      return this.javascriptSnippetsView = new JavascriptSnippetsView(state.javascriptSnippetsViewState);
    },
    deactivate: function() {
      return this.javascriptSnippetsView.destroy();
    },
    serialize: function() {
      return {
        javascriptSnippetsViewState: this.javascriptSnippetsView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUEsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLDRCQUFSLENBQXpCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxzQkFBQSxFQUF3QixJQUF4QjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLHNCQUFELEdBQThCLElBQUEsc0JBQUEsQ0FBdUIsS0FBSyxDQUFDLDJCQUE3QixFQUR0QjtJQUFBLENBRlY7QUFBQSxJQUtBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsc0JBQXNCLENBQUMsT0FBeEIsQ0FBQSxFQURVO0lBQUEsQ0FMWjtBQUFBLElBUUEsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSwyQkFBQSxFQUE2QixJQUFDLENBQUEsc0JBQXNCLENBQUMsU0FBeEIsQ0FBQSxDQUE3QjtRQURTO0lBQUEsQ0FSWDtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/javascript-snippets/lib/javascript-snippets.coffee