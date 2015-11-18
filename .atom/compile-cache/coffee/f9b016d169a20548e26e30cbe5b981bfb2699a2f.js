(function() {
  var git, gitCheckoutAllFiles, notifier;

  git = require('../git');

  notifier = require('../notifier');

  gitCheckoutAllFiles = function(repo) {
    return git.cmd({
      args: ['checkout', '-f'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        notifier.addSuccess("File changes checked out successfully!");
        return git.refresh();
      }
    });
  };

  module.exports = gitCheckoutAllFiles;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jaGVja291dC1hbGwtZmlsZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxtQkFBQSxHQUFzQixTQUFDLElBQUQsR0FBQTtXQUNwQixHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxVQUFELEVBQWEsSUFBYixDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLE1BRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sUUFBQSxRQUFRLENBQUMsVUFBVCxDQUFvQix3Q0FBcEIsQ0FBQSxDQUFBO2VBQ0EsR0FBRyxDQUFDLE9BQUosQ0FBQSxFQUZNO01BQUEsQ0FGUjtLQURGLEVBRG9CO0VBQUEsQ0FIdEIsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLG1CQVhqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-checkout-all-files.coffee
