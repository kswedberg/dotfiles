Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _indie = require('./indie');

var _indie2 = _interopRequireDefault(_indie);

'use babel';

var IndieRegistry = (function () {
  function IndieRegistry() {
    _classCallCheck(this, IndieRegistry);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();

    this.indieLinters = new Set();
    this.subscriptions.add(this.emitter);
  }

  _createClass(IndieRegistry, [{
    key: 'register',
    value: function register(linter) {
      var _this = this;

      _validate2['default'].linter(linter, true);
      var indieLinter = new _indie2['default'](linter);

      this.subscriptions.add(indieLinter);
      this.indieLinters.add(indieLinter);

      indieLinter.onDidDestroy(function () {
        _this.indieLinters['delete'](indieLinter);
      });
      indieLinter.onDidUpdateMessages(function (messages) {
        _this.emitter.emit('did-update-messages', { linter: indieLinter, messages: messages });
      });
      this.emit('observe', indieLinter);

      return indieLinter;
    }
  }, {
    key: 'has',
    value: function has(indieLinter) {
      return this.indieLinters.has(indieLinter);
    }
  }, {
    key: 'unregister',
    value: function unregister(indieLinter) {
      if (this.indieLinters.has(indieLinter)) {
        indieLinter.dispose();
      }
    }

    // Private method
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.indieLinters.forEach(callback);
      return this.emitter.on('observe', callback);
    }

    // Private method
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return IndieRegistry;
})();

exports['default'] = IndieRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9pbmRpZS1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUUyQyxNQUFNOzt3QkFDNUIsWUFBWTs7OztxQkFDZixTQUFTOzs7O0FBSjNCLFdBQVcsQ0FBQTs7SUFNVSxhQUFhO0FBQ3JCLFdBRFEsYUFBYSxHQUNsQjswQkFESyxhQUFhOztBQUU5QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTs7QUFFNUIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzdCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQzs7ZUFQa0IsYUFBYTs7V0FTeEIsa0JBQUMsTUFBTSxFQUFFOzs7QUFDZiw0QkFBUyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzdCLFVBQU0sV0FBVyxHQUFHLHVCQUFVLE1BQU0sQ0FBQyxDQUFBOztBQUVyQyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUNuQyxVQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTs7QUFFbEMsaUJBQVcsQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUM3QixjQUFLLFlBQVksVUFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO09BQ3RDLENBQUMsQ0FBQTtBQUNGLGlCQUFXLENBQUMsbUJBQW1CLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDMUMsY0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFDLENBQUMsQ0FBQTtPQUMxRSxDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTs7QUFFakMsYUFBTyxXQUFXLENBQUE7S0FDbkI7OztXQUNFLGFBQUMsV0FBVyxFQUFFO0FBQ2YsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtLQUMxQzs7O1dBQ1Msb0JBQUMsV0FBVyxFQUFFO0FBQ3RCLFVBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDdEMsbUJBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN0QjtLQUNGOzs7OztXQUdNLGlCQUFDLFFBQVEsRUFBRTtBQUNoQixVQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNuQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM1Qzs7Ozs7V0FFa0IsNkJBQUMsUUFBUSxFQUFFO0FBQzVCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDeEQ7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBL0NrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaW5kaWUtcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgVmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZSdcbmltcG9ydCBJbmRpZSBmcm9tICcuL2luZGllJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRpZVJlZ2lzdHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuICAgIHRoaXMuaW5kaWVMaW50ZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cblxuICByZWdpc3RlcihsaW50ZXIpIHtcbiAgICBWYWxpZGF0ZS5saW50ZXIobGludGVyLCB0cnVlKVxuICAgIGNvbnN0IGluZGllTGludGVyID0gbmV3IEluZGllKGxpbnRlcilcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoaW5kaWVMaW50ZXIpXG4gICAgdGhpcy5pbmRpZUxpbnRlcnMuYWRkKGluZGllTGludGVyKVxuXG4gICAgaW5kaWVMaW50ZXIub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIHRoaXMuaW5kaWVMaW50ZXJzLmRlbGV0ZShpbmRpZUxpbnRlcilcbiAgICB9KVxuICAgIGluZGllTGludGVyLm9uRGlkVXBkYXRlTWVzc2FnZXMobWVzc2FnZXMgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCB7bGludGVyOiBpbmRpZUxpbnRlciwgbWVzc2FnZXN9KVxuICAgIH0pXG4gICAgdGhpcy5lbWl0KCdvYnNlcnZlJywgaW5kaWVMaW50ZXIpXG5cbiAgICByZXR1cm4gaW5kaWVMaW50ZXJcbiAgfVxuICBoYXMoaW5kaWVMaW50ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRpZUxpbnRlcnMuaGFzKGluZGllTGludGVyKVxuICB9XG4gIHVucmVnaXN0ZXIoaW5kaWVMaW50ZXIpIHtcbiAgICBpZiAodGhpcy5pbmRpZUxpbnRlcnMuaGFzKGluZGllTGludGVyKSkge1xuICAgICAgaW5kaWVMaW50ZXIuZGlzcG9zZSgpXG4gICAgfVxuICB9XG5cbiAgLy8gUHJpdmF0ZSBtZXRob2RcbiAgb2JzZXJ2ZShjYWxsYmFjaykge1xuICAgIHRoaXMuaW5kaWVMaW50ZXJzLmZvckVhY2goY2FsbGJhY2spXG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb2JzZXJ2ZScsIGNhbGxiYWNrKVxuICB9XG4gIC8vIFByaXZhdGUgbWV0aG9kXG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuIl19
//# sourceURL=/Users/kswedberg/.atom/packages/linter/lib/indie-registry.js
