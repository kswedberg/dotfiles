(function() {
  var RemoteListView, git;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo, _arg) {
    var extraArgs, rebase;
    rebase = (_arg != null ? _arg : {}).rebase;
    if (rebase) {
      extraArgs = ['--rebase'];
    }
    return git.cmd(['remote'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new RemoteListView(repo, data, {
        mode: 'pull',
        extraArgs: extraArgs
      }).result;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1wdWxsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUixDQURqQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ2YsUUFBQSxpQkFBQTtBQUFBLElBRHVCLHlCQUFELE9BQVMsSUFBUixNQUN2QixDQUFBO0FBQUEsSUFBQSxJQUE0QixNQUE1QjtBQUFBLE1BQUEsU0FBQSxHQUFZLENBQUMsVUFBRCxDQUFaLENBQUE7S0FBQTtXQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELENBQVIsRUFBb0I7QUFBQSxNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQXBCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFELEdBQUE7YUFBVSxHQUFBLENBQUEsY0FBSSxDQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkI7QUFBQSxRQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsUUFBYyxTQUFBLEVBQVcsU0FBekI7T0FBM0IsQ0FBOEQsQ0FBQyxPQUE3RTtJQUFBLENBRE4sRUFGZTtFQUFBLENBSGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-pull.coffee
