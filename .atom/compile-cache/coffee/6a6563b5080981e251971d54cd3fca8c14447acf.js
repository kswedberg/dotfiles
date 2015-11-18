(function() {
  var $, ConflictedEditor, GitBridge, util, _;

  $ = require('space-pen').$;

  _ = require('underscore-plus');

  ConflictedEditor = require('../lib/conflicted-editor').ConflictedEditor;

  GitBridge = require('../lib/git-bridge').GitBridge;

  util = require('./util');

  describe('ConflictedEditor', function() {
    var cursors, detectDirty, editor, editorView, linesForMarker, m, pkg, state, _ref;
    _ref = [], editorView = _ref[0], editor = _ref[1], state = _ref[2], m = _ref[3], pkg = _ref[4];
    cursors = function() {
      var c, _i, _len, _ref1, _results;
      _ref1 = editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        c = _ref1[_i];
        _results.push(c.getBufferPosition().toArray());
      }
      return _results;
    };
    detectDirty = function() {
      var sv, _i, _len, _ref1, _results;
      _ref1 = m.coveringViews;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        sv = _ref1[_i];
        if ('detectDirty' in sv) {
          _results.push(sv.detectDirty());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    linesForMarker = function(marker) {
      var fromBuffer, fromScreen, result, row, toBuffer, toScreen, _i, _len, _ref1;
      fromBuffer = marker.getTailBufferPosition();
      fromScreen = editor.screenPositionForBufferPosition(fromBuffer);
      toBuffer = marker.getHeadBufferPosition();
      toScreen = editor.screenPositionForBufferPosition(toBuffer);
      result = $();
      _ref1 = _.range(fromScreen.row, toScreen.row);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        row = _ref1[_i];
        result = result.add(editorView.component.lineNodeForScreenRow(row));
      }
      return result;
    };
    beforeEach(function() {
      var done;
      pkg = util.pkgEmitter();
      done = false;
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
    afterEach(function() {
      pkg.dispose();
      return m != null ? m.cleanup() : void 0;
    });
    describe('with a merge conflict', function() {
      beforeEach(function() {
        return util.openPath("triple-2way-diff.txt", function(v) {
          editorView = v;
          editorView.getFirstVisibleScreenRow = function() {
            return 0;
          };
          editorView.getLastVisibleScreenRow = function() {
            return 999;
          };
          editor = editorView.getModel();
          state = {
            isRebase: false,
            repo: {
              getWorkingDirectory: function() {
                return "";
              },
              relativize: function(filepath) {
                return filepath;
              }
            }
          };
          m = new ConflictedEditor(state, pkg, editor);
          return m.mark();
        });
      });
      it('attaches two SideViews and a NavigationView for each conflict', function() {
        expect($(editorView).find('.side').length).toBe(6);
        return expect($(editorView).find('.navigation').length).toBe(3);
      });
      it('locates the correct lines', function() {
        var lines;
        lines = linesForMarker(m.conflicts[1].ours.marker);
        return expect(lines.text()).toBe("My middle changes");
      });
      it('applies the "ours" class to our sides of conflicts', function() {
        var lines;
        lines = linesForMarker(m.conflicts[0].ours.marker);
        return expect(lines.hasClass('conflict-ours')).toBe(true);
      });
      it('applies the "theirs" class to their sides of conflicts', function() {
        var lines;
        lines = linesForMarker(m.conflicts[0].theirs.marker);
        return expect(lines.hasClass('conflict-theirs')).toBe(true);
      });
      it('applies the "dirty" class to modified sides', function() {
        var lines;
        editor.setCursorBufferPosition([14, 0]);
        editor.insertText("Make conflict 1 dirty");
        detectDirty();
        lines = linesForMarker(m.conflicts[1].ours.marker);
        expect(lines.hasClass('conflict-dirty')).toBe(true);
        return expect(lines.hasClass('conflict-ours')).toBe(false);
      });
      it('broadcasts the onDidResolveConflict event', function() {
        var event;
        event = null;
        pkg.onDidResolveConflict(function(e) {
          return event = e;
        });
        m.conflicts[2].theirs.resolve();
        expect(event.file).toBe(editor.getPath());
        expect(event.total).toBe(3);
        expect(event.resolved).toBe(1);
        return expect(event.source).toBe(m);
      });
      it('tracks the active conflict side', function() {
        editor.setCursorBufferPosition([11, 0]);
        expect(m.active()).toEqual([]);
        editor.setCursorBufferPosition([14, 5]);
        return expect(m.active()).toEqual([m.conflicts[1].ours]);
      });
      describe('with an active merge conflict', function() {
        var active;
        active = [][0];
        beforeEach(function() {
          editor.setCursorBufferPosition([14, 5]);
          return active = m.conflicts[1];
        });
        it('accepts the current side with merge-conflicts:accept-current', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-current');
          return expect(active.resolution).toBe(active.ours);
        });
        it("does nothing if you have cursors in both sides", function() {
          editor.addCursorAtBufferPosition([16, 2]);
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-current');
          return expect(active.resolution).toBeNull();
        });
        it('accepts "ours" on merge-conflicts:accept-ours', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-current');
          return expect(active.resolution).toBe(active.ours);
        });
        it('accepts "theirs" on merge-conflicts:accept-theirs', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-theirs');
          return expect(active.resolution).toBe(active.theirs);
        });
        it('jumps to the next unresolved on merge-conflicts:next-unresolved', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:next-unresolved');
          return expect(cursors()).toEqual([[22, 0]]);
        });
        it('jumps to the previous unresolved on merge-conflicts:previous-unresolved', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:previous-unresolved');
          return expect(cursors()).toEqual([[5, 0]]);
        });
        it('reverts a dirty hunk on merge-conflicts:revert-current', function() {
          editor.insertText('this is a change');
          detectDirty();
          expect(active.ours.isDirty).toBe(true);
          atom.commands.dispatch(editorView, 'merge-conflicts:revert-current');
          detectDirty();
          return expect(active.ours.isDirty).toBe(false);
        });
        it('accepts ours-then-theirs on merge-conflicts:ours-then-theirs', function() {
          var t;
          atom.commands.dispatch(editorView, 'merge-conflicts:ours-then-theirs');
          expect(active.resolution).toBe(active.ours);
          t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
          return expect(t).toBe("My middle changes\nYour middle changes\n");
        });
        return it('accepts theirs-then-ours on merge-conflicts:theirs-then-ours', function() {
          var t;
          atom.commands.dispatch(editorView, 'merge-conflicts:theirs-then-ours');
          expect(active.resolution).toBe(active.theirs);
          t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
          return expect(t).toBe("Your middle changes\nMy middle changes\n");
        });
      });
      describe('without an active conflict', function() {
        beforeEach(function() {
          return editor.setCursorBufferPosition([11, 6]);
        });
        it('no-ops the resolution commands', function() {
          var c, e, _i, _len, _ref1, _results;
          _ref1 = ['accept-current', 'accept-ours', 'accept-theirs', 'revert-current'];
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            e = _ref1[_i];
            atom.commands.dispatch(editorView, "merge-conflicts:" + e);
            expect(m.active()).toEqual([]);
            _results.push((function() {
              var _j, _len1, _ref2, _results1;
              _ref2 = m.conflicts;
              _results1 = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                c = _ref2[_j];
                _results1.push(expect(c.isResolved()).toBe(false));
              }
              return _results1;
            })());
          }
          return _results;
        });
        it('jumps to the next unresolved on merge-conflicts:next-unresolved', function() {
          expect(m.active()).toEqual([]);
          atom.commands.dispatch(editorView, 'merge-conflicts:next-unresolved');
          return expect(cursors()).toEqual([[14, 0]]);
        });
        return it('jumps to the previous unresolved on merge-conflicts:next-unresolved', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:previous-unresolved');
          return expect(cursors()).toEqual([[5, 0]]);
        });
      });
      describe('when the resolution is complete', function() {
        beforeEach(function() {
          var c, _i, _len, _ref1, _results;
          _ref1 = m.conflicts;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            c = _ref1[_i];
            _results.push(c.ours.resolve());
          }
          return _results;
        });
        it('removes all of the CoveringViews', function() {
          expect($(editorView).find('.overlayer .side').length).toBe(0);
          return expect($(editorView).find('.overlayer .navigation').length).toBe(0);
        });
        return it('appends a ResolverView to the workspace', function() {
          var workspaceView;
          workspaceView = atom.views.getView(atom.workspace);
          return expect($(workspaceView).find('.resolver').length).toBe(1);
        });
      });
      return describe('when all resolutions are complete', function() {
        beforeEach(function() {
          var c, _i, _len, _ref1;
          _ref1 = m.conflicts;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            c = _ref1[_i];
            c.theirs.resolve();
          }
          return pkg.didCompleteConflictResolution();
        });
        it('destroys all Conflict markers', function() {
          var c, marker, _i, _len, _ref1, _results;
          _ref1 = m.conflicts;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            c = _ref1[_i];
            _results.push((function() {
              var _j, _len1, _ref2, _results1;
              _ref2 = c.markers();
              _results1 = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                marker = _ref2[_j];
                _results1.push(expect(marker.isDestroyed()).toBe(true));
              }
              return _results1;
            })());
          }
          return _results;
        });
        return it('removes the .conflicted class', function() {
          return expect($(editorView).hasClass('conflicted')).toBe(false);
        });
      });
    });
    return describe('with a rebase conflict', function() {
      var active;
      active = [][0];
      beforeEach(function() {
        return util.openPath("rebase-2way-diff.txt", function(v) {
          editorView = v;
          editorView.getFirstVisibleScreenRow = function() {
            return 0;
          };
          editorView.getLastVisibleScreenRow = function() {
            return 999;
          };
          editor = editorView.getModel();
          state = {
            isRebase: true,
            repo: {
              getWorkingDirectory: function() {
                return "";
              },
              relativize: function(filepath) {
                return filepath;
              }
            }
          };
          m = new ConflictedEditor(state, pkg, editor);
          m.mark();
          editor.setCursorBufferPosition([3, 14]);
          return active = m.conflicts[0];
        });
      });
      it('accepts theirs-then-ours on merge-conflicts:theirs-then-ours', function() {
        var t;
        atom.commands.dispatch(editorView, 'merge-conflicts:theirs-then-ours');
        expect(active.resolution).toBe(active.theirs);
        t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
        return expect(t).toBe("These are your changes\nThese are my changes\n");
      });
      return it('accepts ours-then-theirs on merge-conflicts:ours-then-theirs', function() {
        var t;
        atom.commands.dispatch(editorView, 'merge-conflicts:ours-then-theirs');
        expect(active.resolution).toBe(active.ours);
        t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
        return expect(t).toBe("These are my changes\nThese are your changes\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvc3BlYy9jb25mbGljdGVkLWVkaXRvci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTs7QUFBQSxFQUFDLElBQUssT0FBQSxDQUFRLFdBQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUdDLG1CQUFvQixPQUFBLENBQVEsMEJBQVIsRUFBcEIsZ0JBSEQsQ0FBQTs7QUFBQSxFQUlDLFlBQWEsT0FBQSxDQUFRLG1CQUFSLEVBQWIsU0FKRCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsUUFBQSw2RUFBQTtBQUFBLElBQUEsT0FBc0MsRUFBdEMsRUFBQyxvQkFBRCxFQUFhLGdCQUFiLEVBQXFCLGVBQXJCLEVBQTRCLFdBQTVCLEVBQStCLGFBQS9CLENBQUE7QUFBQSxJQUVBLE9BQUEsR0FBVSxTQUFBLEdBQUE7QUFBRyxVQUFBLDRCQUFBO0FBQUE7QUFBQTtXQUFBLDRDQUFBO3NCQUFBO0FBQUEsc0JBQUEsQ0FBQyxDQUFDLGlCQUFGLENBQUEsQ0FBcUIsQ0FBQyxPQUF0QixDQUFBLEVBQUEsQ0FBQTtBQUFBO3NCQUFIO0lBQUEsQ0FGVixDQUFBO0FBQUEsSUFJQSxXQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSw2QkFBQTtBQUFBO0FBQUE7V0FBQSw0Q0FBQTt1QkFBQTtBQUNFLFFBQUEsSUFBb0IsYUFBQSxJQUFpQixFQUFyQzt3QkFBQSxFQUFFLENBQUMsV0FBSCxDQUFBLEdBQUE7U0FBQSxN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

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/spec/conflicted-editor-spec.coffee
