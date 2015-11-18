(function() {
  var EditLine, LineMeta, MAX_SKIP_EMPTY_LINE_ALLOWED, config;

  config = require("../config");

  LineMeta = require("../helpers/line-meta");

  MAX_SKIP_EMPTY_LINE_ALLOWED = 5;

  module.exports = EditLine = (function() {
    function EditLine(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    EditLine.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            return _this[fn](e, selection);
          });
        };
      })(this));
    };

    EditLine.prototype.insertNewLine = function(e, selection) {
      var cursor, line, lineMeta;
      if (this._isRangeSelection(selection)) {
        return this.editor.insertNewline();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      if (cursor.column < line.length && !config.get("inlineNewLineContinuation")) {
        return this.editor.insertNewline();
      }
      lineMeta = new LineMeta(line);
      if (lineMeta.isContinuous()) {
        if (lineMeta.isEmptyBody()) {
          return this._insertNewlineWithoutContinuation(cursor);
        } else {
          return this._insertNewlineWithContinuation(lineMeta.nextLine);
        }
      } else {
        return this.editor.insertNewline();
      }
    };

    EditLine.prototype._insertNewlineWithContinuation = function(nextLine) {
      return this.editor.insertText("\n" + nextLine);
    };

    EditLine.prototype._insertNewlineWithoutContinuation = function(cursor) {
      var currentIndentation, emptyLineSkipped, indentation, line, nextLine, row, _i, _ref;
      nextLine = "\n";
      currentIndentation = this.editor.indentationForBufferRow(cursor.row);
      if (currentIndentation > 0 && cursor.row > 1) {
        emptyLineSkipped = 0;
        for (row = _i = _ref = cursor.row - 1; _ref <= 0 ? _i <= 0 : _i >= 0; row = _ref <= 0 ? ++_i : --_i) {
          line = this.editor.lineTextForBufferRow(row);
          if (line.trim() === "") {
            if (emptyLineSkipped > MAX_SKIP_EMPTY_LINE_ALLOWED) {
              break;
            }
            emptyLineSkipped += 1;
          } else {
            indentation = this.editor.indentationForBufferRow(row);
            if (indentation >= currentIndentation) {
              continue;
            }
            if (indentation === currentIndentation - 1 && LineMeta.isList(line)) {
              nextLine = new LineMeta(line).nextLine;
            }
            break;
          }
        }
      }
      this.editor.selectToBeginningOfLine();
      return this.editor.insertText(nextLine);
    };

    EditLine.prototype.indentListLine = function(e, selection) {
      var cursor, line;
      if (this._isRangeSelection(selection)) {
        return selection.indentSelectedRows();
      }
      cursor = selection.getHeadBufferPosition();
      line = this.editor.lineTextForBufferRow(cursor.row);
      if (LineMeta.isList(line)) {
        return selection.indentSelectedRows();
      } else if (this._isAtLineBeginning(line, cursor.column)) {
        return selection.indent();
      } else {
        return selection.insertText(" ");
      }
    };

    EditLine.prototype._isAtLineBeginning = function(line, col) {
      return col === 0 || line.substring(0, col).trim() === "";
    };

    EditLine.prototype._isRangeSelection = function(selection) {
      var head, tail;
      head = selection.getHeadBufferPosition();
      tail = selection.getTailBufferPosition();
      return head.row !== tail.row || head.column !== tail.column;
    };

    return EditLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbW1hbmRzL2VkaXQtbGluZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdURBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxzQkFBUixDQURYLENBQUE7O0FBQUEsRUFHQSwyQkFBQSxHQUE4QixDQUg5QixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVTLElBQUEsa0JBQUMsTUFBRCxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVixDQURXO0lBQUEsQ0FBYjs7QUFBQSx1QkFJQSxPQUFBLEdBQVMsU0FBQyxDQUFELEdBQUE7QUFDUCxVQUFBLEVBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBZ0IsVUFBaEIsRUFBNEIsU0FBQyxDQUFELEdBQUE7ZUFBTyxDQUFFLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBTCxDQUFBLEVBQVA7TUFBQSxDQUE1QixDQUFMLENBQUE7YUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDZixLQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBQSxDQUF1QixDQUFDLE9BQXhCLENBQWdDLFNBQUMsU0FBRCxHQUFBO21CQUM5QixLQUFFLENBQUEsRUFBQSxDQUFGLENBQU0sQ0FBTixFQUFTLFNBQVQs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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/commands/edit-line.coffee
