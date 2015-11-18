(function() {
  var GitLog, LogListView, git, logFileURI, pathToRepoFile, repo, view, _ref;

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  GitLog = require('../../lib/models/git-log');

  LogListView = require('../../lib/views/log-list-view');

  view = new LogListView;

  logFileURI = 'atom://git-plus:log';

  describe("GitLog", function() {
    beforeEach(function() {
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(view));
      spyOn(atom.workspace, 'addOpener');
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn({
        getPath: function() {
          return pathToRepoFile;
        }
      });
      spyOn(view, 'branchLog');
      return waitsForPromise(function() {
        return GitLog(repo);
      });
    });
    it("adds a custom opener for the log file URI", function() {
      return expect(atom.workspace.addOpener).toHaveBeenCalled();
    });
    it("opens the log file URI", function() {
      return expect(atom.workspace.open).toHaveBeenCalledWith(logFileURI);
    });
    it("calls branchLog on the view", function() {
      return expect(view.branchLog).toHaveBeenCalledWith(repo);
    });
    return describe("when 'onlyCurrentFile' option is true", function() {
      return it("calls currentFileLog on the view", function() {
        spyOn(view, 'currentFileLog');
        waitsForPromise(function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        });
        return runs(function() {
          return expect(view.currentFileLog).toHaveBeenCalledWith(repo, repo.relativize(pathToRepoFile));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vZGVscy9naXQtbG9nLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNFQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQXlCLE9BQUEsQ0FBUSxhQUFSLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FEUCxDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSwwQkFBUixDQUZULENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQWMsT0FBQSxDQUFRLCtCQUFSLENBSGQsQ0FBQTs7QUFBQSxFQUtBLElBQUEsR0FBTyxHQUFBLENBQUEsV0FMUCxDQUFBOztBQUFBLEVBTUEsVUFBQSxHQUFhLHFCQU5iLENBQUE7O0FBQUEsRUFRQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7QUFDakIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IsTUFBdEIsQ0FBNkIsQ0FBQyxTQUE5QixDQUF3QyxPQUFPLENBQUMsT0FBUixDQUFnQixJQUFoQixDQUF4QyxDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixXQUF0QixDQURBLENBQUE7QUFBQSxNQUVBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixxQkFBdEIsQ0FBNEMsQ0FBQyxTQUE3QyxDQUF1RDtBQUFBLFFBQUUsT0FBQSxFQUFTLFNBQUEsR0FBQTtpQkFBRyxlQUFIO1FBQUEsQ0FBWDtPQUF2RCxDQUZBLENBQUE7QUFBQSxNQUdBLEtBQUEsQ0FBTSxJQUFOLEVBQVksV0FBWixDQUhBLENBQUE7YUFJQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLE1BQUEsQ0FBTyxJQUFQLEVBQUg7TUFBQSxDQUFoQixFQUxTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQU9BLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7YUFDOUMsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBdEIsQ0FBZ0MsQ0FBQyxnQkFBakMsQ0FBQSxFQUQ4QztJQUFBLENBQWhELENBUEEsQ0FBQTtBQUFBLElBVUEsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTthQUMzQixNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUF0QixDQUEyQixDQUFDLG9CQUE1QixDQUFpRCxVQUFqRCxFQUQyQjtJQUFBLENBQTdCLENBVkEsQ0FBQTtBQUFBLElBYUEsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTthQUNoQyxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVosQ0FBc0IsQ0FBQyxvQkFBdkIsQ0FBNEMsSUFBNUMsRUFEZ0M7SUFBQSxDQUFsQyxDQWJBLENBQUE7V0FnQkEsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUEsR0FBQTthQUNoRCxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLFFBQUEsS0FBQSxDQUFNLElBQU4sRUFBWSxnQkFBWixDQUFBLENBQUE7QUFBQSxRQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLE1BQUEsQ0FBTyxJQUFQLEVBQWE7QUFBQSxZQUFBLGVBQUEsRUFBaUIsSUFBakI7V0FBYixFQUFIO1FBQUEsQ0FBaEIsQ0FEQSxDQUFBO2VBRUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFDSCxNQUFBLENBQU8sSUFBSSxDQUFDLGNBQVosQ0FBMkIsQ0FBQyxvQkFBNUIsQ0FBaUQsSUFBakQsRUFBdUQsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBdkQsRUFERztRQUFBLENBQUwsRUFIcUM7TUFBQSxDQUF2QyxFQURnRDtJQUFBLENBQWxELEVBakJpQjtFQUFBLENBQW5CLENBUkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/models/git-log-spec.coffee
