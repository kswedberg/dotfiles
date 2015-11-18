(function() {
  "use strict";
  var MathJaxHelper, UpdatePreview, WrappedDomTree, prepareCodeBlocksForAtomEditors, renderer;

  WrappedDomTree = require('./wrapped-dom-tree');

  MathJaxHelper = require('./mathjax-helper');

  renderer = require('./renderer');

  module.exports = UpdatePreview = (function() {
    function UpdatePreview(dom) {
      this.tree = new WrappedDomTree(dom, true);
      this.domFragment = document.createDocumentFragment();
    }

    UpdatePreview.prototype.update = function(domFragment, renderLaTeX) {
      var elm, firstTime, newDom, newTree, r, _i, _len, _ref;
      prepareCodeBlocksForAtomEditors(domFragment);
      if (domFragment.isEqualNode(this.domFragment)) {
        return;
      }
      firstTime = this.domFragment.childElementCount === 0;
      this.domFragment = domFragment.cloneNode(true);
      newDom = document.createElement("div");
      newDom.className = "update-preview";
      newDom.appendChild(domFragment);
      newTree = new WrappedDomTree(newDom);
      r = this.tree.diffTo(newTree);
      newTree.removeSelf();
      if (firstTime) {
        r.possibleReplace = null;
        r.last = null;
      }
      if (renderLaTeX) {
        r.inserted = r.inserted.map(function(elm) {
          while (elm && !elm.innerHTML) {
            elm = elm.parentElement;
          }
          return elm;
        });
        r.inserted = r.inserted.filter(function(elm) {
          return !!elm;
        });
        MathJaxHelper.mathProcessor(r.inserted);
      }
      _ref = r.inserted;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elm = _ref[_i];
        if (elm instanceof Element) {
          renderer.convertCodeBlocksToAtomEditors(elm);
        }
      }
      this.updateOrderedListsStart();
      return r;
    };

    UpdatePreview.prototype.updateOrderedListsStart = function() {
      var i, parsedOLs, parsedStart, previewOLs, previewStart, _i, _ref;
      previewOLs = this.tree.shownTree.dom.querySelectorAll('ol');
      parsedOLs = this.domFragment.querySelectorAll('ol');
      for (i = _i = 0, _ref = parsedOLs.length - 1; _i <= _ref; i = _i += 1) {
        previewStart = previewOLs[i].getAttribute('start');
        parsedStart = parsedOLs[i].getAttribute('start');
        if (previewStart === parsedStart) {
          continue;
        } else if (parsedStart != null) {
          previewOLs[i].setAttribute('start', parsedStart);
        } else {
          previewOLs[i].removeAttribute('start');
        }
      }
    };

    return UpdatePreview;

  })();

  prepareCodeBlocksForAtomEditors = function(domFragment) {
    var preElement, preWrapper, _i, _len, _ref;
    _ref = domFragment.querySelectorAll('pre');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      preElement = _ref[_i];
      preWrapper = document.createElement('span');
      preWrapper.className = 'atom-text-editor';
      preElement.parentNode.insertBefore(preWrapper, preElement);
      preWrapper.appendChild(preElement);
    }
    return domFragment;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvbGliL3VwZGF0ZS1wcmV2aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQXNCQTtBQUFBLEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSx1RkFBQTs7QUFBQSxFQUVBLGNBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQSxhQUFBLEdBQWtCLE9BQUEsQ0FBUSxrQkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFrQixPQUFBLENBQVEsWUFBUixDQUpsQixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFHUixJQUFBLHVCQUFDLEdBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBb0IsSUFBQSxjQUFBLENBQWUsR0FBZixFQUFvQixJQUFwQixDQUFwQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBRCxHQUFnQixRQUFRLENBQUMsc0JBQVQsQ0FBQSxDQURoQixDQURXO0lBQUEsQ0FBYjs7QUFBQSw0QkFJQSxNQUFBLEdBQVEsU0FBQyxXQUFELEVBQWMsV0FBZCxHQUFBO0FBQ04sVUFBQSxrREFBQTtBQUFBLE1BQUEsK0JBQUEsQ0FBZ0MsV0FBaEMsQ0FBQSxDQUFBO0FBRUEsTUFBQSxJQUFHLFdBQVcsQ0FBQyxXQUFaLENBQXdCLElBQUMsQ0FBQSxXQUF6QixDQUFIO0FBQ0UsY0FBQSxDQURGO09BRkE7QUFBQSxNQUtBLFNBQUEsR0FBZ0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxpQkFBYixLQUFrQyxDQUxsRCxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsV0FBRCxHQUFnQixXQUFXLENBQUMsU0FBWixDQUFzQixJQUF0QixDQU5oQixDQUFBO0FBQUEsTUFR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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/lib/update-preview.coffee
