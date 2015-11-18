(function() {
  var SelectStageFiles, SelectUnStageFiles, git, pathToRepoFile, repo, _ref;

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  SelectStageFiles = require('../../lib/views/select-stage-files-view');

  SelectUnStageFiles = require('../../lib/views/select-unstage-files-view');

  describe("SelectStageFiles", function() {
    return it("stages the selected files", function() {
      var fileItem, view;
      spyOn(git, 'cmd').andReturn(Promise.resolve(''));
      fileItem = {
        path: pathToRepoFile
      };
      view = new SelectStageFiles(repo, [fileItem]);
      view.confirmSelection();
      view.find('.btn-stage-button').click();
      return expect(git.cmd).toHaveBeenCalledWith(['add', '-f', pathToRepoFile], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

  describe("SelectUnStageFiles", function() {
    return it("unstages the selected files", function() {
      var fileItem, view;
      spyOn(git, 'cmd').andReturn(Promise.resolve(''));
      fileItem = {
        path: pathToRepoFile
      };
      view = new SelectUnStageFiles(repo, [fileItem]);
      view.confirmSelection();
      view.find('.btn-unstage-button').click();
      return expect(git.cmd).toHaveBeenCalledWith(['reset', 'HEAD', '--', pathToRepoFile], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL3ZpZXdzL3NlbGVjdC1zdGFnZS1maWxlcy12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFFQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLE9BQXlCLE9BQUEsQ0FBUSxhQUFSLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FEUCxDQUFBOztBQUFBLEVBRUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHlDQUFSLENBRm5CLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsMkNBQVIsQ0FIckIsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7V0FDM0IsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUEsR0FBQTtBQUM5QixVQUFBLGNBQUE7QUFBQSxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEVBQWhCLENBQTVCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sY0FBTjtPQUZGLENBQUE7QUFBQSxNQUdBLElBQUEsR0FBVyxJQUFBLGdCQUFBLENBQWlCLElBQWpCLEVBQXVCLENBQUMsUUFBRCxDQUF2QixDQUhYLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxtQkFBVixDQUE4QixDQUFDLEtBQS9CLENBQUEsQ0FMQSxDQUFBO2FBTUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLGNBQWQsQ0FBckMsRUFBb0U7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQXBFLEVBUDhCO0lBQUEsQ0FBaEMsRUFEMkI7RUFBQSxDQUE3QixDQUxBLENBQUE7O0FBQUEsRUFlQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO1dBQzdCLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsVUFBQSxjQUFBO0FBQUEsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixFQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLGNBQU47T0FGRixDQUFBO0FBQUEsTUFHQSxJQUFBLEdBQVcsSUFBQSxrQkFBQSxDQUFtQixJQUFuQixFQUF5QixDQUFDLFFBQUQsQ0FBekIsQ0FIWCxDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUpBLENBQUE7QUFBQSxNQUtBLElBQUksQ0FBQyxJQUFMLENBQVUscUJBQVYsQ0FBZ0MsQ0FBQyxLQUFqQyxDQUFBLENBTEEsQ0FBQTthQU1BLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsSUFBbEIsRUFBd0IsY0FBeEIsQ0FBckMsRUFBOEU7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQTlFLEVBUGdDO0lBQUEsQ0FBbEMsRUFENkI7RUFBQSxDQUEvQixDQWZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/views/select-stage-files-view-spec.coffee
