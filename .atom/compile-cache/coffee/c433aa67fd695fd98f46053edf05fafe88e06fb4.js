(function() {
  module.exports = {
    activate: function(state) {
      atom.workspaceView.command('turbo-javascript:end-line', (function(_this) {
        return function() {
          return _this.endLine(false);
        };
      })(this));
      return atom.workspaceView.command('turbo-javascript:end-new-line', (function(_this) {
        return function() {
          return _this.endLine(true);
        };
      })(this));
    },
    endLine: function(insertNewLine) {
      var editor;
      editor = atom.workspace.activePaneItem;
      return editor.getCursors().forEach(function(cursor) {
        editor.moveCursorToEndOfLine();
        if (!/;\s*$/.test(cursor.getCurrentBufferLine())) {
          editor.insertText(';');
          if (insertNewLine) {
            return editor.insertNewlineBelow();
          }
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiwyQkFBM0IsRUFBd0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFTLEtBQVQsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhELENBQUEsQ0FBQTthQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsK0JBQTNCLEVBQTRELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBUyxJQUFULEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1RCxFQUZRO0lBQUEsQ0FBVjtBQUFBLElBSUEsT0FBQSxFQUFTLFNBQUMsYUFBRCxHQUFBO0FBQ1AsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUF4QixDQUFBO2FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLE9BQXBCLENBQTRCLFNBQUMsTUFBRCxHQUFBO0FBQzFCLFFBQUEsTUFBTSxDQUFDLHFCQUFQLENBQUEsQ0FBQSxDQUFBO0FBQ0EsUUFBQSxJQUFHLENBQUEsT0FBUSxDQUFDLElBQVIsQ0FBYSxNQUFNLENBQUMsb0JBQVAsQ0FBQSxDQUFiLENBQUo7QUFDRSxVQUFBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBQUEsQ0FBQTtBQUNBLFVBQUEsSUFBRyxhQUFIO21CQUNFLE1BQU0sQ0FBQyxrQkFBUCxDQUFBLEVBREY7V0FGRjtTQUYwQjtNQUFBLENBQTVCLEVBRk87SUFBQSxDQUpUO0dBREYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/kswedberg/.atom/packages/turbo-javascript/lib/turbo-javascript.coffee