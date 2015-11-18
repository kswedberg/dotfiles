Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.cachedProperty = cachedProperty;
exports.getProjectPath = getProjectPath;
exports.preferredSeparatorFor = preferredSeparatorFor;
exports.defineImmutable = defineImmutable;
exports.absolutify = absolutify;
exports.dom = dom;
exports.closest = closest;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

/**
 * Generates the return value for the wrapper property on first access
 * and caches it on the object. All future calls return the cached value
 * instead of re-calculating it.
 */

function cachedProperty(target, key, descriptor) {
    var getter = descriptor.get;
    var cached_key = Symbol(key + '_cached');

    descriptor.get = function () {
        if (this[cached_key] === undefined) {
            Object.defineProperty(this, cached_key, {
                value: getter.call(this),
                writable: false,
                enumerable: false
            });
        }
        return this[cached_key];
    };

    return descriptor;
}

/**
 * Get the path to the current project directory. For now this just uses
 * the first directory in the list. Return null if there are no project
 * directories.
 *
 * TODO: Support more than just the first.
 */

function getProjectPath() {
    var projectPaths = atom.project.getPaths();
    if (projectPaths.length > 0) {
        return projectPaths[0];
    } else {
        return null;
    }
}

/**
 * Get the preferred path separator for the given string based on the
 * first path separator detected.
 */

function preferredSeparatorFor(path) {
    var forwardIndex = path.indexOf('/');
    var backIndex = path.indexOf('\\');

    if (backIndex === -1 && forwardIndex === -1) {
        return _path2['default'].sep;
    } else if (forwardIndex === -1) {
        return '\\';
    } else if (backIndex === -1) {
        return '/';
    } else if (forwardIndex < backIndex) {
        return '/';
    } else {
        return '\\';
    }
}

/**
 * Define an immutable property on an object.
 */

function defineImmutable(obj, name, value) {
    Object.defineProperty(obj, name, {
        value: value,
        writable: false,
        enumerable: true
    });
}

/**
 * Turn the given path into an absolute path if necessary. Paths are
 * considered relative to the project root.
 */

function absolutify(path) {
    var relativeBases = [];
    var projectPath = getProjectPath();
    if (projectPath) {
        relativeBases.push(projectPath);
    }

    return _path2['default'].resolve.apply(_path2['default'], relativeBases.concat([path]));
}

/**
 * Parse the given string as HTML and return DOM nodes. Assumes a root
 * DOM node because, well, that's all I use it for.
 */

function dom(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
}

/**
 * Starts at the current DOM element and moves upward in the DOM tree
 * until an element matching the given selector is found.
 *
 * Intended to be bound to DOM elements like so:
 * domNode::closest('selector');
 */

