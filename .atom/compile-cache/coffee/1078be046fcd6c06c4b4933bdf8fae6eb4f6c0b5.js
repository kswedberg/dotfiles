(function() {
  var Beautifier, Promise, fs, readFile, spawn, temp, which, _;

  Promise = require("bluebird");

  _ = require('lodash');

  fs = require("fs");

  temp = require("temp").track();

  spawn = require('cross-spawn');

  readFile = Promise.promisify(fs.readFile);

  which = require('which');

  module.exports = Beautifier = (function() {

    /*
    Promise
     */
    Beautifier.prototype.Promise = Promise;


    /*
    Name of Beautifier
     */

    Beautifier.prototype.name = 'Beautifier';


    /*
    Supported Options
    
    Enable options for supported languages.
    - <string:language>:<boolean:all_options_enabled>
    - <string:language>:<string:option_key>:<boolean:enabled>
    - <string:language>:<string:option_key>:<string:rename>
    - <string:language>:<string:option_key>:<function:transform>
    - <string:language>:<string:option_key>:<array:mapper>
     */

    Beautifier.prototype.options = {};


    /*
    Supported languages by this Beautifier
    
    Extracted from the keys of the `options` field.
     */

    Beautifier.prototype.languages = null;


    /*
    Beautify text
    
    Override this method in subclasses
     */

    Beautifier.prototype.beautify = null;


    /*
    Show deprecation warning to user.
     */

    Beautifier.prototype.deprecate = function(warning) {
      var _ref;
      return (_ref = atom.notifications) != null ? _ref.addWarning(warning) : void 0;
    };


    /*
    Create temporary file
     */

    Beautifier.prototype.tempFile = function(name, contents) {
      if (name == null) {
        name = "atom-beautify-temp";
      }
      if (contents == null) {
        contents = "";
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return temp.open(name, function(err, info) {
            _this.debug('tempFile', name, err, info);
            if (err) {
              return reject(err);
            }
            return fs.write(info.fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(info.fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(info.path);
              });
            });
          });
        };
      })(this));
    };


    /*
    Read file
     */

    Beautifier.prototype.readFile = function(filePath) {
      return Promise.resolve(filePath).then(function(filePath) {
        return readFile(filePath, "utf8");
      });
    };


    /*
    If platform is Windows
     */

    Beautifier.prototype.isWindows = (function() {
      return new RegExp('^win').test(process.platform);
    })();


    /*
    Get Shell Environment variables
    
    Special thank you to @ioquatix
    See https://github.com/ioquatix/script-runner/blob/v1.5.0/lib/script-runner.coffee#L45-L63
     */

    Beautifier.prototype._envCache = null;

    Beautifier.prototype._envCacheDate = null;

    Beautifier.prototype._envCacheExpiry = 10000;

    Beautifier.prototype.getShellEnvironment = function() {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var buffer, child;
          if ((_this._envCache != null) && (_this._envCacheDate != null)) {
            if ((new Date() - _this._envCacheDate) < _this._envCacheExpiry) {
              return resolve(_this._envCache);
            }
          }
          if (_this.isWindows) {
            return resolve(process.env);
          } else {
            child = spawn(process.env.SHELL, ['-ilc', 'env'], {
              detached: true,
              stdio: ['ignore', 'pipe', process.stderr]
            });
            buffer = '';
            child.stdout.on('data', function(data) {
              return buffer += data;
            });
            return child.on('close', function(code, signal) {
              var definition, environment, key, value, _i, _len, _ref, _ref1;
              if (code !== 0) {
                return reject(new Error("Could not get Shell Environment. Exit code: " + code + ", Signal: " + signal));
              }
              environment = {};
              _ref = buffer.split('\n');
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                definition = _ref[_i];
                _ref1 = definition.split('=', 2), key = _ref1[0], value = _ref1[1];
                if (key !== '') {
                  environment[key] = value;
                }
              }
              _this._envCache = environment;
              _this._envCacheDate = new Date();
              return resolve(environment);
            });
          }
        };
      })(this));
    };


    /*
    Like the unix which utility.
    
    Finds the first instance of a specified executable in the PATH environment variable.
    Does not cache the results,
    so hash -r is not needed when the PATH changes.
    See https://github.com/isaacs/node-which
     */

    Beautifier.prototype.which = function(exe, options) {
      if (options == null) {
        options = {};
      }
      return this.getShellEnvironment().then((function(_this) {
        return function(env) {
          return new Promise(function(resolve, reject) {
            var _ref;
            if (options.path == null) {
              options.path = env.PATH;
            }
            if (_this.isWindows) {
              if (options.pathExt == null) {
                options.pathExt = "" + ((_ref = process.env.PATHEXT) != null ? _ref : '.EXE') + ";";
              }
            }
            return which(exe, options, function(err, path) {
              if (err) {
                resolve(exe);
              }
              return resolve(path);
            });
          });
        };
      })(this));
    };


    /*
    Add help to error.description
    
    Note: error.description is not officially used in JavaScript,
    however it is used internally for Atom Beautify when displaying errors.
     */

    Beautifier.prototype.commandNotFoundError = function(exe, help) {
      var docsLink, er, helpStr, issueSearchLink, message;
      message = "Could not find '" + exe + "'. The program may not be installed.";
      er = new Error(message);
      er.code = 'CommandNotFound';
      er.errno = er.code;
      er.syscall = 'beautifier::run';
      er.file = exe;
      if (help != null) {
        if (typeof help === "object") {
          helpStr = "See " + help.link + " for program installation instructions.\n";
          if (help.pathOption) {
            helpStr += "You can configure Atom Beautify with the absolute path to '" + (help.program || exe) + "' by setting '" + help.pathOption + "' in the Atom Beautify package settings.\n";
          }
          if (help.additional) {
            helpStr += help.additional;
          }
          issueSearchLink = "https://github.com/Glavin001/atom-beautify/search?q=" + exe + "&type=Issues";
          docsLink = "https://github.com/Glavin001/atom-beautify/tree/master/docs";
          helpStr += "Your program is properly installed if running '" + (this.isWindows ? 'where.exe' : 'which') + " " + exe + "' in your " + (this.isWindows ? 'CMD prompt' : 'Terminal') + " returns an absolute path to the executable. If this does not work then you have not installed the program correctly and so Atom Beautify will not find the program. Atom Beautify requires that the program be found in your PATH environment variable. \nNote that this is not an Atom Beautify issue if beautification does not work and the above command also does not work: this is expected behaviour, since you have not properly installed your program. Please properly setup the program and search through existing Atom Beautify issues before creating a new issue. See " + issueSearchLink + " for related Issues and " + docsLink + " for documentation. If you are still unable to resolve this issue on your own then please create a new issue and ask for help.\n";
          er.description = helpStr;
        } else {
          er.description = help;
        }
      }
      return er;
    };


    /*
    Run command-line interface command
     */

    Beautifier.prototype.run = function(executable, args, _arg) {
      var help, ignoreReturnCode, _ref;
      _ref = _arg != null ? _arg : {}, ignoreReturnCode = _ref.ignoreReturnCode, help = _ref.help;
      args = _.flatten(args);
      return Promise.all([executable, Promise.all(args)]).then((function(_this) {
        return function(_arg1) {
          var args, exeName;
          exeName = _arg1[0], args = _arg1[1];
          _this.debug('exeName, args:', exeName, args);
          return new Promise(function(resolve, reject) {
            args = _.without(args, void 0);
            args = _.without(args, null);
            return Promise.all([_this.getShellEnvironment(), _this.which(exeName)]).then(function(_arg2) {
              var cmd, env, exe, exePath, options;
              env = _arg2[0], exePath = _arg2[1];
              _this.debug('exePath, env:', exePath, env);
              exe = exePath != null ? exePath : exeName;
              options = {
                env: env
              };
              return cmd = _this.spawn(exe, args, options).then(function(_arg3) {
                var err, returnCode, stderr, stdout, windowsProgramNotFoundMsg;
                returnCode = _arg3.returnCode, stdout = _arg3.stdout, stderr = _arg3.stderr;
                _this.verbose('spawn result', returnCode, stdout, stderr);
                if (!ignoreReturnCode && returnCode !== 0) {
                  err = new Error(stderr);
                  windowsProgramNotFoundMsg = 'is not recognized as an internal or external command';
                  _this.verbose(stderr, windowsProgramNotFoundMsg);
                  if (_this.isWindows && returnCode === 1 && stderr.indexOf(windowsProgramNotFoundMsg) !== -1) {
                    err = _this.commandNotFoundError(exeName, help);
                  }
                  return reject(err);
                } else {
                  return resolve(stdout);
                }
              })["catch"](function(err) {
                _this.debug('error', err);
                if (err.code === 'ENOENT' || err.errno === 'ENOENT') {
                  return reject(_this.commandNotFoundError(exeName, help));
                } else {
                  return reject(err);
                }
              });
            });
          });
        };
      })(this));
    };


    /*
    Spawn
     */

    Beautifier.prototype.spawn = function(exe, args, options) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var cmd, stderr, stdout;
          _this.debug('spawn', exe, args);
          cmd = spawn(exe, args, options);
          stdout = "";
          stderr = "";
          cmd.stdout.on('data', function(data) {
            return stdout += data;
          });
          cmd.stderr.on('data', function(data) {
            return stderr += data;
          });
          cmd.on('exit', function(returnCode) {
            _this.debug('spawn done', returnCode, stderr, stdout);
            return resolve({
              returnCode: returnCode,
              stdout: stdout,
              stderr: stderr
            });
          });
          return cmd.on('error', function(err) {
            _this.debug('error', err);
            return reject(err);
          });
        };
      })(this));
    };


    /*
    Logger instance
     */

    Beautifier.prototype.logger = null;


    /*
    Initialize and configure Logger
     */

    Beautifier.prototype.setupLogger = function() {
      var key, method, _ref;
      this.logger = require('../logger')(__filename);
      _ref = this.logger;
      for (key in _ref) {
        method = _ref[key];
        this[key] = method;
      }
      return this.verbose("Beautifier logger has been initialized.");
    };


    /*
    Constructor to setup beautifer
     */

    function Beautifier() {
      var globalOptions, lang, options, _ref;
      this.setupLogger();
      if (this.options._ != null) {
        globalOptions = this.options._;
        delete this.options._;
        if (typeof globalOptions === "object") {
          _ref = this.options;
          for (lang in _ref) {
            options = _ref[lang];
            if (typeof options === "boolean") {
              if (options === true) {
                this.options[lang] = globalOptions;
              }
            } else if (typeof options === "object") {
              this.options[lang] = _.merge(globalOptions, options);
            } else {
              this.warn(("Unsupported options type " + (typeof options) + " for language " + lang + ": ") + options);
            }
          }
        }
      }
      this.verbose("Options for " + this.name + ":", this.options);
      this.languages = _.keys(this.options);
    }

    return Beautifier;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9iZWF1dGlmaWVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3REFBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUixDQUFWLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUhQLENBQUE7O0FBQUEsRUFJQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGFBQVIsQ0FKUixDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFXLE9BQU8sQ0FBQyxTQUFSLENBQWtCLEVBQUUsQ0FBQyxRQUFyQixDQUxYLENBQUE7O0FBQUEsRUFNQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FOUixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFFckI7QUFBQTs7T0FBQTtBQUFBLHlCQUdBLE9BQUEsR0FBUyxPQUhULENBQUE7O0FBS0E7QUFBQTs7T0FMQTs7QUFBQSx5QkFRQSxJQUFBLEdBQU0sWUFSTixDQUFBOztBQVVBO0FBQUE7Ozs7Ozs7OztPQVZBOztBQUFBLHlCQXFCQSxPQUFBLEdBQVMsRUFyQlQsQ0FBQTs7QUF1QkE7QUFBQTs7OztPQXZCQTs7QUFBQSx5QkE0QkEsU0FBQSxHQUFXLElBNUJYLENBQUE7O0FBOEJBO0FBQUE7Ozs7T0E5QkE7O0FBQUEseUJBbUNBLFFBQUEsR0FBVSxJQW5DVixDQUFBOztBQXFDQTtBQUFBOztPQXJDQTs7QUFBQSx5QkF3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

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/beautifier.coffee
