Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _astAstProviderJs = require('../ast/AstProvider.js');

'use babel';

var _ = require('lodash');
var path = require('path');

var FILE_SUFFIX_REGEXP = /\.[^/.]+$/;

var ImportRepository = (function () {
  function ImportRepository(importOrganiser) {
    _classCallCheck(this, ImportRepository);

    this.changeCb = function () {};
    this.activeObserveChange = null;
    this.importOrganiser = importOrganiser;
    this.imports = null;
    this.suggested = false;
  }

  _createClass(ImportRepository, [{
    key: 'observeChanges',
    value: function observeChanges(editor) {
      var _this = this;

      // We can observe just one editor instance at time
      this.disposeIfNecessary();

      // There is a need for versioning of the textbuffer
      // so that the only last change is not being ignored
      this.version = 0;

      this.activeObserveChange = editor.getBuffer().onDidStopChanging(function (ev) {
        _this.version++;

        // We don't wanna observe change in buffer if the change is caused by Organiser
        if (!_this.importOrganiser.isOrganising()) {
          (0, _astAstProviderJs.getImportsForEntireFileContent)(editor.getBuffer().getText(), _this.version).then(function (data) {
            if (_this.version === data.version) {
              if (!_this.suggested) {
                if (_this.imports === null) {
                  _this.imports = data.imports;
                } else {
                  if (!_.eq(_this.imports, data.imports)) {
                    _this.imports = data.imports;
                    _this.changeCb(_this.imports);
                  }
                }
              } else {
                _this.suggested = false;
              }
            }
          });
        } else {
          _this.suggested = false;
        }
      });
    }

    // TODO: this is not ideal as one might compare
    // file.react.js vs file.react
  }, {
    key: 'getFileNameWithoutExtension',
    value: function getFileNameWithoutExtension(fileName) {
      if (fileName.indexOf('.') !== -1) {
        return fileName.replace(FILE_SUFFIX_REGEXP, '');
      } else {
        return fileName;
      }
    }
  }, {
    key: 'getFileInFolder',
    value: function getFileInFolder(file) {
      // file is not starting with ../something or ./something
      // so it's most likely something.js
      if (file[0] !== '.') {
        return './' + file;
      } else {
        return file;
      }
    }
  }, {
    key: 'pushSuggestedImport',
    value: function pushSuggestedImport(suggestedImport, currentlyEditedFilePath) {
      var _this2 = this;

      var suggestedImportFile = path.relative(path.dirname(currentlyEditedFilePath), suggestedImport.file);

      // we don't want to import anything from currently opened file
      if (suggestedImportFile !== path.basename(currentlyEditedFilePath)) {
        (function () {
          var suggestedFileInFolder = _this2.getFileInFolder(suggestedImportFile);
          var existingImportFileIndex = _.findIndex(_this2.imports, function (singleImport) {
            return _this2.getFileNameWithoutExtension(singleImport.file) === _this2.getFileNameWithoutExtension(suggestedFileInFolder);
          });

          if (existingImportFileIndex !== -1) {
            if (!_.contains(_.pluck(_this2.imports[existingImportFileIndex].specifiers, 'textImported'), suggestedImport.text)) {
              _this2.imports[existingImportFileIndex].specifiers.push({
                textLocal: suggestedImport.text,
                textImported: suggestedImport.text,
                def: suggestedImport.def
              });
              _this2.changeCb(_this2.imports);
              _this2.suggested = true;
            }
          } else {
            _this2.imports.push({
              file: suggestedFileInFolder,
              def: suggestedImport.def,
              specifiers: [{
                textLocal: suggestedImport.text,
                textImported: suggestedImport.text,
                def: suggestedImport.def
              }]
            });
            _this2.changeCb(_this2.imports);
            _this2.suggested = true;
          }
        })();
      }
    }
  }, {
    key: 'registerChange',
    value: function registerChange(cb) {
      this.changeCb = cb;
    }
  }, {
    key: 'disposeIfNecessary',
    value: function disposeIfNecessary() {
      if (this.activeObserveChange) {
        this.activeObserveChange.dispose();
      }
    }
  }]);

  return ImportRepository;
})();

