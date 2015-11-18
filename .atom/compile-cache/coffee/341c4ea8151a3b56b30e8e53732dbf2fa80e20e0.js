(function() {
  module.exports = {
    analytics: {
      title: 'Anonymous Analytics',
      type: 'boolean',
      "default": true,
      description: "There is [Segment.io](https://segment.io/) which forwards data to [Google Analytics](http://www.google.com/analytics/) to track what languages are being used the most, as well as other stats. Everything is anonymized and no personal information, such as source code, is sent. See https://github.com/Glavin001/atom-beautify/issues/47 for more details."
    },
    _analyticsUserId: {
      title: 'Analytics User Id',
      type: 'string',
      "default": "",
      description: "Unique identifier for this user for tracking usage analytics"
    },
    _loggerLevel: {
      title: "Logger Level",
      type: 'string',
      "default": 'warn',
      description: 'Set the level for the logger',
      "enum": ['verbose', 'debug', 'info', 'warn', 'error']
    },
    beautifyEntireFileOnSave: {
      title: "Beautify Entire File On Save",
      type: 'boolean',
      "default": true,
      description: "When beautifying on save, use the entire file, even if there is selected text in the editor"
    },
    muteUnsupportedLanguageErrors: {
      title: "Mute Unsupported Language Errors",
      type: 'boolean',
      "default": false,
      description: "Do not show \"Unsupported Language\" errors when they occur"
    },
    muteAllErrors: {
      title: "Mute All Errors",
      type: 'boolean',
      "default": false,
      description: "Do not show any/all errors when they occur"
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9jb25maWcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFDZixTQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxxQkFBUDtBQUFBLE1BQ0EsSUFBQSxFQUFPLFNBRFA7QUFBQSxNQUVBLFNBQUEsRUFBVSxJQUZWO0FBQUEsTUFHQSxXQUFBLEVBQWMsZ1dBSGQ7S0FGYTtBQUFBLElBVWYsZ0JBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLG1CQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU8sUUFEUDtBQUFBLE1BRUEsU0FBQSxFQUFVLEVBRlY7QUFBQSxNQUdBLFdBQUEsRUFBYyw4REFIZDtLQVhhO0FBQUEsSUFlZixZQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU8sUUFEUDtBQUFBLE1BRUEsU0FBQSxFQUFVLE1BRlY7QUFBQSxNQUdBLFdBQUEsRUFBYyw4QkFIZDtBQUFBLE1BSUEsTUFBQSxFQUFPLENBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsTUFBckIsRUFBNkIsTUFBN0IsRUFBcUMsT0FBckMsQ0FKUDtLQWhCYTtBQUFBLElBcUJmLHdCQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyw4QkFBUDtBQUFBLE1BQ0EsSUFBQSxFQUFPLFNBRFA7QUFBQSxNQUVBLFNBQUEsRUFBVSxJQUZWO0FBQUEsTUFHQSxXQUFBLEVBQWMsNkZBSGQ7S0F0QmE7QUFBQSxJQTBCZiw2QkFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sa0NBQVA7QUFBQSxNQUNBLElBQUEsRUFBTyxTQURQO0FBQUEsTUFFQSxTQUFBLEVBQVUsS0FGVjtBQUFBLE1BR0EsV0FBQSxFQUFjLDZEQUhkO0tBM0JhO0FBQUEsSUErQmYsYUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8saUJBQVA7QUFBQSxNQUNBLElBQUEsRUFBTyxTQURQO0FBQUEsTUFFQSxTQUFBLEVBQVUsS0FGVjtBQUFBLE1BR0EsV0FBQSxFQUFjLDRDQUhkO0tBaENhO0dBQWpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/config.coffee
