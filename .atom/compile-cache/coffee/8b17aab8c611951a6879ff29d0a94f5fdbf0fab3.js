(function() {
  var continuationLine, emptyLine, objectLiteralLine;

  emptyLine = /^\s*$/;

  objectLiteralLine = /^\s*[\w'"]+\s*\:\s*/m;

  continuationLine = /[\{\(;,]\s*$/;

  module.exports = {
    activate: function(state) {
      atom.commands.add('atom-text-editor', {
        'es6-javascript:end-line': (function(_this) {
          return function() {
            return _this.endLine(';', false);
          };
        })(this)
      });
      atom.commands.add('atom-text-editor', {
        'es6-javascript:end-line-comma': (function(_this) {
          return function() {
            return _this.endLine(',', false);
          };
        })(this)
      });
      atom.commands.add('atom-text-editor', {
        'es6-javascript:end-new-line': (function(_this) {
          return function() {
            return _this.endLine('', true);
          };
        })(this)
      });
      return atom.commands.add('atom-text-editor', {
        'es6-javascript:wrap-block': (function(_this) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9lczYtamF2YXNjcmlwdC9saWIvZXM2LWphdmFzY3JpcHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhDQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQVosQ0FBQTs7QUFBQSxFQUNBLGlCQUFBLEdBQW9CLHNCQURwQixDQUFBOztBQUFBLEVBRUEsZ0JBQUEsR0FBbUIsY0FGbkIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNFO0FBQUEsUUFBQSx5QkFBQSxFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFTLEdBQVQsRUFBYyxLQUFkLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQjtPQURGLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNFO0FBQUEsUUFBQSwrQkFBQSxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFTLEdBQVQsRUFBYyxLQUFkLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztPQURGLENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNFO0FBQUEsUUFBQSw2QkFBQSxFQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEs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

//# sourceURL=/Users/kswedberg/.atom/packages/es6-javascript/lib/es6-javascript.coffee
