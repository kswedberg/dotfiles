Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
exports.onDidOpenPath = onDidOpenPath;
exports.onDidCreatePath = onDidCreatePath;
/** @babel */

require('babel-polyfill');

var _controller = require('./controller');

// Instance of the controller, constructed on activation.
var controller = null;

var _config = require('./config');

Object.defineProperty(exports, 'config', {
    enumerable: true,
    get: function get() {
        return _config.config;
    }
});

function activate(state) {
    controller = new _controller.AdvancedOpenFileController();
}

function deactivate() {
    controller.detach();
}

function onDidOpenPath(callback) {
    return _controller.emitter.on('did-open-path', callback);
}

function onDidCreatePath(callback) {
    return _controller.emitter.on('did-create-path', callback);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9hZHZhbmNlZC1vcGVuLWZpbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O1FBQ08sZ0JBQWdCOzswQkFFMkIsY0FBYzs7O0FBSWhFLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQTs7c0JBRUEsVUFBVTs7Ozs7dUJBQXZCLE1BQU07Ozs7QUFFUCxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUU7QUFDNUIsY0FBVSxHQUFHLDRDQUFnQyxDQUFDO0NBQ2pEOztBQUVNLFNBQVMsVUFBVSxHQUFHO0FBQ3pCLGNBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztDQUN2Qjs7QUFFTSxTQUFTLGFBQWEsQ0FBQyxRQUFRLEVBQUU7QUFDcEMsV0FBTyxvQkFBUSxFQUFFLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQ2hEOztBQUVNLFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBRTtBQUN0QyxXQUFPLG9CQUFRLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztDQUNsRCIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2FkdmFuY2VkLW9wZW4tZmlsZS9saWIvYWR2YW5jZWQtb3Blbi1maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCc7XG5cbmltcG9ydCB7QWR2YW5jZWRPcGVuRmlsZUNvbnRyb2xsZXIsIGVtaXR0ZXJ9IGZyb20gJy4vY29udHJvbGxlcic7XG5cblxuLy8gSW5zdGFuY2Ugb2YgdGhlIGNvbnRyb2xsZXIsIGNvbnN0cnVjdGVkIG9uIGFjdGl2YXRpb24uXG5sZXQgY29udHJvbGxlciA9IG51bGxcblxuZXhwb3J0IHtjb25maWd9IGZyb20gJy4vY29uZmlnJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgY29udHJvbGxlciA9IG5ldyBBZHZhbmNlZE9wZW5GaWxlQ29udHJvbGxlcigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgICBjb250cm9sbGVyLmRldGFjaCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25EaWRPcGVuUGF0aChjYWxsYmFjaykge1xuICAgIHJldHVybiBlbWl0dGVyLm9uKCdkaWQtb3Blbi1wYXRoJywgY2FsbGJhY2spO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25EaWRDcmVhdGVQYXRoKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGVtaXR0ZXIub24oJ2RpZC1jcmVhdGUtcGF0aCcsIGNhbGxiYWNrKTtcbn1cbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/lib/advanced-open-file.js
