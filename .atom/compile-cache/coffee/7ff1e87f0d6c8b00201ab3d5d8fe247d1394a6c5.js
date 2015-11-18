(function() {
  var GotoView, SymbolIndex;

  SymbolIndex = require('./symbol-index');

  GotoView = require('./goto-view');

  module.exports = {
    configDefaults: {
      logToConsole: false,
      moreIgnoredNames: '',
      autoScroll: true
    },
    index: null,
    gotoView: null,
    activate: function(state) {
      this.index = new SymbolIndex(state != null ? state.entries : void 0);
      this.gotoView = new GotoView();
      return atom.commands.add('atom-workspace', {
        'mobile-preview:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'goto:project-symbol': (function(_this) {
          return function() {
            return _this.gotoProjectSymbol();
          };
        })(this),
        'goto:file-symbol': (function(_this) {
          return function() {
            return _this.gotoFileSymbol();
          };
        })(this),
        'goto:declaration': (function(_this) {
          return function() {
            return _this.gotoDeclaration();
          };
        })(this),
        'goto:rebuild-index': (function(_this) {
          return function() {
            return _this.index.rebuild();
          };
        })(this),
        'goto:invalidate-index': (function(_this) {
          return function() {
            return _this.index.invalidate();
          };
        })(this)
      });
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.index) != null) {
        _ref.destroy();
      }
      this.index = null;
      if ((_ref1 = this.gotoView) != null) {
        _ref1.destroy();
      }
      return this.gotoView = null;
    },
    serialize: function() {
      return {
        entries: this.index.entries
      };
    },
    gotoDeclaration: function() {
      var symbols;
      symbols = this.index.gotoDeclaration();
      if (symbols && symbols.length) {
        return this.gotoView.populate(symbols);
      }
    },
    gotoProjectSymbol: function() {
      var symbols;
      symbols = this.index.getAllSymbols();
      return this.gotoView.populate(symbols);
    },
    gotoFileSymbol: function() {
      var editor, filePath, symbols;
      editor = atom.workspace.getActiveTextEditor();
      filePath = editor != null ? editor.getPath() : void 0;
      if (filePath) {
        symbols = this.index.getEditorSymbols(editor);
        return this.gotoView.populate(symbols, editor);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9nb3RvL2xpYi9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEscUJBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFBYyxLQUFkO0FBQUEsTUFDQSxnQkFBQSxFQUFrQixFQURsQjtBQUFBLE1BRUEsVUFBQSxFQUFZLElBRlo7S0FERjtBQUFBLElBS0EsS0FBQSxFQUFPLElBTFA7QUFBQSxJQU1BLFFBQUEsRUFBVSxJQU5WO0FBQUEsSUFRQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxXQUFBLGlCQUFZLEtBQUssQ0FBRSxnQkFBbkIsQ0FBYixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLFFBQUEsQ0FBQSxDQURoQixDQUFBO2FBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQ2xDLHVCQUFBLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFM7QUFBQSxRQUVsQyxxQkFBQSxFQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUFIO1VBQUEs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

//# sourceURL=/Users/kswedberg/.atom/packages/goto/lib/index.coffee
