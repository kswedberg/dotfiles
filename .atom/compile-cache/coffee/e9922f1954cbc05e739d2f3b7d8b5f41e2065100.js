(function() {
  var emoji, fs, fuzzaldrin, path;

  fs = require('fs');

  path = require('path');

  fuzzaldrin = require('fuzzaldrin');

  emoji = require('emoji-images');

  module.exports = {
    selector: '.source.gfm, .text.html, .text.plain, .text.git-commit, .comment, .string',
    wordRegex: /::?[\w\d_\+-]+$/,
    emojiFolder: 'atom://autocomplete-emojis/node_modules/emoji-images/pngs',
    properties: {},
    keys: [],
    loadProperties: function() {
      return fs.readFile(path.resolve(__dirname, '..', 'properties.json'), (function(_this) {
        return function(error, content) {
          if (error) {
            return;
          }
          _this.properties = JSON.parse(content);
          return _this.keys = Object.keys(_this.properties);
        };
      })(this));
    },
    getSuggestions: function(_arg) {
      var bufferPosition, editor, isMarkdownEmojiOnly, markdownEmojis, prefix, replacementPrefix, unicodeEmojis;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
      prefix = this.getPrefix(editor, bufferPosition);
      if (!((prefix != null ? prefix.length : void 0) >= 2)) {
        return [];
      }
      if (prefix.charAt(1) === ':') {
        isMarkdownEmojiOnly = true;
        replacementPrefix = prefix;
        prefix = prefix.slice(1);
      }
      unicodeEmojis = [];
      if (atom.config.get('autocomplete-emojis.enableUnicodeEmojis') && !isMarkdownEmojiOnly) {
        unicodeEmojis = this.getUnicodeEmojiSuggestions(prefix);
      }
      markdownEmojis = [];
      if (atom.config.get('autocomplete-emojis.enableMarkdownEmojis')) {
        markdownEmojis = this.getMarkdownEmojiSuggestions(prefix, replacementPrefix);
      }
      return unicodeEmojis.concat(markdownEmojis);
    },
    getPrefix: function(editor, bufferPosition) {
      var line, _ref;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((_ref = line.match(this.wordRegex)) != null ? _ref[0] : void 0) || '';
    },
    getUnicodeEmojiSuggestions: function(prefix) {
      var word, words, _i, _len, _results;
      words = fuzzaldrin.filter(this.keys, prefix.slice(1));
      _results = [];
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        word = words[_i];
        _results.push({
          text: this.properties[word].emoji,
          replacementPrefix: prefix,
          rightLabel: word
        });
      }
      return _results;
    },
    getMarkdownEmojiSuggestions: function(prefix, replacementPrefix) {
      var emojiImageElement, uri, word, words, _i, _len, _results;
      words = fuzzaldrin.filter(emoji.list, prefix);
      _results = [];
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        word = words[_i];
        emojiImageElement = emoji(word, this.emojiFolder, 20);
        if (emojiImageElement.match(/src="(.*\.png)"/)) {
          uri = RegExp.$1;
          emojiImageElement = emojiImageElement.replace(uri, decodeURIComponent(uri));
        }
        _results.push({
          text: word,
          replacementPrefix: replacementPrefix || prefix,
          rightLabelHTML: emojiImageElement
        });
      }
      return _results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZW1vamlzL2xpYi9lbW9qaXMtcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FGYixDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBSFIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSwyRUFBVjtBQUFBLElBRUEsU0FBQSxFQUFXLGlCQUZYO0FBQUEsSUFHQSxXQUFBLEVBQWEsMkRBSGI7QUFBQSxJQUlBLFVBQUEsRUFBWSxFQUpaO0FBQUEsSUFLQSxJQUFBLEVBQU0sRUFMTjtBQUFBLElBT0EsY0FBQSxFQUFnQixTQUFBLEdBQUE7YUFDZCxFQUFFLENBQUMsUUFBSCxDQUFZLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixJQUF4QixFQUE4QixpQkFBOUIsQ0FBWixFQUE4RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsT0FBUixHQUFBO0FBQzVELFVBQUEsSUFBVSxLQUFWO0FBQUEsa0JBQUEsQ0FBQTtXQUFBO0FBQUEsVUFFQSxLQUFDLENBQUEsVUFBRCxHQUFjLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWCxDQUZkLENBQUE7aUJBR0EsS0FBQyxDQUFBLElBQUQsR0FBUSxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQUMsQ0FBQSxVQUFiLEVBSm9EO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQsRUFEYztJQUFBLENBUGhCO0FBQUEsSUFjQSxjQUFBLEVBQWdCLFNBQUMsSUFBRCxHQUFBO0FBQ2QsVUFBQSxxR0FBQTtBQUFBLE1BRGdCLGNBQUEsUUFBUSxzQkFBQSxjQUN4QixDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLEVBQW1CLGNBQW5CLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLG1CQUFpQixNQUFNLENBQUUsZ0JBQVIsSUFBa0IsQ0FBbkMsQ0FBQTtBQUFBLGVBQU8sRUFBUCxDQUFBO09BREE7QUFHQSxNQUFBLElBQUcsTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFkLENBQUEsS0FBb0IsR0FBdkI7QUFDRSxRQUFBLG1CQUFBLEdBQXNCLElBQXRCLENBQUE7QUFBQSxRQUNBLGlCQUFBLEdBQW9CLE1BRHBCLENBQUE7QUFBQSxRQUVBLE1BQUEsR0FBUyxNQUFNLENBQUMsS0FBUCxDQUFhLENBQWIsQ0FGVCxDQURGO09BSEE7QUFBQSxNQVFBLGFBQUEsR0FBZ0IsRUFSaEIsQ0FBQTtBQVNBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUNBQWhCLENBQUEsSUFBOEQsQ0FBQSxtQkFBakU7QUFDRSxRQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLDBCQUFELENBQTRCLE1BQTVCLENBQWhCLENBREY7T0FUQTtBQUFBLE1BWUEsY0FBQSxHQUFpQixFQVpqQixDQUFBO0FBYUEsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQ0FBaEIsQ0FBSDtBQUNFLFFBQUEsY0FBQSxHQUFpQixJQUFDLENBQUEsMkJBQUQsQ0FBNkIsTUFBN0IsRUFBcUMsaUJBQXJDLENBQWpCLENBREY7T0FiQTtBQWdCQSxhQUFPLGFBQWEsQ0FBQyxNQUFkLENBQXFCLGNBQXJCLENBQVAsQ0FqQmM7SUFBQSxDQWRoQjtBQUFBLElBaUNBLFNBQUEsRUFBVyxTQUFDLE1BQUQsRUFBUyxjQUFULEdBQUE7QUFDVCxVQUFBLFVBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLENBQUMsY0FBYyxDQUFDLEdBQWhCLEVBQXFCLENBQXJCLENBQUQsRUFBMEIsY0FBMUIsQ0FBdEIsQ0FBUCxDQUFBO2dFQUN3QixDQUFBLENBQUEsV0FBeEIsSUFBOEIsR0FGckI7SUFBQSxDQWpDWDtBQUFBLElBcUNBLDBCQUFBLEVBQTRCLFNBQUMsTUFBRCxHQUFBO0FBQzFCLFVBQUEsK0JBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxVQUFVLENBQUMsTUFBWCxDQUFrQixJQUFDLENBQUEsSUFBbkIsRUFBeUIsTUFBTSxDQUFDLEtBQVAsQ0FBYSxDQUFiLENBQXpCLENBQVIsQ0FBQTtBQUNBO1dBQUEsNENBQUE7eUJBQUE7QUFDRSxzQkFBQTtBQUFBLFVBQ0UsSUFBQSxFQUFNLElBQUMsQ0FBQSxVQUFXLENBQUEsSUFBQSxDQUFLLENBQUMsS0FEMUI7QUFBQSxVQUVFLGlCQUFBLEVBQW1CLE1BRnJCO0FBQUEsVUFHRSxVQUFBLEVBQVksSUFIZDtVQUFBLENBREY7QUFBQTtzQkFGMEI7SUFBQSxDQXJDNUI7QUFBQSxJQThDQSwyQkFBQSxFQUE2QixTQUFDLE1BQUQsRUFBUyxpQkFBVCxHQUFBO0FBQzNCLFVBQUEsdURBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxVQUFVLENBQUMsTUFBWCxDQUFrQixLQUFLLENBQUMsSUFBeEIsRUFBOEIsTUFBOUIsQ0FBUixDQUFBO0FBQ0E7V0FBQSw0Q0FBQTt5QkFBQTtBQUNFLFFBQUEsaUJBQUEsR0FBb0IsS0FBQSxDQUFNLElBQU4sRUFBWSxJQUFDLENBQUEsV0FBYixFQUEwQixFQUExQixDQUFwQixDQUFBO0FBQ0EsUUFBQSxJQUFHLGlCQUFpQixDQUFDLEtBQWxCLENBQXdCLGlCQUF4QixDQUFIO0FBQ0UsVUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFDLEVBQWIsQ0FBQTtBQUFBLFVBQ0EsaUJBQUEsR0FBb0IsaUJBQWlCLENBQUMsT0FBbEIsQ0FBMEIsR0FBMUIsRUFBK0Isa0JBQUEsQ0FBbUIsR0FBbkIsQ0FBL0IsQ0FEcEIsQ0FERjtTQURBO0FBQUEsc0JBS0E7QUFBQSxVQUNFLElBQUEsRUFBTSxJQURSO0FBQUEsVUFFRSxpQkFBQSxFQUFtQixpQkFBQSxJQUFxQixNQUYxQztBQUFBLFVBR0UsY0FBQSxFQUFnQixpQkFIbEI7VUFMQSxDQURGO0FBQUE7c0JBRjJCO0lBQUEsQ0E5QzdCO0dBTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/autocomplete-emojis/lib/emojis-provider.coffee
