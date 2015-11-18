(function() {
  var SelectUnstageFiles, git, gitUnstageFiles;

  git = require('../git');

  SelectUnstageFiles = require('../views/select-unstage-files-view');

  gitUnstageFiles = function(repo) {
    return git.stagedFiles(repo, function(data) {
      return new SelectUnstageFiles(repo, data);
    });
  };

  module.exports = gitUnstageFiles;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC11bnN0YWdlLWZpbGVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsb0NBQVIsQ0FEckIsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsU0FBQyxJQUFELEdBQUE7V0FDaEIsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEIsRUFBc0IsU0FBQyxJQUFELEdBQUE7YUFBYyxJQUFBLGtCQUFBLENBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQWQ7SUFBQSxDQUF0QixFQURnQjtFQUFBLENBSGxCLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUFpQixlQU5qQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-unstage-files.coffee
