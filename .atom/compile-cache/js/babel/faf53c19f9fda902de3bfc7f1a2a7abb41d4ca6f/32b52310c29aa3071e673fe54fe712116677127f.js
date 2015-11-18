'use babel';
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PackageDepsView = (function () {
  function PackageDepsView(packageName, packageNames) {
    _classCallCheck(this, PackageDepsView);

    this.packageName = packageName;
    this.packageNames = packageNames;

    this.progress = document.createElement('progress');
    this.progress.max = packageNames.length;
    this.progress.value = 0;
    this.progress.classList.add('display-inline');
    this.progress.style.width = '100%';
  }

  _createClass(PackageDepsView, [{
    key: 'createNotification',
    value: function createNotification() {
      var _this = this;

      return new Promise(function (resolve) {
        setTimeout(function () {
          _this.notification = atom.notifications.addInfo('Installing ' + _this.packageName + ' dependencies', {
            detail: 'Installing ' + _this.packageNames.join(', '),
            dismissable: true
          });
          _this.notificationEl = atom.views.getView(_this.notification);
          _this.notificationContentEl = _this.notificationEl.querySelector('.detail-content');
          if (_this.notificationContentEl) {
            // Future-proof
            _this.notificationContentEl.appendChild(_this.progress);
          }
          resolve();
        }, 20);
      });
    }
  }, {
    key: 'markFinished',
    value: function markFinished() {
      this.progress.value++;
      if (this.progress.value === this.progress.max) {
        var titleEl = this.notificationEl.querySelector('.message p');
        if (titleEl) {
          titleEl.textContent = 'Installed ' + this.packageName + ' dependencies';
        }
        this.notificationContentEl.textContent = 'Installed ' + this.packageNames.join(', ');
        this.notificationEl.classList.remove('info');
        this.notificationEl.classList.remove('icon-info');
        this.notificationEl.classList.add('success');
        this.notificationEl.classList.add('icon-check');
      }
    }
  }]);

  return PackageDepsView;
})();

