(function() {
  var TagMacher;

  TagMacher = (function() {
    TagMacher.prototype.startRegex = /\S/;

    TagMacher.prototype.endRegex = /\S(\s+)?$/;

    function TagMacher(editor) {
      this.editor = editor;
    }

    TagMacher.prototype.lineStartsWithOpeningTag = function(bufferLine) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('tag.open.js') > -1 && scopeDescriptor.scopes.indexOf('meta.tag.attribute-name.js') === -1;
      }
      return false;
    };

    TagMacher.prototype.lineStartWithAttribute = function(bufferLine) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('meta.tag.attribute-name.js') > -1;
      }
      return false;
    };

    TagMacher.prototype.lineStartsWithClosingTag = function(bufferRow) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('tag.closed.js') > -1;
      }
      return false;
    };

    return TagMacher;

  })();

  module.exports = TagMacher;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9yZWFjdC9saWIvdGFnLW1hdGNoZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFNBQUE7O0FBQUEsRUFBTTtBQUNKLHdCQUFBLFVBQUEsR0FBWSxJQUFaLENBQUE7O0FBQUEsd0JBQ0EsUUFBQSxHQUFVLFdBRFYsQ0FBQTs7QUFHYSxJQUFBLG1CQUFDLE1BQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFWLENBRFc7SUFBQSxDQUhiOztBQUFBLHdCQU1BLHdCQUFBLEdBQTBCLFNBQUMsVUFBRCxHQUFBO0FBQ3hCLFVBQUEsc0JBQUE7QUFBQSxNQUFBLElBQUcsS0FBQSxHQUFRLFVBQVUsQ0FBQyxLQUFYLENBQWlCLElBQWpCLENBQVg7QUFDRSxRQUFBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUErQixDQUFDLFNBQUQsRUFBWSxLQUFLLENBQUMsS0FBbEIsQ0FBL0IsQ0FBbEIsQ0FBQTtBQUNBLGVBQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxPQUF2QixDQUErQixhQUEvQixDQUFBLEdBQWdELENBQUEsQ0FBaEQsSUFDQSxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQXZCLENBQStCLDRCQUEvQixDQUFBLEtBQWdFLENBQUEsQ0FEdkUsQ0FGRjtPQUFBO0FBS0EsYUFBTyxLQUFQLENBTndCO0lBQUEsQ0FOMUIsQ0FBQTs7QUFBQSx3QkFjQSxzQkFBQSxHQUF3QixTQUFDLFVBQUQsR0FBQTtBQUN0QixVQUFBLHNCQUFBO0FBQUEsTUFBQSxJQUFHLEtBQUEsR0FBUSxVQUFVLENBQUMsS0FBWCxDQUFpQixJQUFqQixDQUFYO0FBQ0UsUUFBQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsQ0FBQyxTQUFELEVBQVksS0FBSyxDQUFDLEtBQWxCLENBQS9CLENBQWxCLENBQUE7QUFDQSxlQUFPLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBdkIsQ0FBK0IsNEJBQS9CLENBQUEsR0FBK0QsQ0FBQSxDQUF0RSxDQUZGO09BQUE7QUFJQSxhQUFPLEtBQVAsQ0FMc0I7SUFBQSxDQWR4QixDQUFBOztBQUFBLHdCQXFCQSx3QkFBQSxHQUEwQixTQUFDLFNBQUQsR0FBQTtBQUN4QixVQUFBLHNCQUFBO0FBQUEsTUFBQSxJQUFHLEtBQUEsR0FBUSxVQUFVLENBQUMsS0FBWCxDQUFpQixJQUFqQixDQUFYO0FBQ0UsUUFBQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsQ0FBQyxTQUFELEVBQVksS0FBSyxDQUFDLEtBQWxCLENBQS9CLENBQWxCLENBQUE7QUFDQSxlQUFPLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBdkIsQ0FBK0IsZUFBL0IsQ0FBQSxHQUFrRCxDQUFBLENBQXpELENBRkY7T0FBQTtBQUlBLGFBQU8sS0FBUCxDQUx3QjtJQUFBLENBckIxQixDQUFBOztxQkFBQTs7TUFERixDQUFBOztBQUFBLEVBNkJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBN0JqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/react/lib/tag-matcher.coffee
