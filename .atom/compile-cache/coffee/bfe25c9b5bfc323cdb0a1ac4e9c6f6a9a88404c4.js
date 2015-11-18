(function() {
  var TagListView, git, gitTags;

  git = require('../git');

  TagListView = require('../views/tag-list-view');

  gitTags = function(repo) {
    this.TagListView = null;
    return git.cmd({
      args: ['tag', '-ln'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return this.TagListView = new TagListView(repo, data);
      },
      exit: function() {
        if (this.TagListView == null) {
          return new TagListView(repo);
        }
      }
    });
  };

  module.exports = gitTags;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC10YWdzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxTQUFDLElBQUQsR0FBQTtBQUNSLElBQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFmLENBQUE7V0FDQSxHQUFHLENBQUMsR0FBSixDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLE1BRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2VBQVUsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksSUFBWixFQUFrQixJQUFsQixFQUE3QjtNQUFBLENBRlI7QUFBQSxNQUdBLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFBRyxRQUFBLElBQTZCLHdCQUE3QjtpQkFBSSxJQUFBLFdBQUEsQ0FBWSxJQUFaLEVBQUo7U0FBSDtNQUFBLENBSE47S0FERixFQUZRO0VBQUEsQ0FIVixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FYakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-tags.coffee
