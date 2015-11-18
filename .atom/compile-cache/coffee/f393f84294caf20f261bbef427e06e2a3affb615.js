(function() {
  module.exports = {
    "bold": {
      'text\.html': {
        activate: function(text) {
          return "<strong>" + text + "</strong>";
        },
        extract: [/^<(strong[^>]*)>(.*?)<\/\1>$/im, 2]
      },
      'source\.gfm': {
        activate: function(text) {
          return "**" + text + "**";
        },
        extract: [/^(\*\*)(.*?)\1/im, 2]
      },
      'source\.css': {
        activate: function(text) {
          return "font-weight: bold;";
        },
        extract: [/^font-weight:\s*bold;?$/im, '/* font-weight: bold; */']
      }
    },
    "italic": {
      'text\.html': {
        activate: function(text) {
          return "<em>" + text + "</em>";
        },
        extract: [/^<(em[^>]*)>(.*?)<\/\1>$/im, 2]
      },
      'source\.gfm': {
        activate: function(text) {
          return "*" + text + "*";
        },
        extract: [/^(\*)(.*?)\1/, 2]
      },
      'source\.css': {
        activate: function(text) {
          return "font-style: italic;";
        },
        extract: [/^font-style:\s*italic;?$/im, '/* font-style: italic; */']
      }
    },
    "underline": {
      'text\.html': {
        activate: function(text) {
          return "<u>" + text + "</u>";
        },
        extract: [/^<(u[^>]*)>(.*?)<\/\1>$/im, 2]
      },
      'source\.gfm': {
        activate: function(text) {
          return "_" + text + "_";
        },
        extract: [/^(\_)(.*?)\1/im, 2]
      },
      'source\.css': {
        activate: function(text) {
          return "text-decoration: underline;";
        },
        extract: [/^text-decoration:\s*underline;?$/im, '/* text-decortaion: underline; */']
      }
    },
    "image": {
      'text\.html': {
        activate: function(text) {
          return "<img src=\"" + text + "\" alt=\"\">";
        },
        extract: [/^<img[^>]*src="([^>\"]+)"[^>]*\/?>$/, 1]
      },
      'source\.gfm': {
        activate: function(text) {
          return "![](" + text + ")";
        },
        extract: [/^!\[[^\]]*\]\((.*?)\)$/, 1]
      },
      'source\.css': {
        activate: function(text) {
          return "background-image: url(" + text + ");";
        },
        extract: [/^background-image\:\s*?url\(([^\)]+)\);?$/, 1]
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7aUJBQVUsVUFBQSxHQUFTLElBQVQsR0FBZSxZQUF6QjtRQUFBLENBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQUFDLGdDQUFELEVBQW1DLENBQW5DLENBRFQ7T0FERjtBQUFBLE1BSUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7aUJBQVUsSUFBQSxHQUFHLElBQUgsR0FBUyxLQUFuQjtRQUFBLENBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQUFDLGtCQUFELEVBQXFCLENBQXJCLENBRFQ7T0FMRjtBQUFBLE1BUUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7aUJBQVMscUJBQVQ7UUFBQSxDQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsQ0FBQywyQkFBRCxFQUE4QiwwQkFBOUIsQ0FEVDtPQVRGO0tBREY7QUFBQSxJQWFBLFFBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7aUJBQVUsTUFBQSxHQUFLLElBQUwsR0FBVyxRQUFyQjtRQUFBLENBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQUFDLDRCQUFELEVBQStCLENBQS9CLENBRFQ7T0FERjtBQUFBLE1BSUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7aUJBQVUsR0FBQSxHQUFFLElBQUYsR0FBUSxJQUFsQjtRQUFBLENBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQUFDLGNBQUQsRUFBaUIsQ0FBakIsQ0FEVDtPQUxGO0FBQUEsTUFRQSxhQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxTQUFDLElBQUQsR0FBQTtpQkFBUyxzQkFBVDtRQUFBLENBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQUFDLDRCQUFELEVBQStCLDJCQUEvQixDQURUO09BVEY7S0FkRjtBQUFBLElBMEJBLFdBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7aUJBQVUsS0FBQSxHQUFJLElBQUosR0FBVSxPQUFwQjtRQUFBLENBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQUFDLDJCQUFELEVBQThCLENBQTlCLENBRFQ7T0FERjtBQUFBLE1BSUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7aUJBQVUsR0FBQSxHQUFFLElBQUYsR0FBUSxJQUFsQjtRQUFBLENBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQUFDLGdCQUFELEVBQW1CLENBQW5CLENBRFQ7T0FMRjtBQUFBLE1BUUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7aUJBQVMsOEJBQVQ7UUFBQSxDQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsQ0FBQyxvQ0FBRCxFQUF1QyxtQ0FBdkMsQ0FEVDtPQVRGO0tBM0JGO0FBQUEsSUF1Q0EsT0FBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxTQUFDLElBQUQsR0FBQTtpQkFBVSxhQUFBLEdBQVksSUFBWixHQUFrQixlQUE1QjtRQUFBLENBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQUFDLHFDQUFELEVBQXdDLENBQXhDLENBRFQ7T0FERjtBQUFBLE1BSUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7aUJBQVUsTUFBQSxHQUFLLElBQUwsR0FBVyxJQUFyQjtRQUFBLENBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxDQUFDLHdCQUFELEVBQTJCLENBQTNCLENBRFQ7T0FMRjtBQUFBLE1BUUEsYUFBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEdBQUE7aUJBQVUsd0JBQUEsR0FBdUIsSUFBdkIsR0FBNkIsS0FBdkM7UUFBQSxDQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsQ0FBQywyQ0FBRCxFQUE4QyxDQUE5QyxDQURUO09BVEY7S0F4Q0Y7R0FERixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/kswedberg/.atom/packages/atom-htmlizer/lib/maps.coffee