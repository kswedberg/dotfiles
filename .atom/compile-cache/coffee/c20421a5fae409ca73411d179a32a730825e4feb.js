(function() {
  var ColumnSelect, PAGE_SIZE;

  ColumnSelect = require('../lib/column-select');

  PAGE_SIZE = 50;

  describe("ColumnSelect", function() {
    var activationPromise, checkRange, checkSelections, editor, editorView, loadBefore;
    activationPromise = null;
    editor = null;
    editorView = null;
    checkRange = function(range, expectedRange) {
      expect(range.start.row).toBe(expectedRange[0][0]);
      expect(range.start.column).toBe(expectedRange[0][1]);
      expect(range.end.row).toBe(expectedRange[1][0]);
      return expect(range.end.column).toBe(expectedRange[1][1]);
    };
    checkSelections = function(expectedRanges) {
      var colEnd, colStart, count, key, range, rowEnd, rowIndex, rowStart, selMap, selection, _i, _j, _k, _len, _len1, _ref, _ref1;
      selMap = {};
      _ref = editor.getSelections();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        range = selection.getBufferRange();
        key = [range.start.row, range.start.column, range.end.row, range.end.column];
        selMap[key] = true;
      }
      count = 0;
      for (_j = 0, _len1 = expectedRanges.length; _j < _len1; _j++) {
        _ref1 = expectedRanges[_j], colStart = _ref1.colStart, colEnd = _ref1.colEnd, rowStart = _ref1.rowStart, rowEnd = _ref1.rowEnd;
        for (rowIndex = _k = rowStart; rowStart <= rowEnd ? _k <= rowEnd : _k >= rowEnd; rowIndex = rowStart <= rowEnd ? ++_k : --_k) {
          key = [rowIndex, colStart, rowIndex, colEnd];
          expect(selMap[key]).toBeTruthy();
          count += 1;
        }
      }
      return expect(editor.getSelections().length).toBe(count);
    };
    loadBefore = function(filename) {
      return beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open(filename);
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('column-select');
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          editorView = atom.views.getView(editor);
          expect(editorView).not.toBeUndefined();
          editor.setLineHeightInPixels(10);
          editor.setHeight(PAGE_SIZE * 10);
          return expect(editor.getRowsPerPage()).toBe(PAGE_SIZE);
        });
      });
    };
    describe("basic tests", function() {
      loadBefore('test-basic.txt');
      describe("initial state", function() {
        return it("should be sane", function() {
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 0
            }
          ]);
        });
      });
      describe("up", function() {
        it("should not do anything on first line", function() {
          atom.commands.dispatch(editorView, 'column-select:up');
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 0
            }
          ]);
        });
        return it("should move up in column 0", function() {
          editor.setCursorBufferPosition([3, 0]);
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 3,
              rowEnd: 3
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:up");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 2,
              rowEnd: 3
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:up");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 1,
              rowEnd: 3
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:up");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 3
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:up");
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 3
            }
          ]);
        });
      });
      describe("down", function() {
        it("should not do anything on last line", function() {
          var lines;
          atom.commands.dispatch(editorView, "core:move-to-bottom");
          lines = editor.getLineCount();
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: lines - 1,
              rowEnd: lines - 1
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:down");
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: lines - 1,
              rowEnd: lines - 1
            }
          ]);
        });
        return it("should move down in column 0", function() {
          atom.commands.dispatch(editorView, "column-select:down");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 1
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:down");
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 2
            }
          ]);
        });
      });
      describe("pagedown", function() {
        return it("should move pages at a time", function() {
          atom.commands.dispatch(editorView, "column-select:pagedown");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: PAGE_SIZE
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:pagedown");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 2 * PAGE_SIZE
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:pagedown");
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 3 * PAGE_SIZE
            }
          ]);
        });
      });
      describe("pageup", function() {
        return it("should move pages at a time", function() {
          var lines;
          atom.commands.dispatch(editorView, "core:move-to-bottom");
          lines = editor.getLineCount();
          atom.commands.dispatch(editorView, "column-select:pageup");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: lines - PAGE_SIZE - 1,
              rowEnd: lines - 1
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:pageup");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: lines - 2 * PAGE_SIZE - 1,
              rowEnd: lines - 1
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:pageup");
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: lines - 3 * PAGE_SIZE - 1,
              rowEnd: lines - 1
            }
          ]);
        });
      });
      describe("top", function() {
        return it("should move to the top", function() {
          var lines;
          atom.commands.dispatch(editorView, "core:move-to-bottom");
          lines = editor.getLineCount();
          atom.commands.dispatch(editorView, "column-select:top");
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: lines - 1
            }
          ]);
        });
      });
      describe("bottom", function() {
        return it("should move to the bottom", function() {
          var lines;
          lines = editor.getLineCount();
          atom.commands.dispatch(editorView, "column-select:bottom");
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: lines - 1
            }
          ]);
        });
      });
      return describe("undo", function() {
        it("should undo down/up", function() {
          atom.commands.dispatch(editorView, "column-select:down");
          atom.commands.dispatch(editorView, "column-select:up");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 0
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:down");
          atom.commands.dispatch(editorView, "column-select:down");
          atom.commands.dispatch(editorView, "column-select:up");
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 1
            }
          ]);
        });
        it("should undo large jumps", function() {
          var lines;
          lines = editor.getLineCount();
          atom.commands.dispatch(editorView, "column-select:down");
          atom.commands.dispatch(editorView, "column-select:down");
          atom.commands.dispatch(editorView, "column-select:down");
          atom.commands.dispatch(editorView, "column-select:top");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 0
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:bottom");
          atom.commands.dispatch(editorView, "column-select:pageup");
          checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: lines - PAGE_SIZE - 1
            }
          ]);
          atom.commands.dispatch(editorView, "column-select:top");
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 0,
              rowEnd: 0
            }
          ]);
        });
        return it("should reverse directions", function() {
          editor.setCursorBufferPosition([2 * PAGE_SIZE, 0]);
          atom.commands.dispatch(editorView, "column-select:down");
          atom.commands.dispatch(editorView, "column-select:down");
          atom.commands.dispatch(editorView, "column-select:down");
          atom.commands.dispatch(editorView, "column-select:top");
          atom.commands.dispatch(editorView, "column-select:up");
          return checkSelections([
            {
              colStart: 0,
              colEnd: 0,
              rowStart: 2 * PAGE_SIZE - 1,
              rowEnd: 2 * PAGE_SIZE
            }
          ]);
        });
      });
    });
    describe("end tests", function() {
      loadBefore('test-end.txt');
      it("should stick to the end per line", function() {
        editor.moveToEndOfLine();
        atom.commands.dispatch(editorView, "column-select:down");
        checkSelections([
          {
            colStart: 3,
            colEnd: 3,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 4,
            colEnd: 4,
            rowStart: 1,
            rowEnd: 1
          }
        ]);
        atom.commands.dispatch(editorView, "column-select:down");
        checkSelections([
          {
            colStart: 3,
            colEnd: 3,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 4,
            colEnd: 4,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 5,
            colEnd: 5,
            rowStart: 2,
            rowEnd: 2
          }
        ]);
        atom.commands.dispatch(editorView, "column-select:down");
        atom.commands.dispatch(editorView, "column-select:down");
        atom.commands.dispatch(editorView, "column-select:down");
        atom.commands.dispatch(editorView, "column-select:down");
        atom.commands.dispatch(editorView, "column-select:down");
        atom.commands.dispatch(editorView, "column-select:down");
        return checkSelections([
          {
            colStart: 3,
            colEnd: 3,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 4,
            colEnd: 4,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 5,
            colEnd: 5,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 10,
            colEnd: 10,
            rowStart: 3,
            rowEnd: 3
          }, {
            colStart: 0,
            colEnd: 0,
            rowStart: 4,
            rowEnd: 4
          }, {
            colStart: 3,
            colEnd: 3,
            rowStart: 5,
            rowEnd: 5
          }, {
            colStart: 4,
            colEnd: 4,
            rowStart: 6,
            rowEnd: 6
          }, {
            colStart: 0,
            colEnd: 0,
            rowStart: 7,
            rowEnd: 7
          }
        ]);
      });
      return it("should not be confused by empty lines", function() {
        editor.setCursorBufferPosition([4, 0]);
        atom.commands.dispatch(editorView, "column-select:up");
        atom.commands.dispatch(editorView, "column-select:up");
        return checkSelections([
          {
            colStart: 0,
            colEnd: 0,
            rowStart: 2,
            rowEnd: 4
          }
        ]);
      });
    });
    describe("short lines", function() {
      loadBefore('test-skip-short-lines.txt');
      it("should skip short lines", function() {
        editor.setCursorBufferPosition([0, 6]);
        atom.commands.dispatch(editorView, "column-select:down");
        checkSelections([
          {
            colStart: 6,
            colEnd: 6,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 2,
            rowEnd: 2
          }
        ]);
        atom.commands.dispatch(editorView, "column-select:down");
        checkSelections([
          {
            colStart: 6,
            colEnd: 6,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 4,
            rowEnd: 4
          }
        ]);
        atom.commands.dispatch(editorView, "column-select:down");
        checkSelections([
          {
            colStart: 6,
            colEnd: 6,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 4,
            rowEnd: 4
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 87,
            rowEnd: 87
          }
        ]);
        atom.commands.dispatch(editorView, "column-select:down");
        checkSelections([
          {
            colStart: 6,
            colEnd: 6,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 4,
            rowEnd: 4
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 87,
            rowEnd: 87
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 164,
            rowEnd: 164
          }
        ]);
        atom.commands.dispatch(editorView, "column-select:down");
        return checkSelections([
          {
            colStart: 6,
            colEnd: 6,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 4,
            rowEnd: 4
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 87,
            rowEnd: 87
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 164,
            rowEnd: 164
          }
        ]);
      });
      it("should skip short lines (bottom)", function() {
        editor.setCursorBufferPosition([0, 6]);
        atom.commands.dispatch(editorView, "column-select:bottom");
        return checkSelections([
          {
            colStart: 6,
            colEnd: 6,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 4,
            rowEnd: 4
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 87,
            rowEnd: 87
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 164,
            rowEnd: 164
          }
        ]);
      });
      return it("should skip short lines (pagedown)", function() {
        editor.setCursorBufferPosition([0, 6]);
        atom.commands.dispatch(editorView, "column-select:pagedown");
        checkSelections([
          {
            colStart: 6,
            colEnd: 6,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 4,
            rowEnd: 4
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 87,
            rowEnd: 87
          }
        ]);
        atom.commands.dispatch(editorView, "column-select:pagedown");
        checkSelections([
          {
            colStart: 6,
            colEnd: 6,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 4,
            rowEnd: 4
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 87,
            rowEnd: 87
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 164,
            rowEnd: 164
          }
        ]);
        atom.commands.dispatch(editorView, "column-select:pagedown");
        return checkSelections([
          {
            colStart: 6,
            colEnd: 6,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 4,
            rowEnd: 4
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 87,
            rowEnd: 87
          }, {
            colStart: 6,
            colEnd: 6,
            rowStart: 164,
            rowEnd: 164
          }
        ]);
      });
    });
    return describe("wide columns", function() {
      loadBefore('test-wide.txt');
      return it("support multiple wide columns (with tabs)", function() {
        var sel1, sel2, sel3, sel4;
        editor.setTabLength(8);
        editor.setSelectedBufferRanges([[[0, 0], [0, 2]], [[0, 3], [0, 7]], [[0, 8], [0, 13]], [[0, 14], [0, 15]], [[0, 16], [0, 16]]]);
        sel1 = [
          {
            colStart: 0,
            colEnd: 2,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 3,
            colEnd: 7,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 8,
            colEnd: 13,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 14,
            colEnd: 15,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 16,
            colEnd: 16,
            rowStart: 0,
            rowEnd: 0
          }
        ];
        checkSelections(sel1);
        atom.commands.dispatch(editorView, "column-select:down");
        sel2 = [
          {
            colStart: 0,
            colEnd: 2,
            rowStart: 0,
            rowEnd: 1
          }, {
            colStart: 3,
            colEnd: 7,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 4,
            colEnd: 8,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 8,
            colEnd: 13,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 9,
            colEnd: 14,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 14,
            colEnd: 15,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 15,
            colEnd: 16,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 16,
            colEnd: 16,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 17,
            colEnd: 17,
            rowStart: 1,
            rowEnd: 1
          }
        ];
        checkSelections(sel2);
        atom.commands.dispatch(editorView, "column-select:down");
        sel3 = [
          {
            colStart: 0,
            colEnd: 2,
            rowStart: 0,
            rowEnd: 2
          }, {
            colStart: 3,
            colEnd: 7,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 4,
            colEnd: 8,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 5,
            colEnd: 9,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 8,
            colEnd: 13,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 9,
            colEnd: 14,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 11,
            colEnd: 16,
            rowStart: 3,
            rowEnd: 3
          }, {
            colStart: 14,
            colEnd: 15,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 15,
            colEnd: 16,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 17,
            colEnd: 18,
            rowStart: 3,
            rowEnd: 3
          }, {
            colStart: 16,
            colEnd: 16,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 17,
            colEnd: 17,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 19,
            colEnd: 19,
            rowStart: 3,
            rowEnd: 3
          }
        ];
        checkSelections(sel3);
        atom.commands.dispatch(editorView, "column-select:down");
        sel4 = [
          {
            colStart: 0,
            colEnd: 2,
            rowStart: 0,
            rowEnd: 3
          }, {
            colStart: 3,
            colEnd: 7,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 4,
            colEnd: 8,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 5,
            colEnd: 9,
            rowStart: 2,
            rowEnd: 2
          }, {
            colStart: 6,
            colEnd: 10,
            rowStart: 3,
            rowEnd: 3
          }, {
            colStart: 8,
            colEnd: 13,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 9,
            colEnd: 14,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 11,
            colEnd: 16,
            rowStart: 3,
            rowEnd: 3
          }, {
            colStart: 16,
            colEnd: 21,
            rowStart: 4,
            rowEnd: 4
          }, {
            colStart: 14,
            colEnd: 15,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 15,
            colEnd: 16,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 17,
            colEnd: 18,
            rowStart: 3,
            rowEnd: 3
          }, {
            colStart: 24,
            colEnd: 25,
            rowStart: 4,
            rowEnd: 4
          }, {
            colStart: 16,
            colEnd: 16,
            rowStart: 0,
            rowEnd: 0
          }, {
            colStart: 17,
            colEnd: 17,
            rowStart: 1,
            rowEnd: 1
          }, {
            colStart: 19,
            colEnd: 19,
            rowStart: 3,
            rowEnd: 3
          }, {
            colStart: 32,
            colEnd: 32,
            rowStart: 4,
            rowEnd: 4
          }
        ];
        checkSelections(sel4);
        atom.commands.dispatch(editorView, "column-select:up");
        checkSelections(sel3);
        atom.commands.dispatch(editorView, "column-select:up");
        checkSelections(sel2);
        atom.commands.dispatch(editorView, "column-select:up");
        return checkSelections(sel1);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2x1bW4tc2VsZWN0L3NwZWMvY29sdW1uLXNlbGVjdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FBZixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLEVBRlosQ0FBQTs7QUFBQSxFQVNBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLDhFQUFBO0FBQUEsSUFBQSxpQkFBQSxHQUFvQixJQUFwQixDQUFBO0FBQUEsSUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO0FBQUEsSUFFQSxVQUFBLEdBQWEsSUFGYixDQUFBO0FBQUEsSUFJQSxVQUFBLEdBQWEsU0FBQyxLQUFELEVBQVEsYUFBUixHQUFBO0FBQ1gsTUFBQSxNQUFBLENBQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFuQixDQUF1QixDQUFDLElBQXhCLENBQTZCLGFBQWMsQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQTlDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBbkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxhQUFjLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFqRCxDQURBLENBQUE7QUFBQSxNQUVBLE1BQUEsQ0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQWpCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsYUFBYyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBNUMsQ0FGQSxDQUFBO2FBR0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBakIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixhQUFjLENBQUEs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

//# sourceURL=/Users/kswedberg/.atom/packages/column-select/spec/column-select-spec.coffee
