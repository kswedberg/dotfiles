(function() {
  var SelectStageFiles, git, gitStageFiles;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view');

  gitStageFiles = function(repo) {
    return git.unstagedFiles(repo, {
      showUntracked: true
    }, function(data) {
      return new SelectStageFiles(repo, data);
    });
  };

  module.exports = gitStageFiles;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFnZS1maWxlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0NBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLGtDQUFSLENBRG5CLENBQUE7O0FBQUEsRUFHQSxhQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBO1dBQ2QsR0FBRyxDQUFDLGFBQUosQ0FBa0IsSUFBbEIsRUFDRTtBQUFBLE1BQUEsYUFBQSxFQUFlLElBQWY7S0FERixFQUVFLFNBQUMsSUFBRCxHQUFBO2FBQWMsSUFBQSxnQkFBQSxDQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUFkO0lBQUEsQ0FGRixFQURjO0VBQUEsQ0FIaEIsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBVGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-stage-files.coffee
