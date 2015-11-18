(function() {
  var GitDiffTool, Path, fs, git, pathToRepoFile, repo, _ref;

  fs = require('fs-plus');

  Path = require('flavored-path');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  git = require('../../lib/git');

  GitDiffTool = require('../../lib/models/git-difftool');

  describe("GitDiffTool", function() {
    beforeEach(function() {
      atom.config.set('git-plus.includeStagedDiff', true);
      spyOn(git, 'cmd').andReturn(Promise.resolve('diffs'));
      spyOn(git, 'getConfig').andReturn(Promise.resolve('some-tool'));
      return waitsForPromise(function() {
        return GitDiffTool(repo, {
          file: pathToRepoFile
        });
      });
    });
    return describe("when git-plus.includeStagedDiff config is true", function() {
      it("calls git.cmd with 'diff-index HEAD -z'", function() {
        return expect(git.cmd).toHaveBeenCalledWith(['diff-index', 'HEAD', '-z'], {
          cwd: repo.getWorkingDirectory()
        });
      });
      return it("calls `git.getConfig` to check if a a difftool is set", function() {
        return expect(git.getConfig).toHaveBeenCalledWith('diff.tool', Path.dirname(pathToRepoFile));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtZGlmZnRvb2wtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0RBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLE9BQXlCLE9BQUEsQ0FBUSxhQUFSLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FGUCxDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsK0JBQVIsQ0FKZCxDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixFQUE4QyxJQUE5QyxDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLE9BQWhCLENBQTVCLENBREEsQ0FBQTtBQUFBLE1BRUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxXQUFYLENBQXVCLENBQUMsU0FBeEIsQ0FBa0MsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsV0FBaEIsQ0FBbEMsQ0FGQSxDQUFBO2FBR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxXQUFBLENBQVksSUFBWixFQUFrQjtBQUFBLFVBQUEsSUFBQSxFQUFNLGNBQU47U0FBbEIsRUFEYztNQUFBLENBQWhCLEVBSlM7SUFBQSxDQUFYLENBQUEsQ0FBQTtXQU9BLFFBQUEsQ0FBUyxnREFBVCxFQUEyRCxTQUFBLEdBQUE7QUFDekQsTUFBQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO2VBQzVDLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsWUFBRCxFQUFlLE1BQWYsRUFBdUIsSUFBdkIsQ0FBckMsRUFBbUU7QUFBQSxVQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1NBQW5FLEVBRDRDO01BQUEsQ0FBOUMsQ0FBQSxDQUFBO2FBR0EsRUFBQSxDQUFHLHVEQUFILEVBQTRELFNBQUEsR0FBQTtlQUMxRCxNQUFBLENBQU8sR0FBRyxDQUFDLFNBQVgsQ0FBcUIsQ0FBQyxvQkFBdEIsQ0FBMkMsV0FBM0MsRUFBd0QsSUFBSSxDQUFDLE9BQUwsQ0FBYSxjQUFiLENBQXhELEVBRDBEO01BQUEsQ0FBNUQsRUFKeUQ7SUFBQSxDQUEzRCxFQVJzQjtFQUFBLENBQXhCLENBTkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-difftool-spec.coffee
