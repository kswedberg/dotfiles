Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.installPackages = installPackages;

var _atom = require('atom');

'use babel';

function installPackages(packageNames, callback, failedCallback) {
  var extractionRegex = /Installing (.*?) to .*? (.*)/;
  return new Promise(function (resolve, reject) {

    var errorContents = [];
    var parameters = ['install'].concat(packageNames);
    parameters.push('--production', '--color', 'false');

    new _atom.BufferedProcess({
      command: atom.packages.getApmPath(),
      args: parameters,
      options: {},
      stdout: function stdout(contents) {
        var matches = extractionRegex.exec(contents);
        if (matches[2] === '✓' || matches[2] === 'done') {
          callback(matches[1]);
        } else {
          errorContents.push("Error Installing " + matches[1] + "\n");
        }
      },
      stderr: function stderr(contents) {
        errorContents.push(contents);
      },
      exit: function exit() {
        if (errorContents.length) {
          errorContents = errorContents.join('');
          failedCallback(errorContents);
          return reject(new Error(errorContents));
        } else resolve();
      }
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvbm9kZV9tb2R1bGVzL2F0b20tcGFja2FnZS1kZXBzL2xpYi9oZWxwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7b0JBRThCLE1BQU07O0FBRnBDLFdBQVcsQ0FBQTs7QUFJSixTQUFTLGVBQWUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRTtBQUN0RSxNQUFNLGVBQWUsR0FBRyw4QkFBOEIsQ0FBQTtBQUN0RCxTQUFPLElBQUksT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRTs7QUFFM0MsUUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFBO0FBQ3RCLFFBQU0sVUFBVSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ25ELGNBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTs7QUFFbkQsOEJBQW9CO0FBQ2xCLGFBQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRTtBQUNuQyxVQUFJLEVBQUUsVUFBVTtBQUNoQixhQUFPLEVBQUUsRUFBRTtBQUNYLFlBQU0sRUFBRSxnQkFBUyxRQUFRLEVBQUU7QUFDekIsWUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5QyxZQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sRUFBRTtBQUMvQyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3JCLE1BQU07QUFDTCx1QkFBYSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUE7U0FDNUQ7T0FDRjtBQUNELFlBQU0sRUFBRSxnQkFBUyxRQUFRLEVBQUU7QUFDekIscUJBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDN0I7QUFDRCxVQUFJLEVBQUUsZ0JBQVc7QUFDZixZQUFJLGFBQWEsQ0FBQyxNQUFNLEVBQUU7QUFDeEIsdUJBQWEsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3RDLHdCQUFjLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDN0IsaUJBQU8sTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7U0FDeEMsTUFBTSxPQUFPLEVBQUUsQ0FBQTtPQUNqQjtLQUNGLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNIIiwiZmlsZSI6Ii9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyLWpzY3Mvbm9kZV9tb2R1bGVzL2F0b20tcGFja2FnZS1kZXBzL2xpYi9oZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0J1ZmZlcmVkUHJvY2Vzc30gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbGxQYWNrYWdlcyhwYWNrYWdlTmFtZXMsIGNhbGxiYWNrLCBmYWlsZWRDYWxsYmFjaykge1xuICBjb25zdCBleHRyYWN0aW9uUmVnZXggPSAvSW5zdGFsbGluZyAoLio/KSB0byAuKj8gKC4qKS9cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgbGV0IGVycm9yQ29udGVudHMgPSBbXVxuICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBbJ2luc3RhbGwnXS5jb25jYXQocGFja2FnZU5hbWVzKVxuICAgIHBhcmFtZXRlcnMucHVzaCgnLS1wcm9kdWN0aW9uJywgJy0tY29sb3InLCAnZmFsc2UnKVxuXG4gICAgbmV3IEJ1ZmZlcmVkUHJvY2Vzcyh7XG4gICAgICBjb21tYW5kOiBhdG9tLnBhY2thZ2VzLmdldEFwbVBhdGgoKSxcbiAgICAgIGFyZ3M6IHBhcmFtZXRlcnMsXG4gICAgICBvcHRpb25zOiB7fSxcbiAgICAgIHN0ZG91dDogZnVuY3Rpb24oY29udGVudHMpIHtcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IGV4dHJhY3Rpb25SZWdleC5leGVjKGNvbnRlbnRzKVxuICAgICAgICBpZiAobWF0Y2hlc1syXSA9PT0gJ+KckycgfHwgbWF0Y2hlc1syXSA9PT0gJ2RvbmUnKSB7XG4gICAgICAgICAgY2FsbGJhY2sobWF0Y2hlc1sxXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlcnJvckNvbnRlbnRzLnB1c2goXCJFcnJvciBJbnN0YWxsaW5nIFwiICsgbWF0Y2hlc1sxXSArIFwiXFxuXCIpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdGRlcnI6IGZ1bmN0aW9uKGNvbnRlbnRzKSB7XG4gICAgICAgIGVycm9yQ29udGVudHMucHVzaChjb250ZW50cylcbiAgICAgIH0sXG4gICAgICBleGl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGVycm9yQ29udGVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgZXJyb3JDb250ZW50cyA9IGVycm9yQ29udGVudHMuam9pbignJylcbiAgICAgICAgICBmYWlsZWRDYWxsYmFjayhlcnJvckNvbnRlbnRzKVxuICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKGVycm9yQ29udGVudHMpKVxuICAgICAgICB9IGVsc2UgcmVzb2x2ZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbn1cbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/linter-jscs/node_modules/atom-package-deps/lib/helper.js
