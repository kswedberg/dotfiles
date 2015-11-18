(function() {
  var CherryPickSelectCommits, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  CherryPickSelectCommits = require('../../lib/views/cherry-pick-select-commits-view');

  describe("CherryPickSelectCommits view", function() {
    beforeEach(function() {
      return this.view = new CherryPickSelectCommits(repo, ['commit1', 'commit2']);
    });
    it("displays a list of commits", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("calls git.cmd with 'cherry-pick' and the selected commits", function() {
      spyOn(git, 'cmd').andReturn(Promise.resolve('success'));
      this.view.confirmSelection();
      this.view.find('.btn-pick-button').click();
      return expect(git.cmd).toHaveBeenCalledWith(['cherry-pick', 'commit1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL3ZpZXdzL2NoZXJyeS1waWNrLXNlbGVjdC1jb21taXQtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsdUJBQUEsR0FBMEIsT0FBQSxDQUFRLGlEQUFSLENBRjFCLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSx1QkFBQSxDQUF3QixJQUF4QixFQUE4QixDQUFDLFNBQUQsRUFBWSxTQUFaLENBQTlCLEVBREg7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBR0EsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUEsR0FBQTthQUMvQixNQUFBLENBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxDQUFoQyxFQUQrQjtJQUFBLENBQWpDLENBSEEsQ0FBQTtXQU1BLEVBQUEsQ0FBRywyREFBSCxFQUFnRSxTQUFBLEdBQUE7QUFDOUQsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixTQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsZ0JBQU4sQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLGtCQUFYLENBQThCLENBQUMsS0FBL0IsQ0FBQSxDQUZBLENBQUE7YUFHQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLGFBQUQsRUFBZ0IsU0FBaEIsQ0FBckMsRUFBaUU7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQWpFLEVBSjhEO0lBQUEsQ0FBaEUsRUFQdUM7RUFBQSxDQUF6QyxDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/views/cherry-pick-select-commit-view-spec.coffee
