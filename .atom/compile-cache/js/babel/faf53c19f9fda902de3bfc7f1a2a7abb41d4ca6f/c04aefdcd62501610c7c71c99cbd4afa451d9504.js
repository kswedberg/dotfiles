Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

var _config = require('./config');

var _utils = require('./utils');

/**
 * Wrapper for dealing with filesystem paths.
 */

var Path = (function () {
    function Path() {
        var path = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

        _classCallCheck(this, Path);

        // The last path segment is the "fragment". Paths that end in a
        // separator have a blank fragment.
        var sep = (0, _utils.preferredSeparatorFor)(path);
        var parts = path.split(sep);
        var fragment = parts[parts.length - 1];
        var directory = path.substring(0, path.length - fragment.length);

        // Set non-writable properties.
        (0, _utils.defineImmutable)(this, 'directory', directory);
        (0, _utils.defineImmutable)(this, 'fragment', fragment);
        (0, _utils.defineImmutable)(this, 'full', path);
        (0, _utils.defineImmutable)(this, 'sep', sep);
    }

    /**
     * Return whether the filename matches the given path fragment.
     */

    _createDecoratedClass(Path, [{
        key: 'isDirectory',
        value: function isDirectory() {
            return this.stat ? this.stat.isDirectory() : null;
        }
    }, {
        key: 'isFile',
        value: function isFile() {
            return this.stat ? !this.stat.isDirectory() : null;
        }
    }, {
        key: 'isProjectDirectory',
        value: function isProjectDirectory() {
            return atom.project.getPaths().indexOf(this.full) !== -1;
        }
    }, {
        key: 'isRoot',
        value: function isRoot() {
            return _path2['default'].dirname(this.full) === this.full;
        }
    }, {
        key: 'hasCaseSensitiveFragment',
        value: function hasCaseSensitiveFragment() {
            return this.fragment !== '' && this.fragment !== this.fragment.toLowerCase();
        }
    }, {
        key: 'exists',
        value: function exists() {
            return this.stat !== null;
        }
    }, {
        key: 'asDirectory',
        value: function asDirectory() {
            return new Path(this.full + (this.fragment ? this.sep : ''));
        }
    }, {
        key: 'parent',
        value: function parent() {
            if (this.isRoot()) {
                return this;
            } else if (this.fragment) {
                return new Path(this.directory);
            } else {
                return new Path(_path2['default'].dirname(this.directory) + this.sep);
            }
        }

        /**
         * Return path for the root directory for the drive this path is on.
         */
    }, {
        key: 'root',
        value: function root() {
            var last = null;
            var current = this.full;
            while (current !== last) {
                last = current;
                current = _path2['default'].dirname(current);
            }

            return new Path(current);
        }

        /**
         * Create an empty file at the given path if it doesn't already exist.
         */
    }, {
        key: 'createFile',
        value: function createFile() {
            _touch2['default'].sync((0, _utils.absolutify)(this.full));
        }

        /**
         * Create directories for the file this path points to, or do nothing
         * if they already exist.
         */
    }, {
        key: 'createDirectories',
        value: function createDirectories() {
            try {
                _mkdirp2['default'].sync((0, _utils.absolutify)(this.directory));
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    throw err;
                }
            }
        }
    }, {
        key: 'matchingPaths',
        value: function matchingPaths() {
            var _this = this;

            var caseSensitive = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

            var absoluteDir = (0, _utils.absolutify)(this.directory);
            var filenames = null;

            try {
                filenames = _fs2['default'].readdirSync(absoluteDir);
            } catch (err) {
                return []; // TODO: Catch permissions error and display a message.
            }

            if (this.fragment) {
                if (caseSensitive === null) {
                    caseSensitive = this.hasCaseSensitiveFragment();
                }

                filenames = filenames.filter(function (fn) {
                    return matchFragment(_this.fragment, fn, caseSensitive);
                });
            }

            return filenames.map(function (fn) {
                return new Path(_this.directory + fn);
            });
        }
    }, {
        key: 'equals',
        value: function equals(otherPath) {
            return this.full === otherPath.full;
        }

        /**
         * Return the path to show initially in the path input.
         */
    }, {
        key: 'stat',
        decorators: [_utils.cachedProperty],
        get: function get() {
            try {
                return _fs2['default'].statSync((0, _utils.absolutify)(this.full));
            } catch (err) {
                if (err.code === 'ENOENT') {
                    return null;
                } else {
                    throw err;
                }
            }
        }
    }], [{
        key: 'initial',
        value: function initial() {
            switch (atom.config.get('advanced-open-file.defaultInputValue')) {
                case _config.DEFAULT_ACTIVE_FILE_DIR:
                    var editor = atom.workspace.getActiveTextEditor();
                    if (editor && editor.getPath()) {
                        return new Path(_path2['default'].dirname(editor.getPath()) + _path2['default'].sep);
                    }
                    break;
                case _config.DEFAULT_PROJECT_ROOT:
                    var projectPath = (0, _utils.getProjectPath)();
                    if (projectPath) {
                        return new Path(projectPath + _path2['default'].sep);
                    }
                    break;
            }

            return new Path('');
        }

        /**
         * Compare two paths lexicographically.
         */
    }, {
        key: 'compare',
        value: function compare(path1, path2) {
            return path1.full.localeCompare(path2.full);
        }

        /**
         * Return a new path instance with the common prefix of all the
         * given paths.
         */
    }, {
        key: 'commonPrefix',
        value: function commonPrefix(paths) {
            var caseSensitive = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (paths.length < 2) {
                throw new Error('Cannot find common prefix for lists shorter than two elements.');
            }

            paths = paths.map(function (path) {
                return path.full;
            }).sort();
            var first = paths[0];
            var last = paths[paths.length - 1];

            var prefix = '';
            var prefixMaxLength = Math.min(first.length, last.length);
            for (var k = 0; k < prefixMaxLength; k++) {
                if (first[k] === last[k]) {
                    prefix += first[k];
                } else if (!caseSensitive && first[k].toLowerCase() === last[k].toLowerCase()) {
                    prefix += first[k].toLowerCase();
                } else {
                    break;
                }
            }

            return new Path(prefix);
        }
    }]);

    return Path;
})();

