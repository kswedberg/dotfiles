(function() {
  var GitCommit, git, gitAddAllCommitAndPush;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitAddAllCommitAndPush = function(repo) {
    return git.add(repo, {
      file: null,
      exit: function() {
        return new GitCommit(repo, {
          andPush: true
        });
      }
    });
  };

  module.exports = gitAddAllCommitAndPush;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1hZGQtYWxsLWNvbW1pdC1hbmQtcHVzaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBRFosQ0FBQTs7QUFBQSxFQUdBLHNCQUFBLEdBQXlCLFNBQUMsSUFBRCxHQUFBO1dBQ3ZCLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFNBQUEsR0FBQTtlQUNBLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBZ0I7QUFBQSxVQUFBLE9BQUEsRUFBUyxJQUFUO1NBQWhCLEVBREE7TUFBQSxDQUROO0tBREYsRUFEdUI7RUFBQSxDQUh6QixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsc0JBVGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-add-all-commit-and-push.coffee
