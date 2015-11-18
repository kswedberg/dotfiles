(function() {
  var DiffHelper, shellescape, tmp;

  shellescape = require('shell-escape');

  tmp = require('temporary');

  module.exports = DiffHelper = (function() {
    function DiffHelper() {
      this.baseCommand = 'diff --strip-trailing-cr --label "left" --label "right" -u ';
    }

    DiffHelper.prototype.execDiff = function(files, kallback) {
      var cmd, exec;
      cmd = this.buildCommand(files);
      exec = require('child_process').exec;
      return exec(cmd, kallback);
    };

    DiffHelper.prototype.buildCommand = function(files) {
      if (files.length > 2) {
        throw "Error";
      }
      return this.baseCommand + shellescape(files);
    };

    DiffHelper.prototype.createTempFile = function(contents) {
      var tmpfile;
      tmpfile = new tmp.File();
      tmpfile.writeFileSync(contents);
      return tmpfile.path;
    };

    DiffHelper.prototype.createTempFileFromClipboard = function(clipboard) {
      var tmpfile;
      tmpfile = new tmp.File();
      tmpfile.writeFileSync(clipboard.read());
      return tmpfile.path;
    };

    return DiffHelper;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWNsaS1kaWZmL2xpYi9oZWxwZXJzL2RpZmYtaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0QkFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsY0FBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQWMsT0FBQSxDQUFRLFdBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVTLElBQUEsb0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSw2REFBZixDQURXO0lBQUEsQ0FBYjs7QUFBQSx5QkFHQSxRQUFBLEdBQVUsU0FBQyxLQUFELEVBQVEsUUFBUixHQUFBO0FBQ1IsVUFBQSxTQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU8sSUFBQyxDQUFBLFlBQUQsQ0FBYyxLQUFkLENBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUMsSUFEaEMsQ0FBQTthQUVBLElBQUEsQ0FBSyxHQUFMLEVBQVUsUUFBVixFQUhRO0lBQUEsQ0FIVixDQUFBOztBQUFBLHlCQVFBLFlBQUEsR0FBYyxTQUFDLEtBQUQsR0FBQTtBQUNaLE1BQUEsSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWxCO0FBQ0UsY0FBTSxPQUFOLENBREY7T0FBQTthQUdBLElBQUMsQ0FBQSxXQUFELEdBQWUsV0FBQSxDQUFZLEtBQVosRUFKSDtJQUFBLENBUmQsQ0FBQTs7QUFBQSx5QkFjQSxjQUFBLEdBQWdCLFNBQUMsUUFBRCxHQUFBO0FBQ2QsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQWMsSUFBQSxHQUFHLENBQUMsSUFBSixDQUFBLENBQWQsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsUUFBdEIsQ0FEQSxDQUFBO2FBRUEsT0FBTyxDQUFDLEtBSE07SUFBQSxDQWRoQixDQUFBOztBQUFBLHlCQW1CQSwyQkFBQSxHQUE2QixTQUFDLFNBQUQsR0FBQTtBQUMzQixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBYyxJQUFBLEdBQUcsQ0FBQyxJQUFKLENBQUEsQ0FBZCxDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsYUFBUixDQUFzQixTQUFTLENBQUMsSUFBVixDQUFBLENBQXRCLENBREEsQ0FBQTthQUVBLE9BQU8sQ0FBQyxLQUhtQjtJQUFBLENBbkI3QixDQUFBOztzQkFBQTs7TUFOSixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/atom-cli-diff/lib/helpers/diff-helper.coffee
