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

        it('is case-sensitive during autocomplete', function () {
            setPath(fixturePath('examples', 'caseSensitive', 'prefix_m'));
            dispatch('advanced-open-file:autocomplete');
            expect(currentPath()).toEqual(fixturePath('examples', 'caseSensitive', 'prefix_match_lower.js'));

            setPath(fixturePath('examples', 'caseSensitive', 'prefix_M'));
            dispatch('advanced-open-file:autocomplete');
            expect(currentPath()).toEqual(fixturePath('examples', 'caseSensitive', 'prefix_Match_upper.js'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL3NwZWMvYWR2YW5jZWQtb3Blbi1maWxlLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztrQkFDZSxJQUFJOzs7O29CQUNDLE1BQU07Ozs7b0JBQ1QsTUFBTTs7OztzQkFFVCxRQUFROzs7O3FCQUNKLE9BQU87Ozs7bUNBRW9CLDJCQUEyQjs7eUJBS2pFLGVBQWU7O3lCQUNILGVBQWU7O0FBWFQsa0JBQUssS0FBSyxFQUFFLENBQUM7O0FBY3RDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxZQUFNO0FBQy9CLFFBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFFBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFFBQUksRUFBRSxHQUFHLElBQUksQ0FBQztBQUNkLFFBQUksVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdEIsY0FBVSxDQUFDLFlBQU07QUFDYix3QkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQsZUFBTyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV0Qyx5QkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0tBQzNFLENBQUMsQ0FBQzs7QUFFSCxhQUFTLEtBQUssR0FBRztBQUNiLGVBQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDaEU7O0FBRUQsYUFBUyxXQUFXLEdBQVc7MENBQVAsS0FBSztBQUFMLGlCQUFLOzs7QUFDekIsZUFBTyxrQkFBUSxJQUFJLE1BQUEscUJBQUMsU0FBUyxFQUFFLFVBQVUsU0FBSyxLQUFLLEVBQUMsQ0FBQztLQUN4RDs7QUFFRCxhQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDdEIsa0JBQVUsQ0FBQyxPQUFP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QUFDLENBQUM7QUFDaEQsZ0JBQUksSUFBSSxHQUFHLGtCQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDL0MsZ0JBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDM0MsZ0JBQUksR0FBRyxHQUFHLDBDQUFnQixPQUFPLENBQUMsQ0FBQzs7QUFFbkMsbUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNkLG9CQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekIsa0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQyxlQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDakIsQ0FBQyxDQUFDO0tBQ04sQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL3NwZWMvYWR2YW5jZWQtb3Blbi1maWxlLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHN0ZFBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJzsgdGVtcC50cmFjaygpO1xuXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IG9zZW52IGZyb20gJ29zZW52JztcblxuaW1wb3J0IHtvbkRpZENyZWF0ZVBhdGgsIG9uRGlkT3BlblBhdGh9IGZyb20gJy4uL2xpYi9hZHZhbmNlZC1vcGVuLWZpbGUnO1xuaW1wb3J0IHtcbiAgICBERUZBVUxUX0FDVElWRV9GSUxFX0RJUixcbiAgICBERUZBVUxUX0VNUFRZLFxuICAgIERFRkFVTFRfUFJPSkVDVF9ST09UXG59IGZyb20gJy4uL2xpYi9jb25maWcnO1xuaW1wb3J0IHtQYXRofSBmcm9tICcuLi9saWIvbW9kZWxzJztcblxuXG5kZXNjcmliZSgnRnVuY3Rpb25hbCB0ZXN0cycsICgpID0+IHtcbiAgICBsZXQgd29ya3NwYWNlRWxlbWVudCA9IG51bGw7XG4gICAgbGV0IGFjdGl2YXRpb25Qcm9taXNlID0gbnVsbDtcbiAgICBsZXQgdWkgPSBudWxsO1xuICAgIGxldCBwYXRoRWRpdG9yID0gbnVsbDtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KTtcblxuICAgICAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhZHZhbmNlZC1vcGVuLWZpbGUnKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGdldFVJKCkge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYWR2YW5jZWQtb3Blbi1maWxlJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZml4dHVyZVBhdGgoLi4ucGFydHMpIHtcbiAgICAgICAgcmV0dXJuIHN0ZFBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsIC4uLnBhcnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRQYXRoKG5ld1BhdGgpIHtcbiAgICAgICAgcGF0aEVkaXRvci5zZXRUZXh0KG5ld1BhdGgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnRQYXRoKCkge1xuICAgICAgICByZXR1cm4gcGF0aEVkaXRvci5nZXRUZXh0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzcGF0Y2goY29tbWFuZCkge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHVpWzBdLCBjb21tYW5kKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW50UGF0aExpc3QoKSB7XG4gICAgICAgIHJldHVybiB1aS5maW5kKCcubGlzdC1pdGVtOm5vdCguaGlkZGVuKScpXG4gICAgICAgICAgICAgICAgIC5tYXAoKGksIGl0ZW0pID0+ICQoaXRlbSkudGV4dCgpLnRyaW0oKSlcbiAgICAgICAgICAgICAgICAgLmdldCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnRFZGl0b3JQYXRocygpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkubWFwKChlZGl0b3IpID0+IGVkaXRvci5nZXRQYXRoKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdhaXRzRm9yT3BlblBhdGhzKGNvdW50LCB0aW1lb3V0PTIwMDApIHtcbiAgICAgICAgd2FpdHNGb3IoXG4gICAgICAgICAgICAoKSA9PiBjdXJyZW50RWRpdG9yUGF0aHMoKS5sZW5ndGggPj0gY291bnQsXG4gICAgICAgICAgICBgJHtjb3VudH0gcGF0aHMgdG8gYmUgb3BlbmVkYCxcbiAgICAgICAgICAgIHRpbWVvdXRcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvcGVuTW9kYWwoKSB7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2FkdmFuY2VkLW9wZW4tZmlsZTp0b2dnbGUnKTtcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhY3RpdmF0aW9uUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB1aSA9ICQoZ2V0VUkoKSk7XG4gICAgICAgICAgICAgICAgcGF0aEVkaXRvciA9IHVpLmZpbmQoJy5wYXRoLWlucHV0JylbMF0uZ2V0TW9kZWwoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNldENvbmZpZygpIHtcbiAgICAgICAgYXRvbS5jb25maWcudW5zZXQoJ2FkdmFuY2VkLW9wZW4tZmlsZS5jcmVhdGVGaWxlSW5zdGFudGx5Jyk7XG4gICAgICAgIGF0b20uY29uZmlnLnVuc2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuaGVsbURpclN3aXRjaCcpO1xuICAgICAgICBhdG9tLmNvbmZpZy51bnNldCgnYWR2YW5jZWQtb3Blbi1maWxlLmRlZmF1bHRJbnB1dFZhbHVlJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsZUV4aXN0cyhwYXRoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmcy5zdGF0U3luYyhwYXRoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xpY2tGaWxlKGZpbGVuYW1lKSB7XG4gICAgICAgIHVpLmZpbmQoYC5saXN0LWl0ZW1bZGF0YS1maWxlLW5hbWUkPScke2ZpbGVuYW1lfSddYCkuY2xpY2soKTtcbiAgICB9XG5cbiAgICBkZXNjcmliZSgnTW9kYWwgZGlhbG9nJywgKCkgPT4ge1xuICAgICAgICBiZWZvcmVFYWNoKHJlc2V0Q29uZmlnKTtcblxuICAgICAgICBpdCgnYXBwZWFycyB3aGVuIHRoZSB0b2dnbGUgY29tbWFuZCBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBvcGVuTW9kYWwoKVxuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGdldFVJKCkpLm5vdC50b0JlTnVsbCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkaXNhcHBlYXJzIGlmIHRoZSB0b2dnbGUgY29tbWFuZCBpcyB0cmlnZ2VyZWQgd2hpbGUgaXQgaXMgdmlzaWJsZScsICgpID0+IHtcbiAgICAgICAgICAgIG9wZW5Nb2RhbCgpO1xuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYWR2YW5jZWQtb3Blbi1maWxlOnRvZ2dsZScpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChnZXRVSSgpKS50b0JlTnVsbCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdkaXNhcHBlYXJzIGlmIHRoZSBjYW5jZWwgY29tbWFuZCBpcyB0cmlnZ2VyZWQgd2hpbGUgaXQgaXMgdmlzaWJsZScsICgpID0+IHtcbiAgICAgICAgICAgIG9wZW5Nb2RhbCgpO1xuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y2FuY2VsJyk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGdldFVJKCkpLnRvQmVOdWxsKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2Rpc2FwcGVhcnMgaWYgdGhlIHVzZXIgY2xpY2tzIG91dHNpZGUgb2YgdGhlIG1vZGFsJywgKCkgPT4ge1xuICAgICAgICAgICAgb3Blbk1vZGFsKCk7XG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICB1aS5wYXJlbnQoKS5jbGljaygpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChnZXRVSSgpKS50b0JlTnVsbCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1BhdGggbGlzdGluZycsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaChyZXNldENvbmZpZyk7XG4gICAgICAgIGJlZm9yZUVhY2gob3Blbk1vZGFsKTtcblxuICAgICAgICBpdCgnbGlzdHMgdGhlIGRpcmVjdG9yeSBjb250ZW50cyBpZiB0aGUgcGF0aCBlbmRzIGluIGEgc2VwYXJhdG9yJywgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgpICsgc3RkUGF0aC5zZXApO1xuXG4gICAgICAgICAgICAvLyBBbHNvIGluY2x1ZGVzIHRoZSBwYXJlbnQgZGlyZWN0b3J5IGFuZCBpcyBzb3J0ZWQgYWxwaGFiZXRpY2FsbHlcbiAgICAgICAgICAgIC8vIGdyb3VwZWQgYnkgZGlyZWN0b3JpZXMgYW5kIGZpbGVzLlxuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoTGlzdCgpKS50b0VxdWFsKFtcbiAgICAgICAgICAgICAgICAnLi4nLFxuICAgICAgICAgICAgICAgICdleGFtcGxlcycsXG4gICAgICAgICAgICAgICAgJ3ByZWZpeF9tYXRjaC5qcycsXG4gICAgICAgICAgICAgICAgJ3ByZWZpeF9vdGhlcl9tYXRjaC5qcycsXG4gICAgICAgICAgICAgICAgJ3NhbXBsZS5qcydcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnbGlzdHMgbWF0Y2hpbmcgZmlsZXMgaWYgdGhlIHBhdGggZG9lc25cXCd0IGVuZCBpbiBhIHNlcGFyYXRvcicsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ3ByZWZpeCcpKTtcblxuICAgICAgICAgICAgLy8gQWxzbyBzaG91bGRuJ3QgaW5jbHVkZSB0aGUgcGFyZW50LlxuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoTGlzdCgpKS50b0VxdWFsKFtcbiAgICAgICAgICAgICAgICAncHJlZml4X21hdGNoLmpzJyxcbiAgICAgICAgICAgICAgICAncHJlZml4X290aGVyX21hdGNoLmpzJ1xuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdleGNsdWRlcyBmaWxlcyB0aGF0IGRvblxcJ3QgaGF2ZSBhIHByZWZpeCBtYXRjaGluZyB0aGUgZnJhZ21lbnQnLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdwcmVmaXhfbWF0Y2gnKSk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGhMaXN0KCkpLnRvRXF1YWwoWydwcmVmaXhfbWF0Y2guanMnXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjb25zaWRlcnMgcmVsYXRpdmUgcGF0aHMgdG8gYmUgcmVsYXRpdmUgdG8gdGhlIHByb2plY3Qgcm9vdCcsICgpID0+IHtcbiAgICAgICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbZml4dHVyZVBhdGgoKV0pO1xuICAgICAgICAgICAgc2V0UGF0aChzdGRQYXRoLmpvaW4oJ2V4YW1wbGVzJywgJ3N1YmRpcicpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoTGlzdCgpKS50b0VxdWFsKFsnLi4nLCAnc3Vic2FtcGxlLmpzJ10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnYXV0b21hdGljYWxseSB1cGRhdGVzIHdoZW4gdGhlIHBhdGggY2hhbmdlcycsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ3ByZWZpeCcpKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aExpc3QoKSkudG9FcXVhbChbXG4gICAgICAgICAgICAgICAgJ3ByZWZpeF9tYXRjaC5qcycsXG4gICAgICAgICAgICAgICAgJ3ByZWZpeF9vdGhlcl9tYXRjaC5qcydcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdwcmVmaXhfbWF0Y2gnKSk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGhMaXN0KCkpLnRvRXF1YWwoWydwcmVmaXhfbWF0Y2guanMnXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KGBtYXRjaGVzIGZpbGVzIGNhc2UtaW5zZW5zaXRpdmVseSB1bmxlc3MgdGhlIGZyYWdtZW50IGNvbnRhaW5zIGFcbiAgICAgICAgICAgIGNhcGl0YWxgLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdleGFtcGxlcycsICdjYXNlU2Vuc2l0aXZlJywgJ3ByZWZpeF9tYXRjaCcpKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aExpc3QoKSkudG9FcXVhbChbXG4gICAgICAgICAgICAgICAgJ3ByZWZpeF9tYXRjaF9sb3dlci5qcycsXG4gICAgICAgICAgICAgICAgJ3ByZWZpeF9NYXRjaF91cHBlci5qcydcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdleGFtcGxlcycsICdjYXNlU2Vuc2l0aXZlJywgJ3ByZWZpeF9NYXRjaCcpKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aExpc3QoKSkudG9FcXVhbChbJ3ByZWZpeF9NYXRjaF91cHBlci5qcyddKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoYHNob3dzIGEgYnV0dG9uIG5leHQgdG8gZm9sZGVycyB0aGF0IGNhbiBiZSBjbGlja2VkIHRvIGFkZCB0aGVtIGFzXG4gICAgICAgICAgICBwcm9qZWN0IGZvbGRlcnNgLCAoKSA9PiB7XG4gICAgICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW10pO1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgpICsgcGF0aC5zZXApO1xuXG4gICAgICAgICAgICBsZXQgZXhhbXBsZUxpc3RJdGVtID0gdWkuZmluZCgnLmxpc3QtaXRlbVtkYXRhLWZpbGUtbmFtZSQ9XFwnZXhhbXBsZXNcXCddJyk7XG4gICAgICAgICAgICBsZXQgYWRkUHJvamVjdEZvbGRlckJ1dHRvbiA9IGV4YW1wbGVMaXN0SXRlbS5maW5kKCcuYWRkLXByb2plY3QtZm9sZGVyJyk7XG4gICAgICAgICAgICBleHBlY3QoYWRkUHJvamVjdEZvbGRlckJ1dHRvbi5sZW5ndGgpLnRvRXF1YWwoMSk7XG5cbiAgICAgICAgICAgIGFkZFByb2plY3RGb2xkZXJCdXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIGV4cGVjdChhdG9tLnByb2plY3QuZ2V0UGF0aHMoKSkudG9FcXVhbChbZml4dHVyZVBhdGgoJ2V4YW1wbGVzJyldKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoYGRvZXMgbm90IHNob3cgdGhlIGFkZC1wcm9qZWN0LWZvbGRlciBidXR0b24gZm9yIGZvbGRlcnMgdGhhdCBhcmVcbiAgICAgICAgICAgIGFscmVhZHkgcHJvamVjdCBmb2xkZXJzYCwgKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFtmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKV0pO1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgpICsgcGF0aC5zZXApO1xuXG4gICAgICAgICAgICBsZXQgZXhhbXBsZUxpc3RJdGVtID0gdWkuZmluZCgnLmxpc3QtaXRlbVtkYXRhLWZpbGUtbmFtZSQ9XFwnZXhhbXBsZXNcXCddJyk7XG4gICAgICAgICAgICBsZXQgYWRkUHJvamVjdEZvbGRlckJ1dHRvbiA9IGV4YW1wbGVMaXN0SXRlbS5maW5kKCcuYWRkLXByb2plY3QtZm9sZGVyJyk7XG4gICAgICAgICAgICBleHBlY3QoYWRkUHJvamVjdEZvbGRlckJ1dHRvbi5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1BhdGggaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2gocmVzZXRDb25maWcpO1xuICAgICAgICBiZWZvcmVFYWNoKG9wZW5Nb2RhbCk7XG5cbiAgICAgICAgZnVuY3Rpb24gYXNzZXJ0QXV0b2NvbXBsZXRlc1RvKGlucHV0UGF0aCwgYXV0b2NvbXBsZXRlZFBhdGgpIHtcbiAgICAgICAgICAgIHNldFBhdGgoaW5wdXRQYXRoKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdhZHZhbmNlZC1vcGVuLWZpbGU6YXV0b2NvbXBsZXRlJyk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChhdXRvY29tcGxldGVkUGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpdCgnY2FuIGF1dG9jb21wbGV0ZSB0aGUgY3VycmVudCBpbnB1dCcsICgpID0+IHtcbiAgICAgICAgICAgIGFzc2VydEF1dG9jb21wbGV0ZXNUbyhcbiAgICAgICAgICAgICAgICBmaXh0dXJlUGF0aCgncHJlZml4X21hJyksXG4gICAgICAgICAgICAgICAgZml4dHVyZVBhdGgoJ3ByZWZpeF9tYXRjaC5qcycpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY2FuIGF1dG9jb21wbGV0ZSB0aGUgc2hhcmVkIHBhcnRzIGJldHdlZW4gdHdvIG1hdGNoaW5nIHBhdGhzJywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0QXV0b2NvbXBsZXRlc1RvKFxuICAgICAgICAgICAgICAgIGZpeHR1cmVQYXRoKCdwcmUnKSxcbiAgICAgICAgICAgICAgICBmaXh0dXJlUGF0aCgncHJlZml4XycpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaW5zZXJ0cyBhIHRyYWlsaW5nIHNlcGFyYXRvciB3aGVuIGF1dG9jb21wbGV0aW5nIGEgZGlyZWN0b3J5JywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0QXV0b2NvbXBsZXRlc1RvKFxuICAgICAgICAgICAgICAgIGZpeHR1cmVQYXRoKCdleGFtJyksXG4gICAgICAgICAgICAgICAgZml4dHVyZVBhdGgoJ2V4YW1wbGVzJykgKyBzdGRQYXRoLnNlcFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2JlZXBzIGlmIGF1dG9jb21wbGV0ZSBmaW5kcyBubyBtYXRjaHMnLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihhdG9tLCAnYmVlcCcpO1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgnZG9lc19ub3RfZXhpc3QnKSk7XG5cbiAgICAgICAgICAgIGRpc3BhdGNoKCdhZHZhbmNlZC1vcGVuLWZpbGU6YXV0b2NvbXBsZXRlJyk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgnZG9lc19ub3RfZXhpc3QnKSk7XG4gICAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdiZWVwcyBpZiBhdXRvY29tcGxldGUgY2Fubm90IGF1dG9jb21wbGV0ZSBhbnkgbW9yZSBzaGFyZWQgcGFydHMnLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihhdG9tLCAnYmVlcCcpO1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgncHJlZml4XycpKTtcblxuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTphdXRvY29tcGxldGUnKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCdwcmVmaXhfJykpO1xuICAgICAgICAgICAgZXhwZWN0KGF0b20uYmVlcCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnaXMgY2FzZS1zZW5zaXRpdmUgZHVyaW5nIGF1dG9jb21wbGV0ZScsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ2V4YW1wbGVzJywgJ2Nhc2VTZW5zaXRpdmUnLCAncHJlZml4X20nKSk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnYWR2YW5jZWQtb3Blbi1maWxlOmF1dG9jb21wbGV0ZScpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoXG4gICAgICAgICAgICAgICAgZml4dHVyZVBhdGgoJ2V4YW1wbGVzJywgJ2Nhc2VTZW5zaXRpdmUnLCAncHJlZml4X21hdGNoX2xvd2VyLmpzJylcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ2V4YW1wbGVzJywgJ2Nhc2VTZW5zaXRpdmUnLCAncHJlZml4X00nKSk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnYWR2YW5jZWQtb3Blbi1maWxlOmF1dG9jb21wbGV0ZScpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoXG4gICAgICAgICAgICAgICAgZml4dHVyZVBhdGgoJ2V4YW1wbGVzJywgJ2Nhc2VTZW5zaXRpdmUnLCAncHJlZml4X01hdGNoX3VwcGVyLmpzJylcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW4gcmVtb3ZlIHRoZSBjdXJyZW50IHBhdGggY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgnZnJhZ21lbnQnKSk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnYWR2YW5jZWQtb3Blbi1maWxlOmRlbGV0ZS1wYXRoLWNvbXBvbmVudCcpO1xuXG4gICAgICAgICAgICAvLyBMZWF2ZXMgdHJhaWxpbmcgc2xhc2gsIGFzIHdlbGwuXG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChgcmVtb3ZlcyB0aGUgcGFyZW50IGRpcmVjdG9yeSB3aGVuIHJlbW92aW5nIGEgcGF0aCBjb21wb25lbnQgd2l0aCBub1xuICAgICAgICAgICAgZnJhZ21lbnRgLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdzdWJkaXInKSArIHN0ZFBhdGguc2VwKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdhZHZhbmNlZC1vcGVuLWZpbGU6ZGVsZXRlLXBhdGgtY29tcG9uZW50Jyk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY2FuIHN3aXRjaCB0byB0aGUgdXNlclxcJ3MgaG9tZSBkaXJlY3RvcnkgdXNpbmcgYSBzaG9ydGN1dCcsICgpID0+IHtcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnYWR2YW5jZWQtb3Blbi1maWxlLmhlbG1EaXJTd2l0Y2gnLCB0cnVlKTtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ3N1YmRpcicpICsgJ34nICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwob3NlbnYuaG9tZSgpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY2FuIHN3aXRjaCB0byB0aGUgZmlsZXN5c3RlbSByb290IHVzaW5nIGEgc2hvcnRjdXQnLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBGb3IgY3Jvc3MtcGxhdGZvcm1uZXNzLCB3ZSBjaGVhdCBieSB1c2luZyBQYXRoLiBPaCB3ZWxsLlxuICAgICAgICAgICAgbGV0IGZzUm9vdCA9IG5ldyBQYXRoKGZpeHR1cmVQYXRoKCdzdWJkaXInKSkucm9vdCgpLmZ1bGw7XG5cbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnYWR2YW5jZWQtb3Blbi1maWxlLmhlbG1EaXJTd2l0Y2gnLCB0cnVlKTtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoJ3N1YmRpcicpICsgc3RkUGF0aC5zZXAgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmc1Jvb3QpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY2FuIHN3aXRjaCB0byB0aGUgcHJvamVjdCByb290IGRpcmVjdG9yeSB1c2luZyBhIHNob3J0Y3V0JywgKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuaGVsbURpclN3aXRjaCcsIHRydWUpO1xuICAgICAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFtmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKV0pO1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgnc3ViZGlyJykgKyAnOicgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKSArIHN0ZFBhdGguc2VwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnUGF0aCBpbnB1dCBkZWZhdWx0IHZhbHVlJywgKCkgPT4ge1xuICAgICAgICBiZWZvcmVFYWNoKHJlc2V0Q29uZmlnKTtcblxuICAgICAgICBpdCgnY2FuIGJlIGNvbmZpZ3VyZWQgdG8gYmUgdGhlIGN1cnJlbnQgZmlsZVxcJ3MgZGlyZWN0b3J5JywgKCkgPT4ge1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KFxuICAgICAgICAgICAgICAgICdhZHZhbmNlZC1vcGVuLWZpbGUuZGVmYXVsdElucHV0VmFsdWUnLFxuICAgICAgICAgICAgICAgIERFRkFVTFRfQUNUSVZFX0ZJTEVfRElSXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihmaXh0dXJlUGF0aCgnc2FtcGxlLmpzJykpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBvcGVuTW9kYWwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW4gYmUgY29uZmlndXJlZCB0byBiZSB0aGUgY3VycmVudCBwcm9qZWN0IHJvb3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXG4gICAgICAgICAgICAgICAgJ2FkdmFuY2VkLW9wZW4tZmlsZS5kZWZhdWx0SW5wdXRWYWx1ZScsXG4gICAgICAgICAgICAgICAgIERFRkFVTFRfUFJPSkVDVF9ST09UXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFtmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKV0pO1xuICAgICAgICAgICAgb3Blbk1vZGFsKCk7XG5cbiAgICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCdleGFtcGxlcycpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW4gYmUgY29uZmlndXJlZCB0byBiZSBibGFuaycsICgpID0+IHtcbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnYWR2YW5jZWQtb3Blbi1maWxlLmRlZmF1bHRJbnB1dFZhbHVlJywgREVGQVVMVF9FTVBUWSk7XG4gICAgICAgICAgICBvcGVuTW9kYWwoKTtcblxuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1VuZG8nLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2gocmVzZXRDb25maWcpO1xuICAgICAgICBiZWZvcmVFYWNoKG9wZW5Nb2RhbCk7XG5cbiAgICAgICAgaXQoJ2NhbiB1bmRvIHRhYiBjb21wbGV0aW9uJywgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgnZXhhbScpKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdhZHZhbmNlZC1vcGVuLWZpbGU6YXV0b2NvbXBsZXRlJyk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKSArIHBhdGguc2VwKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdhZHZhbmNlZC1vcGVuLWZpbGU6dW5kbycpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoZml4dHVyZVBhdGgoJ2V4YW0nKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjYW4gdW5kbyBkZWxldGluZyBwYXRoIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdleGFtJykpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTpkZWxldGUtcGF0aC1jb21wb25lbnQnKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCkgKyBwYXRoLnNlcCk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnYWR2YW5jZWQtb3Blbi1maWxlOnVuZG8nKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCdleGFtJykpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY2FuIHVuZG8gY2xpY2tpbmcgYSBmb2xkZXInLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCkgKyBwYXRoLnNlcCk7XG4gICAgICAgICAgICBjbGlja0ZpbGUoJ2V4YW1wbGVzJyk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKSArIHBhdGguc2VwKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdhZHZhbmNlZC1vcGVuLWZpbGU6dW5kbycpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoZml4dHVyZVBhdGgoKSArIHBhdGguc2VwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2JlZXBzIHdoZW4gaXQgY2Fubm90IHVuZG8gYW55IGZhcnRoZXInLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihhdG9tLCAnYmVlcCcpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTp1bmRvJyk7XG4gICAgICAgICAgICBleHBlY3QoYXRvbS5iZWVwKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ09wZW5pbmcgZmlsZXMnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2gocmVzZXRDb25maWcpO1xuICAgICAgICBiZWZvcmVFYWNoKG9wZW5Nb2RhbCk7XG5cbiAgICAgICAgaXQoJ29wZW5zIGFuIGV4aXN0aW5nIGZpbGUgaWYgdGhlIGN1cnJlbnQgcGF0aCBwb2ludHMgdG8gb25lJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBhdGggPSBmaXh0dXJlUGF0aCgnc2FtcGxlLmpzJyk7XG4gICAgICAgICAgICBzZXRQYXRoKHBhdGgpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y29uZmlybScpO1xuXG4gICAgICAgICAgICB3YWl0c0Zvck9wZW5QYXRocygxKTtcbiAgICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdXJyZW50RWRpdG9yUGF0aHMoKSkudG9FcXVhbChbcGF0aF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXBsYWNlcyB0aGUgcGF0aCB3aGVuIGF0dGVtcHRpbmcgdG8gb3BlbiBhbiBleGlzdGluZyBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdleGFtcGxlcycpKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdjb3JlOmNvbmZpcm0nKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCdleGFtcGxlcycpICsgcGF0aC5zZXApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChgYmVlcHMgd2hlbiBhdHRlbXB0aW5nIHRvIG9wZW4gYSBwYXRoIGVuZGluZyBpbiBhIHNlcGFyYXRvciAoYVxuICAgICAgICAgICAgbm9uLWV4aXN0YW50IGRpcmVjdG9yeSlgLCAoKSA9PiB7XG4gICAgICAgICAgICBzcHlPbihhdG9tLCAnYmVlcCcpO1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgnbm90dGhlcmUnKSArIHN0ZFBhdGguc2VwKTtcbiAgICAgICAgICAgIGRpc3BhdGNoKCdjb3JlOmNvbmZpcm0nKTtcbiAgICAgICAgICAgIGV4cGVjdChhdG9tLmJlZXApLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ29wZW5zIGEgbmV3IGZpbGUgd2l0aG91dCBzYXZpbmcgaXQgaWYgb3BlbmluZyBhIG5vbi1leGlzdGFudCBwYXRoJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBhdGggPSBmaXh0dXJlUGF0aCgnZG9lcy5ub3QuZXhpc3QnKTtcbiAgICAgICAgICAgIHNldFBhdGgocGF0aCk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnY29yZTpjb25maXJtJyk7XG5cbiAgICAgICAgICAgIHdhaXRzRm9yT3BlblBhdGhzKDEpO1xuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRFZGl0b3JQYXRocygpKS50b0VxdWFsKFtwYXRoXSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGZpbGVFeGlzdHMocGF0aCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdjcmVhdGVzIGEgbmV3IGZpbGUgd2hlbiBjb25maWd1cmVkIHRvJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHRlbXBEaXIgPSBmcy5yZWFscGF0aFN5bmModGVtcC5ta2RpclN5bmMoKSk7XG4gICAgICAgICAgICBsZXQgcGF0aCA9IHN0ZFBhdGguam9pbih0ZW1wRGlyLCAnbmV3ZmlsZS5qcycpO1xuICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuY3JlYXRlRmlsZUluc3RhbnRseScsIHRydWUpO1xuICAgICAgICAgICAgc2V0UGF0aChwYXRoKTtcbiAgICAgICAgICAgIGV4cGVjdChmaWxlRXhpc3RzKHBhdGgpKS50b0VxdWFsKGZhbHNlKTtcblxuICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y29uZmlybScpO1xuICAgICAgICAgICAgd2FpdHNGb3JPcGVuUGF0aHMoMSk7XG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3VycmVudEVkaXRvclBhdGhzKCkpLnRvRXF1YWwoW3BhdGhdKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoZmlsZUV4aXN0cyhwYXRoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnY3JlYXRlcyBpbnRlcm1lZGlhdGUgZGlyZWN0b3JpZXMgd2hlbiBuZWNlc3NhcnknLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgdGVtcERpciA9IGZzLnJlYWxwYXRoU3luYyh0ZW1wLm1rZGlyU3luYygpKTtcbiAgICAgICAgICAgIGxldCBuZXdEaXIgPSBzdGRQYXRoLmpvaW4odGVtcERpciwgJ25ld0RpcicpO1xuICAgICAgICAgICAgbGV0IHBhdGggPSBzdGRQYXRoLmpvaW4obmV3RGlyLCAnbmV3RmlsZS5qcycpO1xuICAgICAgICAgICAgc2V0UGF0aChwYXRoKTtcbiAgICAgICAgICAgIGV4cGVjdChmaWxlRXhpc3RzKG5ld0RpcikpLnRvRXF1YWwoZmFsc2UpO1xuXG4gICAgICAgICAgICBkaXNwYXRjaCgnY29yZTpjb25maXJtJyk7XG4gICAgICAgICAgICB3YWl0c0Zvck9wZW5QYXRocygxKTtcbiAgICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdXJyZW50RWRpdG9yUGF0aHMoKSkudG9FcXVhbChbcGF0aF0pO1xuICAgICAgICAgICAgICAgIGV4cGVjdChmaWxlRXhpc3RzKG5ld0RpcikpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnS2V5Ym9hcmQgbmF2aWdhdGlvbicsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaChyZXNldENvbmZpZyk7XG4gICAgICAgIGJlZm9yZUVhY2gob3Blbk1vZGFsKTtcblxuICAgICAgICAvKlxuICAgICAgICAgICAgRm9yIHJlZmVyZW5jZSwgZXhwZWN0ZWQgbGlzdGluZyBpbiBmaXh0dXJlcyBpczpcbiAgICAgICAgICAgIC4uXG4gICAgICAgICAgICBleGFtcGxlc1xuICAgICAgICAgICAgcHJlZml4X21hdGNoLmpzXG4gICAgICAgICAgICBwcmVmaXhfb3RoZXJfbWF0Y2guanNcbiAgICAgICAgICAgIHNhbXBsZS5qc1xuICAgICAgICAqL1xuXG4gICAgICAgIGZ1bmN0aW9uIG1vdmVEb3duKHRpbWVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRpbWVzOyBrKyspIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaCgnYWR2YW5jZWQtb3Blbi1maWxlOm1vdmUtY3Vyc29yLWRvd24nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1vdmVVcCh0aW1lcykge1xuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aW1lczsgaysrKSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2goJ2FkdmFuY2VkLW9wZW4tZmlsZTptb3ZlLWN1cnNvci11cCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaXQoJ2FsbG93cyBtb3ZpbmcgYSBjdXJzb3IgdG8gYSBmaWxlIGFuZCBjb25maXJtaW5nIHRvIHNlbGVjdCBhIHBhdGgnLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCkgKyBzdGRQYXRoLnNlcCk7XG4gICAgICAgICAgICBtb3ZlRG93big0KTtcbiAgICAgICAgICAgIG1vdmVVcCgxKTsgLy8gVGVzdCBtb3ZlbWVudCBib3RoIGRvd24gYW5kIHVwLlxuICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y29uZmlybScpO1xuXG4gICAgICAgICAgICB3YWl0c0Zvck9wZW5QYXRocygxKTtcbiAgICAgICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGV4cGVjdChjdXJyZW50RWRpdG9yUGF0aHMoKSkudG9FcXVhbChbZml4dHVyZVBhdGgoJ3ByZWZpeF9tYXRjaC5qcycpXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3dyYXBzIHRoZSBjdXJzb3IgYXQgdGhlIGVkZ2VzJywgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgbW92ZVVwKDIpO1xuICAgICAgICAgICAgbW92ZURvd24oNCk7XG4gICAgICAgICAgICBtb3ZlVXAoNSk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnY29yZTpjb25maXJtJyk7XG5cbiAgICAgICAgICAgIHdhaXRzRm9yT3BlblBhdGhzKDEpO1xuICAgICAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRFZGl0b3JQYXRocygpKS50b0VxdWFsKFtmaXh0dXJlUGF0aCgncHJlZml4X21hdGNoLmpzJyldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgncmVwbGFjZXMgdGhlIGN1cnJlbnQgcGF0aCB3aGVuIHNlbGVjdGluZyBhIGRpcmVjdG9yeScsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoKSArIHBhdGguc2VwKTtcbiAgICAgICAgICAgIG1vdmVEb3duKDIpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y29uZmlybScpO1xuICAgICAgICAgICAgZXhwZWN0KGN1cnJlbnRQYXRoKCkpLnRvRXF1YWwoZml4dHVyZVBhdGgoJ2V4YW1wbGVzJykgKyBwYXRoLnNlcClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ21vdmVzIHRvIHRoZSBwYXJlbnQgZGlyZWN0b3J5IHdoZW4gdGhlIC4uIGVsZW1lbnQgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdleGFtcGxlcycpICsgcGF0aC5zZXApO1xuICAgICAgICAgICAgbW92ZURvd24oMSk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnY29yZTpjb25maXJtJyk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgpICsgcGF0aC5zZXApXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KGBjYW4gc2VsZWN0IHRoZSBmaXJzdCBpdGVtIGluIHRoZSBsaXN0IGlmIG5vbmUgYXJlIHNlbGVjdGVkIHVzaW5nXG4gICAgICAgICAgICBzcGVjaWFsIGNvbW1hbmRgLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCdwcmVmaXgnKSk7XG4gICAgICAgICAgICBkaXNwYXRjaCgnYWR2YW5jZWQtb3Blbi1maWxlOmNvbmZpcm0tc2VsZWN0ZWQtb3ItZmlyc3QnKTtcblxuICAgICAgICAgICAgd2FpdHNGb3JPcGVuUGF0aHMoMSk7XG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3VycmVudEVkaXRvclBhdGhzKCkpLnRvRXF1YWwoW2ZpeHR1cmVQYXRoKCdwcmVmaXhfbWF0Y2guanMnKV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnTW91c2UgbmF2aWdhdGlvbicsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaChyZXNldENvbmZpZyk7XG4gICAgICAgIGJlZm9yZUVhY2gob3Blbk1vZGFsKTtcblxuICAgICAgICBpdCgnb3BlbnMgYSBwYXRoIHdoZW4gaXQgaXMgY2xpY2tlZCBvbicsICgpID0+IHtcbiAgICAgICAgICAgIHNldFBhdGgoZml4dHVyZVBhdGgoKSArIHN0ZFBhdGguc2VwKTtcbiAgICAgICAgICAgIGNsaWNrRmlsZSgnc2FtcGxlLmpzJylcblxuICAgICAgICAgICAgd2FpdHNGb3JPcGVuUGF0aHMoMSk7XG4gICAgICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICAgICAgICBleHBlY3QoY3VycmVudEVkaXRvclBhdGhzKCkpLnRvRXF1YWwoW2ZpeHR1cmVQYXRoKCdzYW1wbGUuanMnKV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdyZXBsYWNlcyB0aGUgY3VycmVudCBwYXRoIHdoZW4gY2xpY2tpbmcgYSBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgICAgICAgICBzZXRQYXRoKGZpeHR1cmVQYXRoKCkgKyBwYXRoLnNlcCk7XG4gICAgICAgICAgICBjbGlja0ZpbGUoJ2V4YW1wbGVzJyk7XG4gICAgICAgICAgICBleHBlY3QoY3VycmVudFBhdGgoKSkudG9FcXVhbChmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKSArIHBhdGguc2VwKVxuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnbW92ZXMgdG8gdGhlIHBhcmVudCBkaXJlY3Rvcnkgd2hlbiB0aGUgLi4gZWxlbWVudCBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAgICAgc2V0UGF0aChmaXh0dXJlUGF0aCgnZXhhbXBsZXMnKSArIHBhdGguc2VwKTtcbiAgICAgICAgICAgIHVpLmZpbmQoJy5wYXJlbnQtZGlyZWN0b3J5JykuY2xpY2soKTtcbiAgICAgICAgICAgIGV4cGVjdChjdXJyZW50UGF0aCgpKS50b0VxdWFsKGZpeHR1cmVQYXRoKCkgKyBwYXRoLnNlcClcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnRXZlbnRzJywgKCkgPT4ge1xuICAgICAgICBiZWZvcmVFYWNoKHJlc2V0Q29uZmlnKTtcbiAgICAgICAgYmVmb3JlRWFjaChvcGVuTW9kYWwpO1xuXG4gICAgICAgIGl0KCdhbGxvd3Mgc3Vic2NyaXB0aW9uIHRvIGV2ZW50cyB3aGVuIHBhdGhzIGFyZSBvcGVuZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlciA9IGphc21pbmUuY3JlYXRlU3B5KCdoYW5kbGVyJyk7XG4gICAgICAgICAgICBsZXQgc3ViID0gb25EaWRPcGVuUGF0aChoYW5kbGVyKTtcbiAgICAgICAgICAgIGxldCBwYXRoID0gZml4dHVyZVBhdGgoJ3NhbXBsZS5qcycpO1xuXG4gICAgICAgICAgICBzZXRQYXRoKHBhdGgpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y29uZmlybScpO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGgpO1xuICAgICAgICAgICAgc3ViLmRpc3Bvc2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ2FsbG93cyBzdWJzY3JpcHRpb24gdG8gZXZlbnRzIHdoZW4gcGF0aHMgYXJlIGNyZWF0ZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2FkdmFuY2VkLW9wZW4tZmlsZS5jcmVhdGVGaWxlSW5zdGFudGx5JywgdHJ1ZSk7XG4gICAgICAgICAgICBsZXQgdGVtcERpciA9IGZzLnJlYWxwYXRoU3luYyh0ZW1wLm1rZGlyU3luYygpKTtcbiAgICAgICAgICAgIGxldCBwYXRoID0gc3RkUGF0aC5qb2luKHRlbXBEaXIsICduZXdmaWxlLmpzJyk7XG4gICAgICAgICAgICBsZXQgaGFuZGxlciA9IGphc21pbmUuY3JlYXRlU3B5KCdoYW5kbGVyJyk7XG4gICAgICAgICAgICBsZXQgc3ViID0gb25EaWRDcmVhdGVQYXRoKGhhbmRsZXIpO1xuXG4gICAgICAgICAgICBzZXRQYXRoKHBhdGgpO1xuICAgICAgICAgICAgZGlzcGF0Y2goJ2NvcmU6Y29uZmlybScpO1xuICAgICAgICAgICAgZXhwZWN0KGhhbmRsZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHBhdGgpO1xuICAgICAgICAgICAgc3ViLmRpc3Bvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/spec/advanced-open-file-spec.js
