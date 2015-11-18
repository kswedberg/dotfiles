(function() {
  var Point, Range, editorUtils, emmet, insertSnippet, normalize, path, preprocessSnippet, resources, tabStops, utils, visualize, _ref;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  path = require('path');

  emmet = require('emmet');

  utils = require('emmet/lib/utils/common');

  tabStops = require('emmet/lib/assets/tabStops');

  resources = require('emmet/lib/assets/resources');

  editorUtils = require('emmet/lib/utils/editor');

  insertSnippet = function(snippet, editor) {
    var _ref1, _ref2, _ref3, _ref4;
    if ((_ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
      if ((_ref2 = _ref1.mainModule) != null) {
        _ref2.insert(snippet, editor);
      }
    }
    return editor.snippetExpansion = (_ref3 = atom.packages.getLoadedPackage('snippets')) != null ? (_ref4 = _ref3.mainModule) != null ? _ref4.getExpansions(editor)[0] : void 0 : void 0;
  };

  visualize = function(str) {
    return str.replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\s/g, '\\s');
  };

  normalize = function(text, editor) {
    return editorUtils.normalize(text, {
      indentation: editor.getTabText(),
      newline: '\n'
    });
  };

  preprocessSnippet = function(value) {
    var order, tabstopOptions;
    order = [];
    tabstopOptions = {
      tabstop: function(data) {
        var group, placeholder;
        group = parseInt(data.group, 10);
        if (group === 0) {
          order.push(-1);
          group = order.length;
        } else {
          if (order.indexOf(group) === -1) {
            order.push(group);
          }
          group = order.indexOf(group) + 1;
        }
        placeholder = data.placeholder || '';
        if (placeholder) {
          placeholder = tabStops.processText(placeholder, tabstopOptions);
        }
        if (placeholder) {
          return "${" + group + ":" + placeholder + "}";
        } else {
          return "$" + group;
        }
      },
      escape: function(ch) {
        if (ch === '$') {
          return '\\$';
        } else {
          return ch;
        }
      }
    };
    return tabStops.processText(value, tabstopOptions);
  };

  module.exports = {
    setup: function(editor, selectionIndex) {
      var buf, bufRanges;
      this.editor = editor;
      this.selectionIndex = selectionIndex != null ? selectionIndex : 0;
      buf = this.editor.getBuffer();
      bufRanges = this.editor.getSelectedBufferRanges();
      return this._selection = {
        index: 0,
        saved: new Array(bufRanges.length),
        bufferRanges: bufRanges,
        indexRanges: bufRanges.map(function(range) {
          return {
            start: buf.characterIndexForPosition(range.start),
            end: buf.characterIndexForPosition(range.end)
          };
        })
      };
    },
    exec: function(fn) {
      var ix, success;
      ix = this._selection.bufferRanges.length - 1;
      this._selection.saved = [];
      success = true;
      while (ix >= 0) {
        this._selection.index = ix;
        if (fn(this._selection.index) === false) {
          success = false;
          break;
        }
        ix--;
      }
      if (success && this._selection.saved.length > 1) {
        return this._setSelectedBufferRanges(this._selection.saved);
      }
    },
    _setSelectedBufferRanges: function(sels) {
      var filteredSels;
      filteredSels = sels.filter(function(s) {
        return !!s;
      });
      if (filteredSels.length) {
        return this.editor.setSelectedBufferRanges(filteredSels);
      }
    },
    _saveSelection: function(delta) {
      var i, range, _results;
      this._selection.saved[this._selection.index] = this.editor.getSelectedBufferRange();
      if (delta) {
        i = this._selection.index;
        delta = Point.fromObject([delta, 0]);
        _results = [];
        while (++i < this._selection.saved.length) {
          range = this._selection.saved[i];
          if (range) {
            _results.push(this._selection.saved[i] = new Range(range.start.translate(delta), range.end.translate(delta)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    selectionList: function() {
      return this._selection.indexRanges;
    },
    getCaretPos: function() {
      return this.getSelectionRange().start;
    },
    setCaretPos: function(pos) {
      return this.createSelection(pos);
    },
    getSelectionRange: function() {
      return this._selection.indexRanges[this._selection.index];
    },
    getSelectionBufferRange: function() {
      return this._selection.bufferRanges[this._selection.index];
    },
    createSelection: function(start, end) {
      var buf, sels;
      if (end == null) {
        end = start;
      }
      sels = this._selection.bufferRanges;
      buf = this.editor.getBuffer();
      sels[this._selection.index] = new Range(buf.positionForCharacterIndex(start), buf.positionForCharacterIndex(end));
      return this._setSelectedBufferRanges(sels);
    },
    getSelection: function() {
      return this.editor.getTextInBufferRange(this.getSelectionBufferRange());
    },
    getCurrentLineRange: function() {
      var index, lineLength, row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      lineLength = this.editor.lineTextForBufferRow(row).length;
      index = this.editor.getBuffer().characterIndexForPosition({
        row: row,
        column: 0
      });
      return {
        start: index,
        end: index + lineLength
      };
    },
    getCurrentLine: function() {
      var row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      return this.editor.lineTextForBufferRow(row);
    },
    getContent: function() {
      return this.editor.getText();
    },
    replaceContent: function(value, start, end, noIndent) {
      var buf, caret, changeRange, oldValue;
      if (end == null) {
        end = start == null ? this.getContent().length : start;
      }
      if (start == null) {
        start = 0;
      }
      value = normalize(value, this.editor);
      buf = this.editor.getBuffer();
      changeRange = new Range(Point.fromObject(buf.positionForCharacterIndex(start)), Point.fromObject(buf.positionForCharacterIndex(end)));
      oldValue = this.editor.getTextInBufferRange(changeRange);
      buf.setTextInRange(changeRange, '');
      caret = buf.positionForCharacterIndex(start);
      this.editor.setSelectedBufferRange(new Range(caret, caret));
      insertSnippet(preprocessSnippet(value), this.editor);
      this._saveSelection(utils.splitByLines(value).length - utils.splitByLines(oldValue).length);
      return value;
    },
    getGrammar: function() {
      return this.editor.getGrammar().name.toLowerCase();
    },
    getSyntax: function() {
      var embedded, m, syntax;
      syntax = this.getGrammar().split(' ')[0];
      console.log('pre', syntax);
      if (/\b(javascript|jsx)\b/.test(syntax)) {
        syntax = this.getCurrentScope().some(function(scope) {
          return /\bstring\b/.test(scope);
        }) ? 'html' : 'jsx';
      } else if (!resources.hasSyntax(syntax)) {
        syntax = "html";
      }
      if (syntax === 'html') {
        embedded = this.getCurrentScope().filter(function(s) {
          return /\.embedded\./.test(s);
        }).pop();
        if (embedded) {
          m = embedded.match(/source\.(.+?)\.embedded/);
          if (m) {
            syntax = m[1];
          }
        }
      }
      console.log(syntax);
      return syntax;
    },
    getCurrentScope: function() {
      var range;
      range = this._selection.bufferRanges[this._selection.index];
      return this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
    },
    getProfileName: function() {
      if (this.getCurrentScope().some(function(scope) {
        return /\bstring\.quoted\b/.test(scope);
      })) {
        return 'line';
      } else {
        return 'html';
      }
    },
    getFilePath: function() {
      return this.editor.buffer.file.path;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9lbW1ldC9saWIvZWRpdG9yLXByb3h5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnSUFBQTs7QUFBQSxFQUFBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUFSLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQWlCLE9BQUEsQ0FBUSxNQUFSLENBRGpCLENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQWMsT0FBQSxDQUFRLE9BQVIsQ0FIZCxDQUFBOztBQUFBLEVBSUEsS0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUixDQUpkLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQWMsT0FBQSxDQUFRLDJCQUFSLENBTGQsQ0FBQTs7QUFBQSxFQU1BLFNBQUEsR0FBYyxPQUFBLENBQVEsNEJBQVIsQ0FOZCxDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUixDQVBkLENBQUE7O0FBQUEsRUFTQSxhQUFBLEdBQWdCLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNkLFFBQUEsMEJBQUE7OzthQUFzRCxDQUFFLE1BQXhELENBQStELE9BQS9ELEVBQXdFLE1BQXhFOztLQUFBO1dBR0EsTUFBTSxDQUFDLGdCQUFQLDRHQUFnRixDQUFFLGFBQXhELENBQXNFLE1BQXRFLENBQThFLENBQUEsQ0FBQSxvQkFKMUY7RUFBQSxDQVRoQixDQUFBOztBQUFBLEVBZUEsU0FBQSxHQUFZLFNBQUMsR0FBRCxHQUFBO1dBQ1YsR0FDRSxDQUFDLE9BREgsQ0FDVyxLQURYLEVBQ2tCLEtBRGxCLENBRUUsQ0FBQyxPQUZILENBRVcsS0FGWCxFQUVrQixLQUZsQixDQUdFLENBQUMsT0FISCxDQUdXLEtBSFgsRUFHa0IsS0FIbEIs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

//# sourceURL=/Users/kswedberg/.atom/packages/emmet/lib/editor-proxy.coffee
