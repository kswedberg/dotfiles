(function() {
  var OutputViewManager, git, notifier;

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
    return git.getConfig('diff.tool').then(function(tool) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmdG9vbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0NBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUVBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQUZwQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ2YsUUFBQSxVQUFBO0FBQUEsSUFEdUIsdUJBQUQsT0FBTyxJQUFOLElBQ3ZCLENBQUE7O01BQUEsT0FBUSxJQUFJLENBQUMsVUFBTCw2REFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCO0tBQVI7QUFDQSxJQUFBLElBQUcsQ0FBQSxJQUFIO0FBQ0UsYUFBTyxRQUFRLENBQUMsT0FBVCxDQUFpQixrQ0FBakIsQ0FBUCxDQURGO0tBREE7V0FLQSxHQUFHLENBQUMsU0FBSixDQUFjLFdBQWQsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxTQUFDLElBQUQsR0FBQTtBQUM5QixNQUFBLElBQUEsQ0FBQSxJQUFBO2VBQ0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsdUNBQWpCLEVBREY7T0FBQSxNQUFBO2VBR0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFlBQUQsRUFBZSxNQUFmLEVBQXVCLElBQXZCLENBQVIsRUFBc0M7QUFBQSxVQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1NBQXRDLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFELEdBQUE7QUFDSixjQUFBLHVEQUFBO0FBQUEsVUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQVosQ0FBQTtBQUFBLFVBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQURwQixDQUFBO0FBQUEsVUFFQSxtQkFBQSxHQUFzQixTQUFTLENBQUMsR0FBVixDQUFjLFNBQUMsSUFBRCxFQUFPLENBQVAsR0FBQTtBQUNsQyxnQkFBQSxZQUFBO0FBQUEsWUFBQSxJQUFHLENBQUEsR0FBSSxDQUFKLEtBQVMsQ0FBWjtBQUNFLGNBQUEsTUFBQSxHQUFTLENBQUEsU0FBYSxDQUFDLElBQVYsQ0FBZSxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBYixDQUFtQixHQUFuQixDQUF3QixDQUFBLENBQUEsQ0FBdkMsQ0FBYixDQUFBO0FBQUEsY0FDQSxJQUFBLEdBQU8sU0FBVSxDQUFBLENBQUEsR0FBRSxDQUFGLENBRGpCLENBQUE7QUFFQSxjQUFBLElBQVEsSUFBQSxLQUFRLElBQVIsSUFBaUIsQ0FBQyxDQUFBLE1BQUEsSUFBVyxpQkFBWixDQUF6Qjt1QkFBQSxLQUFBO2VBSEY7YUFBQSxNQUFBO3FCQUtFLE9BTEY7YUFEa0M7VUFBQSxDQUFkLENBRnRCLENBQUE7QUFVQSxVQUFBLElBQUc7O3VCQUFIO0FBQ0UsWUFBQSxJQUFBLEdBQU8sQ0FBQyxVQUFELEVBQWEsYUFBYixDQUFQLENBQUE7QUFDQSxZQUFBLElBQW9CLGlCQUFwQjtBQUFBLGNBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLENBQUEsQ0FBQTthQURBO0FBQUEsWUFFQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FGQSxDQUFBO21CQUdBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO0FBQUEsY0FBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDthQUFkLENBQ0EsQ0FBQyxPQUFELENBREEsQ0FDTyxTQUFDLEdBQUQsR0FBQTtxQkFBUyxpQkFBaUIsQ0FBQyxLQUFELENBQWpCLENBQUEsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxHQUFoQyxDQUFvQyxDQUFDLE1BQXJDLENBQUEsRUFBVDtZQUFBLENBRFAsRUFKRjtXQUFBLE1BQUE7bUJBT0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsa0JBQWpCLEVBUEY7V0FYSTtRQUFBLENBRE4sRUFIRjtPQUQ4QjtJQUFBLENBQWhDLEVBTmU7RUFBQSxDQUpqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-difftool.coffee
