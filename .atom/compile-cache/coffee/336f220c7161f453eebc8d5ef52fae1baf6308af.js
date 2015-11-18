(function() {
  var $, Highlights, cheerio, fs, highlighter, imageWatcher, markdownIt, packagePath, pandocHelper, path, render, resolveImagePaths, resourcePath, sanitize, scopeForFenceName, tokenizeCodeBlocks, _;

  path = require('path');

  _ = require('underscore-plus');

  cheerio = require('cheerio');

  fs = require('fs-plus');

  Highlights = require('highlights-native');

  $ = require('atom-space-pen-views').$;

  pandocHelper = null;

  markdownIt = null;

  scopeForFenceName = require('./extension-helper').scopeForFenceName;

  imageWatcher = require('./image-watch-helper');

  highlighter = null;

  resourcePath = atom.getLoadSettings().resourcePath;

  packagePath = path.dirname(__dirname);

  exports.toDOMFragment = function(text, filePath, grammar, renderLaTeX, callback) {
    if (text == null) {
      text = '';
    }
    return render(text, filePath, renderLaTeX, false, function(error, html) {
      var domFragment, template;
      if (error != null) {
        return callback(error);
      }
      template = document.createElement('template');
      template.innerHTML = html;
      domFragment = template.content.cloneNode(true);
      return callback(null, domFragment);
    });
  };

  exports.toHTML = function(text, filePath, grammar, renderLaTeX, copyHTMLFlag, callback) {
    if (text == null) {
      text = '';
    }
    return render(text, filePath, renderLaTeX, copyHTMLFlag, function(error, html) {
      var defaultCodeLanguage;
      if (error != null) {
        return callback(error);
      }
      if ((grammar != null ? grammar.scopeName : void 0) === 'source.litcoffee') {
        defaultCodeLanguage = 'coffee';
      }
      html = tokenizeCodeBlocks(html, defaultCodeLanguage);
      return callback(null, html);
    });
  };

  render = function(text, filePath, renderLaTeX, copyHTMLFlag, callback) {
    var callbackFunction;
    text = text.replace(/^\s*<!doctype(\s+.*)?>\s*/i, '');
    callbackFunction = function(error, html) {
      if (error != null) {
        return callback(error);
      }
      html = sanitize(html);
      html = resolveImagePaths(html, filePath, copyHTMLFlag);
      return callback(null, html.trim());
    };
    if (atom.config.get('markdown-preview-plus.enablePandoc')) {
      if (pandocHelper == null) {
        pandocHelper = require('./pandoc-helper');
      }
      return pandocHelper.renderPandoc(text, filePath, renderLaTeX, callbackFunction);
    } else {
      if (markdownIt == null) {
        markdownIt = require('./markdown-it-helper');
      }
      return callbackFunction(null, markdownIt.render(text, renderLaTeX));
    }
  };

  sanitize = function(html) {
    var attribute, attributesToRemove, o, _i, _len;
    o = cheerio.load(html);
    o("script:not([type^='math/tex'])").remove();
    attributesToRemove = ['onabort', 'onblur', 'onchange', 'onclick', 'ondbclick', 'onerror', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmousedown', 'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup', 'onreset', 'onresize', 'onscroll', 'onselect', 'onsubmit', 'onunload'];
    for (_i = 0, _len = attributesToRemove.length; _i < _len; _i++) {
      attribute = attributesToRemove[_i];
      o('*').removeAttr(attribute);
    }
    return o.html();
  };

  resolveImagePaths = function(html, filePath, copyHTMLFlag) {
    var e, img, imgElement, o, rootDirectory, src, v, _i, _len, _ref;
    if (atom.project != null) {
      rootDirectory = atom.project.relativizePath(filePath)[0];
    }
    o = cheerio.load(html);
    _ref = o('img');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      imgElement = _ref[_i];
      img = o(imgElement);
      if (src = img.attr('src')) {
        if (!atom.config.get('markdown-preview-plus.enablePandoc')) {
          if (markdownIt == null) {
            markdownIt = require('./markdown-it-helper');
          }
          src = markdownIt.decode(src);
        }
        if (src.match(/^(https?|atom):\/\//)) {
          continue;
        }
        if (src.startsWith(process.resourcesPath)) {
          continue;
        }
        if (src.startsWith(resourcePath)) {
          continue;
        }
        if (src.startsWith(packagePath)) {
          continue;
        }
        if (src[0] === '/') {
          if (!fs.isFileSync(src)) {
            try {
              src = path.join(rootDirectory, src.substring(1));
            } catch (_error) {
              e = _error;
            }
          }
        } else {
          src = path.resolve(path.dirname(filePath), src);
        }
        if (!copyHTMLFlag) {
          v = imageWatcher.getVersion(src, filePath);
          if (v) {
            src = "" + src + "?v=" + v;
          }
        }
        img.attr('src', src);
      }
    }
    return o.html();
  };

  exports.convertCodeBlocksToAtomEditors = function(domFragment, defaultLanguage) {
    var codeBlock, codeElement, editor, editorElement, fenceName, fontFamily, grammar, preElement, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4;
    if (defaultLanguage == null) {
      defaultLanguage = 'text';
    }
    if (fontFamily = atom.config.get('editor.fontFamily')) {
      _ref = domFragment.querySelectorAll('code');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        codeElement = _ref[_i];
        codeElement.style.fontFamily = fontFamily;
      }
    }
    _ref1 = domFragment.querySelectorAll('pre');
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      preElement = _ref1[_j];
      codeBlock = (_ref2 = preElement.firstElementChild) != null ? _ref2 : preElement;
      fenceName = (_ref3 = (_ref4 = codeBlock.getAttribute('class')) != null ? _ref4.replace(/^lang-/, '') : void 0) != null ? _ref3 : defaultLanguage;
      editorElement = document.createElement('atom-text-editor');
      editorElement.setAttributeNode(document.createAttribute('gutter-hidden'));
      editorElement.removeAttribute('tabindex');
      preElement.parentNode.insertBefore(editorElement, preElement);
      preElement.remove();
      editor = editorElement.getModel();
      editor.getDecorations({
        "class": 'cursor-line',
        type: 'line'
      })[0].destroy();
      editor.setText(codeBlock.textContent.trim());
      if (grammar = atom.grammars.grammarForScopeName(scopeForFenceName(fenceName))) {
        editor.setGrammar(grammar);
      }
    }
    return domFragment;
  };

  tokenizeCodeBlocks = function(html, defaultLanguage) {
    var codeBlock, fenceName, fontFamily, highlightedBlock, highlightedHtml, o, preElement, _i, _len, _ref, _ref1, _ref2;
    if (defaultLanguage == null) {
      defaultLanguage = 'text';
    }
    o = cheerio.load(html);
    if (fontFamily = atom.config.get('editor.fontFamily')) {
      o('code').css('font-family', fontFamily);
    }
    _ref = o("pre");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      preElement = _ref[_i];
      codeBlock = o(preElement).children().first();
      fenceName = (_ref1 = (_ref2 = codeBlock.attr('class')) != null ? _ref2.replace(/^lang-/, '') : void 0) != null ? _ref1 : defaultLanguage;
      if (highlighter == null) {
        highlighter = new Highlights({
          registry: atom.grammars
        });
      }
      highlightedHtml = highlighter.highlightSync({
        fileContents: codeBlock.text(),
        scopeName: scopeForFenceName(fenceName)
      });
      highlightedBlock = o(highlightedHtml);
      highlightedBlock.removeClass('editor').addClass("lang-" + fenceName);
      o(preElement).replaceWith(highlightedBlock);
    }
    return o.html();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvbGliL3JlbmRlcmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrTEFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUixDQUZWLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxtQkFBUixDQUpiLENBQUE7O0FBQUEsRUFLQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBTEQsQ0FBQTs7QUFBQSxFQU1BLFlBQUEsR0FBZSxJQU5mLENBQUE7O0FBQUEsRUFPQSxVQUFBLEdBQWEsSUFQYixDQUFBOztBQUFBLEVBUUMsb0JBQXFCLE9BQUEsQ0FBUSxvQkFBUixFQUFyQixpQkFSRCxDQUFBOztBQUFBLEVBU0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQVRmLENBQUE7O0FBQUEsRUFXQSxXQUFBLEdBQWMsSUFYZCxDQUFBOztBQUFBLEVBWUMsZUFBZ0IsSUFBSSxDQUFDLGVBQUwsQ0FBQSxFQUFoQixZQVpELENBQUE7O0FBQUEsRUFhQSxXQUFBLEdBQWMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLENBYmQsQ0FBQTs7QUFBQSxFQWVBLE9BQU8sQ0FBQyxhQUFSLEdBQXdCLFNBQUMsSUFBRCxFQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsV0FBN0IsRUFBMEMsUUFBMUMsR0FBQTs7TUFBQyxPQUFLO0tBQzVCO1dBQUEsTUFBQSxDQUFPLElBQVAsRUFBYSxRQUFiLEVBQXVCLFdBQXZCLEVBQW9DLEtBQXBDLEVBQTJDLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUN6QyxVQUFBLHFCQUFBO0FBQUEsTUFBQSxJQUEwQixhQUExQjtBQUFBLGVBQU8sUUFBQSxDQUFTLEtBQVQsQ0FBUCxDQUFBO09BQUE7QUFBQSxNQUVBLFFBQUEsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixVQUF2QixDQUZYLENBQUE7QUFBQSxNQUdBLFFBQVEsQ0FBQyxTQUFULEdBQXFCLElBSHJCLENBQUE7QUFBQSxNQUlBLFdBQUEsR0FBYyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQWpCLENBQTJCLElBQTNCLENBSmQsQ0FBQTthQU1BLFFBQUEsQ0FBUyxJQUFULEVBQWUsV0FBZixFQVB5QztJQUFBLENBQTNDLEVBRHNCO0VBQUEsQ0FmeEIsQ0FBQTs7QUFBQSxFQXlCQSxPQUFPLENBQUMsTUFBUixHQUFpQixTQUFDLElBQUQsRUFBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLFdBQTdCLEVBQTBDLFlBQTFDLEVBQXdELFFBQXhELEdBQUE7O01BQUMsT0FBSztLQUNyQjtXQUFBLE1BQUEsQ0FBTyxJQUFQLEVBQWEsUUFBYixFQUF1QixXQUF2QixFQUFvQyxZQUFwQyxFQUFrRCxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDaEQsVUFBQSxtQkFBQTtBQUFBLE1BQUEsSUFBMEIsYUFBMUI7QUFBQSxlQUFPLFFBQUEsQ0FBUyxLQUFULENBQVAsQ0FBQTtPQUFBO0FBRUEsTUFBQSx1QkFBa0MsT0FBTyxDQUFFLG1CQUFULEtBQXNCLGtCQUF4RDtBQUFBLFFBQUEsbUJBQUEsR0FBc0IsUUFBdEIsQ0FBQTtPQUZBO0FBQUEsTUFHQSxJQUFBLEdBQU8sa0JBQUEsQ0FBbUIsSUFBbkIsRUFBeUIsbUJBQXpCLENBSFAsQ0FBQTthQUlBLFFBQUEsQ0FBUyxJQUFULEVBQWUsSUFBZixFQUxnRDtJQUFBLENBQWxELEVBRGU7RUFBQSxDQXpCakIsQ0FBQTs7QUFBQSxFQWlDQSxNQUFBLEdBQVMsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixXQUFqQixFQUE4QixZQUE5QixFQUE0QyxRQUE1QyxHQUFBO0FBR1AsUUFBQSxnQkFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsNEJBQWIsRUFBMkMsRUFBM0MsQ0FBUCxDQUFBO0FBQUEsSUFFQSxnQkFBQSxHQUFtQixTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDakIsTUFBQSxJQUEwQixhQUExQjtBQUFBLGVBQU8sUUFBQSxDQUFTLEtBQVQsQ0FBUCxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxRQUFBLENBQVMsSUFBVCxDQURQLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxpQkFBQSxDQUFrQixJQUFsQixFQUF3QixRQUF4QixFQUFrQyxZQUFsQyxDQUZQLENBQUE7YUFHQSxRQUFBLENBQVMsSUFBVCxFQUFlLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBZixFQUppQjtJQUFBLENBRm5CLENBQUE7QUFRQSxJQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQUFIOztRQUNFLGVBQWdCLE9BQUEsQ0FBUSxpQkFBUjtPQUFoQjthQUNBLFlBQVksQ0FBQyxZQUFiLENBQTBCLElBQTFCLEVBQWdDLFFBQWhDLEVBQTBDLFdBQTFDLEVBQXVELGdCQUF2RCxFQUZGO0tBQUEsTUFBQTs7UUFLRSxhQUFjLE9BQUEsQ0FBUSxzQkFBUjtPQUFkO2FBRUEsZ0JBQUEsQ0FBaUIsSUFBakIsRUFBdUIsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsSUFBbEIsRUFBd0IsV0FBeEIsQ0FBdkIsRUFQRjtLQVhPO0VBQUEsQ0FqQ1QsQ0FBQTs7QUFBQSxFQXFEQSxRQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxRQUFBLDBDQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLENBQUosQ0FBQTtBQUFBLElBRUEsQ0FBQSxDQUFFLGdDQUFGLENBQW1DLENBQUMsTUFBcEMsQ0FBQSxDQUZBLENBQUE7QUFBQSxJQUdBLGtCQUFBLEdBQXFCLENBQ25CLFNBRG1CLEVBRW5CLFFBRm1CLEVBR25CLFVBSG1CLEVBSW5CLFNBSm1CLEVBS25CLFdBTG1CLEVBTW5CLFNBTm1CLEVBT25CLFNBUG1CLEVBUW5CLFdBUm1CLEVBU25CLFlBVG1CLEVBVW5CLFNBVm1CLEVBV25CLFFBWG1CLEVBWW5CLGFBWm1CLEVBYW5CLGFBYm1CLEVBY25CLGFBZG1CLEVBZW5CLFlBZm1CLEVBZ0JuQixXQWhCbUIsRUFpQm5CLFNBakJtQixFQWtCbkIsVUFsQm1CLEVBbUJuQixVQW5CbUIsRUFvQm5CLFVBcEJtQixFQXFCbkIsVUFyQm1CLEVBc0JuQixVQXRCbUIsQ0FIckIsQ0FBQTtBQTJCQSxTQUFBLHlEQUFBO3lDQUFBO0FBQUEsTUFBQSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsVUFBUCxDQUFrQixTQUFsQixDQUFBLENBQUE7QUFBQSxLQTNCQTtXQTRCQSxDQUFDLENBQUMsSUFBRixDQUFBLEVBN0JTO0VBQUEsQ0FyRFgsQ0FBQTs7QUFBQSxFQXFGQSxpQkFBQSxHQUFvQixTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLFlBQWpCLEdBQUE7QUFDbEIsUUFBQSw0REFBQTtBQUFBLElBQUEsSUFBRyxvQkFBSDtBQUNFLE1BQUMsZ0JBQWlCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixRQUE1QixJQUFsQixDQURGO0tBQUE7QUFBQSxJQUVBLENBQUEsR0FBSSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsQ0FGSixDQUFBO0FBR0E7QUFBQSxTQUFBLDJDQUFBOzRCQUFBO0FBQ0UsTUFBQSxHQUFBLEdBQU0sQ0FBQSxDQUFFLFVBQUYsQ0FBTixDQUFBO0FBQ0EsTUFBQSxJQUFHLEdBQUEsR0FBTSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsQ0FBVDtBQUNFLFFBQUEsSUFBRyxDQUFBLElBQVEsQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEIsQ0FBUDs7WUFDRSxhQUFjLE9BQUEsQ0FBUSxzQkFBUjtXQUFkO0FBQUEsVUFDQSxHQUFBLEdBQU0sVUFBVSxDQUFDLE1BQVgsQ0FBa0IsR0FBbEIsQ0FETixDQURGO1NBQUE7QUFJQSxRQUFBLElBQVksR0FBRyxDQUFDLEtBQUosQ0FBVSxxQkFBVixDQUFaO0FBQUEsbUJBQUE7U0FKQTtBQUtBLFFBQUEsSUFBWSxHQUFHLENBQUMsVUFBSixDQUFlLE9BQU8sQ0FBQyxhQUF2QixDQUFaO0FBQUEsbUJBQUE7U0FMQTtBQU1BLFFBQUEsSUFBWSxHQUFHLENBQUMsVUFBSixDQUFlLFlBQWYsQ0FBWjtBQUFBLG1CQUFBO1NBTkE7QUFPQSxRQUFBLElBQVksR0FBRyxDQUFDLFVBQUosQ0FBZSxXQUFmLENBQVo7QUFBQSxtQkFBQTtTQVBBO0FBU0EsUUFBQSxJQUFHLEdBQUksQ0FBQSxDQUFBLENBQUosS0FBVSxHQUFiO0FBQ0UsVUFBQSxJQUFBLENBQUEsRUFBUyxDQUFDLFVBQUgsQ0FBYyxHQUFkLENBQVA7QUFDRTtBQUNFLGNBQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxJQUFMLENBQVUsYUFBVixFQUF5QixHQUFHLENBQUMsU0FBSixDQUFjLENBQWQsQ0FBekIsQ0FBTixDQURGO2FBQUEsY0FBQTtBQUVNLGNBQUEsVUFBQSxDQUZOO2FBREY7V0FERjtTQUFBLE1BQUE7QUFNRSxVQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixDQUFiLEVBQXFDLEdBQXJDLENBQU4sQ0FORjtTQVRBO0FBa0JBLFFBQUEsSUFBRyxDQUFBLFlBQUg7QUFDRSxVQUFBLENBQUEsR0FBSSxZQUFZLENBQUMsVUFBYixDQUF3QixHQUF4QixFQUE2QixRQUE3QixDQUFKLENBQUE7QUFDQSxVQUFBLElBQXlCLENBQXpCO0FBQUEsWUFBQSxHQUFBLEdBQU0sRUFBQSxHQUFHLEdBQUgsR0FBTyxLQUFQLEdBQVksQ0FBbEIsQ0FBQTtXQUZGO1NBbEJBO0FBQUEsUUFzQkEsR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFULEVBQWdCLEdBQWhCLENBdEJBLENBREY7T0FGRjtBQUFBLEtBSEE7V0E4QkEsQ0FBQyxDQUFDLElBQUYsQ0FBQSxFQS9Ca0I7RUFBQSxDQXJGcEIsQ0FBQTs7QUFBQSxFQXNIQSxPQUFPLENBQUMsOEJBQVIsR0FBeUMsU0FBQyxXQUFELEVBQWMsZUFBZCxHQUFBO0FBQ3ZDLFFBQUEsZ0pBQUE7O01BRHFELGtCQUFnQjtLQUNyRTtBQUFBLElBQUEsSUFBRyxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixDQUFoQjtBQUNFO0FBQUEsV0FBQSwyQ0FBQTsrQkFBQTtBQUNFLFFBQUEsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFsQixHQUErQixVQUEvQixDQURGO0FBQUEsT0FERjtLQUFBO0FBSUE7QUFBQSxTQUFBLDhDQUFBOzZCQUFBO0FBQ0UsTUFBQSxTQUFBLDREQUEyQyxVQUEzQyxDQUFBO0FBQUEsTUFDQSxTQUFBLHdIQUFxRSxlQURyRSxDQUFBO0FBQUEsTUFHQSxhQUFBLEdBQWdCLFFBQVEsQ0FBQyxhQUFULENBQXVCLGtCQUF2QixDQUhoQixDQUFBO0FBQUEsTUFJQSxhQUFhLENBQUMsZ0JBQWQsQ0FBK0IsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsZUFBekIsQ0FBL0IsQ0FKQSxDQUFBO0FBQUEsTUFLQSxhQUFhLENBQUMsZUFBZCxDQUE4QixVQUE5QixDQUxBLENBQUE7QUFBQSxNQU9BLFVBQVUsQ0FBQyxVQUFVLENBQUMsWUFBdEIsQ0FBbUMsYUFBbkMsRUFBa0QsVUFBbEQsQ0FQQSxDQUFBO0FBQUEsTUFRQSxVQUFVLENBQUMsTUFBWCxDQUFBLENBUkEsQ0FBQTtBQUFBLE1BVUEsTUFBQSxHQUFTLGFBQWEsQ0FBQyxRQUFkLENBQUEsQ0FWVCxDQUFBO0FBQUEsTUFZQSxNQUFNLENBQUMsY0FBUCxDQUFzQjtBQUFBLFFBQUEsT0FBQSxFQUFPLGFBQVA7QUFBQSxRQUFzQixJQUFBLEVBQU0sTUFBNUI7T0FBdEIsQ0FBMEQsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUE3RCxDQUFBLENBWkEsQ0FBQTtBQUFBLE1BYUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxTQUFTLENBQUMsV0FBVyxDQUFDLElBQXRCLENBQUEsQ0FBZixDQWJBLENBQUE7QUFjQSxNQUFBLElBQUcsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MsaUJBQUEsQ0FBa0IsU0FBbEIsQ0FBbEMsQ0FBYjtBQUNFLFFBQUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBQSxDQURGO09BZkY7QUFBQSxLQUpBO1dBc0JBLFlBdkJ1QztFQUFBLENBdEh6QyxDQUFBOztBQUFBLEVBK0lBLGtCQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLGVBQVAsR0FBQTtBQUNuQixRQUFBLGdIQUFBOztNQUQwQixrQkFBZ0I7S0FDMUM7QUFBQSxJQUFBLENBQUEsR0FBSSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsQ0FBSixDQUFBO0FBRUEsSUFBQSxJQUFHLFVBQUEsR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBQWhCO0FBQ0UsTUFBQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsR0FBVixDQUFjLGFBQWQsRUFBNkIsVUFBN0IsQ0FBQSxDQURGO0tBRkE7QUFLQTtBQUFBLFNBQUEsMkNBQUE7NEJBQUE7QUFDRSxNQUFBLFNBQUEsR0FBWSxDQUFBLENBQUUsVUFBRixDQUFhLENBQUMsUUFBZCxDQUFBLENBQXdCLENBQUMsS0FBekIsQ0FBQSxDQUFaLENBQUE7QUFBQSxNQUNBLFNBQUEsZ0hBQTZELGVBRDdELENBQUE7O1FBR0EsY0FBbUIsSUFBQSxVQUFBLENBQVc7QUFBQSxVQUFBLFFBQUEsRUFBVSxJQUFJLENBQUMsUUFBZjtTQUFYO09BSG5CO0FBQUEsTUFJQSxlQUFBLEdBQWtCLFdBQVcsQ0FBQyxhQUFaLENBQ2hCO0FBQUEsUUFBQSxZQUFBLEVBQWMsU0FBUyxDQUFDLElBQVYsQ0FBQSxDQUFkO0FBQUEsUUFDQSxTQUFBLEVBQVcsaUJBQUEsQ0FBa0IsU0FBbEIsQ0FEWDtPQURnQixDQUpsQixDQUFBO0FBQUEsTUFRQSxnQkFBQSxHQUFtQixDQUFBLENBQUUsZUFBRixDQVJuQixDQUFBO0FBQUEsTUFVQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixRQUE3QixDQUFzQyxDQUFDLFFBQXZDLENBQWlELE9BQUEsR0FBTyxTQUF4RCxDQVZBLENBQUE7QUFBQSxNQVlBLENBQUEsQ0FBRSxVQUFGLENBQWEsQ0FBQyxXQUFkLENBQTBCLGdCQUExQixDQVpBLENBREY7QUFBQSxLQUxBO1dBb0JBLENBQUMsQ0FBQyxJQUFGLENBQUEsRUFyQm1CO0VBQUEsQ0EvSXJCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/lib/renderer.coffee
