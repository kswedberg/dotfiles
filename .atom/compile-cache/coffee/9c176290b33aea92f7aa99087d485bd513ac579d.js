(function() {
  module.exports = {
    activate: function() {
      return atom.commands.add("atom-text-editor", "auto-indent:apply", (function(_this) {
        return function() {
          return _this.apply();
        };
      })(this));
    },
    apply: function() {
      var cursor, editor, savedPosition;
      editor = atom.workspace.getActivePaneItem();
      cursor = editor.getLastCursor();
      savedPosition = cursor.getScreenPosition();
      if (editor.getSelectedText().length === 0) {
        editor.selectAll();
      }
      editor.autoIndentSelectedRows();
      cursor = editor.getLastCursor();
      return cursor.setScreenPosition(savedPosition);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdXRvLWluZGVudC9saWIvYXV0by1pbmRlbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLG1CQUF0QyxFQUEyRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxLQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNELEVBRE07SUFBQSxDQUFWO0FBQUEsSUFHQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0gsVUFBQSw2QkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxNQUFNLENBQUMsYUFBUCxDQUFBLENBRlQsQ0FBQTtBQUFBLE1BR0EsYUFBQSxHQUFnQixNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUhoQixDQUFBO0FBS0EsTUFBQSxJQUFHLE1BQU0sQ0FBQyxlQUFQLENBQUEsQ0FBd0IsQ0FBQyxNQUF6QixLQUFtQyxDQUF0QztBQUNJLFFBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFBLENBREo7T0FMQTtBQUFBLE1BT0EsTUFBTSxDQUFDLHNCQUFQLENBQUEsQ0FQQSxDQUFBO0FBQUEsTUFTQSxNQUFBLEdBQVMsTUFBTSxDQUFDLGFBQVAsQ0FBQSxDQVRULENBQUE7YUFVQSxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsYUFBekIsRUFYRztJQUFBLENBSFA7R0FESixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/auto-indent/lib/auto-indent.coffee
