(function() {
  var Range, RangeFinder;

  Range = require('atom').Range;

  module.exports = RangeFinder = (function() {
    RangeFinder.rangesFor = function(editor) {
      return new RangeFinder(editor).ranges();
    };

    function RangeFinder(editor) {
      this.editor = editor;
    }

    RangeFinder.prototype.ranges = function() {
      var selectionRanges;
      selectionRanges = this.selectionRanges();
      if (selectionRanges.length === 0) {
        return [this.sortableRangeFrom(this.sortableRangeForEntireBuffer())];
      } else {
        return selectionRanges.map((function(_this) {
          return function(selectionRange) {
            return _this.sortableRangeFrom(selectionRange);
          };
        })(this));
      }
    };

    RangeFinder.prototype.selectionRanges = function() {
      return this.editor.getSelectedBufferRanges().filter(function(range) {
        return !range.isEmpty();
      });
    };

    RangeFinder.prototype.sortableRangeForEntireBuffer = function() {
      return this.editor.getBuffer().getRange();
    };

    RangeFinder.prototype.sortableRangeFrom = function(selectionRange) {
      var buf, endCol, endRow, startCol, startRow;
      startRow = selectionRange.start.row;
      startCol = 0;
      endRow = selectionRange.end.column === 0 ? selectionRange.end.row - 1 : selectionRange.end.row;
      buf = this.editor.lineTextForBufferRow(endRow);
      endCol = buf ? buf.length : 0;
      return new Range([startRow, startCol], [endRow, endCol]);
    };

    return RangeFinder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW5lcy9saWIvcmFuZ2UtZmluZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosSUFBQSxXQUFDLENBQUEsU0FBRCxHQUFZLFNBQUMsTUFBRCxHQUFBO2FBQ04sSUFBQSxXQUFBLENBQVksTUFBWixDQUFtQixDQUFDLE1BQXBCLENBQUEsRUFETTtJQUFBLENBQVosQ0FBQTs7QUFJYSxJQUFBLHFCQUFFLE1BQUYsR0FBQTtBQUFXLE1BQVYsSUFBQyxDQUFBLFNBQUEsTUFBUyxDQUFYO0lBQUEsQ0FKYjs7QUFBQSwwQkFPQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxlQUFBO0FBQUEsTUFBQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBbEIsQ0FBQTtBQUNBLE1BQUEsSUFBRyxlQUFlLENBQUMsTUFBaEIsS0FBMEIsQ0FBN0I7ZUFDRSxDQUFDLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixJQUFDLENBQUEsNEJBQUQsQ0FBQSxDQUFuQixDQUFELEVBREY7T0FBQSxNQUFBO2VBR0UsZUFBZSxDQUFDLEdBQWhCLENBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxjQUFELEdBQUE7bUJBQ2xCLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixjQUFuQixFQURrQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCLEVBSEY7T0FGTTtJQUFBLENBUFIsQ0FBQTs7QUFBQSwwQkFnQkEsZUFBQSxHQUFpQixTQUFBLEdBQUE7YUFDZixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBaUMsQ0FBQyxNQUFsQyxDQUF5QyxTQUFDLEtBQUQsR0FBQTtlQUN2QyxDQUFBLEtBQVMsQ0FBQyxPQUFOLENBQUEsRUFEbUM7TUFBQSxDQUF6QyxFQURlO0lBQUEsQ0FoQmpCLENBQUE7O0FBQUEsMEJBcUJBLDRCQUFBLEdBQThCLFNBQUEsR0FBQTthQUM1QixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFFBQXBCLENBQUEsRUFENEI7SUFBQSxDQXJCOUIsQ0FBQTs7QUFBQSwwQkF5QkEsaUJBQUEsR0FBbUIsU0FBQyxjQUFELEdBQUE7QUFDakIsVUFBQSx1Q0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBaEMsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLENBRFgsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFZLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBbkIsS0FBNkIsQ0FBaEMsR0FDUCxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQW5CLEdBQXlCLENBRGxCLEdBR1AsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUxyQixDQUFBO0FBQUEsTUFNQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixNQUE3QixDQU5OLENBQUE7QUFBQSxNQU9BLE1BQUEsR0FBWSxHQUFILEdBQ1AsR0FBRyxDQUFDLE1BREcsR0FHUCxDQVZGLENBQUE7YUFZSSxJQUFBLEtBQUEsQ0FBTSxDQUFDLFFBQUQsRUFBVyxRQUFYLENBQU4sRUFBNEIsQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUE1QixFQWJhO0lBQUEsQ0F6Qm5CLENBQUE7O3VCQUFBOztNQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/lines/lib/range-finder.coffee
