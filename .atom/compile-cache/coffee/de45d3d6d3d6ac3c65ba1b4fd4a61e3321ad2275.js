(function() {
  var getNextQuoteCharacter, toggleQuoteAtPosition, toggleQuotes;

  toggleQuotes = function(editor) {
    return editor.transact(function() {
      var cursor, position, _i, _len, _ref, _results;
      _ref = editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        position = cursor.getBufferPosition();
        toggleQuoteAtPosition(editor, position);
        _results.push(cursor.setBufferPosition(position));
      }
      return _results;
    });
  };

  toggleQuoteAtPosition = function(editor, position) {
    var escapedQuoteRegex, inner, newText, nextQuoteCharacter, nextQuoteRegex, prefix, quoteCharacter, quoteChars, quoteRegex, range, text;
    quoteChars = atom.config.get('toggle-quotes.quoteCharacters');
    range = editor.displayBuffer.bufferRangeForScopeAtPosition('.string.quoted', position);
    if (range == null) {
      if (range = editor.displayBuffer.bufferRangeForScopeAtPosition('.invalid.illegal', position)) {
        inner = quoteChars.split('').map(function(character) {
          return "" + character + ".*" + character;
        }).join('|');
        if (!RegExp("^(" + inner + ")$", "g").test(editor.getTextInBufferRange(range))) {
          return;
        }
      }
    }
    if (range == null) {
      return;
    }
    text = editor.getTextInBufferRange(range);
    quoteCharacter = text[0];
    prefix = '';
    if (/[uUr]/.test(quoteCharacter)) {
      prefix = text[0], quoteCharacter = text[1];
    }
    nextQuoteCharacter = getNextQuoteCharacter(quoteCharacter, quoteChars);
    if (!nextQuoteCharacter) {
      return;
    }
    quoteRegex = new RegExp(quoteCharacter, 'g');
    escapedQuoteRegex = new RegExp("\\\\" + quoteCharacter, 'g');
    nextQuoteRegex = new RegExp(nextQuoteCharacter, 'g');
    newText = text.replace(nextQuoteRegex, "\\" + nextQuoteCharacter).replace(escapedQuoteRegex, quoteCharacter);
    newText = prefix + nextQuoteCharacter + newText.slice(1 + prefix.length, -1) + nextQuoteCharacter;
    return editor.setTextInBufferRange(range, newText);
  };

  getNextQuoteCharacter = function(quoteCharacter, allQuoteCharacters) {
    var index;
    index = allQuoteCharacters.indexOf(quoteCharacter);
    if (index === -1) {
      return null;
    } else {
      return allQuoteCharacters[(index + 1) % allQuoteCharacters.length];
    }
  };

  module.exports.toggleQuotes = toggleQuotes;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy90b2dnbGUtcXVvdGVzL2xpYi90b2dnbGUtcXVvdGVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwREFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxTQUFDLE1BQUQsR0FBQTtXQUNiLE1BQU0sQ0FBQyxRQUFQLENBQWdCLFNBQUEsR0FBQTtBQUNkLFVBQUEsMENBQUE7QUFBQTtBQUFBO1dBQUEsMkNBQUE7MEJBQUE7QUFDRSxRQUFBLFFBQUEsR0FBVyxNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUFYLENBQUE7QUFBQSxRQUNBLHFCQUFBLENBQXNCLE1BQXRCLEVBQThCLFFBQTlCLENBREEsQ0FBQTtBQUFBLHNCQUVBLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixRQUF6QixFQUZBLENBREY7QUFBQTtzQkFEYztJQUFBLENBQWhCLEVBRGE7RUFBQSxDQUFmLENBQUE7O0FBQUEsRUFPQSxxQkFBQSxHQUF3QixTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7QUFDdEIsUUFBQSxrSUFBQTtBQUFBLElBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsQ0FBYixDQUFBO0FBQUEsSUFDQSxLQUFBLEdBQVEsTUFBTSxDQUFDLGFBQWEsQ0FBQyw2QkFBckIsQ0FBbUQsZ0JBQW5ELEVBQXFFLFFBQXJFLENBRFIsQ0FBQTtBQUdBLElBQUEsSUFBTyxhQUFQO0FBSUUsTUFBQSxJQUFHLEtBQUEsR0FBUSxNQUFNLENBQUMsYUFBYSxDQUFDLDZCQUFyQixDQUFtRCxrQkFBbkQsRUFBdUUsUUFBdkUsQ0FBWDtBQUNFLFFBQUEsS0FBQSxHQUFRLFVBQVUsQ0FBQyxLQUFYLENBQWlCLEVBQWpCLENBQW9CLENBQUMsR0FBckIsQ0FBeUIsU0FBQyxTQUFELEdBQUE7aUJBQWUsRUFBQSxHQUFHLFNBQUgsR0FBYSxJQUFiLEdBQWlCLFVBQWhDO1FBQUEsQ0FBekIsQ0FBcUUsQ0FBQyxJQUF0RSxDQUEyRSxHQUEzRSxDQUFSLENBQUE7QUFDQSxRQUFBLElBQUEsQ0FBQSxNQUFjLENBQUcsSUFBQSxHQUFJLEtBQUosR0FBVSxJQUFiLEVBQWtCLEdBQWxCLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsTUFBTSxDQUFDLG9CQUFQLENBQTRCLEtBQTVCLENBQXpCLENBQWQ7QUFBQSxnQkFBQSxDQUFBO1NBRkY7T0FKRjtLQUhBO0FBV0EsSUFBQSxJQUFjLGFBQWQ7QUFBQSxZQUFBLENBQUE7S0FYQTtBQUFBLElBYUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQWJQLENBQUE7QUFBQSxJQWNDLGlCQUFrQixPQWRuQixDQUFBO0FBQUEsSUFtQkEsTUFBQSxHQUFTLEVBbkJULENBQUE7QUFvQkEsSUFBQSxJQUFtQyxPQUFPLENBQUMsSUFBUixDQUFhLGNBQWIsQ0FBbkM7QUFBQSxNQUFDLGdCQUFELEVBQVMsd0JBQVQsQ0FBQTtLQXBCQTtBQUFBLElBc0JBLGtCQUFBLEdBQXFCLHFCQUFBLENBQXNCLGNBQXRCLEVBQXNDLFVBQXRDLENBdEJyQixDQUFBO0FBdUJBLElBQUEsSUFBQSxDQUFBLGtCQUFBO0FBQUEsWUFBQSxDQUFBO0tBdkJBO0FBQUEsSUF3QkEsVUFBQSxHQUFpQixJQUFBLE1BQUEsQ0FBTyxjQUFQLEVBQXVCLEdBQXZCLENBeEJqQixDQUFBO0FBQUEsSUF5QkEsaUJBQUEsR0FBd0IsSUFBQSxNQUFBLENBQVEsTUFBQSxHQUFNLGNBQWQsRUFBZ0MsR0FBaEMsQ0F6QnhCLENBQUE7QUFBQSxJQTBCQSxjQUFBLEdBQXFCLElBQUEsTUFBQSxDQUFPLGtCQUFQLEVBQTJCLEdBQTNCLENBMUJyQixDQUFBO0FBQUEsSUE0QkEsT0FBQSxHQUFVLElBQ1IsQ0FBQyxPQURPLENBQ0MsY0FERCxFQUNrQixJQUFBLEdBQUksa0JBRHRCLENBRVIsQ0FBQyxPQUZPLENBRUMsaUJBRkQsRUFFb0IsY0FGcEIsQ0E1QlYsQ0FBQTtBQUFBLElBK0JBLE9BQUEsR0FBVSxNQUFBLEdBQVMsa0JBQVQsR0FBOEIsT0FBUSw2QkFBdEMsR0FBZ0Usa0JBL0IxRSxDQUFBO1dBaUNBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixFQUFtQyxPQUFuQyxFQWxDc0I7RUFBQSxDQVB4QixDQUFBOztBQUFBLEVBMkNBLHFCQUFBLEdBQXdCLFNBQUMsY0FBRCxFQUFpQixrQkFBakIsR0FBQTtBQUN0QixRQUFBLEtBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxrQkFBa0IsQ0FBQyxPQUFuQixDQUEyQixjQUEzQixDQUFSLENBQUE7QUFDQSxJQUFBLElBQUcsS0FBQSxLQUFTLENBQUEsQ0FBWjthQUNFLEtBREY7S0FBQSxNQUFBO2FBR0Usa0JBQW1CLENBQUEsQ0FBQyxLQUFBLEdBQVEsQ0FBVCxDQUFBLEdBQWMsa0JBQWtCLENBQUMsTUFBakMsRUFIckI7S0FGc0I7RUFBQSxDQTNDeEIsQ0FBQTs7QUFBQSxFQWtEQSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQWYsR0FBOEIsWUFsRDlCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/toggle-quotes/lib/toggle-quotes.coffee
