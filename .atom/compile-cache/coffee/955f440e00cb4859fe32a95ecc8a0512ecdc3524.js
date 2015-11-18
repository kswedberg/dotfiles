(function() {
  var GitAdd, git, pathToRepoFile, repo, _ref;

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  git = require('../../lib/git');

  GitAdd = require('../../lib/models/git-add');

  describe("GitAdd", function() {
    it("calls git.add with the current file if `addAll` is false", function() {
      spyOn(git, 'add');
      spyOn(atom.workspace, 'getActiveTextEditor').andCallFake(function() {
        return {
          getPath: function() {
            return pathToRepoFile;
          }
        };
      });
      GitAdd(repo);
      return expect(git.add).toHaveBeenCalledWith(repo, {
        file: repo.relativize(pathToRepoFile)
      });
    });
    return it("calls git.add without a file option if `addAll` is true", function() {
      spyOn(git, 'add');
      GitAdd(repo, {
        addAll: true
      });
      return expect(git.add).toHaveBeenCalledWith(repo);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtYWRkLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVDQUFBOztBQUFBLEVBQUEsT0FBeUIsT0FBQSxDQUFRLGFBQVIsQ0FBekIsRUFBQyxZQUFBLElBQUQsRUFBTyxzQkFBQSxjQUFQLENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FETixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSwwQkFBUixDQUZULENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7QUFDakIsSUFBQSxFQUFBLENBQUcsMERBQUgsRUFBK0QsU0FBQSxHQUFBO0FBQzdELE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQUEsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLHFCQUF0QixDQUE0QyxDQUFDLFdBQTdDLENBQXlELFNBQUEsR0FBQTtlQUN2RDtBQUFBLFVBQUEsT0FBQSxFQUFTLFNBQUEsR0FBQTttQkFBRyxlQUFIO1VBQUEsQ0FBVDtVQUR1RDtNQUFBLENBQXpELENBREEsQ0FBQTtBQUFBLE1BR0EsTUFBQSxDQUFPLElBQVAsQ0FIQSxDQUFBO2FBSUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsSUFBckMsRUFBMkM7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFJLENBQUMsVUFBTCxDQUFnQixjQUFoQixDQUFOO09BQTNDLEVBTDZEO0lBQUEsQ0FBL0QsQ0FBQSxDQUFBO1dBT0EsRUFBQSxDQUFHLHlEQUFILEVBQThELFNBQUEsR0FBQTtBQUM1RCxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFBLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxJQUFQLEVBQWE7QUFBQSxRQUFBLE1BQUEsRUFBUSxJQUFSO09BQWIsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsSUFBckMsRUFINEQ7SUFBQSxDQUE5RCxFQVJpQjtFQUFBLENBQW5CLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-add-spec.coffee
