(function() {
  var GitRemove, currentPane, git, pathToRepoFile, repo, textEditor, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile, textEditor = _ref.textEditor, currentPane = _ref.currentPane;

  GitRemove = require('../../lib/models/git-remove');

  describe("GitRemove", function() {
    beforeEach(function() {
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'getActivePaneItem').andReturn(currentPane);
      spyOn(window, 'confirm').andReturn(true);
      return spyOn(git, 'cmd').andReturn(Promise.resolve(repo.relativize(pathToRepoFile)));
    });
    describe("when there is a current file open", function() {
      return it("calls git.cmd with 'rm' and " + pathToRepoFile, function() {
        var args, _ref1;
        GitRemove(repo);
        args = git.cmd.mostRecentCall.args[0];
        expect(__indexOf.call(args, 'rm') >= 0).toBe(true);
        return expect((_ref1 = repo.relativize(pathToRepoFile), __indexOf.call(args, _ref1) >= 0)).toBe(true);
      });
    });
    return describe("when 'showSelector' is set to true", function() {
      return it("calls git.cmd with '*' instead of " + pathToRepoFile, function() {
        var args;
        GitRemove(repo, {
          showSelector: true
        });
        args = git.cmd.mostRecentCall.args[0];
        return expect(__indexOf.call(args, '*') >= 0).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtcmVtb3ZlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1FQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsT0FBa0QsT0FBQSxDQUFRLGFBQVIsQ0FBbEQsRUFBQyxZQUFBLElBQUQsRUFBTyxzQkFBQSxjQUFQLEVBQXVCLGtCQUFBLFVBQXZCLEVBQW1DLG1CQUFBLFdBRG5DLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLDZCQUFSLENBRlosQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNwQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDUCxNQUFBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixxQkFBdEIsQ0FBNEMsQ0FBQyxTQUE3QyxDQUF1RCxVQUF2RCxDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixtQkFBdEIsQ0FBMEMsQ0FBQyxTQUEzQyxDQUFxRCxXQUFyRCxDQURBLENBQUE7QUFBQSxNQUVBLEtBQUEsQ0FBTSxNQUFOLEVBQWMsU0FBZCxDQUF3QixDQUFDLFNBQXpCLENBQW1DLElBQW5DLENBRkEsQ0FBQTthQUdBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLElBQUksQ0FBQyxVQUFMLENBQWdCLGNBQWhCLENBQWhCLENBQTVCLEVBSk87SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBTUEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTthQUM1QyxFQUFBLENBQUksOEJBQUEsR0FBOEIsY0FBbEMsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELFlBQUEsV0FBQTtBQUFBLFFBQUEsU0FBQSxDQUFVLElBQVYsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FEbkMsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLGVBQVEsSUFBUixFQUFBLElBQUEsTUFBUCxDQUFvQixDQUFDLElBQXJCLENBQTBCLElBQTFCLENBRkEsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxTQUFBLElBQUksQ0FBQyxVQUFMLENBQWdCLGNBQWhCLENBQUEsRUFBQSxlQUFtQyxJQUFuQyxFQUFBLEtBQUEsTUFBQSxDQUFQLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsSUFBckQsRUFKa0Q7TUFBQSxDQUFwRCxFQUQ0QztJQUFBLENBQTlDLENBTkEsQ0FBQTtXQWFBLFFBQUEsQ0FBUyxvQ0FBVCxFQUErQyxTQUFBLEdBQUE7YUFDN0MsRUFBQSxDQUFJLG9DQUFBLEdBQW9DLGNBQXhDLEVBQTBELFNBQUEsR0FBQTtBQUN4RCxZQUFBLElBQUE7QUFBQSxRQUFBLFNBQUEsQ0FBVSxJQUFWLEVBQWdCO0FBQUEsVUFBQSxZQUFBLEVBQWMsSUFBZDtTQUFoQixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUEsR0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQURuQyxDQUFBO2VBRUEsTUFBQSxDQUFPLGVBQU8sSUFBUCxFQUFBLEdBQUEsTUFBUCxDQUFtQixDQUFDLElBQXBCLENBQXlCLElBQXpCLEVBSHdEO01BQUEsQ0FBMUQsRUFENkM7SUFBQSxDQUEvQyxFQWRvQjtFQUFBLENBQXRCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-remove-spec.coffee
