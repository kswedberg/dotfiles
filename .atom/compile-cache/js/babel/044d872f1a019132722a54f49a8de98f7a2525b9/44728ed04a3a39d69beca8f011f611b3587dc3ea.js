Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _eventKit = require('event-kit');

var _osenv = require('osenv');

var _osenv2 = _interopRequireDefault(_osenv);

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

var _models = require('./models');

var _utils = require('./utils');

// Emitter for outside packages to subscribe to. Subscription functions
// are exponsed in ./advanced-open-file
var emitter = new _eventKit.Emitter();

exports.emitter = emitter;

var AdvancedOpenFileController = (function () {
    function AdvancedOpenFileController() {
        _classCallCheck(this, AdvancedOpenFileController);

        this.view = new _view2['default']();
        this.panel = null;

        this.currentPath = null;
        this.pathHistory = [];

        atom.commands.add('atom-workspace', {
            'advanced-open-file:toggle': this.toggle.bind(this)
        });
        atom.commands.add('.advanced-open-file', {
            'core:confirm': this.confirm.bind(this),
            'core:cancel': this.detach.bind(this),
            'advanced-open-file:autocomplete': this.autocomplete.bind(this),
            'advanced-open-file:undo': this.undo.bind(this),
            'advanced-open-file:move-cursor-down': this.moveCursorDown.bind(this),
            'advanced-open-file:move-cursor-up': this.moveCursorUp.bind(this),
            'advanced-open-file:confirm-selected-or-first': this.confirmSelectedOrFirst.bind(this),
            'advanced-open-file:delete-path-component': this.deletePathComponent.bind(this)
        });

        this.view.onDidClickFile(this.clickFile.bind(this));
        this.view.onDidClickAddProjectFolder(this.addProjectFolder.bind(this));
        this.view.onDidClickOutside(this.detach.bind(this));
        this.view.onDidPathChange(this.pathChange.bind(this));
    }

    _createClass(AdvancedOpenFileController, [{
        key: 'clickFile',
        value: function clickFile(fileName) {
            this.selectPath(new _models.Path(fileName));
        }
    }, {
        key: 'pathChange',
        value: function pathChange(newPath) {
            var saveHistory = false;

            // Since the user typed this, apply fast-dir-switch
            // shortcuts.
            if (atom.config.get('advanced-open-file.helmDirSwitch')) {
                if (newPath.directory.endsWith(newPath.sep + newPath.sep)) {
                    newPath = newPath.root();
                    saveHistory = true;
                } else if (newPath.directory.endsWith('~' + newPath.sep)) {
                    newPath = new _models.Path(_osenv2['default'].home() + _path2['default'].sep);
                    saveHistory = true;
                } else if (newPath.directory.endsWith(':' + newPath.sep)) {
                    var projectPath = (0, _utils.getProjectPath)();
                    if (projectPath) {
                        newPath = new _models.Path(projectPath + newPath.sep);
                        saveHistory = true;
                    }
                }
            }

            this.updatePath(newPath, { saveHistory: saveHistory });
        }
    }, {
        key: 'selectPath',
        value: function selectPath(newPath) {
            if (newPath.isDirectory()) {
                this.updatePath(newPath.asDirectory());
            } else {
                this.openPath(newPath);
            }
        }
    }, {
        key: 'updatePath',
        value: function updatePath(newPath) {
            var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var _ref$saveHistory = _ref.saveHistory;
            var saveHistory = _ref$saveHistory === undefined ? true : _ref$saveHistory;

            if (saveHistory) {
                this.pathHistory.push(this.currentPath);
            }

            this.currentPath = newPath;
            this.view.setPath(newPath);

            // Hide parent if fragment isn't empty.
            var hideParent = newPath.fragment !== '';
            this.view.setPathList(newPath.matchingPaths(), hideParent);
        }
    }, {
        key: 'openPath',
        value: function openPath(path) {
            if (path.exists()) {
                if (path.isFile()) {
                    atom.workspace.open(path.full);
                    emitter.emit('did-open-path', path.full);
                    this.detach();
                } else {
                    atom.beep();
                }
            } else if (path.fragment) {
                path.createDirectories();
                if (atom.config.get('advanced-open-file.createFileInstantly')) {
                    path.createFile();
                    emitter.emit('did-create-path', path.full);
                }
                atom.workspace.open(path.full);
                emitter.emit('did-open-path', path.full);
                this.detach();
            } else {
                atom.beep();
            }
        }
    }, {
        key: 'deletePathComponent',
        value: function deletePathComponent() {
            if (this.currentPath.isRoot()) {
                atom.beep();
            } else {
                this.updatePath(this.currentPath.parent());
            }
        }
    }, {
        key: 'addProjectFolder',
        value: function addProjectFolder(fileName) {
            var folderPath = new _models.Path(fileName);
            if (folderPath.isDirectory()) {
                atom.project.addPath(folderPath.full);
                this.detach();
            }
        }

        /**
         * Autocomplete the current input to the longest common prefix among
         * paths matching the current input. If no change is made to the
         * current path, beep.
         */
    }, {
        key: 'autocomplete',
        value: function autocomplete() {
            var matchingPaths = this.currentPath.matchingPaths();
            if (matchingPaths.length === 0) {
                atom.beep();
            } else if (matchingPaths.length === 1) {
                var newPath = matchingPaths[0];
                if (newPath.isDirectory()) {
                    this.updatePath(newPath.asDirectory());
                } else {
                    this.updatePath(newPath);
                }
            } else {
                var newPath = _models.Path.commonPrefix(matchingPaths);
                if (newPath.equals(this.currentPath)) {
                    atom.beep();
                } else {
                    this.updatePath(newPath);
                }
            }
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            if (this.panel) {
                this.detach();
            } else {
                this.attach();
            }
        }
    }, {
        key: 'confirm',
        value: function confirm() {
            var selectedPath = this.view.selectedPath();
            if (selectedPath !== null) {
                this.selectPath(selectedPath);
            } else {
                this.selectPath(this.currentPath);
            }
        }
    }, {
        key: 'confirmSelectedOrFirst',
        value: function confirmSelectedOrFirst() {
            var selectedPath = this.view.selectedPath();
            if (selectedPath !== null) {
                this.selectPath(selectedPath);
            } else {
                var firstPath = this.view.firstPath();
                if (firstPath !== null) {
                    this.selectPath(firstPath);
                } else {
                    this.selectPath(this.currentPath);
                }
            }
        }
    }, {
        key: 'undo',
        value: function undo() {
            if (this.pathHistory.length > 0) {
                this.updatePath(this.pathHistory.pop(), { saveHistory: false });
            } else {
                var initialPath = _models.Path.initial();
                if (!this.currentPath.equals(initialPath)) {
                    this.updatePath(initialPath, { saveHistory: false });
                } else {
                    atom.beep();
                }
            }
        }
    }, {
        key: 'moveCursorDown',
        value: function moveCursorDown() {
            var index = this.view.cursorIndex;
            if (index === null || index === this.view.pathListLength() - 1) {
                index = 0;
            } else {
                index++;
            }

            this.view.setCursorIndex(index);
        }
    }, {
        key: 'moveCursorUp',
        value: function moveCursorUp() {
            var index = this.view.cursorIndex;
            if (index === null || index === 0) {
                index = this.view.pathListLength() - 1;
            } else {
                index--;
            }

            this.view.setCursorIndex(index);
        }
    }, {
        key: 'detach',
        value: function detach() {
            if (this.panel === null) {
                return;
            }

            this.panel.destroy();
            this.panel = null;
            atom.workspace.getActivePane().activate();
        }
    }, {
        key: 'attach',
        value: function attach() {
            if (this.panel !== null) {
                return;
            }

            this.pathHistory = [];
            this.updatePath(_models.Path.initial(), { saveHistory: false });
            this.panel = this.view.createModalPanel();
        }
    }]);

    return AdvancedOpenFileController;
})();

