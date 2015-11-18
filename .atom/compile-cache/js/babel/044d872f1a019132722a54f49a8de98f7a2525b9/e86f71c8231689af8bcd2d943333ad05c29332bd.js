Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _astAstProviderJs = require('../ast/AstProvider.js');

'use babel';

var finder = require('findit');
var nodePath = require('path');
var _ = require('lodash');

var ExportIndex = (function () {
  function ExportIndex() {
    _classCallCheck(this, ExportIndex);

    this.activeObserveChange = null;
    this.index = [];
  }

  _createClass(ExportIndex, [{
    key: 'observeChanges',
    value: function observeChanges(editor) {
      var _this = this;

      this.disposeIfNecessary();
      this.activeObserveChange = editor.onDidSave(function (ev) {
        var fileName = ev.path;

        (0, _astAstProviderJs.getExportsForFiles)([fileName]).then(function (indexIncrement) {
          _this.index = _.filter(_this.index, function (record) {
            return record.file !== fileName;
          });
          _this.index = _this.index.concat(indexIncrement);
        });
      });
    }
  }, {
    key: 'disposeIfNecessary',
    value: function disposeIfNecessary() {
      if (this.activeObserveChange) {
        this.activeObserveChange.dispose();
      }
    }
  }, {
    key: 'getIndex',
    value: function getIndex() {
      return this.index;
    }
  }, {
    key: 'buildIndex',
    value: function buildIndex() {
      var _this2 = this;

      var startTime = new Date().getTime();
      var files = [];

      atom.project.getPaths().forEach(function (path) {
        finder(path).on('directory', function (dir, stat, stop) {
          var base = nodePath.basename(dir);
          if (path !== dir && _.contains(atom.config.get('js-autoimport.ignoredFolders'), base)) {
            stop();
          }
        }).on('file', function (file) {
          var extname = nodePath.extname(file);
          if (_.contains(atom.config.get('js-autoimport.allowedSuffixes'), extname)) {
            files.push(file);
          }
        }).on('end', function () {
          console.debug('Traversed ' + files.length + ' files in ' + (new Date().getTime() - startTime) + 'ms', files);

          var startIndexTime = new Date().getTime();
          (0, _astAstProviderJs.getExportsForFiles)(files).then(function (index) {
            _this2.index = index;
            console.debug('Index has been obtained in ' + (new Date().getTime() - startIndexTime) + 'ms');
          });
        });
      });
    }
  }]);

  return ExportIndex;
})();

