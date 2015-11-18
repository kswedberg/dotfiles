(function() {
  var GitShow, Os, Path, fs, git, pathToRepoFile, repo, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs-plus');

  Path = require('flavored-path');

  Os = require('os');

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  GitShow = require('../../lib/models/git-show');

  describe("GitShow", function() {
    beforeEach(function() {
      return spyOn(git, 'cmd').andReturn(Promise.resolve('foobar'));
    });
    it("calls git.cmd with 'show' and " + pathToRepoFile, function() {
      var args;
      GitShow(repo, 'foobar-hash', pathToRepoFile);
      args = git.cmd.mostRecentCall.args[0];
      expect(__indexOf.call(args, 'show') >= 0).toBe(true);
      return expect(__indexOf.call(args, pathToRepoFile) >= 0).toBe(true);
    });
    it("writes the output to a file", function() {
      var outputFile;
      spyOn(fs, 'writeFile').andCallFake(function() {
        return fs.writeFile.mostRecentCall.args[3]();
      });
      outputFile = Path.join(Os.tmpDir(), "foobar-hash.diff");
      waitsForPromise(function() {
        return GitShow(repo, 'foobar-hash', pathToRepoFile);
      });
      return runs(function() {
        var args;
        args = fs.writeFile.mostRecentCall.args;
        expect(args[0]).toBe(outputFile);
        return expect(args[1]).toBe('foobar');
      });
    });
    return describe("When a hash is not specified", function() {
      return it("returns a view for entering a hash", function() {
        var view;
        view = GitShow(repo);
        return expect(view).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtc2hvdy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzREFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLE9BQXlCLE9BQUEsQ0FBUSxhQUFSLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FKUCxDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSwyQkFBUixDQUxWLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsUUFBaEIsQ0FBNUIsRUFEUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFHQSxFQUFBLENBQUksZ0NBQUEsR0FBZ0MsY0FBcEMsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFVBQUEsSUFBQTtBQUFBLE1BQUEsT0FBQSxDQUFRLElBQVIsRUFBYyxhQUFkLEVBQTZCLGNBQTdCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBRG5DLENBQUE7QUFBQSxNQUVBLE1BQUEsQ0FBTyxlQUFVLElBQVYsRUFBQSxNQUFBLE1BQVAsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixJQUE1QixDQUZBLENBQUE7YUFHQSxNQUFBLENBQU8sZUFBa0IsSUFBbEIsRUFBQSxjQUFBLE1BQVAsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxJQUFwQyxFQUpvRDtJQUFBLENBQXRELENBSEEsQ0FBQTtBQUFBLElBU0EsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxVQUFBLFVBQUE7QUFBQSxNQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsV0FBVixDQUFzQixDQUFDLFdBQXZCLENBQW1DLFNBQUEsR0FBQTtlQUNqQyxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFqQyxDQUFBLEVBRGlDO01BQUEsQ0FBbkMsQ0FBQSxDQUFBO0FBQUEsTUFFQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFFLENBQUMsTUFBSCxDQUFBLENBQVYsRUFBdUIsa0JBQXZCLENBRmIsQ0FBQTtBQUFBLE1BR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxPQUFBLENBQVEsSUFBUixFQUFjLGFBQWQsRUFBNkIsY0FBN0IsRUFEYztNQUFBLENBQWhCLENBSEEsQ0FBQTthQUtBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFuQyxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sSUFBSyxDQUFBLENBQUEsQ0FBWixDQUFlLENBQUMsSUFBaEIsQ0FBcUIsVUFBckIsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLElBQUssQ0FBQSxDQUFBLENBQVosQ0FBZSxDQUFDLElBQWhCLENBQXFCLFFBQXJCLEVBSEc7TUFBQSxDQUFMLEVBTmdDO0lBQUEsQ0FBbEMsQ0FUQSxDQUFBO1dBb0JBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7YUFDdkMsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsSUFBUixDQUFQLENBQUE7ZUFDQSxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsV0FBYixDQUFBLEVBRnVDO01BQUEsQ0FBekMsRUFEdUM7SUFBQSxDQUF6QyxFQXJCa0I7RUFBQSxDQUFwQixDQVBBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-show-spec.coffee
