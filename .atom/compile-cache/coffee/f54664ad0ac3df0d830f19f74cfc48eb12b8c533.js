(function() {
  var AtomReact, CompositeDisposable, Disposable, autoCompleteTagCloseRegex, autoCompleteTagStartRegex, contentCheckRegex, decreaseIndentForNextLinePattern, defaultDetectReactFilePattern, jsxComplexAttributePattern, jsxTagStartPattern, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  contentCheckRegex = null;

  defaultDetectReactFilePattern = '/((require\\([\'"]react(?:(-native|\\/addons))?[\'"]\\)))|(import\\s+[\\w{},\\s]+\\s+from\\s+[\'"]react(?:(-native|\\/addons))?[\'"])/';

  autoCompleteTagStartRegex = /(<)([a-zA-Z0-9\.:$_]+)/g;

  autoCompleteTagCloseRegex = /(<\/)([^>]+)(>)/g;

  jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';

  jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';

  decreaseIndentForNextLinePattern = '(?x) />\\s*(,|;)?\\s*$ | ^\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$';

  AtomReact = (function() {
    AtomReact.prototype.config = {
      enabledForAllJavascriptFiles: {
        type: 'boolean',
        "default": false,
        description: 'Enable grammar, snippets and other features automatically for all .js files.'
      },
      disableAutoClose: {
        type: 'boolean',
        "default": false,
        description: 'Disabled tag autocompletion'
      },
      detectReactFilePattern: {
        type: 'string',
        "default": defaultDetectReactFilePattern
      },
      jsxTagStartPattern: {
        type: 'string',
        "default": jsxTagStartPattern
      },
      jsxComplexAttributePattern: {
        type: 'string',
        "default": jsxComplexAttributePattern
      },
      decreaseIndentForNextLinePattern: {
        type: 'string',
        "default": decreaseIndentForNextLinePattern
      }
    };

    function AtomReact() {}

    AtomReact.prototype.patchEditorLangModeAutoDecreaseIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.autoDecreaseIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.autoDecreaseIndentForBufferRow = function(bufferRow, options) {
        var currentIndentLevel, decreaseIndentRegex, decreaseNextLineIndentRegex, desiredIndentLevel, increaseIndentRegex, line, precedingLine, precedingRow, scopeDescriptor;
        if (editor.getGrammar().scopeName !== "source.js.jsx") {
          return fn.call(editor.languageMode, bufferRow, options);
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.getRegexForProperty(scopeDescriptor, 'react.decreaseIndentForNextLinePattern');
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        line = this.buffer.lineForRow(bufferRow);
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine) && !(increaseIndentRegex && increaseIndentRegex.testSync(precedingLine)) && !this.editor.isBufferRowCommented(precedingRow)) {
          currentIndentLevel = this.editor.indentationForBufferRow(precedingRow);
          if (decreaseIndentRegex && decreaseIndentRegex.testSync(line)) {
            currentIndentLevel -= 1;
          }
          desiredIndentLevel = currentIndentLevel - 1;
          if (desiredIndentLevel >= 0 && desiredIndentLevel < currentIndentLevel) {
            return this.editor.setIndentationForBufferRow(bufferRow, desiredIndentLevel);
          }
        } else if (!this.editor.isBufferRowCommented(bufferRow)) {
          return fn.call(editor.languageMode, bufferRow, options);
        }
      };
    };

    AtomReact.prototype.patchEditorLangModeSuggestedIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.suggestedIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.suggestedIndentForBufferRow = function(bufferRow, options) {
        var complexAttributeRegex, decreaseIndentRegex, decreaseIndentTest, decreaseNextLineIndentRegex, increaseIndentRegex, indent, precedingLine, precedingRow, scopeDescriptor, tagStartRegex, tagStartTest;
        indent = fn.call(editor.languageMode, bufferRow, options);
        if (!(editor.getGrammar().scopeName === "source.js.jsx" && bufferRow > 1)) {
          return indent;
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.getRegexForProperty(scopeDescriptor, 'react.decreaseIndentForNextLinePattern');
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        tagStartRegex = this.getRegexForProperty(scopeDescriptor, 'react.jsxTagStartPattern');
        complexAttributeRegex = this.getRegexForProperty(scopeDescriptor, 'react.jsxComplexAttributePattern');
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return indent;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        if (precedingLine == null) {
          return indent;
        }
        if (this.editor.isBufferRowCommented(bufferRow) && this.editor.isBufferRowCommented(precedingRow)) {
          return this.editor.indentationForBufferRow(precedingRow);
        }
        tagStartTest = tagStartRegex.testSync(precedingLine);
        decreaseIndentTest = decreaseIndentRegex.testSync(precedingLine);
        if (tagStartTest && complexAttributeRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent += 1;
        }
        if (precedingLine && !decreaseIndentTest && decreaseNextLineIndentRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent -= 1;
        }
        return Math.max(indent, 0);
      };
    };

    AtomReact.prototype.patchEditorLangMode = function(editor) {
      var _ref1, _ref2;
      if ((_ref1 = this.patchEditorLangModeSuggestedIndentForBufferRow(editor)) != null) {
        _ref1.jsxPatch = true;
      }
      return (_ref2 = this.patchEditorLangModeAutoDecreaseIndentForBufferRow(editor)) != null ? _ref2.jsxPatch = true : void 0;
    };

    AtomReact.prototype.isReact = function(text) {
      var match;
      if (atom.config.get('react.enabledForAllJavascriptFiles')) {
        return true;
      }
      if (contentCheckRegex == null) {
        match = (atom.config.get('react.detectReactFilePattern') || defaultDetectReactFilePattern).match(new RegExp('^/(.*?)/([gimy]*)$'));
        contentCheckRegex = new RegExp(match[1], match[2]);
      }
      return text.match(contentCheckRegex) != null;
    };

    AtomReact.prototype.isReactEnabledForEditor = function(editor) {
      var _ref1;
      return (editor != null) && ((_ref1 = editor.getGrammar().scopeName) === "source.js.jsx" || _ref1 === "source.coffee.jsx");
    };

    AtomReact.prototype.autoSetGrammar = function(editor) {
      var extName, jsxGrammar, path;
      if (this.isReactEnabledForEditor(editor)) {
        return;
      }
      path = require('path');
      extName = path.extname(editor.getPath());
      if (extName === ".jsx" || ((extName === ".js" || extName === ".es6") && this.isReact(editor.getText()))) {
        jsxGrammar = atom.grammars.grammarsByScopeName["source.js.jsx"];
        if (jsxGrammar) {
          return editor.setGrammar(jsxGrammar);
        }
      }
    };

    AtomReact.prototype.onHTMLToJSX = function() {
      var HTMLtoJSX, converter, editor, jsxformat, selections;
      jsxformat = require('jsxformat');
      HTMLtoJSX = require('./htmltojsx');
      converter = new HTMLtoJSX({
        createClass: false
      });
      editor = atom.workspace.getActiveTextEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var jsxOutput, range, selection, selectionText, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selections.length; _i < _len; _i++) {
            selection = selections[_i];
            try {
              selectionText = selection.getText();
              jsxOutput = converter.convert(selectionText);
              try {
                jsxformat.setOptions({});
                jsxOutput = jsxformat.format(jsxOutput);
              } catch (_error) {}
              selection.insertText(jsxOutput);
              range = selection.getBufferRange();
              _results.push(editor.autoIndentBufferRows(range.start.row, range.end.row));
            } catch (_error) {}
          }
          return _results;
        };
      })(this));
    };

    AtomReact.prototype.onReformat = function() {
      var editor, jsxformat, selections, _;
      jsxformat = require('jsxformat');
      _ = require('lodash');
      editor = atom.workspace.getActiveTextEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var bufEnd, bufStart, err, firstChangedLine, lastChangedLine, newLineCount, original, originalLineCount, range, result, selection, serializedRange, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selections.length; _i < _len; _i++) {
            selection = selections[_i];
            try {
              range = selection.getBufferRange();
              serializedRange = range.serialize();
              bufStart = serializedRange[0];
              bufEnd = serializedRange[1];
              jsxformat.setOptions({});
              result = jsxformat.format(selection.getText());
              originalLineCount = editor.getLineCount();
              selection.insertText(result);
              newLineCount = editor.getLineCount();
              editor.autoIndentBufferRows(bufStart[0], bufEnd[0] + (newLineCount - originalLineCount));
              _results.push(editor.setCursorBufferPosition(bufStart));
            } catch (_error) {
              err = _error;
              range = selection.getBufferRange().serialize();
              range[0][0]++;
              range[1][0]++;
              jsxformat.setOptions({
                range: range
              });
              original = editor.getText();
              try {
                result = jsxformat.format(original);
                selection.clear();
                originalLineCount = editor.getLineCount();
                editor.setText(result);
                newLineCount = editor.getLineCount();
                firstChangedLine = range[0][0] - 1;
                lastChangedLine = range[1][0] - 1 + (newLineCount - originalLineCount);
                editor.autoIndentBufferRows(firstChangedLine, lastChangedLine);
                _results.push(editor.setCursorBufferPosition([firstChangedLine, range[0][1]]));
              } catch (_error) {}
            }
          }
          return _results;
        };
      })(this));
    };

    AtomReact.prototype.autoCloseTag = function(eventObj, editor) {
      var fullLine, lastLine, lastLineSpaces, line, lines, match, rest, row, serializedEndPoint, tagName, token, tokenizedLine, _ref1, _ref2, _ref3, _ref4;
      if (atom.config.get('react.disableAutoClose')) {
        return;
      }
      if (!this.isReactEnabledForEditor(editor) || editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if ((eventObj != null ? eventObj.newText : void 0) === '>' && !eventObj.oldText) {
        if (editor.getCursorBufferPositions().length > 1) {
          return;
        }
        tokenizedLine = (_ref1 = editor.displayBuffer) != null ? (_ref2 = _ref1.tokenizedBuffer) != null ? _ref2.tokenizedLineForRow(eventObj.newRange.end.row) : void 0 : void 0;
        if (tokenizedLine == null) {
          return;
        }
        token = tokenizedLine.tokenAtBufferColumn(eventObj.newRange.end.column - 1);
        if ((token == null) || token.scopes.indexOf('tag.open.js') === -1 || token.scopes.indexOf('punctuation.definition.tag.end.js') === -1) {
          return;
        }
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        line = lines[row];
        line = line.substr(0, eventObj.newRange.end.column);
        if (line.substr(line.length - 2, 1) === '/') {
          return;
        }
        tagName = null;
        while ((line != null) && (tagName == null)) {
          match = line.match(autoCompleteTagStartRegex);
          if ((match != null) && match.length > 0) {
            tagName = match.pop().substr(1);
          }
          row--;
          line = lines[row];
        }
        if (tagName != null) {
          editor.insertText('</' + tagName + '>', {
            undo: 'skip'
          });
          return editor.setCursorBufferPosition(eventObj.newRange.end);
        }
      } else if ((eventObj != null ? eventObj.oldText : void 0) === '>' && (eventObj != null ? eventObj.newText : void 0) === '') {
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        fullLine = lines[row];
        tokenizedLine = (_ref3 = editor.displayBuffer) != null ? (_ref4 = _ref3.tokenizedBuffer) != null ? _ref4.tokenizedLineForRow(eventObj.newRange.end.row) : void 0 : void 0;
        if (tokenizedLine == null) {
          return;
        }
        token = tokenizedLine.tokenAtBufferColumn(eventObj.newRange.end.column - 1);
        if ((token == null) || token.scopes.indexOf('tag.open.js') === -1) {
          return;
        }
        line = fullLine.substr(0, eventObj.newRange.end.column);
        if (line.substr(line.length - 1, 1) === '/') {
          return;
        }
        tagName = null;
        while ((line != null) && (tagName == null)) {
          match = line.match(autoCompleteTagStartRegex);
          if ((match != null) && match.length > 0) {
            tagName = match.pop().substr(1);
          }
          row--;
          line = lines[row];
        }
        if (tagName != null) {
          rest = fullLine.substr(eventObj.newRange.end.column);
          if (rest.indexOf('</' + tagName + '>') === 0) {
            serializedEndPoint = [eventObj.newRange.end.row, eventObj.newRange.end.column];
            return editor.setTextInBufferRange([serializedEndPoint, [serializedEndPoint[0], serializedEndPoint[1] + tagName.length + 3]], '', {
              undo: 'skip'
            });
          }
        }
      } else if ((eventObj != null ? eventObj.newText : void 0) === '\n') {
        lines = editor.buffer.getLines();
        row = eventObj.newRange.end.row;
        lastLine = lines[row - 1];
        fullLine = lines[row];
        if (/>$/.test(lastLine) && fullLine.search(autoCompleteTagCloseRegex) === 0) {
          while (lastLine != null) {
            match = lastLine.match(autoCompleteTagStartRegex);
            if ((match != null) && match.length > 0) {
              break;
            }
            row--;
            lastLine = lines[row];
          }
          lastLineSpaces = lastLine.match(/^\s*/);
          lastLineSpaces = lastLineSpaces != null ? lastLineSpaces[0] : '';
          editor.insertText('\n' + lastLineSpaces);
          return editor.setCursorBufferPosition(eventObj.newRange.end);
        }
      }
    };

    AtomReact.prototype.processEditor = function(editor) {
      var disposableBufferEvent;
      this.patchEditorLangMode(editor);
      this.autoSetGrammar(editor);
      disposableBufferEvent = editor.buffer.onDidChange((function(_this) {
        return function(e) {
          return _this.autoCloseTag(e, editor);
        };
      })(this));
      this.disposables.add(editor.onDidDestroy((function(_this) {
        return function() {
          return disposableBufferEvent.dispose();
        };
      })(this)));
      return this.disposables.add(disposableBufferEvent);
    };

    AtomReact.prototype.deactivate = function() {
      return this.disposables.dispose();
    };

    AtomReact.prototype.activate = function() {
      var disposableConfigListener, disposableHTMLTOJSX, disposableProcessEditor, disposableReformat;
      this.disposables = new CompositeDisposable();
      jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';
      jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';
      decreaseIndentForNextLinePattern = '(?x) />\\s*(,|;)?\\s*$ | ^\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$';
      atom.config.set("react.jsxTagStartPattern", jsxTagStartPattern);
      atom.config.set("react.jsxComplexAttributePattern", jsxComplexAttributePattern);
      atom.config.set("react.decreaseIndentForNextLinePattern", decreaseIndentForNextLinePattern);
      disposableConfigListener = atom.config.observe('react.detectReactFilePattern', function(newValue) {
        return contentCheckRegex = null;
      });
      disposableReformat = atom.commands.add('atom-workspace', 'react:reformat-JSX', (function(_this) {
        return function() {
          return _this.onReformat();
        };
      })(this));
      disposableHTMLTOJSX = atom.commands.add('atom-workspace', 'react:HTML-to-JSX', (function(_this) {
        return function() {
          return _this.onHTMLToJSX();
        };
      })(this));
      disposableProcessEditor = atom.workspace.observeTextEditors(this.processEditor.bind(this));
      this.disposables.add(disposableConfigListener);
      this.disposables.add(disposableReformat);
      this.disposables.add(disposableHTMLTOJSX);
      return this.disposables.add(disposableProcessEditor);
    };

    return AtomReact;

  })();

  module.exports = AtomReact;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9yZWFjdC9saWIvYXRvbS1yZWFjdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsME9BQUE7O0FBQUEsRUFBQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBQXRCLENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixJQUZwQixDQUFBOztBQUFBLEVBR0EsNkJBQUEsR0FBZ0Msd0lBSGhDLENBQUE7O0FBQUEsRUFJQSx5QkFBQSxHQUE0Qix5QkFKNUIsQ0FBQTs7QUFBQSxFQUtBLHlCQUFBLEdBQTRCLGtCQUw1QixDQUFBOztBQUFBLEVBT0Esa0JBQUEsR0FBcUIsZ0RBUHJCLENBQUE7O0FBQUEsRUFRQSwwQkFBQSxHQUE2QixtQ0FSN0IsQ0FBQTs7QUFBQSxFQVNBLGdDQUFBLEdBQW1DLDJEQVRuQyxDQUFBOztBQUFBLEVBYU07QUFDSix3QkFBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLDRCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDhFQUZiO09BREY7QUFBQSxNQUlBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDZCQUZiO09BTEY7QUFBQSxNQVFBLHNCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsNkJBRFQ7T0FURjtBQUFBLE1BV0Esa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxrQkFEVDtPQVpG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

//# sourceURL=/Users/kswedberg/.atom/packages/react/lib/atom-react.coffee
