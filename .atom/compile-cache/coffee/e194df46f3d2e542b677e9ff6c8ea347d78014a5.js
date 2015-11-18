(function() {
  var git, gitStashSave, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitStashSave = function(repo) {
    var notification;
    notification = notifier.addInfo('Saving...', {
      dismissable: true
    });
    return git.cmd({
      args: ['stash', 'save'],
      cwd: repo.getWorkingDirectory(),
      options: {
        env: process.env.NODE_ENV
      },
      stdout: function(data) {
        notification.dismiss();
        return notifier.addSuccess(data);
      }
    });
  };

  module.exports = gitStashSave;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFzaC1zYXZlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLFNBQUMsSUFBRCxHQUFBO0FBQ2IsUUFBQSxZQUFBO0FBQUEsSUFBQSxZQUFBLEdBQWUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsV0FBakIsRUFBOEI7QUFBQSxNQUFBLFdBQUEsRUFBYSxJQUFiO0tBQTlCLENBQWYsQ0FBQTtXQUNBLEdBQUcsQ0FBQyxHQUFKLENBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQU47QUFBQSxNQUNBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQURMO0FBQUEsTUFFQSxPQUFBLEVBQVM7QUFBQSxRQUNQLEdBQUEsRUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBRFY7T0FGVDtBQUFBLE1BS0EsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sUUFBQSxZQUFZLENBQUMsT0FBYixDQUFBLENBQUEsQ0FBQTtlQUNBLFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCLEVBRk07TUFBQSxDQUxSO0tBREYsRUFGYTtFQUFBLENBSGYsQ0FBQTs7QUFBQSxFQWVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBZmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-stash-save.coffee
