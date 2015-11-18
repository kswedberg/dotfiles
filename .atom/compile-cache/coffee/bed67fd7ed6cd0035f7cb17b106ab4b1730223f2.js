(function() {
  var LogListView, ViewUriLog, amountOfCommitsToShow, git, gitLog;

  git = require('../git');

  LogListView = require('../views/log-list-view');

  ViewUriLog = 'atom://git-plus:log';

  amountOfCommitsToShow = function() {
    return atom.config.get('git-plus.amountOfCommitsToShow');
  };

  gitLog = function(repo, _arg) {
    var currentFile, onlyCurrentFile, _ref;
    onlyCurrentFile = (_arg != null ? _arg : {}).onlyCurrentFile;
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    atom.workspace.addOpener(function(filePath) {
      if (filePath === ViewUriLog) {
        return new LogListView;
      }
    });
    return atom.workspace.open(ViewUriLog).done(function(view) {
      if (view instanceof LogListView) {
        view.setRepo(repo);
        if (onlyCurrentFile) {
          return view.currentFileLog(onlyCurrentFile, currentFile);
        } else {
          return view.branchLog();
        }
      }
    });
  };

  module.exports = gitLog;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1sb2cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJEQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVIsQ0FEZCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLHFCQUZiLENBQUE7O0FBQUEsRUFJQSxxQkFBQSxHQUF3QixTQUFBLEdBQUE7V0FDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixFQURzQjtFQUFBLENBSnhCLENBQUE7O0FBQUEsRUFPQSxNQUFBLEdBQVMsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ1AsUUFBQSxrQ0FBQTtBQUFBLElBRGUsa0NBQUQsT0FBa0IsSUFBakIsZUFDZixDQUFBO0FBQUEsSUFBQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFVBQUwsNkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQixDQUFkLENBQUE7QUFBQSxJQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixDQUF5QixTQUFDLFFBQUQsR0FBQTtBQUN2QixNQUFBLElBQTBCLFFBQUEsS0FBWSxVQUF0QztBQUFBLGVBQU8sR0FBQSxDQUFBLFdBQVAsQ0FBQTtPQUR1QjtJQUFBLENBQXpCLENBRkEsQ0FBQTtXQUtBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLFNBQUMsSUFBRCxHQUFBO0FBQ25DLE1BQUEsSUFBRyxJQUFBLFlBQWdCLFdBQW5CO0FBQ0UsUUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBQSxDQUFBO0FBQ0EsUUFBQSxJQUFHLGVBQUg7aUJBQ0UsSUFBSSxDQUFDLGNBQUwsQ0FBb0IsZUFBcEIsRUFBcUMsV0FBckMsRUFERjtTQUFBLE1BQUE7aUJBR0UsSUFBSSxDQUFDLFNBQUwsQ0FBQSxFQUhGO1NBRkY7T0FEbUM7SUFBQSxDQUFyQyxFQU5PO0VBQUEsQ0FQVCxDQUFBOztBQUFBLEVBcUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BckJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-log.coffee
