(function() {
  var GitCommit, git, gitCommitAmend;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitCommitAmend = function(repo) {
    return git.cmd({
      args: ['log', '-1', '--format=%B'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(amend) {
        return git.cmd({
          args: ['reset', '--soft', 'HEAD^'],
          cwd: repo.getWorkingDirectory(),
          exit: function() {
            return new GitCommit(repo, {
              amend: "" + (amend != null ? amend.trim() : void 0) + "\n"
            });
          }
        });
      }
    });
  };

  module.exports = gitCommitAmend;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jb21taXQtYW1lbmQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQURaLENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLFNBQUMsSUFBRCxHQUFBO1dBQ2YsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxhQUFkLENBQU47QUFBQSxNQUNBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQURMO0FBQUEsTUFFQSxNQUFBLEVBQVEsU0FBQyxLQUFELEdBQUE7ZUFDTixHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixPQUFwQixDQUFOO0FBQUEsVUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLFVBRUEsSUFBQSxFQUFNLFNBQUEsR0FBQTttQkFBTyxJQUFBLFNBQUEsQ0FBVSxJQUFWLEVBQWdCO0FBQUEsY0FBQSxLQUFBLEVBQU8sRUFBQSxHQUFFLGlCQUFDLEtBQUssQ0FBRSxJQUFQLENBQUEsVUFBRCxDQUFGLEdBQWlCLElBQXhCO2FBQWhCLEVBQVA7VUFBQSxDQUZOO1NBREYsRUFETTtNQUFBLENBRlI7S0FERixFQURlO0VBQUEsQ0FIakIsQ0FBQTs7QUFBQSxFQWFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGNBYmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-commit-amend.coffee
