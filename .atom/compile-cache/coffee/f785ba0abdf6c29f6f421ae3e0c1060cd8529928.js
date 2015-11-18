(function() {
  var Blamer, blamer;

  Blamer = require('blamer');

  blamer = null;

  module.exports = function(file, callback) {
    if (blamer == null) {
      blamer = new Blamer('git');
    }
    return blamer.blameByFile(file).then(function(result) {
      return callback(result[file]);
    }, function(error) {
      return callback(null);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibGFtZS9saWIvdXRpbHMvYmxhbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFTLElBRFQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTs7TUFFZixTQUFjLElBQUEsTUFBQSxDQUFPLEtBQVA7S0FBZDtXQUVBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLElBQW5CLENBQXdCLENBQUMsSUFBekIsQ0FDRSxTQUFDLE1BQUQsR0FBQTthQUFZLFFBQUEsQ0FBUyxNQUFPLENBQUEsSUFBQSxDQUFoQixFQUFaO0lBQUEsQ0FERixFQUVFLFNBQUMsS0FBRCxHQUFBO2FBQVcsUUFBQSxDQUFTLElBQVQsRUFBWDtJQUFBLENBRkYsRUFKZTtFQUFBLENBSGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/blame/lib/utils/blame.coffee
