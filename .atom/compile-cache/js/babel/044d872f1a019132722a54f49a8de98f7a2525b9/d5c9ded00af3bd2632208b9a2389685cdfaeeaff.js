Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _eventKit = require('event-kit');

var _models = require('./models');

var _utils = require('./utils');

var AdvancedOpenFileView = (function () {
    function AdvancedOpenFileView() {
        var _this = this;

        _classCallCheck(this, AdvancedOpenFileView);

        this.emitter = new _eventKit.Emitter();
        this.cursorIndex = null;
        this._updatingPath = false;

        // Element references
        this.pathInput = this.content.querySelector('.path-input');
        this.pathList = this.content.querySelector('.list-group');
        this.parentDirectoryListItem = this.content.querySelector('.parent-directory');

        // Initialize text editor
        this.pathEditor = this.pathInput.getModel();
        this.pathEditor.setPlaceholderText('/path/to/file.txt');
        this.pathEditor.setSoftWrapped(false);

        this.content.addEventListener('click', function (ev) {
            // Keep focus on the text input and do not propagate so that the
            // outside click handler doesn't pick up the event.
            ev.stopPropagation();
            _this.pathInput.focus();
        });
        this.content.addEventListener('click', function (ev) {
            var _context;

            var listItem = (_context = ev.target, _utils.closest).call(_context, '.list-item');
            if (listItem !== null) {
                _this.emitter.emit('did-click-file', listItem.dataset.fileName);
            }
        });
        this.content.addEventListener('click', function (ev) {
            var _context2;

            if ((_context2 = ev.target, _utils.closest).call(_context2, '.add-project-folder') !== null) {
                var _context3;

                var listItem = (_context3 = ev.target, _utils.closest).call(_context3, '.list-item');
                _this.emitter.emit('did-click-add-project-folder', listItem.dataset.fileName);
            }
        });
    }

    _createDecoratedClass(AdvancedOpenFileView, [{
        key: 'createPathListItem',
        value: function createPathListItem(path) {
            var icon = path.isDirectory() ? 'icon-file-directory' : 'icon-file-text';
            return '\n            <li class="list-item ' + (path.isDirectory() ? 'directory' : '') + '"\n                data-file-name="' + path.full + '">\n                <span class="filename icon ' + icon + '"\n                      data-name="' + path.fragment + '">\n                    ' + path.fragment + '\n                </span>\n                ' + (path.isDirectory() && !path.isProjectDirectory() ? this.addProjectButton() : '') + '\n            </li>\n        ';
        }
    }, {
        key: 'addProjectButton',
        value: function addProjectButton() {
            return '\n            <span class="add-project-folder icon icon-plus"\n                title="Open as project folder">\n            </span>\n        ';
        }
    }, {
        key: 'createModalPanel',
        value: function createModalPanel() {
            var _this2 = this;

            var panel = atom.workspace.addModalPanel({
                item: this.content
            });

            // Bind the outside click handler and destroy it when the panel is
            // destroyed.
            var outsideClickHandler = function outsideClickHandler(ev) {
                var _context4;

                if ((_context4 = ev.target, _utils.closest).call(_context4, '.advanced-open-file') === null) {
                    _this2.emitter.emit('did-click-outside');
                }
            };

            document.documentElement.addEventListener('click', outsideClickHandler);
            panel.onDidDestroy(function () {
                document.documentElement.removeEventListener('click', outsideClickHandler);
            });

            var modal = this.content.parentNode;
            modal.style.maxHeight = '100%';
            modal.style.display = 'flex';
            modal.style.flexDirection = 'column';

            this.pathInput.focus();

            return panel;
        }
    }, {
        key: 'onDidClickFile',
        value: function onDidClickFile(callback) {
            this.emitter.on('did-click-file', callback);
        }
    }, {
        key: 'onDidClickAddProjectFolder',
        value: function onDidClickAddProjectFolder(callback) {
            this.emitter.on('did-click-add-project-folder', callback);
        }
    }, {
        key: 'onDidClickOutside',
        value: function onDidClickOutside(callback) {
            this.emitter.on('did-click-outside', callback);
        }

        /**
         * Subscribe to user-initiated changes in the path.
         */
    }, {
        key: 'onDidPathChange',
        value: function onDidPathChange(callback) {
            var _this3 = this;

            this.pathEditor.onDidChange(function () {
                if (!_this3._updatingPath) {
                    callback(new _models.Path(_this3.pathEditor.getText()));
                }
            });
        }
    }, {
        key: 'selectedPath',
        value: function selectedPath() {
            if (this.cursorIndex !== null) {
                var selected = this.pathList.querySelector('.list-item.selected');
                if (selected !== null) {
                    return new _models.Path(selected.dataset.fileName);
                }
            }

            return null;
        }
    }, {
        key: 'firstPath',
        value: function firstPath() {
            var pathItems = this.pathList.querySelectorAll('.list-item:not(.parent-directory)');
            if (pathItems.length > 0) {
                return new _models.Path(pathItems[0].dataset.fileName);
            } else {
                return null;
            }
        }
    }, {
        key: 'pathListLength',
        value: function pathListLength() {
            return this.pathList.querySelectorAll('.list-item:not(.hidden)').length;
        }
    }, {
        key: 'setPath',
        value: function setPath(path) {
            this._updatingPath = true;

            this.pathEditor.setText(path.full);
            this.pathEditor.scrollToCursorPosition();

            this.parentDirectoryListItem.dataset.fileName = path.parent().full;

            this._updatingPath = false;
        }
    }, {
        key: 'forEachListItem',
        value: function forEachListItem(selector, callback) {
            Array.from(this.pathList.querySelectorAll(selector)).forEach(callback);
        }
    }, {
        key: 'setPathList',
        value: function setPathList(paths) {
            var hideParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            this.cursorIndex = null;

            this.forEachListItem('.list-item.selected', function (listItem) {
                listItem.classList.remove('selected');
            });

            this.forEachListItem('.list-item:not(.parent-directory)', function (listItem) {
                listItem.remove();
            });

            if (paths.length === 0 || hideParent) {
                this.parentDirectoryListItem.classList.add('hidden');
            } else {
                this.parentDirectoryListItem.classList.remove('hidden');
            }

            if (paths.length > 0) {
                // Split list into directories and files and sort them.
                paths = paths.sort(_models.Path.compare);
                var directoryPaths = paths.filter(function (path) {
                    return path.isDirectory();
                });
                var filePaths = paths.filter(function (path) {
                    return path.isFile();
                });

                for (path of directoryPaths) {
                    if (path.exists()) {
                        this.pathList.appendChild((0, _utils.dom)(this.createPathListItem(path)));
                    }
                }

                for (path of filePaths) {
                    if (path.exists()) {
                        this.pathList.appendChild((0, _utils.dom)(this.createPathListItem(path)));
                    }
                }
            }
        }
    }, {
        key: 'setCursorIndex',
        value: function setCursorIndex(index) {
            if (index < 0 || index >= this.pathListLength()) {
                index = null;
            }

            this.cursorIndex = index;
            this.forEachListItem('.list-item.selected', function (listItem) {
                listItem.classList.remove('selected');
            });

            if (this.cursorIndex !== null) {
                var listItems = this.pathList.querySelectorAll('.list-item:not(.hidden)');
                if (listItems.length > index) {
                    listItems[index].classList.add('selected');
                }
            }
        }
    }, {
        key: 'content',
        decorators: [_utils.cachedProperty],
        get: function get() {
            return (0, _utils.dom)('\n            <div class="advanced-open-file">\n                <p class="info-message icon icon-file-add">\n                    Enter the path for the file to open or create.\n                </p>\n                <atom-text-editor class="path-input" mini></atom-text-editor>\n                <ul class="list-group">\n                    <li class="list-item parent-directory">\n                        <span class="icon icon-file-directory">..</span>\n                    </li>\n                </ul>\n            </div>\n        ');
        }
    }]);

    return AdvancedOpenFileView;
})();

