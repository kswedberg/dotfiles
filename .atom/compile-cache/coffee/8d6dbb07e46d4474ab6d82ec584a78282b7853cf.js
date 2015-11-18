(function() {
  var GitTags, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitTags = require('../../lib/models/git-tags');

  describe("GitTags", function() {
    return it("calls git.cmd with 'tag' as an arg", function() {
      spyOn(git, 'cmd').andReturn(Promise.resolve('data'));
      GitTags(repo);
      return expect(git.cmd).toHaveBeenCalledWith(['tag', '-ln'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtdGFncy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FETixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSwyQkFBUixDQUZWLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7V0FDbEIsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLE1BQWhCLENBQTVCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxDQUFRLElBQVIsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFyQyxFQUFxRDtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBckQsRUFIdUM7SUFBQSxDQUF6QyxFQURrQjtFQUFBLENBQXBCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-tags-spec.coffee