exports['default'] = ImportRepository;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvanMtYXV0b2ltcG9ydC9saWIvaW1wb3J0cy9JbXBvcnRSZXBvc2l0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2dDQUUrQyx1QkFBdUI7O0FBRnRFLFdBQVcsQ0FBQzs7QUFJWixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU3QixJQUFNLGtCQUFrQixHQUFHLFdBQVcsQ0FBQzs7SUFFbEIsZ0JBQWdCO0FBRXhCLFdBRlEsZ0JBQWdCLENBRXZCLGVBQWUsRUFBRTswQkFGVixnQkFBZ0I7O0FBR2pDLFFBQUksQ0FBQyxRQUFRLEdBQUcsWUFBVyxFQUFFLENBQUM7QUFDOUIsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztBQUNoQyxRQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztBQUN2QyxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixRQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztHQUN4Qjs7ZUFSa0IsZ0JBQWdCOztXQVVyQix3QkFBQyxNQUFNLEVBQUU7Ozs7QUFFckIsVUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Ozs7QUFJMUIsVUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7O0FBRWpCLFVBQUksQ0FBQyxtQkFBbUIsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUMsVUFBQyxFQUFFLEVBQUs7QUFDdEUsY0FBSyxPQUFPLEVBQUUsQ0FBQzs7O0FBR2YsWUFBSSxDQUFDLE1BQUssZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFO0FBQ3hDLGdFQUErQixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBSyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFB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Q0FBQztBQUNYLHlCQUFTLEVBQUUsZUFBZSxDQUFDLElBQUk7QUFDL0IsNEJBQVksRUFBRSxlQUFlLENBQUMsSUFBSTtBQUNsQyxtQkFBRyxFQUFFLGVBQWUsQ0FBQyxHQUFHO2VBQ3pCLENBQUM7YUFDSCxDQUFDLENBQUM7QUFDSCxtQkFBSyxRQUFRLENBQUMsT0FBSyxPQUFPLENBQUMsQ0FBQztBQUM1QixtQkFBSyxTQUFTLEdBQUcsSUFBSSxDQUFDO1dBQ3ZCOztPQUNGO0tBQ0Y7OztXQUVhLHdCQUFDLEVBQUUsRUFBRTtBQUNqQixVQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7O1dBRWlCLDhCQUFHO0FBQ25CLFVBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO0FBQzVCLFlBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUNwQztLQUNGOzs7U0E5R2tCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9qcy1hdXRvaW1wb3J0L2xpYi9pbXBvcnRzL0ltcG9ydFJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgZ2V0SW1wb3J0c0ZvckVudGlyZUZpbGVDb250ZW50IH0gZnJvbSAnLi4vYXN0L0FzdFByb3ZpZGVyLmpzJ1xuXG5jb25zdCBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5jb25zdCBGSUxFX1NVRkZJWF9SRUdFWFAgPSAvXFwuW14vLl0rJC87XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcG9ydFJlcG9zaXRvcnkge1xuXG4gIGNvbnN0cnVjdG9yKGltcG9ydE9yZ2FuaXNlcikge1xuICAgIHRoaXMuY2hhbmdlQ2IgPSBmdW5jdGlvbigpIHt9O1xuICAgIHRoaXMuYWN0aXZlT2JzZXJ2ZUNoYW5nZSA9IG51bGw7XG4gICAgdGhpcy5pbXBvcnRPcmdhbmlzZXIgPSBpbXBvcnRPcmdhbmlzZXI7XG4gICAgdGhpcy5pbXBvcnRzID0gbnVsbDtcbiAgICB0aGlzLnN1Z2dlc3RlZCA9IGZhbHNlO1xuICB9XG5cbiAgb2JzZXJ2ZUNoYW5nZXMoZWRpdG9yKSB7XG4gICAgLy8gV2UgY2FuIG9ic2VydmUganVzdCBvbmUgZWRpdG9yIGluc3RhbmNlIGF0IHRpbWVcbiAgICB0aGlzLmRpc3Bvc2VJZk5lY2Vzc2FyeSgpO1xuXG4gICAgLy8gVGhlcmUgaXMgYSBuZWVkIGZvciB2ZXJzaW9uaW5nIG9mIHRoZSB0ZXh0YnVmZmVyXG4gICAgLy8gc28gdGhhdCB0aGUgb25seSBsYXN0IGNoYW5nZSBpcyBub3QgYmVpbmcgaWdub3JlZFxuICAgIHRoaXMudmVyc2lvbiA9IDA7XG5cbiAgICB0aGlzLmFjdGl2ZU9ic2VydmVDaGFuZ2UgPSBlZGl0b3IuZ2V0QnVmZmVyKCkub25EaWRTdG9wQ2hhbmdpbmcoKGV2KSA9PiB7XG4gICAgICB0aGlzLnZlcnNpb24rKztcblxuICAgICAgLy8gV2UgZG9uJ3Qgd2FubmEgb2JzZXJ2ZSBjaGFuZ2UgaW4gYnVmZmVyIGlmIHRoZSBjaGFuZ2UgaXMgY2F1c2VkIGJ5IE9yZ2FuaXNlclxuICAgICAgaWYgKCF0aGlzLmltcG9ydE9yZ2FuaXNlci5pc09yZ2FuaXNpbmcoKSkge1xuICAgICAgICBnZXRJbXBvcnRzRm9yRW50aXJlRmlsZUNvbnRlbnQoZWRpdG9yLmdldEJ1ZmZlcigpLmdldFRleHQoKSwgdGhpcy52ZXJzaW9uKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMudmVyc2lvbiA9PT0gZGF0YS52ZXJzaW9uKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VnZ2VzdGVkKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmltcG9ydHMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmltcG9ydHMgPSBkYXRhLmltcG9ydHM7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfLmVxKHRoaXMuaW1wb3J0cywgZGF0YS5pbXBvcnRzKSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5pbXBvcnRzID0gZGF0YS5pbXBvcnRzO1xuICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VDYih0aGlzLmltcG9ydHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdWdnZXN0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIFRPRE86IHRoaXMgaXMgbm90IGlkZWFsIGFzIG9uZSBtaWdodCBjb21wYXJlXG4gIC8vIGZpbGUucmVhY3QuanMgdnMgZmlsZS5yZWFjdFxuICBnZXRGaWxlTmFtZVdpdGhvdXRFeHRlbnNpb24oZmlsZU5hbWUpIHtcbiAgICBpZiAoZmlsZU5hbWUuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIGZpbGVOYW1lLnJlcGxhY2UoRklMRV9TVUZGSVhfUkVHRVhQLCAnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWxlTmFtZTtcbiAgICB9XG4gIH1cblxuICBnZXRGaWxlSW5Gb2xkZXIoZmlsZSkge1xuICAgIC8vIGZpbGUgaXMgbm90IHN0YXJ0aW5nIHdpdGggLi4vc29tZXRoaW5nIG9yIC4vc29tZXRoaW5nXG4gICAgLy8gc28gaXQncyBtb3N0IGxpa2VseSBzb21ldGhpbmcuanNcbiAgICBpZiAoZmlsZVswXSAhPT0gJy4nKSB7XG4gICAgICByZXR1cm4gJy4vJyArIGZpbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWxlO1xuICAgIH1cbiAgfVxuXG4gIHB1c2hTdWdnZXN0ZWRJbXBvcnQoc3VnZ2VzdGVkSW1wb3J0LCBjdXJyZW50bHlFZGl0ZWRGaWxlUGF0aCkge1xuICAgIGNvbnN0IHN1Z2dlc3RlZEltcG9ydEZpbGUgPSBwYXRoLnJlbGF0aXZlKHBhdGguZGlybmFtZShjdXJyZW50bHlFZGl0ZWRGaWxlUGF0aCksIHN1Z2dlc3RlZEltcG9ydC5maWxlKTtcblxuICAgIC8vIHdlIGRvbid0IHdhbnQgdG8gaW1wb3J0IGFueXRoaW5nIGZyb20gY3VycmVudGx5IG9wZW5lZCBmaWxlXG4gICAgaWYgKHN1Z2dlc3RlZEltcG9ydEZpbGUgIT09IHBhdGguYmFzZW5hbWUoY3VycmVudGx5RWRpdGVkRmlsZVBhdGgpKSAge1xuICAgICAgY29uc3Qgc3VnZ2VzdGVkRmlsZUluRm9sZGVyID0gdGhpcy5nZXRGaWxlSW5Gb2xkZXIoc3VnZ2VzdGVkSW1wb3J0RmlsZSk7XG4gICAgICBjb25zdCBleGlzdGluZ0ltcG9ydEZpbGVJbmRleCA9IF8uZmluZEluZGV4KHRoaXMuaW1wb3J0cywgKHNpbmdsZUltcG9ydCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRGaWxlTmFtZVdpdGhvdXRFeHRlbnNpb24oc2luZ2xlSW1wb3J0LmZpbGUpID09PVxuICAgICAgICAgICAgICAgdGhpcy5nZXRGaWxlTmFtZVdpdGhvdXRFeHRlbnNpb24oc3VnZ2VzdGVkRmlsZUluRm9sZGVyKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZXhpc3RpbmdJbXBvcnRGaWxlSW5kZXggIT09IC0xKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhfLnBsdWNrKHRoaXMuaW1wb3J0c1tleGlzdGluZ0ltcG9ydEZpbGVJbmRleF0uc3BlY2lmaWVycywgJ3RleHRJbXBvcnRlZCcpLCBzdWdnZXN0ZWRJbXBvcnQudGV4dCkpIHtcbiAgICAgICAgICB0aGlzLmltcG9ydHNbZXhpc3RpbmdJbXBvcnRGaWxlSW5kZXhdLnNwZWNpZmllcnMucHVzaCh7XG4gICAgICAgICAgICB0ZXh0TG9jYWw6IHN1Z2dlc3RlZEltcG9ydC50ZXh0LFxuICAgICAgICAgICAgdGV4dEltcG9ydGVkOiBzdWdnZXN0ZWRJbXBvcnQudGV4dCxcbiAgICAgICAgICAgIGRlZjogc3VnZ2VzdGVkSW1wb3J0LmRlZlxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuY2hhbmdlQ2IodGhpcy5pbXBvcnRzKTtcbiAgICAgICAgICB0aGlzLnN1Z2dlc3RlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaW1wb3J0cy5wdXNoKHtcbiAgICAgICAgICBmaWxlOiBzdWdnZXN0ZWRGaWxlSW5Gb2xkZXIsXG4gICAgICAgICAgZGVmOiBzdWdnZXN0ZWRJbXBvcnQuZGVmLFxuICAgICAgICAgIHNwZWNpZmllcnM6IFt7XG4gICAgICAgICAgICB0ZXh0TG9jYWw6IHN1Z2dlc3RlZEltcG9ydC50ZXh0LFxuICAgICAgICAgICAgdGV4dEltcG9ydGVkOiBzdWdnZXN0ZWRJbXBvcnQudGV4dCxcbiAgICAgICAgICAgIGRlZjogc3VnZ2VzdGVkSW1wb3J0LmRlZlxuICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNoYW5nZUNiKHRoaXMuaW1wb3J0cyk7XG4gICAgICAgIHRoaXMuc3VnZ2VzdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWdpc3RlckNoYW5nZShjYikge1xuICAgIHRoaXMuY2hhbmdlQ2IgPSBjYjtcbiAgfVxuXG4gIGRpc3Bvc2VJZk5lY2Vzc2FyeSgpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVPYnNlcnZlQ2hhbmdlKSB7XG4gICAgICB0aGlzLmFjdGl2ZU9ic2VydmVDaGFuZ2UuZGlzcG9zZSgpO1xuICAgIH1cbiAgfVxufVxuIl19
//# sourceURL=/Users/kswedberg/.atom/packages/js-autoimport/lib/imports/ImportRepository.js
