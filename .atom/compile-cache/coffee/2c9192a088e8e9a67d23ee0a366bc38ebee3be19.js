(function() {
  var RebaseListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  RebaseListView = require('../../lib/views/rebase-list-view');

  describe("RebaseListView", function() {
    beforeEach(function() {
      this.view = new RebaseListView(repo, "branch1\nbranch2");
      return spyOn(git, 'cmd').andCallFake(function() {
        return Promise.reject('blah');
      });
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("rebases onto the selected branch", function() {
      this.view.confirmSelection();
      this.view.rebase('branch1');
      return expect(git.cmd).toHaveBeenCalledWith(['rebase', 'branch1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL3ZpZXdzL3JlYmFzZS1saXN0LXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGtDQUFSLENBRmpCLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLGtCQUFyQixDQUFaLENBQUE7YUFDQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxXQUFsQixDQUE4QixTQUFBLEdBQUE7ZUFDNUIsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLEVBRDRCO01BQUEsQ0FBOUIsRUFGUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFLQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO2FBQ2hDLE1BQUEsQ0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLENBQWhDLEVBRGdDO0lBQUEsQ0FBbEMsQ0FMQSxDQUFBO1dBUUEsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxNQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsZ0JBQU4sQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFhLFNBQWIsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxRQUFELEVBQVcsU0FBWCxDQUFyQyxFQUE0RDtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBNUQsRUFIcUM7SUFBQSxDQUF2QyxFQVR5QjtFQUFBLENBQTNCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/views/rebase-list-view-spec.coffee
