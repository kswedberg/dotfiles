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
            var listItems = this.pathList.querySelectorAll(selector);
            for (var k = 0; k < listItems.length; k++) {
                callback(listItems[k]);
            }
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
                    var selected = listItems[index];
                    selected.classList.add('selected');

                    // If the selected element is out of view, scroll it into view.
                    var parentElement = selected.parentElement;
                    var selectedTop = selected.offsetTop;
                    var parentScrollBottom = parentElement.scrollTop + parentElement.clientHeight;
                    if (selectedTop < parentElement.scrollTop) {
                        parentElement.scrollTop = selectedTop;
                    } else if (selectedTop >= parentScrollBottom) {
                        var selectedBottom = selectedTop + selected.clientHeight;
                        parentElement.scrollTop += selectedBottom - parentScrollBottom;
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7d0JBRXNCLFdBQVc7O3NCQUVkLFVBQVU7O3FCQUNjLFNBQVM7O0lBRy9CLG9CQUFvQjtBQUMxQixhQURNLG9CQUFvQixHQUN2Qjs7OzhCQURHLG9CQUFvQjs7QUFFakMsWUFBSSxDQUFDLE9BQU8sR0FBRyx1QkFBYSxDQUFDO0FBQzdCLFlBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFlBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDOzs7QUFHM0IsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzRCxZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFELFlBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzs7QUFHL0UsWUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzVDLFlBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFdEMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxFQUFFLEVBQUs7OztBQUczQyxjQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDckIsa0JBQUssU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQzFCLENBQUMsQ0FBQztBQUNILFlBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FB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c3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7UGF0aH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHtjYWNoZWRQcm9wZXJ0eSwgY2xvc2VzdCwgZG9tfSBmcm9tICcuL3V0aWxzJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZHZhbmNlZE9wZW5GaWxlVmlldyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMuY3Vyc29ySW5kZXggPSBudWxsO1xuICAgICAgICB0aGlzLl91cGRhdGluZ1BhdGggPSBmYWxzZTtcblxuICAgICAgICAvLyBFbGVtZW50IHJlZmVyZW5jZXNcbiAgICAgICAgdGhpcy5wYXRoSW5wdXQgPSB0aGlzLmNvbnRlbnQucXVlcnlTZWxlY3RvcignLnBhdGgtaW5wdXQnKTtcbiAgICAgICAgdGhpcy5wYXRoTGlzdCA9IHRoaXMuY29udGVudC5xdWVyeVNlbGVjdG9yKCcubGlzdC1ncm91cCcpO1xuICAgICAgICB0aGlzLnBhcmVudERpcmVjdG9yeUxpc3RJdGVtID0gdGhpcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYXJlbnQtZGlyZWN0b3J5Jyk7XG5cbiAgICAgICAgLy8gSW5pdGlhbGl6ZSB0ZXh0IGVkaXRvclxuICAgICAgICB0aGlzLnBhdGhFZGl0b3IgPSB0aGlzLnBhdGhJbnB1dC5nZXRNb2RlbCgpO1xuICAgICAgICB0aGlzLnBhdGhFZGl0b3Iuc2V0UGxhY2Vob2xkZXJUZXh0KCcvcGF0aC90by9maWxlLnR4dCcpO1xuICAgICAgICB0aGlzLnBhdGhFZGl0b3Iuc2V0U29mdFdyYXBwZWQoZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldikgPT4ge1xuICAgICAgICAgICAgLy8gS2VlcCBmb2N1cyBvbiB0aGUgdGV4dCBpbnB1dCBhbmQgZG8gbm90IHByb3BhZ2F0ZSBzbyB0aGF0IHRoZVxuICAgICAgICAgICAgLy8gb3V0c2lkZSBjbGljayBoYW5kbGVyIGRvZXNuJ3QgcGljayB1cCB0aGUgZXZlbnQuXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMucGF0aElucHV0LmZvY3VzKCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGxldCBsaXN0SXRlbSA9IGV2LnRhcmdldDo6Y2xvc2VzdCgnLmxpc3QtaXRlbScpO1xuICAgICAgICAgICAgaWYgKGxpc3RJdGVtICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jbGljay1maWxlJywgbGlzdEl0ZW0uZGF0YXNldC5maWxlTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQ6OmNsb3Nlc3QoJy5hZGQtcHJvamVjdC1mb2xkZXInKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBsaXN0SXRlbSA9IGV2LnRhcmdldDo6Y2xvc2VzdCgnLmxpc3QtaXRlbScpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2xpY2stYWRkLXByb2plY3QtZm9sZGVyJywgbGlzdEl0ZW0uZGF0YXNldC5maWxlTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIEBjYWNoZWRQcm9wZXJ0eVxuICAgIGdldCBjb250ZW50KCkge1xuICAgICAgICByZXR1cm4gZG9tKGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhZHZhbmNlZC1vcGVuLWZpbGVcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImluZm8tbWVzc2FnZSBpY29uIGljb24tZmlsZS1hZGRcIj5cbiAgICAgICAgICAgICAgICAgICAgRW50ZXIgdGhlIHBhdGggZm9yIHRoZSBmaWxlIHRvIG9wZW4gb3IgY3JlYXRlLlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8YXRvbS10ZXh0LWVkaXRvciBjbGFzcz1cInBhdGgtaW5wdXRcIiBtaW5pPjwvYXRvbS10ZXh0LWVkaXRvcj5cbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaXRlbSBwYXJlbnQtZGlyZWN0b3J5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb24gaWNvbi1maWxlLWRpcmVjdG9yeVwiPi4uPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYCk7XG4gICAgfVxuXG4gICAgY3JlYXRlUGF0aExpc3RJdGVtKHBhdGgpIHtcbiAgICAgICAgbGV0IGljb24gPSBwYXRoLmlzRGlyZWN0b3J5KCkgPyAnaWNvbi1maWxlLWRpcmVjdG9yeScgOiAnaWNvbi1maWxlLXRleHQnO1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pdGVtICR7cGF0aC5pc0RpcmVjdG9yeSgpID8gJ2RpcmVjdG9yeScgOiAnJ31cIlxuICAgICAgICAgICAgICAgIGRhdGEtZmlsZS1uYW1lPVwiJHtwYXRoLmZ1bGx9XCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmaWxlbmFtZSBpY29uICR7aWNvbn1cIlxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEtbmFtZT1cIiR7cGF0aC5mcmFnbWVudH1cIj5cbiAgICAgICAgICAgICAgICAgICAgJHtwYXRoLmZyYWdtZW50fVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAke3BhdGguaXNEaXJlY3RvcnkoKSAmJiAhcGF0aC5pc1Byb2plY3REaXJlY3RvcnkoKVxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuYWRkUHJvamVjdEJ1dHRvbigpXG4gICAgICAgICAgICAgICAgICAgIDogJyd9XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICBgO1xuICAgIH1cblxuICAgIGFkZFByb2plY3RCdXR0b24oKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImFkZC1wcm9qZWN0LWZvbGRlciBpY29uIGljb24tcGx1c1wiXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJPcGVuIGFzIHByb2plY3QgZm9sZGVyXCI+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIGA7XG4gICAgfVxuXG4gICAgY3JlYXRlTW9kYWxQYW5lbCgpIHtcbiAgICAgICAgbGV0IHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7XG4gICAgICAgICAgICBpdGVtOiB0aGlzLmNvbnRlbnQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEJpbmQgdGhlIG91dHNpZGUgY2xpY2sgaGFuZGxlciBhbmQgZGVzdHJveSBpdCB3aGVuIHRoZSBwYW5lbCBpc1xuICAgICAgICAvLyBkZXN0cm95ZWQuXG4gICAgICAgIGxldCBvdXRzaWRlQ2xpY2tIYW5kbGVyID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0OjpjbG9zZXN0KCcuYWR2YW5jZWQtb3Blbi1maWxlJykgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNsaWNrLW91dHNpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xpY2tIYW5kbGVyKTtcbiAgICAgICAgcGFuZWwub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG91dHNpZGVDbGlja0hhbmRsZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgbW9kYWwgPSB0aGlzLmNvbnRlbnQucGFyZW50Tm9kZTtcbiAgICAgICAgbW9kYWwuc3R5bGUubWF4SGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgICAgICBtb2RhbC5zdHlsZS5mbGV4RGlyZWN0aW9uID0gJ2NvbHVtbic7XG5cbiAgICAgICAgdGhpcy5wYXRoSW5wdXQuZm9jdXMoKTtcblxuICAgICAgICByZXR1cm4gcGFuZWw7XG4gICAgfVxuXG4gICAgb25EaWRDbGlja0ZpbGUoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2xpY2stZmlsZScsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBvbkRpZENsaWNrQWRkUHJvamVjdEZvbGRlcihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jbGljay1hZGQtcHJvamVjdC1mb2xkZXInLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgb25EaWRDbGlja091dHNpZGUoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2xpY2stb3V0c2lkZScsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJzY3JpYmUgdG8gdXNlci1pbml0aWF0ZWQgY2hhbmdlcyBpbiB0aGUgcGF0aC5cbiAgICAgKi9cbiAgICBvbkRpZFBhdGhDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5wYXRoRWRpdG9yLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdXBkYXRpbmdQYXRoKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobmV3IFBhdGgodGhpcy5wYXRoRWRpdG9yLmdldFRleHQoKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWxlY3RlZFBhdGgoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnNvckluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLnBhdGhMaXN0LnF1ZXJ5U2VsZWN0b3IoJy5saXN0LWl0ZW0uc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUGF0aChzZWxlY3RlZC5kYXRhc2V0LmZpbGVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZpcnN0UGF0aCgpIHtcbiAgICAgICAgbGV0IHBhdGhJdGVtcyA9IHRoaXMucGF0aExpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3QtaXRlbTpub3QoLnBhcmVudC1kaXJlY3RvcnkpJyk7XG4gICAgICAgIGlmIChwYXRoSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHBhdGhJdGVtc1swXS5kYXRhc2V0LmZpbGVOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGF0aExpc3RMZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhdGhMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LWl0ZW06bm90KC5oaWRkZW4pJykubGVuZ3RoO1xuICAgIH1cblxuICAgIHNldFBhdGgocGF0aCkge1xuICAgICAgICB0aGlzLl91cGRhdGluZ1BhdGggPSB0cnVlO1xuXG4gICAgICAgIHRoaXMucGF0aEVkaXRvci5zZXRUZXh0KHBhdGguZnVsbCk7XG4gICAgICAgIHRoaXMucGF0aEVkaXRvci5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5wYXJlbnREaXJlY3RvcnlMaXN0SXRlbS5kYXRhc2V0LmZpbGVOYW1lID0gcGF0aC5wYXJlbnQoKS5mdWxsO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0aW5nUGF0aCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZvckVhY2hMaXN0SXRlbShzZWxlY3RvciwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGxpc3RJdGVtcyA9IHRoaXMucGF0aExpc3QucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGlzdEl0ZW1zLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhsaXN0SXRlbXNba10pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0UGF0aExpc3QocGF0aHMsIGhpZGVQYXJlbnQ9ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5jdXJzb3JJbmRleCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoTGlzdEl0ZW0oJy5saXN0LWl0ZW0uc2VsZWN0ZWQnLCAobGlzdEl0ZW0pID0+IHtcbiAgICAgICAgICAgIGxpc3RJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZm9yRWFjaExpc3RJdGVtKCcubGlzdC1pdGVtOm5vdCgucGFyZW50LWRpcmVjdG9yeSknLCAobGlzdEl0ZW0pID0+IHtcbiAgICAgICAgICAgIGxpc3RJdGVtLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocGF0aHMubGVuZ3RoID09PSAwIHx8IGhpZGVQYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50RGlyZWN0b3J5TGlzdEl0ZW0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudERpcmVjdG9yeUxpc3RJdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFNwbGl0IGxpc3QgaW50byBkaXJlY3RvcmllcyBhbmQgZmlsZXMgYW5kIHNvcnQgdGhlbS5cbiAgICAgICAgICAgIHBhdGhzID0gcGF0aHMuc29ydChQYXRoLmNvbXBhcmUpO1xuICAgICAgICAgICAgbGV0IGRpcmVjdG9yeVBhdGhzID0gcGF0aHMuZmlsdGVyKChwYXRoKSA9PiBwYXRoLmlzRGlyZWN0b3J5KCkpO1xuICAgICAgICAgICAgbGV0IGZpbGVQYXRocyA9IHBhdGhzLmZpbHRlcigocGF0aCkgPT4gcGF0aC5pc0ZpbGUoKSk7XG5cbiAgICAgICAgICAgIGZvciAocGF0aCBvZiBkaXJlY3RvcnlQYXRocykge1xuICAgICAgICAgICAgICAgIGlmIChwYXRoLmV4aXN0cygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF0aExpc3QuYXBwZW5kQ2hpbGQoZG9tKHRoaXMuY3JlYXRlUGF0aExpc3RJdGVtKHBhdGgpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHBhdGggb2YgZmlsZVBhdGhzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhdGguZXhpc3RzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXRoTGlzdC5hcHBlbmRDaGlsZChkb20odGhpcy5jcmVhdGVQYXRoTGlzdEl0ZW0ocGF0aCkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDdXJzb3JJbmRleChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucGF0aExpc3RMZW5ndGgoKSkge1xuICAgICAgICAgICAgaW5kZXggPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJzb3JJbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLmZvckVhY2hMaXN0SXRlbSgnLmxpc3QtaXRlbS5zZWxlY3RlZCcsIChsaXN0SXRlbSkgPT4ge1xuICAgICAgICAgICAgbGlzdEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuY3Vyc29ySW5kZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBsaXN0SXRlbXMgPSB0aGlzLnBhdGhMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LWl0ZW06bm90KC5oaWRkZW4pJyk7XG4gICAgICAgICAgICBpZiAobGlzdEl0ZW1zLmxlbmd0aCA+IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gbGlzdEl0ZW1zW2luZGV4XTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHNlbGVjdGVkIGVsZW1lbnQgaXMgb3V0IG9mIHZpZXcsIHNjcm9sbCBpdCBpbnRvIHZpZXcuXG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudEVsZW1lbnQgPSBzZWxlY3RlZC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZFRvcCA9IHNlbGVjdGVkLm9mZnNldFRvcDtcbiAgICAgICAgICAgICAgICBsZXQgcGFyZW50U2Nyb2xsQm90dG9tID0gcGFyZW50RWxlbWVudC5zY3JvbGxUb3AgKyBwYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRUb3AgPCBwYXJlbnRFbGVtZW50LnNjcm9sbFRvcCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRFbGVtZW50LnNjcm9sbFRvcCA9IHNlbGVjdGVkVG9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRUb3AgPj0gcGFyZW50U2Nyb2xsQm90dG9tKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEJvdHRvbSA9IHNlbGVjdGVkVG9wICsgc2VsZWN0ZWQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRFbGVtZW50LnNjcm9sbFRvcCArPSBzZWxlY3RlZEJvdHRvbSAtIHBhcmVudFNjcm9sbEJvdHRvbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/lib/view.js
