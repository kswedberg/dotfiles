(function() {
  var GitCherryPick, repo;

  repo = require('../fixtures').repo;

  GitCherryPick = require('../../lib/models/git-cherry-pick');

  describe("GitCherryPick", function() {
    it("gets heads from the repo's references", function() {
      spyOn(repo, 'getReferences').andCallThrough();
      GitCherryPick(repo);
      return expect(repo.getReferences).toHaveBeenCalled();
    });
    return it("calls replace on each head with to remove 'refs/heads/'", function() {
      var head;
      head = repo.getReferences().heads[0];
      GitCherryPick(repo);
      return expect(head.replace).toHaveBeenCalledWith('refs/heads/', '');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtY2hlcnJ5LXBpY2stc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsYUFBQSxHQUFnQixPQUFBLENBQVEsa0NBQVIsQ0FEaEIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixJQUFBLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsTUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLGVBQVosQ0FBNEIsQ0FBQyxjQUE3QixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsYUFBQSxDQUFjLElBQWQsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFaLENBQTBCLENBQUMsZ0JBQTNCLENBQUEsRUFIMEM7SUFBQSxDQUE1QyxDQUFBLENBQUE7V0FLQSxFQUFBLENBQUcseURBQUgsRUFBOEQsU0FBQSxHQUFBO0FBQzVELFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBb0IsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFsQyxDQUFBO0FBQUEsTUFDQSxhQUFBLENBQWMsSUFBZCxDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLE9BQVosQ0FBb0IsQ0FBQyxvQkFBckIsQ0FBMEMsYUFBMUMsRUFBeUQsRUFBekQsRUFINEQ7SUFBQSxDQUE5RCxFQU53QjtFQUFBLENBQTFCLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-cherry-pick-spec.coffee
