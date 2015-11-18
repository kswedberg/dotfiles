(function() {
  var DeleteBranchView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  DeleteBranchView = require('../../lib/views/delete-branch-view');

  describe("DeleteBranchView", function() {
    it("deletes the selected local branch", function() {
      var view;
      spyOn(git, 'cmd').andReturn(Promise.resolve('success'));
      view = new DeleteBranchView(repo, "branch/1\nbranch2");
      view.confirmSelection();
      return expect(git.cmd).toHaveBeenCalledWith(['branch', '-D', 'branch/1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
    return it("deletes the selected remote branch when `isRemote: true`", function() {
      var view;
      spyOn(git, 'cmd').andReturn(Promise.resolve('success'));
      view = new DeleteBranchView(repo, "origin/branch", {
        isRemote: true
      });
      view.confirmSelection();
      return expect(git.cmd).toHaveBeenCalledWith(['push', 'origin', '--delete', 'branch'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL3ZpZXdzL2RlbGV0ZS1icmFuY2gtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLG9DQUFSLENBRm5CLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLElBQUEsRUFBQSxDQUFHLG1DQUFILEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxVQUFBLElBQUE7QUFBQSxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFNBQWhCLENBQTVCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFXLElBQUEsZ0JBQUEsQ0FBaUIsSUFBakIsRUFBdUIsbUJBQXZCLENBRFgsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FGQSxDQUFBO2FBR0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxRQUFELEVBQVcsSUFBWCxFQUFpQixVQUFqQixDQUFyQyxFQUFtRTtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBbkUsRUFKc0M7SUFBQSxDQUF4QyxDQUFBLENBQUE7V0FNQSxFQUFBLENBQUcsMERBQUgsRUFBK0QsU0FBQSxHQUFBO0FBQzdELFVBQUEsSUFBQTtBQUFBLE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsU0FBaEIsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQVcsSUFBQSxnQkFBQSxDQUFpQixJQUFqQixFQUF1QixlQUF2QixFQUF3QztBQUFBLFFBQUEsUUFBQSxFQUFVLElBQVY7T0FBeEMsQ0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUZBLENBQUE7YUFHQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLFVBQW5CLEVBQStCLFFBQS9CLENBQXJDLEVBQStFO0FBQUEsUUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUEvRSxFQUo2RDtJQUFBLENBQS9ELEVBUDJCO0VBQUEsQ0FBN0IsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/views/delete-branch-view-spec.coffee
