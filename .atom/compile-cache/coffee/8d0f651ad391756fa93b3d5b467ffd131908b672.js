(function() {
  var git, gitStashPop, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashPop = function(repo) {
    return git.cmd({
      args: ['stash', 'pop'],
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
        return notifier.addError(data);
      }
    });
  };

  module.exports = gitStashPop;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFzaC1wb3AuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7V0FDWixHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLE1BRUEsT0FBQSxFQUFTO0FBQUEsUUFDUCxHQUFBLEVBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQURWO09BRlQ7QUFBQSxNQUtBLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtBQUNOLFFBQUEsSUFBNkIsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBaEIsR0FBeUIsQ0FBdEQ7aUJBQUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsSUFBcEIsRUFBQTtTQURNO01BQUEsQ0FMUjtBQUFBLE1BT0EsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2VBQ04sUUFBUSxDQUFDLFFBQVQsQ0FBa0IsSUFBbEIsRUFETTtNQUFBLENBUFI7S0FERixFQURZO0VBQUEsQ0FIZCxDQUFBOztBQUFBLEVBZUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsV0FmakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-stash-pop.coffee
