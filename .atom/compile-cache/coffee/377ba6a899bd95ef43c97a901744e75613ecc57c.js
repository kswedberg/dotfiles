
/*
Requires clang-format (https://clang.llvm.org)
 */

(function() {
  "use strict";
  var Beautifier, ClangFormat, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require('fs');

  module.exports = ClangFormat = (function(_super) {
    __extends(ClangFormat, _super);

    function ClangFormat() {
      return ClangFormat.__super__.constructor.apply(this, arguments);
    }

    ClangFormat.prototype.name = "clang-format";

    ClangFormat.prototype.options = {
      "C++": false,
      "C": false,
      "Objective-C": false
    };


    /*
      Dump contents to a given file
     */

    ClangFormat.prototype.dumpToFile = function(name, contents) {
      if (name == null) {
        name = "atom-beautify-dump";
      }
      if (contents == null) {
        contents = "";
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return fs.open(name, "w", function(err, fd) {
            _this.debug('dumpToFile', name, err, fd);
            if (err) {
              return reject(err);
            }
            return fs.write(fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(name);
              });
            });
          });
        };
      })(this));
    };

    ClangFormat.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var currDir, currFile, dumpFile, editor, fullPath, _ref;
        editor = typeof atom !== "undefined" && atom !== null ? (_ref = atom.workspace) != null ? _ref.getActiveTextEditor() : void 0 : void 0;
        if (editor != null) {
          fullPath = editor.getPath();
          currDir = path.dirname(fullPath);
          currFile = path.basename(fullPath);
          dumpFile = path.join(currDir, ".atom-beautify." + currFile);
          return resolve(dumpFile);
        } else {
          return reject(new Error("No active editor found!"));
        }
      }).then((function(_this) {
        return function(dumpFile) {
          return _this.run("clang-format", [_this.dumpToFile(dumpFile, text), ["--style=file"]], {
            help: {
              link: "https://clang.llvm.org/docs/ClangFormat.html"
            }
          })["finally"](function() {
            return fs.unlink(dumpFile);
          });
        };
      })(this));
    };

    return ClangFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9jbGFuZy1mb3JtYXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFlBSkEsQ0FBQTtBQUFBLE1BQUEsaUNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFNQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FOUCxDQUFBOztBQUFBLEVBT0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBUEwsQ0FBQTs7QUFBQSxFQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBRXJCLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwwQkFBQSxJQUFBLEdBQU0sY0FBTixDQUFBOztBQUFBLDBCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsS0FBQSxFQUFPLEtBREE7QUFBQSxNQUVQLEdBQUEsRUFBSyxLQUZFO0FBQUEsTUFHUCxhQUFBLEVBQWUsS0FIUjtLQUZULENBQUE7O0FBUUE7QUFBQTs7T0FSQTs7QUFBQSwwQkFXQSxVQUFBLEdBQVksU0FBQyxJQUFELEVBQThCLFFBQTlCLEdBQUE7O1FBQUMsT0FBTztPQUNsQjs7UUFEd0MsV0FBVztPQUNuRDtBQUFBLGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtpQkFDakIsRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsR0FBZCxFQUFtQixTQUFDLEdBQUQsRUFBTSxFQUFOLEdBQUE7QUFDakIsWUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLFlBQVAsRUFBcUIsSUFBckIsRUFBMkIsR0FBM0IsRUFBZ0MsRUFBaEMsQ0FBQSxDQUFBO0FBQ0EsWUFBQSxJQUFzQixHQUF0QjtBQUFBLHFCQUFPLE1BQUEsQ0FBTyxHQUFQLENBQVAsQ0FBQTthQURBO21CQUVBLEVBQUUsQ0FBQyxLQUFILENBQVMsRUFBVCxFQUFhLFFBQWIsRUFBdUIsU0FBQyxHQUFELEdBQUE7QUFDckIsY0FBQSxJQUFzQixHQUF0QjtBQUFBLHVCQUFPLE1BQUEsQ0FBTyxHQUFQLENBQVAsQ0FBQTtlQUFBO3FCQUNBLEVBQUUsQ0FBQyxLQUFILENBQVMsRUFBVCxFQUFhLFNBQUMsR0FBRCxHQUFBO0FBQ1gsZ0JBQUEsSUFBc0IsR0FBdEI7QUFBQSx5QkFBTyxNQUFBLENBQU8sR0FBUCxDQUFQLENBQUE7aUJBQUE7dUJBQ0EsT0FBQSxDQUFRLElBQVIsRUFGVztjQUFBLENBQWIsRUFGcUI7WUFBQSxDQUF2QixFQUhpQjtVQUFBLENBQW5CLEVBRGlCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUixDQUFYLENBRFU7SUFBQSxDQVhaLENBQUE7O0FBQUEsMEJBMEJBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFhUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDbEIsWUFBQSxtREFBQTtBQUFBLFFBQUEsTUFBQSx3RkFBd0IsQ0FBRSxtQkFBakIsQ0FBQSxtQkFBVCxDQUFBO0FBQ0EsUUFBQSxJQUFHLGNBQUg7QUFDRSxVQUFBLFFBQUEsR0FBVyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVgsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixDQURWLENBQUE7QUFBQSxVQUVBLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQsQ0FGWCxDQUFBO0FBQUEsVUFHQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW9CLGlCQUFBLEdBQWlCLFFBQXJDLENBSFgsQ0FBQTtpQkFJQSxPQUFBLENBQVEsUUFBUixFQUxGO1NBQUEsTUFBQTtpQkFPRSxNQUFBLENBQVcsSUFBQSxLQUFBLENBQU0seUJBQU4sQ0FBWCxFQVBGO1NBRmtCO01BQUEsQ0FBVCxDQVdYLENBQUMsSUFYVSxDQVdMLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFFBQUQsR0FBQTtBQUVKLGlCQUFPLEtBQUMsQ0FBQSxHQUFELENBQUssY0FBTCxFQUFxQixDQUMxQixLQUFDLENBQUEsVUFBRCxDQUFZLFFBQVosRUFBc0IsSUFBdEIsQ0FEMEIsRUFFMUIsQ0FBQyxjQUFELENBRjBCLENBQXJCLEVBR0Y7QUFBQSxZQUFBLElBQUEsRUFBTTtBQUFBLGNBQ1AsSUFBQSxFQUFNLDhDQURDO2FBQU47V0FIRSxDQUtILENBQUMsU0FBRCxDQUxHLENBS08sU0FBQSxHQUFBO21CQUNWLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQURVO1VBQUEsQ0FMUCxDQUFQLENBRkk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVhLLENBQVgsQ0FiUTtJQUFBLENBMUJWLENBQUE7O3VCQUFBOztLQUZ5QyxXQVQzQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/clang-format.coffee
