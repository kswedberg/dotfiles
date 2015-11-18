(function() {
  var CoffeeCompileEditor, TextEditor, configManager, fsUtil, pluginManager, util,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextEditor = require('atom').TextEditor;

  configManager = require('./config-manager');

  fsUtil = require('./fs-util');

  pluginManager = require('./plugin-manager');

  util = require('./util');

  module.exports = CoffeeCompileEditor = (function(_super) {
    __extends(CoffeeCompileEditor, _super);

    function CoffeeCompileEditor(_arg) {
      var grammar, shouldCompileToFile;
      this.sourceEditor = _arg.sourceEditor;
      CoffeeCompileEditor.__super__.constructor.apply(this, arguments);
      shouldCompileToFile = (this.sourceEditor != null) && fsUtil.isPathInSrc(this.sourceEditor.getPath()) && pluginManager.isEditorLanguageSupported(this.sourceEditor, true);
      if (shouldCompileToFile && configManager.get('compileOnSave') && !configManager.get('compileOnSaveWithoutPreview')) {
        this.disposables.add(this.sourceEditor.getBuffer().onDidSave((function(_this) {
          return function() {
            return _this.renderAndSave();
          };
        })(this)));
        this.disposables.add(this.sourceEditor.getBuffer().onDidReload((function(_this) {
          return function() {
            return _this.renderAndSave();
          };
        })(this)));
      }
      grammar = atom.grammars.selectGrammar(pluginManager.getCompiledScopeByEditor(this.sourceEditor));
      this.setGrammar(grammar);
      if (shouldCompileToFile && (configManager.get('compileOnSave') || configManager.get('compileOnSaveWithoutPreview'))) {
        util.compileToFile(this.sourceEditor);
      }
      this.buffer.saveAs = function() {};
    }

    CoffeeCompileEditor.prototype.renderAndSave = function() {
      this.renderCompiled();
      return util.compileToFile(this.sourceEditor);
    };

    CoffeeCompileEditor.prototype.renderCompiled = function() {
      var code, e, text;
      code = util.getSelectedCode(this.sourceEditor);
      try {
        text = util.compile(code, this.sourceEditor);
      } catch (_error) {
        e = _error;
        text = e.stack;
      }
      return this.setText(text);
    };

    CoffeeCompileEditor.prototype.getTitle = function() {
      var _ref;
      return ("Compiled " + (((_ref = this.sourceEditor) != null ? _ref.getTitle() : void 0) || '')).trim();
    };

    CoffeeCompileEditor.prototype.getURI = function() {
      return "coffeecompile://editor/" + this.sourceEditor.id;
    };

    return CoffeeCompileEditor;

  })(TextEditor);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9saWIvY29mZmVlLWNvbXBpbGUtZWRpdG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyRUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsYUFBZSxPQUFBLENBQVEsTUFBUixFQUFmLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLENBRmhCLENBQUE7O0FBQUEsRUFHQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQUhoQixDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFnQixPQUFBLENBQVEsUUFBUixDQUpoQixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDBDQUFBLENBQUE7O0FBQWEsSUFBQSw2QkFBQyxJQUFELEdBQUE7QUFDWCxVQUFBLDRCQUFBO0FBQUEsTUFEYSxJQUFDLENBQUEsZUFBRixLQUFFLFlBQ2QsQ0FBQTtBQUFBLE1BQUEsc0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLG1CQUFBLEdBQXNCLDJCQUFBLElBQW1CLE1BQU0sQ0FBQyxXQUFQLENBQW1CLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFBLENBQW5CLENBQW5CLElBQ3BCLGFBQWEsQ0FBQyx5QkFBZCxDQUF3QyxJQUFDLENBQUEsWUFBekMsRUFBdUQsSUFBdkQsQ0FIRixDQUFBO0FBS0EsTUFBQSxJQUFHLG1CQUFBLElBQXdCLGFBQWEsQ0FBQyxHQUFkLENBQWtCLGVBQWxCLENBQXhCLElBQStELENBQUEsYUFDakQsQ0FBQyxHQUFkLENBQWtCLDZCQUFsQixDQURKO0FBRUUsUUFBQSxJ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

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/lib/coffee-compile-editor.coffee
