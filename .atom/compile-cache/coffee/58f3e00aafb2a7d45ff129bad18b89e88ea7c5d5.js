(function() {
  var inputCfg, os;

  os = require('os');

  inputCfg = (function() {
    switch (os.platform()) {
      case 'win32':
        return {
          selectKey: 'altKey',
          mainMouseNum: 1,
          middleMouseNum: 2,
          enableMiddleMouse: true
        };
      case 'darwin':
        return {
          selectKey: 'altKey',
          mainMouseNum: 1,
          middleMouseNum: 2,
          enableMiddleMouse: true
        };
      case 'linux':
        return {
          selectKey: 'shiftKey',
          mainMouseNum: 2,
          middleMouseNum: 2,
          enableMiddleMouse: false
        };
      default:
        return {
          selectKey: 'shiftKey',
          mainMouseNum: 2,
          middleMouseNum: 2,
          enableMiddleMouse: false
        };
    }
  })();

  module.exports = {
    activate: function(state) {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this._handleLoad(editor);
        };
      })(this));
    },
    deactivate: function() {
      return this.unsubscribe();
    },
    _handleLoad: function(editor) {
      var editorBuffer, editorComponent, editorElement, hijackMouseEvent, mouseEndPos, mouseStartPos, onBlur, onMouseDown, onMouseMove, onRangeChange, resetState, _keyDown, _mainMouseAndKeyDown, _mainMouseDown, _middleMouseDown, _screenPositionForMouseEvent, _selectBoxAroundCursors;
      editorBuffer = editor.displayBuffer;
      editorElement = atom.views.getView(editor);
      editorComponent = editorElement.component;
      mouseStartPos = null;
      mouseEndPos = null;
      resetState = function() {
        mouseStartPos = null;
        return mouseEndPos = null;
      };
      onMouseDown = function(e) {
        if (mouseStartPos) {
          e.preventDefault();
          return false;
        }
        if (_middleMouseDown(e) || _mainMouseAndKeyDown(e)) {
          resetState();
          mouseStartPos = _screenPositionForMouseEvent(e);
          mouseEndPos = mouseStartPos;
          e.preventDefault();
          return false;
        }
      };
      onMouseMove = function(e) {
        if (mouseStartPos) {
          e.preventDefault();
          if (_middleMouseDown(e) || _mainMouseDown(e)) {
            mouseEndPos = _screenPositionForMouseEvent(e);
            _selectBoxAroundCursors();
            return false;
          }
          if (e.which === 0) {
            return resetState();
          }
        }
      };
      hijackMouseEvent = function(e) {
        if (mouseStartPos) {
          e.preventDefault();
          return false;
        }
      };
      onBlur = function(e) {
        return resetState();
      };
      onRangeChange = function(newVal) {
        if (mouseStartPos && !newVal.selection.isSingleScreenLine()) {
          newVal.selection.destroy();
          return _selectBoxAroundCursors();
        }
      };
      _screenPositionForMouseEvent = function(e) {
        var column, defaultCharWidth, pixelPosition, row, targetLeft, targetTop;
        pixelPosition = editorComponent.pixelPositionForMouseEvent(e);
        targetTop = pixelPosition.top;
        targetLeft = pixelPosition.left;
        defaultCharWidth = editorBuffer.defaultCharWidth;
        row = Math.floor(targetTop / editorBuffer.getLineHeightInPixels());
        if (row > editorBuffer.getLastRow()) {
          targetLeft = Infinity;
        }
        row = Math.min(row, editorBuffer.getLastRow());
        row = Math.max(0, row);
        column = Math.round(targetLeft / defaultCharWidth);
        return {
          row: row,
          column: column
        };
      };
      _middleMouseDown = function(e) {
        return inputCfg.enableMiddleMouse && e.which === inputCfg.middleMouseNum;
      };
      _mainMouseDown = function(e) {
        return e.which === inputCfg.mainMouseNum;
      };
      _keyDown = function(e) {
        return e[inputCfg.selectKey];
      };
      _mainMouseAndKeyDown = function(e) {
        return _mainMouseDown(e) && e[inputCfg.selectKey];
      };
      _selectBoxAroundCursors = function() {
        var allRanges, range, rangesWithLength, row, _i, _ref, _ref1;
        if (mouseStartPos && mouseEndPos) {
          allRanges = [];
          rangesWithLength = [];
          for (row = _i = _ref = mouseStartPos.row, _ref1 = mouseEndPos.row; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
            range = [[row, mouseStartPos.column], [row, mouseEndPos.column]];
            allRanges.push(range);
            if (editor.getTextInBufferRange(range).length > 0) {
              rangesWithLength.push(range);
            }
          }
          if (rangesWithLength.length) {
            return editor.setSelectedScreenRanges(rangesWithLength);
          } else if (allRanges.length) {
            return editor.setSelectedScreenRanges(allRanges);
          }
        }
      };
      editor.onDidChangeSelectionRange(onRangeChange);
      editorElement.onmousedown = onMouseDown;
      editorElement.onmousemove = onMouseMove;
      editorElement.onmouseup = hijackMouseEvent;
      editorElement.onmouseleave = hijackMouseEvent;
      editorElement.onmouseenter = hijackMouseEvent;
      editorElement.oncontextmenu = hijackMouseEvent;
      return editorElement.onblur = onBlur;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9zdWJsaW1lLXN0eWxlLWNvbHVtbi1zZWxlY3Rpb24vbGliL3N1YmxpbWUtc2VsZWN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUVBLFFBQUE7QUFBVyxZQUFPLEVBQUUsQ0FBQyxRQUFILENBQUEsQ0FBUDtBQUFBLFdBQ0osT0FESTtlQUVQO0FBQUEsVUFBQSxTQUFBLEVBQVcsUUFBWDtBQUFBLFVBQ0EsWUFBQSxFQUFjLENBRGQ7QUFBQSxVQUVBLGNBQUEsRUFBZ0IsQ0FGaEI7QUFBQSxVQUdBLGlCQUFBLEVBQW1CLElBSG5CO1VBRk87QUFBQSxXQU1KLFFBTkk7ZUFPUDtBQUFBLFVBQUEsU0FBQSxFQUFXLFFBQVg7QUFBQSxVQUNBLFlBQUEsRUFBYyxDQURkO0FBQUEsVUFFQSxjQUFBLEVBQWdCLENBRmhCO0FBQUEsVUFHQSxpQkFBQSxFQUFtQixJQUhuQjtVQVBPO0FBQUEsV0FXSixPQVhJO2VBWVA7QUFBQSxVQUFBLFNBQUEsRUFBVyxVQUFYO0FBQUEsVUFDQSxZQUFBLEVBQWMsQ0FEZDtBQUFBLFVBRUEsY0FBQSxFQUFnQixDQUZoQjtBQUFBLFVBR0EsaUJBQUEsRUFBbUIsS0FIbkI7VUFaTztBQUFBO2VBaUJQO0FBQUEsVUFBQSxTQUFBLEVBQVcsVUFBWDtBQUFBLFVBQ0EsWUFBQSxFQUFjLENBRGQ7QUFBQSxVQUVBLGNBQUEsRUFBZ0IsQ0FGaEI7QUFBQSxVQUdBLGlCQUFBLEVBQW1CLEtBSG5CO1VBakJPO0FBQUE7TUFGWCxDQUFBOztBQUFBLEVBd0JBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtB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

//# sourceURL=/Users/kswedberg/.atom/packages/sublime-style-column-selection/lib/sublime-select.coffee
