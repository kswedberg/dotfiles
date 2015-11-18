(function() {
  var GitMerge, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitMerge = require('../../lib/models/git-merge');

  describe("GitMerge", function() {
    return it("calls git.cmd with 'branch'", function() {
      spyOn(git, 'cmd').andReturn(Promise.resolve(''));
      GitMerge(repo);
      return expect(git.cmd).toHaveBeenCalledWith(['branch'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtbWVyZ2Utc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsNEJBQVIsQ0FGWCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO1dBQ25CLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixFQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxNQUNBLFFBQUEsQ0FBUyxJQUFULENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsUUFBRCxDQUFyQyxFQUFpRDtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBakQsRUFIZ0M7SUFBQSxDQUFsQyxFQURtQjtFQUFBLENBQXJCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-merge-spec.coffee
