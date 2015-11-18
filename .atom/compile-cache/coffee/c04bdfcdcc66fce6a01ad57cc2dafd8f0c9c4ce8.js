(function() {
  module.exports = {
    activate: function() {
      atom.commands.add('atom-text-editor', 'column-select:up', (function(_this) {
        return function() {
          return _this.columnSelect(false, 1);
        };
      })(this));
      atom.commands.add('atom-text-editor', 'column-select:down', (function(_this) {
        return function() {
          return _this.columnSelect(true, 1);
        };
      })(this));
      atom.commands.add('atom-text-editor', 'column-select:pageup', (function(_this) {
        return function() {
          return _this.columnSelect(false, 'page');
        };
      })(this));
      atom.commands.add('atom-text-editor', 'column-select:pagedown', (function(_this) {
        return function() {
          return _this.columnSelect(true, 'page');
        };
      })(this));
      atom.commands.add('atom-text-editor', 'column-select:top', (function(_this) {
        return function() {
          return _this.columnSelect(false, 0);
        };
      })(this));
      return atom.commands.add('atom-text-editor', 'column-select:bottom', (function(_this) {
        return function() {
          return _this.columnSelect(true, 0);
        };
      })(this));
    },
    allSelectionsAtEnd: function(editor, selections) {
      var ranges, selection;
      ranges = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = selections.length; _i < _len; _i++) {
          selection = selections[_i];
          _results.push(selection.getBufferRange());
        }
        return _results;
      })();
      if (ranges.every(function(r) {
        return r.isEmpty() && r.start.column === 0;
      })) {
        return false;
      }
      return ranges.every(function(r) {
        return r.isEmpty() && r.start.column === editor.buffer.lineLengthForRow(r.start.row);
      });
    },
    doSelect: function(editor, tabRanges, forward, numLines, atEnd) {
      var endRow, lineCount, previousRow, range, rangesToAdd, row, selCount, startRow, tailRange, visualColumnEnd, visualColumnStart, _i;
      tailRange = tabRanges[tabRanges.length - 1];
      range = tailRange.range.copy();
      if (forward) {
        startRow = range.end.row + 1;
        endRow = editor.getLastBufferRow();
        if (startRow > endRow) {
          return;
        }
      } else {
        startRow = range.start.row - 1;
        endRow = 0;
        if (startRow < 0) {
          return;
        }
      }
      lineCount = 0;
      selCount = 0;
      previousRow = range.start.row;
      visualColumnStart = tailRange.tabColumnStart;
      visualColumnEnd = tailRange.tabColumnEnd;
      rangesToAdd = [];
      for (row = _i = startRow; startRow <= endRow ? _i <= endRow : _i >= endRow; row = startRow <= endRow ? ++_i : --_i) {
        lineCount += 1;
        range.start.row = row;
        range.end.row = row;
        if (atEnd) {
          range.start.column = editor.buffer.lineLengthForRow(range.start.row);
          range.end.column = range.start.column;
        } else {
          if (this.fixTabRange(editor, range, visualColumnStart, visualColumnEnd)) {
            continue;
          }
        }
        rangesToAdd.push(range);
        selCount += 1;
        if (numLines && lineCount >= numLines && selCount > 0) {
          break;
        }
        range = range.copy();
        previousRow = row;
      }
      editor.mergeIntersectingSelections(function() {
        var _j, _len;
        for (_j = 0, _len = rangesToAdd.length; _j < _len; _j++) {
          range = rangesToAdd[_j];
          editor.addSelectionForBufferRange(range);
        }
      });
    },
    undoSelect: function(editor, tabRanges, forward, numLines) {
      var lastRange, rangeIndex, tabRange, total, _, _i;
      total = Math.min(numLines, tabRanges.length - 1);
      rangeIndex = tabRanges.length - 1;
      for (_ = _i = 0; 0 <= total ? _i < total : _i > total; _ = 0 <= total ? ++_i : --_i) {
        tabRange = tabRanges[rangeIndex];
        tabRange.selection.destroy();
        rangeIndex -= 1;
      }
      lastRange = tabRanges[rangeIndex];
      return editor.scrollToBufferPosition(lastRange.range.start);
    },
    columnSelect: function(forward, numLines) {
      var atEnd, editor, groupedRanges, selections, tabRanges, _, _results;
      if (editor = atom.workspace.getActiveTextEditor()) {
        selections = editor.getSelections();
        groupedRanges = this.selectionsToColumns(editor, selections);
        if (numLines === 'page') {
          numLines = editor.getRowsPerPage();
        } else if (numLines === 0) {
          numLines = editor.getLineCount();
        }
        atEnd = this.allSelectionsAtEnd(editor, selections);
        _results = [];
        for (_ in groupedRanges) {
          tabRanges = groupedRanges[_];
          if (this.isUndo(tabRanges, forward)) {
            _results.push(this.undoSelect(editor, tabRanges, forward, numLines));
          } else {
            _results.push(this.doSelect(editor, tabRanges, forward, numLines, atEnd));
          }
        }
        return _results;
      }
    },
    isUndo: function(tabRanges, forward) {
      if (tabRanges.length === 1) {
        return false;
      }
      if (tabRanges[0].row > tabRanges[1].row) {
        return forward;
      } else {
        return !forward;
      }
    },
    selectionsToColumns: function(editor, selections) {
      var key, range, rangesInCol, result, selection, tabRange, _i, _len;
      result = {};
      for (_i = 0, _len = selections.length; _i < _len; _i++) {
        selection = selections[_i];
        range = selection.getBufferRange();
        if (range.start.row !== range.end.row) {
          continue;
        }
        tabRange = this.makeTabRange(editor, selection);
        key = [tabRange.tabColumnStart, tabRange.tabColumnEnd];
        rangesInCol = (result[key] || (result[key] = [])).push(tabRange);
      }
      return result;
    },
    makeTabRange: function(editor, selection) {
      var line, range, result, tabLength, visualColumn, x, _i, _ref;
      range = selection.getBufferRange();
      line = editor.lineTextForBufferRow(range.start.row);
      tabLength = editor.getTabLength();
      visualColumn = 0;
      result = {
        row: range.start.row,
        range: range,
        selection: selection
      };
      for (x = _i = 0, _ref = range.end.column; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        if (x === range.start.column) {
          result.tabColumnStart = visualColumn;
        }
        if (x === range.end.column) {
          result.tabColumnEnd = visualColumn;
        }
        if (line[x] === '\t') {
          visualColumn += tabLength - (visualColumn % tabLength);
        } else {
          visualColumn += 1;
        }
      }
      return result;
    },
    columnFromTabColumn: function(editor, column, row) {
      var actualColumn, line, tabLength, visualColumn, _i, _ref;
      line = editor.lineForBufferRow(row);
      tabLength = editor.getTabLength();
      visualColumn = 0;
      for (actualColumn = _i = 0, _ref = line.length; 0 <= _ref ? _i < _ref : _i > _ref; actualColumn = 0 <= _ref ? ++_i : --_i) {
        if (visualColumn >= column) {
          break;
        }
        if (line[actualColumn] === '\t') {
          visualColumn += tabLength - (visualColumn % tabLength);
        } else {
          visualColumn += 1;
        }
      }
      return actualColumn;
    },
    fixTabRange: function(editor, range, visualColumnStart, visualColumnEnd) {
      var actualColumn, found, line, tabLength, visualColumn, _i, _ref;
      line = editor.lineTextForBufferRow(range.start.row);
      tabLength = editor.getTabLength();
      visualColumn = 0;
      found = 0;
      for (actualColumn = _i = 0, _ref = line.length; 0 <= _ref ? _i <= _ref : _i >= _ref; actualColumn = 0 <= _ref ? ++_i : --_i) {
        if (visualColumn === visualColumnStart) {
          range.start.column = actualColumn;
          found = 1;
        }
        if (visualColumn === visualColumnEnd) {
          range.end.column = actualColumn;
          found = 2;
          break;
        }
        if (line[actualColumn] === '\t') {
          visualColumn += tabLength - (visualColumn % tabLength);
        } else {
          visualColumn += 1;
        }
      }
      switch (found) {
        case 0:
          return true;
        case 1:
          range.end.column = line.length;
      }
      return false;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2x1bW4tc2VsZWN0L2xpYi9jb2x1bW4tc2VsZWN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLGtCQUF0QyxFQUEwRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN4RCxLQUFDLENBQUEsWUFBRCxDQUFjLEtBQWQsRUFBcUIsQ0FBckIsRUFEd0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExRCxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0Msb0JBQXRDLEVBQTRELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzFELEtBQUMsQ0FBQSxZQUFELENBQWMsSUFBZCxFQUFvQixDQUFwQixFQUQwRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVELENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxzQkFBdEMsRUFBOEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDNUQsS0FBQyxDQUFBLFlBQUQsQ0FBYyxLQUFkLEVBQXFCLE1BQXJCLEVBRDREO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQsQ0FKQSxDQUFBO0FBQUEsTUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxC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

//# sourceURL=/Users/kswedberg/.atom/packages/column-select/lib/column-select.coffee
