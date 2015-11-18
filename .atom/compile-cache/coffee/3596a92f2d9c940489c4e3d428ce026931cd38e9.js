(function() {
  var Disposable, PluginManager;

  Disposable = require('atom').Disposable;


  /*
  Provider sample:
    id: 'coffee-compile'
    selector: ['source.coffee']
    preCompile: (code) ->
    compile: (code) ->
    postCompile: (code) ->
   */

  PluginManager = (function() {
    function PluginManager() {
      this.plugins = [];
      this.languages = {};
    }

    PluginManager.prototype.register = function(plugin) {
      var language, selector, _base, _i, _len, _ref;
      if (this.isPluginRegistered(plugin)) {
        console.warn("" + plugin.id + " has already been activated");
        return;
      }
      _ref = plugin.selector;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector = _ref[_i];
        if ((_base = this.languages)[selector] == null) {
          _base[selector] = {
            preCompilers: [],
            compilers: [],
            postCompilers: [],
            compiledScope: plugin.compiledScope
          };
        }
        language = this.languages[selector];
        if ((plugin.preCompile != null) && typeof plugin.preCompile === "function") {
          language.preCompilers.push(plugin.preCompile);
        }
        if ((plugin.compile != null) && typeof plugin.compile === "function") {
          language.compilers.push(plugin.compile);
        }
        if (plugin.postCompile && typeof plugin.postCompile === "function") {
          language.postCompilers.push(plugin.postCompile);
        }
      }
      this.plugins.push(plugin);
      return new Disposable((function(_this) {
        return function() {
          return _this.unregister(plugin);
        };
      })(this));
    };

    PluginManager.prototype.unregister = function(plugin) {
      var compilerIndex, index, language, postCompilerIndex, preCompilerIndex, selector, _i, _len, _ref;
      index = this.plugins.indexOf(plugin);
      if (index > -1) {
        _ref = plugin.selector;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          selector = _ref[_i];
          language = this.languages[selector];
          if ((plugin.preCompile != null) && typeof plugin.preCompile === "function") {
            preCompilerIndex = language.preCompilers.indexOf(plugin.preCompile);
            language.preCompilers.splice(preCompilerIndex, 1);
          }
          if ((plugin.compile != null) && typeof plugin.compile === "function") {
            compilerIndex = language.compilers.indexOf(plugin.compile);
            language.compilers.splice(compilerIndex, 1);
          }
          if ((plugin.postCompile != null) && typeof plugin.postCompile === "function") {
            postCompilerIndex = language.postCompilers.indexOf(plugin.postCompile);
            language.postCompilers.splice(postCompilerIndex, 1);
          }
        }
        return this.plugins.splice(index, 1);
      }
    };


    /*
    @param {String} scope Language scope
    @returns {Object} Language configuration
     */

    PluginManager.prototype.getLanguageByScope = function(scope) {
      return this.languages[scope];
    };


    /*
    @param {String} scope Language scope
    @returns {Boolean}
     */

    PluginManager.prototype.isScopeSupported = function(scope) {
      return this.languages[scope] != null;
    };


    /*
    @param {String} scope Language scope
    @returns {Boolean}
     */

    PluginManager.prototype.isPlainText = function(scope) {
      return scope.indexOf('text.plain') > -1 || scope.indexOf('null-grammar') > -1;
    };


    /*
    @param {Editor} editor
    @param {Boolean} isSaveCompile
    @returns {Boolean}
     */

    PluginManager.prototype.isEditorLanguageSupported = function(editor, isSaveCompile) {
      var scopeName, shouldSaveCompile;
      if (isSaveCompile == null) {
        isSaveCompile = false;
      }
      scopeName = editor.getGrammar().scopeName;
      shouldSaveCompile = !isSaveCompile || (isSaveCompile && !this.isPlainText(scopeName));
      return this.isScopeSupported(scopeName) && shouldSaveCompile;
    };


    /*
    @param {Editor} editor
    @returns {String}
     */

    PluginManager.prototype.getCompiledScopeByEditor = function(editor) {
      var _ref;
      return ((_ref = this.languages[editor.getGrammar().scopeName]) != null ? _ref.compiledScope : void 0) || '';
    };


    /*
    @param {Object} plugin
    @return {Boolean}
     */

    PluginManager.prototype.isPluginRegistered = function(plugin) {
      return this.plugins.indexOf(plugin) !== -1;
    };

    return PluginManager;

  })();

  module.exports = new PluginManager();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9saWIvcGx1Z2luLW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFFQTtBQUFBOzs7Ozs7O0tBRkE7O0FBQUEsRUFXTTtBQUNTLElBQUEsdUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBYSxFQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFEYixDQURXO0lBQUEsQ0FBYjs7QUFBQSw0QkFJQSxRQUFBLEdBQVUsU0FBQyxNQUFELEdBQUE7QUFDUixVQUFBLHlDQUFBO0FBQUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixNQUFwQixDQUFIO0FBQ0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLEVBQUEsR0FBRyxNQUFNLENBQUMsRUFBVixHQUFhLDZCQUExQixDQUFBLENBQUE7QUFDQSxjQUFBLENBRkY7T0FBQTtBQUlBO0FBQUEsV0FBQSwyQ0FBQTs0QkFBQTs7ZUFDYSxDQUFBLFFBQUEsSUFDVDtBQUFBLFlBQUEsWUFBQSxFQUFlLEVBQWY7QUFBQSxZQUNBLFNBQUEsRUFBZSxFQURmO0FBQUEsWUFFQSxhQUFBLEVBQWUsRUFGZjtBQUFBLFlBR0EsYUFBQSxFQUFlLE1BQU0sQ0FBQyxhQUh0Qjs7U0FERjtBQUFBLFFBS0EsUUFBQSxHQUFXLElBQUMsQ0FBQSxTQUFVLENBQUEsUUFBQSxDQUx0QixDQUFBO0FBT0EsUUFBQSxJQUFHLDJCQUFBLElBQXVCLE1BQUEsQ0FBQSxNQUFhLENBQUMsVUFBZCxLQUE0QixVQUF0RDtBQUNFLFVBQUEsUUFBUSxDQUFDLFlBQVks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

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/lib/plugin-manager.coffee
