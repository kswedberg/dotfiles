(function() {
  var LinterCoffeeScript, coffee;

  coffee = require('coffee-script');

  LinterCoffeeScript = (function() {
    function LinterCoffeeScript() {}

    LinterCoffeeScript.prototype.grammarScopes = ['source.coffee', 'source.litcoffee', 'source.coffee.jsx'];

    LinterCoffeeScript.prototype.scope = 'file';

    LinterCoffeeScript.prototype.lintOnFly = true;

    LinterCoffeeScript.prototype.lint = function(textEditor) {
      var err, filePath, source;
      filePath = textEditor.getPath();
      source = textEditor.getText();
      try {
        coffee.compile(source);
      } catch (_error) {
        err = _error;
        return [
          {
            type: 'error',
            filePath: filePath,
            text: err.message,
            range: this.computeRange(err.location)
          }
        ];
      }
      return [];
    };

    LinterCoffeeScript.prototype.computeRange = function(_arg) {
      var colEnd, colStart, first_column, first_line, last_column, last_line, lineEnd, lineStart;
      first_line = _arg.first_line, first_column = _arg.first_column, last_line = _arg.last_line, last_column = _arg.last_column;
      lineStart = first_line;
      lineEnd = last_line || first_line;
      colStart = first_column;
      colEnd = (last_column || last_column) + 1;
      return [[lineStart, colStart], [lineEnd, colEnd]];
    };

    return LinterCoffeeScript;

  })();

  module.exports = LinterCoffeeScript;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXItY29mZmVlc2NyaXB0L2xpYi9saW50ZXItY29mZmVlc2NyaXB0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQUFULENBQUE7O0FBQUEsRUFFTTtvQ0FDSjs7QUFBQSxpQ0FBQSxhQUFBLEdBQWUsQ0FBQyxlQUFELEVBQWtCLGtCQUFsQixFQUFzQyxtQkFBdEMsQ0FBZixDQUFBOztBQUFBLGlDQUNBLEtBQUEsR0FBTyxNQURQLENBQUE7O0FBQUEsaUNBRUEsU0FBQSxHQUFXLElBRlgsQ0FBQTs7QUFBQSxpQ0FHQSxJQUFBLEdBQU0sU0FBQyxVQUFELEdBQUE7QUFDSixVQUFBLHFCQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQUFYLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxVQUFVLENBQUMsT0FBWCxDQUFBLENBRFQsQ0FBQTtBQUdBO0FBQ0UsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLE1BQWYsQ0FBQSxDQURGO09BQUEsY0FBQTtBQUdFLFFBREksWUFDSixDQUFBO0FBQUEsZUFBTztVQUFDO0FBQUEsWUFDTixJQUFBLEVBQU0sT0FEQTtBQUFBLFlBRU4sUUFBQSxFQUFVLFFBRko7QUFBQSxZQUdOLElBQUEsRUFBTSxHQUFHLENBQUMsT0FISjtBQUFBLFlBSU4sS0FBQSxFQUFPLElBQUMsQ0FBQSxZQUFELENBQWMsR0FBRyxDQUFDLFFBQWxCLENBSkQ7V0FBRDtTQUFQLENBSEY7T0FIQTtBQWFBLGFBQU8sRUFBUCxDQWRJO0lBQUEsQ0FITixDQUFBOztBQUFBLGlDQW1CQSxZQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixVQUFBLHNGQUFBO0FBQUEsTUFEYyxrQkFBQSxZQUFZLG9CQUFBLGNBQWMsaUJBQUEsV0FBVyxtQkFBQSxXQUNuRCxDQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksVUFBWixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsU0FBQSxJQUFhLFVBRHZCLENBQUE7QUFBQSxNQUVBLFFBQUEsR0FBVyxZQUZYLENBQUE7QUFBQSxNQUdBLE1BQUEsR0FBUyxDQUFDLFdBQUEsSUFBZSxXQUFoQixDQUFBLEdBQStCLENBSHhDLENBQUE7QUFLQSxhQUFPLENBQUMsQ0FBQyxTQUFELEVBQVksUUFBWixDQUFELEVBQXdCLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBeEIsQ0FBUCxDQU5ZO0lBQUEsQ0FuQmQsQ0FBQTs7OEJBQUE7O01BSEYsQ0FBQTs7QUFBQSxFQThCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixrQkE5QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/linter-coffeescript/lib/linter-coffeescript.coffee
