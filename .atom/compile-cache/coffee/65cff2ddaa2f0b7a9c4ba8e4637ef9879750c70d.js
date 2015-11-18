(function() {
  var StyleLine, config, utils;

  config = require("../config");

  utils = require("../utils");

  module.exports = StyleLine = (function() {
    function StyleLine(style) {
      var _base, _base1, _base2, _base3, _base4, _base5;
      this.style = config.get("lineStyles." + style);
      if ((_base = this.style).before == null) {
        _base.before = "";
      }
      if ((_base1 = this.style).after == null) {
        _base1.after = "";
      }
      if ((_base2 = this.style).regexMatchBefore == null) {
        _base2.regexMatchBefore = this.style.regexBefore || this.style.before;
      }
      if ((_base3 = this.style).regexMatchAfter == null) {
        _base3.regexMatchAfter = this.style.regexAfter || this.style.after;
      }
      if (this.style.before) {
        if ((_base4 = this.style).regexBefore == null) {
          _base4.regexBefore = "" + this.style.before[0] + "+\\s";
        }
      }
      if (this.style.after) {
        if ((_base5 = this.style).regexAfter == null) {
          _base5.regexAfter = "\\s" + this.style.after[this.style.after.length - 1] + "*";
        }
      }
    }

    StyleLine.prototype.trigger = function(e) {
      this.editor = atom.workspace.getActiveTextEditor();
      return this.editor.transact((function(_this) {
        return function() {
          return _this.editor.getSelections().forEach(function(selection) {
            var line, range, row, rows, _i, _ref, _ref1;
            range = selection.getBufferRange();
            rows = selection.getBufferRowRange();
            for (row = _i = _ref = rows[0], _ref1 = rows[1]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
              selection.cursor.setBufferPosition([row, 0]);
              selection.selectToEndOfLine();
              if (line = selection.getText()) {
                _this.toggleStyle(selection, line);
              } else {
                _this.insertEmptyStyle(selection);
              }
            }
            if (rows[0] !== rows[1]) {
              return selection.setBufferRange(range);
            }
          });
        };
      })(this));
    };

    StyleLine.prototype.toggleStyle = function(selection, text) {
      if (this.isStyleOn(text)) {
        text = this.removeStyle(text);
      } else {
        text = this.addStyle(text);
      }
      return selection.insertText(text);
    };

    StyleLine.prototype.insertEmptyStyle = function(selection) {
      var position;
      selection.insertText(this.style.before);
      position = selection.cursor.getBufferPosition();
      selection.insertText(this.style.after);
      return selection.cursor.setBufferPosition(position);
    };

    StyleLine.prototype.isStyleOn = function(text) {
      return RegExp("^(\\s*)" + this.style.regexMatchBefore + "(.*?)" + this.style.regexMatchAfter + "(\\s*)$", "i").test(text);
    };

    StyleLine.prototype.addStyle = function(text) {
      var match;
      match = this.getStylePattern().exec(text);
      if (match) {
        return "" + match[1] + this.style.before + match[2] + this.style.after + match[3];
      } else {
        return "" + this.style.before + this.style.after;
      }
    };

    StyleLine.prototype.removeStyle = function(text) {
      var matches;
      matches = this.getStylePattern().exec(text);
      return matches.slice(1).join("");
    };

    StyleLine.prototype.getStylePattern = function() {
      var after, before;
      before = this.style.regexBefore || utils.regexpEscape(this.style.before);
      after = this.style.regexAfter || utils.regexpEscape(this.style.after);
      return RegExp("^(\\s*)(?:" + before + ")?(.*?)(?:" + after + ")?(\\s*)$", "i");
    };

    return StyleLine;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbW1hbmRzL3N0eWxlLWxpbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQURSLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBVVMsSUFBQSxtQkFBQyxLQUFELEdBQUE7QUFDWCxVQUFBLDZDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLE1BQU0sQ0FBQyxHQUFQLENBQVksYUFBQSxHQUFhLEtBQXpCLENBQVQsQ0FBQTs7YUFFTSxDQUFDLFNBQVU7T0FGakI7O2NBR00sQ0FBQyxRQUFTO09BSGhCOztjQUtNLENBQUMsbUJBQW9CLElBQUMsQ0FBQSxLQUFLLENBQUMsV0FBUCxJQUFzQixJQUFDLENBQUEsS0FBSyxDQUFDO09BTHhEOztjQU1NLENBQUMsa0JBQW1CLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxJQUFxQixJQUFDLENBQUEsS0FBSyxDQUFDO09BTnREO0FBUUEsTUFBQSxJQUFtRCxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQTFEOztnQkFBTSxDQUFDLGNBQWUsRUFBQSxHQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTyxDQUFBLENBQUEsQ0FBakIsR0FBb0I7U0FBMUM7T0FSQTtBQVNBLE1BQUEsSUFBdUUsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUE5RTs7Z0JBQU0sQ0FBQyxhQUFlLEtBQUEsR0FBSyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQU0sQ0FBQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxN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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/commands/style-line.coffee
