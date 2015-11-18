(function() {
  var BufferedProcess, GitBridge, path;

  GitBridge = require('../lib/git-bridge').GitBridge;

  BufferedProcess = require('atom').BufferedProcess;

  path = require('path');

  describe('GitBridge', function() {
    var gitWorkDir, repo;
    gitWorkDir = "/fake/gitroot/";
    repo = {
      getWorkingDirectory: function() {
        return gitWorkDir;
      },
      relativize: function(fullpath) {
        if (fullpath.startsWith(gitWorkDir)) {
          return fullpath.slice(gitWorkDir.length);
        } else {
          return fullpath;
        }
      }
    };
    beforeEach(function() {
      var done;
      done = false;
      atom.config.set('merge-conflicts.gitPath', '/usr/bin/git');
      GitBridge.locateGitAnd(function(err) {
        if (err != null) {
          throw err;
        }
        return done = true;
      });
      return waitsFor(function() {
        return done;
      });
    });
    it('checks git status for merge conflicts', function() {
      var a, c, conflicts, o, _ref;
      _ref = [], c = _ref[0], a = _ref[1], o = _ref[2];
      GitBridge.process = function(_arg) {
        var args, command, exit, options, stderr, stdout, _ref1;
        command = _arg.command, args = _arg.args, options = _arg.options, stdout = _arg.stdout, stderr = _arg.stderr, exit = _arg.exit;
        _ref1 = [command, args, options], c = _ref1[0], a = _ref1[1], o = _ref1[2];
        stdout('UU lib/file0.rb');
        stdout('AA lib/file1.rb');
        stdout('M  lib/file2.rb');
        exit(0);
        return {
          process: {
            on: function(callback) {}
          }
        };
      };
      conflicts = [];
      GitBridge.withConflicts(repo, function(err, cs) {
        if (err) {
          throw err;
        }
        return conflicts = cs;
      });
      expect(conflicts).toEqual([
        {
          path: 'lib/file0.rb',
          message: 'both modified'
        }, {
          path: 'lib/file1.rb',
          message: 'both added'
        }
      ]);
      expect(c).toBe('/usr/bin/git');
      expect(a).toEqual(['status', '--porcelain']);
      return expect(o).toEqual({
        cwd: gitWorkDir
      });
    });
    describe('isStaged', function() {
      var statusMeansStaged;
      statusMeansStaged = function(status, checkPath) {
        var staged;
        if (checkPath == null) {
          checkPath = 'lib/file2.txt';
        }
        GitBridge.process = function(_arg) {
          var exit, stdout;
          stdout = _arg.stdout, exit = _arg.exit;
          stdout("" + status + " lib/file2.txt");
          exit(0);
          return {
            process: {
              on: function(callback) {}
            }
          };
        };
        staged = null;
        GitBridge.isStaged(repo, checkPath, function(err, b) {
          if (err) {
            throw err;
          }
          return staged = b;
        });
        return staged;
      };
      it('is true if already resolved', function() {
        return expect(statusMeansStaged('M ')).toBe(true);
      });
      it('is true if resolved as ours', function() {
        return expect(statusMeansStaged(' M', 'lib/file1.txt')).toBe(true);
      });
      it('is false if still in conflict', function() {
        return expect(statusMeansStaged('UU')).toBe(false);
      });
      return it('is false if resolved, but then modified', function() {
        return expect(statusMeansStaged('MM')).toBe(false);
      });
    });
    it('checks out "our" version of a file from the index', function() {
      var a, c, called, o, _ref;
      _ref = [], c = _ref[0], a = _ref[1], o = _ref[2];
      GitBridge.process = function(_arg) {
        var args, command, exit, options, _ref1;
        command = _arg.command, args = _arg.args, options = _arg.options, exit = _arg.exit;
        _ref1 = [command, args, options], c = _ref1[0], a = _ref1[1], o = _ref1[2];
        exit(0);
        return {
          process: {
            on: function(callback) {}
          }
        };
      };
      called = false;
      GitBridge.checkoutSide(repo, 'ours', 'lib/file1.txt', function(err) {
        if (err) {
          throw err;
        }
        return called = true;
      });
      expect(called).toBe(true);
      expect(c).toBe('/usr/bin/git');
      expect(a).toEqual(['checkout', '--ours', 'lib/file1.txt']);
      return expect(o).toEqual({
        cwd: gitWorkDir
      });
    });
    it('stages changes to a file', function() {
      var called, p;
      p = "";
      repo.repo = {
        add: function(path) {
          return p = path;
        }
      };
      called = false;
      GitBridge.add(repo, 'lib/file1.txt', function(err) {
        if (err) {
          throw err;
        }
        return called = true;
      });
      expect(called).toBe(true);
      return expect(p).toBe('lib/file1.txt');
    });
    return describe('rebase detection', function() {
      var withRoot;
      withRoot = function(gitDir, callback) {
        var fullDir, saved;
        fullDir = path.join(atom.project.getDirectories()[0].getPath(), gitDir);
        saved = GitBridge._repoGitDir;
        GitBridge._repoGitDir = function() {
          return fullDir;
        };
        callback();
        return GitBridge._repoGitDir = saved;
      };
      it('recognizes a non-interactive rebase', function() {
        return withRoot('rebasing.git', function() {
          return expect(GitBridge.isRebasing()).toBe(true);
        });
      });
      it('recognizes an interactive rebase', function() {
        return withRoot('irebasing.git', function() {
          return expect(GitBridge.isRebasing()).toBe(true);
        });
      });
      return it('returns false if not rebasing', function() {
        return withRoot('merging.git', function() {
          return expect(GitBridge.isRebasing()).toBe(false);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvc3BlYy9naXQtYnJpZGdlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUMsWUFBYSxPQUFBLENBQVEsbUJBQVIsRUFBYixTQUFELENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFERCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUVwQixRQUFBLGdCQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsZ0JBQWIsQ0FBQTtBQUFBLElBRUEsSUFBQSxHQUNFO0FBQUEsTUFBQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7ZUFBRyxXQUFIO01BQUEsQ0FBckI7QUFBQSxNQUNBLFVBQUEsRUFBWSxTQUFDLFFBQUQsR0FBQTtBQUNWLFFBQUEsSUFBRyxRQUFRLENBQUMsVUFBVCxDQUFvQixVQUFwQixDQUFIO2lCQUNFLFFBQVMsMEJBRFg7U0FBQSxNQUFBO2lCQUdFLFNBSEY7U0FEVTtNQUFBLENBRFo7S0FIRixDQUFBO0FBQUEsSUFVQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sS0FBUCxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLEVBQTJDLGNBQTNDLENBREEsQ0FBQTtBQUFBLE1BR0EsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsU0FBQyxHQUFELEdBQUE7QUFDckIsUUFBQSxJQUFhLFdBQWI7QUFBQSxnQkFBTSxHQUFOLENBQUE7U0FBQTtlQUNBLElB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

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/spec/git-bridge-spec.coffee
