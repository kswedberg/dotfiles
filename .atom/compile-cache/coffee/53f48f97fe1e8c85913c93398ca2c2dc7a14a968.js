(function() {
  var continuationLine, emptyLine, objectLiteralLine;

  emptyLine = /^\s*$/;

  objectLiteralLine = /^\s*[\w'"]+\s*\:\s*/m;

  continuationLine = /[\{\(;,]\s*$/;

  module.exports = {
    activate: function(state) {
      atom.commands.add('atom-text-editor', {
        'turbo-javascript:end-line': (function(_this) {
          return function() {
            return _this.endLine(';', false);
          };
        })(this)
      });
      atom.commands.add('atom-text-editor', {
        'turbo-javascript:end-line-comma': (function(_this) {
          return function() {
            return _this.endLine(',', false);
          };
        })(this)
      });
      atom.commands.add('atom-text-editor', {
        'turbo-javascript:end-new-line': (function(_this) {
          return function() {
            return _this.endLine('', true);
          };
        })(this)
      });
      return atom.commands.add('atom-text-editor', {
        'turbo-javascript:wrap-block': (function(_this) {
          return function() {
            return _this.wrapBlock();
          };
        })(this)
      });
    },
    endLine: function(terminator, insertNewLine) {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      return editor.getCursors().forEach(function(cursor) {
        var line;
        line = cursor.getCurrentBufferLine();
        editor.moveToEndOfLine();
        if (!terminator) {
          terminator = objectLiteralLine.test(line) ? ',' : ';';
        }
        if (!continuationLine.test(line) && !emptyLine.test(line)) {
          editor.insertText(terminator);
        }
        if (insertNewLine) {
          return editor.insertNewlineBelow();
        }
      });
    },
    wrapBlock: function() {
      var editor, rangesToWrap;
      editor = atom.workspace.getActiveTextEditor();
      rangesToWrap = editor.getSelectedBufferRanges().filter(function(r) {
        return !r.isEmpty();
      });
      if (rangesToWrap.length) {
        rangesToWrap.sort(function(a, b) {
          if (a.start.row > b.start.row) {
            return -1;
          } else {
            return 1;
          }
        }).forEach(function(range) {
          var text;
          text = editor.getTextInBufferRange(range);
          if (/^\s*\{\s*/.test(text) && /\s*\}\s*/.test(text)) {
            return editor.setTextInBufferRange(range, text.replace(/\{\s*/, '').replace(/\s*\}/, ''));
          } else {
            return editor.setTextInBufferRange(range, '{\n' + text + '\n}');
          }
        });
        return editor.autoIndentSelectedRows();
      } else {
        editor.insertText('{\n\n}');
        editor.selectUp(2);
        editor.autoIndentSelectedRows();
        editor.moveRight();
        editor.moveUp();
        return editor.moveToEndOfLine();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy90dXJiby1qYXZhc2NyaXB0L2xpYi90dXJiby1qYXZhc2NyaXB0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTs7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFaLENBQUE7O0FBQUEsRUFDQSxpQkFBQSxHQUFvQixzQkFEcEIsQ0FBQTs7QUFBQSxFQUVBLGdCQUFBLEdBQW1CLGNBRm5CLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFDRTtBQUFBLFFBQUEsMkJBQUEsRUFBNkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBUyxHQUFULEVBQWMsS0FBZCxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0I7T0FERixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFDRTtBQUFBLFFBQUEsaUNBQUEsRUFBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBUyxHQUFULEVBQWMsS0FBZCxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkM7T0FERixDQUZBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFDRTtBQUFBLFFBQUEsK0JBQUEsRUFBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxT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

//# sourceURL=/Users/kswedberg/.atom/packages/turbo-javascript/lib/turbo-javascript.coffee
