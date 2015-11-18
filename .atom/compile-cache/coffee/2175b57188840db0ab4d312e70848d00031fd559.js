(function() {
  var CoffeeCompileEditor, CompositeDisposable, coffeeProvider, configManager, cson, fsUtil, pluginManager, querystring, url, util;

  url = require('url');

  querystring = require('querystring');

  cson = require('season');

  CoffeeCompileEditor = require('./coffee-compile-editor');

  coffeeProvider = require('./providers/coffee-provider');

  configManager = require('./config-manager');

  fsUtil = require('./fs-util');

  pluginManager = require('./plugin-manager');

  util = require('./util');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: require('../config'),
    activate: function() {
      configManager.initProjectConfig();
      this.saveDisposables = new CompositeDisposable;
      this.pkgDisposables = new CompositeDisposable;
      atom.commands.add('atom-workspace', {
        'coffee-compile:compile': (function(_this) {
          return function() {
            return _this.display();
          };
        })(this)
      });
      this.pkgDisposables.add(configManager.observe('compileOnSaveWithoutPreview', (function(_this) {
        return function(value) {
          _this.saveDisposables.dispose();
          _this.saveDisposables = new CompositeDisposable;
          if (value) {
            return _this.saveDisposables.add(atom.workspace.observeTextEditors(function(editor) {
              return _this.saveDisposables.add(editor.onDidSave(function() {
                return _this.save(editor);
              }));
            }));
          }
        };
      })(this)));
      if (!pluginManager.isPluginRegistered(coffeeProvider)) {
        this.registerProviders(coffeeProvider);
      }
      return this.pkgDisposables.add(atom.workspace.addOpener(function(uriToOpen) {
        var pathname, protocol, sourceEditor, sourceEditorId, _ref;
        _ref = url.parse(uriToOpen), protocol = _ref.protocol, pathname = _ref.pathname;
        if (pathname) {
          pathname = querystring.unescape(pathname);
        }
        if (protocol !== 'coffeecompile:') {
          return;
        }
        sourceEditorId = pathname.substr(1);
        sourceEditor = util.getTextEditorById(sourceEditorId);
        if (sourceEditor == null) {
          return;
        }
        return new CoffeeCompileEditor({
          sourceEditor: sourceEditor
        });
      }));
    },
    deactivate: function() {
      return this.pkgDisposables.dispose();
    },
    save: function(editor) {
      var isPathInSrc;
      if (editor == null) {
        return;
      }
      isPathInSrc = !!editor.getPath() && fsUtil.isPathInSrc(editor.getPath());
      if (isPathInSrc && pluginManager.isEditorLanguageSupported(editor, true)) {
        return util.compileToFile(editor);
      }
    },
    display: function() {
      var activePane, editor;
      editor = atom.workspace.getActiveTextEditor();
      activePane = atom.workspace.getActivePane();
      if (editor == null) {
        return;
      }
      if (!pluginManager.isEditorLanguageSupported(editor)) {
        return console.warn("Coffee compile: Invalid language");
      }
      return this.open("coffeecompile://editor/" + editor.id).then(function(editor) {
        editor.renderCompiled();
        if (configManager.get('focusEditorAfterCompile')) {
          return activePane.activate();
        }
      });
    },
    open: function(uri) {
      var pane;
      uri = atom.project.resolvePath(uri);
      pane = atom.workspace.paneForURI(uri);
      if (pane == null) {
        pane = (function() {
          switch (configManager.get('split').toLowerCase()) {
            case 'left':
              return atom.workspace.getActivePane().splitLeft();
            case 'right':
              return atom.workspace.getActivePane().findOrCreateRightmostSibling();
            case 'down':
              return atom.workspace.getActivePane().splitDown();
            case 'up':
              return atom.workspace.getActivePane().splitUp();
            default:
              return atom.workspace.getActivePane();
          }
        })();
      }
      return atom.workspace.openURIInPane(uri, pane);
    },
    registerProviders: function(provider) {
      return pluginManager.register(provider);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEhBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQWMsT0FBQSxDQUFRLEtBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBYyxPQUFBLENBQVEsUUFBUixDQUZkLENBQUE7O0FBQUEsRUFJQSxtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVIsQ0FKdEIsQ0FBQTs7QUFBQSxFQUtBLGNBQUEsR0FBc0IsT0FBQSxDQUFRLDZCQUFSLENBTHRCLENBQUE7O0FBQUEsRUFNQSxhQUFBLEdBQXNCLE9BQUEsQ0FBUSxrQkFBUixDQU50QixDQUFBOztBQUFBLEVBT0EsTUFBQSxHQUFzQixPQUFBLENBQVEsV0FBUixDQVB0QixDQUFBOztBQUFBLEVBUUEsYUFBQSxHQUFzQixPQUFBLENBQVEsa0JBQVIsQ0FSdEIsQ0FBQTs7QUFBQSxFQVNBLElBQUEsR0FBc0IsT0FBQSxDQUFRLFFBQVIsQ0FUdEIsQ0FBQTs7QUFBQSxFQVVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFWRCxDQUFBOztBQUFBLEVBWUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLE9BQUEsQ0FBUSxXQUFSLENBQVI7QUFBQSxJQUNBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLGFBQWEsQ0FBQyxpQkFBZCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsR0FBQSxDQUFBLG1CQUZuQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsY0FBRCxHQUFrQixH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

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/lib/main.coffee
