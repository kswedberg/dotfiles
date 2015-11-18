
/*
Requires http://pear.php.net/package/PHP_Beautifier
 */

(function() {
  "use strict";
  var fs, possibleOptions, temp;

  fs = require("fs");

  temp = require("temp").track();

  possibleOptions = require("./possible-options.json");

  module.exports = function(options, cb) {
    var ic, isPossible, k, text, v, vs;
    text = "";
    options.output_tab_size = options.output_tab_size || options.indent_size;
    options.input_tab_size = options.input_tab_size || options.indent_size;
    delete options.indent_size;
    ic = options.indent_char;
    if (options.indent_with_tabs === 0 || options.indent_with_tabs === 1 || options.indent_with_tabs === 2) {
      null;
    } else if (ic === " ") {
      options.indent_with_tabs = 0;
    } else if (ic === "\t") {
      options.indent_with_tabs = 2;
    } else {
      options.indent_with_tabs = 1;
    }
    delete options.indent_char;
    delete options.languageOverride;
    delete options.configPath;
    for (k in options) {
      isPossible = possibleOptions.indexOf(k) !== -1;
      if (isPossible) {
        v = options[k];
        vs = v;
        if (typeof vs === "boolean") {
          if (vs === true) {
            vs = "True";
          } else {
            vs = "False";
          }
        }
        text += k + " = " + vs + "\n";
      } else {
        delete options[k];
      }
    }
    return temp.open({
      suffix: ".cfg"
    }, function(err, info) {
      if (!err) {
        return fs.write(info.fd, text || "", function(err) {
          if (err) {
            return cb(err);
          }
          return fs.close(info.fd, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, info.path);
          });
        });
      } else {
        return cb(err);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy91bmNydXN0aWZ5L2NmZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBR0EsWUFIQSxDQUFBO0FBQUEsTUFBQSx5QkFBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUEsQ0FMUCxDQUFBOztBQUFBLEVBTUEsZUFBQSxHQUFrQixPQUFBLENBQVEseUJBQVIsQ0FObEIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsT0FBRCxFQUFVLEVBQVYsR0FBQTtBQUNmLFFBQUEsOEJBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxFQUFQLENBQUE7QUFBQSxJQUdBLE9BQU8sQ0FBQyxlQUFSLEdBQTBCLE9BQU8sQ0FBQyxlQUFSLElBQTJCLE9BQU8sQ0FBQyxXQUg3RCxDQUFBO0FBQUEsSUFJQSxPQUFPLENBQUMsY0FBUixHQUF5QixPQUFPLENBQUMsY0FBUixJQUEwQixPQUFPLENBQUMsV0FKM0QsQ0FBQTtBQUFBLElBS0EsTUFBQSxDQUFBLE9BQWMsQ0FBQyxXQUxmLENBQUE7QUFBQSxJQWFBLEVBQUEsR0FBSyxPQUFPLENBQUMsV0FiYixDQUFBO0FBY0EsSUFBQSxJQUFHLE9BQU8sQ0FBQyxnQkFBUixLQUE0QixDQUE1QixJQUFpQyxPQUFPLENBQUMsZ0JBQVIsS0FBNEIsQ0FBN0QsSUFBa0UsT0FBTyxDQUFDLGdCQUFSLEtBQTRCLENBQWpHO0FBQ0UsTUFBQSxJQUFBLENBREY7S0FBQSxNQUVLLElBQUcsRUFBQSxLQUFNLEdBQVQ7QUFDSCxNQUFBLE9BQU8sQ0FBQyxnQkFBUixHQUEyQixDQUEzQixDQURHO0tBQUEsTUFFQSxJQUFHLEVBQUEsS0FBTSxJQUFUO0FBQ0gsTUFBQSxPQUFPLENBQUMsZ0JBQVIsR0FBMkIsQ0FBM0IsQ0FERztLQUFBLE1BQUE7QUFHSCxNQUFBLE9BQU8sQ0FBQyxnQkFBUixHQUEyQixDQUEzQixDQUhHO0tBbEJMO0FBQUEsSUFzQkEsTUFBQSxDQUFBLE9BQWMsQ0FBQyxXQXRCZixDQUFBO0FBQUEsSUEyQkEsTUFBQSxDQUFBLE9BQWMsQ0FBQyxnQkEzQmYsQ0FBQTtBQUFBLElBNEJBLE1BQUEsQ0FBQSxPQUFjLENBQUMsVUE1QmYsQ0FBQTtBQStCQSxTQUFBLFlBQUEsR0FBQTtBQUVFLE1BQUEsVUFBQSxHQUFhLGVBQWUsQ0FBQyxPQUFoQixDQUF3QixDQUF4QixDQUFBLEtBQWdDLENBQUEsQ0FBN0MsQ0FBQTtBQUNBLE1BQUEsSUFBRyxVQUFIO0FBQ0UsUUFBQSxDQUFBLEdBQUksT0FBUSxDQUFBLENBQUEsQ0FBWixDQUFBO0FBQUEsUUFDQSxFQUFBLEdBQUssQ0FETCxDQUFBO0FBRUEsUUFBQSxJQUFHLE1BQUEsQ0FBQSxFQUFBLEtBQWEsU0FBaEI7QUFDRSxVQUFBLElBQUcsRUFBQSxLQUFNLElBQVQ7QUFDRSxZQUFBLEVBQUEsR0FBSyxNQUFMLENBREY7V0FBQSxNQUFBO0FBR0UsWUFBQSxFQUFBLEdBQUssT0FBTCxDQUhGO1dBREY7U0FGQTtBQUFBLFFBT0EsSUFBQSxJQUFRLENBQUEsR0FBSSxLQUFKLEdBQVksRUFBWixHQUFpQixJQVB6QixDQURGO09BQUEsTUFBQTtBQVdFLFFBQUEsTUFBQSxDQUFBLE9BQWUsQ0FBQSxDQUFBLENBQWYsQ0FYRjtPQUhGO0FBQUEsS0EvQkE7V0FnREEsSUFBSSxDQUFDLElBQUwsQ0FDRTtBQUFBLE1BQUEsTUFBQSxFQUFRLE1BQVI7S0FERixFQUVFLFNBQUMsR0FBRCxFQUFNLElBQU4sR0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLEdBQUE7ZUFHRSxFQUFFLENBQUMsS0FBSCxDQUFTLElBQUksQ0FBQyxFQUFkLEVBQWtCLElBQUEsSUFBUSxFQUExQixFQUE4QixTQUFDLEdBQUQsR0FBQTtBQUc1QixVQUFBLElBQWtCLEdBQWxCO0FBQUEsbUJBQU8sRUFBQSxDQUFHLEdBQUgsQ0FBUCxDQUFBO1dBQUE7aUJBQ0EsRUFBRSxDQUFDLEtBQUgsQ0FBUyxJQUFJLENBQUMsRUFBZCxFQUFrQixTQUFDLEdBQUQsR0FBQTtBQUdoQixZQUFBLElBQWtCLEdBQWxCO0FBQUEscUJBQU8sRUFBQSxDQUFHLEdBQUgsQ0FBUCxDQUFBO2FBQUE7bUJBQ0EsRUFBQSxDQUFHLElBQUgsRUFBUyxJQUFJLENBQUMsSUFBZCxFQUpnQjtVQUFBLENBQWxCLEVBSjRCO1FBQUEsQ0FBOUIsRUFIRjtPQUFBLE1BQUE7ZUFlRSxFQUFBLENBQUcsR0FBSCxFQWZGO09BREE7SUFBQSxDQUZGLEVBakRlO0VBQUEsQ0FQakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/uncrustify/cfg.coffee
