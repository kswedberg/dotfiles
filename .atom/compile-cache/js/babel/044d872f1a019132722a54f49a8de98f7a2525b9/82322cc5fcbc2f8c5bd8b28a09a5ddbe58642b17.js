'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var path = require('path');
var spawn = require('child_process').spawn;
var _ = require('lodash');

var BufferedNodeProcessExecutorPool = (function () {
  function BufferedNodeProcessExecutorPool() {
    _classCallCheck(this, BufferedNodeProcessExecutorPool);

    this.executors = [];
    this.waiting = [];
  }

  _createClass(BufferedNodeProcessExecutorPool, [{
    key: 'execute',
    value: function execute(command, args) {
      var _this = this;

      if (this.isAvailableExector()) {
        var executor = this.executeInternal(command, args);
        this.executors.push(executor);
        return executor;
      } else {
        return new Promise(function (resolve, reject) {
          _this.waiting.push({
            command: command,
            args: args,
            resolve: resolve,
            reject: reject
          });
        });
      }
    }
  }, {
    key: 'releaseExecutor',
    value: function releaseExecutor(proc) {
      this.executors = _.without(this.executors, proc);

      var nextExecutor = this.waiting.pop();
      if (nextExecutor) {
        this.executors.push(this.executeInternal(nextExecutor.command, nextExecutor.args, nextExecutor.resolve, nextExecutor.reject));
      }
    }
  }, {
    key: 'executeInternal',
    value: function executeInternal(command, args, resolve, reject) {
      var _this2 = this;

      var executor = this.executeBufferedNodeProcess(command, args).then(function (response) {
        _this2.releaseExecutor(executor);

        if (resolve) {
          resolve(response);
        }

        return response;
      })['catch'](function (reason) {
        _this2.releaseExecutor(executor);

        if (reject) {
          reject(reason);
        } else {
          throw reason;
        }
      });

      return executor;
    }
  }, {
    key: 'executeBufferedNodeProcess',
    value: function executeBufferedNodeProcess(command, args) {
      return new Promise(function (resolve, reject) {
        var data = '';
        var errorData = '';

        // BufferedNodeProcess is bugged on windows, this is just a temporal workaround
        // @see https://github.com/atom/atom/issues/2887
        var child = spawn(process.execPath, [command].concat(args), {
          cwd: path.dirname(command),
          env: {
            ATOM_SHELL_INTERNAL_RUN_AS_NODE: 1
          },
          stdio: ['ipc']
        });
        child.stdout.on('data', function (chunk) {
          data += chunk;
        });
        child.stderr.on('data', function (chunk) {
          errorData += chunk;
        });
        child.on('exit', function (exitCode) {
          if (exitCode === 0) {
            resolve({
              data: data,
              args: args
            });
          } else {
            reject({
              data: errorData,
              args: args
            });
          }
        });
      });
    }
  }, {
    key: 'isAvailableExector',
    value: function isAvailableExector() {
      return this.executors.length < this.getMaximumConcurrentExecutions();
    }
  }, {
    key: 'getMaximumConcurrentExecutions',
    value: function getMaximumConcurrentExecutions() {
      return 8;
    }
  }]);

  return BufferedNodeProcessExecutorPool;
})();

