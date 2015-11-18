(function() {
  var CreateDefaultKeymaps, fs, path, utils;

  fs = require("fs-plus");

  path = require("path");

  utils = require("../utils");

  module.exports = CreateDefaultKeymaps = (function() {
    function CreateDefaultKeymaps() {}

    CreateDefaultKeymaps.prototype.trigger = function() {
      var keymaps, userKeymapFile;
      keymaps = fs.readFileSync(this.sampleKeymapFile());
      userKeymapFile = this.userKeymapFile();
      return fs.appendFile(userKeymapFile, keymaps, function(err) {
        if (!err) {
          return atom.workspace.open(userKeymapFile);
        }
      });
    };

    CreateDefaultKeymaps.prototype.userKeymapFile = function() {
      return path.join(atom.getConfigDirPath(), "keymap.cson");
    };

    CreateDefaultKeymaps.prototype.sampleKeymapFile = function() {
      return utils.getPackagePath("keymaps", this._sampleFilename());
    };

    CreateDefaultKeymaps.prototype._sampleFilename = function() {
      return {
        "darwin": "sample-osx.cson",
        "linux": "sample-linux.cson",
        "win32": "sample-win32.cson"
      }[process.platform] || "sample-osx.cson";
    };

    return CreateDefaultKeymaps;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbW1hbmRzL2NyZWF0ZS1kZWZhdWx0LWtleW1hcHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FIUixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtzQ0FDSjs7QUFBQSxtQ0FBQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSx1QkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQUUsQ0FBQyxZQUFILENBQWdCLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBQWhCLENBQVYsQ0FBQTtBQUFBLE1BRUEsY0FBQSxHQUFpQixJQUFDLENBQUEsY0FBRCxDQUFBLENBRmpCLENBQUE7YUFHQSxFQUFFLENBQUMsVUFBSCxDQUFjLGNBQWQsRUFBOEIsT0FBOUIsRUFBdUMsU0FBQyxHQUFELEdBQUE7QUFDckMsUUFBQSxJQUFBLENBQUEsR0FBQTtpQkFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsY0FBcEIsRUFBQTtTQURxQztNQUFBLENBQXZDLEVBSk87SUFBQSxDQUFULENBQUE7O0FBQUEsbUNBT0EsY0FBQSxHQUFnQixTQUFBLEdBQUE7YUFDZCxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBQVYsRUFBbUMsYUFBbkMsRUFEYztJQUFBLENBUGhCLENBQUE7O0FBQUEsbUNBVUEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO2FBQ2hCLEtBQUssQ0FBQyxjQUFOLENBQXFCLFNBQXJCLEVBQWdDLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBaEMsRUFEZ0I7SUFBQSxDQVZsQixDQUFBOztBQUFBLG1DQWFBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO2FBQ2Y7QUFBQSxRQUNFLFFBQUEsRUFBVSxpQkFEWjtBQUFBLFFBRUUsT0FBQSxFQUFVLG1CQUZaO0FBQUEsUUFHRSxPQUFBLEVBQVUsbUJBSFo7T0FJRSxDQUFBLE9BQU8sQ0FBQyxRQUFSLENBSkYsSUFJdUIsa0JBTFI7SUFBQSxDQWJqQixDQUFBOztnQ0FBQTs7TUFQRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/commands/create-default-keymaps.coffee
