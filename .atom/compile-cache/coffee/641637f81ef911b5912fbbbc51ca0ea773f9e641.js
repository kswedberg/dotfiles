(function() {
  var BlameViewController, GitBlame, configProject, fs, path, temp;

  path = require('path');

  temp = require('temp');

  fs = require('fs-plus');

  GitBlame = require('../lib/git-blame');

  BlameViewController = require('../lib/controllers/blameViewController');

  configProject = function(projectPath) {
    var tempPath;
    tempPath = temp.mkdirSync(path.basename(projectPath));
    fs.copySync(projectPath, tempPath);
    if (fs.existsSync(path.join(tempPath, 'git.git'))) {
      fs.renameSync(path.join(tempPath, 'git.git'), path.join(tempPath, '.git'));
    }
    return tempPath;
  };

  describe("git-blame", function() {
    beforeEach(function() {
      atom.packages.activatePackage('git-blame');
      return spyOn(BlameViewController, 'toggleBlame');
    });
    describe("when a single git root folder is loaded", function() {
      return it('should toggle blame with the associated git repo', function() {
        var projectPath, tempPath;
        projectPath = path.join(__dirname, 'fixtures', 'repo1');
        tempPath = configProject(projectPath);
        atom.project.setPaths([tempPath]);
        waitsForPromise(function() {
          return atom.project.open(path.join(tempPath, 'a.txt')).then(function(o) {
            var pane;
            pane = atom.workspace.getActivePane();
            return pane.activateItem(o);
          });
        });
        return runs(function() {
          var workspaceElement;
          workspaceElement = atom.views.getView(atom.workspace);
          waitsForPromise(function() {
            return GitBlame.toggleBlame();
          });
          return runs(function() {
            var blamer, expectedGitPath;
            expect(BlameViewController.toggleBlame).toHaveBeenCalled();
            blamer = BlameViewController.toggleBlame.calls[0].args[0];
            expectedGitPath = fs.realpathSync(path.join(tempPath, '.git'));
            return expect(blamer.repo.path).toEqual(expectedGitPath);
          });
        });
      });
    });
    describe("when multiple git root folders are loaded", function() {
      return it('should toggle blame with the associated git repo', function() {
        var projectPath1, projectPath2, tempPath1, tempPath2;
        projectPath1 = path.join(__dirname, 'fixtures', 'repo1');
        tempPath1 = configProject(projectPath1);
        projectPath2 = path.join(__dirname, 'fixtures', 'repo2');
        tempPath2 = configProject(projectPath2);
        atom.project.setPaths([tempPath2, tempPath1]);
        waitsForPromise(function() {
          return atom.project.open(path.join(tempPath1, 'a.txt')).then(function(o) {
            var pane;
            pane = atom.workspace.getActivePane();
            return pane.activateItem(o);
          });
        });
        return runs(function() {
          var workspaceElement;
          workspaceElement = atom.views.getView(atom.workspace);
          waitsForPromise(function() {
            return GitBlame.toggleBlame();
          });
          return runs(function() {
            var blamer, expectedGitPath;
            expect(BlameViewController.toggleBlame).toHaveBeenCalled();
            blamer = BlameViewController.toggleBlame.calls[0].args[0];
            expectedGitPath = fs.realpathSync(path.join(tempPath1, '.git'));
            return expect(blamer.repo.path).toEqual(expectedGitPath);
          });
        });
      });
    });
    return describe("when zero git root folders are active", function() {
      return it('should not toggle blame', function() {
        var projectPath, tempPath;
        projectPath = path.join(__dirname, 'fixtures', 'non-git');
        tempPath = configProject(projectPath);
        atom.project.setPaths([tempPath]);
        waitsForPromise(function() {
          return atom.project.open(path.join(tempPath, 'test.txt')).then(function(o) {
            var pane;
            pane = atom.workspace.getActivePane();
            return pane.activateItem(o);
          });
        });
        return runs(function() {
          var workspaceElement;
          workspaceElement = atom.views.getView(atom.workspace);
          waitsForPromise(function() {
            return GitBlame.toggleBlame();
          });
          return runs(function() {
            return expect(BlameViewController.toggleBlame).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvc3BlYy9naXQtYmxhbWUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNERBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQTRCLE9BQUEsQ0FBUSxNQUFSLENBQTVCLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQTRCLE9BQUEsQ0FBUSxNQUFSLENBRDVCLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQTRCLE9BQUEsQ0FBUSxTQUFSLENBRjVCLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQTRCLE9BQUEsQ0FBUSxrQkFBUixDQUg1QixDQUFBOztBQUFBLEVBSUEsbUJBQUEsR0FBNEIsT0FBQSxDQUFRLHdDQUFSLENBSjVCLENBQUE7O0FBQUEsRUFPQSxhQUFBLEdBQWdCLFNBQUMsV0FBRCxHQUFBO0FBQ1osUUFBQSxRQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsUUFBTCxDQUFjLFdBQWQsQ0FBZixDQUFYLENBQUE7QUFBQSxJQUNBLEVBQUUsQ0FBQyxRQUFILENBQVksV0FBWixFQUF5QixRQUF6QixDQURBLENBQUE7QUFHQSxJQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLFFBQVYsRUFBb0IsU0FBcEIsQ0FBZCxDQUFIO0FBQ0UsTUFBQSxFQUFFLENBQUMsVUFBSCxDQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsUUFBVixFQUFvQixTQUFwQixDQUFkLEVBQThDLElBQUksQ0FBQyxJQUFMLENBQVUsUUFBVixFQUFvQixNQUFwQixDQUE5QyxDQUFBLENBREY7S0FIQTtBQU1BLFdBQU8sUUFBUCxDQVBZO0VBQUEsQ0FQaEIsQ0FBQTs7QUFBQSxFQWdCQSxRQUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/git-blame/spec/git-blame-spec.coffee
