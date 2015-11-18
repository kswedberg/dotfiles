(function() {
  var Path, head, mocks, pathToRepoFile;

  Path = require('flavored-path');

  pathToRepoFile = Path.get("~/some/repository/directory/file");

  head = jasmine.createSpyObj('head', ['replace']);

  module.exports = mocks = {
    pathToRepoFile: pathToRepoFile,
    repo: {
      getPath: function() {
        return Path.join(this.getWorkingDirectory, ".git");
      },
      getWorkingDirectory: function() {
        return Path.get("~/some/repository");
      },
      refreshStatus: function() {
        return void 0;
      },
      relativize: function(path) {
        if (path === pathToRepoFile) {
          return "directory/file";
        }
      },
      getReferences: function() {
        return {
          heads: [head]
        };
      },
      getShortHead: function() {
        return 'short head';
      },
      repo: {
        submoduleForPath: function(path) {
          return void 0;
        }
      }
    },
    currentPane: {
      alive: true,
      activate: function() {
        return void 0;
      },
      destroy: function() {
        return void 0;
      },
      getItems: function() {
        return [
          {
            getURI: function() {
              return pathToRepoFile;
            }
          }
        ];
      }
    },
    commitPane: {
      alive: true,
      destroy: function() {
        return mocks.textEditor.destroy();
      },
      splitRight: function() {
        return void 0;
      },
      getItems: function() {
        return [
          {
            getURI: function() {
              return Path.join(mocks.repo.getPath(), 'COMMIT_EDITMSG');
            }
          }
        ];
      }
    },
    textEditor: {
      getPath: function() {
        return pathToRepoFile;
      },
      getURI: function() {
        return pathToRepoFile;
      },
      onDidDestroy: function(destroy) {
        this.destroy = destroy;
        return {
          dispose: function() {}
        };
      },
      onDidSave: function(save) {
        this.save = save;
        return {
          dispose: function() {
            return void 0;
          }
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL2ZpeHR1cmVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxHQUFMLENBQVMsa0NBQVQsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFPLENBQUMsWUFBUixDQUFxQixNQUFyQixFQUE2QixDQUFDLFNBQUQsQ0FBN0IsQ0FKUCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBQSxHQUNmO0FBQUEsSUFBQSxjQUFBLEVBQWdCLGNBQWhCO0FBQUEsSUFFQSxJQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxtQkFBZixFQUFvQyxNQUFwQyxFQUFIO01BQUEsQ0FBVDtBQUFBLE1BQ0EsbUJBQUEsRUFBcUIsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxtQkFBVCxFQUFIO01BQUEsQ0FEckI7QUFBQSxNQUVBLGFBQUEsRUFBZSxTQUFBLEdBQUE7ZUFBRyxPQUFIO01BQUEsQ0FGZjtBQUFBLE1BR0EsVUFBQSxFQUFZLFNBQUMsSUFBRCxHQUFBO0FBQVUsUUFBQSxJQUFvQixJQUFBLEtBQVEsY0FBNUI7aUJBQUEsaUJBQUE7U0FBVjtNQUFBLENBSFo7QUFBQSxNQUlBLGFBQUEsRUFBZSxTQUFBLEdBQUE7ZUFDYjtBQUFBLFVBQUEsS0FBQSxFQUFPLENBQUMsSUFBRCxDQUFQO1VBRGE7TUFBQSxDQUpmO0FBQUEsTUFNQSxZQUFBLEVBQWMsU0FBQSxHQUFBO2VBQUcsYUFBSDtNQUFBLENBTmQ7QUFBQSxNQU9BLElBQUEsRUFDRTtBQUFBLFFBQUEsZ0JBQUEsRUFBa0IsU0FBQyxJQUFELEdBQUE7aUJBQVUsT0FBVjtRQUFBLENBQWxCO09BUkY7S0FIRjtBQUFBLElBYUEsV0FBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sSUFBUDtBQUFBLE1BQ0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtlQUFHLE9BQUg7TUFBQSxDQURWO0FBQUEsTUFFQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2VBQUcsT0FBSDtNQUFBLENBRlQ7QUFBQSxNQUdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7ZUFBRztVQUNYO0FBQUEsWUFBQSxNQUFBLEVBQVEsU0FBQSxHQUFBO3FCQUFHLGVBQUg7WUFBQSxDQUFSO1dBRFc7VUFBSDtNQUFBLENBSFY7S0FkRjtBQUFBLElBcUJBLFVBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLElBQVA7QUFBQSxNQUNBLE9BQUEsRUFBUyxTQUFBLEdBQUE7ZUFBRyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQWpCLENBQUEsRUFBSDtNQUFBLENBRFQ7QUFBQSxNQUVBLFVBQUEsRUFBWSxTQUFBLEdBQUE7ZUFBRyxPQUFIO01BQUEsQ0FGWjtBQUFBLE1BR0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtlQUFHO1VBQ1g7QUFBQSxZQUFBLE1BQUEsRUFBUSxTQUFBLEdBQUE7cUJBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQVgsQ0FBQSxDQUFWLEVBQWdDLGdCQUFoQyxFQUFIO1lBQUEsQ0FBUjtXQURXO1VBQUg7TUFBQSxDQUhWO0tBdEJGO0FBQUEsSUE2QkEsVUFBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2VBQUcsZUFBSDtNQUFBLENBQVQ7QUFBQSxNQUNBLE1BQUEsRUFBUSxTQUFBLEdBQUE7ZUFBRyxlQUFIO01BQUEsQ0FEUjtBQUFBLE1BRUEsWUFBQSxFQUFjLFNBQUUsT0FBRixHQUFBO0FBQ1osUUFEYSxJQUFDLENBQUEsVUFBQSxPQUNkLENBQUE7ZUFBQTtBQUFBLFVBQUEsT0FBQSxFQUFTLFNBQUEsR0FBQSxDQUFUO1VBRFk7TUFBQSxDQUZkO0FBQUEsTUFJQSxTQUFBLEVBQVcsU0FBRSxJQUFGLEdBQUE7QUFDVCxRQURVLElBQUMsQ0FBQSxPQUFBLElBQ1gsQ0FBQTtlQUFBO0FBQUEsVUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO21CQUFHLE9BQUg7VUFBQSxDQUFUO1VBRFM7TUFBQSxDQUpYO0tBOUJGO0dBUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/fixtures.coffee
