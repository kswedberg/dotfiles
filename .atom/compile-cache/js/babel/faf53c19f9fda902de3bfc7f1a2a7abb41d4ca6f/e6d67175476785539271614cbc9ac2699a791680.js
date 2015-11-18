Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

'use babel';

var BottomTab = (function (_HTMLElement) {
  _inherits(BottomTab, _HTMLElement);

  function BottomTab() {
    _classCallCheck(this, BottomTab);

    _get(Object.getPrototypeOf(BottomTab.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BottomTab, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.subscriptions = new _atom.CompositeDisposable();
      this.emitter = new _atom.Emitter();

      this.nameElement = document.createTextNode('');
      this.countElement = document.createElement('span');
      this.countElement.classList.add('count');

      this.appendChild(this.nameElement);
      this.appendChild(document.createTextNode(' '));
      this.appendChild(this.countElement);

      this.count = 0;

      this.subscriptions.add(this.emitter);
      this.addEventListener('click', function () {
        if (this.active) {
          this.emitter.emit('should-toggle-panel');
        } else {
          this.emitter.emit('did-change-tab', this.name);
        }
      });
    }
  }, {
    key: 'prepare',
    value: function prepare(name) {
      var _this = this;

      this.name = name;
      this.nameElement.textContent = name;
      this.subscriptions.add(atom.config.observe('linter.showErrorTab' + name, function (status) {
        if (status) {
          _this.removeAttribute('hidden');
        } else {
          _this.setAttribute('hidden', true);
        }
      }));
    }
  }, {
    key: 'onDidChangeTab',
    value: function onDidChangeTab(callback) {
      return this.emitter.on('did-change-tab', callback);
    }
  }, {
    key: 'onShouldTogglePanel',
    value: function onShouldTogglePanel(callback) {
      return this.emitter.on('should-toggle-panel', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'count',
    set: function set(count) {
      this._count = count;
      this.countElement.textContent = count;
    },
    get: function get() {
      return this._count;
    }
  }, {
    key: 'active',
    set: function set(value) {
      this._active = value;
      if (value) {
        this.classList.add('active');
      } else {
        this.classList.remove('active');
      }
    },
    get: function get() {
      return this._active;
    }
  }], [{
    key: 'create',
    value: function create(name) {
      var el = document.createElement('linter-bottom-tab');
      el.prepare(name);
      return el;
    }
  }]);

  return BottomTab;
})(HTMLElement);

exports['default'] = BottomTab;

document.registerElement('linter-bottom-tab', {
  prototype: BottomTab.prototype
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tdGFiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7QUFGakQsV0FBVyxDQUFBOztJQUlVLFNBQVM7WUFBVCxTQUFTOztXQUFULFNBQVM7MEJBQVQsU0FBUzs7K0JBQVQsU0FBUzs7O2VBQVQsU0FBUzs7V0FDYiwyQkFBRztBQUNoQixVQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFVBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTs7QUFFNUIsVUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQzlDLFVBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNsRCxVQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRXhDLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ2xDLFVBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQzlDLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUVuQyxVQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQTs7QUFFZCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsVUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQ3hDLFlBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLGNBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUE7U0FDekMsTUFBTTtBQUNMLGNBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUMvQztPQUNGLENBQUMsQ0FBQTtLQUNIOzs7V0FDTSxpQkFBQyxJQUFJLEVBQUU7OztBQUNaLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLFVBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtBQUNuQyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8seUJBQXVCLElBQUksRUFBSSxVQUFBLE1BQU0sRUFBSTtBQUNqRixZQUFJLE1BQU0sRUFBRTtBQUNWLGdCQUFLLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUMvQixNQUFNO0FBQ0wsZ0JBQUssWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUNsQztPQUNGLENBQUMsQ0FBQyxDQUFBO0tBQ0o7OztXQUNhLHdCQUFDLFFBQVEsRUFBRTtBQUN2QixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ25EOzs7V0FDa0IsNkJBQUMsUUFBUSxFQUFFO0FBQzVCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDeEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBRVEsYUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtBQUNuQixVQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7S0FDdEM7U0FDUSxlQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0tBQ25COzs7U0FFUyxhQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtBQUNwQixVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzdCLE1BQU07QUFDTCxZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUNoQztLQUNGO1NBQ1MsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNwQjs7O1dBRVksZ0JBQUMsSUFBSSxFQUFFO0FBQ2xCLFVBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtBQUN0RCxRQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2hCLGFBQU8sRUFBRSxDQUFBO0tBQ1Y7OztTQXJFa0IsU0FBUztHQUFTLFdBQVc7O3FCQUE3QixTQUFTOztBQXdFOUIsUUFBUSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRTtBQUM1QyxXQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVM7Q0FDL0IsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tdGFiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3R0b21UYWIgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuXG4gICAgdGhpcy5uYW1lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKVxuICAgIHRoaXMuY291bnRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgdGhpcy5jb3VudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY291bnQnKVxuXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLm5hbWVFbGVtZW50KVxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAnKSlcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY291bnRFbGVtZW50KVxuXG4gICAgdGhpcy5jb3VudCA9IDBcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLXRvZ2dsZS1wYW5lbCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS10YWInLCB0aGlzLm5hbWUpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBwcmVwYXJlKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy5uYW1lRWxlbWVudC50ZXh0Q29udGVudCA9IG5hbWVcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoYGxpbnRlci5zaG93RXJyb3JUYWIke25hbWV9YCwgc3RhdHVzID0+IHtcbiAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICAgIH1cbiAgICB9KSlcbiAgfVxuICBvbkRpZENoYW5nZVRhYihjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2UtdGFiJywgY2FsbGJhY2spXG4gIH1cbiAgb25TaG91bGRUb2dnbGVQYW5lbChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC10b2dnbGUtcGFuZWwnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxuXG4gIHNldCBjb3VudChjb3VudCkge1xuICAgIHRoaXMuX2NvdW50ID0gY291bnRcbiAgICB0aGlzLmNvdW50RWxlbWVudC50ZXh0Q29udGVudCA9IGNvdW50XG4gIH1cbiAgZ2V0IGNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9jb3VudFxuICB9XG5cbiAgc2V0IGFjdGl2ZSh2YWx1ZSkge1xuICAgIHRoaXMuX2FjdGl2ZSA9IHZhbHVlXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG4gIH1cbiAgZ2V0IGFjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlXG4gIH1cblxuICBzdGF0aWMgY3JlYXRlKG5hbWUpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1ib3R0b20tdGFiJylcbiAgICBlbC5wcmVwYXJlKG5hbWUpXG4gICAgcmV0dXJuIGVsXG4gIH1cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItYm90dG9tLXRhYicsIHtcbiAgcHJvdG90eXBlOiBCb3R0b21UYWIucHJvdG90eXBlXG59KVxuIl19
//# sourceURL=/Users/kswedberg/.atom/packages/linter/lib/ui/bottom-tab.js