function closest(selector) {
    if (this.matches && this.matches(selector)) {
        return this;
    } else if (this.parentNode) {
        var _context;

        return (_context = this.parentNode, closest).call(_context, selector);
    } else {
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7b0JBRW9CLE1BQU07Ozs7Ozs7Ozs7QUFRbkIsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUU7QUFDcEQsUUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQztBQUM1QixRQUFJLFVBQVUsR0FBRyxNQUFNLENBQUksR0FBRyxhQUFVLENBQUM7O0FBRXpDLGNBQVUsQ0FBQyxHQUFHLEdBQUcsWUFBVztBQUN4QixZQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxTQUFTLEVBQUU7QUFDaEMsa0JBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtBQUNwQyxxQkFBSyxFQUFFLEFBQU0sTUFBTSxNQUFaLElBQUksQ0FBVTtBQUNyQix3QkFBUSxFQUFFLEtBQUs7QUFDZiwwQkFBVSxFQUFFLEtBQUs7YUFDcEIsQ0FBQyxDQUFDO1NBQ047QUFDRCxlQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUMzQixDQUFDOztBQUVGLFdBQU8sVUFBVSxDQUFDO0NBQ3JCOzs7Ozs7Ozs7O0FBVU0sU0FBUyxjQUFjLEdBQUc7QUFDN0IsUUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMzQyxRQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3pCLGVBQU8sWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzFCLE1BQU07QUFDSCxlQUFPLElBQUksQ0FBQztLQUNmO0NBQ0o7Ozs7Ozs7QUFPTSxTQUFTLHFCQUFxQixDQUFDLElBQUksRUFBRTtBQUN4QyxRQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLFFBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRW5DLFFBQUksU0FBUyxLQUFLLENBQUMsQ0FBQyxJQUFJLFlBQVksS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN6QyxlQUFPLGtCQUFRLEdBQUcsQ0FBQztLQUN0QixNQUFNLElBQUksWUFBWSxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQzVCLGVBQU8sSUFBSSxDQUFDO0tBQ2YsTUFBTSxJQUFJLFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN6QixlQUFPLEdBQUcsQ0FBQztLQUNkLE1BQU0sSUFBSSxZQUFZLEdBQUcsU0FBUyxFQUFFO0FBQ2pDLGVBQU8sR0FBRyxDQUFDO0tBQ2QsTUFBTTtBQUNILGVBQU8sSUFBSSxDQUFDO0tBQ2Y7Q0FDSjs7Ozs7O0FBTU0sU0FBUyxlQUFlLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDOUMsVUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQzdCLGFBQUssRUFBRSxLQUFLO0FBQ1osZ0JBQVEsRUFBRSxLQUFLO0FBQ2Ysa0JBQVUsRUFBRSxJQUFJO0tBQ25CLENBQUMsQ0FBQztDQUNOOzs7Ozs7O0FBT00sU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFO0FBQzdCLFFBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFJLFdBQVcsR0FBRyxjQUFjLEVBQUUsQ0FBQztBQUNuQyxRQUFJLFdBQVcsRUFBRTtBQUNiLHFCQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ25DOztBQUVELFdBQU8sa0JBQVEsT0FBTyxNQUFBLG9CQUFJLGFBQWEsU0FBRSxJQUFJLEdBQUMsQ0FBQztDQUNsRDs7Ozs7OztBQU9NLFNBQVMsR0FBRyxDQUFDLElBQUksRUFBRTtBQUN0QixRQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLE9BQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLFdBQU8sR0FBRyxDQUFDLGlCQUFpQixDQUFDO0NBQ2hDOzs7Ozs7Ozs7O0FBVU0sU0FBUyxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQzlCLFFBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3hDLGVBQU8sSUFBSSxDQUFDO0tBQ2YsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7OztBQUN4QixlQUFPLFlBQUEsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLGlCQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzdDLE1BQU07QUFDSCxlQUFPLElBQUksQ0FBQztLQUNmO0NBQ0oiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1vcGVuLWZpbGUvbGliL3V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgc3RkUGF0aCBmcm9tICdwYXRoJztcblxuXG4vKipcbiAqIEdlbmVyYXRlcyB0aGUgcmV0dXJuIHZhbHVlIGZvciB0aGUgd3JhcHBlciBwcm9wZXJ0eSBvbiBmaXJzdCBhY2Nlc3NcbiAqIGFuZCBjYWNoZXMgaXQgb24gdGhlIG9iamVjdC4gQWxsIGZ1dHVyZSBjYWxscyByZXR1cm4gdGhlIGNhY2hlZCB2YWx1ZVxuICogaW5zdGVhZCBvZiByZS1jYWxjdWxhdGluZyBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhY2hlZFByb3BlcnR5KHRhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgbGV0IGdldHRlciA9IGRlc2NyaXB0b3IuZ2V0O1xuICAgIGxldCBjYWNoZWRfa2V5ID0gU3ltYm9sKGAke2tleX1fY2FjaGVkYCk7XG5cbiAgICBkZXNjcmlwdG9yLmdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpc1tjYWNoZWRfa2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgY2FjaGVkX2tleSwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzOjpnZXR0ZXIoKSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpc1tjYWNoZWRfa2V5XTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlc2NyaXB0b3I7XG59XG5cblxuLyoqXG4gKiBHZXQgdGhlIHBhdGggdG8gdGhlIGN1cnJlbnQgcHJvamVjdCBkaXJlY3RvcnkuIEZvciBub3cgdGhpcyBqdXN0IHVzZXNcbiAqIHRoZSBmaXJzdCBkaXJlY3RvcnkgaW4gdGhlIGxpc3QuIFJldHVybiBudWxsIGlmIHRoZXJlIGFyZSBubyBwcm9qZWN0XG4gKiBkaXJlY3Rvcmllcy5cbiAqXG4gKiBUT0RPOiBTdXBwb3J0IG1vcmUgdGhhbiBqdXN0IHRoZSBmaXJzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2plY3RQYXRoKCkge1xuICAgIGxldCBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICBpZiAocHJvamVjdFBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHByb2plY3RQYXRoc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cblxuLyoqXG4gKiBHZXQgdGhlIHByZWZlcnJlZCBwYXRoIHNlcGFyYXRvciBmb3IgdGhlIGdpdmVuIHN0cmluZyBiYXNlZCBvbiB0aGVcbiAqIGZpcnN0IHBhdGggc2VwYXJhdG9yIGRldGVjdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJlZmVycmVkU2VwYXJhdG9yRm9yKHBhdGgpIHtcbiAgICBsZXQgZm9yd2FyZEluZGV4ID0gcGF0aC5pbmRleE9mKCcvJyk7XG4gICAgbGV0IGJhY2tJbmRleCA9IHBhdGguaW5kZXhPZignXFxcXCcpO1xuXG4gICAgaWYgKGJhY2tJbmRleCA9PT0gLTEgJiYgZm9yd2FyZEluZGV4ID09PSAtMSkge1xuICAgICAgICByZXR1cm4gc3RkUGF0aC5zZXA7XG4gICAgfSBlbHNlIGlmIChmb3J3YXJkSW5kZXggPT09IC0xKSB7XG4gICAgICAgIHJldHVybiAnXFxcXCc7XG4gICAgfSBlbHNlIGlmIChiYWNrSW5kZXggPT09IC0xKSB7XG4gICAgICAgIHJldHVybiAnLyc7XG4gICAgfSBlbHNlIGlmIChmb3J3YXJkSW5kZXggPCBiYWNrSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuICcvJztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ1xcXFwnO1xuICAgIH1cbn1cblxuXG4vKipcbiAqIERlZmluZSBhbiBpbW11dGFibGUgcHJvcGVydHkgb24gYW4gb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lSW1tdXRhYmxlKG9iaiwgbmFtZSwgdmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIH0pO1xufVxuXG5cbi8qKlxuICogVHVybiB0aGUgZ2l2ZW4gcGF0aCBpbnRvIGFuIGFic29sdXRlIHBhdGggaWYgbmVjZXNzYXJ5LiBQYXRocyBhcmVcbiAqIGNvbnNpZGVyZWQgcmVsYXRpdmUgdG8gdGhlIHByb2plY3Qgcm9vdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFic29sdXRpZnkocGF0aCkge1xuICAgIGxldCByZWxhdGl2ZUJhc2VzID0gW107XG4gICAgbGV0IHByb2plY3RQYXRoID0gZ2V0UHJvamVjdFBhdGgoKTtcbiAgICBpZiAocHJvamVjdFBhdGgpIHtcbiAgICAgICAgcmVsYXRpdmVCYXNlcy5wdXNoKHByb2plY3RQYXRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RkUGF0aC5yZXNvbHZlKC4uLnJlbGF0aXZlQmFzZXMsIHBhdGgpO1xufVxuXG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIHN0cmluZyBhcyBIVE1MIGFuZCByZXR1cm4gRE9NIG5vZGVzLiBBc3N1bWVzIGEgcm9vdFxuICogRE9NIG5vZGUgYmVjYXVzZSwgd2VsbCwgdGhhdCdzIGFsbCBJIHVzZSBpdCBmb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkb20oaHRtbCkge1xuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gZGl2LmZpcnN0RWxlbWVudENoaWxkO1xufVxuXG5cbi8qKlxuICogU3RhcnRzIGF0IHRoZSBjdXJyZW50IERPTSBlbGVtZW50IGFuZCBtb3ZlcyB1cHdhcmQgaW4gdGhlIERPTSB0cmVlXG4gKiB1bnRpbCBhbiBlbGVtZW50IG1hdGNoaW5nIHRoZSBnaXZlbiBzZWxlY3RvciBpcyBmb3VuZC5cbiAqXG4gKiBJbnRlbmRlZCB0byBiZSBib3VuZCB0byBET00gZWxlbWVudHMgbGlrZSBzbzpcbiAqIGRvbU5vZGU6OmNsb3Nlc3QoJ3NlbGVjdG9yJyk7XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZXN0KHNlbGVjdG9yKSB7XG4gICAgaWYgKHRoaXMubWF0Y2hlcyAmJiB0aGlzLm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnROb2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudE5vZGU6OmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/lib/utils.js
