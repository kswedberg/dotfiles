function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _osenv = require('osenv');

var _osenv2 = _interopRequireDefault(_osenv);

var _libAdvancedOpenFile = require('../lib/advanced-open-file');

var _libConfig = require('../lib/config');

var _libModels = require('../lib/models');

_temp2['default'].track();

describe('Functional tests', function () {
    var workspaceElement = null;
    var activationPromise = null;
    var ui = null;
    var pathEditor = null;

    beforeEach(function () {
        workspaceElement = atom.views.getView(atom.workspace);
        jasmine.attachToDOM(workspaceElement);

        activationPromise = atom.packages.activatePackage('advanced-open-file');
    });

    function getUI() {
        return workspaceElement.querySelector('.advanced-open-file');
    }

    function fixturePath() {
        for (var _len = arguments.length, parts = Array(_len), _key = 0; _key < _len; _key++) {
            parts[_key] = arguments[_key];
        }

        return _path2['default'].join.apply(_path2['default'], [__dirname, 'fixtures'].concat(parts));
    }

    function setPath(newPath) {
        pathEditor.setText(newPath);
    }

    function currentPath() {
        return pathEditor.getText();
    }

    function dispatch(command) {
        atom.commands.dispatch(ui[0], command);
    }

    function currentPathList() {
        return ui.find('.list-item:not(.hidden)').map(function (i, item) {
            return (0, _jquery2['default'])(item).text().trim();
        }).get();
    }

    function currentEditorPaths() {
        return atom.workspace.getTextEditors().map(function (editor) {
            return editor.getPath();
        });
    }

    function waitsForOpenPaths(count) {
        var timeout = arguments.length <= 1 || arguments[1] === undefined ? 2000 : arguments[1];

        waitsFor(function () {
            return currentEditorPaths().length >= count;
        }, count + ' paths to be opened', timeout);
    }

    function openModal() {
        atom.commands.dispatch(workspaceElement, 'advanced-open-file:toggle');
        waitsForPromise(function () {
            return activationPromise.then(function () {
                ui = (0, _jquery2['default'])(getUI());
                pathEditor = ui.find('.path-input')[0].getModel();
            });
        });
    }

    function resetConfig() {
        atom.config.unset('advanced-open-file.createFileInstantly');
        atom.config.unset('advanced-open-file.helmDirSwitch');
        atom.config.unset('advanced-open-file.defaultInputValue');
    }

    function fileExists(path) {
        try {
            _fs2['default'].statSync(path);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
        }

        return true;
    }

    function clickFile(filename) {
        ui.find('.list-item[data-file-name$=\'' + filename + '\']').click();
    }

    describe('Modal dialog', function () {
        beforeEach(resetConfig);

        it('appears when the toggle command is triggered', function () {
            openModal();
            runs(function () {
                expect(getUI()).not.toBeNull();
            });
        });

        it('disappears if the toggle command is triggered while it is visible', function () {
            openModal();
            runs(function () {
                atom.commands.dispatch(workspaceElement, 'advanced-open-file:toggle');
                expect(getUI()).toBeNull();
            });
        });

        it('disappears if the cancel command is triggered while it is visible', function () {
            openModal();
            runs(function () {
                dispatch('core:cancel');
                expect(getUI()).toBeNull();
            });
        });

        it('disappears if the user clicks outside of the modal', function () {
            openModal();
            runs(function () {
                ui.parent().click();
                expect(getUI()).toBeNull();
            });
        });
    });

    describe('Path listing', function () {
        beforeEach(resetConfig);
        beforeEach(openModal);

        it('lists the directory contents if the path ends in a separator', function () {
            setPath(fixturePath() + _path2['default'].sep);

            // Also includes the parent directory and is sorted alphabetically
            // grouped by directories and files.
            expect(currentPathList()).toEqual(['..', 'examples', 'prefix_match.js', 'prefix_other_match.js', 'sample.js']);
        });

        it('lists matching files if the path doesn\'t end in a separator', function () {
            setPath(fixturePath('prefix'));

            // Also shouldn't include the parent.
            expect(currentPathList()).toEqual(['prefix_match.js', 'prefix_other_match.js']);
        });

        it('excludes files that don\'t have a prefix matching the fragment', function () {
            setPath(fixturePath('prefix_match'));
            expect(currentPathList()).toEqual(['prefix_match.js']);
        });

        it('considers relative paths to be relative to the project root', function () {
            atom.project.setPaths([fixturePath()]);
            setPath(_path2['default'].join('examples', 'subdir') + _path2['default'].sep);
            expect(currentPathList()).toEqual(['..', 'subsample.js']);
        });

        it('automatically updates when the path changes', function () {
            setPath(fixturePath('prefix'));
            expect(currentPathList()).toEqual(['prefix_match.js', 'prefix_other_match.js']);

            setPath(fixturePath('prefix_match'));
            expect(currentPathList()).toEqual(['prefix_match.js']);
        });

        it('matches files case-insensitively unless the fragment contains a\n            capital', function () {
            setPath(fixturePath('examples', 'caseSensitive', 'prefix_match'));
            expect(currentPathList()).toEqual(['prefix_match_lower.js', 'prefix_Match_upper.js']);

            setPath(fixturePath('examples', 'caseSensitive', 'prefix_Match'));
            expect(currentPathList()).toEqual(['prefix_Match_upper.js']);
        });

        it('shows a button next to folders that can be clicked to add them as\n            project folders', function () {
            atom.project.setPaths([]);
            setPath(fixturePath() + path.sep);

            var exampleListItem = ui.find('.list-item[data-file-name$=\'examples\']');
            var addProjectFolderButton = exampleListItem.find('.add-project-folder');
            expect(addProjectFolderButton.length).toEqual(1);

            addProjectFolderButton.click();
            expect(atom.project.getPaths()).toEqual([fixturePath('examples')]);
        });

        it('does not show the add-project-folder button for folders that are\n            already project folders', function () {
            atom.project.setPaths([fixturePath('examples')]);
            setPath(fixturePath() + path.sep);

            var exampleListItem = ui.find('.list-item[data-file-name$=\'examples\']');
            var addProjectFolderButton = exampleListItem.find('.add-project-folder');
            expect(addProjectFolderButton.length).toEqual(0);
        });
    });

    describe('Path input', function () {
        beforeEach(resetConfig);
        beforeEach(openModal);

        function assertAutocompletesTo(inputPath, autocompletedPath) {
            setPath(inputPath);
            dispatch('advanced-open-file:autocomplete');
            expect(currentPath()).toEqual(autocompletedPath);
        }

        it('can autocomplete the current input', function () {
            assertAutocompletesTo(fixturePath('prefix_ma'), fixturePath('prefix_match.js'));
        });

        it('can autocomplete the shared parts between two matching paths', function () {
            assertAutocompletesTo(fixturePath('pre'), fixturePath('prefix_'));
        });

        it('inserts a trailing separator when autocompleting a directory', function () {
            assertAutocompletesTo(fixturePath('exam'), fixturePath('examples') + _path2['default'].sep);
        });

        it('beeps if autocomplete finds no matchs', function () {
            spyOn(atom, 'beep');
            setPath(fixturePath('does_not_exist'));

            dispatch('advanced-open-file:autocomplete');
            expect(currentPath()).toEqual(fixturePath('does_not_exist'));
            expect(atom.beep).toHaveBeenCalled();
        });

        it('beeps if autocomplete cannot autocomplete any more shared parts', function () {
            spyOn(atom, 'beep');
            setPath(fixturePath('prefix_'));

            dispatch('advanced-open-file:autocomplete');
            expect(currentPath()).toEqual(fixturePath('prefix_'));
            expect(atom.beep).toHaveBeenCalled();
        });

        it('is case-sensitive during autocomplete if the fragment has a capital\n            letter', function () {
            setPath(fixturePath('examples', 'caseSensitive', 'prefix_m'));
            dispatch('advanced-open-file:autocomplete');
            expect(currentPath()).toEqual(fixturePath('examples', 'caseSensitive', 'prefix_match_'));

            setPath(fixturePath('examples', 'caseSensitive', 'prefix_M'));
            dispatch('advanced-open-file:autocomplete');
            expect(currentPath()).toEqual(fixturePath('examples', 'caseSensitive', 'prefix_Match_upper.js'));
        });

        it('fixes the case of letters in the fragment if necessary', function () {
            assertAutocompletesTo(fixturePath('examples', 'caseSensitive', 'prefix_match_up'), fixturePath('examples', 'caseSensitive', 'prefix_Match_upper.js'));
        });

        it('can remove the current path component', function () {
            setPath(fixturePath('fragment'));
            dispatch('advanced-open-file:delete-path-component');

            // Leaves trailing slash, as well.
            expect(currentPath()).toEqual(fixturePath() + _path2['default'].sep);
        });

        it('removes the parent directory when removing a path component with no\n            fragment', function () {
            setPath(fixturePath('subdir') + _path2['default'].sep);
            dispatch('advanced-open-file:delete-path-component');
            expect(currentPath()).toEqual(fixturePath() + _path2['default'].sep);
        });

        it('can switch to the user\'s home directory using a shortcut', function () {
            atom.config.set('advanced-open-file.helmDirSwitch', true);
            setPath(fixturePath('subdir') + '~' + _path2['default'].sep);
            expect(currentPath()).toEqual(_osenv2['default'].home() + _path2['default'].sep);
        });

        it('can switch to the filesystem root using a shortcut', function () {
            // For cross-platformness, we cheat by using Path. Oh well.
            var fsRoot = new _libModels.Path(fixturePath('subdir')).root().full;

            atom.config.set('advanced-open-file.helmDirSwitch', true);
            setPath(fixturePath('subdir') + _path2['default'].sep + _path2['default'].sep);
            expect(currentPath()).toEqual(fsRoot);
        });

        it('can switch to the project root directory using a shortcut', function () {
            atom.config.set('advanced-open-file.helmDirSwitch', true);
            atom.project.setPaths([fixturePath('examples')]);
            setPath(fixturePath('subdir') + ':' + _path2['default'].sep);
            expect(currentPath()).toEqual(fixturePath('examples') + _path2['default'].sep);
        });
    });

    describe('Path input default value', function () {
        beforeEach(resetConfig);

        it('can be configured to be the current file\'s directory', function () {
            atom.config.set('advanced-open-file.defaultInputValue', _libConfig.DEFAULT_ACTIVE_FILE_DIR);
            waitsForPromise(function () {
                return atom.workspace.open(fixturePath('sample.js')).then(function () {
                    openModal();
                });
            });

            runs(function () {
                expect(currentPath()).toEqual(fixturePath() + _path2['default'].sep);
            });
        });

        it('can be configured to be the current project root', function () {
            atom.config.set('advanced-open-file.defaultInputValue', _libConfig.DEFAULT_PROJECT_ROOT);
            atom.project.setPaths([fixturePath('examples')]);
            openModal();

            runs(function () {
                expect(currentPath()).toEqual(fixturePath('examples') + _path2['default'].sep);
            });
        });

        it('can be configured to be blank', function () {
            atom.config.set('advanced-open-file.defaultInputValue', _libConfig.DEFAULT_EMPTY);
            openModal();

            runs(function () {
                expect(currentPath()).toEqual('');
            });
        });
    });

    describe('Undo', function () {
        beforeEach(resetConfig);
        beforeEach(openModal);

        it('can undo tab completion', function () {
            setPath(fixturePath('exam'));
            dispatch('advanced-open-file:autocomplete');
            expect(currentPath()).toEqual(fixturePath('examples') + path.sep);
            dispatch('advanced-open-file:undo');
            expect(currentPath()).toEqual(fixturePath('exam'));
        });

        it('can undo deleting path components', function () {
            setPath(fixturePath('exam'));
            dispatch('advanced-open-file:delete-path-component');
            expect(currentPath()).toEqual(fixturePath() + path.sep);
            dispatch('advanced-open-file:undo');
            expect(currentPath()).toEqual(fixturePath('exam'));
        });

        it('can undo clicking a folder', function () {
            setPath(fixturePath() + path.sep);
            clickFile('examples');
            expect(currentPath()).toEqual(fixturePath('examples') + path.sep);
            dispatch('advanced-open-file:undo');
            expect(currentPath()).toEqual(fixturePath() + path.sep);
        });

        it('beeps when it cannot undo any farther', function () {
            spyOn(atom, 'beep');
            dispatch('advanced-open-file:undo');
            expect(atom.beep).toHaveBeenCalled();
        });
    });

    describe('Opening files', function () {
        beforeEach(resetConfig);
        beforeEach(openModal);

        it('opens an existing file if the current path points to one', function () {
            var path = fixturePath('sample.js');
            setPath(path);
            dispatch('core:confirm');

            waitsForOpenPaths(1);
            runs(function () {
                expect(currentEditorPaths()).toEqual([path]);
            });
        });

        it('replaces the path when attempting to open an existing directory', function () {
            setPath(fixturePath('examples'));
            dispatch('core:confirm');
            expect(currentPath()).toEqual(fixturePath('examples') + path.sep);
        });

        it('beeps when attempting to open a path ending in a separator (a\n            non-existant directory)', function () {
            spyOn(atom, 'beep');
            setPath(fixturePath('notthere') + _path2['default'].sep);
            dispatch('core:confirm');
            expect(atom.beep).toHaveBeenCalled();
        });

        it('opens a new file without saving it if opening a non-existant path', function () {
            var path = fixturePath('does.not.exist');
            setPath(path);
            dispatch('core:confirm');

            waitsForOpenPaths(1);
            runs(function () {
                expect(currentEditorPaths()).toEqual([path]);
                expect(fileExists(path)).toEqual(false);
            });
        });

        it('creates a new file when configured to', function () {
            var tempDir = _fs2['default'].realpathSync(_temp2['default'].mkdirSync());
            var path = _path2['default'].join(tempDir, 'newfile.js');
            atom.config.set('advanced-open-file.createFileInstantly', true);
            setPath(path);
            expect(fileExists(path)).toEqual(false);

            dispatch('core:confirm');
            waitsForOpenPaths(1);
            runs(function () {
                expect(currentEditorPaths()).toEqual([path]);
                expect(fileExists(path)).toEqual(true);
            });
        });

        it('creates intermediate directories when necessary', function () {
            var tempDir = _fs2['default'].realpathSync(_temp2['default'].mkdirSync());
            var newDir = _path2['default'].join(tempDir, 'newDir');
            var path = _path2['default'].join(newDir, 'newFile.js');
            setPath(path);
            expect(fileExists(newDir)).toEqual(false);

            dispatch('core:confirm');
            waitsForOpenPaths(1);
            runs(function () {
                expect(currentEditorPaths()).toEqual([path]);
                expect(fileExists(newDir)).toEqual(true);
            });
        });

        it('can create files from relative paths', function () {
            var tempDir = _fs2['default'].realpathSync(_temp2['default'].mkdirSync());
            var path = _path2['default'].join('newDir', 'newFile.js');
            var absolutePath = _path2['default'].join(tempDir, path);

            atom.project.setPaths([tempDir]);
            atom.config.set('advanced-open-file.createFileInstantly', true);

            setPath(path);
            expect(fileExists(absolutePath)).toEqual(false);

            dispatch('core:confirm');
            waitsForOpenPaths(1);
            runs(function () {
                expect(currentEditorPaths()).toEqual([absolutePath]);
                expect(fileExists(absolutePath)).toEqual(true);
            });
        });
    });

    describe('Keyboard navigation', function () {
        beforeEach(resetConfig);
        beforeEach(openModal);

        /*
            For reference, expected listing in fixtures is:
            ..
            examples
            prefix_match.js
            prefix_other_match.js
            sample.js
        */

        function moveDown(times) {
            for (var k = 0; k < times; k++) {
                dispatch('advanced-open-file:move-cursor-down');
            }
        }

        function moveUp(times) {
            for (var k = 0; k < times; k++) {
                dispatch('advanced-open-file:move-cursor-up');
            }
        }

        it('allows moving a cursor to a file and confirming to select a path', function () {
            setPath(fixturePath() + _path2['default'].sep);
            moveDown(4);
            moveUp(1); // Test movement both down and up.
            dispatch('core:confirm');

            waitsForOpenPaths(1);
            runs(function () {
                expect(currentEditorPaths()).toEqual([fixturePath('prefix_match.js')]);
            });
        });

        it('wraps the cursor at the edges', function () {
            setPath(fixturePath() + _path2['default'].sep);
            moveUp(2);
            moveDown(4);
            moveUp(5);
            dispatch('core:confirm');

            waitsForOpenPaths(1);
            runs(function () {
                expect(currentEditorPaths()).toEqual([fixturePath('prefix_match.js')]);
            });
        });

        it('replaces the current path when selecting a directory', function () {
            setPath(fixturePath() + path.sep);
            moveDown(2);
            dispatch('core:confirm');
            expect(currentPath()).toEqual(fixturePath('examples') + path.sep);
        });

        it('moves to the parent directory when the .. element is selected', function () {
            setPath(fixturePath('examples') + path.sep);
            moveDown(1);
            dispatch('core:confirm');
            expect(currentPath()).toEqual(fixturePath() + path.sep);
        });

        it('can select the first item in the list if none are selected using\n            special command', function () {
            setPath(fixturePath('prefix'));
            dispatch('advanced-open-file:confirm-selected-or-first');

            waitsForOpenPaths(1);
            runs(function () {
                expect(currentEditorPaths()).toEqual([fixturePath('prefix_match.js')]);
            });
        });
    });

    describe('Mouse navigation', function () {
        beforeEach(resetConfig);
        beforeEach(openModal);

        it('opens a path when it is clicked on', function () {
            setPath(fixturePath() + _path2['default'].sep);
            clickFile('sample.js');

            waitsForOpenPaths(1);
            runs(function () {
                expect(currentEditorPaths()).toEqual([fixturePath('sample.js')]);
            });
        });

        it('replaces the current path when clicking a directory', function () {
            setPath(fixturePath() + path.sep);
            clickFile('examples');
            expect(currentPath()).toEqual(fixturePath('examples') + path.sep);
        });

        it('moves to the parent directory when the .. element is clicked', function () {
            setPath(fixturePath('examples') + path.sep);
            ui.find('.parent-directory').click();
            expect(currentPath()).toEqual(fixturePath() + path.sep);
        });
    });

    describe('Events', function () {
        beforeEach(resetConfig);
        beforeEach(openModal);

        it('allows subscription to events when paths are opened', function () {
            var handler = jasmine.createSpy('handler');
            var sub = (0, _libAdvancedOpenFile.onDidOpenPath)(handler);
            var path = fixturePath('sample.js');

            setPath(path);
            dispatch('core:confirm');
            expect(handler).toHaveBeenCalledWith(path);
            sub.dispose();
        });

        it('allows subscription to events when paths are created', function () {
            atom.config.set('advanced-open-file.createFileInstantly', true);
            var tempDir = _fs2['default'].realpathSync(_temp2['default'].mkdirSync());
            var path = _path2['default'].join(tempDir, 'newfile.js');
            var handler = jasmine.createSpy('handler');
            var sub = (0, _libAdvancedOpenFile.onDidCreatePath)(handler);

            setPath(path);
            dispatch('core:confirm');
            expect(handler).toHaveBeenCalledWith(path);
            sub.dispose();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL3NwZWMvYWR2YW5jZWQtb3Blbi1maWxlLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztrQkFDZSxJQUFJOzs7O29CQUNDLE1BQU07Ozs7b0JBQ1QsTUFBTTs7OztzQkFFVCxRQUFROzs7O3FCQUNKLE9BQU87Ozs7bUNBRW9CLDJCQUEyQjs7eUJBS2pFLGVBQWU7O3lCQUNILGVBQWU7O0FBWFQsa0JBQUssS0FBSyxFQUFFLENBQUM7O0FBY3RDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxZQUFNO0FBQy9CLFFBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFFBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFFBQUksRUFBRSxHQUFHLElBQUksQ0FBQztBQUNkLFFBQUksVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdEIsY0FBVSxDQUFDLFlBQU07QUFDYix3QkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQsZUFBTyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV0Qyx5QkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQzNFLENBQUMsQ0FBQzs7QUFFSCxhQUFTLEtBQUssR0FBRztBQUNiLGVBQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDaEU7O0FBRUQsYUFBUyxXQUFXLEdBQVc7MENBQVAsS0FBSztBQUFMLGlCQUFLOzs7QUFDekIsZUFBTyxrQkFBUSxJQUFJLE1BQUEscUJBQUMsU0FBUyxFQUFFLFVBQVUsU0FBSyxLQUFLLEVBQUMsQ0FBQztLQUN4RDs7QUFFRCxhQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDdEIsa0JBQVUsQ0FBQyxPQUFP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QUcsa0JBQVEsSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMvQyxnQkFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQyxnQkFBSSxHQUFHLEdBQUcsMENBQWdCLE9BQU8sQ0FBQyxDQUFDOztBQUVuQyxtQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2Qsb0JBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN6QixrQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLGVBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNqQixDQUFDLENBQUM7S0FDTixDQUFDLENBQUM7Q0FDTixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvc3BlYy9hZHZhbmNlZC1vcGVuLWZpbGUtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgc3RkUGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnOyB0ZW1wLnRyYWNrKCk7XG5cbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgb3NlbnYgZnJvbSAnb3NlbnYnO1xuXG5pbXBvcnQge29uRGlkQ3JlYXRlUGF0aCwgb25EaWRPcGVuUGF0aH0gZnJvbSAnLi4vbGliL2FkdmFuY2VkLW9wZW4tZmlsZSc7XG5pbXBvcnQge1xuICAgIERFRkFVTFRfQUNUSVZFX0ZJTEVfRElSLFxuICAgIERFRkFVTFRfRU1QVFksXG4gICAgREVGQVVMVF9QUk9KRUNUX1JPT1Rcbn0gZnJvbSAnLi4vbGliL2NvbmZpZyc7XG5pbXBvcnQge1BhdGh9IGZyb20gJy4uL2xpYi9tb2RlbHMnO1xuXG5cbmRlc2NyaWJlKCdGdW5jdGlvbmFsIHRlc3RzJywgKCkgPT4ge1xuICAgIGxldCB3b3Jrc3BhY2VFbGVtZW50ID0gbnVsbDtcbiAgICBsZXQgYWN0aXZhdGlvblByb21pc2UgPSBudWxsO1xuICAgIGxldCB1aSA9IG51bGw7XG4gICAgbGV0IHBhdGhFZGl0b3IgPSBudWxsO1xuXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpO1xuXG4gICAgICAgIGFjdGl2YXRpb25Qcm9taXNlID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2FkdmFuY2VkLW9wZW4tZmlsZScpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gZ2V0VUkoKSB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZHZhbmNlZC1vcGVuLWZpbGUnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaXh0dXJlUGF0aCguLi5wYXJ0cykge1xuICAgICAgICByZXR1cm4gc3RkUGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgLi4ucGFydHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFBhdGgobmV3UGF0aCkge1xuICAgICAgICBwYXRoRWRpdG9yLnNldFRleHQobmV3UGF0aCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3VycmVudFBhdGgoKSB7XG4gICAgICAgIHJldHVybiBwYXRoRWRpdG9yLmdldFRleHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNwYXRjaChjb21tYW5kKSB7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godWlbMF0sIGNvbW1hbmQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnRQYXRoTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHVpLmZpbmQoJy5saXN0LWl0ZW06bm90KC5oaWRkZW4pJylcbiAgICAgICAgICAgICAgICAgLm1hcCgoaSwgaXRlbSkgPT4gJChpdGVtKS50ZXh0KCkudHJpbSgpKVxuICAgICAgICAgICAgICAgICAuZ2V0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3VycmVudEVkaXRvclBhdGhzKCkge1xuICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5tYXAoKGVkaXRvcikgPT4gZWRpdG9yLmdldFBhdGgoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2FpdHNGb3JPcGVuUGF0aHMoY291bnQsIHRpbWVvdXQ9MjAwMCkge1xuICAgICAgICB3YWl0c0ZvcihcbiAgICAgICAgICAgICgpID0+IGN1cnJlbnRFZGl0b3JQYXRocygpLmxlbmd0aCA+PSBjb3VudCxcbiAgICAgICAgICAgIGAke2NvdW50fSBwYXRocyB0byBiZSBvcGVuZWRgLFxuICAgICAgICAgICAgdGltZW91dFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9wZW5Nb2RhbCgpIHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYWR2YW5jZWQtb3Blbi1maWxlOnRvZ2dsZScpO1xuICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGFjdGl2YXRpb25Qcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHVpID0gJChnZXRVSSgpKTtcbiAgICAgICAgICAgICAgICBwYXRoRWRpdG9yID0gdWkuZmluZCgnLnBhdGgtaW5wdXQnKVswXS5nZXRNb2RlbCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2V0Q29uZmlnKCkge1xuICAgICAgICBhdG9tLmNvbmZpZy51bnNldCgnYWR2YW5jZWQtb3Blbi1maWxlLmNyZWF0ZUZpbGVJbnN0YW50bHknKTtcbiAgICAgICAgYXRvbS5jb25maWcudW5zZXQoJ2FkdmFuY2VkLW9wZW4tZmlsZS5oZWxtRGlyU3dpdGNoJyk7XG4gICAgICAgIGF0b20uY29uZmlnLnVuc2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuZGVmYXVsdElucHV0VmFsdWUnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWxlRXhpc3RzKHBhdGgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZzLnN0YXRTeW5jKHBhdGgpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGlja0ZpbGUoZmlsZW5hbWUpIHtcbiAgICAgICAgdWkuZmluZChgLmxpc3QtaXRlbVtkYXRhLWZpbGUtbmFtZSQ9JyR7ZmlsZW5hbWV9J11gKS5jbGljaygpO1xuICAgIH1cblxuICAgIGRlc2NyaWJlKCdNb2RhbCBkaWFsb2cnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2gocmVzZXRDb25maWcpO1xuXG4gICAgICAgIGl0KCdhcHBlYXJzIHdoZW4gdGhlIHRvZ2dsZSBjb21tYW5kIGlzIHRyaWdnZXJlZCcsICgpID0+IHtcbiAgICAgICAgICAgIG9wZW5Nb2RhbCgpXG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QoZ2V0VUkoKSkubm90LnRvQmVOdWxsKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2Rpc2FwcGVhcnMgaWYgdGhlIHRvZ2dsZSBjb21tYW5kIGlzIHRyaWdnZXJlZCB3aGlsZSBpdCBpcyB2aXNpYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgb3Blbk1vZGFsKCk7XG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdhZHZhbmNlZC1vcGVuLWZpbGU6dG9nZ2xlJyk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGdldFVJKCkpLnRvQmVOdWxsKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2Rpc2FwcGVhcnMgaWYgdGhlIGNhbmNlbCBjb21tYW5kIGlzIHRyaWdnZXJlZCB3aGlsZSBpdCBpcyB2aXNpYmxlJywgKCkgPT4ge1xuICAgICAgICAgICAgb3Blbk1vZGFsKCk7XG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCgnY29yZTpjYW5jZWwnKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZ2V0VUkoKSkudG9CZU51bGwoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnZGlzYXBwZWFycyBpZiB0aGUgdXNlciBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgbW9kYWwnLCAoKSA9PiB7XG4gICAgICAgICAgICBvcGVuTW9kYWwoKTtcbiAgICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHVpLnBhcmVudCgpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGdldFVJKCkpLnRvQmVOdWxsKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnUGF0aCBsaXN0aW5nJywgKCkgPT4ge1xuICAgICAgICBiZWZvcmVFYWNoKHJlc2V0Q29uZmlnKTtcbiAgICAgICAgYmVmb3JlRWFjaChvcGVuTW9kYWwpO1xuXG4gICAgICAgIGl0KCdsaXN0cyB0aGUgZGlyZWN0b3J5IGNvbnRlbnRzIGlmIHRoZSBwYXRoIGVuZHMgaW4gYSBzZXBhcmF0b3InLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCkgKyBzdGRQYXRoLnNlcCk7XG5cbiAgICAgICAgICAgIC8vIEFsc28gaW5jbHVkZXMgdGhlIHBhcmVudCBkaXJlY3RvcnkgYW5kIGlzIHNvcnRlZCBhbHBoYWJldGljYWxseVxuICAgICAgICAgICAgLy8gZ3JvdXBlZCBieSBkaXJlY3RvcmllcyBhbmQgZmlsZXMuXG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGhMaXN0KCkpLnRvRXF1YWwoW1xuICAgICAgICAgICAgICAgICcuLicsXG4gICAgICAgICAgICAgICAgJ2V4YW1wbGVzJyxcbiAgICAgICAgICAgICAgICAncHJlZml4X21hdGNoLmpzJyxcbiAgICAgICAgICAgICAgICAncHJlZml4X290aGVyX21hdGNoLmpzJyxcbiAgICAgICAgICAgICAgICAnc2FtcGxlLmpzJ1xuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdsaXN0cyBtYXRjaGluZyBmaWxlcyBpZiB0aGUgcGF0aCBkb2VzblxcJ3QgZW5kIGluIGEgc2VwYXJhdG9yJywgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgncHJlZml4JykpO1xuXG4gICAgICAgICAgICAvLyBBbHNvIHNob3VsZG4ndCBpbmNsdWRlIHRoZSBwYXJlbnQuXG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGhMaXN0KCkpLnRvRXF1YWwoW1xuICAgICAgICAgICAgICAgICdwcmVmaXhfbWF0Y2guanMnLFxuICAgICAgICAgICAgICAgICdwcmVmaXhfb3RoZXJfbWF0Y2guanMnXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2V4Y2x1ZGVzIGZpbGVzIHRoYXQgZG9uXFwndCBoYXZlIGEgcHJlZml4IG1hdGNoaW5nIHRoZSBmcmFnbWVudCcsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ3ByZWZpeF9tYXRjaCcpKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aExpc3QoKSkudG9FcXVhbChbJ3ByZWZpeF9tYXRjaC5qcyddKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NvbnNpZGVycyByZWxhdGl2ZSBwYXRocyB0byBiZSByZWxhdGl2ZSB0byB0aGUgcHJvamVjdCByb290JywgKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFtmaXh0dXJlUGF0aCgpXSk7XG4gICAgICAgICAgICBzZXRQYXRoKHN0ZFBhdGguam9pbignZXhhbXBsZXMnLCAnc3ViZGlyJykgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGhMaXN0KCkpLnRvRXF1YWwoWycuLicsICdzdWJzYW1wbGUuanMnXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdhdXRvbWF0aWNhbGx5IHVwZGF0ZXMgd2hlbiB0aGUgcGF0aCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgncHJlZml4JykpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoTGlzdCgpKS50b0VxdWFsKFtcbiAgICAgICAgICAgICAgICAncHJlZml4X21hdGNoLmpzJyxcbiAgICAgICAgICAgICAgICAncHJlZml4X290aGVyX21hdGNoLmpzJ1xuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ3ByZWZpeF9tYXRjaCcpKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aExpc3QoKSkudG9FcXVhbChbJ3ByZWZpeF9tYXRjaC5qcyddKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoYG1hdGNoZXMgZmlsZXMgY2FzZS1pbnNlbnNpdGl2ZWx5IHVubGVzcyB0aGUgZnJhZ21lbnQgY29udGFpbnMgYVxuICAgICAgICAgICAgY2FwaXRhbGAsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ2V4YW1wbGVzJywgJ2Nhc2VTZW5zaXRpdmUnLCAncHJlZml4X21hdGNoJykpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoTGlzdCgpKS50b0VxdWFsKFtcbiAgICAgICAgICAgICAgICAncHJlZml4X21hdGNoX2xvd2VyLmpzJyxcbiAgICAgICAgICAgICAgICAncHJlZml4X01hdGNoX3VwcGVyLmpzJ1xuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ2V4YW1wbGVzJywgJ2Nhc2VTZW5zaXRpdmUnLCAncHJlZml4X01hdGNoJykpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoTGlzdCgpKS50b0VxdWFsKFsncHJlZml4X01hdGNoX3VwcGVyLmpzJ10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChgc2hvd3MgYSBidXR0b24gbmV4dCB0byBmb2xkZXJzIHRoYXQgY2FuIGJlIGNsaWNrZWQgdG8gYWRkIHRoZW0gYXNcbiAgICAgICAgICAgIHByb2plY3QgZm9sZGVyc2AsICgpID0+IHtcbiAgICAgICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbXSk7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCkgKyBwYXRoLnNlcCk7XG5cbiAgICAgICAgICAgIGxldCBleGFtcGxlTGlzdEl0ZW0gPSB1aS5maW5kKCcubGlzdC1pdGVtW2RhdGEtZmlsZS1uYW1lJD1cXCdleGFtcGxlc1xcJ10nKTtcbiAgICAgICAgICAgIGxldCBhZGRQcm9qZWN0Rm9sZGVyQnV0dG9uID0gZXhhbXBsZUxpc3RJdGVtLmZpbmQoJy5hZGQtcHJvamVjdC1mb2xkZXInKTtcbiAgICAgICAgICAgIGV4cGVjdChhZGRQcm9qZWN0Rm9sZGVyQnV0dG9uLmxlbmd0aCkudG9FcXVhbCgxKTtcblxuICAgICAgICAgICAgYWRkUHJvamVjdEZvbGRlckJ1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgZXhwZWN0KGF0b20ucHJvamVjdC5nZXRQYXRocygpKS50b0VxdWFsKFtmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChgZG9lcyBub3Qgc2hvdyB0aGUgYWRkLXByb2plY3QtZm9sZGVyIGJ1dHRvbiBmb3IgZm9sZGVycyB0aGF0IGFyZVxuICAgICAgICAgICAgYWxyZWFkeSBwcm9qZWN0IGZvbGRlcnNgLCAoKSA9PiB7XG4gICAgICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW2ZpeHR1cmVQYXRoKCdleGFtcGxlcycpXSk7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCkgKyBwYXRoLnNlcCk7XG5cbiAgICAgICAgICAgIGxldCBleGFtcGxlTGlzdEl0ZW0gPSB1aS5maW5kKCcubGlzdC1pdGVtW2RhdGEtZmlsZS1uYW1lJD1cXCdleGFtcGxlc1xcJ10nKTtcbiAgICAgICAgICAgIGxldCBhZGRQcm9qZWN0Rm9sZGVyQnV0dG9uID0gZXhhbXBsZUxpc3RJdGVtLmZpbmQoJy5hZGQtcHJvamVjdC1mb2xkZXInKTtcbiAgICAgICAgICAgIGV4cGVjdChhZGRQcm9qZWN0Rm9sZGVyQnV0dG9uLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnUGF0aCBpbnB1dCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaChyZXNldENvbmZpZyk7XG4gICAgICAgIGJlZm9yZUVhY2gob3Blbk1vZGFsKTtcblxuICAgICAgICBmdW5jdGlvbiBhc3NlcnRBdXRvY29tcGxldGVzVG8oaW5wdXRQYXRoLCBhdXRvY29tcGxldGVkUGF0aCkge1xuICAgICAgICAgICAgc2V0UGF0aChpbnB1dFBhdGgpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTphdXRvY29tcGxldGUnKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGF1dG9jb21wbGV0ZWRQYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0KCdjYW4gYXV0b2NvbXBsZXRlIHRoZSBjdXJyZW50IGlucHV0JywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0QXV0b2NvbXBsZXRlc1RvKFxuICAgICAgICAgICAgICAgIGZpeHR1cmVQYXRoKCdwcmVmaXhfbWEnKSxcbiAgICAgICAgICAgICAgICBmaXh0dXJlUGF0aCgncHJlZml4X21hdGNoLmpzJylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW4gYXV0b2NvbXBsZXRlIHRoZSBzaGFyZWQgcGFydHMgYmV0d2VlbiB0d28gbWF0Y2hpbmcgcGF0aHMnLCAoKSA9PiB7XG4gICAgICAgICAgICBhc3NlcnRBdXRvY29tcGxldGVzVG8oXG4gICAgICAgICAgICAgICAgZml4dHVyZVBhdGgoJ3ByZScpLFxuICAgICAgICAgICAgICAgIGZpeHR1cmVQYXRoKCdwcmVmaXhfJylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdpbnNlcnRzIGEgdHJhaWxpbmcgc2VwYXJhdG9yIHdoZW4gYXV0b2NvbXBsZXRpbmcgYSBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICAgICAgICBhc3NlcnRBdXRvY29tcGxldGVzVG8oXG4gICAgICAgICAgICAgICAgZml4dHVyZVBhdGgoJ2V4YW0nKSxcbiAgICAgICAgICAgICAgICBmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKSArIHN0ZFBhdGguc2VwXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYmVlcHMgaWYgYXV0b2NvbXBsZXRlIGZpbmRzIG5vIG1hdGNocycsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGF0b20sICdiZWVwJyk7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdkb2VzX25vdF9leGlzdCcpKTtcblxuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTphdXRvY29tcGxldGUnKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCdkb2VzX25vdF9leGlzdCcpKTtcbiAgICAgICAgICAgIGV4cGVjdChhdG9tLmJlZXApLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2JlZXBzIGlmIGF1dG9jb21wbGV0ZSBjYW5ub3QgYXV0b2NvbXBsZXRlIGFueSBtb3JlIHNoYXJlZCBwYXJ0cycsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGF0b20sICdiZWVwJyk7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdwcmVmaXhfJykpO1xuXG4gICAgICAgICAgICBkaXNwYXRjaCgnYWR2YW5jZWQtb3Blbi1maWxlOmF1dG9jb21wbGV0ZScpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoZml4dHVyZVBhdGgoJ3ByZWZpeF8nKSk7XG4gICAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KGBpcyBjYXNlLXNlbnNpdGl2ZSBkdXJpbmcgYXV0b2NvbXBsZXRlIGlmIHRoZSBmcmFnbWVudCBoYXMgYSBjYXBpdGFsXG4gICAgICAgICAgICBsZXR0ZXJgLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdleGFtcGxlcycsICdjYXNlU2Vuc2l0aXZlJywgJ3ByZWZpeF9tJykpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTphdXRvY29tcGxldGUnKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKFxuICAgICAgICAgICAgICAgIGZpeHR1cmVQYXRoKCdleGFtcGxlcycsICdjYXNlU2Vuc2l0aXZlJywgJ3ByZWZpeF9tYXRjaF8nKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgnZXhhbXBsZXMnLCAnY2FzZVNlbnNpdGl2ZScsICdwcmVmaXhfTScpKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdhZHZhbmNlZC1vcGVuLWZpbGU6YXV0b2NvbXBsZXRlJyk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChcbiAgICAgICAgICAgICAgICBmaXh0dXJlUGF0aCgnZXhhbXBsZXMnLCAnY2FzZVNlbnNpdGl2ZScsICdwcmVmaXhfTWF0Y2hfdXBwZXIuanMnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2ZpeGVzIHRoZSBjYXNlIG9mIGxldHRlcnMgaW4gdGhlIGZyYWdtZW50IGlmIG5lY2Vzc2FyeScsICgpID0+IHtcbiAgICAgICAgICAgIGFzc2VydEF1dG9jb21wbGV0ZXNUbyhcbiAgICAgICAgICAgICAgICBmaXh0dXJlUGF0aCgnZXhhbXBsZXMnLCAnY2FzZVNlbnNpdGl2ZScsICdwcmVmaXhfbWF0Y2hfdXAnKSxcbiAgICAgICAgICAgICAgICBmaXh0dXJlUGF0aCgnZXhhbXBsZXMnLCAnY2FzZVNlbnNpdGl2ZScsICdwcmVmaXhfTWF0Y2hfdXBwZXIuanMnKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NhbiByZW1vdmUgdGhlIGN1cnJlbnQgcGF0aCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdmcmFnbWVudCcpKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdhZHZhbmNlZC1vcGVuLWZpbGU6ZGVsZXRlLXBhdGgtY29tcG9uZW50Jyk7XG5cbiAgICAgICAgICAgIC8vIExlYXZlcyB0cmFpbGluZyBzbGFzaCwgYXMgd2VsbC5cbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCkgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KGByZW1vdmVzIHRoZSBwYXJlbnQgZGlyZWN0b3J5IHdoZW4gcmVtb3ZpbmcgYSBwYXRoIGNvbXBvbmVudCB3aXRoIG5vXG4gICAgICAgICAgICBmcmFnbWVudGAsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ3N1YmRpcicpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTpkZWxldGUtcGF0aC1jb21wb25lbnQnKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCkgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW4gc3dpdGNoIHRvIHRoZSB1c2VyXFwncyBob21lIGRpcmVjdG9yeSB1c2luZyBhIHNob3J0Y3V0JywgKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuaGVsbURpclN3aXRjaCcsIHRydWUpO1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgnc3ViZGlyJykgKyAnficgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChvc2Vudi5ob21lKCkgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW4gc3dpdGNoIHRvIHRoZSBmaWxlc3lzdGVtIHJvb3QgdXNpbmcgYSBzaG9ydGN1dCcsICgpID0+IHtcbiAgICAgICAgICAgIC8vIEZvciBjcm9zcy1wbGF0Zm9ybW5lc3MsIHdlIGNoZWF0IGJ5IHVzaW5nIFBhdGguIE9oIHdlbGwuXG4gICAgICAgICAgICBsZXQgZnNSb290ID0gbmV3IFBhdGgoZml4dHVyZVBhdGgoJ3N1YmRpcicpKS5yb290KCkuZnVsbDtcblxuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuaGVsbURpclN3aXRjaCcsIHRydWUpO1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgnc3ViZGlyJykgKyBzdGRQYXRoLnNlcCArIHN0ZFBhdGguc2VwKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZzUm9vdCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW4gc3dpdGNoIHRvIHRoZSBwcm9qZWN0IHJvb3QgZGlyZWN0b3J5IHVzaW5nIGEgc2hvcnRjdXQnLCAoKSA9PiB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2FkdmFuY2VkLW9wZW4tZmlsZS5oZWxtRGlyU3dpdGNoJywgdHJ1ZSk7XG4gICAgICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW2ZpeHR1cmVQYXRoKCdleGFtcGxlcycpXSk7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdzdWJkaXInKSArICc6JyArIHN0ZFBhdGguc2VwKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCdleGFtcGxlcycpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdQYXRoIGlucHV0IGRlZmF1bHQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2gocmVzZXRDb25maWcpO1xuXG4gICAgICAgIGl0KCdjYW4gYmUgY29uZmlndXJlZCB0byBiZSB0aGUgY3VycmVudCBmaWxlXFwncyBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXG4gICAgICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZS5kZWZhdWx0SW5wdXRWYWx1ZScsXG4gICAgICAgICAgICAgICAgREVGQVVMVF9BQ1RJVkVfRklMRV9ESVJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5vcGVuKGZpeHR1cmVQYXRoKCdzYW1wbGUuanMnKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5Nb2RhbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCkgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NhbiBiZSBjb25maWd1cmVkIHRvIGJlIHRoZSBjdXJyZW50IHByb2plY3Qgcm9vdCcsICgpID0+IHtcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldChcbiAgICAgICAgICAgICAgICAnYWR2YW5jZWQtb3Blbi1maWxlLmRlZmF1bHRJbnB1dFZhbHVlJyxcbiAgICAgICAgICAgICAgICAgREVGQVVMVF9QUk9KRUNUX1JPT1RcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW2ZpeHR1cmVQYXRoKCdleGFtcGxlcycpXSk7XG4gICAgICAgICAgICBvcGVuTW9kYWwoKTtcblxuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoZml4dHVyZVBhdGgoJ2V4YW1wbGVzJykgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NhbiBiZSBjb25maWd1cmVkIHRvIGJlIGJsYW5rJywgKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuZGVmYXVsdElucHV0VmFsdWUnLCBERUZBVUxUX0VNUFRZKTtcbiAgICAgICAgICAgIG9wZW5Nb2RhbCgpO1xuXG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbCgnJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnVW5kbycsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaChyZXNldENvbmZpZyk7XG4gICAgICAgIGJlZm9yZUVhY2gob3Blbk1vZGFsKTtcblxuICAgICAgICBpdCgnY2FuIHVuZG8gdGFiIGNvbXBsZXRpb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdleGFtJykpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTphdXRvY29tcGxldGUnKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCdleGFtcGxlcycpICsgcGF0aC5zZXApO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTp1bmRvJyk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgnZXhhbScpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NhbiB1bmRvIGRlbGV0aW5nIHBhdGggY29tcG9uZW50cycsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ2V4YW0nKSk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnYWR2YW5jZWQtb3Blbi1maWxlOmRlbGV0ZS1wYXRoLWNvbXBvbmVudCcpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoZml4dHVyZVBhdGgoKSArIHBhdGguc2VwKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdhZHZhbmNlZC1vcGVuLWZpbGU6dW5kbycpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoZml4dHVyZVBhdGgoJ2V4YW0nKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW4gdW5kbyBjbGlja2luZyBhIGZvbGRlcicsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoKSArIHBhdGguc2VwKTtcbiAgICAgICAgICAgIGNsaWNrRmlsZSgnZXhhbXBsZXMnKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCdleGFtcGxlcycpICsgcGF0aC5zZXApO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTp1bmRvJyk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgpICsgcGF0aC5zZXApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYmVlcHMgd2hlbiBpdCBjYW5ub3QgdW5kbyBhbnkgZmFydGhlcicsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGF0b20sICdiZWVwJyk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnYWR2YW5jZWQtb3Blbi1maWxlOnVuZG8nKTtcbiAgICAgICAgICAgIGV4cGVjdChhdG9tLmJlZXApLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnT3BlbmluZyBmaWxlcycsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaChyZXNldENvbmZpZyk7XG4gICAgICAgIGJlZm9yZUVhY2gob3Blbk1vZGFsKTtcblxuICAgICAgICBpdCgnb3BlbnMgYW4gZXhpc3RpbmcgZmlsZSBpZiB0aGUgY3VycmVudCBwYXRoIHBvaW50cyB0byBvbmUnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IGZpeHR1cmVQYXRoKCdzYW1wbGUuanMnKTtcbiAgICAgICAgICAgIHNldFBhdGgocGF0aCk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnY29yZTpjb25maXJtJyk7XG5cbiAgICAgICAgICAgIHdhaXRzRm9yT3BlblBhdGhzKDEpO1xuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRFZGl0b3JQYXRocygpKS50b0VxdWFsKFtwYXRoXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JlcGxhY2VzIHRoZSBwYXRoIHdoZW4gYXR0ZW1wdGluZyB0byBvcGVuIGFuIGV4aXN0aW5nIGRpcmVjdG9yeScsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ2V4YW1wbGVzJykpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y29uZmlybScpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoZml4dHVyZVBhdGgoJ2V4YW1wbGVzJykgKyBwYXRoLnNlcCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KGBiZWVwcyB3aGVuIGF0dGVtcHRpbmcgdG8gb3BlbiBhIHBhdGggZW5kaW5nIGluIGEgc2VwYXJhdG9yIChhXG4gICAgICAgICAgICBub24tZXhpc3RhbnQgZGlyZWN0b3J5KWAsICgpID0+IHtcbiAgICAgICAgICAgIHNweU9uKGF0b20sICdiZWVwJyk7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdub3R0aGVyZScpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y29uZmlybScpO1xuICAgICAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnb3BlbnMgYSBuZXcgZmlsZSB3aXRob3V0IHNhdmluZyBpdCBpZiBvcGVuaW5nIGEgbm9uLWV4aXN0YW50IHBhdGgnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IGZpeHR1cmVQYXRoKCdkb2VzLm5vdC5leGlzdCcpO1xuICAgICAgICAgICAgc2V0UGF0aChwYXRoKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdjb3JlOmNvbmZpcm0nKTtcblxuICAgICAgICAgICAgd2FpdHNGb3JPcGVuUGF0aHMoMSk7XG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3VycmVudEVkaXRvclBhdGhzKCkpLnRvRXF1YWwoW3BhdGhdKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmlsZUV4aXN0cyhwYXRoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2NyZWF0ZXMgYSBuZXcgZmlsZSB3aGVuIGNvbmZpZ3VyZWQgdG8nLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgdGVtcERpciA9IGZzLnJlYWxwYXRoU3luYyh0ZW1wLm1rZGlyU3luYygpKTtcbiAgICAgICAgICAgIGxldCBwYXRoID0gc3RkUGF0aC5qb2luKHRlbXBEaXIsICduZXdmaWxlLmpzJyk7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2FkdmFuY2VkLW9wZW4tZmlsZS5jcmVhdGVGaWxlSW5zdGFudGx5JywgdHJ1ZSk7XG4gICAgICAgICAgICBzZXRQYXRoKHBhdGgpO1xuICAgICAgICAgICAgZXhwZWN0KGZpbGVFeGlzdHMocGF0aCkpLnRvRXF1YWwoZmFsc2UpO1xuXG4gICAgICAgICAgICBkaXNwYXRjaCgnY29yZTpjb25maXJtJyk7XG4gICAgICAgICAgICB3YWl0c0Zvck9wZW5QYXRocygxKTtcbiAgICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdXJyZW50RWRpdG9yUGF0aHMoKSkudG9FcXVhbChbcGF0aF0pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaWxlRXhpc3RzKHBhdGgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjcmVhdGVzIGludGVybWVkaWF0ZSBkaXJlY3RvcmllcyB3aGVuIG5lY2Vzc2FyeScsICgpID0+IHtcbiAgICAgICAgICAgIGxldCB0ZW1wRGlyID0gZnMucmVhbHBhdGhTeW5jKHRlbXAubWtkaXJTeW5jKCkpO1xuICAgICAgICAgICAgbGV0IG5ld0RpciA9IHN0ZFBhdGguam9pbih0ZW1wRGlyLCAnbmV3RGlyJyk7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHN0ZFBhdGguam9pbihuZXdEaXIsICduZXdGaWxlLmpzJyk7XG4gICAgICAgICAgICBzZXRQYXRoKHBhdGgpO1xuICAgICAgICAgICAgZXhwZWN0KGZpbGVFeGlzdHMobmV3RGlyKSkudG9FcXVhbChmYWxzZSk7XG5cbiAgICAgICAgICAgIGRpc3BhdGNoKCdjb3JlOmNvbmZpcm0nKTtcbiAgICAgICAgICAgIHdhaXRzRm9yT3BlblBhdGhzKDEpO1xuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRFZGl0b3JQYXRocygpKS50b0VxdWFsKFtwYXRoXSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbGVFeGlzdHMobmV3RGlyKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY2FuIGNyZWF0ZSBmaWxlcyBmcm9tIHJlbGF0aXZlIHBhdGhzJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRlbXBEaXIgPSBmcy5yZWFscGF0aFN5bmModGVtcC5ta2RpclN5bmMoKSk7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHN0ZFBhdGguam9pbignbmV3RGlyJywgJ25ld0ZpbGUuanMnKTtcbiAgICAgICAgICAgIGxldCBhYnNvbHV0ZVBhdGggPSBzdGRQYXRoLmpvaW4odGVtcERpciwgcGF0aCk7XG5cbiAgICAgICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbdGVtcERpcl0pO1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuY3JlYXRlRmlsZUluc3RhbnRseScsIHRydWUpO1xuXG4gICAgICAgICAgICBzZXRQYXRoKHBhdGgpO1xuICAgICAgICAgICAgZXhwZWN0KGZpbGVFeGlzdHMoYWJzb2x1dGVQYXRoKSkudG9FcXVhbChmYWxzZSk7XG5cbiAgICAgICAgICAgIGRpc3BhdGNoKCdjb3JlOmNvbmZpcm0nKTtcbiAgICAgICAgICAgIHdhaXRzRm9yT3BlblBhdGhzKDEpO1xuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRFZGl0b3JQYXRocygpKS50b0VxdWFsKFthYnNvbHV0ZVBhdGhdKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmlsZUV4aXN0cyhhYnNvbHV0ZVBhdGgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ0tleWJvYXJkIG5hdmlnYXRpb24nLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2gocmVzZXRDb25maWcpO1xuICAgICAgICBiZWZvcmVFYWNoKG9wZW5Nb2RhbCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgICAgIEZvciByZWZlcmVuY2UsIGV4cGVjdGVkIGxpc3RpbmcgaW4gZml4dHVyZXMgaXM6XG4gICAgICAgICAgICAuLlxuICAgICAgICAgICAgZXhhbXBsZXNcbiAgICAgICAgICAgIHByZWZpeF9tYXRjaC5qc1xuICAgICAgICAgICAgcHJlZml4X290aGVyX21hdGNoLmpzXG4gICAgICAgICAgICBzYW1wbGUuanNcbiAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBtb3ZlRG93bih0aW1lcykge1xuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aW1lczsgaysrKSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTptb3ZlLWN1cnNvci1kb3duJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBtb3ZlVXAodGltZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGltZXM7IGsrKykge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoKCdhZHZhbmNlZC1vcGVuLWZpbGU6bW92ZS1jdXJzb3ItdXAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGl0KCdhbGxvd3MgbW92aW5nIGEgY3Vyc29yIHRvIGEgZmlsZSBhbmQgY29uZmlybWluZyB0byBzZWxlY3QgYSBwYXRoJywgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgbW92ZURvd24oNCk7XG4gICAgICAgICAgICBtb3ZlVXAoMSk7IC8vIFRlc3QgbW92ZW1lbnQgYm90aCBkb3duIGFuZCB1cC5cbiAgICAgICAgICAgIGRpc3BhdGNoKCdjb3JlOmNvbmZpcm0nKTtcblxuICAgICAgICAgICAgd2FpdHNGb3JPcGVuUGF0aHMoMSk7XG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3VycmVudEVkaXRvclBhdGhzKCkpLnRvRXF1YWwoW2ZpeHR1cmVQYXRoKCdwcmVmaXhfbWF0Y2guanMnKV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCd3cmFwcyB0aGUgY3Vyc29yIGF0IHRoZSBlZGdlcycsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoKSArIHN0ZFBhdGguc2VwKTtcbiAgICAgICAgICAgIG1vdmVVcCgyKTtcbiAgICAgICAgICAgIG1vdmVEb3duKDQpO1xuICAgICAgICAgICAgbW92ZVVwKDUpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y29uZmlybScpO1xuXG4gICAgICAgICAgICB3YWl0c0Zvck9wZW5QYXRocygxKTtcbiAgICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdXJyZW50RWRpdG9yUGF0aHMoKSkudG9FcXVhbChbZml4dHVyZVBhdGgoJ3ByZWZpeF9tYXRjaC5qcycpXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3JlcGxhY2VzIHRoZSBjdXJyZW50IHBhdGggd2hlbiBzZWxlY3RpbmcgYSBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCkgKyBwYXRoLnNlcCk7XG4gICAgICAgICAgICBtb3ZlRG93bigyKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdjb3JlOmNvbmZpcm0nKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCdleGFtcGxlcycpICsgcGF0aC5zZXApXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdtb3ZlcyB0byB0aGUgcGFyZW50IGRpcmVjdG9yeSB3aGVuIHRoZSAuLiBlbGVtZW50IGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKSArIHBhdGguc2VwKTtcbiAgICAgICAgICAgIG1vdmVEb3duKDEpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y29uZmlybScpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoZml4dHVyZVBhdGgoKSArIHBhdGguc2VwKVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChgY2FuIHNlbGVjdCB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgbGlzdCBpZiBub25lIGFyZSBzZWxlY3RlZCB1c2luZ1xuICAgICAgICAgICAgc3BlY2lhbCBjb21tYW5kYCwgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgncHJlZml4JykpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTpjb25maXJtLXNlbGVjdGVkLW9yLWZpcnN0Jyk7XG5cbiAgICAgICAgICAgIHdhaXRzRm9yT3BlblBhdGhzKDEpO1xuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRFZGl0b3JQYXRocygpKS50b0VxdWFsKFtmaXh0dXJlUGF0aCgncHJlZml4X21hdGNoLmpzJyldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ01vdXNlIG5hdmlnYXRpb24nLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2gocmVzZXRDb25maWcpO1xuICAgICAgICBiZWZvcmVFYWNoKG9wZW5Nb2RhbCk7XG5cbiAgICAgICAgaXQoJ29wZW5zIGEgcGF0aCB3aGVuIGl0IGlzIGNsaWNrZWQgb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCkgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICBjbGlja0ZpbGUoJ3NhbXBsZS5qcycpXG5cbiAgICAgICAgICAgIHdhaXRzRm9yT3BlblBhdGhzKDEpO1xuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRFZGl0b3JQYXRocygpKS50b0VxdWFsKFtmaXh0dXJlUGF0aCgnc2FtcGxlLmpzJyldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmVwbGFjZXMgdGhlIGN1cnJlbnQgcGF0aCB3aGVuIGNsaWNraW5nIGEgZGlyZWN0b3J5JywgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgpICsgcGF0aC5zZXApO1xuICAgICAgICAgICAgY2xpY2tGaWxlKCdleGFtcGxlcycpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoZml4dHVyZVBhdGgoJ2V4YW1wbGVzJykgKyBwYXRoLnNlcClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ21vdmVzIHRvIHRoZSBwYXJlbnQgZGlyZWN0b3J5IHdoZW4gdGhlIC4uIGVsZW1lbnQgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ2V4YW1wbGVzJykgKyBwYXRoLnNlcCk7XG4gICAgICAgICAgICB1aS5maW5kKCcucGFyZW50LWRpcmVjdG9yeScpLmNsaWNrKCk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgpICsgcGF0aC5zZXApXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ0V2ZW50cycsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaChyZXNldENvbmZpZyk7XG4gICAgICAgIGJlZm9yZUVhY2gob3Blbk1vZGFsKTtcblxuICAgICAgICBpdCgnYWxsb3dzIHN1YnNjcmlwdGlvbiB0byBldmVudHMgd2hlbiBwYXRocyBhcmUgb3BlbmVkJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGhhbmRsZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnaGFuZGxlcicpO1xuICAgICAgICAgICAgbGV0IHN1YiA9IG9uRGlkT3BlblBhdGgoaGFuZGxlcik7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IGZpeHR1cmVQYXRoKCdzYW1wbGUuanMnKTtcblxuICAgICAgICAgICAgc2V0UGF0aChwYXRoKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdjb3JlOmNvbmZpcm0nKTtcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChwYXRoKTtcbiAgICAgICAgICAgIHN1Yi5kaXNwb3NlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdhbGxvd3Mgc3Vic2NyaXB0aW9uIHRvIGV2ZW50cyB3aGVuIHBhdGhzIGFyZSBjcmVhdGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuY3JlYXRlRmlsZUluc3RhbnRseScsIHRydWUpO1xuICAgICAgICAgICAgbGV0IHRlbXBEaXIgPSBmcy5yZWFscGF0aFN5bmModGVtcC5ta2RpclN5bmMoKSk7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHN0ZFBhdGguam9pbih0ZW1wRGlyLCAnbmV3ZmlsZS5qcycpO1xuICAgICAgICAgICAgbGV0IGhhbmRsZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnaGFuZGxlcicpO1xuICAgICAgICAgICAgbGV0IHN1YiA9IG9uRGlkQ3JlYXRlUGF0aChoYW5kbGVyKTtcblxuICAgICAgICAgICAgc2V0UGF0aChwYXRoKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdjb3JlOmNvbmZpcm0nKTtcbiAgICAgICAgICAgIGV4cGVjdChoYW5kbGVyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChwYXRoKTtcbiAgICAgICAgICAgIHN1Yi5kaXNwb3NlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/spec/advanced-open-file-spec.js
