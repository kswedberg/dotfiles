(function() {
  var GitStageFiles, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitStageFiles = require('../../lib/models/git-stage-files');

  describe("GitStageFiles", function() {
    return it("calls git.unstagedFiles to get files to stage", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      GitStageFiles(repo);
      return expect(git.unstagedFiles).toHaveBeenCalled();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtc3RhZ2UtZmlsZXMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtDQUFSLENBRmhCLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7V0FDeEIsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtBQUNsRCxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsZUFBWCxDQUEyQixDQUFDLFNBQTVCLENBQXNDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGtCQUFoQixDQUF0QyxDQUFBLENBQUE7QUFBQSxNQUNBLGFBQUEsQ0FBYyxJQUFkLENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsYUFBWCxDQUF5QixDQUFDLGdCQUExQixDQUFBLEVBSGtEO0lBQUEsQ0FBcEQsRUFEd0I7RUFBQSxDQUExQixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-stage-files-spec.coffee
