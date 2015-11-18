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
            var prefixMaxLength = Math.max(first.length, last.length);
            for (var k = 0; k < prefixMaxLength - 1; k++) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9tb2RlbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0MsTUFBTTs7OztzQkFFUCxRQUFROzs7O3FCQUNULE9BQU87Ozs7c0JBRW1DLFVBQVU7O3FCQU8vRCxTQUFTOzs7Ozs7SUFNSCxJQUFJO0FBQ0YsYUFERixJQUFJLEdBQ1E7WUFBVCxJQUFJLHlEQUFDLEVBQUU7OzhCQURWLElBQUk7Ozs7QUFJVCxZQUFJLEdBQUcsR0FBRyxrQ0FBc0IsSUFBSSxDQUFDLENBQUM7QUFDdEMsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixZQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN2QyxZQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBR2pFLG9DQUFnQixJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzlDLG9DQUFnQixJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzVDLG9DQUFnQixJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BDLG9DQUFnQixJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3JDOzs7Ozs7MEJBZFEsSUFBSTs7ZUE2QkYsdUJBQUc7QUFDVixtQkFBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDO1NBQ3JEOzs7ZUFFSyxrQkFBRztBQUNMLG1CQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJ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QUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtBQUMzRSwwQkFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztpQkFDcEMsTUFBTTtBQUNILDBCQUFNO2lCQUNUO2FBQ0o7O0FBRUQsbUJBQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0I7OztXQTFMUSxJQUFJOzs7O0FBZ01qQixTQUFTLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUF1QjtRQUFyQixhQUFhLHlEQUFDLEtBQUs7O0FBQzFELFFBQUksQ0FBQyxhQUFhLEVBQUU7QUFDaEIsZ0JBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbEMsZ0JBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDckM7O0FBRUQsV0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQ3hDIiwiZmlsZSI6Ii9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9tb2RlbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgc3RkUGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuaW1wb3J0IHRvdWNoIGZyb20gJ3RvdWNoJztcblxuaW1wb3J0IHtERUZBVUxUX0FDVElWRV9GSUxFX0RJUiwgREVGQVVMVF9QUk9KRUNUX1JPT1R9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7XG4gICAgYWJzb2x1dGlmeSxcbiAgICBjYWNoZWRQcm9wZXJ0eSxcbiAgICBkZWZpbmVJbW11dGFibGUsXG4gICAgZ2V0UHJvamVjdFBhdGgsXG4gICAgcHJlZmVycmVkU2VwYXJhdG9yRm9yXG59IGZyb20gJy4vdXRpbHMnO1xuXG5cbi8qKlxuICogV3JhcHBlciBmb3IgZGVhbGluZyB3aXRoIGZpbGVzeXN0ZW0gcGF0aHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQYXRoIHtcbiAgICBjb25zdHJ1Y3RvcihwYXRoPScnKSB7XG4gICAgICAgIC8vIFRoZSBsYXN0IHBhdGggc2VnbWVudCBpcyB0aGUgXCJmcmFnbWVudFwiLiBQYXRocyB0aGF0IGVuZCBpbiBhXG4gICAgICAgIC8vIHNlcGFyYXRvciBoYXZlIGEgYmxhbmsgZnJhZ21lbnQuXG4gICAgICAgIGxldCBzZXAgPSBwcmVmZXJyZWRTZXBhcmF0b3JGb3IocGF0aCk7XG4gICAgICAgIGxldCBwYXJ0cyA9IHBhdGguc3BsaXQoc2VwKTtcbiAgICAgICAgbGV0IGZyYWdtZW50ID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG4gICAgICAgIGxldCBkaXJlY3RvcnkgPSBwYXRoLnN1YnN0cmluZygwLCBwYXRoLmxlbmd0aCAtIGZyYWdtZW50Lmxlbmd0aCk7XG5cbiAgICAgICAgLy8gU2V0IG5vbi13cml0YWJsZSBwcm9wZXJ0aWVzLlxuICAgICAgICBkZWZpbmVJbW11dGFibGUodGhpcywgJ2RpcmVjdG9yeScsIGRpcmVjdG9yeSk7XG4gICAgICAgIGRlZmluZUltbXV0YWJsZSh0aGlzLCAnZnJhZ21lbnQnLCBmcmFnbWVudCk7XG4gICAgICAgIGRlZmluZUltbXV0YWJsZSh0aGlzLCAnZnVsbCcsIHBhdGgpO1xuICAgICAgICBkZWZpbmVJbW11dGFibGUodGhpcywgJ3NlcCcsIHNlcCk7XG4gICAgfVxuXG4gICAgQGNhY2hlZFByb3BlcnR5XG4gICAgZ2V0IHN0YXQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZnMuc3RhdFN5bmMoYWJzb2x1dGlmeSh0aGlzLmZ1bGwpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRGlyZWN0b3J5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ID8gdGhpcy5zdGF0LmlzRGlyZWN0b3J5KCkgOiBudWxsO1xuICAgIH1cblxuICAgIGlzRmlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdCA/ICF0aGlzLnN0YXQuaXNEaXJlY3RvcnkoKSA6IG51bGw7XG4gICAgfVxuXG4gICAgaXNQcm9qZWN0RGlyZWN0b3J5KCkge1xuICAgICAgICByZXR1cm4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkuaW5kZXhPZih0aGlzLmZ1bGwpICE9PSAtMTtcbiAgICB9XG5cbiAgICBpc1Jvb3QoKSB7XG4gICAgICAgIHJldHVybiBzdGRQYXRoLmRpcm5hbWUodGhpcy5mdWxsKSA9PT0gdGhpcy5mdWxsO1xuICAgIH1cblxuICAgIGhhc0Nhc2VTZW5zaXRpdmVGcmFnbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJhZ21lbnQgIT09ICcnICYmIHRoaXMuZnJhZ21lbnQgIT09IHRoaXMuZnJhZ21lbnQudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBleGlzdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXQgIT09IG51bGw7XG4gICAgfVxuXG4gICAgYXNEaXJlY3RvcnkoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUGF0aCh0aGlzLmZ1bGwgKyAodGhpcy5mcmFnbWVudCA/IHRoaXMuc2VwIDogJycpKTtcbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUm9vdCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZyYWdtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBhdGgodGhpcy5kaXJlY3RvcnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHN0ZFBhdGguZGlybmFtZSh0aGlzLmRpcmVjdG9yeSkgKyB0aGlzLnNlcCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gcGF0aCBmb3IgdGhlIHJvb3QgZGlyZWN0b3J5IGZvciB0aGUgZHJpdmUgdGhpcyBwYXRoIGlzIG9uLlxuICAgICAqL1xuICAgIHJvb3QoKSB7XG4gICAgICAgIGxldCBsYXN0ID0gbnVsbDtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSB0aGlzLmZ1bGw7XG4gICAgICAgIHdoaWxlIChjdXJyZW50ICE9PSBsYXN0KSB7XG4gICAgICAgICAgICBsYXN0ID0gY3VycmVudDtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBzdGRQYXRoLmRpcm5hbWUoY3VycmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFBhdGgoY3VycmVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuIGVtcHR5IGZpbGUgYXQgdGhlIGdpdmVuIHBhdGggaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0LlxuICAgICAqL1xuICAgIGNyZWF0ZUZpbGUoKSB7XG4gICAgICAgIHRvdWNoLnN5bmMoYWJzb2x1dGlmeSh0aGlzLmZ1bGwpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgZGlyZWN0b3JpZXMgZm9yIHRoZSBmaWxlIHRoaXMgcGF0aCBwb2ludHMgdG8sIG9yIGRvIG5vdGhpbmdcbiAgICAgKiBpZiB0aGV5IGFscmVhZHkgZXhpc3QuXG4gICAgICovXG4gICAgY3JlYXRlRGlyZWN0b3JpZXMoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0aWZ5KHRoaXMuZGlyZWN0b3J5KSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGVyci5jb2RlICE9PSAnRU5PRU5UJykge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1hdGNoaW5nUGF0aHMoY2FzZVNlbnNpdGl2ZT1udWxsKSB7XG4gICAgICAgIGxldCBhYnNvbHV0ZURpciA9IGFic29sdXRpZnkodGhpcy5kaXJlY3RvcnkpO1xuICAgICAgICBsZXQgZmlsZW5hbWVzID0gbnVsbDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmlsZW5hbWVzID0gZnMucmVhZGRpclN5bmMoYWJzb2x1dGVEaXIpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTsgLy8gVE9ETzogQ2F0Y2ggcGVybWlzc2lvbnMgZXJyb3IgYW5kIGRpc3BsYXkgYSBtZXNzYWdlLlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZnJhZ21lbnQpIHtcbiAgICAgICAgICAgIGlmIChjYXNlU2Vuc2l0aXZlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY2FzZVNlbnNpdGl2ZSA9IHRoaXMuaGFzQ2FzZVNlbnNpdGl2ZUZyYWdtZW50KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbGVuYW1lcyA9IGZpbGVuYW1lcy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKGZuKSA9PiBtYXRjaEZyYWdtZW50KHRoaXMuZnJhZ21lbnQsIGZuLCBjYXNlU2Vuc2l0aXZlKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlbmFtZXMubWFwKChmbikgPT4gbmV3IFBhdGgodGhpcy5kaXJlY3RvcnkgKyBmbikpO1xuICAgIH1cblxuICAgIGVxdWFscyhvdGhlclBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZnVsbCA9PT0gb3RoZXJQYXRoLmZ1bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBwYXRoIHRvIHNob3cgaW5pdGlhbGx5IGluIHRoZSBwYXRoIGlucHV0LlxuICAgICAqL1xuICAgIHN0YXRpYyBpbml0aWFsKCkge1xuICAgICAgICBzd2l0Y2ggKGF0b20uY29uZmlnLmdldCgnYWR2YW5jZWQtb3Blbi1maWxlLmRlZmF1bHRJbnB1dFZhbHVlJykpIHtcbiAgICAgICAgICAgIGNhc2UgREVGQVVMVF9BQ1RJVkVfRklMRV9ESVI6XG4gICAgICAgICAgICAgICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yICYmIGVkaXRvci5nZXRQYXRoKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHN0ZFBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKSArIHN0ZFBhdGguc2VwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIERFRkFVTFRfUFJPSkVDVF9ST09UOlxuICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0UGF0aCA9IGdldFByb2plY3RQYXRoKCk7XG4gICAgICAgICAgICAgICAgaWYgKHByb2plY3RQYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUGF0aChwcm9qZWN0UGF0aCArIHN0ZFBhdGguc2VwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFBhdGgoJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbXBhcmUgdHdvIHBhdGhzIGxleGljb2dyYXBoaWNhbGx5LlxuICAgICAqL1xuICAgIHN0YXRpYyBjb21wYXJlKHBhdGgxLCBwYXRoMikge1xuICAgICAgICByZXR1cm4gcGF0aDEuZnVsbC5sb2NhbGVDb21wYXJlKHBhdGgyLmZ1bGwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIG5ldyBwYXRoIGluc3RhbmNlIHdpdGggdGhlIGNvbW1vbiBwcmVmaXggb2YgYWxsIHRoZVxuICAgICAqIGdpdmVuIHBhdGhzLlxuICAgICAqL1xuICAgIHN0YXRpYyBjb21tb25QcmVmaXgocGF0aHMsIGNhc2VTZW5zaXRpdmU9ZmFsc2UpIHtcbiAgICAgICAgaWYgKHBhdGhzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnQ2Fubm90IGZpbmQgY29tbW9uIHByZWZpeCBmb3IgbGlzdHMgc2hvcnRlciB0aGFuIHR3byBlbGVtZW50cy4nXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF0aHMgPSBwYXRocy5tYXAoKHBhdGgpID0+IHBhdGguZnVsbCkuc29ydCgpO1xuICAgICAgICBsZXQgZmlyc3QgPSBwYXRoc1swXTtcbiAgICAgICAgbGV0IGxhc3QgPSBwYXRoc1twYXRocy5sZW5ndGggLSAxXTtcblxuICAgICAgICBsZXQgcHJlZml4ID0gJyc7XG4gICAgICAgIGxldCBwcmVmaXhNYXhMZW5ndGggPSBNYXRoLm1heChmaXJzdC5sZW5ndGgsIGxhc3QubGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBwcmVmaXhNYXhMZW5ndGggLSAxOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFtrXSA9PT0gbGFzdFtrXSkge1xuICAgICAgICAgICAgICAgIHByZWZpeCArPSBmaXJzdFtrXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWNhc2VTZW5zaXRpdmUgJiYgZmlyc3Rba10udG9Mb3dlckNhc2UoKSA9PT0gbGFzdFtrXS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgcHJlZml4ICs9IGZpcnN0W2tdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQYXRoKHByZWZpeCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFJldHVybiB3aGV0aGVyIHRoZSBmaWxlbmFtZSBtYXRjaGVzIHRoZSBnaXZlbiBwYXRoIGZyYWdtZW50LlxuICovXG5mdW5jdGlvbiBtYXRjaEZyYWdtZW50KGZyYWdtZW50LCBmaWxlbmFtZSwgY2FzZVNlbnNpdGl2ZT1mYWxzZSkge1xuICAgIGlmICghY2FzZVNlbnNpdGl2ZSkge1xuICAgICAgICBmcmFnbWVudCA9IGZyYWdtZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsZW5hbWUuc3RhcnRzV2l0aChmcmFnbWVudCk7XG59XG4iXX0=
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/lib/models.js
