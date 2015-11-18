(function() {
  var git, gitStashApply, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashApply = function(repo) {
    return git.cmd({
      args: ['stash', 'apply'],
      cwd: repo.getWorkingDirectory(),
      options: {
        env: process.env.NODE_ENV
      },
      stdout: function(data) {
        if (data.toString().length > 0) {
          return notifier.addSuccess(data);
        }
      },
      stderr: function(data) {
        return notifier.addError(data.toString());
      }
    });
  };

  module.exports = gitStashApply;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFzaC1hcHBseS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUdBLGFBQUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7V0FDZCxHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsT0FBVixDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLE1BRUEsT0FBQSxFQUFTO0FBQUEsUUFDUCxHQUFBLEVBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQURWO09BRlQ7QUFBQSxNQUtBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFFBQUEsSUFBNkIsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBaEIsR0FBeUIsQ0FBdEQ7aUJBQUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsSUFBcEIsRUFBQTtTQURNO01BQUEsQ0FMUjtBQUFBLE1BT0EsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2VBQ04sUUFBUSxDQUFDLFFBQVQsQ0FBa0IsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFsQixFQURNO01BQUEsQ0FQUjtLQURGLEVBRGM7RUFBQSxDQUhoQixDQUFBOztBQUFBLEVBZUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsYUFmakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-stash-apply.coffee
