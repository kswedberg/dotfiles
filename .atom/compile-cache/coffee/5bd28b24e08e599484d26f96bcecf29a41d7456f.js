(function() {
  var CherryPickSelectBranch, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  CherryPickSelectBranch = require('../../lib/views/cherry-pick-select-branch-view');

  describe("CherryPickSelectBranch view", function() {
    beforeEach(function() {
      return this.view = new CherryPickSelectBranch(repo, ['head1', 'head2'], 'currentHead');
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("calls git.cmd to get commits between currentHead and selected head", function() {
      var expectedArgs;
      spyOn(git, 'cmd').andReturn(Promise.resolve('heads'));
      this.view.confirmSelection();
      expectedArgs = ['log', '--cherry-pick', '-z', '--format=%H%n%an%n%ar%n%s', "currentHead...head1"];
      return expect(git.cmd).toHaveBeenCalledWith(expectedArgs, {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL3ZpZXdzL2NoZXJyeS1waWNrLXNlbGVjdC1icmFuY2gtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLGdEQUFSLENBRnpCLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsNkJBQVQsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxzQkFBQSxDQUF1QixJQUF2QixFQUE2QixDQUFDLE9BQUQsRUFBVSxPQUFWLENBQTdCLEVBQWlELGFBQWpELEVBREg7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBR0EsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTthQUNoQyxNQUFBLENBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxDQUFoQyxFQURnQztJQUFBLENBQWxDLENBSEEsQ0FBQTtXQU1BLEVBQUEsQ0FBRyxvRUFBSCxFQUF5RSxTQUFBLEdBQUE7QUFDdkUsVUFBQSxZQUFBO0FBQUEsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixPQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsZ0JBQU4sQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLFlBQUEsR0FBZSxDQUNiLEtBRGEsRUFFYixlQUZhLEVBR2IsSUFIYSxFQUliLDJCQUphLEVBS2IscUJBTGEsQ0FGZixDQUFBO2FBU0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsWUFBckMsRUFBbUQ7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQW5ELEVBVnVFO0lBQUEsQ0FBekUsRUFQc0M7RUFBQSxDQUF4QyxDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/views/cherry-pick-select-branch-view-spec.coffee
