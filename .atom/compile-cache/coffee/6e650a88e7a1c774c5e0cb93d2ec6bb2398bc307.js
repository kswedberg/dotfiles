(function() {
  var Task, Transpiler, fs, languagebabelSchema, path, pathIsInside;

  Task = require('atom').Task;

  fs = require('fs-plus');

  path = require('path');

  pathIsInside = require('../node_modules/path-is-inside');

  languagebabelSchema = {
    type: 'object',
    properties: {
      babelMapsPath: {
        type: 'string'
      },
      babelMapsAddUrl: {
        type: 'boolean'
      },
      babelSourcePath: {
        type: 'string'
      },
      babelTranspilePath: {
        type: 'string'
      },
      createMap: {
        type: 'boolean'
      },
      createTargetDirectories: {
        type: 'boolean'
      },
      createTranspiledCode: {
        type: 'boolean'
      },
      disableWhenNoBabelrcFileInPath: {
        type: 'boolean'
      },
      projectRoot: {
        type: 'boolean'
      },
      suppressSourcePathMessages: {
        type: 'boolean'
      },
      suppressTranspileOnSaveMessages: {
        type: 'boolean'
      },
      transpileOnSave: {
        type: 'boolean'
      }
    },
    additionalProperties: false
  };

  Transpiler = (function() {
    function Transpiler() {
      this.reqId = 0;
      this.babelTranspilerTasks = {};
      this.babelTransformerPath = require.resolve('./transpiler-task');
      this.transpileErrorNotifications = {};
      this.deprecateConfig();
    }

    Transpiler.prototype.transpile = function(sourceFile, textEditor) {
      var babelOptions, config, localConfig, msgObject, pathTo, reqId, _base, _name;
      config = this.getConfig();
      pathTo = this.getPaths(sourceFile, config);
      if (config.allowLocalOverride) {
        if (this.jsonSchema == null) {
          this.jsonSchema = (require('../node_modules/jjv'))();
          this.jsonSchema.addSchema('localConfig', languagebabelSchema);
        }
        localConfig = this.getLocalConfig(pathTo.sourceFileDir, pathTo.projectPath, {});
        this.merge(config, localConfig);
        pathTo = this.getPaths(sourceFile, config);
      }
      if (config.transpileOnSave !== true) {
        return;
      }
      if (config.disableWhenNoBabelrcFileInPath) {
        if (!this.isBabelrcInPath(pathTo.sourceFileDir)) {
          return;
        }
      }
      if (!pathIsInside(pathTo.sourceFile, pathTo.sourceRoot)) {
        if (!config.suppressSourcePathMessages) {
          atom.notifications.addWarning('LB: Babel file is not inside the "Babel Source Path" directory.', {
            dismissable: false,
            detail: "No transpiled code output for file \n" + pathTo.sourceFile + " \n\nTo suppress these 'invalid source path' messages use language-babel package settings"
          });
        }
        return;
      }
      babelOptions = this.getBabelOptions(config);
      this.cleanNotifications(pathTo);
      if ((_base = this.babelTranspilerTasks)[_name = pathTo.projectPath] == null) {
        _base[_name] = Task.once(this.babelTransformerPath, pathTo.projectPath, (function(_this) {
          return function() {
            return delete _this.babelTranspilerTasks[pathTo.projectPath];
          };
        })(this));
      }
      if (this.babelTranspilerTasks[pathTo.projectPath] != null) {
        reqId = this.reqId++;
        msgObject = {
          reqId: reqId,
          command: 'transpile',
          pathTo: pathTo,
          babelOptions: babelOptions
        };
        this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
        return this.babelTranspilerTasks[pathTo.projectPath].once("transpile:" + reqId, (function(_this) {
          return function(msgRet) {
            var mapJson, xssiProtection, _ref, _ref1;
            if ((_ref = msgRet.result) != null ? _ref.ignored : void 0) {
              return;
            }
            if (msgRet.err) {
              if (msgRet.err.stack) {
                return _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel Transpiler Error", {
                  dismissable: true,
                  detail: "" + msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.stack
                });
              } else {
                _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel v" + msgRet.babelVersion + " Transpiler Error", {
                  dismissable: true,
                  detail: "" + msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.codeFrame
                });
                if ((msgRet.err.loc != null) && (textEditor != null)) {
                  return textEditor.setCursorBufferPosition([msgRet.err.loc.line - 1, msgRet.err.loc.column - 1]);
                }
              }
            } else {
              if (!config.suppressTranspileOnSaveMessages) {
                atom.notifications.addInfo("LB: Babel v" + msgRet.babelVersion + " Transpiler Success", {
                  detail: "" + pathTo.sourceFile + "\n \n" + msgRet.babelCoreUsed
                });
              }
              if (!config.createTranspiledCode) {
                if (!config.suppressTranspileOnSaveMessages) {
                  atom.notifications.addInfo('LB: No transpiled output configured');
                }
                return;
              }
              if (pathTo.sourceFile === pathTo.transpiledFile) {
                atom.notifications.addWarning('LB: Transpiled file would overwrite source file. Aborted!', {
                  dismissable: true,
                  detail: pathTo.sourceFile
                });
                return;
              }
              if (config.createTargetDirectories) {
                fs.makeTreeSync(path.parse(pathTo.transpiledFile).dir);
              }
              if (config.babelMapsAddUrl) {
                msgRet.result.code = msgRet.result.code + '\n' + '//# sourceMappingURL=' + pathTo.mapFile;
              }
              fs.writeFileSync(pathTo.transpiledFile, msgRet.result.code);
              if (config.createMap && ((_ref1 = msgRet.result.map) != null ? _ref1.version : void 0)) {
                if (config.createTargetDirectories) {
                  fs.makeTreeSync(path.parse(pathTo.mapFile).dir);
                }
                mapJson = {
                  version: msgRet.result.map.version,
                  sources: pathTo.sourceFile,
                  file: pathTo.transpiledFile,
                  sourceRoot: '',
                  names: msgRet.result.map.names,
                  mappings: msgRet.result.map.mappings
                };
                xssiProtection = ')]}\n';
                return fs.writeFileSync(pathTo.mapFile, xssiProtection + JSON.stringify(mapJson, null, ' '));
              }
            }
          };
        })(this));
      }
    };

    Transpiler.prototype.cleanNotifications = function(pathTo) {
      var i, n, sf, _ref, _results;
      if (this.transpileErrorNotifications[pathTo.sourceFile] != null) {
        this.transpileErrorNotifications[pathTo.sourceFile].dismiss();
        delete this.transpileErrorNotifications[pathTo.sourceFile];
      }
      _ref = this.transpileErrorNotifications;
      for (sf in _ref) {
        n = _ref[sf];
        if (n.dismissed) {
          delete this.transpileErrorNotifications[sf];
        }
      }
      i = atom.notifications.notifications.length - 1;
      _results = [];
      while (i >= 0) {
        if (atom.notifications.notifications[i].dismissed && atom.notifications.notifications[i].message.substring(0, 3) === "LB:") {
          atom.notifications.notifications.splice(i, 1);
        }
        _results.push(i--);
      }
      return _results;
    };

    Transpiler.prototype.deprecateConfig = function() {
      if (atom.config.get('language-babel.supressTranspileOnSaveMessages') != null) {
        atom.config.set('language-babel.suppressTranspileOnSaveMessages', atom.config.get('language-babel.supressTranspileOnSaveMessages'));
      }
      if (atom.config.get('language-babel.supressSourcePathMessages') != null) {
        atom.config.set('language-babel.suppressSourcePathMessages', atom.config.get('language-babel.supressSourcePathMessages'));
      }
      atom.config.unset('language-babel.supressTranspileOnSaveMessages');
      atom.config.unset('language-babel.supressSourcePathMessages');
      atom.config.unset('language-babel.useInternalScanner');
      atom.config.unset('language-babel.stopAtProjectDirectory');
      atom.config.unset('language-babel.babelStage');
      atom.config.unset('language-babel.externalHelpers');
      atom.config.unset('language-babel.moduleLoader');
      atom.config.unset('language-babel.blacklistTransformers');
      atom.config.unset('language-babel.whitelistTransformers');
      atom.config.unset('language-babel.looseTransformers');
      atom.config.unset('language-babel.optionalTransformers');
      atom.config.unset('language-babel.plugins');
      return atom.config.unset('language-babel.presets');
    };

    Transpiler.prototype.getBabelOptions = function(config) {
      var babelOptions;
      return babelOptions = {
        sourceMaps: config.createMap,
        code: true
      };
    };

    Transpiler.prototype.getConfig = function() {
      return atom.config.get('language-babel');
    };

    Transpiler.prototype.getLocalConfig = function(fromDir, toDir, localConfig) {
      var err, fileContent, isProjectRoot, jsonContent, languageBabelCfgFile, localConfigFile, schemaErrors;
      localConfigFile = '.languagebabel';
      languageBabelCfgFile = path.join(fromDir, localConfigFile);
      if (fs.existsSync(languageBabelCfgFile)) {
        fileContent = fs.readFileSync(languageBabelCfgFile, 'utf8');
        try {
          jsonContent = JSON.parse(fileContent);
        } catch (_error) {
          err = _error;
          atom.notifications.addError("LB: " + localConfigFile + " " + err.message, {
            dismissable: true,
            detail: "File = " + languageBabelCfgFile + "\n\n" + fileContent
          });
          return;
        }
        schemaErrors = this.jsonSchema.validate('localConfig', jsonContent);
        if (schemaErrors) {
          atom.notifications.addError("LB: " + localConfigFile + " configuration error", {
            dismissable: true,
            detail: "File = " + languageBabelCfgFile + "\n\n" + fileContent
          });
        } else {
          isProjectRoot = jsonContent.projectRoot;
          this.merge(jsonContent, localConfig);
          if (isProjectRoot) {
            jsonContent.projectRootDir = fromDir;
          }
          localConfig = jsonContent;
        }
      }
      if (fromDir !== toDir) {
        if (fromDir === path.dirname(fromDir)) {
          return localConfig;
        }
        if (isProjectRoot) {
          return localConfig;
        }
        return this.getLocalConfig(path.dirname(fromDir), toDir, localConfig);
      } else {
        return localConfig;
      }
    };

    Transpiler.prototype.getPaths = function(sourceFile, config) {
      var absMapFile, absMapsRoot, absProjectPath, absSourceRoot, absTranspileRoot, absTranspiledFile, parsedSourceFile, projectContainingSource, relMapsPath, relSourcePath, relSourceRootToSourceFile, relTranspilePath, sourceFileInProject;
      projectContainingSource = atom.project.relativizePath(sourceFile);
      if (projectContainingSource[0] === null) {
        sourceFileInProject = false;
      } else {
        sourceFileInProject = true;
      }
      if (config.projectRootDir != null) {
        absProjectPath = path.normalize(config.projectRootDir);
      } else if (projectContainingSource[0] === null) {
        absProjectPath = path.parse(sourceFile).root;
      } else {
        absProjectPath = path.normalize(projectContainingSource[0]);
      }
      relSourcePath = path.normalize(config.babelSourcePath);
      relTranspilePath = path.normalize(config.babelTranspilePath);
      relMapsPath = path.normalize(config.babelMapsPath);
      absSourceRoot = path.join(absProjectPath, relSourcePath);
      absTranspileRoot = path.join(absProjectPath, relTranspilePath);
      absMapsRoot = path.join(absProjectPath, relMapsPath);
      parsedSourceFile = path.parse(sourceFile);
      relSourceRootToSourceFile = path.relative(absSourceRoot, parsedSourceFile.dir);
      absTranspiledFile = path.join(absTranspileRoot, relSourceRootToSourceFile, parsedSourceFile.name + '.js');
      absMapFile = path.join(absMapsRoot, relSourceRootToSourceFile, parsedSourceFile.name + '.js.map');
      return {
        sourceFileInProject: sourceFileInProject,
        sourceFile: sourceFile,
        sourceFileDir: parsedSourceFile.dir,
        mapFile: absMapFile,
        transpiledFile: absTranspiledFile,
        sourceRoot: absSourceRoot,
        projectPath: absProjectPath
      };
    };

    Transpiler.prototype.isBabelrcInPath = function(fromDir) {
      var babelrc, babelrcFile;
      babelrc = '.babelrc';
      babelrcFile = path.join(fromDir, babelrc);
      if (fs.existsSync(babelrcFile)) {
        return true;
      }
      if (fromDir !== path.dirname(fromDir)) {
        return this.isBabelrcInPath(path.dirname(fromDir));
      } else {
        return false;
      }
    };

    Transpiler.prototype.merge = function(targetObj, sourceObj) {
      var prop, val, _results;
      _results = [];
      for (prop in sourceObj) {
        val = sourceObj[prop];
        _results.push(targetObj[prop] = val);
      }
      return _results;
    };

    Transpiler.prototype.stopTranspilerTask = function(projectPath) {
      var msgObject;
      msgObject = {
        command: 'stop'
      };
      return this.babelTranspilerTasks[projectPath].send(msgObject);
    };

    Transpiler.prototype.stopAllTranspilerTask = function() {
      var projectPath, v, _ref, _results;
      _ref = this.babelTranspilerTasks;
      _results = [];
      for (projectPath in _ref) {
        v = _ref[projectPath];
        _results.push(this.stopTranspilerTask(projectPath));
      }
      return _results;
    };

    Transpiler.prototype.stopUnusedTasks = function() {
      var atomProjectPath, atomProjectPaths, isTaskInCurrentProject, projectTaskPath, v, _i, _len, _ref, _results;
      atomProjectPaths = atom.project.getPaths();
      _ref = this.babelTranspilerTasks;
      _results = [];
      for (projectTaskPath in _ref) {
        v = _ref[projectTaskPath];
        isTaskInCurrentProject = false;
        for (_i = 0, _len = atomProjectPaths.length; _i < _len; _i++) {
          atomProjectPath = atomProjectPaths[_i];
          if (pathIsInside(projectTaskPath, atomProjectPath)) {
            isTaskInCurrentProject = true;
            break;
          }
        }
        if (!isTaskInCurrentProject) {
          _results.push(this.stopTranspilerTask(projectTaskPath));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Transpiler;

  })();

  module.exports = Transpiler;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9saWIvdHJhbnNwaWxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkRBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGdDQUFSLENBSGYsQ0FBQTs7QUFBQSxFQUtBLG1CQUFBLEdBQXNCO0FBQUEsSUFDcEIsSUFBQSxFQUFNLFFBRGM7QUFBQSxJQUVwQixVQUFBLEVBQVk7QUFBQSxNQUNWLGFBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxRQUFSO09BRHhCO0FBQUEsTUFFVixlQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sU0FBUjtPQUZ4QjtBQUFBLE1BR1YsZUFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFFBQVI7T0FIeEI7QUFBQSxNQUlWLGtCQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sUUFBUjtPQUp4QjtBQUFBLE1BS1YsU0FBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFNBQVI7T0FMeEI7QUFBQSxNQU1WLHVCQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sU0FBUjtPQU54QjtBQUFBLE1BT1Ysb0JBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxTQUFSO09BUHhCO0FBQUEsTUFRViw4QkFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFNBQVI7T0FSeEI7QUFBQSxNQVNWLFdBQUEsRUFBa0M7QUFBQSxR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

//# sourceURL=/Users/kswedberg/.atom/packages/language-babel/lib/transpiler.coffee
