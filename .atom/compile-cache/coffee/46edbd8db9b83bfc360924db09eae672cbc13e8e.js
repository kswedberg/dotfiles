(function() {
  var RemoveListView, git, gitRemove, notifier, prettify;

  git = require('../git');

  notifier = require('../notifier');

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(repo, _arg) {
    var currentFile, cwd, showSelector, _ref;
    showSelector = (_arg != null ? _arg : {}).showSelector;
    cwd = repo.getWorkingDirectory();
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        return git.cmd(['rm', '-f', '--ignore-unmatch', currentFile], {
          cwd: cwd
        }).then(function(data) {
          return notifier.addSuccess("Removed " + (prettify(data)));
        });
      }
    } else {
      return git.cmd(['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'], {
        cwd: cwd
      }).then(function(data) {
        return new RemoveListView(repo, prettify(data));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1yZW1vdmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUixDQUZqQixDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNWLFFBQUEsb0NBQUE7QUFBQSxJQURrQiwrQkFBRCxPQUFlLElBQWQsWUFDbEIsQ0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQU4sQ0FBQTtBQUFBLElBQ0EsV0FBQSxHQUFjLElBQUksQ0FBQyxVQUFMLDZEQUFvRCxDQUFFLE9BQXRDLENBQUEsVUFBaEIsQ0FEZCxDQUFBO0FBRUEsSUFBQSxJQUFHLHFCQUFBLElBQWlCLENBQUEsWUFBcEI7QUFDRSxNQUFBLElBQUcsTUFBTSxDQUFDLE9BQVAsQ0FBZSxlQUFmLENBQUg7QUFDRSxRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFrQyxDQUFDLE9BQW5DLENBQUEsQ0FBQSxDQUFBO2VBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsa0JBQWIsRUFBaUMsV0FBakMsQ0FBUixFQUF1RDtBQUFBLFVBQUMsS0FBQSxHQUFEO1NBQXZELENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFELEdBQUE7aUJBQVUsUUFBUSxDQUFDLFVBQVQsQ0FBcUIsVUFBQSxHQUFTLENBQUMsUUFBQSxDQUFTLElBQVQsQ0FBRCxDQUE5QixFQUFWO1FBQUEsQ0FETixFQUZGO09BREY7S0FBQSxNQUFBO2FBTUUsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixrQkFBbkIsRUFBdUMsSUFBdkMsRUFBNkMsR0FBN0MsQ0FBUixFQUEyRDtBQUFBLFFBQUMsS0FBQSxHQUFEO09BQTNELENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFELEdBQUE7ZUFBYyxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLFFBQUEsQ0FBUyxJQUFULENBQXJCLEVBQWQ7TUFBQSxDQUROLEVBTkY7S0FIVTtFQUFBLENBSlosQ0FBQTs7QUFBQSxFQWdCQSxRQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxRQUFBLDJCQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFYLENBQVAsQ0FBQTtBQUNBLElBQUEsSUFBRyxJQUFIO0FBQ0U7V0FBQSxtREFBQTt1QkFBQTtBQUNFLHNCQUFBLElBQUssQ0FBQSxDQUFBLENBQUwsR0FBVSxJQUFJLENBQUMsS0FBTCxDQUFXLFdBQVgsQ0FBd0IsQ0FBQSxDQUFBLEVBQWxDLENBREY7QUFBQTtzQkFERjtLQUFBLE1BQUE7YUFJRSxLQUpGO0tBRlM7RUFBQSxDQWhCWCxDQUFBOztBQUFBLEVBd0JBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBeEJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-remove.coffee
