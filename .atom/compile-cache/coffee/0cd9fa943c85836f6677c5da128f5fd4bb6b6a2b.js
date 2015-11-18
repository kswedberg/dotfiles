(function() {
  var configManager;

  configManager = require('../lib/config-manager');

  describe('configManager', function() {
    afterEach(function() {
      atom.config.unset('coffee-compile');
      configManager.unsetConfig();
      return configManager.deactivate();
    });
    it('should not set configFile when enableProjectConfig is false', function() {
      atom.config.set('coffee-compile.enableProjectConfig', false);
      configManager.initProjectConfig('spec/coffee-compile-test.cson');
      expect(configManager.configFile).toBeUndefined();
      return expect(configManager.projectConfig).toEqual({});
    });
    it('should set configFile when enableProjectConfig is true', function() {
      atom.config.set('coffee-compile.enableProjectConfig', true);
      configManager.initProjectConfig('coffee-compile-test.cson');
      expect(configManager.configFile).toBeDefined();
      return expect(configManager.configFile.getBaseName()).toBe('coffee-compile-test.cson');
    });
    describe('after initProjectConfig', function() {
      beforeEach(function() {
        atom.config.set('coffee-compile.enableProjectConfig', true);
        return configManager.initProjectConfig('coffee-compile-test.cson');
      });
      it('should get the proper setting', function() {
        atom.config.set('coffee-compile.compileOnSave', false);
        return expect(configManager.get('compileOnSave')).toBe(true);
      });
      it('should default to atom config', function() {
        atom.config.set('coffee-compile.flatten', true);
        return expect(configManager.get('flatten')).toBe(true);
      });
      it('should set the key', function() {
        atom.config.set('coffee-compile.flatten', true);
        configManager.set('flatten', false);
        return expect(configManager.get('flatten')).toBe(false);
      });
      return it('should emit did-change event', function() {
        var updatedCallback;
        updatedCallback = jasmine.createSpy('updated');
        configManager.onDidChangeKey('flatten', updatedCallback);
        expect(updatedCallback).not.toHaveBeenCalled();
        configManager.set('flatten', true);
        return expect(updatedCallback).toHaveBeenCalled();
      });
    });
    return describe('removing coffee-compile.cson', function() {
      beforeEach(function() {
        atom.config.set('coffee-compile.enableProjectConfig', true);
        return configManager.initProjectConfig('coffee-compile-test.cson');
      });
      return it('should unset the project config', function() {
        var configFile, didChange, observe;
        observe = jasmine.createSpy('observe');
        configManager.observe('cwd', observe);
        didChange = jasmine.createSpy('did-change');
        configFile = configManager.configFile;
        configManager.emitter.on('did-change', didChange);
        configFile.emitter.emit('did-delete');
        expect(configManager.projectConfig).toEqual({});
        expect(didChange).toHaveBeenCalled();
        return expect(observe).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9zcGVjL2NvbmZpZy1tYW5hZ2VyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSx1QkFBUixDQUFoQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLElBQUEsU0FBQSxDQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFaLENBQWtCLGdCQUFsQixDQUFBLENBQUE7QUFBQSxNQUNBLGFBQWEsQ0FBQyxXQUFkLENBQUEsQ0FEQSxDQUFBO2FBRUEsYUFBYSxDQUFDLFVBQWQsQ0FBQSxFQUhRO0lBQUEsQ0FBVixDQUFBLENBQUE7QUFBQSxJQUtBLEVBQUEsQ0FBRyw2REFBSCxFQUFrRSxTQUFBLEdBQUE7QUFDaEUsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLEVBQXNELEtBQXRELENBQUEsQ0FBQTtBQUFBLE1BQ0EsYUFBYSxDQUFDLGlCQUFkLENBQWdDLCtCQUFoQyxDQURBLENBQUE7QUFBQSxNQUdBLE1BQUEsQ0FBTyxhQUFhLENBQUMsVUFBckIsQ0FBZ0MsQ0FBQyxhQUFqQyxDQUFBLENBSEEsQ0FBQTthQUlBLE1BQUEsQ0FBTyxhQUFhLENBQUMsYUFBckIsQ0FBbUMsQ0FBQyxPQUFwQyxDQUE0QyxFQUE1QyxFQUxnRTtJQUFBLENBQWxFLENBTEEsQ0FBQTtBQUFBLElBWUEsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUEsR0FBQTtBQUMzRCxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEIsRUFBc0QsSUFBdEQsQ0FB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

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/spec/config-manager-spec.coffee
