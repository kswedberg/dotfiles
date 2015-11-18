(function() {
  var CONFIG_KEY, ScopeNameProvider, basename,
    __slice = [].slice;

  basename = require('path').basename;

  ScopeNameProvider = require('./scope-name-provider');

  CONFIG_KEY = 'file-types';

  module.exports = {
    config: {
      $debug: {
        type: 'boolean',
        "default": false
      },
      $caseSensitive: {
        type: 'boolean',
        "default": false
      }
    },
    debug: false,
    snp: new ScopeNameProvider(),
    _off: [],
    activate: function(state) {
      var updateEditorGrammars;
      this._off.push(atom.config.observe(CONFIG_KEY, (function(_this) {
        return function(newValue) {
          var editor, _i, _len, _ref, _results;
          _this.loadConfig(newValue);
          _ref = atom.workspace.getTextEditors();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            editor = _ref[_i];
            _results.push(_this._tryToSetGrammar(editor));
          }
          return _results;
        };
      })(this)));
      this._off.push(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this._off.push(editor.onDidChangePath(function() {
            return _this._tryToSetGrammar(editor);
          }));
          return _this._tryToSetGrammar(editor);
        };
      })(this)));
      updateEditorGrammars = (function(_this) {
        return function(g) {
          var editor, scopeName, _i, _len, _ref, _results;
          _ref = _this.snp.getScopeNames();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            scopeName = _ref[_i];
            if (g.scopeName === scopeName) {
              _results.push((function() {
                var _j, _len1, _ref1, _results1;
                _ref1 = atom.workspace.getTextEditors();
                _results1 = [];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  editor = _ref1[_j];
                  _results1.push(this._tryToSetGrammar(editor));
                }
                return _results1;
              }).call(_this));
            }
          }
          return _results;
        };
      })(this);
      this._off.push(atom.grammars.onDidAddGrammar(updateEditorGrammars));
      return this._off.push(atom.grammars.onDidUpdateGrammar(updateEditorGrammars));
    },
    deactivate: function() {
      var o, _i, _len, _ref, _results;
      _ref = this._off;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o = _ref[_i];
        _results.push(typeof o === "function" ? o() : void 0);
      }
      return _results;
    },
    serialize: function() {},
    loadConfig: function(config) {
      var fileType, scopeName;
      if (config == null) {
        config = {};
      }
      this.debug = config.$debug === true;
      this.caseSensitive = config.$caseSensitive === true;
      this.snp = new ScopeNameProvider();
      for (fileType in config) {
        scopeName = config[fileType];
        if (/^\$/.test(fileType)) {
          continue;
        }
        if (/(^\^)|(\.)|(\$$)/.test(fileType)) {
          this.snp.registerMatcher(fileType, scopeName);
        } else {
          this.snp.registerExtension(fileType, scopeName);
        }
      }
      return this._log(this.snp);
    },
    _tryToSetGrammar: function(editor) {
      var filename, g, scopeName;
      filename = basename(editor.getPath());
      scopeName = this.snp.getScopeName(filename, {
        caseSensitive: this.caseSensitive
      });
      if (scopeName == null) {
        this._log("no custom scopeName for " + filename + "...skipping");
        return;
      }
      g = atom.grammars.grammarForScopeName(scopeName);
      if (g == null) {
        this._log("no grammar for " + scopeName + "!?");
        return;
      }
      this._log("setting " + scopeName + " as grammar for " + filename);
      return editor.setGrammar(g);
    },
    _log: function() {
      var argv;
      argv = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (!this.debug) {
        return;
      }
      argv.unshift('[file-types]');
      return console.debug.apply(console, argv);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9maWxlLXR5cGVzL2xpYi9maWxlLXR5cGVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1Q0FBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUMsV0FBWSxPQUFBLENBQVEsTUFBUixFQUFaLFFBQUQsQ0FBQTs7QUFBQSxFQUVBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUixDQUZwQixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLFlBSmIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FERjtBQUFBLE1BR0EsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FKRjtLQURGO0FBQUEsSUFRQSxLQUFBLEVBQU8sS0FSUDtBQUFBLElBVUEsR0FBQSxFQUFTLElBQUEsaUJBQUEsQ0FBQSxDQVZUO0FBQUEsSUFZQSxJQUFBLEVBQU0sRUFaTjtBQUFBLElBY0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxvQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLFVBQXBCLEVBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFFBQUQsR0FBQTtBQUN6QyxjQUFBLGdDQUFBO0FBQUEsVUFBQSxLQUFDLENBQUEsVUFBRCxDQUFZLFFBQVosQ0FBQSxDQUFBO0FBQ0E7QUFBQTtlQUFBLDJDQUFBOzhCQUFBO0FBQ0UsMEJB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

//# sourceURL=/Users/kswedberg/.atom/packages/file-types/lib/file-types.coffee