exports['default'] = ExportIndex;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvanMtYXV0b2ltcG9ydC9saWIvZXhwb3J0aW5kZXgvRXhwb3J0SW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O2dDQUNQLHVCQUF1Qjs7QUFIMUQsV0FBVyxDQUFDOztBQUtaLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakMsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztJQUVQLFdBQVc7QUFFbkIsV0FGUSxXQUFXLEdBRWhCOzBCQUZLLFdBQVc7O0FBRzVCLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFDaEMsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7R0FDakI7O2VBTGtCLFdBQVc7O1dBT2hCLHdCQUFDLE1BQU0sRUFBRTs7O0FBQ3JCLFVBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQzFCLFVBQUksQ0FBQyxtQkFBbUIsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUMsRUFBRSxFQUFLO0FBQ2xELFlBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7O0FBRXpCLGtEQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQzNCLElBQUksQ0FBQyxVQUFDLGNBQWMsRUFBSztBQUN4QixnQkFBSyxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFLLEtBQUssRUFBRSxVQUFDLE1BQU07bUJBQUssTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRO1dBQUEsQ0FBQyxDQUFDO0FBQ3hFLGdCQUFLLEtBQUssR0FBRyxNQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDaEQsQ0FBQyxDQUFDO09BQ04sQ0FBQyxDQUFDO0tBQ0o7OztXQUVpQiw4QkFBRztBQUNuQixVQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUM1QixZQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDcEM7S0FDRjs7O1dBRU8sb0JBQUc7QUFDVCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbkI7OztXQUVTLHNCQUFHOzs7QUFDWCxVQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3ZDLFVBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFakIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDeEMsY0FBTSxDQUFDLElBQUksQ0FBQyxDQUNULEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBSztBQUNwQyxjQUFNLElBQUksR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLGNBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7QUFDckYsZ0JBQUksRUFBRSxDQUFDO1dBQ1I7U0FDRixDQUFDLENBQ0QsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUksRUFBSztBQUNwQixjQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLGNBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFFO0FBQ3pFLGlCQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1dBQ2xCO1NBQ0YsQ0FBQyxDQUNELEVBQUUsQ0FBQyxLQUFLLEVBQUUsWUFBTTtBQUNmLGlCQUFPLENBQUMsS0FBSyxnQkFBYyxLQUFLLENBQUMsTUFBTSxtQkFBYSxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLFNBQVMsQ0FBQSxTQUFNLEtBQUssQ0FBQyxDQUFDOztBQUVqRyxjQUFNLGNBQWMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVDLG9EQUFtQixLQUFLLENBQUMsQ0FDdEIsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQ2YsbUJBQUssS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixtQkFBTyxDQUFDLEtBQUssa0NBQStCLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsY0FBYyxDQUFBLFFBQUssQ0FBQztXQUN4RixDQUFDLENBQUM7U0FDTixDQUFDLENBQUM7T0FDTixDQUFDLENBQUM7S0FDSjs7O1NBM0RrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2pzLWF1dG9pbXBvcnQvbGliL2V4cG9ydGluZGV4L0V4cG9ydEluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IEJ1ZmZlcmVkTm9kZVByb2Nlc3MgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgZ2V0RXhwb3J0c0ZvckZpbGVzIH0gZnJvbSAnLi4vYXN0L0FzdFByb3ZpZGVyLmpzJ1xuXG5jb25zdCBmaW5kZXIgPSByZXF1aXJlKCdmaW5kaXQnKTtcbmNvbnN0IG5vZGVQYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBvcnRJbmRleCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RpdmVPYnNlcnZlQ2hhbmdlID0gbnVsbDtcbiAgICB0aGlzLmluZGV4ID0gW107XG4gIH1cblxuICBvYnNlcnZlQ2hhbmdlcyhlZGl0b3IpIHtcbiAgICB0aGlzLmRpc3Bvc2VJZk5lY2Vzc2FyeSgpO1xuICAgIHRoaXMuYWN0aXZlT2JzZXJ2ZUNoYW5nZSA9IGVkaXRvci5vbkRpZFNhdmUoKGV2KSA9PiB7XG4gICAgICBjb25zdCBmaWxlTmFtZSA9IGV2LnBhdGg7XG5cbiAgICAgIGdldEV4cG9ydHNGb3JGaWxlcyhbZmlsZU5hbWVdKVxuICAgICAgICAudGhlbigoaW5kZXhJbmNyZW1lbnQpID0+IHtcbiAgICAgICAgICB0aGlzLmluZGV4ID0gXy5maWx0ZXIodGhpcy5pbmRleCwgKHJlY29yZCkgPT4gcmVjb3JkLmZpbGUgIT09IGZpbGVOYW1lKTtcbiAgICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5pbmRleC5jb25jYXQoaW5kZXhJbmNyZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRpc3Bvc2VJZk5lY2Vzc2FyeSgpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVPYnNlcnZlQ2hhbmdlKSB7XG4gICAgICB0aGlzLmFjdGl2ZU9ic2VydmVDaGFuZ2UuZGlzcG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldEluZGV4KCkge1xuICAgIHJldHVybiB0aGlzLmluZGV4O1xuICB9XG5cbiAgYnVpbGRJbmRleCgpIHtcbiAgICBjb25zdCBzdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBjb25zdCBmaWxlcyA9IFtdO1xuXG4gICAgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkuZm9yRWFjaCgocGF0aCkgPT4ge1xuICAgICAgZmluZGVyKHBhdGgpXG4gICAgICAgIC5vbignZGlyZWN0b3J5JywgKGRpciwgc3RhdCwgc3RvcCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJhc2UgPSBub2RlUGF0aC5iYXNlbmFtZShkaXIpO1xuICAgICAgICAgIGlmIChwYXRoICE9PSBkaXIgJiYgXy5jb250YWlucyhhdG9tLmNvbmZpZy5nZXQoJ2pzLWF1dG9pbXBvcnQuaWdub3JlZEZvbGRlcnMnKSwgYmFzZSkpIHtcbiAgICAgICAgICAgIHN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignZmlsZScsIChmaWxlKSA9PiB7XG4gICAgICAgICAgY29uc3QgZXh0bmFtZSA9IG5vZGVQYXRoLmV4dG5hbWUoZmlsZSk7XG4gICAgICAgICAgaWYgKF8uY29udGFpbnMoYXRvbS5jb25maWcuZ2V0KCdqcy1hdXRvaW1wb3J0LmFsbG93ZWRTdWZmaXhlcycpLCBleHRuYW1lKSkge1xuICAgICAgICAgICAgZmlsZXMucHVzaChmaWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoYFRyYXZlcnNlZCAke2ZpbGVzLmxlbmd0aH0gZmlsZXMgaW4gJHtuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZX1tc2AsIGZpbGVzKTtcblxuICAgICAgICAgIGNvbnN0IHN0YXJ0SW5kZXhUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgZ2V0RXhwb3J0c0ZvckZpbGVzKGZpbGVzKVxuICAgICAgICAgICAgLnRoZW4oKGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgSW5kZXggaGFzIGJlZW4gb2J0YWluZWQgaW4gJHtuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0SW5kZXhUaW1lfW1zYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/js-autoimport/lib/exportindex/ExportIndex.js
