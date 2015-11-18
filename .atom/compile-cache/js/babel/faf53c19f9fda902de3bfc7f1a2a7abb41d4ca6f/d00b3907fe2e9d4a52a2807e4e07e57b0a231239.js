Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
exports.onDidOpenPath = onDidOpenPath;
exports.onDidCreatePath = onDidCreatePath;
/** @babel */

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9hZHZhbmNlZC1vcGVuLWZpbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzBCQUNrRCxjQUFjOzs7QUFJaEUsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFBOztzQkFFQSxVQUFVOzs7Ozt1QkFBdkIsTUFBTTs7OztBQUVQLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRTtBQUM1QixjQUFVLEdBQUcsNENBQWdDLENBQUM7Q0FDakQ7O0FBRU0sU0FBUyxVQUFVLEdBQUc7QUFDekIsY0FBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO0NBQ3ZCOztBQUVNLFNBQVMsYUFBYSxDQUFDLFFBQVEsRUFBRTtBQUNwQyxXQUFPLG9CQUFRLEVBQUUsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDaEQ7O0FBRU0sU0FBUyxlQUFlLENBQUMsUUFBUSxFQUFFO0FBQ3RDLFdBQU8sb0JBQVEsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQ2xEIiwiZmlsZSI6Ii9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvYWR2YW5jZWQtb3Blbi1maWxlL2xpYi9hZHZhbmNlZC1vcGVuLWZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5pbXBvcnQge0FkdmFuY2VkT3BlbkZpbGVDb250cm9sbGVyLCBlbWl0dGVyfSBmcm9tICcuL2NvbnRyb2xsZXInO1xuXG5cbi8vIEluc3RhbmNlIG9mIHRoZSBjb250cm9sbGVyLCBjb25zdHJ1Y3RlZCBvbiBhY3RpdmF0aW9uLlxubGV0IGNvbnRyb2xsZXIgPSBudWxsXG5cbmV4cG9ydCB7Y29uZmlnfSBmcm9tICcuL2NvbmZpZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZShzdGF0ZSkge1xuICAgIGNvbnRyb2xsZXIgPSBuZXcgQWR2YW5jZWRPcGVuRmlsZUNvbnRyb2xsZXIoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XG4gICAgY29udHJvbGxlci5kZXRhY2goKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uRGlkT3BlblBhdGgoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZW1pdHRlci5vbignZGlkLW9wZW4tcGF0aCcsIGNhbGxiYWNrKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uRGlkQ3JlYXRlUGF0aChjYWxsYmFjaykge1xuICAgIHJldHVybiBlbWl0dGVyLm9uKCdkaWQtY3JlYXRlLXBhdGgnLCBjYWxsYmFjayk7XG59XG4iXX0=
//# sourceURL=/Users/kswedberg/.atom/packages/advanced-open-file/lib/advanced-open-file.js
