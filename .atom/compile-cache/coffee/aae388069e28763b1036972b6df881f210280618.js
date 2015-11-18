(function() {
  var Path, git, pathToRepoFile, pathToSubmoduleFile;

  git = require('../lib/git');

  Path = require('flavored-path');

  pathToRepoFile = Path.get("~/.atom/packages/git-plus/lib/git.coffee");

  pathToSubmoduleFile = Path.get("~/.atom/packages/git-plus/spec/foo/foo.txt");

  describe("Git-Plus git module", function() {
    describe("git.getRepo", function() {
      return it("returns a promise", function() {
        return waitsForPromise(function() {
          return git.getRepo().then(function(repo) {
            return expect(repo.getWorkingDirectory()).toContain('git-plus');
          });
        });
      });
    });
    describe("git.dir", function() {
      return it("returns a promise", function() {
        return waitsForPromise(function() {
          return git.dir().then(function(dir) {
            return expect(dir).toContain('git-plus');
          });
        });
      });
    });
    return describe("git.getSubmodule", function() {
      it("returns undefined when there is no submodule", function() {
        return expect(git.getSubmodule(pathToRepoFile)).toBe(void 0);
      });
      return it("returns a submodule when given file is in a submodule of a project repo", function() {
        return expect(git.getSubmodule(pathToSubmoduleFile)).toBeTruthy();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL2dpdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsWUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsY0FBQSxHQUFpQixJQUFJLENBQUMsR0FBTCxDQUFTLDBDQUFULENBSGpCLENBQUE7O0FBQUEsRUFJQSxtQkFBQSxHQUFzQixJQUFJLENBQUMsR0FBTCxDQUFTLDRDQUFULENBSnRCLENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLElBQUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO2FBQ3RCLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUE7ZUFDdEIsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQsR0FBQTttQkFDakIsTUFBQSxDQUFPLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQVAsQ0FBa0MsQ0FBQyxTQUFuQyxDQUE2QyxVQUE3QyxFQURpQjtVQUFBLENBQW5CLEVBRGM7UUFBQSxDQUFoQixFQURzQjtNQUFBLENBQXhCLEVBRHNCO0lBQUEsQ0FBeEIsQ0FBQSxDQUFBO0FBQUEsSUFNQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7YUFDbEIsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUEsR0FBQTtlQUN0QixlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxHQUFHLENBQUMsR0FBSixDQUFBLENBQVMsQ0FBQyxJQUFWLENBQWUsU0FBQyxHQUFELEdBQUE7bUJBQ2IsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLFNBQVosQ0FBc0IsVUFBdEIsRUFEYTtVQUFBLENBQWYsRUFEYztRQUFBLENBQWhCLEVBRHNCO01BQUEsQ0FBeEIsRUFEa0I7SUFBQSxDQUFwQixDQU5BLENBQUE7V0FZQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLE1BQUEsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtlQUNqRCxNQUFBLENBQU8sR0FBRyxDQUFDLFlBQUosQ0FBaUIsY0FBakIsQ0FBUCxDQUF3QyxDQUFDLElBQXpDLENBQThDLE1BQTlDLEVBRGlEO01BQUEsQ0FBbkQsQ0FBQSxDQUFBO2FBR0EsRUFBQSxDQUFHLHlFQUFILEVBQThFLFNBQUEsR0FBQTtlQUM1RSxNQUFBLENBQU8sR0FBRyxDQUFDLFlBQUosQ0FBaUIsbUJBQWpCLENBQVAsQ0FBNkMsQ0FBQyxVQUE5QyxDQUFBLEVBRDRFO01BQUEsQ0FBOUUsRUFKMkI7SUFBQSxDQUE3QixFQWI4QjtFQUFBLENBQWhDLENBTkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/git-spec.coffee
