(function() {
  var CompositeDisposable, ConfigManager, Emitter, File, cson, _ref;

  cson = require('season');

  _ref = require('atom'), File = _ref.File, Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  ConfigManager = (function() {
    ConfigManager.filename = 'coffee-compile.cson';

    ConfigManager.configPrefix = 'coffee-compile.';

    function ConfigManager() {
      this.configDisposables = new CompositeDisposable;
      this.emitter = new Emitter;
      this.projectConfig = {};
    }

    ConfigManager.prototype.initProjectConfig = function(filename) {
      var configPath;
      if (filename == null) {
        filename = ConfigManager.filename;
      }
      if (atom.config.get('coffee-compile.enableProjectConfig')) {
        configPath = atom.project.resolvePath(filename);
        if (!configPath) {
          return;
        }
        if (this.configDisposables != null) {
          this.configDisposables.dispose();
        }
        this.configDisposables = new CompositeDisposable;
        this.configFile = new File(configPath);
        if (this.configFile.existsSync()) {
          this.setConfigFromFile();
          this.configDisposables.add(this.configFile.onDidChange((function(_this) {
            return function() {
              return _this.reloadProjectConfig();
            };
          })(this)));
          return this.configDisposables.add(this.configFile.onDidDelete((function(_this) {
            return function() {
              _this.unsetConfig();
              _this.configDisposables.dispose();
              return _this.configFile = null;
            };
          })(this)));
        }
      }
    };

    ConfigManager.prototype.deactivate = function() {
      if (this.configDisposables != null) {
        this.configDisposables.dispose();
        this.configDisposables = null;
      }
      return this.configFile = null;
    };

    ConfigManager.prototype.setConfigFromFile = function() {
      return this.projectConfig = cson.readFileSync(this.configFile.getPath()) || {};
    };

    ConfigManager.prototype.unsetConfig = function() {
      this.projectConfig = {};
      return this.emitter.emit('did-change');
    };

    ConfigManager.prototype.reloadProjectConfig = function() {
      this.setConfigFromFile();
      return this.emitter.emit('did-change');
    };

    ConfigManager.prototype.get = function(key) {
      if (this.projectConfig[key] != null) {
        return this.projectConfig[key];
      } else {
        return atom.config.get("" + ConfigManager.configPrefix + key);
      }
    };

    ConfigManager.prototype.set = function(key, value) {
      this.projectConfig[key] = value;
      return this.emitter.emit('did-change');
    };

    ConfigManager.prototype.observe = function(key, callback) {
      var disposable;
      disposable = new CompositeDisposable;
      disposable.add(atom.config.observe("" + ConfigManager.configPrefix + key, (function(_this) {
        return function() {
          return callback(_this.get(key));
        };
      })(this)));
      disposable.add(this.onDidChangeKey(key, callback));
      return disposable;
    };

    ConfigManager.prototype.onDidChangeKey = function(key, callback) {
      var oldValue;
      oldValue = this.projectConfig[key];
      return this.emitter.on('did-change', (function(_this) {
        return function() {
          var newValue;
          newValue = _this.projectConfig[key];
          if (oldValue !== newValue) {
            oldValue = newValue;
            return callback(_this.get(key));
          }
        };
      })(this));
    };

    return ConfigManager;

  })();

  module.exports = new ConfigManager();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9saWIvY29uZmlnLW1hbmFnZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZEQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQXVDLE9BQUEsQ0FBUSxNQUFSLENBQXZDLEVBQUMsWUFBQSxJQUFELEVBQU8sZUFBQSxPQUFQLEVBQWdCLDJCQUFBLG1CQURoQixDQUFBOztBQUFBLEVBR007QUFDSixJQUFBLGFBQUMsQ0FBQSxRQUFELEdBQVkscUJBQVosQ0FBQTs7QUFBQSxJQUNBLGFBQUMsQ0FBQSxZQUFELEdBQWdCLGlCQURoQixDQUFBOztBQUdhLElBQUEsdUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLGlCQUFELEdBQXFCLEdBQUEsQ0FBQSxtQkFBckIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBcUIsR0FBQSxDQUFBLE9BRHJCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQXFCLEVBRnJCLENBRFc7SUFBQSxDQUhiOztBQUFBLDRCQVFBLGlCQUFBLEdBQW1CLFNBQUMsUUFBRCxHQUFBO0FBQ2pCLFVBQUEsVUFBQTs7UUFEa0IsV0FBVyxhQUFhLENBQUM7T0FDM0M7QUFBQSxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQUFIO0FBQ0UsUUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFiLENBQXlCLFFBQXpCLENBQWIsQ0FBQTtBQUVBLFFBQUEsSUFBQSxDQUFBLFVBQUE7QUFBQSxnQkFBQSxDQUFBO1NBRkE7QUFJQSxRQUFBLElBQUcsOEJBQUg7QUFDRSxVQUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/lib/config-manager.coffee
