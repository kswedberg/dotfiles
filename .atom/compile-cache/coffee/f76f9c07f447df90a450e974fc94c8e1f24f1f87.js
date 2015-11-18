(function() {
  var Conflict, NavigationView, util;

  NavigationView = require('../../lib/view/navigation-view').NavigationView;

  Conflict = require('../../lib/conflict').Conflict;

  util = require('../util');

  describe('NavigationView', function() {
    var conflict, conflicts, editor, editorView, view, _ref;
    _ref = [], view = _ref[0], editorView = _ref[1], editor = _ref[2], conflicts = _ref[3], conflict = _ref[4];
    beforeEach(function() {
      return util.openPath("triple-2way-diff.txt", function(v) {
        editorView = v;
        editor = editorView.getModel();
        conflicts = Conflict.all({}, editor);
        conflict = conflicts[1];
        return view = new NavigationView(conflict.navigator, editor);
      });
    });
    it('deletes the separator line on resolution', function() {
      var c, text, _i, _len;
      for (_i = 0, _len = conflicts.length; _i < _len; _i++) {
        c = conflicts[_i];
        c.ours.resolve();
      }
      text = editor.getText();
      return expect(text).not.toContain("My middle changes\n=======\nYour middle changes");
    });
    it('scrolls to the next diff', function() {
      var p;
      spyOn(editor, "setCursorBufferPosition");
      view.down();
      p = conflicts[2].ours.marker.getTailBufferPosition();
      return expect(editor.setCursorBufferPosition).toHaveBeenCalledWith(p);
    });
    return it('scrolls to the previous diff', function() {
      var p;
      spyOn(editor, "setCursorBufferPosition");
      view.up();
      p = conflicts[0].ours.marker.getTailBufferPosition();
      return expect(editor.setCursorBufferPosition).toHaveBeenCalledWith(p);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvc3BlYy92aWV3L25hdmlnYXRpb24tdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4QkFBQTs7QUFBQSxFQUFDLGlCQUFrQixPQUFBLENBQVEsZ0NBQVIsRUFBbEIsY0FBRCxDQUFBOztBQUFBLEVBRUMsV0FBWSxPQUFBLENBQVEsb0JBQVIsRUFBWixRQUZELENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FIUCxDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixRQUFBLG1EQUFBO0FBQUEsSUFBQSxPQUFrRCxFQUFsRCxFQUFDLGNBQUQsRUFBTyxvQkFBUCxFQUFtQixnQkFBbkIsRUFBMkIsbUJBQTNCLEVBQXNDLGtCQUF0QyxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBSSxDQUFDLFFBQUwsQ0FBYyxzQkFBZCxFQUFzQyxTQUFDLENBQUQsR0FBQTtBQUNwQyxRQUFBLFVBQUEsR0FBYSxDQUFiLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxVQUFVLENBQUMsUUFBWCxDQUFBLENBRFQsQ0FBQTtBQUFBLFFBRUEsU0FBQSxHQUFZLFFBQVEsQ0FBQyxHQUFULENBQWEsRUFBYixFQUFpQixNQUFqQixDQUZaLENBQUE7QUFBQSxRQUdBLFFBQUEsR0FBVyxTQUFVLENBQUEsQ0FBQSxDQUhyQixDQUFBO2VBS0EsSUFBQSxHQUFXLElBQUEsY0FBQSxDQUFlLFFBQVEsQ0FBQyxTQUF4QixFQUFtQyxNQUFuQyxFQU55QjtNQUFBLENBQXRDLEVBRFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBV0EsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUEsR0FBQTtBQUM3QyxVQUFBLGlCQUFBO0FBQUEsV0FBQSxnREFBQTswQkFBQTtBQUFBLFFBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQUEsQ0FBQSxDQUFBO0FBQUEsT0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FEUCxDQUFBO2FBRUEsTUFBQSxDQUFPLElBQVAsQ0FBWSxDQUFDLEdBQUcsQ0FBQyxTQUFqQixDQUEyQixpREFBM0IsRUFINkM7SUFBQSxDQUEvQyxDQVhBLENBQUE7QUFBQSxJQWdCQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFVBQUEsQ0FBQTtBQUFBLE1BQUEsS0FBQSxDQUFNLE1BQU4sRUFBYyx5QkFBZCxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxDQUFBLEdBQUksU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXpCLENBQUEsQ0FGSixDQUFBO2FBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBZCxDQUFzQyxDQUFDLG9CQUF2QyxDQUE0RCxDQUE1RCxFQUo2QjtJQUFBLENBQS9CLENBaEJBLENBQUE7V0FzQkEsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxVQUFBLENBQUE7QUFBQSxNQUFBLEtBQUEsQ0FBTSxNQUFOLEVBQWMseUJBQWQsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsRUFBTCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsQ0FBQSxHQUFJLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUF6QixDQUFBLENBRkosQ0FBQTthQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQWQsQ0FBc0MsQ0FBQyxvQkFBdkMsQ0FBNEQsQ0FBNUQsRUFKaUM7SUFBQSxDQUFuQyxFQXZCeUI7RUFBQSxDQUEzQixDQUxBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/spec/view/navigation-view-spec.coffee
