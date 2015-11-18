(function() {
  var ProjectsListView, git, gitInit, init, notifier;

  git = require('../git');

  ProjectsListView = require('../views/projects-list-view');

  notifier = require('../notifier');

  gitInit = function() {
    var currentFile, promise, _ref;
    currentFile = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
    if (!currentFile && atom.project.getPaths().length > 1) {
      return promise = new ProjectsListView().result.then(function(path) {
        return init(path);
      });
    } else {
      return init(atom.project.getPaths()[0]);
    }
  };

  init = function(path) {
    return git.cmd({
      args: ['init'],
      cwd: path,
      stdout: function(data) {
        notifier.addSuccess(data);
        return atom.project.setPaths([path]);
      }
    });
  };

  module.exports = gitInit;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsNkJBQVIsQ0FEbkIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUZYLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsUUFBQSwwQkFBQTtBQUFBLElBQUEsV0FBQSwrREFBa0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWQsQ0FBQTtBQUNBLElBQUEsSUFBRyxDQUFBLFdBQUEsSUFBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBdUIsQ0FBQyxNQUF4QixHQUFpQyxDQUF4RDthQUNFLE9BQUEsR0FBYyxJQUFBLGdCQUFBLENBQUEsQ0FBa0IsQ0FBQyxNQUFNLENBQUMsSUFBMUIsQ0FBK0IsU0FBQyxJQUFELEdBQUE7ZUFBVSxJQUFBLENBQUssSUFBTCxFQUFWO01BQUEsQ0FBL0IsRUFEaEI7S0FBQSxNQUFBO2FBR0UsSUFBQSxDQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUE3QixFQUhGO0tBRlE7RUFBQSxDQUpWLENBQUE7O0FBQUEsRUFXQSxJQUFBLEdBQU8sU0FBQyxJQUFELEdBQUE7V0FDTCxHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxNQUFELENBQU47QUFBQSxNQUNBLEdBQUEsRUFBSyxJQURMO0FBQUEsTUFFQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7QUFDTixRQUFBLFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCLENBQUEsQ0FBQTtlQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixDQUFDLElBQUQsQ0FBdEIsRUFGTTtNQUFBLENBRlI7S0FERixFQURLO0VBQUEsQ0FYUCxDQUFBOztBQUFBLEVBbUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BbkJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-init.coffee