exports.AdvancedOpenFileController = AdvancedOpenFileController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFb0IsTUFBTTs7Ozt3QkFFSixXQUFXOztxQkFDZixPQUFPOzs7O29CQUVRLFFBQVE7Ozs7c0JBQ3RCLFVBQVU7O3FCQUNBLFNBQVM7Ozs7QUFLL0IsSUFBSSxPQUFPLEdBQUcsdUJBQWEsQ0FBQzs7OztJQUd0QiwwQkFBMEI7QUFDeEIsYUFERiwwQkFBMEIsR0FDckI7OEJBREwsMEJBQTBCOztBQUUvQixZQUFJLENBQUMsSUFBSSxHQUFHLHVCQUEwQixDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixZQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4QixZQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDaEMsdUNBQTJCLEVBQUksSUFBSSxDQUFDLE1BQU0sTUFBWCxJQUFJLENBQU87U0FDN0MsQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUU7QUFDckMsMEJBQWMsRUFBSSxJQUFJLENBQUMsT0FBTyxNQUFaLElBQUksQ0FBUTtBQUM5Qix5QkFBYSxFQUFJLElBQUksQ0FBQyxNQUFNLE1BQVgsSUFBSSxDQUFPO0FBQzVCLDZDQUFpQyxFQUFJLElBQUksQ0FBQyxZQUFZLE1BQWpCLElBQUksQ0FBYTtBQUN0RCxxQ0FBeUIsRUFBSSxJQUFJLENBQUMsSUFBSSxNQUFULElBQUksQ0FBSztBQUN0QyxpREFBcUMsRUFBSSxJQUFJLENBQUMsY0FBYyxNQUFuQixJQUFJLENBQWU7QUFDNUQsK0NBQW1DLEVBQUksSUFBSSxDQUFDLFlBQVksTUFBakIsSUFBSSxDQUFhO0FBQ3hELDBEQUE4QyxFQUFJLElBQUksQ0FBQyxzQkFBc0IsTUFBM0IsSUFBSSxDQUF1QjtBQUM3RSxzREFBMEMsRUFBSSxJQUFJLENBQUMsbUJBQW1CLE1BQXhCLElBQUksQ0FBb0I7U0FDekUsQ0FBQyxDQUFDOztBQUVILFlBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFHLElBQUksQ0FBQyxTQUFTLE1BQWQsSUFBSSxFQUFXLENBQUM7QUFDM0MsWUFBSSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBRyxJQUFJLENBQUMsZ0JBQWdCLE1BQXJCLElBQUksRUFBa0IsQ0FBQztBQUM5RCxZQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFHLElBQUksQ0FBQyxNQUFNLE1BQVgsSUFBSSxFQUFRLENBQUM7QUFDM0MsWUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUcsSUFBSSxDQUFDLFVBQVUsTUFBZixJQUFJLEVBQVksQ0FBQztLQUNoRDs7aUJBMUJRLDBCQUEwQjs7ZUE0QjFCLG1CQUFDLFFBQVEsRUFBRTtBQUNoQixnQkFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBUyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDOzs7ZUFFUyxvQkFBQyxPQUFPLEVBQUc7QUFDakIsZ0JBQUksV0FBVyxHQUFHLEtBQUssQ0FBQzs7OztBQUl4QixnQkFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxFQUFFO0FBQ3JELG9CQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZELDJCQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pCLCtCQUFXLEdBQUcsSUFBSSxDQUFDO2lCQUN0QixNQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN0RCwyQkFBTyxHQUFHLGlCQUFTLG1CQUFNLElBQUksRUFBRSxHQUFHLGtCQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLCtCQUFXLEdBQUcsSUFBSSxDQUFDO2lCQUN0QixNQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUN0RCx3QkFBSSxXQUFXLEdBQUcsNEJBQWdCLENBQUM7QUFDbkMsd0JBQUksV0FBVyxFQUFFO0FBQ2IsK0JBQU8sR0FBRyxpQkFBUyxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLG1DQUFXLEdBQUcsSUFBSSxDQUFDO3FCQUN0QjtpQkFDSjthQUNKOztBQUVELGdCQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1NBQ3hEOzs7ZUFFUyxvQkFBQyxPQUFPLEVBQUU7QUFDaEIsZ0JBQUksT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFO0FBQ3ZCLG9CQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2FBQzFDLE1BQU07QUFDSCxvQkFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMxQjtTQUNKOzs7ZUFFUyxvQkFBQyxPQUFPLEVBQXlCOzZFQUFKLEVBQUU7O3dDQUFwQixXQUFXO2dCQUFYLFdBQVcsb0NBQUMsSUFBSTs7QUFDakMsZ0JBQUksV0FBVyxFQUFFO0FBQ2Isb0JBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUMzQzs7QUFFRCxnQkFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFDM0IsZ0JBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7QUFHM0IsZ0JBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEtBQUssRUFBRSxDQUFDO0FBQ3pDLGdCQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDOUQ7OztlQUVPLGtCQUFDLElBQUksRUFBRTtBQUNYLGdCQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUNmLG9CQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUNmLHdCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsMkJBQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6Qyx3QkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUNqQixNQUFNO0FBQ0gsd0JBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDZjthQUNKLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ3RCLG9CQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUN6QixvQkFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxFQUFFO0FBQzNELHdCQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsMkJBQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM5QztBQUNELG9CQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsdUJBQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxvQkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ2pCLE1BQU07QUFDSCxvQkFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2Y7U0FDSjs7O2VBRWtCLCtCQUFHO0FBQ2xCLGdCQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDM0Isb0JBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNmLE1BQU07QUFDSCxvQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDOUM7U0FDSjs7O2VBRWUsMEJBQUMsUUFBUSxFQUFFO0FBQ3ZCLGdCQUFJLFVBQVUsR0FBRyxpQkFBUyxRQUFRLENBQUMsQ0FBQztBQUNwQyxnQkFBSSxVQUFVLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDMUIsb0JBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxvQkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ2pCO1NBQ0o7Ozs7Ozs7OztlQU9XLHdCQUFHO0FBQ1gsZ0JBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckQsZ0JBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDNUIsb0JBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNmLE1BQU0sSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNuQyxvQkFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLG9CQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUN2Qix3QkFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztpQkFDMUMsTUFBTTtBQUNILHdCQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM1QjthQUNKLE1BQU07QUFDSCxvQkFBSSxPQUFPLEdBQUcsYUFBSyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDL0Msb0JBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDbEMsd0JBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDZixNQUFNO0FBQ0gsd0JBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzVCO2FBQ0o7U0FDSjs7O2VBRUssa0JBQUc7QUFDTCxnQkFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1osb0JBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNqQixNQUFNO0FBQ0gsb0JBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNqQjtTQUNKOzs7ZUFFTSxtQkFBRztBQUNOLGdCQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzVDLGdCQUFJLFlBQVksS0FBSyxJQUFJLEVBQUU7QUFDdkIsb0JBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDakMsTUFBTTtBQUNILG9CQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNyQztTQUNKOzs7ZUFFcUIsa0NBQUc7QUFDckIsZ0JBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDNUMsZ0JBQUksWUFBWSxLQUFLLElBQUksRUFBRTtBQUN2QixvQkFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNqQyxNQUFNO0FBQ0gsb0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDdEMsb0JBQUksU0FBUyxLQUFLLElBQUksRUFBRTtBQUNwQix3QkFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDOUIsTUFBTTtBQUNILHdCQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtpQkFDcEM7YUFDSjtTQUNKOzs7ZUFFRyxnQkFBRztBQUNILGdCQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUM3QixvQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7YUFDakUsTUFBTTtBQUNILG9CQUFJLFdBQVcsR0FBRyxhQUFLLE9BQU8sRUFBRSxDQUFDO0FBQ2pDLG9CQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDdkMsd0JBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7aUJBQ3RELE1BQU07QUFDSCx3QkFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNmO2FBQ0o7U0FDSjs7O2VBRWEsMEJBQUc7QUFDYixnQkFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDbEMsZ0JBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDNUQscUJBQUssR0FBRyxDQUFDLENBQUM7YUFDYixNQUFNO0FBQ0gscUJBQUssRUFBRSxDQUFDO2FBQ1g7O0FBRUQsZ0JBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DOzs7ZUFFVyx3QkFBRztBQUNYLGdCQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNsQyxnQkFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDL0IscUJBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUMxQyxNQUFNO0FBQ0gscUJBQUssRUFBRSxDQUFDO2FBQ1g7O0FBRUQsZ0JBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DOzs7ZUFFSyxrQkFBRztBQUNMLGdCQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ3JCLHVCQUFPO2FBQ1Y7O0FBRUQsZ0JBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckIsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLGdCQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzdDOzs7ZUFFSyxrQkFBRztBQUNMLGdCQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ3JCLHVCQUFPO2FBQ1Y7O0FBRUQsZ0JBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLGdCQUFJLENBQUMsVUFBVSxDQUFDLGFBQUssT0FBTyxFQUFFLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztBQUN0RCxnQkFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDN0M7OztXQWxPUSwwQkFBMEIiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvbGliL2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBzdGRQYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQgb3NlbnYgZnJvbSAnb3NlbnYnO1xuXG5pbXBvcnQgQWR2YW5jZWRPcGVuRmlsZVZpZXcgZnJvbSAnLi92aWV3JztcbmltcG9ydCB7UGF0aH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHtnZXRQcm9qZWN0UGF0aH0gZnJvbSAnLi91dGlscyc7XG5cblxuLy8gRW1pdHRlciBmb3Igb3V0c2lkZSBwYWNrYWdlcyB0byBzdWJzY3JpYmUgdG8uIFN1YnNjcmlwdGlvbiBmdW5jdGlvbnNcbi8vIGFyZSBleHBvbnNlZCBpbiAuL2FkdmFuY2VkLW9wZW4tZmlsZVxuZXhwb3J0IGxldCBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcblxuXG5leHBvcnQgY2xhc3MgQWR2YW5jZWRPcGVuRmlsZUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnZpZXcgPSBuZXcgQWR2YW5jZWRPcGVuRmlsZVZpZXcoKTtcbiAgICAgICAgdGhpcy5wYW5lbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IG51bGw7XG4gICAgICAgIHRoaXMucGF0aEhpc3RvcnkgPSBbXTtcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAgICAgICAnYWR2YW5jZWQtb3Blbi1maWxlOnRvZ2dsZSc6IDo6dGhpcy50b2dnbGVcbiAgICAgICAgfSk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKCcuYWR2YW5jZWQtb3Blbi1maWxlJywge1xuICAgICAgICAgICAgJ2NvcmU6Y29uZmlybSc6IDo6dGhpcy5jb25maXJtLFxuICAgICAgICAgICAgJ2NvcmU6Y2FuY2VsJzogOjp0aGlzLmRldGFjaCxcbiAgICAgICAgICAgICdhZHZhbmNlZC1vcGVuLWZpbGU6YXV0b2NvbXBsZXRlJzogOjp0aGlzLmF1dG9jb21wbGV0ZSxcbiAgICAgICAgICAgICdhZHZhbmNlZC1vcGVuLWZpbGU6dW5kbyc6IDo6dGhpcy51bmRvLFxuICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZTptb3ZlLWN1cnNvci1kb3duJzogOjp0aGlzLm1vdmVDdXJzb3JEb3duLFxuICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZTptb3ZlLWN1cnNvci11cCc6IDo6dGhpcy5tb3ZlQ3Vyc29yVXAsXG4gICAgICAgICAgICAnYWR2YW5jZWQtb3Blbi1maWxlOmNvbmZpcm0tc2VsZWN0ZWQtb3ItZmlyc3QnOiA6OnRoaXMuY29uZmlybVNlbGVjdGVkT3JGaXJzdCxcbiAgICAgICAgICAgICdhZHZhbmNlZC1vcGVuLWZpbGU6ZGVsZXRlLXBhdGgtY29tcG9uZW50JzogOjp0aGlzLmRlbGV0ZVBhdGhDb21wb25lbnQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudmlldy5vbkRpZENsaWNrRmlsZSg6OnRoaXMuY2xpY2tGaWxlKTtcbiAgICAgICAgdGhpcy52aWV3Lm9uRGlkQ2xpY2tBZGRQcm9qZWN0Rm9sZGVyKDo6dGhpcy5hZGRQcm9qZWN0Rm9sZGVyKTtcbiAgICAgICAgdGhpcy52aWV3Lm9uRGlkQ2xpY2tPdXRzaWRlKDo6dGhpcy5kZXRhY2gpO1xuICAgICAgICB0aGlzLnZpZXcub25EaWRQYXRoQ2hhbmdlKDo6dGhpcy5wYXRoQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBjbGlja0ZpbGUoZmlsZU5hbWUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RQYXRoKG5ldyBQYXRoKGZpbGVOYW1lKSk7XG4gICAgfVxuXG4gICAgcGF0aENoYW5nZShuZXdQYXRoKSAge1xuICAgICAgICBsZXQgc2F2ZUhpc3RvcnkgPSBmYWxzZTtcblxuICAgICAgICAvLyBTaW5jZSB0aGUgdXNlciB0eXBlZCB0aGlzLCBhcHBseSBmYXN0LWRpci1zd2l0Y2hcbiAgICAgICAgLy8gc2hvcnRjdXRzLlxuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuaGVsbURpclN3aXRjaCcpKSB7XG4gICAgICAgICAgICBpZiAobmV3UGF0aC5kaXJlY3RvcnkuZW5kc1dpdGgobmV3UGF0aC5zZXAgKyBuZXdQYXRoLnNlcCkpIHtcbiAgICAgICAgICAgICAgICBuZXdQYXRoID0gbmV3UGF0aC5yb290KCk7XG4gICAgICAgICAgICAgICAgc2F2ZUhpc3RvcnkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdQYXRoLmRpcmVjdG9yeS5lbmRzV2l0aCgnficgKyBuZXdQYXRoLnNlcCkpIHtcbiAgICAgICAgICAgICAgICBuZXdQYXRoID0gbmV3IFBhdGgob3NlbnYuaG9tZSgpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgICAgIHNhdmVIaXN0b3J5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3UGF0aC5kaXJlY3RvcnkuZW5kc1dpdGgoJzonICsgbmV3UGF0aC5zZXApKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RQYXRoID0gZ2V0UHJvamVjdFBhdGgoKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvamVjdFBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UGF0aCA9IG5ldyBQYXRoKHByb2plY3RQYXRoICsgbmV3UGF0aC5zZXApO1xuICAgICAgICAgICAgICAgICAgICBzYXZlSGlzdG9yeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVQYXRoKG5ld1BhdGgsIHtzYXZlSGlzdG9yeTogc2F2ZUhpc3Rvcnl9KTtcbiAgICB9XG5cbiAgICBzZWxlY3RQYXRoKG5ld1BhdGgpIHtcbiAgICAgICAgaWYgKG5ld1BhdGguaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoKG5ld1BhdGguYXNEaXJlY3RvcnkoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5QYXRoKG5ld1BhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlUGF0aChuZXdQYXRoLCB7c2F2ZUhpc3Rvcnk9dHJ1ZX09e30pIHtcbiAgICAgICAgaWYgKHNhdmVIaXN0b3J5KSB7XG4gICAgICAgICAgICB0aGlzLnBhdGhIaXN0b3J5LnB1c2godGhpcy5jdXJyZW50UGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbmV3UGF0aDtcbiAgICAgICAgdGhpcy52aWV3LnNldFBhdGgobmV3UGF0aCk7XG5cbiAgICAgICAgLy8gSGlkZSBwYXJlbnQgaWYgZnJhZ21lbnQgaXNuJ3QgZW1wdHkuXG4gICAgICAgIGxldCBoaWRlUGFyZW50ID0gbmV3UGF0aC5mcmFnbWVudCAhPT0gJyc7XG4gICAgICAgIHRoaXMudmlldy5zZXRQYXRoTGlzdChuZXdQYXRoLm1hdGNoaW5nUGF0aHMoKSwgaGlkZVBhcmVudCk7XG4gICAgfVxuXG4gICAgb3BlblBhdGgocGF0aCkge1xuICAgICAgICBpZiAocGF0aC5leGlzdHMoKSkge1xuICAgICAgICAgICAgaWYgKHBhdGguaXNGaWxlKCkpIHtcbiAgICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguZnVsbCk7XG4gICAgICAgICAgICAgICAgZW1pdHRlci5lbWl0KCdkaWQtb3Blbi1wYXRoJywgcGF0aC5mdWxsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhdG9tLmJlZXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChwYXRoLmZyYWdtZW50KSB7XG4gICAgICAgICAgICBwYXRoLmNyZWF0ZURpcmVjdG9yaWVzKCk7XG4gICAgICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuY3JlYXRlRmlsZUluc3RhbnRseScpKSB7XG4gICAgICAgICAgICAgICAgcGF0aC5jcmVhdGVGaWxlKCk7XG4gICAgICAgICAgICAgICAgZW1pdHRlci5lbWl0KCdkaWQtY3JlYXRlLXBhdGgnLCBwYXRoLmZ1bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoLmZ1bGwpO1xuICAgICAgICAgICAgZW1pdHRlci5lbWl0KCdkaWQtb3Blbi1wYXRoJywgcGF0aC5mdWxsKTtcbiAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdG9tLmJlZXAoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRlbGV0ZVBhdGhDb21wb25lbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYXRoLmlzUm9vdCgpKSB7XG4gICAgICAgICAgICBhdG9tLmJlZXAoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGF0aCh0aGlzLmN1cnJlbnRQYXRoLnBhcmVudCgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFByb2plY3RGb2xkZXIoZmlsZU5hbWUpIHtcbiAgICAgICAgbGV0IGZvbGRlclBhdGggPSBuZXcgUGF0aChmaWxlTmFtZSk7XG4gICAgICAgIGlmIChmb2xkZXJQYXRoLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIGF0b20ucHJvamVjdC5hZGRQYXRoKGZvbGRlclBhdGguZnVsbCk7XG4gICAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXV0b2NvbXBsZXRlIHRoZSBjdXJyZW50IGlucHV0IHRvIHRoZSBsb25nZXN0IGNvbW1vbiBwcmVmaXggYW1vbmdcbiAgICAgKiBwYXRocyBtYXRjaGluZyB0aGUgY3VycmVudCBpbnB1dC4gSWYgbm8gY2hhbmdlIGlzIG1hZGUgdG8gdGhlXG4gICAgICogY3VycmVudCBwYXRoLCBiZWVwLlxuICAgICAqL1xuICAgIGF1dG9jb21wbGV0ZSgpIHtcbiAgICAgICAgbGV0IG1hdGNoaW5nUGF0aHMgPSB0aGlzLmN1cnJlbnRQYXRoLm1hdGNoaW5nUGF0aHMoKTtcbiAgICAgICAgaWYgKG1hdGNoaW5nUGF0aHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBhdG9tLmJlZXAoKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaGluZ1BhdGhzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgbGV0IG5ld1BhdGggPSBtYXRjaGluZ1BhdGhzWzBdO1xuICAgICAgICAgICAgaWYgKG5ld1BhdGguaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGF0aChuZXdQYXRoLmFzRGlyZWN0b3J5KCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgobmV3UGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbmV3UGF0aCA9IFBhdGguY29tbW9uUHJlZml4KG1hdGNoaW5nUGF0aHMpO1xuICAgICAgICAgICAgaWYgKG5ld1BhdGguZXF1YWxzKHRoaXMuY3VycmVudFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgYXRvbS5iZWVwKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGF0aChuZXdQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmF0dGFjaCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uZmlybSgpIHtcbiAgICAgICAgbGV0IHNlbGVjdGVkUGF0aCA9IHRoaXMudmlldy5zZWxlY3RlZFBhdGgoKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkUGF0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RQYXRoKHNlbGVjdGVkUGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFBhdGgodGhpcy5jdXJyZW50UGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25maXJtU2VsZWN0ZWRPckZpcnN0KCkge1xuICAgICAgICBsZXQgc2VsZWN0ZWRQYXRoID0gdGhpcy52aWV3LnNlbGVjdGVkUGF0aCgpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRQYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFBhdGgoc2VsZWN0ZWRQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmaXJzdFBhdGggPSB0aGlzLnZpZXcuZmlyc3RQYXRoKCk7XG4gICAgICAgICAgICBpZiAoZmlyc3RQYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RQYXRoKGZpcnN0UGF0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0UGF0aCh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5kbygpIHtcbiAgICAgICAgaWYgKHRoaXMucGF0aEhpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoKHRoaXMucGF0aEhpc3RvcnkucG9wKCksIHtzYXZlSGlzdG9yeTogZmFsc2V9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpbml0aWFsUGF0aCA9IFBhdGguaW5pdGlhbCgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYXRoLmVxdWFscyhpbml0aWFsUGF0aCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgoaW5pdGlhbFBhdGgsIHtzYXZlSGlzdG9yeTogZmFsc2V9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXRvbS5iZWVwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlQ3Vyc29yRG93bigpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy52aWV3LmN1cnNvckluZGV4O1xuICAgICAgICBpZiAoaW5kZXggPT09IG51bGwgfHwgaW5kZXggPT09IHRoaXMudmlldy5wYXRoTGlzdExlbmd0aCgpIC0gMSkge1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlldy5zZXRDdXJzb3JJbmRleChpbmRleCk7XG4gICAgfVxuXG4gICAgbW92ZUN1cnNvclVwKCkge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnZpZXcuY3Vyc29ySW5kZXg7XG4gICAgICAgIGlmIChpbmRleCA9PT0gbnVsbCB8fCBpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLnZpZXcucGF0aExpc3RMZW5ndGgoKSAtIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmRleC0tO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52aWV3LnNldEN1cnNvckluZGV4KGluZGV4KTtcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIGlmICh0aGlzLnBhbmVsID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFuZWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGF0aEhpc3RvcnkgPSBbXTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXRoKFBhdGguaW5pdGlhbCgpLCB7c2F2ZUhpc3Rvcnk6IGZhbHNlfSk7XG4gICAgICAgIHRoaXMucGFuZWwgPSB0aGlzLnZpZXcuY3JlYXRlTW9kYWxQYW5lbCgpO1xuICAgIH1cbn1cbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/lib/controller.js