exports['default'] = BufferedNodeProcessExecutorPool;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvanMtYXV0b2ltcG9ydC9saWIvdXRpbHMvQnVmZmVyZWROb2RlUHJvY2Vzc0V4ZWN1dG9yUG9vbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFFWixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM3QyxJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0lBRVAsK0JBQStCO0FBRXZDLFdBRlEsK0JBQStCLEdBRXBDOzBCQUZLLCtCQUErQjs7QUFHaEQsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7R0FDbkI7O2VBTGtCLCtCQUErQjs7V0FPM0MsaUJBQUMsT0FBTyxFQUFFLElBQUksRUFBRTs7O0FBQ3JCLFVBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFLEVBQUU7QUFDN0IsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckQsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUIsZUFBTyxRQUFRLENBQUM7T0FDakIsTUFBTTtBQUNMLGVBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLGdCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDaEIsbUJBQU8sRUFBRSxPQUFPO0FBQ2hCLGdCQUFJLEVBQUUsSUFBSTtBQUNWLG1CQUFPLEVBQUUsT0FBTztBQUNoQixrQkFBTSxFQUFFLE1BQU07V0FDZixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSjtLQUNGOzs7V0FFYyx5QkFBQyxJ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QUErQjs7O3FCQUEvQiwrQkFBK0IiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9qcy1hdXRvaW1wb3J0L2xpYi91dGlscy9CdWZmZXJlZE5vZGVQcm9jZXNzRXhlY3V0b3JQb29sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBzcGF3biA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3bjtcbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVmZmVyZWROb2RlUHJvY2Vzc0V4ZWN1dG9yUG9vbCB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5leGVjdXRvcnMgPSBbXTtcbiAgICB0aGlzLndhaXRpbmcgPSBbXTtcbiAgfVxuXG4gIGV4ZWN1dGUoY29tbWFuZCwgYXJncykge1xuICAgIGlmICh0aGlzLmlzQXZhaWxhYmxlRXhlY3RvcigpKSB7XG4gICAgICBjb25zdCBleGVjdXRvciA9IHRoaXMuZXhlY3V0ZUludGVybmFsKGNvbW1hbmQsIGFyZ3MpO1xuICAgICAgdGhpcy5leGVjdXRvcnMucHVzaChleGVjdXRvcik7XG4gICAgICByZXR1cm4gZXhlY3V0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMud2FpdGluZy5wdXNoKHtcbiAgICAgICAgICBjb21tYW5kOiBjb21tYW5kLFxuICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgICAgICByZWplY3Q6IHJlamVjdFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbGVhc2VFeGVjdXRvcihwcm9jKSB7XG4gICAgdGhpcy5leGVjdXRvcnMgPSBfLndpdGhvdXQodGhpcy5leGVjdXRvcnMsIHByb2MpO1xuXG4gICAgY29uc3QgbmV4dEV4ZWN1dG9yID0gdGhpcy53YWl0aW5nLnBvcCgpO1xuICAgIGlmIChuZXh0RXhlY3V0b3IpIHtcbiAgICAgIHRoaXMuZXhlY3V0b3JzLnB1c2goXG4gICAgICAgIHRoaXMuZXhlY3V0ZUludGVybmFsKFxuICAgICAgICAgIG5leHRFeGVjdXRvci5jb21tYW5kLFxuICAgICAgICAgIG5leHRFeGVjdXRvci5hcmdzLFxuICAgICAgICAgIG5leHRFeGVjdXRvci5yZXNvbHZlLFxuICAgICAgICAgIG5leHRFeGVjdXRvci5yZWplY3RcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBleGVjdXRlSW50ZXJuYWwoY29tbWFuZCwgYXJncywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgY29uc3QgZXhlY3V0b3IgPSB0aGlzLmV4ZWN1dGVCdWZmZXJlZE5vZGVQcm9jZXNzKGNvbW1hbmQsIGFyZ3MpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgdGhpcy5yZWxlYXNlRXhlY3V0b3IoZXhlY3V0b3IpO1xuXG4gICAgICAgIGlmIChyZXNvbHZlKSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcbiAgICAgICAgdGhpcy5yZWxlYXNlRXhlY3V0b3IoZXhlY3V0b3IpO1xuXG4gICAgICAgIGlmIChyZWplY3QpIHtcbiAgICAgICAgICByZWplY3QocmVhc29uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyByZWFzb247XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIGV4ZWN1dG9yO1xuICB9XG5cbiAgZXhlY3V0ZUJ1ZmZlcmVkTm9kZVByb2Nlc3MoY29tbWFuZCwgYXJncykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgZGF0YSA9ICcnO1xuICAgICAgbGV0IGVycm9yRGF0YSA9ICcnO1xuXG4gICAgICAvLyBCdWZmZXJlZE5vZGVQcm9jZXNzIGlzIGJ1Z2dlZCBvbiB3aW5kb3dzLCB0aGlzIGlzIGp1c3QgYSB0ZW1wb3JhbCB3b3JrYXJvdW5kXG4gICAgICAvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vaXNzdWVzLzI4ODdcbiAgICAgIGNvbnN0IGNoaWxkID0gc3Bhd24ocHJvY2Vzcy5leGVjUGF0aCwgW2NvbW1hbmRdLmNvbmNhdChhcmdzKSwge1xuICAgICAgICBjd2Q6IHBhdGguZGlybmFtZShjb21tYW5kKSxcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgQVRPTV9TSEVMTF9JTlRFUk5BTF9SVU5fQVNfTk9ERTogMVxuICAgICAgICB9LFxuICAgICAgICBzdGRpbzogWydpcGMnXVxuICAgICAgfSk7XG4gICAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoY2h1bmspID0+IHtcbiAgICAgICAgZGF0YSArPSBjaHVuaztcbiAgICAgIH0pO1xuICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGNodW5rKSA9PiB7XG4gICAgICAgIGVycm9yRGF0YSArPSBjaHVuaztcbiAgICAgIH0pO1xuICAgICAgY2hpbGQub24oJ2V4aXQnLCAoZXhpdENvZGUpID0+IHtcbiAgICAgICAgaWYgKGV4aXRDb2RlID09PSAwKSB7XG4gICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgYXJnczogYXJnc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICBkYXRhOiBlcnJvckRhdGEsXG4gICAgICAgICAgICBhcmdzOiBhcmdzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaXNBdmFpbGFibGVFeGVjdG9yKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dG9ycy5sZW5ndGggPCB0aGlzLmdldE1heGltdW1Db25jdXJyZW50RXhlY3V0aW9ucygpO1xuICB9XG5cbiAgZ2V0TWF4aW11bUNvbmN1cnJlbnRFeGVjdXRpb25zKCkge1xuICAgIHJldHVybiA4O1xuICB9XG59XG4iXX0=
//# sourceURL=/Users/kswedberg/.atom/packages/js-autoimport/lib/utils/BufferedNodeProcessExecutorPool.js
