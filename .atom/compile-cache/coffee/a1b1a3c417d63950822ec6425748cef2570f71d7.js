
/*
Requires https://github.com/FriendsOfPHP/PHP-CS-Fixer
 */

(function() {
  "use strict";
  var Beautifier, PHPCSFixer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PHPCSFixer = (function(_super) {
    __extends(PHPCSFixer, _super);

    function PHPCSFixer() {
      return PHPCSFixer.__super__.constructor.apply(this, arguments);
    }

    PHPCSFixer.prototype.name = "PHP-CS-Fixer";

    PHPCSFixer.prototype.options = {
      PHP: true
    };

    PHPCSFixer.prototype.beautify = function(text, language, options) {
      var isWin, tempFile;
      this.debug('php-cs-fixer', options);
      isWin = this.isWindows;
      if (isWin) {
        return this.Promise.all([options.cs_fixer_path ? this.which(options.cs_fixer_path) : void 0, this.which('php-cs-fixer')]).then((function(_this) {
          return function(paths) {
            var path, phpCSFixerPath, tempFile, _;
            _this.debug('php-cs-fixer paths', paths);
            _ = require('lodash');
            path = require('path');
            phpCSFixerPath = _.find(paths, function(p) {
              return p && path.isAbsolute(p);
            });
            _this.verbose('phpCSFixerPath', phpCSFixerPath);
            _this.debug('phpCSFixerPath', phpCSFixerPath, paths);
            if (phpCSFixerPath != null) {
              return _this.run("php", [phpCSFixerPath, "fix", options.level ? "--level=" + options.level : void 0, options.fixers ? "--fixers=" + options.fixers : void 0, tempFile = _this.tempFile("temp", text)], {
                ignoreReturnCode: true,
                help: {
                  link: "http://php.net/manual/en/install.php"
                }
              }).then(function() {
                return _this.readFile(tempFile);
              });
            } else {
              _this.verbose('php-cs-fixer not found!');
              return _this.Promise.reject(_this.commandNotFoundError('php-cs-fixer', {
                link: "https://github.com/FriendsOfPHP/PHP-CS-Fixer",
                program: "php-cs-fixer.phar",
                pathOption: "PHP - CS Fixer Path"
              }));
            }
          };
        })(this));
      } else {
        return this.run("php-cs-fixer", ["fix", options.level ? "--level=" + options.level : void 0, options.fixers ? "--fixers=" + options.fixers : void 0, tempFile = this.tempFile("temp", text)], {
          ignoreReturnCode: true,
          help: {
            link: "https://github.com/FriendsOfPHP/PHP-CS-Fixer"
          }
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return PHPCSFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9waHAtY3MtZml4ZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFlBSkEsQ0FBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsSUFBQSxHQUFNLGNBQU4sQ0FBQTs7QUFBQSx5QkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLEdBQUEsRUFBSyxJQURFO0tBRlQsQ0FBQTs7QUFBQSx5QkFNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsVUFBQSxlQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxDQUFPLGNBQVAsRUFBdUIsT0FBdkIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFNBRlQsQ0FBQTtBQUdBLE1BQUEsSUFBRyxLQUFIO2VBRUUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULENBQWEsQ0FDc0IsT0FBTyxDQUFDLGFBQXpDLEdBQUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyxPQUFPLENBQUMsYUFBZixDQUFBLEdBQUEsTUFEVyxFQUVYLElBQUMsQ0FBQSxLQUFELENBQU8sY0FBUCxDQUZXLENBQWIsQ0FHRSxDQUFDLElBSEgsQ0FHUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ04sZ0JBQUEsaUNBQUE7QUFBQSxZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sb0JBQVAsRUFBNkIsS0FBN0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBO0FBQUEsWUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBO0FBQUEsWUFJQSxjQUFBLEdBQWlCLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBUCxFQUFjLFNBQUMsQ0FBRCxHQUFBO3FCQUFPLENBQUEsSUFBTSxJQUFJLENBQUMsVUFBTCxDQUFnQixDQUFoQixFQUFiO1lBQUEsQ0FBZCxDQUpqQixDQUFBO0FBQUEsWUFLQSxLQUFDLENBQUEsT0FBRCxDQUFTLGdCQUFULEVBQTJCLGNBQTNCLENBTEEsQ0FBQTtBQUFBLFlBTUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxnQkFBUCxFQUF5QixjQUF6QixFQUF5QyxLQUF6QyxDQU5BLENBQUE7QUFRQSxZQUFBLElBQUcsc0JBQUg7cUJBRUUsS0FBQyxDQUFBLEdBQUQsQ0FBSyxLQUFMLEVBQVksQ0FDVixjQURVLEVBRVYsS0FGVSxFQUdvQixPQUFPLENBQUMsS0FBdEMsR0FBQyxVQUFBLEdBQVUsT0FBTyxDQUFDLEtBQW5CLEdBQUEsTUFIVSxFQUlzQixPQUFPLENBQUMsTUFBeEMsR0FBQyxXQUFBLEdBQVcsT0FBTyxDQUFDLE1BQXBCLEdBQUEsTUFKVSxFQUtWLFFBQUEsR0FBVyxLQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FMRCxDQUFaLEVBTUs7QUFBQSxnQkFDRCxnQkFBQSxFQUFrQixJQURqQjtBQUFBLGdCQUVELElBQUEsRUFBTTtBQUFBLGtCQUNKLElBQUEsRUFBTSxzQ0FERjtpQkFGTDtlQU5MLENBWUUsQ0FBQyxJQVpILENBWVEsU0FBQSxHQUFBO3VCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQURJO2NBQUEsQ0FaUixFQUZGO2FBQUEsTUFBQTtBQWtCRSxjQUFBLEtBQUMsQ0FBQSxPQUFELENBQVMseUJBQVQsQ0FBQSxDQUFBO3FCQUVBLEtBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixLQUFDLENBQUEsb0JBQUQsQ0FDZCxjQURjLEVBRWQ7QUFBQSxnQkFDQSxJQUFBLEVBQU0sOENBRE47QUFBQSxnQkFFQSxPQUFBLEVBQVMsbUJBRlQ7QUFBQSxnQkFHQSxVQUFBLEVBQVkscUJBSFo7ZUFGYyxDQUFoQixFQXBCRjthQVRNO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIUixFQUZGO09BQUEsTUFBQTtlQTRDRSxJQUFDLENBQUEsR0FBRCxDQUFLLGNBQUwsRUFBcUIsQ0FDbkIsS0FEbUIsRUFFVyxPQUFPLENBQUMsS0FBdEMsR0FBQyxVQUFBLEdBQVUsT0FBTyxDQUFDLEtBQW5CLEdBQUEsTUFGbUIsRUFHYSxPQUFPLENBQUMsTUFBeEMsR0FBQyxXQUFBLEdBQVcsT0FBTyxDQUFDLE1BQXBCLEdBQUEsTUFIbUIsRUFJbkIsUUFBQSxHQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixJQUFsQixDQUpRLENBQXJCLEVBS0s7QUFBQSxVQUNELGdCQUFBLEVBQWtCLElBRGpCO0FBQUEsVUFFRCxJQUFBLEVBQU07QUFBQSxZQUNKLElBQUEsRUFBTSw4Q0FERjtXQUZMO1NBTEwsQ0FXRSxDQUFDLElBWEgsQ0FXUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVYsRUFESTtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBWFIsRUE1Q0Y7T0FKUTtJQUFBLENBTlYsQ0FBQTs7c0JBQUE7O0tBRHdDLFdBUDFDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/php-cs-fixer.coffee
