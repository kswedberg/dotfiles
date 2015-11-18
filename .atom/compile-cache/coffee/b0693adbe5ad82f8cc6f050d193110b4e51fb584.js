(function() {
  var GitCommit, git, gitAddAllAndCommit;

  git = require('../git');

  GitCommit = require('./git-commit');

  gitAddAllAndCommit = function(repo) {
    return git.add(repo, {
      exit: function() {
        return new GitCommit(repo);
      }
    });
  };

  module.exports = gitAddAllAndCommit;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1hZGQtYWxsLWFuZC1jb21taXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQURaLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixTQUFDLElBQUQsR0FBQTtXQUNuQixHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQUEsR0FBQTtlQUFPLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBUDtNQUFBLENBQU47S0FERixFQURtQjtFQUFBLENBSHJCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUFpQixrQkFQakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-add-all-and-commit.coffee
