(function() {
  var maps,
    __hasProp = {}.hasOwnProperty;

  maps = require("./maps");

  module.exports = {
    activate: function() {
      atom.workspaceView.command("atom-htmlizer:toggle-bold", (function(_this) {
        return function() {
          return _this.toggle("bold");
        };
      })(this));
      atom.workspaceView.command("atom-htmlizer:toggle-italic", (function(_this) {
        return function() {
          return _this.toggle("italic");
        };
      })(this));
      atom.workspaceView.command("atom-htmlizer:toggle-underline", (function(_this) {
        return function() {
          return _this.toggle("underline");
        };
      })(this));
      return atom.workspaceView.command("atom-htmlizer:toggle-image", (function(_this) {
        return function() {
          return _this.toggle("image");
        };
      })(this));
    },
    toggle: function(type) {
      var activate, editor, extract, found, index, is_match, matcher, options, ranges, scope, scopeText, selection, typeScope;
      editor = atom.workspace.getActiveEditor();
      scope = editor.getCursorScopes()[0];
      selection = editor.getSelectedText();
      typeScope = maps[type];
      for (scopeText in typeScope) {
        if (!__hasProp.call(typeScope, scopeText)) continue;
        options = typeScope[scopeText];
        if (scope.match(new RegExp(scopeText))) {
          found = options;
        }
      }
      if (!found) {
        return;
      }
      activate = found.activate, extract = found.extract;
      matcher = extract[0], index = extract[1];
      editor.getSelection().deleteSelectedText();
      is_match = selection.match(matcher);
      console.log(is_match, selection, matcher);
      ranges = editor.insertText(is_match ? is_match[index] || index : activate(selection));
      return editor.setSelectedBufferRanges(ranges);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7SUFBQSw2QkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLDJCQUEzQixFQUF3RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQVEsTUFBUixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEQsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLDZCQUEzQixFQUEwRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQVEsUUFBUixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUQsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGdDQUEzQixFQUE2RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQVEsV0FBUixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0QsQ0FGQSxDQUFBO2FBR0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiw0QkFBM0IsRUFBeUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFRLE9BQVIsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpELEVBSlE7SUFBQSxDQUFWO0FBQUEsSUFNQSxNQUFBLEVBQVEsU0FBQyxJQUFELEdBQUE7QUFDTixVQUFBLG1IQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFFQyxRQUFTLE1BQU0sQ0FBQyxlQUFQLENBQUEsSUFGVixDQUFBO0FBQUEsTUFHQSxTQUFBLEdBQVksTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUhaLENBQUE7QUFBQSxNQUlBLFNBQUEsR0FBWSxJQUFLLENBQUEsSUFBQSxDQUpqQixDQUFBO0FBTUEsV0FBQSxzQkFBQTs7dUNBQUE7QUFDRSxRQUFBLElBQUcsS0FBSyxDQUFDLEtBQU4sQ0FBZ0IsSUFBQSxNQUFBLENBQU8sU0FBUCxDQUFoQixDQUFIO0FBQ0UsVUFBQSxLQUFBLEdBQVEsT0FBUixDQURGO1NBREY7QUFBQSxPQU5BO0FBVUEsTUFBQSxJQUFBLENBQUEsS0FBQTtBQUFBLGNBQUEsQ0FBQTtPQVZBO0FBQUEsTUFZQyxpQkFBQSxRQUFELEVBQVcsZ0JBQUEsT0FaWCxDQUFBO0FBQUEsTUFhQyxvQkFBRCxFQUFVLGtCQWJWLENBQUE7QUFBQSxNQWVBLE1BQU0sQ0FBQyxZQUFQLENBQUEsQ0FBcUIsQ0FBQyxrQkFBdEIsQ0FBQSxDQWZBLENBQUE7QUFBQSxNQWlCQSxRQUFBLEdBQVcsU0FBUyxDQUFDLEtBQVYsQ0FBZ0IsT0FBaEIsQ0FqQlgsQ0FBQTtBQUFBLE1Ba0JBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixFQUFzQixTQUF0QixFQUFpQyxPQUFqQyxDQWxCQSxDQUFBO0FBQUEsTUFtQkEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxVQUFQLENBQXFCLFFBQUgsR0FBa0IsUUFBUyxDQUFBLEtBQUEsQ0FBVCxJQUFtQixLQUFyQyxHQUFpRCxRQUFBLENBQVMsU0FBVCxDQUFuRSxDQW5CVCxDQUFBO2FBb0JBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixNQUEvQixFQXJCTTtJQUFBLENBTlI7R0FKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/kswedberg/.atom/packages/atom-htmlizer/lib/atom-htmlizer.coffee