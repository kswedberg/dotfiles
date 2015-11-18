(function() {
  var ListView, git, gitDeleteRemoteBranch;

  git = require('../git');

  ListView = require('../views/delete-branch-view');

  gitDeleteRemoteBranch = function(repo) {
    return git.cmd({
      args: ['branch', '-r'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new ListView(repo, data.toString(), {
          isRemote: true
        });
      }
    });
  };

  module.exports = gitDeleteRemoteBranch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kZWxldGUtcmVtb3RlLWJyYW5jaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0NBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSw2QkFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxxQkFBQSxHQUF3QixTQUFDLElBQUQsR0FBQTtXQUN0QixHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxRQUFELEVBQVcsSUFBWCxDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLE1BRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2VBQ0YsSUFBQSxRQUFBLENBQVMsSUFBVCxFQUFlLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZixFQUFnQztBQUFBLFVBQUEsUUFBQSxFQUFVLElBQVY7U0FBaEMsRUFERTtNQUFBLENBRlI7S0FERixFQURzQjtFQUFBLENBSHhCLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUFpQixxQkFWakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-delete-remote-branch.coffee