exports.Path = Path;
function matchFragment(fragment, filename) {
    var caseSensitive = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (!caseSensitive) {
        fragment = fragment.toLowerCase();
        filename = filename.toLowerCase();
    }

    return filename.startsWith(fragment);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9tb2RlbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0MsTUFBTTs7OztzQkFFUCxRQUFROzs7O3FCQUNULE9BQU87Ozs7c0JBRW1DLFVBQVU7O3FCQU8vRCxTQUFTOzs7Ozs7SUFNSCxJQUFJO0FBQ0YsYUFERixJQUFJLEdBQ1E7WUFBVCxJQUFJLHlEQUFDLEVBQUU7OzhCQURWLElBQUk7Ozs7QUFJVCxZQUFJLEdBQUcsR0FBRyxrQ0FBc0IsSUFBSSxDQUFDLENBQUM7QUFDdEMsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixZQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN2QyxZQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBR2pFLG9DQUFnQixJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzlDLG9DQUFnQixJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzVDLG9DQUFnQixJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BDLG9DQUFnQixJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3JDOzs7Ozs7MEJBZFEsSUFBSTs7ZUE2QkYsdUJBQUc7QUFDVixtQkFBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDO1NBQ3JEOzs7ZUFFSyxrQkFBRztBQUNMLG1CQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJ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QVcsRUFBRSxFQUFFO0FBQzNFLDBCQUFNLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUNwQyxNQUFNO0FBQ0gsMEJBQU07aUJBQ1Q7YUFDSjs7QUFFRCxtQkFBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMzQjs7O1dBMUxRLElBQUk7Ozs7QUFnTWpCLFNBQVMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQXVCO1FBQXJCLGFBQWEseURBQUMsS0FBSzs7QUFDMUQsUUFBSSxDQUFDLGFBQWEsRUFBRTtBQUNoQixnQkFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNsQyxnQkFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNyQzs7QUFFRCxXQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDeEMiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvbGliL21vZGVscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBzdGRQYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQgdG91Y2ggZnJvbSAndG91Y2gnO1xuXG5pbXBvcnQge0RFRkFVTFRfQUNUSVZFX0ZJTEVfRElSLCBERUZBVUxUX1BST0pFQ1RfUk9PVH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHtcbiAgICBhYnNvbHV0aWZ5LFxuICAgIGNhY2hlZFByb3BlcnR5LFxuICAgIGRlZmluZUltbXV0YWJsZSxcbiAgICBnZXRQcm9qZWN0UGF0aCxcbiAgICBwcmVmZXJyZWRTZXBhcmF0b3JGb3Jcbn0gZnJvbSAnLi91dGlscyc7XG5cblxuLyoqXG4gKiBXcmFwcGVyIGZvciBkZWFsaW5nIHdpdGggZmlsZXN5c3RlbSBwYXRocy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhdGgge1xuICAgIGNvbnN0cnVjdG9yKHBhdGg9JycpIHtcbiAgICAgICAgLy8gVGhlIGxhc3QgcGF0aCBzZWdtZW50IGlzIHRoZSBcImZyYWdtZW50XCIuIFBhdGhzIHRoYXQgZW5kIGluIGFcbiAgICAgICAgLy8gc2VwYXJhdG9yIGhhdmUgYSBibGFuayBmcmFnbWVudC5cbiAgICAgICAgbGV0IHNlcCA9IHByZWZlcnJlZFNlcGFyYXRvckZvcihwYXRoKTtcbiAgICAgICAgbGV0IHBhcnRzID0gcGF0aC5zcGxpdChzZXApO1xuICAgICAgICBsZXQgZnJhZ21lbnQgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgbGV0IGRpcmVjdG9yeSA9IHBhdGguc3Vic3RyaW5nKDAsIHBhdGgubGVuZ3RoIC0gZnJhZ21lbnQubGVuZ3RoKTtcblxuICAgICAgICAvLyBTZXQgbm9uLXdyaXRhYmxlIHByb3BlcnRpZXMuXG4gICAgICAgIGRlZmluZUltbXV0YWJsZSh0aGlzLCAnZGlyZWN0b3J5JywgZGlyZWN0b3J5KTtcbiAgICAgICAgZGVmaW5lSW1tdXRhYmxlKHRoaXMsICdmcmFnbWVudCcsIGZyYWdtZW50KTtcbiAgICAgICAgZGVmaW5lSW1tdXRhYmxlKHRoaXMsICdmdWxsJywgcGF0aCk7XG4gICAgICAgIGRlZmluZUltbXV0YWJsZSh0aGlzLCAnc2VwJywgc2VwKTtcbiAgICB9XG5cbiAgICBAY2FjaGVkUHJvcGVydHlcbiAgICBnZXQgc3RhdCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBmcy5zdGF0U3luYyhhYnNvbHV0aWZ5KHRoaXMuZnVsbCkpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNEaXJlY3RvcnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXQgPyB0aGlzLnN0YXQuaXNEaXJlY3RvcnkoKSA6IG51bGw7XG4gICAgfVxuXG4gICAgaXNGaWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ID8gIXRoaXMuc3RhdC5pc0RpcmVjdG9yeSgpIDogbnVsbDtcbiAgICB9XG5cbiAgICBpc1Byb2plY3REaXJlY3RvcnkoKSB7XG4gICAgICAgIHJldHVybiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5pbmRleE9mKHRoaXMuZnVsbCkgIT09IC0xO1xuICAgIH1cblxuICAgIGlzUm9vdCgpIHtcbiAgICAgICAgcmV0dXJuIHN0ZFBhdGguZGlybmFtZSh0aGlzLmZ1bGwpID09PSB0aGlzLmZ1bGw7XG4gICAgfVxuXG4gICAgaGFzQ2FzZVNlbnNpdGl2ZUZyYWdtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mcmFnbWVudCAhPT0gJycgJiYgdGhpcy5mcmFnbWVudCAhPT0gdGhpcy5mcmFnbWVudC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGV4aXN0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdCAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICBhc0RpcmVjdG9yeSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHRoaXMuZnVsbCArICh0aGlzLmZyYWdtZW50ID8gdGhpcy5zZXAgOiAnJykpO1xuICAgIH1cblxuICAgIHBhcmVudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSb290KCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZnJhZ21lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGF0aCh0aGlzLmRpcmVjdG9yeSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBhdGgoc3RkUGF0aC5kaXJuYW1lKHRoaXMuZGlyZWN0b3J5KSArIHRoaXMuc2VwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBwYXRoIGZvciB0aGUgcm9vdCBkaXJlY3RvcnkgZm9yIHRoZSBkcml2ZSB0aGlzIHBhdGggaXMgb24uXG4gICAgICovXG4gICAgcm9vdCgpIHtcbiAgICAgICAgbGV0IGxhc3QgPSBudWxsO1xuICAgICAgICBsZXQgY3VycmVudCA9IHRoaXMuZnVsbDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IGxhc3QpIHtcbiAgICAgICAgICAgIGxhc3QgPSBjdXJyZW50O1xuICAgICAgICAgICAgY3VycmVudCA9IHN0ZFBhdGguZGlybmFtZShjdXJyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUGF0aChjdXJyZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gZW1wdHkgZmlsZSBhdCB0aGUgZ2l2ZW4gcGF0aCBpZiBpdCBkb2Vzbid0IGFscmVhZHkgZXhpc3QuXG4gICAgICovXG4gICAgY3JlYXRlRmlsZSgpIHtcbiAgICAgICAgdG91Y2guc3luYyhhYnNvbHV0aWZ5KHRoaXMuZnVsbCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBkaXJlY3RvcmllcyBmb3IgdGhlIGZpbGUgdGhpcyBwYXRoIHBvaW50cyB0bywgb3IgZG8gbm90aGluZ1xuICAgICAqIGlmIHRoZXkgYWxyZWFkeSBleGlzdC5cbiAgICAgKi9cbiAgICBjcmVhdGVEaXJlY3RvcmllcygpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG1rZGlycC5zeW5jKGFic29sdXRpZnkodGhpcy5kaXJlY3RvcnkpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyLmNvZGUgIT09ICdFTk9FTlQnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWF0Y2hpbmdQYXRocyhjYXNlU2Vuc2l0aXZlPW51bGwpIHtcbiAgICAgICAgbGV0IGFic29sdXRlRGlyID0gYWJzb2x1dGlmeSh0aGlzLmRpcmVjdG9yeSk7XG4gICAgICAgIGxldCBmaWxlbmFtZXMgPSBudWxsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaWxlbmFtZXMgPSBmcy5yZWFkZGlyU3luYyhhYnNvbHV0ZURpcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIFtdOyAvLyBUT0RPOiBDYXRjaCBwZXJtaXNzaW9ucyBlcnJvciBhbmQgZGlzcGxheSBhIG1lc3NhZ2UuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5mcmFnbWVudCkge1xuICAgICAgICAgICAgaWYgKGNhc2VTZW5zaXRpdmUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjYXNlU2Vuc2l0aXZlID0gdGhpcy5oYXNDYXNlU2Vuc2l0aXZlRnJhZ21lbnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmlsZW5hbWVzID0gZmlsZW5hbWVzLmZpbHRlcihcbiAgICAgICAgICAgICAgICAoZm4pID0+IG1hdGNoRnJhZ21lbnQodGhpcy5mcmFnbWVudCwgZm4sIGNhc2VTZW5zaXRpdmUpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVuYW1lcy5tYXAoKGZuKSA9PiBuZXcgUGF0aCh0aGlzLmRpcmVjdG9yeSArIGZuKSk7XG4gICAgfVxuXG4gICAgZXF1YWxzKG90aGVyUGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mdWxsID09PSBvdGhlclBhdGguZnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIHBhdGggdG8gc2hvdyBpbml0aWFsbHkgaW4gdGhlIHBhdGggaW5wdXQuXG4gICAgICovXG4gICAgc3RhdGljIGluaXRpYWwoKSB7XG4gICAgICAgIHN3aXRjaCAoYXRvbS5jb25maWcuZ2V0KCdhZHZhbmNlZC1vcGVuLWZpbGUuZGVmYXVsdElucHV0VmFsdWUnKSkge1xuICAgICAgICAgICAgY2FzZSBERUZBVUxUX0FDVElWRV9GSUxFX0RJUjpcbiAgICAgICAgICAgICAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgICAgICAgICAgIGlmIChlZGl0b3IgJiYgZWRpdG9yLmdldFBhdGgoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFBhdGgoc3RkUGF0aC5kaXJuYW1lKGVkaXRvci5nZXRQYXRoKCkpICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgREVGQVVMVF9QUk9KRUNUX1JPT1Q6XG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RQYXRoID0gZ2V0UHJvamVjdFBhdGgoKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvamVjdFBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHByb2plY3RQYXRoICsgc3RkUGF0aC5zZXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUGF0aCgnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tcGFyZSB0d28gcGF0aHMgbGV4aWNvZ3JhcGhpY2FsbHkuXG4gICAgICovXG4gICAgc3RhdGljIGNvbXBhcmUocGF0aDEsIHBhdGgyKSB7XG4gICAgICAgIHJldHVybiBwYXRoMS5mdWxsLmxvY2FsZUNvbXBhcmUocGF0aDIuZnVsbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgbmV3IHBhdGggaW5zdGFuY2Ugd2l0aCB0aGUgY29tbW9uIHByZWZpeCBvZiBhbGwgdGhlXG4gICAgICogZ2l2ZW4gcGF0aHMuXG4gICAgICovXG4gICAgc3RhdGljIGNvbW1vblByZWZpeChwYXRocywgY2FzZVNlbnNpdGl2ZT1mYWxzZSkge1xuICAgICAgICBpZiAocGF0aHMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICdDYW5ub3QgZmluZCBjb21tb24gcHJlZml4IGZvciBsaXN0cyBzaG9ydGVyIHRoYW4gdHdvIGVsZW1lbnRzLidcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXRocyA9IHBhdGhzLm1hcCgocGF0aCkgPT4gcGF0aC5mdWxsKS5zb3J0KCk7XG4gICAgICAgIGxldCBmaXJzdCA9IHBhdGhzWzBdO1xuICAgICAgICBsZXQgbGFzdCA9IHBhdGhzW3BhdGhzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIGxldCBwcmVmaXggPSAnJztcbiAgICAgICAgbGV0IHByZWZpeE1heExlbmd0aCA9IE1hdGgubWluKGZpcnN0Lmxlbmd0aCwgbGFzdC5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHByZWZpeE1heExlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBpZiAoZmlyc3Rba10gPT09IGxhc3Rba10pIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggKz0gZmlyc3Rba107XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFjYXNlU2Vuc2l0aXZlICYmIGZpcnN0W2tdLnRvTG93ZXJDYXNlKCkgPT09IGxhc3Rba10udG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIHByZWZpeCArPSBmaXJzdFtrXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUGF0aChwcmVmaXgpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZXR1cm4gd2hldGhlciB0aGUgZmlsZW5hbWUgbWF0Y2hlcyB0aGUgZ2l2ZW4gcGF0aCBmcmFnbWVudC5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hGcmFnbWVudChmcmFnbWVudCwgZmlsZW5hbWUsIGNhc2VTZW5zaXRpdmU9ZmFsc2UpIHtcbiAgICBpZiAoIWNhc2VTZW5zaXRpdmUpIHtcbiAgICAgICAgZnJhZ21lbnQgPSBmcmFnbWVudC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbGVuYW1lLnN0YXJ0c1dpdGgoZnJhZ21lbnQpO1xufVxuIl19
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/lib/models.js
