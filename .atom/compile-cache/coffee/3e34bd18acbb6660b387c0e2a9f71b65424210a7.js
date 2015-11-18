(function() {
  var provider;

  provider = require('./emojis-provider');

  module.exports = {
    config: {
      enableUnicodeEmojis: {
        type: 'boolean',
        "default": true
      },
      enableMarkdownEmojis: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function() {
      provider.loadProperties();
      return atom.commands.add('atom-workspace', {
        'autocomplete-emojis:show-cheat-sheet': function() {
          return require('./emoji-cheat-sheet').show();
        }
      });
    },
    getProvider: function() {
      return provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZW1vamlzL2xpYi9hdXRvY29tcGxldGUtZW1vamlzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxRQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUixDQUFYLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxvQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FKRjtLQURGO0FBQUEsSUFRQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxRQUFRLENBQUMsY0FBVCxDQUFBLENBQUEsQ0FBQTthQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsc0NBQUEsRUFBd0MsU0FBQSxHQUFBO2lCQUN0QyxPQUFBLENBQVEscUJBQVIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFBLEVBRHNDO1FBQUEsQ0FBeEM7T0FERixFQUhRO0lBQUEsQ0FSVjtBQUFBLElBZUEsV0FBQSxFQUFhLFNBQUEsR0FBQTthQUFHLFNBQUg7SUFBQSxDQWZiO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/autocomplete-emojis/lib/autocomplete-emojis.coffee
