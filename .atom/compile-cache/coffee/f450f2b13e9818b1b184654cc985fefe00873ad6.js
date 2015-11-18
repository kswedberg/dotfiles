(function() {
  var TagCreateView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  TagCreateView = require('../../lib/views/tag-create-view');

  describe("TagCreateView", function() {
    return describe("when there are two tags", function() {
      beforeEach(function() {
        return this.view = new TagCreateView(repo);
      });
      it("displays inputs for tag name and message", function() {
        expect(this.view.tagName).toBeDefined();
        return expect(this.view.tagMessage).toBeDefined();
      });
      return it("creates a tag with the given name and message", function() {
        var cwd;
        spyOn(git, 'cmd').andReturn(Promise.resolve(0));
        cwd = repo.getWorkingDirectory();
        this.view.tagName.setText('tag1');
        this.view.tagMessage.setText('tag1 message');
        this.view.find('.gp-confirm-button').click();
        return expect(git.cmd).toHaveBeenCalledWith(['tag', '-a', 'tag1', '-m', 'tag1 message'], {
          cwd: cwd
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL3ZpZXdzL3RhZy1jcmVhdGUtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsaUNBQVIsQ0FGaEIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtXQUN4QixRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxhQUFBLENBQWMsSUFBZCxFQURIO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUdBLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBLEdBQUE7QUFDN0MsUUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFiLENBQXFCLENBQUMsV0FBdEIsQ0FBQSxDQUFBLENBQUE7ZUFDQSxNQUFBLENBQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxVQUFiLENBQXdCLENBQUMsV0FBekIsQ0FBQSxFQUY2QztNQUFBLENBQS9DLENBSEEsQ0FBQTthQU9BLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsWUFBQSxHQUFBO0FBQUEsUUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixDQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxRQUNBLEdBQUEsR0FBTSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUROLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQWQsQ0FBc0IsTUFBdEIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxJQUFDLENBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFqQixDQUF5QixjQUF6QixDQUhBLENBQUE7QUFBQSxRQUlBLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLG9CQUFYLENBQWdDLENBQUMsS0FBakMsQ0FBQSxDQUpBLENBQUE7ZUFLQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsTUFBZCxFQUFzQixJQUF0QixFQUE0QixjQUE1QixDQUFyQyxFQUFrRjtBQUFBLFVBQUMsS0FBQSxHQUFEO1NBQWxGLEVBTmtEO01BQUEsQ0FBcEQsRUFSa0M7SUFBQSxDQUFwQyxFQUR3QjtFQUFBLENBQTFCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/views/tag-create-view-spec.coffee
