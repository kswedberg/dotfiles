(function() {
  var GitStageHunk, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitStageHunk = require('../../lib/models/git-stage-hunk');

  describe("GitStageHunk", function() {
    it("calls git.unstagedFiles to get files to stage", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      GitStageHunk(repo);
      return expect(git.unstagedFiles).toHaveBeenCalled();
    });
    return it("opens the view for selecting files to choose from", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      return GitStageHunk(repo).then(function(view) {
        return expect(view).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtc3RhZ2UtaHVuay1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQ0FBUixDQUZmLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsSUFBQSxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxlQUFYLENBQTJCLENBQUMsU0FBNUIsQ0FBc0MsT0FBTyxDQUFDLE9BQVIsQ0FBZ0Isa0JBQWhCLENBQXRDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxDQUFhLElBQWIsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxhQUFYLENBQXlCLENBQUMsZ0JBQTFCLENBQUEsRUFIa0Q7SUFBQSxDQUFwRCxDQUFBLENBQUE7V0FLQSxFQUFBLENBQUcsbURBQUgsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxlQUFYLENBQTJCLENBQUMsU0FBNUIsQ0FBc0MsT0FBTyxDQUFDLE9BQVIsQ0FBZ0Isa0JBQWhCLENBQXRDLENBQUEsQ0FBQTthQUNBLFlBQUEsQ0FBYSxJQUFiLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsU0FBQyxJQUFELEdBQUE7ZUFDdEIsTUFBQSxDQUFPLElBQVAsQ0FBWSxDQUFDLFdBQWIsQ0FBQSxFQURzQjtNQUFBLENBQXhCLEVBRnNEO0lBQUEsQ0FBeEQsRUFOdUI7RUFBQSxDQUF6QixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-stage-hunk-spec.coffee
