(function() {
  var SelectStageHunkFile, git, gitStageHunk;

  git = require('../git');

  SelectStageHunkFile = require('../views/select-stage-hunk-file-view');

  gitStageHunk = function(repo) {
    return git.unstagedFiles(repo, null, function(data) {
      return new SelectStageHunkFile(repo, data);
    });
  };

  module.exports = gitStageHunk;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFnZS1odW5rLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQ0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsc0NBQVIsQ0FEdEIsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxTQUFDLElBQUQsR0FBQTtXQUNiLEdBQUcsQ0FBQyxhQUFKLENBQWtCLElBQWxCLEVBQXdCLElBQXhCLEVBQ0UsU0FBQyxJQUFELEdBQUE7YUFBYyxJQUFBLG1CQUFBLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWQ7SUFBQSxDQURGLEVBRGE7RUFBQSxDQUhmLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUFpQixZQVJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-stage-hunk.coffee
