(function() {
  var EmojiCheatSheet, Shell;

  Shell = require('shell');

  module.exports = EmojiCheatSheet = (function() {
    function EmojiCheatSheet() {}

    EmojiCheatSheet.show = function() {
      return this.openUrlInBrowser('http://www.emoji-cheat-sheet.com/');
    };

    EmojiCheatSheet.openUrlInBrowser = function(url) {
      return Shell.openExternal(url);
    };

    return EmojiCheatSheet;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZW1vamlzL2xpYi9lbW9qaS1jaGVhdC1zaGVldC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0JBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtpQ0FDSjs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxJQUFELEdBQU8sU0FBQSxHQUFBO2FBQ0wsSUFBQyxDQUFBLGdCQUFELENBQWtCLG1DQUFsQixFQURLO0lBQUEsQ0FBUCxDQUFBOztBQUFBLElBR0EsZUFBQyxDQUFBLGdCQUFELEdBQW1CLFNBQUMsR0FBRCxHQUFBO2FBQ2pCLEtBQUssQ0FBQyxZQUFOLENBQW1CLEdBQW5CLEVBRGlCO0lBQUEsQ0FIbkIsQ0FBQTs7MkJBQUE7O01BSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/autocomplete-emojis/lib/emoji-cheat-sheet.coffee
