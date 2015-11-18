(function() {
  var FormatText;

  FormatText = require("../../lib/commands/format-text");

  describe("FormatText", function() {
    var editor, formatText, _ref;
    _ref = [], editor = _ref[0], formatText = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe("correctOrderListNumbers", function() {
      beforeEach(function() {
        return formatText = new FormatText("correct-order-list-numbers");
      });
      it("does nothing if it is not an order list", function() {
        editor.setText("text is a long paragraph\ntext is a long paragraph");
        editor.setCursorBufferPosition([0, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe("text is a long paragraph\ntext is a long paragraph");
      });
      return it("correct order list numbers", function() {
        editor.setText("text before\n\n3. aaa\n9. bbb\n0. ccc\n  9. aaa\n    - aaa\n  1. bbb\n  1. ccc\n    0. aaa\n      7. aaa\n        - aaa\n        - bbb\n    9. bbb\n  4. ddd\n7. ddd\n7. eee\n\ntext after");
        editor.setCursorBufferPosition([5, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe("text before\n\n1. aaa\n2. bbb\n3. ccc\n  1. aaa\n    - aaa\n  2. bbb\n  3. ccc\n    1. aaa\n      1. aaa\n        - aaa\n        - bbb\n    2. bbb\n  4. ddd\n4. ddd\n5. eee\n\ntext after");
      });
    });
    return describe("formatTable", function() {
      beforeEach(function() {
        return formatText = new FormatText("format-table");
      });
      it("does nothing if it is not a table", function() {
        editor.setText("text is a long paragraph\ntext is a long paragraph");
        editor.setCursorBufferPosition([0, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe("text is a long paragraph\ntext is a long paragraph");
      });
      it("format table without alignment", function() {
        var expected;
        editor.setText("text before\n\nh1| h21|h1233|h343\n-|-\n|||\nt123           | t2\n |t12|\n\ntext after");
        expected = "text before\n\nh1   | h21 | h1233 | h343\n-----|-----|-------|-----\n     |     |       |\nt123 | t2  |       |\n     | t12 |       |\n\ntext after";
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe(expected);
      });
      return it("format table with alignment", function() {
        var expected;
        editor.setText("text before\n\n|h1-3   | h2-1|h3-2|\n|:-|:-:|--:|:-:|\n| | t2\n|t1| |t3\n|t     |t|    t\n\ntext after");
        expected = "text before\n\n| h1-3 | h2-1 | h3-2 |   |\n|:-----|:----:|-----:|:-:|\n|      |  t2  |      |   |\n| t1   |      |   t3 |   |\n| t    |  t   |    t |   |\n\ntext after";
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        editor.setCursorBufferPosition([4, 3]);
        formatText.trigger();
        return expect(editor.getText()).toBe(expected);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvc3BlYy9jb21tYW5kcy9mb3JtYXQtdGV4dC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxnQ0FBUixDQUFiLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBLEdBQUE7QUFDckIsUUFBQSx3QkFBQTtBQUFBLElBQUEsT0FBdUIsRUFBdkIsRUFBQyxnQkFBRCxFQUFTLG9CQUFULENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGdCQUFwQixFQUFIO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO2FBQ0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtlQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsRUFBWjtNQUFBLENBQUwsRUFGUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFNQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUFHLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQVcsNEJBQVgsRUFBcEI7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BRUEsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtBQUM1QyxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsb0RBQWYsQ0FBQSxDQUFBO0FBQUEsUUFJQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUpBLENBQUE7QUFBQSxRQU1BLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FOQSxDQUFBO2VBT0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG9EQUE5QixFQVI0QztNQUFBLENBQTlDLENBRkEsQ0FBQTthQWVBLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLDRMQUFmLENBQUEsQ0FBQTtBQUFBLFFBcUJBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBckJBLENBQUE7QUFBQSxRQXVCQSxVQUFVLENBQUMsT0FBWCxDQUFBLENBdkJBLENBQUE7ZUF3QkEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDRMQUE5QixFQXpCK0I7TUFBQSxDQUFqQyxFQWhCa0M7SUFBQSxDQUFwQyxDQU5BLENBQUE7V0FxRUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUFHLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQVcsY0FBWCxFQUFwQjtNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFFQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxvREFBZixDQUFBLENBQUE7QUFBQSxRQUlBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBSkEsQ0FBQTtBQUFBLFFBTUEsVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQU5BLENBQUE7ZUFPQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsb0RBQTlCLEVBUnNDO01BQUEsQ0FBeEMsQ0FGQSxDQUFBO0FBQUEsTUFlQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLFlBQUEsUUFBQTtBQUFBLFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSx3RkFBZixDQUFBLENBQUE7QUFBQSxRQVlBLFFBQUEsR0FBVyxxSkFaWCxDQUFBO0FBQUEsUUF3QkEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0F4QkEsQ0FBQTtBQUFBLFFBeUJBLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0F6QkEsQ0FBQTtBQUFBLFFBNEJBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBNUJBLENBQUE7QUFBQSxRQTZCQSxVQUFVLENBQUMsT0FBWCxDQUFBLENBN0JBLENBQUE7ZUE4QkEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFFBQTlCLEVBL0JtQztNQUFBLENBQXJDLENBZkEsQ0FBQTthQWdEQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFlBQUEsUUFBQTtBQUFBLFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSx3R0FBZixDQUFBLENBQUE7QUFBQSxRQVlBLFFBQUEsR0FBVyx5S0FaWCxDQUFBO0FBQUEsUUF3QkEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0F4QkEsQ0FBQTtBQUFBLFFBeUJBLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0F6QkEsQ0FBQTtBQUFBLFFBNEJBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBNUJBLENBQUE7QUFBQSxRQTZCQSxVQUFVLENBQUMsT0FBWCxDQUFBLENBN0JBLENBQUE7ZUE4QkEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFFBQTlCLEVBL0JnQztNQUFBLENBQWxDLEVBakRzQjtJQUFBLENBQXhCLEVBdEVxQjtFQUFBLENBQXZCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/spec/commands/format-text-spec.coffee
