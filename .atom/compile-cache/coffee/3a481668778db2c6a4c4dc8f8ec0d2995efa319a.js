(function() {
  var exitIfError, fs, getAttributes, getTags, path, request;

  path = require('path');

  fs = require('fs');

  request = require('request');

  exitIfError = function(error) {
    if (error != null) {
      console.error(error.message);
      return process.exit(1);
    }
  };

  getTags = function(callback) {
    var requestOptions;
    requestOptions = {
      url: 'https://raw.githubusercontent.com/chrisgriffith/jQuery-Mobile-Brackets-Extension/master/HtmlTags.json',
      json: true
    };
    return request(requestOptions, function(error, response, tags) {
      var options, tag, _ref;
      if (error != null) {
        return callback(error);
      }
      if (response.statusCode !== 200) {
        return callback(new Error("Request for HtmlTags.json failed: " + response.statusCode));
      }
      for (tag in tags) {
        options = tags[tag];
        if (((_ref = options.attributes) != null ? _ref.length : void 0) === 0) {
          delete options.attributes;
        }
      }
      return callback(null, tags);
    });
  };

  getAttributes = function(callback) {
    var requestOptions;
    requestOptions = {
      url: 'https://raw.githubusercontent.com/chrisgriffith/jQuery-Mobile-Brackets-Extension/master/HtmlAttributes.json',
      json: true
    };
    return request(requestOptions, function(error, response, attributes) {
      var attribute, options, _ref;
      if (error != null) {
        return callback(error);
      }
      if (response.statusCode !== 200) {
        return callback(new Error("Request for HtmlAttributes.json failed: " + response.statusCode));
      }
      for (attribute in attributes) {
        options = attributes[attribute];
        if (attribute.indexOf('/') !== -1) {
          delete attributes[attribute];
        }
        if (((_ref = options.attribOption) != null ? _ref.length : void 0) === 0) {
          delete options.attribOption;
        }
      }
      return callback(null, attributes);
    });
  };

  getTags(function(error, tags) {
    exitIfError(error);
    return getAttributes(function(error, attributes) {
      var completions;
      exitIfError(error);
      completions = {
        tags: tags,
        attributes: attributes
      };
      return fs.writeFileSync(path.join(__dirname, 'completions.json'), "" + (JSON.stringify(completions, null, 0)) + "\n");
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanF1ZXJ5LW1vYmlsZS91cGRhdGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0E7QUFBQSxNQUFBLHNEQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FGVixDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLFNBQUMsS0FBRCxHQUFBO0FBQ1osSUFBQSxJQUFHLGFBQUg7QUFDRSxNQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsS0FBSyxDQUFDLE9BQXBCLENBQUEsQ0FBQTtBQUNBLGFBQU8sT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFiLENBQVAsQ0FGRjtLQURZO0VBQUEsQ0FKZCxDQUFBOztBQUFBLEVBU0EsT0FBQSxHQUFVLFNBQUMsUUFBRCxHQUFBO0FBQ1IsUUFBQSxjQUFBO0FBQUEsSUFBQSxjQUFBLEdBQ0U7QUFBQSxNQUFBLEdBQUEsRUFBSyx1R0FBTDtBQUFBLE1BQ0EsSUFBQSxFQUFNLElBRE47S0FERixDQUFBO1dBSUEsT0FBQSxDQUFRLGNBQVIsRUFBd0IsU0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixJQUFsQixHQUFBO0FBQ3RCLFVBQUEsa0JBQUE7QUFBQSxNQUFBLElBQTBCLGFBQTFCO0FBQUEsZUFBTyxRQUFBLENBQVMsS0FBVCxDQUFQLENBQUE7T0FBQTtBQUVBLE1BQUEsSUFBRyxRQUFRLENBQUMsVUFBVCxLQUF5QixHQUE1QjtBQUNFLGVBQU8sUUFBQSxDQUFhLElBQUEsS0FBQSxDQUFPLG9DQUFBLEdBQW9DLFFBQVEsQ0FBQyxVQUFwRCxDQUFiLENBQVAsQ0FERjtPQUZBO0FBS0EsV0FBQSxXQUFBOzRCQUFBO0FBQ0UsUUFBQSwrQ0FBK0MsQ0FBRSxnQkFBcEIsS0FBOEIsQ0FBM0Q7QUFBQSxVQUFBLE1BQUEsQ0FBQSxPQUFjLENBQUMsVUFBZixDQUFBO1NBREY7QUFBQSxPQUxBO2FBUUEsUUFBQSxDQUFTLElBQVQsRUFBZSxJQUFmLEVBVHNCO0lBQUEsQ0FBeEIsRUFMUTtFQUFBLENBVFYsQ0FBQTs7QUFBQSxFQXlCQSxhQUFBLEdBQWdCLFNBQUMsUUFBRCxHQUFBO0FBQ2QsUUFBQSxjQUFBO0FBQUEsSUFBQSxjQUFBLEdBQ0U7QUFBQSxNQUFBLEdBQUEsRUFBSyw2R0FBTDtBQUFBLE1BQ0EsSUFBQSxFQUFNLElBRE47S0FERixDQUFBO1dBSUEsT0FBQSxDQUFRLGNBQVIsRUFBd0IsU0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixVQUFsQixHQUFBO0FBQ3RCLFVBQUEsd0JBQUE7QUFBQSxNQUFBLElBQTBCLGFBQTFCO0FBQUEsZUFBTyxRQUFBLENBQVMsS0FBVCxDQUFQLENBQUE7T0FBQTtBQUVBLE1BQUEsSUFBRyxRQUFRLENBQUMsVUFBVCxLQUF5QixHQUE1QjtBQUNFLGVBQU8sUUFBQSxDQUFhLElBQUEsS0FBQSxDQUFPLDBDQUFBLEdBQTBDLFFBQVEsQ0FBQyxVQUExRCxDQUFiLENBQVAsQ0FERjtPQUZBO0FBS0EsV0FBQSx1QkFBQTt3Q0FBQTtBQUNFLFFBQUEsSUFBZ0MsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsQ0FBQSxLQUE0QixDQUFBLENBQTVEO0FBQUEsVUFBQSxNQUFBLENBQUEsVUFBa0IsQ0FBQSxTQUFBLENBQWxCLENBQUE7U0FBQTtBQUNBLFFBQUEsaURBQW1ELENBQUUsZ0JBQXRCLEtBQWdDLENBQS9EO0FBQUEsVUFBQSxNQUFBLENBQUEsT0FBYyxDQUFDLFlBQWYsQ0FBQTtTQUZGO0FBQUEsT0FMQTthQVNBLFFBQUEsQ0FBUyxJQUFULEVBQWUsVUFBZixFQVZzQjtJQUFBLENBQXhCLEVBTGM7RUFBQSxDQXpCaEIsQ0FBQTs7QUFBQSxFQTBDQSxPQUFBLENBQVEsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ04sSUFBQSxXQUFBLENBQVksS0FBWixDQUFBLENBQUE7V0FFQSxhQUFBLENBQWMsU0FBQyxLQUFELEVBQVEsVUFBUixHQUFBO0FBQ1osVUFBQSxXQUFBO0FBQUEsTUFBQSxXQUFBLENBQVksS0FBWixDQUFBLENBQUE7QUFBQSxNQUVBLFdBQUEsR0FBYztBQUFBLFFBQUMsTUFBQSxJQUFEO0FBQUEsUUFBTyxZQUFBLFVBQVA7T0FGZCxDQUFBO2FBR0EsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtCQUFyQixDQUFqQixFQUEyRCxFQUFBLEdBQUUsQ0FBQyxJQUFJLENBQUMsU0FBTCxDQUFlLFdBQWYsRUFBNEIsSUFBNUIsRUFBa0MsQ0FBbEMsQ0FBRCxDQUFGLEdBQXdDLElBQW5HLEVBSlk7SUFBQSxDQUFkLEVBSE07RUFBQSxDQUFSLENBMUNBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/autocomplete-jquery-mobile/update.coffee
