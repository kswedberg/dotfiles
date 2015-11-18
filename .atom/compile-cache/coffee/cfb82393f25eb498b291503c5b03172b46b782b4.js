(function() {
  var LogListView, LogViewURI, amountOfCommitsToShow, git;

  git = require('../git');

  LogListView = require('../views/log-list-view');

  LogViewURI = 'atom://git-plus:log';

  amountOfCommitsToShow = function() {
    return atom.config.get('git-plus.amountOfCommitsToShow');
  };

  module.exports = function(repo, _arg) {
    var currentFile, onlyCurrentFile, _ref;
    onlyCurrentFile = (_arg != null ? _arg : {}).onlyCurrentFile;
    atom.workspace.addOpener(function(uri) {
      if (uri === LogViewURI) {
        return new LogListView;
      }
    });
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    return atom.workspace.open(LogViewURI).then(function(view) {
      if (onlyCurrentFile) {
        return view.currentFileLog(repo, currentFile);
      } else {
        return view.branchLog(repo);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1sb2cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVIsQ0FEZCxDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLHFCQUZiLENBQUE7O0FBQUEsRUFJQSxxQkFBQSxHQUF3QixTQUFBLEdBQUE7V0FDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixFQURzQjtFQUFBLENBSnhCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDZixRQUFBLGtDQUFBO0FBQUEsSUFEdUIsa0NBQUQsT0FBa0IsSUFBakIsZUFDdkIsQ0FBQTtBQUFBLElBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQXlCLFNBQUMsR0FBRCxHQUFBO0FBQ3ZCLE1BQUEsSUFBMEIsR0FBQSxLQUFPLFVBQWpDO0FBQUEsZUFBTyxHQUFBLENBQUEsV0FBUCxDQUFBO09BRHVCO0lBQUEsQ0FBekIsQ0FBQSxDQUFBO0FBQUEsSUFHQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFVBQUwsNkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQixDQUhkLENBQUE7V0FJQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxTQUFDLElBQUQsR0FBQTtBQUNuQyxNQUFBLElBQUcsZUFBSDtlQUNFLElBQUksQ0FBQyxjQUFMLENBQW9CLElBQXBCLEVBQTBCLFdBQTFCLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLEVBSEY7T0FEbUM7SUFBQSxDQUFyQyxFQUxlO0VBQUEsQ0FQakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-log.coffee
