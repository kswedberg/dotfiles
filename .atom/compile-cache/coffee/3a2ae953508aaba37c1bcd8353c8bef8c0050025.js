(function() {
  var GitStatus, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitStatus = require('../../lib/models/git-status');

  describe("GitStatus", function() {
    beforeEach(function() {
      return spyOn(git, 'status').andReturn(Promise.resolve('foobar'));
    });
    it("calls git.status", function() {
      GitStatus(repo);
      return expect(git.status).toHaveBeenCalledWith(repo);
    });
    return it("creates a new StatusListView", function() {
      return GitStatus(repo).then(function(view) {
        return expect(view).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtc3RhdHVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9CQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUROLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLDZCQUFSLENBRlosQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNwQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxLQUFBLENBQU0sR0FBTixFQUFXLFFBQVgsQ0FBb0IsQ0FBQyxTQUFyQixDQUErQixPQUFPLENBQUMsT0FBUixDQUFnQixRQUFoQixDQUEvQixFQURTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUdBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7QUFDckIsTUFBQSxTQUFBLENBQVUsSUFBVixDQUFBLENBQUE7YUFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLE1BQVgsQ0FBa0IsQ0FBQyxvQkFBbkIsQ0FBd0MsSUFBeEMsRUFGcUI7SUFBQSxDQUF2QixDQUhBLENBQUE7V0FPQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO2FBQ2pDLFNBQUEsQ0FBVSxJQUFWLENBQWUsQ0FBQyxJQUFoQixDQUFxQixTQUFDLElBQUQsR0FBQTtlQUNuQixNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsV0FBYixDQUFBLEVBRG1CO01BQUEsQ0FBckIsRUFEaUM7SUFBQSxDQUFuQyxFQVJvQjtFQUFBLENBQXRCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-status-spec.coffee
