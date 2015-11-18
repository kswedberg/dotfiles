(function() {
  var getOppositeQuote, toggleQuotes;

  toggleQuotes = function(editor) {
    var escapedQuoteRegex, newText, oppositeQuoteCharacter, oppositeQuoteRegex, previousCursorPosition, quoteCharacter, quoteRegex, range, text;
    previousCursorPosition = editor.getCursorBufferPosition();
    range = editor.bufferRangeForScopeAtCursor('.string.quoted');
    text = editor.getTextInBufferRange(range);
    quoteCharacter = text[0];
    oppositeQuoteCharacter = getOppositeQuote(quoteCharacter);
    quoteRegex = new RegExp(quoteCharacter, 'g');
    escapedQuoteRegex = new RegExp("\\\\" + quoteCharacter, 'g');
    oppositeQuoteRegex = new RegExp(oppositeQuoteCharacter, 'g');
    newText = text.replace(oppositeQuoteRegex, "\\" + oppositeQuoteCharacter).replace(escapedQuoteRegex, quoteCharacter);
    newText = oppositeQuoteCharacter + newText.slice(1, -1) + oppositeQuoteCharacter;
    editor.setTextInBufferRange(range, newText);
    return editor.setCursorBufferPosition(previousCursorPosition);
  };

  getOppositeQuote = function(quoteCharacter) {
    if (quoteCharacter === '"') {
      return "'";
    } else {
      return '"';
    }
  };

  module.exports = {
    activate: function() {
      return atom.workspaceView.command('toggle-quotes:toggle', '.editor', function() {
        var paneItem;
        paneItem = atom.workspaceView.getActivePaneItem();
        return toggleQuotes(paneItem);
      });
    },
    toggleQuotes: toggleQuotes
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLFNBQUMsTUFBRCxHQUFBO0FBQ2IsUUFBQSx1SUFBQTtBQUFBLElBQUEsc0JBQUEsR0FBeUIsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBekIsQ0FBQTtBQUFBLElBQ0EsS0FBQSxHQUFRLE1BQU0sQ0FBQywyQkFBUCxDQUFtQyxnQkFBbkMsQ0FEUixDQUFBO0FBQUEsSUFFQSxJQUFBLEdBQU8sTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLENBRlAsQ0FBQTtBQUFBLElBR0EsY0FBQSxHQUFpQixJQUFLLENBQUEsQ0FBQSxDQUh0QixDQUFBO0FBQUEsSUFJQSxzQkFBQSxHQUF5QixnQkFBQSxDQUFpQixjQUFqQixDQUp6QixDQUFBO0FBQUEsSUFLQSxVQUFBLEdBQWlCLElBQUEsTUFBQSxDQUFPLGNBQVAsRUFBdUIsR0FBdkIsQ0FMakIsQ0FBQTtBQUFBLElBTUEsaUJBQUEsR0FBd0IsSUFBQSxNQUFBLENBQVEsTUFBQSxHQUFLLGNBQWIsRUFBZ0MsR0FBaEMsQ0FOeEIsQ0FBQTtBQUFBLElBT0Esa0JBQUEsR0FBeUIsSUFBQSxNQUFBLENBQU8sc0JBQVAsRUFBK0IsR0FBL0IsQ0FQekIsQ0FBQTtBQUFBLElBU0EsT0FBQSxHQUFVLElBQ1IsQ0FBQyxPQURPLENBQ0Msa0JBREQsRUFDc0IsSUFBQSxHQUFHLHNCQUR6QixDQUVSLENBQUMsT0FGTyxDQUVDLGlCQUZELEVBRW9CLGNBRnBCLENBVFYsQ0FBQTtBQUFBLElBWUEsT0FBQSxHQUFVLHNCQUFBLEdBQXlCLE9BQVEsYUFBakMsR0FBMkMsc0JBWnJELENBQUE7QUFBQSxJQWNBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixFQUFtQyxPQUFuQyxDQWRBLENBQUE7V0FlQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0Isc0JBQS9CLEVBaEJhO0VBQUEsQ0FBZixDQUFBOztBQUFBLEVBa0JBLGdCQUFBLEdBQW1CLFNBQUMsY0FBRCxHQUFBO0FBQ2pCLElBQUEsSUFBRyxjQUFBLEtBQWtCLEdBQXJCO2FBQ0UsSUFERjtLQUFBLE1BQUE7YUFHRSxJQUhGO0tBRGlCO0VBQUEsQ0FsQm5CLENBQUE7O0FBQUEsRUF3QkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsc0JBQTNCLEVBQW1ELFNBQW5ELEVBQThELFNBQUEsR0FBQTtBQUM1RCxZQUFBLFFBQUE7QUFBQSxRQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFuQixDQUFBLENBQVgsQ0FBQTtlQUNBLFlBQUEsQ0FBYSxRQUFiLEVBRjREO01BQUEsQ0FBOUQsRUFEUTtJQUFBLENBQVY7QUFBQSxJQUtBLFlBQUEsRUFBYyxZQUxkO0dBekJGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/toggle-quotes/lib/toggle-quotes.coffee