(function() {
  var $, CSON, attachMathJax, checkMacros, cheerio, configureMathJax, createMacrosTemplate, fs, getUserMacrosPath, loadMacrosFile, loadUserMacros, namePattern, path, valueMatchesPattern, _;

  $ = require('atom-space-pen-views').$;

  cheerio = require('cheerio');

  path = require('path');

  CSON = require('season');

  fs = require('fs-plus');

  _ = require('underscore-plus');

  module.exports = {
    loadMathJax: function(listener) {
      var script;
      script = this.attachMathJax();
      if (listener != null) {
        script.addEventListener("load", function() {
          return listener();
        });
      }
    },
    attachMathJax: _.once(function() {
      return attachMathJax();
    }),
    resetMathJax: function() {
      $('script[src*="MathJax.js"]').remove();
      window.MathJax = void 0;
      return this.attachMathJax = _.once(function() {
        return attachMathJax();
      });
    },
    mathProcessor: function(domElements) {
      if (typeof MathJax !== "undefined" && MathJax !== null) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, domElements]);
      } else {
        this.loadMathJax(function() {
          return MathJax.Hub.Queue(["Typeset", MathJax.Hub, domElements]);
        });
      }
    },
    processHTMLString: function(html, callback) {
      var compileProcessedHTMLString, element, queueProcessHTMLString;
      element = document.createElement('div');
      element.innerHTML = html;
      compileProcessedHTMLString = function() {
        var svgGlyphs, _ref;
        svgGlyphs = (_ref = document.getElementById('MathJax_SVG_Hidden')) != null ? _ref.parentNode.cloneNode(true) : void 0;
        if (svgGlyphs != null) {
          element.insertBefore(svgGlyphs, element.firstChild);
        }
        return element.innerHTML;
      };
      queueProcessHTMLString = function() {
        return MathJax.Hub.Queue(["setRenderer", MathJax.Hub, "SVG"], ["Typeset", MathJax.Hub, element], ["setRenderer", MathJax.Hub, "HTML-CSS"], [
          function() {
            return callback(compileProcessedHTMLString());
          }
        ]);
      };
      if (typeof MathJax !== "undefined" && MathJax !== null) {
        queueProcessHTMLString();
      } else {
        this.loadMathJax(queueProcessHTMLString);
      }
    }
  };

  namePattern = /^[^a-zA-Z\d\s]$|^[a-zA-Z]*$/;

  getUserMacrosPath = function() {
    var userMacrosPath;
    userMacrosPath = CSON.resolve(path.join(atom.getConfigDirPath(), 'markdown-preview-plus'));
    return userMacrosPath != null ? userMacrosPath : path.join(atom.getConfigDirPath(), 'markdown-preview-plus.cson');
  };

  loadMacrosFile = function(filePath) {
    if (!CSON.isObjectPath(filePath)) {
      return {};
    }
    return CSON.readFileSync(filePath, function(error, object) {
      var _ref, _ref1;
      if (object == null) {
        object = {};
      }
      if (error != null) {
        console.warn("Error reading Latex Macros file '" + filePath + "': " + ((_ref = error.stack) != null ? _ref : error));
        if ((_ref1 = atom.notifications) != null) {
          _ref1.addError("Failed to load Latex Macros from '" + filePath + "'", {
            detail: error.message,
            dismissable: true
          });
        }
      }
      return object;
    });
  };

  loadUserMacros = function() {
    var result, userMacrosPath;
    userMacrosPath = getUserMacrosPath();
    if (fs.isFileSync(userMacrosPath)) {
      return result = loadMacrosFile(userMacrosPath);
    } else {
      console.log("Creating markdown-preview-plus.cson, this is a one-time operation.");
      createMacrosTemplate(userMacrosPath);
      return result = loadMacrosFile(userMacrosPath);
    }
  };

  createMacrosTemplate = function(filePath) {
    var templateFile, templatePath;
    templatePath = path.join(__dirname, "../assets/macros-template.cson");
    templateFile = fs.readFileSync(templatePath, 'utf8');
    return fs.writeFileSync(filePath, templateFile);
  };

  checkMacros = function(macrosObject) {
    var name, value, _ref;
    for (name in macrosObject) {
      value = macrosObject[name];
      if (!(name.match(namePattern) && valueMatchesPattern(value))) {
        delete macrosObject[name];
        if ((_ref = atom.notifications) != null) {
          _ref.addError("Failed to load LaTeX macro named '" + name + "'. Please see the [LaTeX guide](https://github.com/Galadirith/markdown-preview-plus/blob/master/LATEX.md#macro-names)", {
            dismissable: true
          });
        }
      }
    }
    return macrosObject;
  };

  valueMatchesPattern = function(value) {
    var macroDefinition, numberOfArgs;
    switch (false) {
      case Object.prototype.toString.call(value) !== '[object Array]':
        macroDefinition = value[0];
        numberOfArgs = value[1];
        if (typeof numberOfArgs === 'number') {
          return numberOfArgs % 1 === 0 && typeof macroDefinition === 'string';
        } else {
          return false;
        }
        break;
      case typeof value !== 'string':
        return true;
      default:
        return false;
    }
  };

  configureMathJax = function() {
    var userMacros;
    userMacros = loadUserMacros();
    if (userMacros) {
      userMacros = checkMacros(userMacros);
    } else {
      userMacros = {};
    }
    MathJax.Hub.Config({
      jax: ["input/TeX", "output/HTML-CSS"],
      extensions: [],
      TeX: {
        extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"],
        Macros: userMacros
      },
      "HTML-CSS": {
        availableFonts: [],
        webFont: "TeX"
      },
      messageStyle: "none",
      showMathMenu: false,
      skipStartupTypeset: true
    });
    MathJax.Hub.Configured();
    atom.notifications.addSuccess("Loaded maths rendering engine MathJax", {
      dismissable: true
    });
  };

  attachMathJax = function() {
    var script;
    atom.notifications.addInfo("Loading maths rendering engine MathJax", {
      dismissable: true
    });
    script = document.createElement("script");
    script.src = "" + (require.resolve('MathJax')) + "?delayStartupUntil=configured";
    script.type = "text/javascript";
    script.addEventListener("load", function() {
      return configureMathJax();
    });
    document.getElementsByTagName("head")[0].appendChild(script);
    return script;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvbGliL21hdGhqYXgtaGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQU9BO0FBQUEsTUFBQSxzTEFBQTs7QUFBQSxFQUFDLElBQVMsT0FBQSxDQUFRLHNCQUFSLEVBQVQsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBVSxPQUFBLENBQVEsTUFBUixDQUZWLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQVUsT0FBQSxDQUFRLFFBQVIsQ0FIVixDQUFBOztBQUFBLEVBSUEsRUFBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBSlYsQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBVSxPQUFBLENBQVEsaUJBQVIsQ0FMVixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FPRTtBQUFBLElBQUEsV0FBQSxFQUFhLFNBQUMsUUFBRCxHQUFBO0FBQ1gsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFULENBQUE7QUFDQSxNQUFBLElBQUcsZ0JBQUg7QUFBa0IsUUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsU0FBQSxHQUFBO2lCQUFHLFFBQUEsQ0FBQSxFQUFIO1FBQUEsQ0FBaEMsQ0FBQSxDQUFsQjtPQUZXO0lBQUEsQ0FBYjtBQUFBLElBUUEsYUFBQSxFQUFlLENBQUMsQ0FBQyxJQUFGLENBQU8sU0FBQSxHQUFBO2FBQUcsYUFBQSxDQUFBLEVBQUg7SUFBQSxDQUFQLENBUmY7QUFBQSxJQWFBLFlBQUEsRUFBYyxTQUFBLEdBQUE7QUFFWixNQUFBLENBQUEsQ0FBRSwyQkFBRixDQUE4QixDQUFDLE1BQS9CLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixNQURqQixDQUFBO2FBSUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsQ0FBQyxDQUFDLElBQUYsQ0FBTyxTQUFBLEdBQUE7ZUFBRyxhQUFBLENBQUEsRUFBSDtNQUFBLENBQVAsRUFOTDtJQUFBLENBYmQ7QUFBQSxJQTRCQSxhQUFBLEVBQWUsU0FBQyxXQUFELEdBQUE7QUFDYixNQUFBLElBQUcsa0RBQUg7QUFDSyxRQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBWixDQUFrQixDQUFDLFNBQUQsRUFBWSxPQUFPLENBQUMsR0FBcEIsRUFBeUIsV0FBekIsQ0FBbEIsQ0FBQSxDQURMO09BQUEsTUFBQTtBQUVLLFFBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxTQUFBLEdBQUE7aUJBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFaLENBQWtCLENBQUMsU0FBRCxFQUFZLE9BQU8sQ0FBQyxHQUFwQixFQUF5QixXQUF6QixDQUFsQixFQUFIO1FBQUEsQ0FBYixDQUFBLENBRkw7T0FEYTtJQUFBLENBNUJmO0FBQUEsSUF5Q0EsaUJBQUEsRUFBbUIsU0FBQyxJQUFELEVBQU8sUUFBUCxHQUFBO0FBQ2pCLFVBQUEsMkRBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFWLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLElBRHBCLENBQUE7QUFBQSxNQUdBLDBCQUFBLEdBQTZCLFNBQUEsR0FBQTtBQUMzQixZQUFBLGVBQUE7QUFBQSxRQUFBLFNBQUEsd0VBQXlELENBQUUsVUFBVSxDQUFDLFNBQTFELENBQW9FLElBQXBFLFVBQVosQ0FBQTtBQUNBLFFBQUEsSUFBdUQsaUJBQXZEO0FBQUEsVUFBQSxPQUFPLENBQUMsWUFBUixDQUFxQixTQUFyQixFQUFnQyxPQUFPLENBQUMsVUFBeEMsQ0FBQSxDQUFBO1NBREE7QUFFQSxlQUFPLE9BQU8sQ0FBQyxTQUFmLENBSDJCO01BQUEsQ0FIN0IsQ0FBQTtBQUFBLE1BUUEsc0JBQUEsR0FBeUIsU0FBQSxHQUFBO2VBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBWixDQUNFLENBQUMsYUFBRCxFQUFnQixPQUFPLENBQUMsR0FBeEIsRUFBNkIsS0FBN0IsQ0FERixFQUVFLENBQUMsU0FBRCxFQUFZLE9BQU8sQ0FBQyxHQUFwQixFQUF5QixPQUF6QixDQUZGLEVBR0UsQ0FBQyxhQUFELEVBQWdCLE9BQU8sQ0FBQyxHQUF4QixFQUE2QixVQUE3QixDQUhGLEVBSUU7VUFBRSxTQUFBLEdBQUE7bUJBQUcsUUFBQSxDQUFTLDBCQUFBLENBQUEsQ0FBVCxFQUFIO1VBQUEsQ0FBRjtTQUpGLEVBRHVCO01BQUEsQ0FSekIsQ0FBQTtBQWdCQSxNQUFBLElBQUcsa0RBQUg7QUFDSyxRQUFBLHNCQUFBLENBQUEsQ0FBQSxDQURMO09BQUEsTUFBQTtBQUVLLFFBQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxzQkFBYixDQUFBLENBRkw7T0FqQmlCO0lBQUEsQ0F6Q25CO0dBZEYsQ0FBQTs7QUFBQSxFQWtGQSxXQUFBLEdBQWMsNkJBbEZkLENBQUE7O0FBQUEsRUF3RkEsaUJBQUEsR0FBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsY0FBQTtBQUFBLElBQUEsY0FBQSxHQUFrQixJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FBVixFQUFtQyx1QkFBbkMsQ0FBYixDQUFsQixDQUFBO29DQUNBLGlCQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBQVYsRUFBbUMsNEJBQW5DLEVBRkM7RUFBQSxDQXhGcEIsQ0FBQTs7QUFBQSxFQTRGQSxjQUFBLEdBQWlCLFNBQUMsUUFBRCxHQUFBO0FBQ2YsSUFBQSxJQUFBLENBQUEsSUFBcUIsQ0FBQyxZQUFMLENBQWtCLFFBQWxCLENBQWpCO0FBQUEsYUFBTyxFQUFQLENBQUE7S0FBQTtXQUNBLElBQUksQ0FBQyxZQUFMLENBQWtCLFFBQWxCLEVBQTRCLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUMxQixVQUFBLFdBQUE7O1FBRGtDLFNBQU87T0FDekM7QUFBQSxNQUFBLElBQUcsYUFBSDtBQUNFLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYyxtQ0FBQSxHQUFtQyxRQUFuQyxHQUE0QyxLQUE1QyxHQUFnRCx1Q0FBZSxLQUFmLENBQTlELENBQUEsQ0FBQTs7ZUFDa0IsQ0FBRSxRQUFwQixDQUE4QixvQ0FBQSxHQUFvQyxRQUFwQyxHQUE2QyxHQUEzRSxFQUErRTtBQUFBLFlBQUMsTUFBQSxFQUFRLEtBQUssQ0FBQyxPQUFmO0FBQUEsWUFBd0IsV0FBQSxFQUFhLElBQXJDO1dBQS9FO1NBRkY7T0FBQTthQUdBLE9BSjBCO0lBQUEsQ0FBNUIsRUFGZTtFQUFBLENBNUZqQixDQUFBOztBQUFBLEVBb0dBLGNBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsUUFBQSxzQkFBQTtBQUFBLElBQUEsY0FBQSxHQUFpQixpQkFBQSxDQUFBLENBQWpCLENBQUE7QUFDQSxJQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxjQUFkLENBQUg7YUFDRSxNQUFBLEdBQVMsY0FBQSxDQUFlLGNBQWYsRUFEWDtLQUFBLE1BQUE7QUFHRSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksb0VBQVosQ0FBQSxDQUFBO0FBQUEsTUFDQSxvQkFBQSxDQUFxQixjQUFyQixDQURBLENBQUE7YUFFQSxNQUFBLEdBQVMsY0FBQSxDQUFlLGNBQWYsRUFMWDtLQUZlO0VBQUEsQ0FwR2pCLENBQUE7O0FBQUEsRUE2R0Esb0JBQUEsR0FBdUIsU0FBQyxRQUFELEdBQUE7QUFDckIsUUFBQSwwQkFBQTtBQUFBLElBQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixnQ0FBckIsQ0FBZixDQUFBO0FBQUEsSUFDQSxZQUFBLEdBQWUsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsWUFBaEIsRUFBOEIsTUFBOUIsQ0FEZixDQUFBO1dBRUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFBMkIsWUFBM0IsRUFIcUI7RUFBQSxDQTdHdkIsQ0FBQTs7QUFBQSxFQWtIQSxXQUFBLEdBQWMsU0FBQyxZQUFELEdBQUE7QUFDWixRQUFBLGlCQUFBO0FBQUEsU0FBQSxvQkFBQTtpQ0FBQTtBQUNFLE1BQUEsSUFBQSxDQUFBLENBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFYLENBQUEsSUFBNEIsbUJBQUEsQ0FBb0IsS0FBcEIsQ0FBbkMsQ0FBQTtBQUNFLFFBQUEsTUFBQSxDQUFBLFlBQW9CLENBQUEsSUFBQSxDQUFwQixDQUFBOztjQUNrQixDQUFFLFFBQXBCLENBQThCLG9DQUFBLEdBQW9DLElBQXBDLEdBQXlDLHVIQUF2RSxFQUErTDtBQUFBLFlBQUMsV0FBQSxFQUFhLElBQWQ7V0FBL0w7U0FGRjtPQURGO0FBQUEsS0FBQTtXQUlBLGFBTFk7RUFBQSxDQWxIZCxDQUFBOztBQUFBLEVBeUhBLG1CQUFBLEdBQXNCLFNBQUMsS0FBRCxHQUFBO0FBRXBCLFFBQUEsNkJBQUE7QUFBQSxZQUFBLEtBQUE7QUFBQSxXQUVPLE1BQU0sQ0FBQSxTQUFFLENBQUEsUUFBUSxDQUFDLElBQWpCLENBQXNCLEtBQXRCLENBQUEsS0FBZ0MsZ0JBRnZDO0FBR0ksUUFBQSxlQUFBLEdBQWtCLEtBQU0sQ0FBQSxDQUFBLENBQXhCLENBQUE7QUFBQSxRQUNBLFlBQUEsR0FBZSxLQUFNLENBQUEsQ0FBQSxDQURyQixDQUFBO0FBRUEsUUFBQSxJQUFHLE1BQUEsQ0FBQSxZQUFBLEtBQXdCLFFBQTNCO2lCQUNFLFlBQUEsR0FBZSxDQUFmLEtBQW9CLENBQXBCLElBQTBCLE1BQUEsQ0FBQSxlQUFBLEtBQTBCLFNBRHREO1NBQUEsTUFBQTtpQkFHRSxNQUhGO1NBTEo7QUFFTztBQUZQLFdBVU8sTUFBQSxDQUFBLEtBQUEsS0FBZ0IsUUFWdkI7ZUFXSSxLQVhKO0FBQUE7ZUFZTyxNQVpQO0FBQUEsS0FGb0I7RUFBQSxDQXpIdEIsQ0FBQTs7QUFBQSxFQTRJQSxnQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsUUFBQSxVQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsY0FBQSxDQUFBLENBQWIsQ0FBQTtBQUNBLElBQUEsSUFBRyxVQUFIO0FBQ0UsTUFBQSxVQUFBLEdBQWEsV0FBQSxDQUFZLFVBQVosQ0FBYixDQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsVUFBQSxHQUFhLEVBQWIsQ0FIRjtLQURBO0FBQUEsSUFPQSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosQ0FDRTtBQUFBLE1BQUEsR0FBQSxFQUFLLENBQ0gsV0FERyxFQUVILGlCQUZHLENBQUw7QUFBQSxNQUlBLFVBQUEsRUFBWSxFQUpaO0FBQUEsTUFLQSxHQUFBLEVBQ0U7QUFBQSxRQUFBLFVBQUEsRUFBWSxDQUNWLFlBRFUsRUFFVixlQUZVLEVBR1YsYUFIVSxFQUlWLGdCQUpVLENBQVo7QUFBQSxRQU1BLE1BQUEsRUFBUSxVQU5SO09BTkY7QUFBQSxNQWFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsY0FBQSxFQUFnQixFQUFoQjtBQUFBLFFBQ0EsT0FBQSxFQUFTLEtBRFQ7T0FkRjtBQUFBLE1BZ0JBLFlBQUEsRUFBYyxNQWhCZDtBQUFBLE1BaUJBLFlBQUEsRUFBYyxLQWpCZDtBQUFBLE1Ba0JBLGtCQUFBLEVBQW9CLElBbEJwQjtLQURGLENBUEEsQ0FBQTtBQUFBLElBMkJBLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBWixDQUFBLENBM0JBLENBQUE7QUFBQSxJQThCQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLHVDQUE5QixFQUF1RTtBQUFBLE1BQUEsV0FBQSxFQUFhLElBQWI7S0FBdkUsQ0E5QkEsQ0FEaUI7RUFBQSxDQTVJbkIsQ0FBQTs7QUFBQSxFQWtMQSxhQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUVkLFFBQUEsTUFBQTtBQUFBLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQix3Q0FBM0IsRUFBcUU7QUFBQSxNQUFBLFdBQUEsRUFBYSxJQUFiO0tBQXJFLENBQUEsQ0FBQTtBQUFBLElBR0EsTUFBQSxHQUFjLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBSGQsQ0FBQTtBQUFBLElBSUEsTUFBTSxDQUFDLEdBQVAsR0FBYyxFQUFBLEdBQUUsQ0FBQyxPQUFPLENBQUMsT0FBUixDQUFnQixTQUFoQixDQUFELENBQUYsR0FBOEIsK0JBSjVDLENBQUE7QUFBQSxJQUtBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsaUJBTGQsQ0FBQTtBQUFBLElBTUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFNBQUEsR0FBQTthQUFHLGdCQUFBLENBQUEsRUFBSDtJQUFBLENBQWhDLENBTkEsQ0FBQTtBQUFBLElBT0EsUUFBUSxDQUFDLG9CQUFULENBQThCLE1BQTlCLENBQXNDLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBekMsQ0FBcUQsTUFBckQsQ0FQQSxDQUFBO0FBU0EsV0FBTyxNQUFQLENBWGM7RUFBQSxDQWxMaEIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/lib/mathjax-helper.coffee
