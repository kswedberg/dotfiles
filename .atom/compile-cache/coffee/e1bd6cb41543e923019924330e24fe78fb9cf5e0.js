(function() {
  var OutputView, view;

  OutputView = require('./views/output-view');

  view = null;

  module.exports = {
    "new": function() {
      if (view != null) {
        view.reset();
      }
      return this.getView();
    },
    getView: function() {
      if (view === null) {
        view = new OutputView;
        atom.workspace.addBottomPanel({
          item: view
        });
        view.hide();
      }
      return view;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvb3V0cHV0LXZpZXctbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0JBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHFCQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxJQUZQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQUssU0FBQSxHQUFBOztRQUNILElBQUksQ0FBRSxLQUFOLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELENBQUEsRUFGRztJQUFBLENBQUw7QUFBQSxJQUlBLE9BQUEsRUFBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUcsSUFBQSxLQUFRLElBQVg7QUFDRSxRQUFBLElBQUEsR0FBTyxHQUFBLENBQUEsVUFBUCxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTlCLENBREEsQ0FBQTtBQUFBLFFBRUEsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUZBLENBREY7T0FBQTthQUlBLEtBTE87SUFBQSxDQUpUO0dBSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/output-view-manager.coffee
