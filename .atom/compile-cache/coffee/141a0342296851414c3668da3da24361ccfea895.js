(function() {
  var CherryPickSelectBranch, git, gitCherryPick;

  git = require('../git');

  CherryPickSelectBranch = require('../views/cherry-pick-select-branch-view');

  gitCherryPick = function(repo) {
    var currentHead, head, heads, i, _i, _len;
    heads = repo.getReferences().heads;
    currentHead = repo.getShortHead();
    for (i = _i = 0, _len = heads.length; _i < _len; i = ++_i) {
      head = heads[i];
      heads[i] = head.replace('refs/heads/', '');
    }
    heads = heads.filter(function(head) {
      return head !== currentHead;
    });
    return new CherryPickSelectBranch(repo, heads, currentHead);
  };

  module.exports = gitCherryPick;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jaGVycnktcGljay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0Esc0JBQUEsR0FBeUIsT0FBQSxDQUFRLHlDQUFSLENBRHpCLENBQUE7O0FBQUEsRUFHQSxhQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBO0FBQ2QsUUFBQSxxQ0FBQTtBQUFBLElBQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBb0IsQ0FBQyxLQUE3QixDQUFBO0FBQUEsSUFDQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFlBQUwsQ0FBQSxDQURkLENBQUE7QUFHQSxTQUFBLG9EQUFBO3NCQUFBO0FBQ0UsTUFBQSxLQUFNLENBQUEsQ0FBQSxDQUFOLEdBQVcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxhQUFiLEVBQTRCLEVBQTVCLENBQVgsQ0FERjtBQUFBLEtBSEE7QUFBQSxJQU1BLEtBQUEsR0FBUSxLQUFLLENBQUMsTUFBTixDQUFhLFNBQUMsSUFBRCxHQUFBO2FBQVUsSUFBQSxLQUFVLFlBQXBCO0lBQUEsQ0FBYixDQU5SLENBQUE7V0FPSSxJQUFBLHNCQUFBLENBQXVCLElBQXZCLEVBQTZCLEtBQTdCLEVBQW9DLFdBQXBDLEVBUlU7RUFBQSxDQUhoQixDQUFBOztBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsYUFiakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-cherry-pick.coffee
