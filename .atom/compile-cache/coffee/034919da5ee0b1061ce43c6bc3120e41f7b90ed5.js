(function() {
  var OutputViewManager, Path, git, notifier;

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = function(repo, _arg) {
    var file, _ref;
    file = (_arg != null ? _arg : {}).file;
    if (file == null) {
      file = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    }
    if (!file) {
      return notifier.addInfo("No open file. Select 'Diff All'.");
    }
    return git.getConfig('diff.tool', Path.dirname(file)).then(function(tool) {
      if (!tool) {
        return notifier.addInfo("You don't have a difftool configured.");
      } else {
        return git.cmd(['diff-index', 'HEAD', '-z'], {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          var args, diffIndex, diffsForCurrentFile, includeStagedDiff;
          diffIndex = data.split('\0');
          includeStagedDiff = atom.config.get('git-plus.includeStagedDiff');
          diffsForCurrentFile = diffIndex.map(function(line, i) {
            var path, staged;
            if (i % 2 === 0) {
              staged = !/^0{40}$/.test(diffIndex[i].split(' ')[3]);
              path = diffIndex[i + 1];
              if (path === file && (!staged || includeStagedDiff)) {
                return true;
              }
            } else {
              return void 0;
            }
          });
          if (diffsForCurrentFile.filter(function(diff) {
            return diff != null;
          })[0] != null) {
            args = ['difftool', '--no-prompt'];
            if (includeStagedDiff) {
              args.push('HEAD');
            }
            args.push(file);
            return git.cmd(args, {
              cwd: repo.getWorkingDirectory()
            })["catch"](function(msg) {
              return OutputViewManager["new"]().addLine(msg).finish();
            });
          } else {
            return notifier.addInfo('Nothing to show.');
          }
        });
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmdG9vbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FIcEIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNmLFFBQUEsVUFBQTtBQUFBLElBRHVCLHVCQUFELE9BQU8sSUFBTixJQUN2QixDQUFBOztNQUFBLE9BQVEsSUFBSSxDQUFDLFVBQUwsNkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQjtLQUFSO0FBQ0EsSUFBQSxJQUFHLENBQUEsSUFBSDtBQUNFLGFBQU8sUUFBUSxDQUFDLE9BQVQsQ0FBaUIsa0NBQWpCLENBQVAsQ0FERjtLQURBO1dBS0EsR0FBRyxDQUFDLFNBQUosQ0FBYyxXQUFkLEVBQTJCLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixDQUEzQixDQUE4QyxDQUFDLElBQS9DLENBQW9ELFNBQUMsSUFBRCxHQUFBO0FBQ2xELE1BQUEsSUFBQSxDQUFBLElBQUE7ZUFDRSxRQUFRLENBQUMsT0FBVCxDQUFpQix1Q0FBakIsRUFERjtPQUFBLE1BQUE7ZUFHRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsWUFBRCxFQUFlLE1BQWYsRUFBdUIsSUFBdkIsQ0FBUixFQUFzQztBQUFBLFVBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBdEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTtBQUNKLGNBQUEsdURBQUE7QUFBQSxVQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBWixDQUFBO0FBQUEsVUFDQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBRHBCLENBQUE7QUFBQSxVQUVBLG1CQUFBLEdBQXNCLFNBQVMsQ0FBQyxHQUFWLENBQWMsU0FBQyxJQUFELEVBQU8sQ0FBUCxHQUFBO0FBQ2xDLGdCQUFBLFlBQUE7QUFBQSxZQUFBLElBQUcsQ0FBQSxHQUFJLENBQUosS0FBUyxDQUFaO0FBQ0UsY0FBQSxNQUFBLEdBQVMsQ0FBQSxTQUFhLENBQUMsSUFBVixDQUFlLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFiLENBQW1CLEdBQW5CLENBQXdCLENBQUEsQ0FBQSxDQUF2QyxDQUFiLENBQUE7QUFBQSxjQUNBLElBQUEsR0FBTyxTQUFVLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FEakIsQ0FBQTtBQUVBLGNBQUEsSUFBUSxJQUFBLEtBQVEsSUFBUixJQUFpQixDQUFDLENBQUEsTUFBQSxJQUFXLGlCQUFaLENBQXpCO3VCQUFBLEtBQUE7ZUFIRjthQUFBLE1BQUE7cUJBS0UsT0FMRjthQURrQztVQUFBLENBQWQsQ0FGdEIsQ0FBQTtBQVVBLFVBQUEsSUFBRzs7dUJBQUg7QUFDRSxZQUFBLElBQUEsR0FBTyxDQUFDLFVBQUQsRUFBYSxhQUFiLENBQVAsQ0FBQTtBQUNBLFlBQUEsSUFBb0IsaUJBQXBCO0FBQUEsY0FBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsQ0FBQSxDQUFBO2FBREE7QUFBQSxZQUVBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixDQUZBLENBQUE7bUJBR0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7QUFBQSxjQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO2FBQWQsQ0FDQSxDQUFDLE9BQUQsQ0FEQSxDQUNPLFNBQUMsR0FBRCxHQUFBO3FCQUFTLGlCQUFpQixDQUFDLEtBQUQsQ0FBakIsQ0FBQSxDQUF1QixDQUFDLE9BQXhCLENBQWdDLEdBQWhDLENBQW9DLENBQUMsTUFBckMsQ0FBQSxFQUFUO1lBQUEsQ0FEUCxFQUpGO1dBQUEsTUFBQTttQkFPRSxRQUFRLENBQUMsT0FBVCxDQUFpQixrQkFBakIsRUFQRjtXQVhJO1FBQUEsQ0FETixFQUhGO09BRGtEO0lBQUEsQ0FBcEQsRUFOZTtFQUFBLENBTGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-difftool.coffee
