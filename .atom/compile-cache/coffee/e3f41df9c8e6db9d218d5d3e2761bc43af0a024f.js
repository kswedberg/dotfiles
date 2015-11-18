
/*
 * Debug-mode.
 * @readonly
 * @type {Boolean}
 */

(function() {
  var DEBUG, defaultStopSymbols, directions, findBreakSymbol, getEditor, getStopSymbols, move, moveCursors;

  DEBUG = false;


  /*
   * Direction of the movement.
   * @readonly
   * @enum {Number}
   */

  directions = {
    RIGHT: 1,
    LEFT: 2
  };


  /*
   * The string contains 'stop' symbols. In this string searching each letter
   * of the caret-line. Can be customized for language needs in plugin setting.
   * @readonly
   * @type {String}
   */

  defaultStopSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890 {}()[]?-`~\"'._=:;%|/\\";


  /*
   * Returns current editor.
   * @return {atom#workspaceView#Editor}
   */

  getEditor = function() {
    return atom.workspace.getActiveTextEditor();
  };


  /*
   * Returns stop symbols from the local settings or local scope.
   * @return {String}
   */

  getStopSymbols = function() {
    var _ref;
    return ((_ref = atom.config.get("word-jumper")) != null ? _ref.stopSymbols : void 0) || defaultStopSymbols;
  };


  /*
   * Function returns sequence number of the first founded symbol in the
   * gived string. Using proprety `stopSymbols` of the plugin settings.
   * @param {String} text          - string in which searched substring
   * @param {String} stopSymbols   -
   * @example
   * findBreakSymbol("theCamelCaseString");   // returns 3
   * @example
   * findBreakSymbol("CaseString");   // returns 4
   * @example
   * findBreakSymbol("somestring");   // returns 11
   * @return {Number}   - position of the first founded 'stop' symbol.
   */

  findBreakSymbol = function(text, symbols) {
    var i, letter, _i, _len;
    symbols = symbols || getStopSymbols();
    for (i = _i = 0, _len = text.length; _i < _len; i = ++_i) {
      letter = text[i];
      if (symbols.indexOf(letter) !== -1 && i !== 0) {
        return i;
      }
    }
    return text.length;
  };


  /*
   * Function move cursor to given direction taking into account 'stop' symbols.
   * @param {atom#workspaceView#Editor#Cursor} cursor  - editor's cursor object
   * @param {Number} direction                         - movement direction
   * @param {Boolean} select                           - move cursor with selection
   * @param {Boolean} selection                        - selected range object
   */

  move = function(cursor, direction, select, selection) {
    var column, cursorPoint, offset, row, textFull, textLeft, textRight, _text;
    if (selection == null) {
      selection = false;
    }
    DEBUG && console.group("Moving cursor #%d", cursor.marker.id);
    row = cursor.getScreenRow();
    column = cursor.getScreenColumn();
    textFull = cursor.getCurrentBufferLine();
    textLeft = textFull.substr(0, column);
    textRight = textFull.substr(column);
    _text = textRight;
    if (direction === directions.LEFT) {
      _text = textLeft.split("").reverse().join("");
    }
    offset = findBreakSymbol(_text);
    if (direction === directions.LEFT) {
      offset = offset * (-1) - 1;
    }
    if (cursor.isAtBeginningOfLine() && direction === directions.LEFT) {
      offset = 0;
      row -= 1;
      column = getEditor().lineLengthForBufferRow(row) || 0;
    }
    if (cursor.isAtBeginningOfLine() && direction === directions.RIGHT) {
      if (!cursor.isInsideWord()) {
        offset = findBreakSymbol(_text, getStopSymbols().replace(/\s/, '') + "abcdefghijklmnopqrstuvwxyz");
      }
    }
    if (cursor.isAtEndOfLine() && direction === directions.RIGHT) {
      row += 1;
      column = 0;
    }
    DEBUG && console.debug("Position %dx%d", row, column);
    DEBUG && console.debug("Text %c[%s………%s]", "font-weight:900", textLeft, textRight);
    DEBUG && console.debug("Offset by", offset);
    cursorPoint = [row, column + offset];
    if (select) {
      selection.selectToBufferPosition(cursorPoint);
    } else {
      cursor.setBufferPosition(cursorPoint);
    }
    return DEBUG && console.groupEnd("Moving cursor #%d", cursor.marker.id);
  };


  /*
   * Function iterate the list of cursors and moves each of them in
   * required direction considering spec. symbols desribed by
   * `stopSymbols` setting variable.
   * @param {Number} direction - movement direction
   * @param {Boolean} select   - move cursor with selection
   */

  moveCursors = function(direction, select) {
    var cursor, i, selections, _i, _len, _ref, _ref1, _results;
    selections = getEditor().getSelections();
    _ref1 = (_ref = getEditor()) != null ? _ref.getCursors() : void 0;
    _results = [];
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      cursor = _ref1[i];
      _results.push(move(cursor, direction, select, selections[i]));
    }
    return _results;
  };

  module.exports = {
    config: {
      stopSymbols: {
        type: 'string',
        "default": defaultStopSymbols
      }
    },
    activate: function() {
      return atom.commands.add('atom-workspace', {
        'word-jumper:move-right': function() {
          return typeof moveCursors === "function" ? moveCursors(directions.RIGHT) : void 0;
        },
        'word-jumper:move-left': function() {
          return typeof moveCursors === "function" ? moveCursors(directions.LEFT) : void 0;
        },
        'word-jumper:select-right': function() {
          return typeof moveCursors === "function" ? moveCursors(directions.RIGHT, true) : void 0;
        },
        'word-jumper:select-left': function() {
          return typeof moveCursors === "function" ? moveCursors(directions.LEFT, true) : void 0;
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy93b3JkLWp1bXBlci9saWIvd29yZC1qdW1wZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7OztHQUFBO0FBQUE7QUFBQTtBQUFBLE1BQUEsb0dBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsS0FMUixDQUFBOztBQU9BO0FBQUE7Ozs7S0FQQTs7QUFBQSxFQVlBLFVBQUEsR0FBYTtBQUFBLElBQUMsS0FBQSxFQUFPLENBQVI7QUFBQSxJQUFXLElBQUEsRUFBTSxDQUFqQjtHQVpiLENBQUE7O0FBY0E7QUFBQTs7Ozs7S0FkQTs7QUFBQSxFQW9CQSxrQkFBQSxHQUFxQiwrREFwQnJCLENBQUE7O0FBc0JBO0FBQUE7OztLQXRCQTs7QUFBQSxFQTBCQSxTQUFBLEdBQVksU0FBQSxHQUFBO1dBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLEVBQUg7RUFBQSxDQTFCWixDQUFBOztBQTRCQTtBQUFBOzs7S0E1QkE7O0FBQUEsRUFnQ0EsY0FBQSxHQUFpQixTQUFBLEdBQUE7QUFBRyxRQUFBLElBQUE7a0VBQThCLENBQUUscUJBQWhDLElBQStDLG1CQUFsRDtFQUFBLENBaENqQixDQUFBOztBQWtDQTtBQUFBOzs7Ozs7Ozs7Ozs7S0FsQ0E7O0FBQUEsRUErQ0EsZUFBQSxHQUFrQixTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7QUFDaEIsUUFBQSxtQkFBQTtBQUFBLElBQUEsT0FBQSxHQUFVLE9BQUEsSUFBVyxjQUFBLENBQUEsQ0FBckIsQ0FBQTtBQUNBLFNBQUEsbURBQUE7dUJBQUE7QUFDRSxNQUFBLElBQVksT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBaEIsQ0FBQSxLQUEyQixDQUFBLENBQTNCLElBQWtDLENBQUEsS0FBSyxDQUFuRDtBQUFBLGVBQU8sQ0FB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

//# sourceURL=/Users/kswedberg/.atom/packages/word-jumper/lib/word-jumper.coffee
