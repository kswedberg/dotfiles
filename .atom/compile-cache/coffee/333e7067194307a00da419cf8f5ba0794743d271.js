(function() {
  var RemoveListView, git, gitRemove, notifier, prettify;

  git = require('../git');

  notifier = require('../notifier');

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(repo, _arg) {
    var currentFile, showSelector, _ref;
    showSelector = (_arg != null ? _arg : {}).showSelector;
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        return git.cmd({
          args: ['rm', '-f', '--ignore-unmatch', currentFile],
          cwd: repo.getWorkingDirectory(),
          stdout: function(data) {
            return notifier.addSuccess("Removed " + (prettify(data)));
          }
        });
      }
    } else {
      return git.cmd({
        args: ['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'],
        cwd: repo.getWorkingDirectory(),
        stdout: function(data) {
          return new RemoveListView(repo, prettify(data));
        }
      });
    }
  };

  prettify = function(data) {
    var file, i, _i, _len, _results;
    data = data.match(/rm ('.*')/g);
    if (data) {
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        file = data[i];
        _results.push(data[i] = file.match(/rm '(.*)'/)[1]);
      }
      return _results;
    } else {
      return data;
    }
  };

  module.exports = gitRemove;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1yZW1vdmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUixDQUZqQixDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNWLFFBQUEsK0JBQUE7QUFBQSxJQURrQiwrQkFBRCxPQUFlLElBQWQsWUFDbEIsQ0FBQTtBQUFBLElBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxVQUFMLDZEQUFvRCxDQUFFLE9BQXRDLENBQUEsVUFBaEIsQ0FBZCxDQUFBO0FBRUEsSUFBQSxJQUFHLHFCQUFBLElBQWlCLENBQUEsWUFBcEI7QUFDRSxNQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsQ0FBZSxlQUFmLENBQUg7QUFDRSxRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFrQyxDQUFDLE9BQW5DLENBQUEsQ0FBQSxDQUFBO2VBQ0EsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxrQkFBYixFQUFpQyxXQUFqQyxDQUFOO0FBQUEsVUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLFVBRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO21CQUNOLFFBQVEsQ0FBQyxVQUFULENBQXFCLFVBQUEsR0FBUyxDQUFDLFFBQUEsQ0FBUyxJQUFULENBQUQsQ0FBOUIsRUFETTtVQUFBLENBRlI7U0FERixFQUZGO09BREY7S0FBQSxNQUFBO2FBU0UsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLGtCQUFuQixFQUF1QyxJQUF2QyxFQUE2QyxHQUE3QyxDQUFOO0FBQUEsUUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLFFBRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2lCQUFjLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsUUFBQSxDQUFTLElBQVQsQ0FBckIsRUFBZDtRQUFBLENBRlI7T0FERixFQVRGO0tBSFU7RUFBQSxDQUpaLENBQUE7O0FBQUEsRUFzQkEsUUFBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsUUFBQSwyQkFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsWUFBWCxDQUFQLENBQUE7QUFDQSxJQUFBLElBQUcsSUFBSDtBQUNFO1dBQUEsbURBQUE7dUJBQUE7QUFDRSxzQkFBQSxJQUFLLENBQUEsQ0FBQSxDQUFMLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFYLENBQXdCLENBQUEsQ0FBQSxFQUFsQyxDQURGO0FBQUE7c0JBREY7S0FBQSxNQUFBO2FBSUUsS0FKRjtLQUZTO0VBQUEsQ0F0QlgsQ0FBQTs7QUFBQSxFQThCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQTlCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-remove.coffee
