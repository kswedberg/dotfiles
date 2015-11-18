(function() {
  var git, gitAdd;

  git = require('../git');

  gitAdd = function(repo, _arg) {
    var addAll, file, _ref;
    addAll = (_arg != null ? _arg : {}).addAll;
    if (!addAll) {
      file = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    } else {
      file = null;
    }
    return git.add(repo, {
      file: file
    });
  };

  module.exports = gitAdd;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1hZGQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFdBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNQLFFBQUEsa0JBQUE7QUFBQSxJQURlLHlCQUFELE9BQVMsSUFBUixNQUNmLENBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxNQUFIO0FBQ0UsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFVBQUwsNkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQixDQUFQLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxJQUFBLEdBQU8sSUFBUCxDQUhGO0tBQUE7V0FLQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztBQUFBLE1BQUEsSUFBQSxFQUFNLElBQU47S0FBZCxFQU5PO0VBQUEsQ0FGVCxDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFWakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-add.coffee
