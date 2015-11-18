(function() {
  var git, gitStashDrop, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashDrop = function(repo) {
    return git.cmd({
      args: ['stash', 'drop'],
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

  module.exports = gitStashDrop;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFzaC1kcm9wLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLFNBQUMsSUFBRCxHQUFBO1dBQ2IsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBREw7QUFBQSxNQUVBLE9BQUEsRUFBUztBQUFBLFFBQ1AsR0FBQSxFQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFEVjtPQUZUO0FBQUEsTUFLQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7QUFDTixRQUFBLElBQTZCLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQWhCLEdBQXlCLENBQXREO2lCQUFBLFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCLEVBQUE7U0FETTtNQUFBLENBTFI7QUFBQSxNQU9BLE1BQUEsRUFBUSxTQUFDLElBQUQsR0FBQTtlQUNOLFFBQVEsQ0FBQyxRQUFULENBQWtCLElBQWxCLEVBRE07TUFBQSxDQVBSO0tBREYsRUFEYTtFQUFBLENBSGYsQ0FBQTs7QUFBQSxFQWVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBZmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-stash-drop.coffee