exports['default'] = PackageDepsView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvbm9kZV9tb2R1bGVzL2F0b20tcGFja2FnZS1kZXBzL2xpYi92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7O0lBQ1UsZUFBZTtBQUN2QixXQURRLGVBQWUsQ0FDdEIsV0FBVyxFQUFFLFlBQVksRUFBQzswQkFEbkIsZUFBZTs7QUFFaEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsUUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUE7O0FBRWhDLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNsRCxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFBO0FBQ3ZDLFFBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQTtBQUN2QixRQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUM3QyxRQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFBO0dBRW5DOztlQVhrQixlQUFlOztXQVloQiw4QkFBRzs7O0FBQ25CLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDNUIsa0JBQVUsQ0FBQyxZQUFNO0FBQ2YsZ0JBQUssWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxpQkFBZSxNQUFLLFdBQVcsb0JBQWlCO0FBQzVGLGtCQUFNLEVBQUUsYUFBYSxHQUFHLE1BQUssWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDcEQsdUJBQVcsRUFBRSxJQUFJO1dBQ2xCLENBQUMsQ0FBQTtBQUNGLGdCQUFLLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFLLFlBQVksQ0FBQyxDQUFBO0FBQzNELGdCQUFLLHFCQUFxQixHQUFHLE1BQUssY0FBYyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ2pGLGNBQUksTUFBSyxxQkFBcUIsRUFBRTs7QUFDOUIsa0JBQUsscUJBQXFCLENBQUMsV0FBVyxDQUFDLE1BQUssUUFBUSxDQUFDLENBQUE7V0FDdEQ7QUFDRCxpQkFBTyxFQUFFLENBQUE7U0FDVixFQUFFLEVBQUUsQ0FBQyxDQUFBO09BQ1AsQ0FBQyxDQUFBO0tBQ0g7OztXQUNXLHdCQUFHO0FBQ2IsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQixVQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFO0FBQzdDLFlBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQy9ELFlBQUksT0FBTyxFQUFFO0FBQ1gsaUJBQU8sQ0FBQyxXQUFXLGtCQUFnQixJQUFJLENBQUMsV0FBVyxrQkFBZSxDQUFBO1NBQ25FO0FBQ0QsWUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsR0FBRyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDcEYsWUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzVDLFlBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUNqRCxZQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDNUMsWUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO09BQ2hEO0tBQ0Y7OztTQXpDa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXItanNjcy9ub2RlX21vZHVsZXMvYXRvbS1wYWNrYWdlLWRlcHMvbGliL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2FnZURlcHNWaWV3IHtcbiAgY29uc3RydWN0b3IocGFja2FnZU5hbWUsIHBhY2thZ2VOYW1lcyl7XG4gICAgdGhpcy5wYWNrYWdlTmFtZSA9IHBhY2thZ2VOYW1lXG4gICAgdGhpcy5wYWNrYWdlTmFtZXMgPSBwYWNrYWdlTmFtZXNcblxuICAgIHRoaXMucHJvZ3Jlc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcm9ncmVzcycpXG4gICAgdGhpcy5wcm9ncmVzcy5tYXggPSBwYWNrYWdlTmFtZXMubGVuZ3RoXG4gICAgdGhpcy5wcm9ncmVzcy52YWx1ZSA9IDBcbiAgICB0aGlzLnByb2dyZXNzLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXktaW5saW5lJylcbiAgICB0aGlzLnByb2dyZXNzLnN0eWxlLndpZHRoID0gJzEwMCUnXG5cbiAgfVxuICBjcmVhdGVOb3RpZmljYXRpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oYEluc3RhbGxpbmcgJHt0aGlzLnBhY2thZ2VOYW1lfSBkZXBlbmRlbmNpZXNgLCB7XG4gICAgICAgICAgZGV0YWlsOiAnSW5zdGFsbGluZyAnICsgdGhpcy5wYWNrYWdlTmFtZXMuam9pbignLCAnKSxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbkVsID0gYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMubm90aWZpY2F0aW9uKVxuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbkNvbnRlbnRFbCA9IHRoaXMubm90aWZpY2F0aW9uRWwucXVlcnlTZWxlY3RvcignLmRldGFpbC1jb250ZW50JylcbiAgICAgICAgaWYgKHRoaXMubm90aWZpY2F0aW9uQ29udGVudEVsKSB7IC8vIEZ1dHVyZS1wcm9vZlxuICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9uQ29udGVudEVsLmFwcGVuZENoaWxkKHRoaXMucHJvZ3Jlc3MpXG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9LCAyMClcbiAgICB9KVxuICB9XG4gIG1hcmtGaW5pc2hlZCgpIHtcbiAgICB0aGlzLnByb2dyZXNzLnZhbHVlKytcbiAgICBpZiAodGhpcy5wcm9ncmVzcy52YWx1ZSA9PT0gdGhpcy5wcm9ncmVzcy5tYXgpIHtcbiAgICAgIGNvbnN0IHRpdGxlRWwgPSB0aGlzLm5vdGlmaWNhdGlvbkVsLnF1ZXJ5U2VsZWN0b3IoJy5tZXNzYWdlIHAnKVxuICAgICAgaWYgKHRpdGxlRWwpIHtcbiAgICAgICAgdGl0bGVFbC50ZXh0Q29udGVudCA9IGBJbnN0YWxsZWQgJHt0aGlzLnBhY2thZ2VOYW1lfSBkZXBlbmRlbmNpZXNgXG4gICAgICB9XG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbkNvbnRlbnRFbC50ZXh0Q29udGVudCA9ICdJbnN0YWxsZWQgJyArIHRoaXMucGFja2FnZU5hbWVzLmpvaW4oJywgJylcbiAgICAgIHRoaXMubm90aWZpY2F0aW9uRWwuY2xhc3NMaXN0LnJlbW92ZSgnaW5mbycpXG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbkVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24taW5mbycpXG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbkVsLmNsYXNzTGlzdC5hZGQoJ3N1Y2Nlc3MnKVxuICAgICAgdGhpcy5ub3RpZmljYXRpb25FbC5jbGFzc0xpc3QuYWRkKCdpY29uLWNoZWNrJylcbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/linter-jscs/node_modules/atom-package-deps/lib/view.js
