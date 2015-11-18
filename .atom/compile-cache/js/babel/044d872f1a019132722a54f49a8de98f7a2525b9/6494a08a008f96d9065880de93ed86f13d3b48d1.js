Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _bottomTab = require('./bottom-tab');

var _bottomTab2 = _interopRequireDefault(_bottomTab);

var _bottomStatus = require('./bottom-status');

var _bottomStatus2 = _interopRequireDefault(_bottomStatus);

'use babel';

var BottomContainer = (function (_HTMLElement) {
  _inherits(BottomContainer, _HTMLElement);

  function BottomContainer() {
    _classCallCheck(this, BottomContainer);

    _get(Object.getPrototypeOf(BottomContainer.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BottomContainer, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();
      this.emitter = new _atom.Emitter();
      this.tabs = new Map();
      this.tabs.set('Line', _bottomTab2['default'].create('Line'));
      this.tabs.set('File', _bottomTab2['default'].create('File'));
      this.tabs.set('Project', _bottomTab2['default'].create('Project'));
      this.status = new _bottomStatus2['default']();

      this.subscriptions.add(this.emitter);
      this.subscriptions.add(atom.config.observe('linter.displayLinterInfo', function (displayInfo) {
        _this.displayInfo = displayInfo;
        _this.visibility = typeof _this.visibility === 'undefined' ? true : _this.visibility;
      }));
      this.subscriptions.add(atom.config.observe('linter.statusIconScope', function (iconScope) {
        _this.iconScope = iconScope;
        _this.status.count = _this.tabs.get(iconScope).count;
      }));
      this.subscriptions.add(atom.config.observe('linter.displayLinterStatus', function (visibiltiy) {
        _this.status.visibility = visibiltiy;
      }));

      for (var tab of this.tabs) {
        this.appendChild(tab[1]);
        this.subscriptions.add(tab[1]);
      }
      this.appendChild(this.status);

      this.onDidChangeTab(function (activeName) {
        _this.activeTab = activeName;
      });
    }
  }, {
    key: 'getTab',
    value: function getTab(name) {
      return this.tabs.get(name);
    }
  }, {
    key: 'setCount',
    value: function setCount(_ref) {
      var Project = _ref.Project;
      var File = _ref.File;
      var Line = _ref.Line;

      this.tabs.get('Project').count = Project;
      this.tabs.get('File').count = File;
      this.tabs.get('Line').count = Line;
      this.status.count = this.tabs.get(this.iconScope).count;
    }
  }, {
    key: 'onDidChangeTab',
    value: function onDidChangeTab(callback) {
      var disposable = new _atom.CompositeDisposable();
      this.tabs.forEach(function (tab) {
        disposable.add(tab.onDidChangeTab(callback));
      });
      return disposable;
    }
  }, {
    key: 'onShouldTogglePanel',
    value: function onShouldTogglePanel(callback) {
      var disposable = new _atom.CompositeDisposable();
      this.tabs.forEach(function (tab) {
        disposable.add(tab.onShouldTogglePanel(callback));
      });
      return disposable;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.tabs.clear();
      this.status = null;
    }
  }, {
    key: 'activeTab',
    set: function set(activeName) {
      this._activeTab = activeName;
      for (var _ref23 of this.tabs) {
        var _ref22 = _slicedToArray(_ref23, 2);

        var _name = _ref22[0];
        var tab = _ref22[1];

        tab.active = _name === activeName;
      }
    },
    get: function get() {
      return this._activeTab;
    }
  }, {
    key: 'visibility',
    get: function get() {
      return !this.hasAttribute('hidden');
    },
    set: function set(value) {
      if (value && this.displayInfo) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', true);
      }
    }
  }], [{
    key: 'create',
    value: function create(activeTab) {
      var el = document.createElement('linter-bottom-container');
      el.activeTab = activeTab;
      return el;
    }
  }]);

  return BottomContainer;
})(HTMLElement);

exports['default'] = BottomContainer;