exports['default'] = AdvancedOpenFileView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7d0JBRXNCLFdBQVc7O3NCQUVkLFVBQVU7O3FCQUNjLFNBQVM7O0lBRy9CLG9CQUFvQjtBQUMxQixhQURNLG9CQUFvQixHQUN2Qjs7OzhCQURHLG9CQUFvQjs7QUFFakMsWUFBSSxDQUFDLE9BQU8sR0FBRyx1QkFBYSxDQUFDO0FBQzdCLFlBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDOzs7QUFHM0IsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzRCxZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFELFlBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzs7QUFHL0UsWUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzVDLFlBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFdEMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxFQUFFLEVBQUs7OztBQUczQyxjQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDckIsa0JBQUssU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQzFCLENBQUMsQ0FBQztBQUNILFlBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FB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RCx3QkFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDekMsQ0FBQyxDQUFDOztBQUVILGdCQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFFO0FBQzNCLG9CQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDMUUsb0JBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxLQUFLLEVBQUU7QUFDMUIsNkJBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUM5QzthQUNKO1NBQ0o7Ozs7YUF2TFUsZUFBRztBQUNWLG1CQUFPLHVpQkFZTCxDQUFDO1NBQ047OztXQW5EZ0Isb0JBQW9COzs7cUJBQXBCLG9CQUFvQiIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2FkdmFuY2VkLW9wZW4tZmlsZS9saWIvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge1BhdGh9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7Y2FjaGVkUHJvcGVydHksIGNsb3Nlc3QsIGRvbX0gZnJvbSAnLi91dGlscyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWR2YW5jZWRPcGVuRmlsZVZpZXcge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgICAgICB0aGlzLmN1cnNvckluZGV4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdXBkYXRpbmdQYXRoID0gZmFsc2U7XG5cbiAgICAgICAgLy8gRWxlbWVudCByZWZlcmVuY2VzXG4gICAgICAgIHRoaXMucGF0aElucHV0ID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYXRoLWlucHV0Jyk7XG4gICAgICAgIHRoaXMucGF0aExpc3QgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignLmxpc3QtZ3JvdXAnKTtcbiAgICAgICAgdGhpcy5wYXJlbnREaXJlY3RvcnlMaXN0SXRlbSA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcucGFyZW50LWRpcmVjdG9yeScpO1xuXG4gICAgICAgIC8vIEluaXRpYWxpemUgdGV4dCBlZGl0b3JcbiAgICAgICAgdGhpcy5wYXRoRWRpdG9yID0gdGhpcy5wYXRoSW5wdXQuZ2V0TW9kZWwoKTtcbiAgICAgICAgdGhpcy5wYXRoRWRpdG9yLnNldFBsYWNlaG9sZGVyVGV4dCgnL3BhdGgvdG8vZmlsZS50eHQnKTtcbiAgICAgICAgdGhpcy5wYXRoRWRpdG9yLnNldFNvZnRXcmFwcGVkKGZhbHNlKTtcblxuICAgICAgICB0aGlzLmNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHtcbiAgICAgICAgICAgIC8vIEtlZXAgZm9jdXMgb24gdGhlIHRleHQgaW5wdXQgYW5kIGRvIG5vdCBwcm9wYWdhdGUgc28gdGhhdCB0aGVcbiAgICAgICAgICAgIC8vIG91dHNpZGUgY2xpY2sgaGFuZGxlciBkb2Vzbid0IHBpY2sgdXAgdGhlIGV2ZW50LlxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnBhdGhJbnB1dC5mb2N1cygpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7XG4gICAgICAgICAgICBsZXQgbGlzdEl0ZW0gPSBldi50YXJnZXQ6OmNsb3Nlc3QoJy5saXN0LWl0ZW0nKTtcbiAgICAgICAgICAgIGlmIChsaXN0SXRlbSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2xpY2stZmlsZScsIGxpc3RJdGVtLmRhdGFzZXQuZmlsZU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0OjpjbG9zZXN0KCcuYWRkLXByb2plY3QtZm9sZGVyJykgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGlzdEl0ZW0gPSBldi50YXJnZXQ6OmNsb3Nlc3QoJy5saXN0LWl0ZW0nKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNsaWNrLWFkZC1wcm9qZWN0LWZvbGRlcicsIGxpc3RJdGVtLmRhdGFzZXQuZmlsZU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBAY2FjaGVkUHJvcGVydHlcbiAgICBnZXQgY29udGVudCgpIHtcbiAgICAgICAgcmV0dXJuIGRvbShgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWR2YW5jZWQtb3Blbi1maWxlXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJpbmZvLW1lc3NhZ2UgaWNvbiBpY29uLWZpbGUtYWRkXCI+XG4gICAgICAgICAgICAgICAgICAgIEVudGVyIHRoZSBwYXRoIGZvciB0aGUgZmlsZSB0byBvcGVuIG9yIGNyZWF0ZS5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGF0b20tdGV4dC1lZGl0b3IgY2xhc3M9XCJwYXRoLWlucHV0XCIgbWluaT48L2F0b20tdGV4dC1lZGl0b3I+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWl0ZW0gcGFyZW50LWRpcmVjdG9yeVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uIGljb24tZmlsZS1kaXJlY3RvcnlcIj4uLjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIGApO1xuICAgIH1cblxuICAgIGNyZWF0ZVBhdGhMaXN0SXRlbShwYXRoKSB7XG4gICAgICAgIGxldCBpY29uID0gcGF0aC5pc0RpcmVjdG9yeSgpID8gJ2ljb24tZmlsZS1kaXJlY3RvcnknIDogJ2ljb24tZmlsZS10ZXh0JztcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbSAke3BhdGguaXNEaXJlY3RvcnkoKSA/ICdkaXJlY3RvcnknIDogJyd9XCJcbiAgICAgICAgICAgICAgICBkYXRhLWZpbGUtbmFtZT1cIiR7cGF0aC5mdWxsfVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmlsZW5hbWUgaWNvbiAke2ljb259XCJcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhLW5hbWU9XCIke3BhdGguZnJhZ21lbnR9XCI+XG4gICAgICAgICAgICAgICAgICAgICR7cGF0aC5mcmFnbWVudH1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgJHtwYXRoLmlzRGlyZWN0b3J5KCkgJiYgIXBhdGguaXNQcm9qZWN0RGlyZWN0b3J5KClcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLmFkZFByb2plY3RCdXR0b24oKVxuICAgICAgICAgICAgICAgICAgICA6ICcnfVxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgYDtcbiAgICB9XG5cbiAgICBhZGRQcm9qZWN0QnV0dG9uKCkge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhZGQtcHJvamVjdC1mb2xkZXIgaWNvbiBpY29uLXBsdXNcIlxuICAgICAgICAgICAgICAgIHRpdGxlPVwiT3BlbiBhcyBwcm9qZWN0IGZvbGRlclwiPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIGNyZWF0ZU1vZGFsUGFuZWwoKSB7XG4gICAgICAgIGxldCBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgICAgICAgaXRlbTogdGhpcy5jb250ZW50LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBCaW5kIHRoZSBvdXRzaWRlIGNsaWNrIGhhbmRsZXIgYW5kIGRlc3Ryb3kgaXQgd2hlbiB0aGUgcGFuZWwgaXNcbiAgICAgICAgLy8gZGVzdHJveWVkLlxuICAgICAgICBsZXQgb3V0c2lkZUNsaWNrSGFuZGxlciA9IChldikgPT4ge1xuICAgICAgICAgICAgaWYgKGV2LnRhcmdldDo6Y2xvc2VzdCgnLmFkdmFuY2VkLW9wZW4tZmlsZScpID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jbGljay1vdXRzaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsaWNrSGFuZGxlcik7XG4gICAgICAgIHBhbmVsLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xpY2tIYW5kbGVyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IG1vZGFsID0gdGhpcy5jb250ZW50LnBhcmVudE5vZGU7XG4gICAgICAgIG1vZGFsLnN0eWxlLm1heEhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICAgICAgbW9kYWwuc3R5bGUuZmxleERpcmVjdGlvbiA9ICdjb2x1bW4nO1xuXG4gICAgICAgIHRoaXMucGF0aElucHV0LmZvY3VzKCk7XG5cbiAgICAgICAgcmV0dXJuIHBhbmVsO1xuICAgIH1cblxuICAgIG9uRGlkQ2xpY2tGaWxlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5vbignZGlkLWNsaWNrLWZpbGUnLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgb25EaWRDbGlja0FkZFByb2plY3RGb2xkZXIoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2xpY2stYWRkLXByb2plY3QtZm9sZGVyJywgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIG9uRGlkQ2xpY2tPdXRzaWRlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5vbignZGlkLWNsaWNrLW91dHNpZGUnLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIHRvIHVzZXItaW5pdGlhdGVkIGNoYW5nZXMgaW4gdGhlIHBhdGguXG4gICAgICovXG4gICAgb25EaWRQYXRoQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMucGF0aEVkaXRvci5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3VwZGF0aW5nUGF0aCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBQYXRoKHRoaXMucGF0aEVkaXRvci5nZXRUZXh0KCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VsZWN0ZWRQYXRoKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJzb3JJbmRleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5wYXRoTGlzdC5xdWVyeVNlbGVjdG9yKCcubGlzdC1pdGVtLnNlbGVjdGVkJyk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFBhdGgoc2VsZWN0ZWQuZGF0YXNldC5maWxlTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmaXJzdFBhdGgoKSB7XG4gICAgICAgIGxldCBwYXRoSXRlbXMgPSB0aGlzLnBhdGhMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LWl0ZW06bm90KC5wYXJlbnQtZGlyZWN0b3J5KScpO1xuICAgICAgICBpZiAocGF0aEl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGF0aChwYXRoSXRlbXNbMF0uZGF0YXNldC5maWxlTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhdGhMaXN0TGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXRoTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1pdGVtOm5vdCguaGlkZGVuKScpLmxlbmd0aDtcbiAgICB9XG5cbiAgICBzZXRQYXRoKHBhdGgpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRpbmdQYXRoID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnBhdGhFZGl0b3Iuc2V0VGV4dChwYXRoLmZ1bGwpO1xuICAgICAgICB0aGlzLnBhdGhFZGl0b3Iuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpO1xuXG4gICAgICAgIHRoaXMucGFyZW50RGlyZWN0b3J5TGlzdEl0ZW0uZGF0YXNldC5maWxlTmFtZSA9IHBhdGgucGFyZW50KCkuZnVsbDtcblxuICAgICAgICB0aGlzLl91cGRhdGluZ1BhdGggPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3JFYWNoTGlzdEl0ZW0oc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIEFycmF5LmZyb20odGhpcy5wYXRoTGlzdC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSkuZm9yRWFjaChjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgc2V0UGF0aExpc3QocGF0aHMsIGhpZGVQYXJlbnQ9ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5jdXJzb3JJbmRleCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoTGlzdEl0ZW0oJy5saXN0LWl0ZW0uc2VsZWN0ZWQnLCAobGlzdEl0ZW0pID0+IHtcbiAgICAgICAgICAgIGxpc3RJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaExpc3RJdGVtKCcubGlzdC1pdGVtOm5vdCgucGFyZW50LWRpcmVjdG9yeSknLCAobGlzdEl0ZW0pID0+IHtcbiAgICAgICAgICAgIGxpc3RJdGVtLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwIHx8IGhpZGVQYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50RGlyZWN0b3J5TGlzdEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudERpcmVjdG9yeUxpc3RJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFNwbGl0IGxpc3QgaW50byBkaXJlY3RvcmllcyBhbmQgZmlsZXMgYW5kIHNvcnQgdGhlbS5cbiAgICAgICAgICAgIHBhdGhzID0gcGF0aHMuc29ydChQYXRoLmNvbXBhcmUpO1xuICAgICAgICAgICAgbGV0IGRpcmVjdG9yeVBhdGhzID0gcGF0aHMuZmlsdGVyKChwYXRoKSA9PiBwYXRoLmlzRGlyZWN0b3J5KCkpO1xuICAgICAgICAgICAgbGV0IGZpbGVQYXRocyA9IHBhdGhzLmZpbHRlcigocGF0aCkgPT4gcGF0aC5pc0ZpbGUoKSk7XG5cbiAgICAgICAgICAgIGZvciAocGF0aCBvZiBkaXJlY3RvcnlQYXRocykge1xuICAgICAgICAgICAgICAgIGlmIChwYXRoLmV4aXN0cygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aExpc3QuYXBwZW5kQ2hpbGQoZG9tKHRoaXMuY3JlYXRlUGF0aExpc3RJdGVtKHBhdGgpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHBhdGggb2YgZmlsZVBhdGhzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhdGguZXhpc3RzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoTGlzdC5hcHBlbmRDaGlsZChkb20odGhpcy5jcmVhdGVQYXRoTGlzdEl0ZW0ocGF0aCkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JJbmRleChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucGF0aExpc3RMZW5ndGgoKSkge1xuICAgICAgICAgICAgaW5kZXggPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJzb3JJbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLmZvckVhY2hMaXN0SXRlbSgnLmxpc3QtaXRlbS5zZWxlY3RlZCcsIChsaXN0SXRlbSkgPT4ge1xuICAgICAgICAgICAgbGlzdEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuY3Vyc29ySW5kZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBsaXN0SXRlbXMgPSB0aGlzLnBhdGhMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LWl0ZW06bm90KC5oaWRkZW4pJyk7XG4gICAgICAgICAgICBpZiAobGlzdEl0ZW1zLmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbGlzdEl0ZW1zW2luZGV4XS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIl19
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/lib/view.js
