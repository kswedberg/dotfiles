(function() {
  var Git, configs, findRepo, getCommitLink, getLink, parseRemote;

  findRepo = require('./find-repo');

  Git = require('git-wrapper');

  configs = require('../config/provider.coffee');

  parseRemote = function(remote, config) {
    var exp, m, _i, _len, _ref;
    _ref = config.exps;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      exp = _ref[_i];
      m = remote.match(exp);
      if (m) {
        return {
          host: m[1],
          user: m[2],
          repo: m[3]
        };
      }
    }
    return null;
  };

  getLink = function(remote, hash, config) {
    var data;
    if (data = parseRemote(remote, config)) {
      return config.template.replace('{host}', data.host).replace('{user}', data.user).replace('{repo}', data.repo).replace('{hash}', hash);
    }
    return null;
  };

  getCommitLink = function(file, hash, callback) {
    var git, repoPath;
    repoPath = findRepo(file);
    if (!repoPath) {
      return;
    }
    git = new Git({
      'git-dir': repoPath
    });
    return git.exec('config', {
      get: true
    }, ['atom-blame.browser-url'], function(error, url) {
      var link;
      link = url.replace(/(^\s+|\s+$)/g, '').replace('{hash}', hash);
      if (link) {
        return callback(link);
      }
      return git.exec('config', {
        get: true
      }, ['remote.origin.url'], function(error, remote) {
        var config, _i, _len;
        if (error) {
          return console.error(error);
        }
        remote = remote.replace(/(^\s+|\s+$)/g, '');
        for (_i = 0, _len = configs.length; _i < _len; _i++) {
          config = configs[_i];
          link = getLink(remote, hash, config);
          if (link) {
            return callback(link);
          }
        }
        return callback(null);
      });
    });
  };

  module.exports = getCommitLink;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibGFtZS9saWIvdXRpbHMvZ2V0LWNvbW1pdC1saW5rLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyREFBQTs7QUFBQSxFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUFYLENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGFBQVIsQ0FETixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSwyQkFBUixDQUZWLENBQUE7O0FBQUEsRUFJQSxXQUFBLEdBQWMsU0FBQyxNQUFELEVBQVMsTUFBVCxHQUFBO0FBQ1osUUFBQSxzQkFBQTtBQUFBO0FBQUEsU0FBQSwyQ0FBQTtxQkFBQTtBQUNFLE1BQUEsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxLQUFQLENBQWEsR0FBYixDQUFKLENBQUE7QUFDQSxNQUFBLElBQWlELENBQWpEO0FBQUEsZUFBTztBQUFBLFVBQUUsSUFBQSxFQUFNLENBQUUsQ0FBQSxDQUFBLENBQVY7QUFBQSxVQUFjLElBQUEsRUFBTSxDQUFFLENBQUEsQ0FBQSxDQUF0QjtBQUFBLFVBQTBCLElBQUEsRUFBTSxDQUFFLENBQUEsQ0FBQSxDQUFsQztTQUFQLENBQUE7T0FGRjtBQUFBLEtBQUE7QUFJQSxXQUFPLElBQVAsQ0FMWTtFQUFBLENBSmQsQ0FBQTs7QUFBQSxFQVdBLE9BQUEsR0FBVSxTQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsTUFBZixHQUFBO0FBQ1IsUUFBQSxJQUFBO0FBQUEsSUFBQSxJQUFHLElBQUEsR0FBTyxXQUFBLENBQVksTUFBWixFQUFvQixNQUFwQixDQUFWO0FBQ0UsYUFBTyxNQUFNLENBQUMsUUFDWixDQUFDLE9BREksQ0FDSSxRQURKLEVBQ2MsSUFBSSxDQUFDLElBRG5CLENBRUwsQ0FBQyxPQUZJLENBRUksUUFGSixFQUVjLElBQUksQ0FBQyxJQUZuQixDQUdMLENBQUMsT0FISSxDQUdJLFFBSEosRUFHYyxJQUFJLENBQUMsSUFIbkIsQ0FJTCxDQUFDLE9BSkksQ0FJSSxRQUpKLEVBSWMsSUFKZCxDQUFQLENBREY7S0FBQTtBQU9BLFdBQU8sSUFBUCxDQVJRO0VBQUEsQ0FYVixDQUFBOztBQUFBLEVBcUJBLGFBQUEsR0FBZ0IsU0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLFFBQWIsR0FBQTtBQUNkLFFBQUEsYUFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLFFBQUEsQ0FBUyxJQUFULENBQVgsQ0FBQTtBQUVBLElBQUEsSUFBQSxDQUFBLFFBQUE7QUFBQSxZQUFBLENBQUE7S0FGQTtBQUFBLElBSUEsR0FBQSxHQUFVLElBQUEsR0FBQSxDQUFJO0FBQUEsTUFBQSxTQUFBLEVBQVcsUUFBWDtLQUFKLENBSlYsQ0FBQTtXQUtBLEdBQUcsQ0FBQyxJQUFKLENBQVMsUUFBVCxFQUFtQjtBQUFBLE1BQUEsR0FBQSxFQUFLLElBQUw7S0FBbkIsRUFBOEIsQ0FBQyx3QkFBRCxDQUE5QixFQUEwRCxTQUFDLEtBQUQsRUFBUSxHQUFSLEdBQUE7QUFFeEQsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sR0FBRyxDQUFDLE9BQUosQ0FBWSxjQUFaLEVBQTRCLEVBQTVCLENBQ0csQ0FBQyxPQURKLENBQ1ksUUFEWixFQUNzQixJQUR0QixDQUFQLENBQUE7QUFHQSxNQUFBLElBQXlCLElBQXpCO0FBQUEsZUFBTyxRQUFBLENBQVMsSUFBVCxDQUFQLENBQUE7T0FIQTthQUtBLEdBQUcsQ0FBQyxJQUFKLENBQVMsUUFBVCxFQUFtQjtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUw7T0FBbkIsRUFBOEIsQ0FBQyxtQkFBRCxDQUE5QixFQUFxRCxTQUFDLEtBQUQsRUFBUSxNQUFSLEdBQUE7QUFDbkQsWUFBQSxnQkFBQTtBQUFBLFFBQUEsSUFBK0IsS0FBL0I7QUFBQSxpQkFBTyxPQUFPLENBQUMsS0FBUixDQUFjLEtBQWQsQ0FBUCxDQUFBO1NBQUE7QUFBQSxRQUVBLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FBUCxDQUFlLGNBQWYsRUFBK0IsRUFBL0IsQ0FGVCxDQUFBO0FBSUEsYUFBQSw4Q0FBQTsrQkFBQTtBQUNFLFVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLEVBQWdCLElBQWhCLEVBQXNCLE1BQXRCLENBQVAsQ0FBQTtBQUNBLFVBQUEsSUFBeUIsSUFBekI7QUFBQSxtQkFBTyxRQUFBLENBQVMsSUFBVCxDQUFQLENBQUE7V0FGRjtBQUFBLFNBSkE7ZUFRQSxRQUFBLENBQVMsSUFBVCxFQVRtRDtNQUFBLENBQXJELEVBUHdEO0lBQUEsQ0FBMUQsRUFOYztFQUFBLENBckJoQixDQUFBOztBQUFBLEVBOENBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGFBOUNqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/blame/lib/utils/get-commit-link.coffee
