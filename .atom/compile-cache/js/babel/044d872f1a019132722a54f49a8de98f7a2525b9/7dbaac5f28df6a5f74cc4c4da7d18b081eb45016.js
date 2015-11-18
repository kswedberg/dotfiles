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
            var matchingPaths = this.currentPath.matchingPaths(true);
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
                var newPath = _models.Path.commonPrefix(matchingPaths, true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFb0IsTUFBTTs7Ozt3QkFFSixXQUFXOztxQkFDZixPQUFPOzs7O29CQUVRLFFBQVE7Ozs7c0JBQ3RCLFVBQVU7O3FCQUNBLFNBQVM7Ozs7QUFLL0IsSUFBSSxPQUFPLEdBQUcsdUJBQWEsQ0FBQzs7OztJQUd0QiwwQkFBMEI7QUFDeEIsYUFERiwwQkFBMEIsR0FDckI7OEJBREwsMEJBQTBCOztBQUUvQixZQUFJLENBQUMsSUFBSSxHQUFHLHVCQUEwQixDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixZQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4QixZQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDaEMsdUNBQTJCLEVBQUksSUFBSSxDQUFDLE1BQU0sTUFBWCxJQUFJLENBQU87U0FDN0MsQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUU7QUFDckMsMEJBQWMsRUFBSSxJQUFJLENBQUMsT0FBTyxNQUFaLElBQUksQ0FBUTtBQUM5Qix5QkFBYSxFQUFJLElBQUksQ0FBQyxNQUFNLE1BQVgsSUFBSSxDQUFPO0FBQzVCLDZDQUFpQyxFQUFJLElBQUksQ0FBQyxZQUFZLE1BQWpCLElBQUksQ0FBYTtBQUN0RCxxQ0FBeUIsRUFBSSxJQUFJLENBQUMsSUFBSSxNQUFULElBQUksQ0FBSztBQUN0QyxpREFBcUMsRUFBSSxJQUFJLENBQUMsY0FBYyxNQUFuQixJQUFJLENBQWU7QUFDNUQsK0NBQW1DLEVBQUksSUFBSSxDQUFDLFlBQVksTUFBakIsSUFBSSxDQUFhO0FBQ3hE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RyxJQUFJLENBQUM7QUFDbEIsZ0JBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDN0M7OztlQUVLLGtCQUFHO0FBQ0wsZ0JBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDckIsdUJBQU87YUFDVjs7QUFFRCxnQkFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdEIsZ0JBQUksQ0FBQyxVQUFVLENBQUMsYUFBSyxPQUFPLEVBQUUsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0FBQ3RELGdCQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUM3Qzs7O1dBbE9RLDBCQUEwQiIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2FkdmFuY2VkLW9wZW4tZmlsZS9saWIvY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHN0ZFBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7RW1pdHRlcn0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCBvc2VudiBmcm9tICdvc2Vudic7XG5cbmltcG9ydCBBZHZhbmNlZE9wZW5GaWxlVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHtQYXRofSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQge2dldFByb2plY3RQYXRofSBmcm9tICcuL3V0aWxzJztcblxuXG4vLyBFbWl0dGVyIGZvciBvdXRzaWRlIHBhY2thZ2VzIHRvIHN1YnNjcmliZSB0by4gU3Vic2NyaXB0aW9uIGZ1bmN0aW9uc1xuLy8gYXJlIGV4cG9uc2VkIGluIC4vYWR2YW5jZWQtb3Blbi1maWxlXG5leHBvcnQgbGV0IGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG5cbmV4cG9ydCBjbGFzcyBBZHZhbmNlZE9wZW5GaWxlQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudmlldyA9IG5ldyBBZHZhbmNlZE9wZW5GaWxlVmlldygpO1xuICAgICAgICB0aGlzLnBhbmVsID0gbnVsbDtcblxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gbnVsbDtcbiAgICAgICAgdGhpcy5wYXRoSGlzdG9yeSA9IFtdO1xuXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICAgICAgICdhZHZhbmNlZC1vcGVuLWZpbGU6dG9nZ2xlJzogOjp0aGlzLnRvZ2dsZVxuICAgICAgICB9KTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJy5hZHZhbmNlZC1vcGVuLWZpbGUnLCB7XG4gICAgICAgICAgICAnY29yZTpjb25maXJtJzogOjp0aGlzLmNvbmZpcm0sXG4gICAgICAgICAgICAnY29yZTpjYW5jZWwnOiA6OnRoaXMuZGV0YWNoLFxuICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZTphdXRvY29tcGxldGUnOiA6OnRoaXMuYXV0b2NvbXBsZXRlLFxuICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZTp1bmRvJzogOjp0aGlzLnVuZG8sXG4gICAgICAgICAgICAnYWR2YW5jZWQtb3Blbi1maWxlOm1vdmUtY3Vyc29yLWRvd24nOiA6OnRoaXMubW92ZUN1cnNvckRvd24sXG4gICAgICAgICAgICAnYWR2YW5jZWQtb3Blbi1maWxlOm1vdmUtY3Vyc29yLXVwJzogOjp0aGlzLm1vdmVDdXJzb3JVcCxcbiAgICAgICAgICAgICdhZHZhbmNlZC1vcGVuLWZpbGU6Y29uZmlybS1zZWxlY3RlZC1vci1maXJzdCc6IDo6dGhpcy5jb25maXJtU2VsZWN0ZWRPckZpcnN0LFxuICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZTpkZWxldGUtcGF0aC1jb21wb25lbnQnOiA6OnRoaXMuZGVsZXRlUGF0aENvbXBvbmVudCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy52aWV3Lm9uRGlkQ2xpY2tGaWxlKDo6dGhpcy5jbGlja0ZpbGUpO1xuICAgICAgICB0aGlzLnZpZXcub25EaWRDbGlja0FkZFByb2plY3RGb2xkZXIoOjp0aGlzLmFkZFByb2plY3RGb2xkZXIpO1xuICAgICAgICB0aGlzLnZpZXcub25EaWRDbGlja091dHNpZGUoOjp0aGlzLmRldGFjaCk7XG4gICAgICAgIHRoaXMudmlldy5vbkRpZFBhdGhDaGFuZ2UoOjp0aGlzLnBhdGhDaGFuZ2UpO1xuICAgIH1cblxuICAgIGNsaWNrRmlsZShmaWxlTmFtZSkge1xuICAgICAgICB0aGlzLnNlbGVjdFBhdGgobmV3IFBhdGgoZmlsZU5hbWUpKTtcbiAgICB9XG5cbiAgICBwYXRoQ2hhbmdlKG5ld1BhdGgpICB7XG4gICAgICAgIGxldCBzYXZlSGlzdG9yeSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIFNpbmNlIHRoZSB1c2VyIHR5cGVkIHRoaXMsIGFwcGx5IGZhc3QtZGlyLXN3aXRjaFxuICAgICAgICAvLyBzaG9ydGN1dHMuXG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2FkdmFuY2VkLW9wZW4tZmlsZS5oZWxtRGlyU3dpdGNoJykpIHtcbiAgICAgICAgICAgIGlmIChuZXdQYXRoLmRpcmVjdG9yeS5lbmRzV2l0aChuZXdQYXRoLnNlcCArIG5ld1BhdGguc2VwKSkge1xuICAgICAgICAgICAgICAgIG5ld1BhdGggPSBuZXdQYXRoLnJvb3QoKTtcbiAgICAgICAgICAgICAgICBzYXZlSGlzdG9yeSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1BhdGguZGlyZWN0b3J5LmVuZHNXaXRoKCd+JyArIG5ld1BhdGguc2VwKSkge1xuICAgICAgICAgICAgICAgIG5ld1BhdGggPSBuZXcgUGF0aChvc2Vudi5ob21lKCkgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICAgICAgc2F2ZUhpc3RvcnkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdQYXRoLmRpcmVjdG9yeS5lbmRzV2l0aCgnOicgKyBuZXdQYXRoLnNlcCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvamVjdFBhdGggPSBnZXRQcm9qZWN0UGF0aCgpO1xuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0UGF0aCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdQYXRoID0gbmV3IFBhdGgocHJvamVjdFBhdGggKyBuZXdQYXRoLnNlcCk7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVIaXN0b3J5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVBhdGgobmV3UGF0aCwge3NhdmVIaXN0b3J5OiBzYXZlSGlzdG9yeX0pO1xuICAgIH1cblxuICAgIHNlbGVjdFBhdGgobmV3UGF0aCkge1xuICAgICAgICBpZiAobmV3UGF0aC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgobmV3UGF0aC5hc0RpcmVjdG9yeSgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub3BlblBhdGgobmV3UGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVQYXRoKG5ld1BhdGgsIHtzYXZlSGlzdG9yeT10cnVlfT17fSkge1xuICAgICAgICBpZiAoc2F2ZUhpc3RvcnkpIHtcbiAgICAgICAgICAgIHRoaXMucGF0aEhpc3RvcnkucHVzaCh0aGlzLmN1cnJlbnRQYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBuZXdQYXRoO1xuICAgICAgICB0aGlzLnZpZXcuc2V0UGF0aChuZXdQYXRoKTtcblxuICAgICAgICAvLyBIaWRlIHBhcmVudCBpZiBmcmFnbWVudCBpc24ndCBlbXB0eS5cbiAgICAgICAgbGV0IGhpZGVQYXJlbnQgPSBuZXdQYXRoLmZyYWdtZW50ICE9PSAnJztcbiAgICAgICAgdGhpcy52aWV3LnNldFBhdGhMaXN0KG5ld1BhdGgubWF0Y2hpbmdQYXRocygpLCBoaWRlUGFyZW50KTtcbiAgICB9XG5cbiAgICBvcGVuUGF0aChwYXRoKSB7XG4gICAgICAgIGlmIChwYXRoLmV4aXN0cygpKSB7XG4gICAgICAgICAgICBpZiAocGF0aC5pc0ZpbGUoKSkge1xuICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aC5mdWxsKTtcbiAgICAgICAgICAgICAgICBlbWl0dGVyLmVtaXQoJ2RpZC1vcGVuLXBhdGgnLCBwYXRoLmZ1bGwpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF0b20uYmVlcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHBhdGguZnJhZ21lbnQpIHtcbiAgICAgICAgICAgIHBhdGguY3JlYXRlRGlyZWN0b3JpZXMoKTtcbiAgICAgICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2FkdmFuY2VkLW9wZW4tZmlsZS5jcmVhdGVGaWxlSW5zdGFudGx5JykpIHtcbiAgICAgICAgICAgICAgICBwYXRoLmNyZWF0ZUZpbGUoKTtcbiAgICAgICAgICAgICAgICBlbWl0dGVyLmVtaXQoJ2RpZC1jcmVhdGUtcGF0aCcsIHBhdGguZnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguZnVsbCk7XG4gICAgICAgICAgICBlbWl0dGVyLmVtaXQoJ2RpZC1vcGVuLXBhdGgnLCBwYXRoLmZ1bGwpO1xuICAgICAgICAgICAgdGhpcy5kZXRhY2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0b20uYmVlcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlUGF0aENvbXBvbmVudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhdGguaXNSb290KCkpIHtcbiAgICAgICAgICAgIGF0b20uYmVlcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoKHRoaXMuY3VycmVudFBhdGgucGFyZW50KCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkUHJvamVjdEZvbGRlcihmaWxlTmFtZSkge1xuICAgICAgICBsZXQgZm9sZGVyUGF0aCA9IG5ldyBQYXRoKGZpbGVOYW1lKTtcbiAgICAgICAgaWYgKGZvbGRlclBhdGguaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgYXRvbS5wcm9qZWN0LmFkZFBhdGgoZm9sZGVyUGF0aC5mdWxsKTtcbiAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdXRvY29tcGxldGUgdGhlIGN1cnJlbnQgaW5wdXQgdG8gdGhlIGxvbmdlc3QgY29tbW9uIHByZWZpeCBhbW9uZ1xuICAgICAqIHBhdGhzIG1hdGNoaW5nIHRoZSBjdXJyZW50IGlucHV0LiBJZiBubyBjaGFuZ2UgaXMgbWFkZSB0byB0aGVcbiAgICAgKiBjdXJyZW50IHBhdGgsIGJlZXAuXG4gICAgICovXG4gICAgYXV0b2NvbXBsZXRlKCkge1xuICAgICAgICBsZXQgbWF0Y2hpbmdQYXRocyA9IHRoaXMuY3VycmVudFBhdGgubWF0Y2hpbmdQYXRocyh0cnVlKTtcbiAgICAgICAgaWYgKG1hdGNoaW5nUGF0aHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBhdG9tLmJlZXAoKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaGluZ1BhdGhzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgbGV0IG5ld1BhdGggPSBtYXRjaGluZ1BhdGhzWzBdO1xuICAgICAgICAgICAgaWYgKG5ld1BhdGguaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGF0aChuZXdQYXRoLmFzRGlyZWN0b3J5KCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgobmV3UGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbmV3UGF0aCA9IFBhdGguY29tbW9uUHJlZml4KG1hdGNoaW5nUGF0aHMsIHRydWUpO1xuICAgICAgICAgICAgaWYgKG5ld1BhdGguZXF1YWxzKHRoaXMuY3VycmVudFBhdGgpKSB7XG4gICAgICAgICAgICAgICAgYXRvbS5iZWVwKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGF0aChuZXdQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmF0dGFjaCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uZmlybSgpIHtcbiAgICAgICAgbGV0IHNlbGVjdGVkUGF0aCA9IHRoaXMudmlldy5zZWxlY3RlZFBhdGgoKTtcbiAgICAgICAgaWYgKHNlbGVjdGVkUGF0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RQYXRoKHNlbGVjdGVkUGF0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFBhdGgodGhpcy5jdXJyZW50UGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25maXJtU2VsZWN0ZWRPckZpcnN0KCkge1xuICAgICAgICBsZXQgc2VsZWN0ZWRQYXRoID0gdGhpcy52aWV3LnNlbGVjdGVkUGF0aCgpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRQYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdFBhdGgoc2VsZWN0ZWRQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmaXJzdFBhdGggPSB0aGlzLnZpZXcuZmlyc3RQYXRoKCk7XG4gICAgICAgICAgICBpZiAoZmlyc3RQYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RQYXRoKGZpcnN0UGF0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0UGF0aCh0aGlzLmN1cnJlbnRQYXRoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5kbygpIHtcbiAgICAgICAgaWYgKHRoaXMucGF0aEhpc3RvcnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYXRoKHRoaXMucGF0aEhpc3RvcnkucG9wKCksIHtzYXZlSGlzdG9yeTogZmFsc2V9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpbml0aWFsUGF0aCA9IFBhdGguaW5pdGlhbCgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYXRoLmVxdWFscyhpbml0aWFsUGF0aCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhdGgoaW5pdGlhbFBhdGgsIHtzYXZlSGlzdG9yeTogZmFsc2V9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXRvbS5iZWVwKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlQ3Vyc29yRG93bigpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy52aWV3LmN1cnNvckluZGV4O1xuICAgICAgICBpZiAoaW5kZXggPT09IG51bGwgfHwgaW5kZXggPT09IHRoaXMudmlldy5wYXRoTGlzdExlbmd0aCgpIC0gMSkge1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlldy5zZXRDdXJzb3JJbmRleChpbmRleCk7XG4gICAgfVxuXG4gICAgbW92ZUN1cnNvclVwKCkge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnZpZXcuY3Vyc29ySW5kZXg7XG4gICAgICAgIGlmIChpbmRleCA9PT0gbnVsbCB8fCBpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLnZpZXcucGF0aExpc3RMZW5ndGgoKSAtIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmRleC0tO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52aWV3LnNldEN1cnNvckluZGV4KGluZGV4KTtcbiAgICB9XG5cbiAgICBkZXRhY2goKSB7XG4gICAgICAgIGlmICh0aGlzLnBhbmVsID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZSgpO1xuICAgIH1cblxuICAgIGF0dGFjaCgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFuZWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGF0aEhpc3RvcnkgPSBbXTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXRoKFBhdGguaW5pdGlhbCgpLCB7c2F2ZUhpc3Rvcnk6IGZhbHNlfSk7XG4gICAgICAgIHRoaXMucGFuZWwgPSB0aGlzLnZpZXcuY3JlYXRlTW9kYWxQYW5lbCgpO1xuICAgIH1cbn1cbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/lib/controller.js
