
/*
 * Debug-mode.
 * @readonly
 * @type {Boolean}
 */

(function() {
  var DEBUG, capitalLetters, defaultStopSymbols, directions, enclosingGuys, findBreakSymbol, getEditor, getStopSymbols, move, moveCursors, smallLetters;

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

  capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  smallLetters = "abcdefghijklmnopqrstuvwxyz";

  defaultStopSymbols = capitalLetters + "01234567890 {}()[]?-`~\"'._=:;%|/\\";

  enclosingGuys = "[]{}()<>`\"'";


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
    return ((_ref = atom.config.get("word-jumper-deluxe")) != null ? _ref.stopSymbols : void 0) || defaultStopSymbols;
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

  findBreakSymbol = function(text, symbols, direction) {
    var i, letter, _i, _len;
    symbols = symbols || getStopSymbols();
    for (i = _i = 0, _len = text.length; _i < _len; i = ++_i) {
      letter = text[i];
      if (capitalLetters.indexOf(text[i]) === -1 || capitalLetters.indexOf(text[i - 1]) === -1) {
        if (symbols.indexOf(text[i]) !== -1 && i !== 0) {
          if (enclosingGuys.indexOf(text[i]) !== -1 && direction === directions.LEFT) {
            return i - 1;
          }
          if (direction === directions.LEFT && text.slice(i, +(i + 1) + 1 || 9e9) === "  ") {
            return i - 1;
          }
          return i;
        }
      }
    }
    return text.length;
  };


  /*
   * Function move cursor to given direction taking into account 'stop' symbols.
   * @param {atom#workspaceView#Editor#Cursor} cursor  - editor's cursor object
   * @param {Number} direction                         - movement direction
   * @param {Boolean} select                           - move cursor with selection
   * @param {Boolean} remove                           - remove selection
   * @param {Boolean} selection                        - selected range object
   */

  move = function(cursor, direction, select, remove, selection) {
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
    offset = findBreakSymbol(_text, getStopSymbols(), direction);
    if (direction === directions.LEFT) {
      offset = offset * (-1) - 1;
    }
    if (cursor.isAtBeginningOfLine() && direction === directions.LEFT) {
      offset = 0;
      row -= 1;
      column = getEditor().lineTextForBufferRow(row).length || 0;
    }
    if (cursor.isAtBeginningOfLine() && direction === directions.RIGHT) {
      if (!cursor.isInsideWord()) {
        offset = findBreakSymbol(_text, getStopSymbols().replace(/\s/, '') + smallLetters);
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
      if (remove) {
        selection["delete"]();
      }
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
   * @param {Boolean} remove   - remove cursor with selection
   */

  moveCursors = function(direction, select, remove) {
    var cursor, i, selections, _i, _len, _ref, _ref1, _results;
    selections = getEditor().getSelections();
    _ref1 = (_ref = getEditor()) != null ? _ref.getCursors() : void 0;
    _results = [];
    for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
      cursor = _ref1[i];
      _results.push(move(cursor, direction, select, remove, selections[i]));
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
        'word-jumper-deluxe:move-right': function() {
          return typeof moveCursors === "function" ? moveCursors(directions.RIGHT) : void 0;
        },
        'word-jumper-deluxe:move-left': function() {
          return typeof moveCursors === "function" ? moveCursors(directions.LEFT) : void 0;
        },
        'word-jumper-deluxe:select-right': function() {
          return typeof moveCursors === "function" ? moveCursors(directions.RIGHT, true) : void 0;
        },
        'word-jumper-deluxe:select-left': function() {
          return typeof moveCursors === "function" ? moveCursors(directions.LEFT, true) : void 0;
        },
        'word-jumper-deluxe:remove-right': function() {
          return typeof moveCursors === "function" ? moveCursors(directions.RIGHT, true, true) : void 0;
        },
        'word-jumper-deluxe:remove-left': function() {
          return typeof moveCursors === "function" ? moveCursors(directions.LEFT, true, true) : void 0;
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy93b3JkLWp1bXBlci1kZWx1eGUvbGliL3dvcmQtanVtcGVyLWRlbHV4ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOzs7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSxpSkFBQTs7QUFBQSxFQUtBLEtBQUEsR0FBUSxLQUxSLENBQUE7O0FBT0E7QUFBQTs7OztLQVBBOztBQUFBLEVBWUEsVUFBQSxHQUFhO0FBQUEsSUFBQyxLQUFBLEVBQU8sQ0FBUjtBQUFBLElBQVcsSUFBQSxFQUFNLENBQWpCO0dBWmIsQ0FBQTs7QUFjQTtBQUFBOzs7OztLQWRBOztBQUFBLEVBb0JBLGNBQUEsR0FBaUIsNEJBcEJqQixDQUFBOztBQUFBLEVBcUJBLFlBQUEsR0FBZSw0QkFyQmYsQ0FBQTs7QUFBQSxFQXNCQSxrQkFBQSxHQUFxQixjQUFBLEdBQWlCLHFDQXRCdEMsQ0FBQTs7QUFBQSxFQXVCQSxhQUFBLEdBQWdCLGNBdkJoQixDQUFBOztBQXlCQTtBQUFBOzs7S0F6QkE7O0FBQUEsRUE2QkEsU0FBQSxHQUFZLFNBQUEsR0FBQTtXQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxFQUFIO0VBQUEsQ0E3QlosQ0FBQTs7QUErQkE7QUFBQTs7O0tBL0JBOztBQUFBLEVBbUNBLGNBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQUcsUUFBQSxJQUFBO3lFQUFxQyxDQUFFLHFCQUF2QyxJQUFzRCxtQkFBekQ7RUFBQSxDQW5DakIsQ0FBQTs7QUFxQ0E7QUFBQTs7Ozs7Ozs7Ozs7O0tBckNBOztBQUFBLEVBa0RBLGVBQUEsR0FBa0IsU0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixTQUFoQixHQUFBO0FBQ2hCLFFBQUEsbUJBQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxPQUFBLElBQVcs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

//# sourceURL=/Users/kswedberg/.atom/packages/word-jumper-deluxe/lib/word-jumper-deluxe.coffee
