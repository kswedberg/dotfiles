(function() {
  var StyleText, config, scopeSelectors, utils;

  config = require("../config");

  utils = require("../utils");

  scopeSelectors = {
    code: ".raw",
    bold: ".bold",
    italic: ".italic",
    strikethrough: ".strike"
  };

  module.exports = StyleText = (function() {
    function StyleText(style) {
      var _base, _base1;
      this.styleName = style;
      this.style = config.get("textStyles." + style);
      if ((_base = this.style).before == null) {
        _base.before = "";
      }
      if ((_base1 = this.style).after == null) {
        _base1.after = "";
      }
    }

    StyleText.prototype.trigger = function(e) {
      this.editor = atom.workspace.getActiveTextEditor();
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            var text;
            _this.normalizeSelection(selection);
            if (text = selection.getText()) {
              return _this.toggleStyle(selection, text);
            } else {
              return _this.insertEmptyStyle(selection);
            }
          });
        };
      })(this));
    };

    StyleText.prototype.normalizeSelection = function(selection) {
      var range, scopeSelector;
      scopeSelector = scopeSelectors[this.styleName];
      if (!scopeSelector) {
        return;
      }
      range = utils.getTextBufferRange(this.editor, scopeSelector, selection);
      return selection.setBufferRange(range);
    };

    StyleText.prototype.toggleStyle = function(selection, text) {
      if (this.isStyleOn(text)) {
        text = this.removeStyle(text);
      } else {
        text = this.addStyle(text);
      }
      return selection.insertText(text);
    };

    StyleText.prototype.insertEmptyStyle = function(selection) {
      var position;
      selection.insertText(this.style.before);
      position = selection.cursor.getBufferPosition();
      selection.insertText(this.style.after);
      return selection.cursor.setBufferPosition(position);
    };

    StyleText.prototype.isStyleOn = function(text) {
      if (text) {
        return this.getStylePattern().test(text);
      }
    };

    StyleText.prototype.addStyle = function(text) {
      return "" + this.style.before + text + this.style.after;
    };

    StyleText.prototype.removeStyle = function(text) {
      var matches;
      while (matches = this.getStylePattern().exec(text)) {
        text = matches.slice(1).join("");
      }
      return text;
    };

    StyleText.prototype.getStylePattern = function() {
      var after, before;
      before = this.style.regexBefore || utils.regexpEscape(this.style.before);
      after = this.style.regexAfter || utils.regexpEscape(this.style.after);
      return RegExp("^([\\s\\S]*?)" + before + "([\\s\\S]*?)" + after + "([\\s\\S]*?)$", "gm");
    };

    return StyleText;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbW1hbmRzL3N0eWxlLXRleHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQURSLENBQUE7O0FBQUEsRUFJQSxjQUFBLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxNQUFOO0FBQUEsSUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLElBRUEsTUFBQSxFQUFRLFNBRlI7QUFBQSxJQUdBLGFBQUEsRUFBZSxTQUhmO0dBTEYsQ0FBQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFRUyxJQUFBLG1CQUFDLEtBQUQsR0FBQTtBQUNYLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxLQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsTUFBTSxDQUFDLEdBQVAsQ0FBWSxhQUFBLEdBQWEsS0FBekIsQ0FEVCxDQUFBOzthQUdNLENBQUMsU0FBVTtPQUhqQjs7Y0FJTSxDQUFDLFFBQVM7T0FMTDtJQUFBLENBQWI7O0FBQUEsd0JBT0EsT0FBQSxHQUFTLFNBQUMsQ0FBRCxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFWLENBQUE7YUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDZixLQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBQSxDQUF1QixDQUFDLE9B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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/commands/style-text.coffee
