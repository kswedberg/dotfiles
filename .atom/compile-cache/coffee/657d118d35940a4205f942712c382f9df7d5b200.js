(function() {
  var git, gitBranches, gitRemoteBranches, newBranch, pathToRepoFile, repo, _ref, _ref1;

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  _ref1 = require('../../lib/models/git-branch'), gitBranches = _ref1.gitBranches, gitRemoteBranches = _ref1.gitRemoteBranches, newBranch = _ref1.newBranch;

  describe("GitBranch", function() {
    beforeEach(function() {
      return spyOn(atom.workspace, 'addModalPanel').andCallThrough();
    });
    describe(".gitBranches", function() {
      beforeEach(function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve('branch1\nbranch2'));
        return waitsForPromise(function() {
          return gitBranches(repo);
        });
      });
      return it("displays a list of the repo's branches", function() {
        expect(git.cmd).toHaveBeenCalledWith(['branch'], {
          cwd: repo.getWorkingDirectory()
        });
        return expect(atom.workspace.addModalPanel).toHaveBeenCalled();
      });
    });
    describe(".gitRemoteBranches", function() {
      beforeEach(function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve('branch1\nbranch2'));
        return waitsForPromise(function() {
          return gitRemoteBranches(repo);
        });
      });
      return it("displays a list of the repo's remote branches", function() {
        expect(git.cmd).toHaveBeenCalledWith(['branch', '-r'], {
          cwd: repo.getWorkingDirectory()
        });
        return expect(atom.workspace.addModalPanel).toHaveBeenCalled();
      });
    });
    return describe(".newBranch", function() {
      beforeEach(function() {
        spyOn(git, 'cmd').andReturn(function() {
          return Promise.reject('new branch created');
        });
        return newBranch(repo);
      });
      return it("displays a text input", function() {
        return expect(atom.workspace.addModalPanel).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtYnJhbmNoLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlGQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQXlCLE9BQUEsQ0FBUSxhQUFSLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FEUCxDQUFBOztBQUFBLEVBRUEsUUFJSSxPQUFBLENBQVEsNkJBQVIsQ0FKSixFQUNFLG9CQUFBLFdBREYsRUFFRSwwQkFBQSxpQkFGRixFQUdFLGtCQUFBLFNBTEYsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNwQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDUCxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IsZUFBdEIsQ0FBc0MsQ0FBQyxjQUF2QyxDQUFBLEVBRE87SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBR0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0Isa0JBQWhCLENBQTVCLENBQUEsQ0FBQTtlQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLFdBQUEsQ0FBWSxJQUFaLEVBQUg7UUFBQSxDQUFoQixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFJQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQSxHQUFBO0FBQzNDLFFBQUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxRQUFELENBQXJDLEVBQWlEO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUFqRCxDQUFBLENBQUE7ZUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUF0QixDQUFvQyxDQUFDLGdCQUFyQyxDQUFBLEVBRjJDO01BQUEsQ0FBN0MsRUFMdUI7SUFBQSxDQUF6QixDQUhBLENBQUE7QUFBQSxJQVlBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7QUFDN0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixrQkFBaEIsQ0FBNUIsQ0FBQSxDQUFBO2VBQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsaUJBQUEsQ0FBa0IsSUFBbEIsRUFBSDtRQUFBLENBQWhCLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsUUFBQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLFFBQUQsRUFBVyxJQUFYLENBQXJDLEVBQXVEO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUF2RCxDQUFBLENBQUE7ZUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUF0QixDQUFvQyxDQUFDLGdCQUFyQyxDQUFBLEVBRmtEO01BQUEsQ0FBcEQsRUFMNkI7SUFBQSxDQUEvQixDQVpBLENBQUE7V0FxQkEsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsU0FBQSxHQUFBO2lCQUFHLE9BQU8sQ0FBQyxNQUFSLENBQWUsb0JBQWYsRUFBSDtRQUFBLENBQTVCLENBQUEsQ0FBQTtlQUNBLFNBQUEsQ0FBVSxJQUFWLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7ZUFDMUIsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBdEIsQ0FBb0MsQ0FBQyxnQkFBckMsQ0FBQSxFQUQwQjtNQUFBLENBQTVCLEVBTHFCO0lBQUEsQ0FBdkIsRUF0Qm9CO0VBQUEsQ0FBdEIsQ0FSQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-branch-spec.coffee
