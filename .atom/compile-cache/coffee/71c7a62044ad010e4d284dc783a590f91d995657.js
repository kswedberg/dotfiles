(function() {
  var $, Conflict, SideView, util;

  $ = require('space-pen').$;

  SideView = require('../../lib/view/side-view').SideView;

  Conflict = require('../../lib/conflict').Conflict;

  util = require('../util');

  describe('SideView', function() {
    var editorView, ours, text, theirs, view, _ref;
    _ref = [], view = _ref[0], editorView = _ref[1], ours = _ref[2], theirs = _ref[3];
    text = function() {
      return editorView.getModel().getText();
    };
    beforeEach(function() {
      return util.openPath("single-2way-diff.txt", function(v) {
        var conflict, editor, _ref1;
        editor = v.getModel();
        editorView = v;
        conflict = Conflict.all({
          isRebase: false
        }, editor)[0];
        _ref1 = [conflict.ours, conflict.theirs], ours = _ref1[0], theirs = _ref1[1];
        return view = new SideView(ours, editor);
      });
    });
    it('applies its position as a CSS class', function() {
      expect(view.hasClass('top')).toBe(true);
      return expect(view.hasClass('bottom')).toBe(false);
    });
    it('knows if its text is unaltered', function() {
      expect(ours.isDirty).toBe(false);
      return expect(theirs.isDirty).toBe(false);
    });
    describe('when its text has been edited', function() {
      var editor;
      editor = [][0];
      beforeEach(function() {
        editor = editorView.getModel();
        editor.setCursorBufferPosition([1, 0]);
        editor.insertText("I won't keep them, but ");
        return view.detectDirty();
      });
      it('detects that its text has been edited', function() {
        return expect(ours.isDirty).toBe(true);
      });
      it('adds a .dirty class to the view', function() {
        return expect(view.hasClass('dirty')).toBe(true);
      });
      return it('reverts its text back to the original on request', function() {
        var t;
        view.revert();
        view.detectDirty();
        t = editor.getTextInBufferRange(ours.marker.getBufferRange());
        expect(t).toBe("These are my changes\n");
        return expect(ours.isDirty).toBe(false);
      });
    });
    it('triggers conflict resolution', function() {
      spyOn(ours, "resolve");
      view.useMe();
      return expect(ours.resolve).toHaveBeenCalled();
    });
    describe('when chosen as the resolution', function() {
      beforeEach(function() {
        return ours.resolve();
      });
      return it('deletes the marker line', function() {
        return expect(text()).not.toContain("<<<<<<< HEAD");
      });
    });
    return describe('when not chosen as the resolution', function() {
      beforeEach(function() {
        return theirs.resolve();
      });
      it('deletes its lines', function() {
        return expect(text()).not.toContain("These are my changes");
      });
      return it('deletes the marker line', function() {
        return expect(text()).not.toContain("<<<<<<< HEAD");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvc3BlYy92aWV3L3NpZGUtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQkFBQTs7QUFBQSxFQUFDLElBQUssT0FBQSxDQUFRLFdBQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFDQyxXQUFZLE9BQUEsQ0FBUSwwQkFBUixFQUFaLFFBREQsQ0FBQTs7QUFBQSxFQUdDLFdBQVksT0FBQSxDQUFRLG9CQUFSLEVBQVosUUFIRCxDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBSlAsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixRQUFBLDBDQUFBO0FBQUEsSUFBQSxPQUFtQyxFQUFuQyxFQUFDLGNBQUQsRUFBTyxvQkFBUCxFQUFtQixjQUFuQixFQUF5QixnQkFBekIsQ0FBQTtBQUFBLElBRUEsSUFBQSxHQUFPLFNBQUEsR0FBQTthQUFHLFVBQVUsQ0FBQyxRQUFYLENBQUEsQ0FBcUIsQ0FBQyxPQUF0QixDQUFBLEVBQUg7SUFBQSxDQUZQLENBQUE7QUFBQSxJQUlBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFJLENBQUMsUUFBTCxDQUFjLHNCQUFkLEVBQXNDLFNBQUMsQ0FBRCxHQUFBO0FBQ3BDLFlBQUEsdUJBQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxDQUFDLENBQUMsUUFBRixDQUFBLENBQVQsQ0FBQTtBQUFBLFFBQ0EsVUFBQSxHQUFhLENBRGIsQ0FBQTtBQUFBLFFBRUEsUUFBQSxHQUFXLFFBQVEsQ0FBQyxHQUFULENBQWE7QUFBQSxVQUFFLFFBQUEsRUFBVSxLQUFaO1NBQWIsRUFBa0MsTUFBbEMsQ0FBMEMsQ0FBQSxDQUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/spec/view/side-view-spec.coffee
