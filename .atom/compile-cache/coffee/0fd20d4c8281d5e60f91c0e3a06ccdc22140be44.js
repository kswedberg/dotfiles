(function() {
  var GitInit, git;

  git = require('../../lib/git');

  GitInit = require('../../lib/models/git-init');

  describe("GitInit", function() {
    return it("sets the project path to the new repo path", function() {
      spyOn(atom.project, 'setPaths');
      spyOn(atom.project, 'getPaths').andCallFake(function() {
        return ['some/path'];
      });
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve(true);
      });
      return waitsForPromise(function() {
        return GitInit().then(function() {
          return expect(atom.project.setPaths).toHaveBeenCalledWith(['some/path']);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtaW5pdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsMkJBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO1dBQ2xCLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsTUFBQSxLQUFBLENBQU0sSUFBSSxDQUFDLE9BQVgsRUFBb0IsVUFBcEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxLQUFBLENBQU0sSUFBSSxDQUFDLE9BQVgsRUFBb0IsVUFBcEIsQ0FBK0IsQ0FBQyxXQUFoQyxDQUE0QyxTQUFBLEdBQUE7ZUFBRyxDQUFDLFdBQUQsRUFBSDtNQUFBLENBQTVDLENBREEsQ0FBQTtBQUFBLE1BRUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsV0FBbEIsQ0FBOEIsU0FBQSxHQUFBO2VBQzVCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLElBQWhCLEVBRDRCO01BQUEsQ0FBOUIsQ0FGQSxDQUFBO2FBSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxPQUFBLENBQUEsQ0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFBLEdBQUE7aUJBQ2IsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBcEIsQ0FBNkIsQ0FBQyxvQkFBOUIsQ0FBbUQsQ0FBQyxXQUFELENBQW5ELEVBRGE7UUFBQSxDQUFmLEVBRGM7TUFBQSxDQUFoQixFQUwrQztJQUFBLENBQWpELEVBRGtCO0VBQUEsQ0FBcEIsQ0FIQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-init-spec.coffee
