(function() {
  var $, $$, AdvancedFileView, BufferedProcess, TextEditorView, View, fs, mkdirp, path, touch, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  fs = require('fs');

  path = require('path');

  mkdirp = require('mkdirp');

  touch = require('touch');

  module.exports = AdvancedFileView = (function(_super) {
    __extends(AdvancedFileView, _super);

    function AdvancedFileView() {
      return AdvancedFileView.__super__.constructor.apply(this, arguments);
    }

    AdvancedFileView.prototype.PATH_SEPARATOR = ",";

    AdvancedFileView.prototype.advancedFileView = null;

    AdvancedFileView.prototype.keyUpListener = null;

    AdvancedFileView.config = {
      removeWholeFolder: {
        type: 'boolean',
        "default": true
      },
      suggestCurrentFilePath: {
        type: 'boolean',
        "default": false
      },
      showFilesInAutoComplete: {
        type: 'boolean',
        "default": false
      },
      caseSensitiveAutoCompletion: {
        type: 'boolean',
        "default": false
      },
      addTextFromSelection: {
        type: 'boolean',
        "default": false
      },
      createFileInstantly: {
        type: 'boolean',
        "default": false
      }
    };

    AdvancedFileView.activate = function(state) {
      this.advancedFileView = new AdvancedFileView(state.advancedFileViewState);
      try {
        return this.seenNotification = JSON.parse(state).seenNotification;
      } catch (_error) {
        return this.seenNotification = false;
      }
    };

    AdvancedFileView.serialize = function() {
      return JSON.stringify({
        seenNotification: this.seenNotification
      });
    };

    AdvancedFileView.deactivate = function() {
      return this.advancedFileView.detach();
    };

    AdvancedFileView.content = function(params) {
      return this.div({
        "class": 'advanced-new-file'
      }, (function(_this) {
        return function() {
          _this.div({
            outlet: 'mainUI'
          }, function() {
            _this.p({
              outlet: 'message',
              "class": 'icon icon-file-add'
            }, "Enter the path for the new file/directory. Directories end with a '" + path.sep + "'.");
            _this.subview('miniEditor', new TextEditorView({
              mini: true
            }));
            return _this.ul({
              "class": 'list-group',
              outlet: 'directoryList'
            });
          });
          return _this.div({
            outlet: 'notificationUI'
          }, function() {
            _this.h2({
              "class": 'icon icon-info'
            }, "Advanced New File is no longer maintained");
            _this.p(function() {
              return _this.raw("advanced-new-file won't be getting any more updates, but the project\nhas been forked as <a href=\"https://atom.io/packages/advanced-open-file\">advanced-open-file</a>.\nThe fork opens files as well as creating them, and adds several new features.");
            });
            _this.p(function() {
              return _this.text("Click the Update button below to replace advanced-new-file with\nadvanced-open-file (the current window will be reloaded). Otherwise,\nclick the No Thanks button and this message will not appear again.");
            });
            return _this.div({
              "class": 'btn-toolbar'
            }, function() {
              _this.div({
                "class": 'btn-group'
              }, function() {
                return _this.button({
                  outlet: 'closeNotification',
                  "class": 'btn'
                }, "No thanks");
              });
              return _this.div({
                "class": 'btn-group'
              }, function() {
                return _this.button({
                  outlet: 'replacePackageBtn',
                  "class": 'btn btn-success'
                }, "Update");
              });
            });
          });
        };
      })(this));
    };

    AdvancedFileView.detaching = false;

    AdvancedFileView.prototype.initialize = function(serializeState) {
      atom.commands.add('atom-workspace', 'advanced-new-file:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      this.miniEditor.getModel().setPlaceholderText(path.join('path', 'to', 'file.txt'));
      return atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.confirm();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    AdvancedFileView.prototype.referenceDir = function() {
      var homeDir;
      homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
      return atom.project.getPaths()[0] || homeDir;
    };

    AdvancedFileView.prototype.inputPath = function() {
      var input;
      input = this.getLastSearchedFile();
      return path.join(this.referenceDir(), input.substr(0, input.lastIndexOf(path.sep)));
    };

    AdvancedFileView.prototype.inputFullPath = function() {
      var input;
      input = this.getLastSearchedFile();
      return path.join(this.referenceDir(), input);
    };

    AdvancedFileView.prototype.getLastSearchedFile = function() {
      var commanIndex, input;
      input = this.miniEditor.getText();
      commanIndex = input.lastIndexOf(this.PATH_SEPARATOR) + 1;
      return input.substring(commanIndex, input.length);
    };

    AdvancedFileView.prototype.getFileList = function(callback) {
      var input;
      input = this.getLastSearchedFile();
      return fs.stat(this.inputPath(), (function(_this) {
        return function(err, stat) {
          if ((err != null ? err.code : void 0) === 'ENOENT') {
            return [];
          }
          return fs.readdir(_this.inputPath(), function(err, files) {
            var dirList, fileList;
            fileList = [];
            dirList = [];
            files.forEach(function(filename) {
              var caseSensitive, fragment, isDir, matches;
              fragment = input.substr(input.lastIndexOf(path.sep) + 1, input.length);
              caseSensitive = atom.config.get('advanced-new-file.caseSensitiveAutoCompletion');
              if (!caseSensitive) {
                fragment = fragment.toLowerCase();
              }
              matches = caseSensitive && filename.indexOf(fragment) === 0 || !caseSensitive && filename.toLowerCase().indexOf(fragment) === 0;
              if (matches) {
                try {
                  isDir = fs.statSync(path.join(_this.inputPath(), filename)).isDirectory();
                } catch (_error) {

                }
                return (isDir ? dirList : fileList).push({
                  name: filename,
                  isDir: isDir
                });
              }
            });
            if (atom.config.get('advanced-new-file.showFilesInAutoComplete')) {
              return callback.apply(_this, [dirList.concat(fileList)]);
            } else {
              return callback.apply(_this, [dirList]);
            }
          });
        };
      })(this));
    };

    AdvancedFileView.prototype.autocomplete = function(str) {
      return this.getFileList(function(files) {
        var file, indexOfString, longestPrefix, newPath, newString, oldInputText, suffix, textWithoutSuggestion;
        newString = str;
        oldInputText = this.miniEditor.getText();
        indexOfString = oldInputText.lastIndexOf(str);
        textWithoutSuggestion = oldInputText.substring(0, indexOfString);
        if ((files != null ? files.length : void 0) === 1) {
          newPath = path.join(this.inputPath(), files[0].name);
          suffix = files[0].isDir ? path.sep : '';
          return this.updatePath(newPath + suffix, textWithoutSuggestion);
        } else if ((files != null ? files.length : void 0) > 1) {
          longestPrefix = this.longestCommonPrefix((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = files.length; _i < _len; _i++) {
              file = files[_i];
              _results.push(file.name);
            }
            return _results;
          })());
          newPath = path.join(this.inputPath(), longestPrefix);
          if (newPath.length > this.inputFullPath().length) {
            return this.updatePath(newPath, textWithoutSuggestion);
          } else {
            return atom.beep();
          }
        } else {
          return atom.beep();
        }
      });
    };

    AdvancedFileView.prototype.updatePath = function(newPath, oldPath) {
      var relativePath;
      relativePath = oldPath + atom.project.relativize(newPath);
      return this.miniEditor.setText(relativePath);
    };

    AdvancedFileView.prototype.update = function() {
      this.getFileList(function(files) {
        return this.renderAutocompleteList(files);
      });
      if (/\/$/.test(this.miniEditor.getText())) {
        return this.setMessage('file-directory-create');
      } else {
        return this.setMessage('file-add');
      }
    };

    AdvancedFileView.prototype.setMessage = function(icon, str) {
      this.message.removeClass('icon' + ' icon-file-add' + ' icon-file-directory-create' + ' icon-alert');
      if (icon != null) {
        this.message.addClass('icon icon-' + icon);
      }
      return this.message.text(str || "Enter the path for the new file/directory. Directories end with a '" + path.sep + "'.");
    };

    AdvancedFileView.prototype.renderAutocompleteList = function(files) {
      this.directoryList.empty();
      return files != null ? files.forEach((function(_this) {
        return function(file) {
          var icon;
          icon = file.isDir ? 'icon-file-directory' : 'icon-file-text';
          return _this.directoryList.append($$(function() {
            return this.li({
              "class": 'list-item'
            }, (function(_this) {
              return function() {
                return _this.span({
                  "class": "icon " + icon
                }, file.name);
              };
            })(this));
          }));
        };
      })(this)) : void 0;
    };

    AdvancedFileView.prototype.confirm = function() {
      var createWithin, error, pathToCreate, relativePath, relativePaths, _i, _len;
      relativePaths = this.miniEditor.getText().split(this.PATH_SEPARATOR);
      for (_i = 0, _len = relativePaths.length; _i < _len; _i++) {
        relativePath = relativePaths[_i];
        pathToCreate = path.join(this.referenceDir(), relativePath);
        createWithin = path.dirname(pathToCreate);
        try {
          if (/\/$/.test(pathToCreate)) {
            mkdirp(pathToCreate);
          } else {
            if (atom.config.get('advanced-new-file.createFileInstantly')) {
              if (!(fs.existsSync(createWithin) && fs.statSync(createWithin))) {
                mkdirp(createWithin);
              }
              touch(pathToCreate);
            }
            atom.workspace.open(pathToCreate);
          }
        } catch (_error) {
          error = _error;
          this.setMessage('alert', error.message);
        }
      }
      return this.detach();
    };

    AdvancedFileView.prototype.detach = function() {
      var miniEditorFocused, _ref1;
      if (!this.hasParent()) {
        return;
      }
      this.detaching = true;
      this.miniEditor.setText('');
      this.setMessage();
      this.directoryList.empty();
      miniEditorFocused = this.miniEditor.isFocused;
      this.keyUpListener.off();
      AdvancedFileView.__super__.detach.apply(this, arguments);
      if ((_ref1 = this.panel) != null) {
        _ref1.hide();
      }
      if (miniEditorFocused) {
        this.restoreFocus();
      }
      return this.detaching = false;
    };

    AdvancedFileView.prototype.attach = function() {
      var consumeKeypress, selection, text;
      this.suggestPath();
      this.previouslyFocusedElement = $(':focus');
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      if (this.seenNotification) {
        this.mainUI.removeClass('hidden');
        this.notificationUI.addClass('hidden');
      } else {
        this.notificationUI.removeClass('hidden');
        this.mainUI.addClass('hidden');
      }
      this.closeNotification.on('click', (function(_this) {
        return function(ev) {
          _this.seenNotification = true;
          _this.mainUI.removeClass('hidden');
          return _this.notificationUI.addClass('hidden');
        };
      })(this));
      this.replacePackageBtn.on('click', (function(_this) {
        return function(ev) {
          _this.seenNotification = true;
          _this.detach();
          return _this.replacePackage();
        };
      })(this));
      this.miniEditor.on('focusout', (function(_this) {
        return function() {
          if (!_this.detaching) {
            return _this.detach();
          }
        };
      })(this));
      this.miniEditor.focus();
      consumeKeypress = (function(_this) {
        return function(ev) {
          ev.preventDefault();
          return ev.stopPropagation();
        };
      })(this);
      this.miniEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
      this.miniEditor.on('keydown', (function(_this) {
        return function(ev) {
          if (ev.keyCode === 9) {
            return consumeKeypress(ev);
          }
        };
      })(this));
      this.keyUpListener = this.miniEditor.on('keyup', (function(_this) {
        return function(ev) {
          var absolutePathToFile, editorText, fileSep, pathSepIndex, pathToComplete, substr;
          if (ev.keyCode === 9) {
            consumeKeypress(ev);
            pathToComplete = _this.getLastSearchedFile();
            return _this.autocomplete(pathToComplete);
          } else if (ev.keyCode === 8) {
            if (atom.config.get('advanced-new-file.removeWholeFolder')) {
              absolutePathToFile = _this.inputFullPath();
              if (fs.existsSync(absolutePathToFile) && fs.statSync(absolutePathToFile)) {
                editorText = _this.miniEditor.getText();
                pathSepIndex = editorText.lastIndexOf(path.sep) + 1;
                fileSep = editorText.lastIndexOf(_this.PATH_SEPARATOR);
                substr = Math.max(pathSepIndex, fileSep);
                return _this.miniEditor.setText(editorText.substring(0, substr));
              }
            }
          }
        };
      })(this));
      if (atom.config.get('advanced-new-file.addTextFromSelection') && atom.workspace.getActiveTextEditor()) {
        selection = atom.workspace.getActiveTextEditor().getSelection();
        if (selection.empty == null) {
          text = this.miniEditor.getText() + selection.getText();
          this.miniEditor.setText(text);
        }
      }
      this.miniEditor.focus();
      return this.getFileList(function(files) {
        return this.renderAutocompleteList(files);
      });
    };

    AdvancedFileView.prototype.suggestPath = function() {
      var activeDir, activePath, suggestedPath, _ref1;
      if (atom.config.get('advanced-new-file.suggestCurrentFilePath')) {
        activePath = (_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0;
        if (activePath) {
          activeDir = path.dirname(activePath) + path.sep;
          suggestedPath = path.relative(this.referenceDir(), activeDir);
          return this.miniEditor.setText(suggestedPath + path.sep);
        }
      }
    };

    AdvancedFileView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.detach();
      } else {
        return this.attach();
      }
    };

    AdvancedFileView.prototype.restoreFocus = function() {
      var _ref1;
      if ((_ref1 = this.previouslyFocusedElement) != null ? _ref1.isOnDom() : void 0) {
        return this.previouslyFocusedElement.focus();
      }
    };

    AdvancedFileView.prototype.longestCommonPrefix = function(fileNames) {
      var fileIndex, fileName, longestCommonPrefix, nextCharacter, prefixIndex, _i, _j, _ref1, _ref2;
      if ((fileNames != null ? fileNames.length : void 0) === 0) {
        return "";
      }
      longestCommonPrefix = "";
      for (prefixIndex = _i = 0, _ref1 = fileNames[0].length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; prefixIndex = 0 <= _ref1 ? ++_i : --_i) {
        nextCharacter = fileNames[0][prefixIndex];
        for (fileIndex = _j = 0, _ref2 = fileNames.length - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; fileIndex = 0 <= _ref2 ? ++_j : --_j) {
          fileName = fileNames[fileIndex];
          if (fileName.length < prefixIndex || fileName[prefixIndex] !== nextCharacter) {
            return longestCommonPrefix;
          }
        }
        longestCommonPrefix += nextCharacter;
      }
      return longestCommonPrefix;
    };

    AdvancedFileView.prototype.executeApm = function(args, exit) {
      return new BufferedProcess({
        command: atom.packages.getApmPath(),
        args: args,
        stdout: function(output) {},
        stderr: function(output) {},
        exit: exit
      });
    };

    AdvancedFileView.prototype.replacePackage = function() {
      var info;
      info = atom.notifications.addInfo('Installing advanced-open-file...');
      return this.executeApm(['install', 'advanced-open-file'], (function(_this) {
        return function(exitCode) {
          if (exitCode === 1) {
            info.dismiss();
            return atom.notifications.addError('Failed to install advanced-open-file, please install it manually.');
          } else {
            return _this.executeApm(['uninstall', 'advanced-new-file'], function(exitCode) {
              info.dismiss();
              if (exitCode === 0) {
                atom.notifications.addSuccess('advanced-open-file installed successfully!', {
                  detail: 'Atom will reload in a few seconds...'
                });
                return setTimeout((function() {
                  return atom.reload();
                }), 3000);
              } else {
                return atom.notifications.addError('Failed to uninstall advanced-new-file, please uninstall it manually.');
              }
            });
          }
        };
      })(this));
    };

    return AdvancedFileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hZHZhbmNlZC1uZXctZmlsZS9saWIvYWR2YW5jZWQtbmV3LWZpbGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkZBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQSxPQUFnQyxPQUFBLENBQVEsc0JBQVIsQ0FBaEMsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxZQUFBLElBQVIsRUFBYyxzQkFBQSxjQURkLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUpULENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FMUixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxjQUFBLEdBQWdCLEdBQWhCLENBQUE7O0FBQUEsK0JBQ0EsZ0JBQUEsR0FBa0IsSUFEbEIsQ0FBQTs7QUFBQSwrQkFFQSxhQUFBLEdBQWUsSUFGZixDQUFBOztBQUFBLElBSUEsZ0JBQUMsQ0FBQSxNQUFELEdBQ0U7QUFBQSxNQUFBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxzQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FK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

//# sourceURL=/Users/kswedberg/.atom/packages/advanced-new-file/lib/advanced-new-file-view.coffee
