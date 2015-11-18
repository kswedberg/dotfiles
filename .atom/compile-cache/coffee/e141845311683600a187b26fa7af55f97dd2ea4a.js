(function() {
  var StatusListView, fs, git, repo,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs-plus');

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  StatusListView = require('../../lib/views/status-list-view');

  describe("StatusListView", function() {
    describe("when there are modified files", function() {
      it("displays a list of modified files", function() {
        var view;
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        return expect(view.items.length).toBe(2);
      });
      return it("calls git.cmd with 'diff' when user doesn't want to open the file", function() {
        var view;
        spyOn(window, 'confirm').andReturn(false);
        spyOn(git, 'cmd').andReturn(Promise.resolve('foobar'));
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return false;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(__indexOf.call(git.cmd.mostRecentCall.args[0], 'diff') >= 0).toBe(true);
      });
    });
    return describe("when there are unstaged files", function() {
      beforeEach(function() {
        return spyOn(window, 'confirm').andReturn(true);
      });
      it("opens the file when it is a file", function() {
        var view;
        spyOn(atom.workspace, 'open');
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return false;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(atom.workspace.open).toHaveBeenCalled();
      });
      return it("opens the directory in a project when it is a directory", function() {
        var view;
        spyOn(atom, 'open');
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return true;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(atom.open).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL3ZpZXdzL3N0YXR1cy1saXN0LXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkJBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FETixDQUFBOztBQUFBLEVBRUMsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBRkQsQ0FBQTs7QUFBQSxFQUdBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGtDQUFSLENBSGpCLENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLElBQUEsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxNQUFBLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQVcsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixDQUFDLGNBQUQsRUFBaUIsaUJBQWpCLEVBQW9DLEVBQXBDLENBQXJCLENBQVgsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQWxCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsQ0FBL0IsRUFGc0M7TUFBQSxDQUF4QyxDQUFBLENBQUE7YUFJQSxFQUFBLENBQUcsbUVBQUgsRUFBd0UsU0FBQSxHQUFBO0FBQ3RFLFlBQUEsSUFBQTtBQUFBLFFBQUEsS0FBQSxDQUFNLE1BQU4sRUFBYyxTQUFkLENBQXdCLENBQUMsU0FBekIsQ0FBbUMsS0FBbkMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxLQUFBLENBQU0sR0FBTixF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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/views/status-list-view-spec.coffee
