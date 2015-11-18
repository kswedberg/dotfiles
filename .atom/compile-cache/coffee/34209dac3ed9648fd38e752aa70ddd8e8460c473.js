(function() {
  var fs, path, request, requestOptions;

  path = require('path');

  fs = require('fs');

  request = require('request');

  requestOptions = {
    url: 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json',
    json: true
  };

  request(requestOptions, function(error, response, items) {
    var alias, item, properties, _i, _j, _len, _len1, _ref;
    if (error != null) {
      console.error(error.message);
      return process.exit(1);
    }
    if (response.statusCode !== 200) {
      console.error("Request for emoji.json failed: " + response.statusCode);
      return process.exit(1);
    }
    properties = {};
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (item.emoji != null) {
        _ref = item.aliases;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          alias = _ref[_j];
          properties[alias] = {
            emoji: item.emoji
          };
        }
      }
    }
    return fs.writeFileSync(path.join(__dirname, 'properties.json'), "" + (JSON.stringify(properties, null, 0)) + "\n");
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZW1vamlzL3VwZGF0ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFHQTtBQUFBLE1BQUEsaUNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQUZWLENBQUE7O0FBQUEsRUFJQSxjQUFBLEdBQ0U7QUFBQSxJQUFBLEdBQUEsRUFBSyxzRUFBTDtBQUFBLElBQ0EsSUFBQSxFQUFNLElBRE47R0FMRixDQUFBOztBQUFBLEVBUUEsT0FBQSxDQUFRLGNBQVIsRUFBd0IsU0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixLQUFsQixHQUFBO0FBQ3RCLFFBQUEsa0RBQUE7QUFBQSxJQUFBLElBQUcsYUFBSDtBQUNFLE1BQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxLQUFLLENBQUMsT0FBcEIsQ0FBQSxDQUFBO0FBQ0EsYUFBTyxPQUFPLENBQUMsSUFBUixDQUFhLENBQWIsQ0FBUCxDQUZGO0tBQUE7QUFJQSxJQUFBLElBQUcsUUFBUSxDQUFDLFVBQVQsS0FBeUIsR0FBNUI7QUFDRSxNQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWUsaUNBQUEsR0FBaUMsUUFBUSxDQUFDLFVBQXpELENBQUEsQ0FBQTtBQUNBLGFBQU8sT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFiLENBQVAsQ0FGRjtLQUpBO0FBQUEsSUFRQSxVQUFBLEdBQWEsRUFSYixDQUFBO0FBU0EsU0FBQSw0Q0FBQTt1QkFBQTtBQUNFLE1BQUEsSUFBRyxrQkFBSDtBQUNFO0FBQUEsYUFBQSw2Q0FBQTsyQkFBQTtBQUNFLFVBQUEsVUFBVyxDQUFBLEtBQUEsQ0FBWCxHQUNFO0FBQUEsWUFBQSxLQUFBLEVBQU8sSUFBSSxDQUFDLEtBQVo7V0FERixDQURGO0FBQUEsU0FERjtPQURGO0FBQUEsS0FUQTtXQWlCQSxFQUFFLENBQUMsYUFBSCxDQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsaUJBQXJCLENBQWpCLEVBQTBELEVBQUEsR0FBRSxDQUFDLElBQUksQ0FBQyxTQUFMLENBQWUsVUFBZixFQUEyQixJQUEzQixFQUFpQyxDQUFqQyxDQUFELENBQUYsR0FBdUMsSUFBakcsRUFsQnNCO0VBQUEsQ0FBeEIsQ0FSQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/autocomplete-emojis/update.coffee
