(function() {
  var getOptions, init, lazyHeaders, markdownIt, markdownItOptions, math, mathBlock, mathBrackets, mathDollars, mathInline, needsInit, renderLaTeX;

  markdownIt = null;

  markdownItOptions = null;

  renderLaTeX = null;

  math = null;

  lazyHeaders = null;

  mathInline = function(string) {
    return "<span class='math'><script type='math/tex'>" + string + "</script></span>";
  };

  mathBlock = function(string) {
    return "<span class='math'><script type='math/tex; mode=display'>" + string + "</script></span>";
  };

  mathDollars = {
    inlineOpen: '$',
    inlineClose: '$',
    blockOpen: '$$',
    blockClose: '$$',
    inlineRenderer: mathInline,
    blockRenderer: mathBlock
  };

  mathBrackets = {
    inlineOpen: '\\(',
    inlineClose: '\\)',
    blockOpen: '\\[',
    blockClose: '\\]',
    inlineRenderer: mathInline,
    blockRenderer: mathBlock
  };

  getOptions = function() {
    return {
      html: true,
      xhtmlOut: false,
      breaks: atom.config.get('markdown-preview-plus.breakOnSingleNewline'),
      langPrefix: 'lang-',
      linkify: true,
      typographer: true
    };
  };

  init = function(rL) {
    renderLaTeX = rL;
    markdownItOptions = getOptions();
    markdownIt = require('markdown-it')(markdownItOptions);
    if (renderLaTeX) {
      if (math == null) {
        math = require('markdown-it-math');
      }
      markdownIt.use(math, mathDollars);
      markdownIt.use(math, mathBrackets);
    }
    lazyHeaders = atom.config.get('markdown-preview-plus.useLazyHeaders');
    if (lazyHeaders) {
      return markdownIt.use(require('markdown-it-lazy-headers'));
    }
  };

  needsInit = function(rL) {
    return (markdownIt == null) || markdownItOptions.breaks !== atom.config.get('markdown-preview-plus.breakOnSingleNewline') || lazyHeaders !== atom.config.get('markdown-preview-plus.useLazyHeaders') || rL !== renderLaTeX;
  };

  exports.render = function(text, rL) {
    if (needsInit(rL)) {
      init(rL);
    }
    return markdownIt.render(text);
  };

  exports.decode = function(url) {
    return markdownIt.normalizeLinkText(url);
  };

  exports.getTokens = function(text, rL) {
    if (needsInit(rL)) {
      init(rL);
    }
    return markdownIt.parse(text, {});
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvbGliL21hcmtkb3duLWl0LWhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNElBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsSUFBYixDQUFBOztBQUFBLEVBQ0EsaUJBQUEsR0FBb0IsSUFEcEIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxJQUZkLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sSUFIUCxDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLElBSmQsQ0FBQTs7QUFBQSxFQU1BLFVBQUEsR0FBYSxTQUFDLE1BQUQsR0FBQTtXQUFhLDZDQUFBLEdBQTZDLE1BQTdDLEdBQW9ELG1CQUFqRTtFQUFBLENBTmIsQ0FBQTs7QUFBQSxFQU9BLFNBQUEsR0FBWSxTQUFDLE1BQUQsR0FBQTtXQUFhLDJEQUFBLEdBQTJELE1BQTNELEdBQWtFLG1CQUEvRTtFQUFBLENBUFosQ0FBQTs7QUFBQSxFQVNBLFdBQUEsR0FDRTtBQUFBLElBQUEsVUFBQSxFQUFZLEdBQVo7QUFBQSxJQUNBLFdBQUEsRUFBYSxHQURiO0FBQUEsSUFFQSxTQUFBLEVBQVcsSUFGWDtBQUFBLElBR0EsVUFBQSxFQUFZLElBSFo7QUFBQSxJQUlBLGNBQUEsRUFBZ0IsVUFKaEI7QUFBQSxJQUtBLGFBQUEsRUFBZSxTQUxmO0dBVkYsQ0FBQTs7QUFBQSxFQWlCQSxZQUFBLEdBQ0U7QUFBQSxJQUFBLFVBQUEsRUFBWSxLQUFaO0FBQUEsSUFDQSxXQUFBLEVBQWEsS0FEYjtBQUFBLElBRUEsU0FBQSxFQUFXLEtBRlg7QUFBQSxJQUdBLFVBQUEsRUFBWSxLQUhaO0FBQUEsSUFJQSxjQUFBLEVBQWdCLFVBSmhCO0FBQUEsSUFLQSxhQUFBLEVBQWUsU0FMZjtHQWxCRixDQUFBOztBQUFBLEVBeUJBLFVBQUEsR0FBYSxTQUFBLEdBQUE7V0FDWDtBQUFBLE1BQUEsSUFBQSxFQUFNLElBQU47QUFBQSxNQUNBLFFBQUEsRUFBVSxLQURWO0FBQUEsTUFFQSxNQUFBLEVBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRDQUFoQixDQUZSO0FBQUEsTUFHQSxVQUFBLEVBQVksT0FIWjtBQUFBLE1BSUEsT0FBQSxFQUFTLElBSlQ7QUFBQSxNQUtBLFdBQUEsRUFBYSxJQUxiO01BRFc7RUFBQSxDQXpCYixDQUFBOztBQUFBLEVBa0NBLElBQUEsR0FBTyxTQUFDLEVBQUQsR0FBQTtBQUVMLElBQUEsV0FBQSxHQUFjLEVBQWQsQ0FBQTtBQUFBLElBRUEsaUJBQUEsR0FBb0IsVUFBQSxDQUFBLENBRnBCLENBQUE7QUFBQSxJQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUixDQUFBLENBQXVCLGlCQUF2QixDQUpiLENBQUE7QUFNQSxJQUFBLElBQUcsV0FBSDs7UUFDRSxPQUFRLE9BQUEsQ0FBUSxrQkFBUjtPQUFSO0FBQUEsTUFDQSxVQUFVLENBQUMsR0FBWCxDQUFlLElBQWYsRUFBcUIsV0FBckIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxVQUFVLENBQUMsR0FBWCxDQUFlLElBQWYsRUFBcUIsWUFBckIsQ0FGQSxDQURGO0tBTkE7QUFBQSxJQVdBLFdBQUEsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBWGQsQ0FBQTtBQWFBLElBQUEsSUFBRyxXQUFIO2FBQ0UsVUFBVSxDQUFDLEdBQVgsQ0FBZSxPQUFBLENBQVEsMEJBQVIsQ0FBZixFQURGO0tBZks7RUFBQSxDQWxDUCxDQUFBOztBQUFBLEVBcURBLFNBQUEsR0FBWSxTQUFDLEVBQUQsR0FBQTtXQUNOLG9CQUFKLElBQ0EsaUJBQWlCLENBQUMsTUFBbEIsS0FBOEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRDQUFoQixDQUQ5QixJQUVBLFdBQUEsS0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUZqQixJQUdBLEVBQUEsS0FBUSxZQUpFO0VBQUEsQ0FyRFosQ0FBQTs7QUFBQSxFQTJEQSxPQUFPLENBQUMsTUFBUixHQUFpQixTQUFDLElBQUQsRUFBTyxFQUFQLEdBQUE7QUFDZixJQUFBLElBQVksU0FBQSxDQUFVLEVBQVYsQ0FBWjtBQUFBLE1BQUEsSUFBQSxDQUFLLEVBQUwsQ0FBQSxDQUFBO0tBQUE7V0FDQSxVQUFVLENBQUMsTUFBWCxDQUFrQixJQUFsQixFQUZlO0VBQUEsQ0EzRGpCLENBQUE7O0FBQUEsRUErREEsT0FBTyxDQUFDLE1BQVIsR0FBaUIsU0FBQyxHQUFELEdBQUE7V0FDZixVQUFVLENBQUMsaUJBQVgsQ0FBNkIsR0FBN0IsRUFEZTtFQUFBLENBL0RqQixDQUFBOztBQUFBLEVBa0VBLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLFNBQUMsSUFBRCxFQUFPLEVBQVAsR0FBQTtBQUNsQixJQUFBLElBQVksU0FBQSxDQUFVLEVBQVYsQ0FBWjtBQUFBLE1BQUEsSUFBQSxDQUFLLEVBQUwsQ0FBQSxDQUFBO0tBQUE7V0FDQSxVQUFVLENBQUMsS0FBWCxDQUFpQixJQUFqQixFQUF1QixFQUF2QixFQUZrQjtFQUFBLENBbEVwQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/lib/markdown-it-helper.coffee
