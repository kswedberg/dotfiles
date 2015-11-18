(function() {
  var MarkdownPreviewView, createMarkdownPreviewView, isMarkdownPreviewView, mathjaxHelper, renderer, url,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  url = require('url');

  MarkdownPreviewView = null;

  renderer = null;

  mathjaxHelper = null;

  createMarkdownPreviewView = function(state) {
    if (MarkdownPreviewView == null) {
      MarkdownPreviewView = require('./markdown-preview-view');
    }
    return new MarkdownPreviewView(state);
  };

  isMarkdownPreviewView = function(object) {
    if (MarkdownPreviewView == null) {
      MarkdownPreviewView = require('./markdown-preview-view');
    }
    return object instanceof MarkdownPreviewView;
  };

  atom.deserializers.add({
    name: 'MarkdownPreviewView',
    deserialize: function(state) {
      if (state.constructor === Object) {
        return createMarkdownPreviewView(state);
      }
    }
  });

  module.exports = {
    config: {
      breakOnSingleNewline: {
        type: 'boolean',
        "default": false,
        order: 0
      },
      liveUpdate: {
        type: 'boolean',
        "default": true,
        order: 10
      },
      openPreviewInSplitPane: {
        type: 'boolean',
        "default": true,
        order: 20
      },
      grammars: {
        type: 'array',
        "default": ['source.gfm', 'source.litcoffee', 'text.html.basic', 'text.plain', 'text.plain.null-grammar'],
        order: 30
      },
      enableLatexRenderingByDefault: {
        title: 'Enable Math Rendering By Default',
        type: 'boolean',
        "default": false,
        order: 40
      },
      useLazyHeaders: {
        title: 'Use Lazy Headers',
        description: 'Require no space after headings #',
        type: 'boolean',
        "default": true,
        order: 45
      },
      useGitHubStyle: {
        title: 'Use GitHub.com style',
        type: 'boolean',
        "default": false,
        order: 50
      },
      enablePandoc: {
        type: 'boolean',
        "default": false,
        title: 'Enable Pandoc Parser',
        order: 100
      },
      pandocPath: {
        type: 'string',
        "default": 'pandoc',
        title: 'Pandoc Options: Path',
        description: 'Please specify the correct path to your pandoc executable',
        dependencies: ['enablePandoc'],
        order: 110
      },
      pandocArguments: {
        type: 'array',
        "default": [],
        title: 'Pandoc Options: Commandline Arguments',
        description: 'Comma separated pandoc arguments e.g. `--smart, --filter=/bin/exe`. Please use long argument names.',
        dependencies: ['enablePandoc'],
        order: 120
      },
      pandocMarkdownFlavor: {
        type: 'string',
        "default": 'markdown-raw_tex+tex_math_single_backslash',
        title: 'Pandoc Options: Markdown Flavor',
        description: 'Enter the pandoc markdown flavor you want',
        dependencies: ['enablePandoc'],
        order: 130
      },
      pandocBibliography: {
        type: 'boolean',
        "default": false,
        title: 'Pandoc Options: Citations',
        description: 'Enable this for bibliography parsing',
        dependencies: ['enablePandoc'],
        order: 140
      },
      pandocRemoveReferences: {
        type: 'boolean',
        "default": true,
        title: 'Pandoc Options: Remove References',
        description: 'Removes references at the end of the HTML preview',
        dependencies: ['pandocBibliography'],
        order: 150
      },
      pandocBIBFile: {
        type: 'string',
        "default": 'bibliography.bib',
        title: 'Pandoc Options: Bibliography (bibfile)',
        description: 'Name of bibfile to search for recursivly',
        dependencies: ['pandocBibliography'],
        order: 160
      },
      pandocBIBFileFallback: {
        type: 'string',
        "default": '',
        title: 'Pandoc Options: Fallback Bibliography (bibfile)',
        description: 'Full path to fallback bibfile',
        dependencies: ['pandocBibliography'],
        order: 165
      },
      pandocCSLFile: {
        type: 'string',
        "default": 'custom.csl',
        title: 'Pandoc Options: Bibliography Style (cslfile)',
        description: 'Name of cslfile to search for recursivly',
        dependencies: ['pandocBibliography'],
        order: 170
      },
      pandocCSLFileFallback: {
        type: 'string',
        "default": '',
        title: 'Pandoc Options: Fallback Bibliography Style (cslfile)',
        description: 'Full path to fallback cslfile',
        dependencies: ['pandocBibliography'],
        order: 175
      }
    },
    activate: function() {
      var previewFile;
      atom.commands.add('atom-workspace', {
        'markdown-preview-plus:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'markdown-preview-plus:copy-html': (function(_this) {
          return function() {
            return _this.copyHtml();
          };
        })(this),
        'markdown-preview-plus:toggle-break-on-single-newline': function() {
          var keyPath;
          keyPath = 'markdown-preview-plus.breakOnSingleNewline';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        }
      });
      previewFile = this.previewFile.bind(this);
      atom.commands.add('.tree-view .file .name[data-name$=\\.markdown]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.md]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mdown]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mkd]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mkdown]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.ron]', 'markdown-preview-plus:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.txt]', 'markdown-preview-plus:preview-file', previewFile);
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, pathname, protocol, _ref;
        try {
          _ref = url.parse(uriToOpen), protocol = _ref.protocol, host = _ref.host, pathname = _ref.pathname;
        } catch (_error) {
          error = _error;
          return;
        }
        if (protocol !== 'markdown-preview-plus:') {
          return;
        }
        try {
          if (pathname) {
            pathname = decodeURI(pathname);
          }
        } catch (_error) {
          error = _error;
          return;
        }
        if (host === 'editor') {
          return createMarkdownPreviewView({
            editorId: pathname.substring(1)
          });
        } else {
          return createMarkdownPreviewView({
            filePath: pathname
          });
        }
      });
    },
    toggle: function() {
      var editor, grammars, _ref, _ref1;
      if (isMarkdownPreviewView(atom.workspace.getActivePaneItem())) {
        atom.workspace.destroyActivePaneItem();
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      grammars = (_ref = atom.config.get('markdown-preview-plus.grammars')) != null ? _ref : [];
      if (_ref1 = editor.getGrammar().scopeName, __indexOf.call(grammars, _ref1) < 0) {
        return;
      }
      if (!this.removePreviewForEditor(editor)) {
        return this.addPreviewForEditor(editor);
      }
    },
    uriForEditor: function(editor) {
      return "markdown-preview-plus://editor/" + editor.id;
    },
    removePreviewForEditor: function(editor) {
      var preview, previewPane, uri;
      uri = this.uriForEditor(editor);
      previewPane = atom.workspace.paneForURI(uri);
      if (previewPane != null) {
        preview = previewPane.itemForURI(uri);
        if (preview !== previewPane.getActiveItem()) {
          previewPane.activateItem(preview);
          return false;
        }
        previewPane.destroyItem(preview);
        return true;
      } else {
        return false;
      }
    },
    addPreviewForEditor: function(editor) {
      var options, previousActivePane, uri;
      uri = this.uriForEditor(editor);
      previousActivePane = atom.workspace.getActivePane();
      options = {
        searchAllPanes: true
      };
      if (atom.config.get('markdown-preview-plus.openPreviewInSplitPane')) {
        options.split = 'right';
      }
      return atom.workspace.open(uri, options).done(function(markdownPreviewView) {
        if (isMarkdownPreviewView(markdownPreviewView)) {
          return previousActivePane.activate();
        }
      });
    },
    previewFile: function(_arg) {
      var editor, filePath, target, _i, _len, _ref;
      target = _arg.target;
      filePath = target.dataset.path;
      if (!filePath) {
        return;
      }
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        if (!(editor.getPath() === filePath)) {
          continue;
        }
        this.addPreviewForEditor(editor);
        return;
      }
      return atom.workspace.open("markdown-preview-plus://" + (encodeURI(filePath)), {
        searchAllPanes: true
      });
    },
    copyHtml: function(callback, scaleMath) {
      var editor, renderLaTeX, text;
      if (callback == null) {
        callback = atom.clipboard.write.bind(atom.clipboard);
      }
      if (scaleMath == null) {
        scaleMath = 100;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      if (renderer == null) {
        renderer = require('./renderer');
      }
      text = editor.getSelectedText() || editor.getText();
      renderLaTeX = atom.config.get('markdown-preview-plus.enableLatexRenderingByDefault');
      return renderer.toHTML(text, editor.getPath(), editor.getGrammar(), renderLaTeX, true, function(error, html) {
        if (error) {
          return console.warn('Copying Markdown as HTML failed', error);
        } else if (renderLaTeX) {
          if (mathjaxHelper == null) {
            mathjaxHelper = require('./mathjax-helper');
          }
          return mathjaxHelper.processHTMLString(html, function(proHTML) {
            proHTML = proHTML.replace(/MathJax\_SVG.*?font\-size\: 100%/g, function(match) {
              return match.replace(/font\-size\: 100%/, "font-size: " + scaleMath + "%");
            });
            return callback(proHTML);
          });
        } else {
          return callback(html);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1HQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FBTixDQUFBOztBQUFBLEVBRUEsbUJBQUEsR0FBc0IsSUFGdEIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxJQUhYLENBQUE7O0FBQUEsRUFJQSxhQUFBLEdBQWdCLElBSmhCLENBQUE7O0FBQUEsRUFNQSx5QkFBQSxHQUE0QixTQUFDLEtBQUQsR0FBQTs7TUFDMUIsc0JBQXVCLE9BQUEsQ0FBUSx5QkFBUjtLQUF2QjtXQUNJLElBQUEsbUJBQUEsQ0FBb0IsS0FBcEIsRUFGc0I7RUFBQSxDQU41QixDQUFBOztBQUFBLEVBVUEscUJBQUEsR0FBd0IsU0FBQyxNQUFELEdBQUE7O01BQ3RCLHNCQUF1QixPQUFBLENBQVEseUJBQVI7S0FBdkI7V0FDQSxNQUFBLFlBQWtCLG9CQUZJO0VBQUEsQ0FWeEIsQ0FBQTs7QUFBQSxFQWNBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLHFCQUFOO0FBQUEsSUFDQSxXQUFBLEVBQWEsU0FBQyxLQUFELEdBQUE7QUFDWCxNQUFBLElBQW9DLEtBQUssQ0FBQyxXQUFOLEtBQXFCLE1BQXpEO2VBQUEseUJBQUEsQ0FBMEIsS0FBMUIsRUFBQTtPQURXO0lBQUEsQ0FEYjtHQURGLENBZEEsQ0FBQTs7QUFBQSxFQW1CQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFD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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/lib/main.coffee
