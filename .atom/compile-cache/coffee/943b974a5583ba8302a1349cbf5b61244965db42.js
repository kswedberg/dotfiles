(function() {
  var ProjectsListView, git, init, notifier;

  git = require('../git');

  ProjectsListView = require('../views/projects-list-view');

  notifier = require('../notifier');

  init = function(path) {
    return git.cmd(['init'], {
      cwd: path
    }).then(function(data) {
      notifier.addSuccess(data);
      return atom.project.setPaths([path]);
    });
  };

  module.exports = function() {
    var currentFile, _ref;
    currentFile = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
    if (!currentFile && atom.project.getPaths().length > 1) {
      return new ProjectsListView().result.then(function(path) {
        return init(path);
      });
    } else {
      return init(atom.project.getPaths()[0]);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQ0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsNkJBQVIsQ0FEbkIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUZYLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sU0FBQyxJQUFELEdBQUE7V0FDTCxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsTUFBRCxDQUFSLEVBQWtCO0FBQUEsTUFBQSxHQUFBLEVBQUssSUFBTDtLQUFsQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO0FBQ0osTUFBQSxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFwQixDQUFBLENBQUE7YUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxJQUFELENBQXRCLEVBRkk7SUFBQSxDQUROLEVBREs7RUFBQSxDQUpQLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQUE7QUFDZixRQUFBLGlCQUFBO0FBQUEsSUFBQSxXQUFBLCtEQUFrRCxDQUFFLE9BQXRDLENBQUEsVUFBZCxDQUFBO0FBQ0EsSUFBQSxJQUFHLENBQUEsV0FBQSxJQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF1QixDQUFDLE1BQXhCLEdBQWlDLENBQXhEO2FBQ00sSUFBQSxnQkFBQSxDQUFBLENBQWtCLENBQUMsTUFBTSxDQUFDLElBQTFCLENBQStCLFNBQUMsSUFBRCxHQUFBO2VBQVUsSUFBQSxDQUFLLElBQUwsRUFBVjtNQUFBLENBQS9CLEVBRE47S0FBQSxNQUFBO2FBR0UsSUFBQSxDQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUE3QixFQUhGO0tBRmU7RUFBQSxDQVZqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-init.coffee
