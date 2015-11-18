(function() {
  var atomConfig, cheerio, config, currentText, findFileRecursive, fs, getArguments, getMathJaxPath, handleError, handleMath, handleResponse, handleSuccess, path, pdc, removeReferences, renderPandoc, setPandocOptions, _;

  pdc = require('pdc');

  _ = require('underscore-plus');

  cheerio = null;

  fs = null;

  path = null;

  currentText = null;

  atomConfig = null;

  config = {};


  /**
   * Sets local mathjaxPath if available
   */

  getMathJaxPath = function() {
    var e;
    try {
      return config.mathjax = require.resolve('MathJax');
    } catch (_error) {
      e = _error;
      return config.mathjax = '';
    }
  };

  findFileRecursive = function(filePath, fileName) {
    var bibFile, newPath;
    if (fs == null) {
      fs = require('fs');
    }
    if (path == null) {
      path = require('path');
    }
    bibFile = path.join(filePath, '../', fileName);
    if (fs.existsSync(bibFile)) {
      return bibFile;
    } else {
      newPath = path.join(bibFile, '..');
      if (newPath !== filePath && !_.contains(atom.project.getPaths(), newPath)) {
        return findFileRecursive(newPath, fileName);
      } else {
        return false;
      }
    }
  };


  /**
   * Sets local variables needed for everything
   * @param {string} path to markdown file
   *
   */

  setPandocOptions = function(filePath) {
    var bibFile, cslFile;
    atomConfig = atom.config.get('markdown-preview-plus');
    pdc.path = atomConfig.pandocPath;
    config.flavor = atomConfig.pandocMarkdownFlavor;
    config.args = {};
    if (config.mathjax == null) {
      getMathJaxPath();
    }
    config.args.mathjax = config.renderMath ? config.mathjax : void 0;
    if (atomConfig.pandocBibliography) {
      config.args.filter = ['pandoc-citeproc'];
      bibFile = findFileRecursive(filePath, atomConfig.pandocBIBFile);
      if (!bibFile) {
        bibFile = atomConfig.pandocBIBFileFallback;
      }
      config.args.bibliography = bibFile ? bibFile : void 0;
      cslFile = findFileRecursive(filePath, atomConfig.pandocCSLFile);
      if (!cslFile) {
        cslFile = atomConfig.pandocCSLFileFallback;
      }
      config.args.csl = cslFile ? cslFile : void 0;
    }
    return config;
  };


  /**
   * Handle error response from pdc
   * @param {error} Returned error
   * @param {string} Returned HTML
   * @return {array} with Arguments for callbackFunction (error set to null)
   */

  handleError = function(error, html) {
    var isOnlyMissingReferences, message, referenceSearch;
    referenceSearch = /pandoc-citeproc: reference ([\S]+) not found(<br>)?/ig;
    message = _.uniq(error.message.split('\n')).join('<br>');
    html = "<h1>Pandoc Error:</h1><p><b>" + message + "</b></p><hr>";
    isOnlyMissingReferences = message.replace(referenceSearch, '').length === 0;
    if (isOnlyMissingReferences) {
      message.match(referenceSearch).forEach(function(match) {
        var r;
        match = match.replace(referenceSearch, '$1');
        r = new RegExp("@" + match, 'gi');
        return currentText = currentText.replace(r, "&#64;" + match);
      });
      currentText = html + currentText;
      pdc(currentText, config.flavor, 'html', config.args, handleResponse);
    }
    return [null, html];
  };


  /**
   * Adjusts all math environments in HTML
   * @param {string} HTML to be adjusted
   * @return {string} HTML with adjusted math environments
   */

  handleMath = function(html) {
    var o;
    if (cheerio == null) {
      cheerio = require('cheerio');
    }
    o = cheerio.load("<div>" + html + "</div>");
    o('.math').each(function(i, elem) {
      var math, mode, newContent;
      math = cheerio(this).text();
      mode = math.indexOf('\\[') > -1 ? '; mode=display' : '';
      math = math.replace(/\\[[()\]]/g, '');
      newContent = '<span class="math">' + ("<script type='math/tex" + mode + "'>" + math + "</script>") + '</span>';
      return cheerio(this).replaceWith(newContent);
    });
    return o('div').html();
  };

  removeReferences = function(html) {
    var o;
    if (cheerio == null) {
      cheerio = require('cheerio');
    }
    o = cheerio.load("<div>" + html + "</div>");
    o('.references').each(function(i, elem) {
      return cheerio(this).remove();
    });
    return o('div').html();
  };


  /**
   * Handle successful response from pdc
   * @param {string} Returned HTML
   * @return {array} with Arguments for callbackFunction (error set to null)
   */

  handleSuccess = function(html) {
    if (config.renderMath) {
      html = handleMath(html);
    }
    if (atomConfig.pandocRemoveReferences) {
      html = removeReferences(html);
    }
    return [null, html];
  };


  /**
   * Handle response from pdc
   * @param {Object} error if thrown
   * @param {string} Returned HTML
   */

  handleResponse = function(error, html) {
    var array;
    array = error != null ? handleError(error, html) : handleSuccess(html);
    return config.callback.apply(config.callback, array);
  };


  /**
   * Renders markdown with pandoc
   * @param {string} document in markdown
   * @param {boolean} whether to render the math with mathjax
   * @param {function} callbackFunction
   */

  renderPandoc = function(text, filePath, renderMath, cb) {
    currentText = text;
    config.renderMath = renderMath;
    config.callback = cb;
    setPandocOptions(filePath);
    return pdc(text, config.flavor, 'html', getArguments(config.args), handleResponse);
  };

  getArguments = function(args) {
    args = _.reduce(args, function(res, val, key) {
      if (!_.isEmpty(val)) {
        val = _.flatten([val]);
        _.forEach(val, function(v) {
          if (!_.isEmpty(v)) {
            return res.push("--" + key + "=" + v);
          }
        });
      }
      return res;
    }, []);
    args = _.union(args, atom.config.get('markdown-preview-plus.pandocArguments'));
    args = _.map(args, function(val) {
      val = val.replace(/^(--[\w\-]+)\s(.+)$/i, "$1=$2");
      if (val.substr(0, 1) !== '-') {
        return void 0;
      } else {
        return val;
      }
    });
    return _.reject(args, _.isEmpty);
  };

  module.exports = {
    renderPandoc: renderPandoc,
    __testing__: {
      findFileRecursive: findFileRecursive,
      setPandocOptions: setPandocOptions,
      getArguments: getArguments
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvbGliL3BhbmRvYy1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFOQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLElBRlYsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxJQUhMLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sSUFKUCxDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLElBUGQsQ0FBQTs7QUFBQSxFQVNBLFVBQUEsR0FBYSxJQVRiLENBQUE7O0FBQUEsRUFXQSxNQUFBLEdBQVMsRUFYVCxDQUFBOztBQWFBO0FBQUE7O0tBYkE7O0FBQUEsRUFnQkEsY0FBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixRQUFBLENBQUE7QUFBQTthQUNFLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFNBQWhCLEVBRG5CO0tBQUEsY0FBQTtBQUdFLE1BREksVUFDSixDQUFBO2FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsR0FIbkI7S0FEZTtFQUFBLENBaEJqQixDQUFBOztBQUFBLEVBc0JBLGlCQUFBLEdBQW9CLFNBQUMsUUFBRCxFQUFXLFFBQVgsR0FBQTtBQUNsQixRQUFBLGdCQUFBOztNQUFBLEtBQU0sT0FBQSxDQUFRLElBQVI7S0FBTjs7TUFDQSxPQUFRLE9BQUEsQ0FBUSxNQUFSO0tBRFI7QUFBQSxJQUVBLE9BQUEsR0FBVSxJQUFJLENBQUMsSUFBTCxDQUFVLFFBQVYsRUFBb0IsS0FBcEIsRUFBMkIsUUFBM0IsQ0FGVixDQUFBO0FBR0EsSUFBQSxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsT0FBZCxDQUFIO2FBQ0UsUUFERjtLQUFBLE1BQUE7QUFHRSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FBVixDQUFBO0FBQ0EsTUFBQSxJQUFHLE9BQUEsS0FBYSxRQUFiLElBQTBCLENBQUEsQ0FBSyxDQUFDLFFBQUYsQ0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUFYLEVBQW9DLE9BQXBDLENBQWpDO2VBQ0UsaUJBQUEsQ0FBa0IsT0FBbEIsRUFBMkIsUUFBM0IsRUFERjtPQUFBLE1BQUE7ZUFHRSxNQUhGO09BSkY7S0FKa0I7RUFBQSxDQXRCcEIsQ0FBQTs7QUFtQ0E7QUFBQTs7OztLQW5DQTs7QUFBQSxFQXdDQSxnQkFBQSxHQUFtQixTQUFDLFFBQUQsR0FBQTtBQUNqQixRQUFBLGdCQUFBO0FBQUEsSUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixDQUFiLENBQUE7QUFBQSxJQUNBLEdBQUcsQ0FBQyxJQUFKLEdBQVcsVUFBVSxDQUFDLFVBRHRCLENBQUE7QUFBQSxJQUVBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLFVBQVUsQ0FBQyxvQkFGM0IsQ0FBQTtBQUFBLElBR0EsTUFBTSxDQUFDLElBQVAsR0FBYyxFQUhkLENBQUE7QUFJQSxJQUFBLElBQXdCLHNCQUF4QjtBQUFBLE1BQUEsY0FBQSxDQUFBLENBQUEsQ0FBQTtLQUpBO0FBQUEsSUFLQSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQVosR0FBeUIsTUFBTSxDQUFDLFVBQVYsR0FBMEIsTUFBTSxDQUFDLE9BQWpDLEdBQThDLE1BTHBFLENBQUE7QUFNQSxJQUFBLElBQUcsVUFBVSxDQUFDLGtCQUFkO0FBQ0UsTUFBQSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQVosR0FBcUIsQ0FBQyxpQkFBRCxDQUFyQixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsaUJBQUEsQ0FBa0IsUUFBbEIsRUFBNEIsVUFBVSxDQUFDLGFBQXZDLENBRFYsQ0FBQTtBQUVBLE1BQUEsSUFBQSxDQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBVSxVQUFVLENBQUMscUJBQXJCLENBQUE7T0FGQTtBQUFBLE1BR0EsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFaLEdBQThCLE9BQUgsR0FBZ0IsT0FBaEIsR0FBNkIsTUFIeEQsQ0FBQTtBQUFBLE1BSUEsT0FBQSxHQUFVLGlCQUFBLENBQWtCLFFBQWxCLEVBQTRCLFVBQVUsQ0FBQyxhQUF2QyxDQUpWLENBQUE7QUFLQSxNQUFBLElBQUEsQ0FBQSxPQUFBO0FBQUEsUUFBQSxPQUFBLEdBQVUsVUFBVSxDQUFDLHFCQUFyQixDQUFBO09BTEE7QUFBQSxNQU1BLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBWixHQUFxQixPQUFILEdBQWdCLE9BQWhCLEdBQTZCLE1BTi9DLENBREY7S0FOQTtXQWNBLE9BZmlCO0VBQUEsQ0F4Q25CLENBQUE7O0FBeURBO0FBQUE7Ozs7O0tBekRBOztBQUFBLEVBK0RBLFdBQUEsR0FBYyxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDWixRQUFBLGlEQUFBO0FBQUEsSUFBQSxlQUFBLEdBQWtCLHVEQUFsQixDQUFBO0FBQUEsSUFDQSxPQUFBLEdBQ0UsQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQWQsQ0FBb0IsSUFBcEIsQ0FBUCxDQUNBLENBQUMsSUFERCxDQUNNLE1BRE4sQ0FGRixDQUFBO0FBQUEsSUFJQSxJQUFBLEdBQVEsOEJBQUEsR0FBOEIsT0FBOUIsR0FBc0MsY0FKOUMsQ0FBQTtBQUFBLElBS0EsdUJBQUEsR0FDRSxPQUFPLENBQUMsT0FBUixDQUFnQixlQUFoQixFQUFpQyxFQUFqQyxDQUNBLENBQUMsTUFERCxLQUNXLENBUGIsQ0FBQTtBQVFBLElBQUEsSUFBRyx1QkFBSDtBQUNFLE1BQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxlQUFkLENBQ0EsQ0FBQyxPQURELENBQ1MsU0FBQyxLQUFELEdBQUE7QUFDUCxZQUFBLENBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxLQUFLLENBQUMsT0FBTixDQUFjLGVBQWQsRUFBK0IsSUFBL0IsQ0FBUixDQUFBO0FBQUEsUUFDQSxDQUFBLEdBQVEsSUFBQSxNQUFBLENBQVEsR0FBQSxHQUFHLEtBQVgsRUFBb0IsSUFBcEIsQ0FEUixDQUFBO2VBRUEsV0FBQSxHQUFjLFdBQVcsQ0FBQyxPQUFaLENBQW9CLENBQXBCLEVBQXdCLE9BQUEsR0FBTyxLQUEvQixFQUhQO01BQUEsQ0FEVCxDQUFBLENBQUE7QUFBQSxNQUtBLFdBQUEsR0FBYyxJQUFBLEdBQU8sV0FMckIsQ0FBQTtBQUFBLE1BTUEsR0FBQSxDQUFJLFdBQUosRUFBaUIsTUFBTSxDQUFDLE1BQXhCLEVBQWdDLE1BQWhDLEVBQXdDLE1BQU0sQ0FBQyxJQUEvQyxFQUFxRCxjQUFyRCxDQU5BLENBREY7S0FSQTtXQWdCQSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBakJZO0VBQUEsQ0EvRGQsQ0FBQTs7QUFrRkE7QUFBQTs7OztLQWxGQTs7QUFBQSxFQXVGQSxVQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxRQUFBLENBQUE7O01BQUEsVUFBVyxPQUFBLENBQVEsU0FBUjtLQUFYO0FBQUEsSUFDQSxDQUFBLEdBQUksT0FBTyxDQUFDLElBQVIsQ0FBYyxPQUFBLEdBQU8sSUFBUCxHQUFZLFFBQTFCLENBREosQ0FBQTtBQUFBLElBRUEsQ0FBQSxDQUFFLE9BQUYsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsU0FBQyxDQUFELEVBQUksSUFBSixHQUFBO0FBQ2QsVUFBQSxzQkFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxJQUFSLENBQWEsQ0FBQyxJQUFkLENBQUEsQ0FBUCxDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLENBQUEsR0FBc0IsQ0FBQSxDQUF6QixHQUFrQyxnQkFBbEMsR0FBd0QsRUFGL0QsQ0FBQTtBQUFBLE1BS0EsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsWUFBYixFQUEyQixFQUEzQixDQUxQLENBQUE7QUFBQSxNQU1BLFVBQUEsR0FDRSxxQkFBQSxHQUNBLENBQUMsd0JBQUEsR0FBd0IsSUFBeEIsR0FBNkIsSUFBN0IsR0FBaUMsSUFBakMsR0FBc0MsV0FBdkMsQ0FEQSxHQUVBLFNBVEYsQ0FBQTthQVdBLE9BQUEsQ0FBUSxJQUFSLENBQWEsQ0FBQyxXQUFkLENBQTBCLFVBQTFCLEVBWmM7SUFBQSxDQUFoQixDQUZBLENBQUE7V0FnQkEsQ0FBQSxDQUFFLEtBQUYsQ0FBUSxDQUFDLElBQVQsQ0FBQSxFQWpCVztFQUFBLENBdkZiLENBQUE7O0FBQUEsRUEwR0EsZ0JBQUEsR0FBbUIsU0FBQyxJQUFELEdBQUE7QUFDakIsUUFBQSxDQUFBOztNQUFBLFVBQVcsT0FBQSxDQUFRLFNBQVI7S0FBWDtBQUFBLElBQ0EsQ0FBQSxHQUFJLE9BQU8sQ0FBQyxJQUFSLENBQWMsT0FBQSxHQUFPLElBQVAsR0FBWSxRQUExQixDQURKLENBQUE7QUFBQSxJQUVBLENBQUEsQ0FBRSxhQUFGLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsU0FBQyxDQUFELEVBQUksSUFBSixHQUFBO2FBQ3BCLE9BQUEsQ0FBUSxJQUFSLENBQWEsQ0FBQyxNQUFkLENBQUEsRUFEb0I7SUFBQSxDQUF0QixDQUZBLENBQUE7V0FJQSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsSUFBVCxDQUFBLEVBTGlCO0VBQUEsQ0ExR25CLENBQUE7O0FBaUhBO0FBQUE7Ozs7S0FqSEE7O0FBQUEsRUFzSEEsYUFBQSxHQUFnQixTQUFDLElBQUQsR0FBQTtBQUNkLElBQUEsSUFBMEIsTUFBTSxDQUFDLFVBQWpDO0FBQUEsTUFBQSxJQUFBLEdBQU8sVUFBQSxDQUFXLElBQVgsQ0FBUCxDQUFBO0tBQUE7QUFDQSxJQUFBLElBQWdDLFVBQVUsQ0FBQyxzQkFBM0M7QUFBQSxNQUFBLElBQUEsR0FBTyxnQkFBQSxDQUFpQixJQUFqQixDQUFQLENBQUE7S0FEQTtXQUVBLENBQUMsSUFBRCxFQUFPLElBQVAsRUFIYztFQUFBLENBdEhoQixDQUFBOztBQTJIQTtBQUFBOzs7O0tBM0hBOztBQUFBLEVBZ0lBLGNBQUEsR0FBaUIsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ2YsUUFBQSxLQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVcsYUFBSCxHQUFlLFdBQUEsQ0FBWSxLQUFaLEVBQW1CLElBQW5CLENBQWYsR0FBNEMsYUFBQSxDQUFjLElBQWQsQ0FBcEQsQ0FBQTtXQUNBLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBaEIsQ0FBc0IsTUFBTSxDQUFDLFFBQTdCLEVBQXVDLEtBQXZDLEVBRmU7RUFBQSxDQWhJakIsQ0FBQTs7QUFvSUE7QUFBQTs7Ozs7S0FwSUE7O0FBQUEsRUEwSUEsWUFBQSxHQUFlLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsVUFBakIsRUFBNkIsRUFBN0IsR0FBQTtBQUNiLElBQUEsV0FBQSxHQUFjLElBQWQsQ0FBQTtBQUFBLElBQ0EsTUFBTSxDQUFDLFVBQVAsR0FBb0IsVUFEcEIsQ0FBQTtBQUFBLElBRUEsTUFBTSxDQUFDLFFBQVAsR0FBa0IsRUFGbEIsQ0FBQTtBQUFBLElBR0EsZ0JBQUEsQ0FBaUIsUUFBakIsQ0FIQSxDQUFBO1dBSUEsR0FBQSxDQUFJLElBQUosRUFBVSxNQUFNLENBQUMsTUFBakIsRUFBeUIsTUFBekIsRUFBaUMsWUFBQSxDQUFhLE1BQU0sQ0FBQyxJQUFwQixDQUFqQyxFQUE0RCxjQUE1RCxFQUxhO0VBQUEsQ0ExSWYsQ0FBQTs7QUFBQSxFQWlKQSxZQUFBLEdBQWUsU0FBQyxJQUFELEdBQUE7QUFDYixJQUFBLElBQUEsR0FBTyxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFDTCxTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxHQUFBO0FBQ0UsTUFBQSxJQUFBLENBQUEsQ0FBUSxDQUFDLE9BQUYsQ0FBVSxHQUFWLENBQVA7QUFDRSxRQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsT0FBRixDQUFVLENBQUMsR0FBRCxDQUFWLENBQU4sQ0FBQTtBQUFBLFFBQ0EsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxHQUFWLEVBQWUsU0FBQyxDQUFELEdBQUE7QUFDYixVQUFBLElBQUEsQ0FBQSxDQUFpQyxDQUFDLE9BQUYsQ0FBVSxDQUFWLENBQWhDO21CQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVUsSUFBQSxHQUFJLEdBQUosR0FBUSxHQUFSLEdBQVcsQ0FBckIsRUFBQTtXQURhO1FBQUEsQ0FBZixDQURBLENBREY7T0FBQTtBQUlBLGFBQU8sR0FBUCxDQUxGO0lBQUEsQ0FESyxFQU9ILEVBUEcsQ0FBUCxDQUFBO0FBQUEsSUFRQSxJQUFBLEdBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFSLEVBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVDQUFoQixDQUFkLENBUlAsQ0FBQTtBQUFBLElBU0EsSUFBQSxHQUFPLENBQUMsQ0FBQyxHQUFGLENBQU0sSUFBTixFQUNMLFNBQUMsR0FBRCxHQUFBO0FBQ0UsTUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFDLE9BQUosQ0FBWSxzQkFBWixFQUFvQyxPQUFwQyxDQUFOLENBQUE7QUFDQSxNQUFBLElBQUcsR0FBRyxDQUFDLE1BQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxDQUFBLEtBQXNCLEdBQXpCO2VBQWtDLE9BQWxDO09BQUEsTUFBQTtlQUFpRCxJQUFqRDtPQUZGO0lBQUEsQ0FESyxDQVRQLENBQUE7V0FhQSxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxDQUFDLENBQUMsT0FBakIsRUFkYTtFQUFBLENBakpmLENBQUE7O0FBQUEsRUFpS0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsWUFBQSxFQUFjLFlBQWQ7QUFBQSxJQUNBLFdBQUEsRUFDRTtBQUFBLE1BQUEsaUJBQUEsRUFBbUIsaUJBQW5CO0FBQUEsTUFDQSxnQkFBQSxFQUFrQixnQkFEbEI7QUFBQSxNQUVBLFlBQUEsRUFBYyxZQUZkO0tBRkY7R0FsS0YsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/lib/pandoc-helper.coffee
