(function() {
  var GitBridge, ResolverView, util,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ResolverView = require('../../lib/view/resolver-view').ResolverView;

  GitBridge = require('../../lib/git-bridge').GitBridge;

  util = require('../util');

  describe('ResolverView', function() {
    var fakeEditor, pkg, state, view, _ref;
    _ref = [], view = _ref[0], fakeEditor = _ref[1], pkg = _ref[2];
    state = {
      repo: {
        getWorkingDirectory: function() {
          return "/fake/gitroot/";
        },
        relativize: function(filepath) {
          return filepath.slice("/fake/gitroot/".length);
        },
        repo: {
          add: function(filepath) {}
        }
      }
    };
    beforeEach(function() {
      var done;
      pkg = util.pkgEmitter();
      fakeEditor = {
        isModified: function() {
          return true;
        },
        getURI: function() {
          return '/fake/gitroot/lib/file1.txt';
        },
        save: function() {},
        onDidSave: function() {}
      };
      atom.config.set('merge-conflicts.gitPath', 'git');
      done = false;
      GitBridge.locateGitAnd(function(err) {
        if (err != null) {
          throw err;
        }
        return done = true;
      });
      waitsFor(function() {
        return done;
      });
      GitBridge.process = function(_arg) {
        var exit, stdout;
        stdout = _arg.stdout, exit = _arg.exit;
        stdout('UU lib/file1.txt');
        exit(0);
        return {
          process: {
            on: function(err) {}
          }
        };
      };
      return view = new ResolverView(fakeEditor, state, pkg);
    });
    it('begins needing both saving and staging', function() {
      view.refresh();
      return expect(view.actionText.text()).toBe('Save and stage');
    });
    it('shows if the file only needs staged', function() {
      fakeEditor.isModified = function() {
        return false;
      };
      view.refresh();
      return expect(view.actionText.text()).toBe('Stage');
    });
    return it('saves and stages the file', function() {
      var p;
      p = null;
      state.repo.repo.add = function(filepath) {
        return p = filepath;
      };
      GitBridge.process = function(_arg) {
        var args, command, exit, options, stdout;
        command = _arg.command, args = _arg.args, options = _arg.options, stdout = _arg.stdout, exit = _arg.exit;
        if (__indexOf.call(args, 'status') >= 0) {
          stdout('M  lib/file1.txt');
          exit(0);
        }
        return {
          process: {
            on: function(err) {}
          }
        };
      };
      spyOn(fakeEditor, 'save');
      view.resolve();
      expect(fakeEditor.save).toHaveBeenCalled();
      return expect(p).toBe('lib/file1.txt');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvc3BlYy92aWV3L3Jlc29sdmVyLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkJBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFDLGVBQWdCLE9BQUEsQ0FBUSw4QkFBUixFQUFoQixZQUFELENBQUE7O0FBQUEsRUFFQyxZQUFhLE9BQUEsQ0FBUSxzQkFBUixFQUFiLFNBRkQsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUixDQUhQLENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsUUFBQSxrQ0FBQTtBQUFBLElBQUEsT0FBMEIsRUFBMUIsRUFBQyxjQUFELEVBQU8sb0JBQVAsRUFBbUIsYUFBbkIsQ0FBQTtBQUFBLElBRUEsS0FBQSxHQUNFO0FBQUEsTUFBQSxJQUFBLEVBQ0U7QUFBQSxRQUFBLG1CQUFBLEVBQXFCLFNBQUEsR0FBQTtpQkFBRyxpQkFBSDtRQUFBLENBQXJCO0FBQUEsUUFDQSxVQUFBLEVBQVksU0FBQyxRQUFELEdBQUE7aUJBQWMsUUFBUyxnQ0FBdkI7UUFBQSxDQURaO0FBQUEsUUFFQSxJQUFBLEVBQ0U7QUFBQSxVQUFBLEdBQUEsRUFBSyxTQUFDLFFBQUQsR0FBQSxDQUFMO1NBSEY7T0FERjtLQUhGLENBQUE7QUFBQSxJQVNBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLElBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsVUFBTCxDQUFBLENBQU4sQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhO0FBQUEsUUFDWCxVQUFBLEVBQVksU0FBQSxHQUFBO2lCQUFHLEtBQUg7UUFBQSxDQUREO0FBQUEsUUFFWCxN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

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/spec/view/resolver-view-spec.coffee