document.registerElement('linter-bottom-container', {
  prototype: BottomContainer.prototype
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07O3lCQUMzQixjQUFjOzs7OzRCQUNYLGlCQUFpQjs7OztBQUoxQyxXQUFXLENBQUE7O0lBTVUsZUFBZTtZQUFmLGVBQWU7O1dBQWYsZUFBZTswQkFBZixlQUFlOzsrQkFBZixlQUFlOzs7ZUFBZixlQUFlOztXQUNuQiwyQkFBRzs7O0FBQ2hCLFVBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXVCLENBQUE7QUFDNUMsVUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBVyxDQUFBO0FBQzFCLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUNyQixVQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsdUJBQVUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDL0MsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLHVCQUFVLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0FBQy9DLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSx1QkFBVSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUNyRCxVQUFJLENBQUMsTUFBTSxHQUFHLCtCQUFnQixDQUFBOztBQUU5QixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsMEJBQTBCLEVBQUUsVUFBQSxXQUFXLEVBQUk7QUFDcEYsY0FBSyxXQUFXLEdBQUcsV0FBVyxDQUFBO0FBQzlCLGNBQUssVUFBVSxHQUFHLE9BQU8sTUFBSyxVQUFV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QUFLLEVBQUUsQ0FBQTtBQUNqQixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtLQUNuQjs7O1NBeENZLGFBQUMsVUFBVSxFQUFFO0FBQ3hCLFVBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQzVCLHlCQUF3QixJQUFJLENBQUMsSUFBSSxFQUFFOzs7WUFBekIsS0FBSTtZQUFFLEdBQUc7O0FBQ2pCLFdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSSxLQUFLLFVBQVUsQ0FBQTtPQUNqQztLQUNGO1NBQ1ksZUFBRztBQUNkLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQTtLQUN2Qjs7O1NBRWEsZUFBRztBQUNmLGFBQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ3BDO1NBQ2EsYUFBQyxLQUFLLEVBQUU7QUFDcEIsVUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUM3QixZQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQy9CLE1BQU07QUFDTCxZQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUNsQztLQUNGOzs7V0F1QlksZ0JBQUMsU0FBUyxFQUFFO0FBQ3ZCLFVBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUM1RCxRQUFFLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtBQUN4QixhQUFPLEVBQUUsQ0FBQTtLQUNWOzs7U0F6RmtCLGVBQWU7R0FBUyxXQUFXOztxQkFBbkMsZUFBZTs7QUE0RnBDLFFBQVEsQ0FBQyxlQUFlLENBQUMseUJBQXlCLEVBQUU7QUFDbEQsV0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTO0NBQ3JDLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLWNvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gZnJvbSAnYXRvbSdcbmltcG9ydCBCb3R0b21UYWIgZnJvbSAnLi9ib3R0b20tdGFiJ1xuaW1wb3J0IEJvdHRvbVN0YXR1cyBmcm9tICcuL2JvdHRvbS1zdGF0dXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdHRvbUNvbnRhaW5lciBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICB0aGlzLnRhYnMgPSBuZXcgTWFwKClcbiAgICB0aGlzLnRhYnMuc2V0KCdMaW5lJywgQm90dG9tVGFiLmNyZWF0ZSgnTGluZScpKVxuICAgIHRoaXMudGFicy5zZXQoJ0ZpbGUnLCBCb3R0b21UYWIuY3JlYXRlKCdGaWxlJykpXG4gICAgdGhpcy50YWJzLnNldCgnUHJvamVjdCcsIEJvdHRvbVRhYi5jcmVhdGUoJ1Byb2plY3QnKSlcbiAgICB0aGlzLnN0YXR1cyA9IG5ldyBCb3R0b21TdGF0dXNcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmRpc3BsYXlMaW50ZXJJbmZvJywgZGlzcGxheUluZm8gPT4ge1xuICAgICAgdGhpcy5kaXNwbGF5SW5mbyA9IGRpc3BsYXlJbmZvXG4gICAgICB0aGlzLnZpc2liaWxpdHkgPSB0eXBlb2YgdGhpcy52aXNpYmlsaXR5ID09PSAndW5kZWZpbmVkJyA/IHRydWUgOiB0aGlzLnZpc2liaWxpdHlcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5zdGF0dXNJY29uU2NvcGUnLCBpY29uU2NvcGUgPT4ge1xuICAgICAgdGhpcy5pY29uU2NvcGUgPSBpY29uU2NvcGVcbiAgICAgIHRoaXMuc3RhdHVzLmNvdW50ID0gdGhpcy50YWJzLmdldChpY29uU2NvcGUpLmNvdW50XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuZGlzcGxheUxpbnRlclN0YXR1cycsIHZpc2liaWx0aXkgPT4ge1xuICAgICAgdGhpcy5zdGF0dXMudmlzaWJpbGl0eSA9IHZpc2liaWx0aXlcbiAgICB9KSlcblxuICAgIGZvciAobGV0IHRhYiBvZiB0aGlzLnRhYnMpIHtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGFiWzFdKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0YWJbMV0pXG4gICAgfVxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5zdGF0dXMpXG5cbiAgICB0aGlzLm9uRGlkQ2hhbmdlVGFiKGFjdGl2ZU5hbWUgPT4ge1xuICAgICAgdGhpcy5hY3RpdmVUYWIgPSBhY3RpdmVOYW1lXG4gICAgfSlcbiAgfVxuICBnZXRUYWIobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnRhYnMuZ2V0KG5hbWUpXG4gIH1cbiAgc2V0Q291bnQoe1Byb2plY3QsIEZpbGUsIExpbmV9KSB7XG4gICAgdGhpcy50YWJzLmdldCgnUHJvamVjdCcpLmNvdW50ID0gUHJvamVjdFxuICAgIHRoaXMudGFicy5nZXQoJ0ZpbGUnKS5jb3VudCA9IEZpbGVcbiAgICB0aGlzLnRhYnMuZ2V0KCdMaW5lJykuY291bnQgPSBMaW5lXG4gICAgdGhpcy5zdGF0dXMuY291bnQgPSB0aGlzLnRhYnMuZ2V0KHRoaXMuaWNvblNjb3BlKS5jb3VudFxuICB9XG5cbiAgc2V0IGFjdGl2ZVRhYihhY3RpdmVOYW1lKSB7XG4gICAgdGhpcy5fYWN0aXZlVGFiID0gYWN0aXZlTmFtZVxuICAgIGZvciAobGV0IFtuYW1lLCB0YWJdIG9mIHRoaXMudGFicykge1xuICAgICAgdGFiLmFjdGl2ZSA9IG5hbWUgPT09IGFjdGl2ZU5hbWVcbiAgICB9XG4gIH1cbiAgZ2V0IGFjdGl2ZVRhYigpIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlVGFiXG4gIH1cblxuICBnZXQgdmlzaWJpbGl0eSgpIHtcbiAgICByZXR1cm4gIXRoaXMuaGFzQXR0cmlidXRlKCdoaWRkZW4nKVxuICB9XG4gIHNldCB2aXNpYmlsaXR5KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHRoaXMuZGlzcGxheUluZm8pIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICBvbkRpZENoYW5nZVRhYihjYWxsYmFjaykge1xuICAgIGNvbnN0IGRpc3Bvc2FibGUgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMudGFicy5mb3JFYWNoKGZ1bmN0aW9uKHRhYikge1xuICAgICAgZGlzcG9zYWJsZS5hZGQodGFiLm9uRGlkQ2hhbmdlVGFiKGNhbGxiYWNrKSlcbiAgICB9KVxuICAgIHJldHVybiBkaXNwb3NhYmxlXG4gIH1cbiAgb25TaG91bGRUb2dnbGVQYW5lbChjYWxsYmFjaykge1xuICAgIGNvbnN0IGRpc3Bvc2FibGUgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMudGFicy5mb3JFYWNoKGZ1bmN0aW9uKHRhYikge1xuICAgICAgZGlzcG9zYWJsZS5hZGQodGFiLm9uU2hvdWxkVG9nZ2xlUGFuZWwoY2FsbGJhY2spKVxuICAgIH0pXG4gICAgcmV0dXJuIGRpc3Bvc2FibGVcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMudGFicy5jbGVhcigpXG4gICAgdGhpcy5zdGF0dXMgPSBudWxsXG4gIH1cblxuICBzdGF0aWMgY3JlYXRlKGFjdGl2ZVRhYikge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLWJvdHRvbS1jb250YWluZXInKVxuICAgIGVsLmFjdGl2ZVRhYiA9IGFjdGl2ZVRhYlxuICAgIHJldHVybiBlbFxuICB9XG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnbGludGVyLWJvdHRvbS1jb250YWluZXInLCB7XG4gIHByb3RvdHlwZTogQm90dG9tQ29udGFpbmVyLnByb3RvdHlwZVxufSlcbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/linter/lib/ui/bottom-container.js
