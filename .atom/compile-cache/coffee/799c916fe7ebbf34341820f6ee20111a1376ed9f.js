(function() {
  var Aligner, Range, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Range = require('atom').Range;

  _ = require('lodash');

  module.exports = Aligner = (function() {
    function Aligner(editor, spaceChars, matcher, addSpacePostfix) {
      this.editor = editor;
      this.spaceChars = spaceChars;
      this.matcher = matcher;
      this.addSpacePostfix = addSpacePostfix;
      this.align = __bind(this.align, this);
      this.__computeRows = __bind(this.__computeRows, this);
      this.__computeLength = __bind(this.__computeLength, this);
      this.__generateAlignmentList = __bind(this.__generateAlignmentList, this);
      this.__getRows = __bind(this.__getRows, this);
      this.rows = [];
      this.alignments = [];
    }

    Aligner.prototype.__getRows = function() {
      var allCursors, cursor, cursors, l, o, range, ranges, row, rowNums, t, _i, _j, _k, _len, _len1, _len2;
      rowNums = [];
      allCursors = [];
      cursors = _.filter(this.editor.getCursors(), function(cursor) {
        var row;
        allCursors.push(cursor);
        row = cursor.getBufferRow();
        if (cursor.visible && !_.contains(rowNums, row)) {
          rowNums.push(row);
          return true;
        }
      });
      if (cursors.length > 1) {
        this.mode = "cursor";
        for (_i = 0, _len = cursors.length; _i < _len; _i++) {
          cursor = cursors[_i];
          row = cursor.getBufferRow();
          t = this.editor.lineTextForBufferRow(row);
          l = this.__computeLength(t.substring(0, cursor.getBufferColumn()));
          o = {
            text: t,
            length: t.length,
            row: row,
            column: l,
            virtualColumn: cursor.getBufferColumn()
          };
          this.rows.push(o);
        }
      } else {
        ranges = this.editor.getSelectedBufferRanges();
        for (_j = 0, _len1 = ranges.length; _j < _len1; _j++) {
          range = ranges[_j];
          rowNums = rowNums.concat(range.getRows());
          if (range.end.column === 0) {
            rowNums.pop();
          }
        }
        for (_k = 0, _len2 = rowNums.length; _k < _len2; _k++) {
          row = rowNums[_k];
          o = {
            text: this.editor.lineTextForBufferRow(row),
            length: this.editor.lineTextForBufferRow(row).length,
            row: row
          };
          this.rows.push(o);
        }
        this.mode = "align";
      }
      if (this.mode !== "cursor") {
        return this.rows.forEach(function(o) {
          var firstCharIdx;
          t = o.text.replace(/\s/g, '');
          if (t.length > 0) {
            firstCharIdx = o.text.indexOf(t.charAt(0));
            return o.text = o.text.substr(0, firstCharIdx) + o.text.substring(firstCharIdx).replace(/\ {2,}/g, ' ');
          }
        });
      }
    };

    Aligner.prototype.__getAllIndexes = function(string, val, indexes) {
      var found, i;
      found = [];
      i = 0;
      while (true) {
        i = string.indexOf(val, i);
        if (i !== -1 && !_.some(indexes, {
          index: i
        })) {
          found.push({
            found: val,
            index: i
          });
        }
        if (i === -1) {
          break;
        }
        i++;
      }
      return found;
    };

    Aligner.prototype.__generateAlignmentList = function() {
      if (this.mode === "cursor") {
        return _.forEach(this.rows, (function(_this) {
          return function(o) {
            var part;
            part = o.text.substring(o.virtualColumn);
            _.forEach(_this.spaceChars, function(char) {
              var idx;
              idx = part.indexOf(char);
              if (idx === 0 && o.text.charAt(o.virtualColumn) !== " ") {
                o.addSpacePrefix = true;
                o.spaceCharLength = char.length;
                return false;
              }
            });
          };
        })(this));
      } else {
        _.forEach(this.rows, (function(_this) {
          return function(o) {
            _.forEach(_this.matcher, function(possibleMatcher) {
              return _this.alignments = _this.alignments.concat(_this.__getAllIndexes(o.text, possibleMatcher, _this.alignments));
            });
            if (_this.alignments.length > 0) {
              return false;
            } else {
              return true;
            }
          };
        })(this));
        this.alignments = this.alignments.sort(function(a, b) {
          return a.index - b.index;
        });
        this.alignments = _.pluck(this.alignments, "found");
      }
    };

    Aligner.prototype.__computeLength = function(s) {
      var char, diff, idx, tabLength, tabs, _i, _len;
      diff = tabs = idx = 0;
      tabLength = this.editor.getTabLength();
      for (_i = 0, _len = s.length; _i < _len; _i++) {
        char = s[_i];
        if (char === "\t") {
          diff += tabLength - (idx % tabLength);
          idx += tabLength - (idx % tabLength);
          tabs++;
        } else {
          idx++;
        }
      }
      return s.length + diff - tabs;
    };

    Aligner.prototype.__computeRows = function() {
      var addSpacePrefix, idx, matched, max, possibleMatcher;
      max = 0;
      if (this.mode === "align" || this.mode === "break") {
        matched = null;
        idx = -1;
        possibleMatcher = this.alignments.shift();
        addSpacePrefix = this.spaceChars.indexOf(possibleMatcher) > -1;
        this.rows.forEach((function(_this) {
          return function(o) {
            var backslash, blankPos, c, charFound, doubleQuotationMark, found, l, len, line, next, quotationMark, splitString;
            o.splited = null;
            if (!o.done) {
              line = o.text;
              if (line.indexOf(possibleMatcher, o.nextPos) !== -1) {
                matched = possibleMatcher;
                idx = line.indexOf(matched, o.nextPos);
                len = matched.length;
                if (_this.mode === "break") {
                  idx += len - 1;
                  c = "";
                  blankPos = -1;
                  quotationMark = doubleQuotationMark = 0;
                  backslash = charFound = false;
                  while (true) {
                    if (c === void 0) {
                      break;
                    }
                    c = line[++idx];
                    if (c === "'" && !backslash) {
                      quotationMark++;
                    }
                    if (c === '"' && !backslash) {
                      doubleQuotationMark++;
                    }
                    backslash = c === "\\" && !backslash ? true : false;
                    charFound = c !== " " && !charFound ? true : charFound;
                    if (c === " " && quotationMark % 2 === 0 && doubleQuotationMark % 2 === 0 && charFound) {
                      blankPos = idx;
                      break;
                    }
                  }
                  idx = blankPos;
                }
                next = _this.mode === "break" ? 1 : len;
                if (idx !== -1) {
                  splitString = [line.substring(0, idx), line.substring(idx + next)];
                  o.splited = splitString;
                  l = _this.__computeLength(splitString[0]);
                  if (max <= l) {
                    max = l;
                    if (l > 0 && addSpacePrefix && splitString[0].charAt(splitString[0].length - 1) !== " ") {
                      max++;
                    }
                  }
                }
              }
              found = false;
              _.forEach(_this.alignments, function(nextPossibleMatcher) {
                if (line.indexOf(nextPossibleMatcher, idx + len) !== -1) {
                  found = true;
                  return false;
                }
              });
              o.stop = !found;
            }
          };
        })(this));
        if (max >= 0) {
          if (max > 0) {
            max++;
          }
          this.rows.forEach((function(_this) {
            return function(o) {
              var diff, splitString;
              if (!o.done && o.splited && matched) {
                splitString = o.splited;
                diff = max - _this.__computeLength(splitString[0]);
                if (diff > 0) {
                  splitString[0] = splitString[0] + Array(diff).join(' ');
                }
                if (_this.addSpacePostfix && addSpacePrefix) {
                  splitString[1] = " " + splitString[1].trim();
                }
                if (_this.mode === "break") {
                  _.forEach(splitString, function(s, i) {
                    return splitString[i] = s.trim();
                  });
                  o.text = splitString.join("\n");
                } else {
                  o.text = splitString.join(matched);
                }
                o.done = o.stop;
                o.nextPos = splitString[0].length + matched.length;
              }
            };
          })(this));
        }
        return this.alignments.length > 0;
      } else {
        this.rows.forEach(function(o) {
          var part;
          if (max <= o.column) {
            max = o.column;
            part = o.text.substring(0, o.virtualColumn);
            if (part.length > 0 && o.addSpacePrefix && part.charAt(part.length - 1) !== " ") {
              max++;
            }
          }
        });
        max++;
        this.rows.forEach((function(_this) {
          return function(o) {
            var diff, line, splitString;
            line = o.text;
            splitString = [line.substring(0, o.virtualColumn), line.substring(o.virtualColumn)];
            diff = max - _this.__computeLength(splitString[0]);
            if (diff > 0) {
              splitString[0] = splitString[0] + Array(diff).join(' ');
            }
            if (o.spaceCharLength == null) {
              o.spaceCharLength = 0;
            }
            splitString[1] = splitString[1].substring(0, o.spaceCharLength) + splitString[1].substr(o.spaceCharLength).trim();
            if (_this.addSpacePostfix && o.addSpacePrefix) {
              splitString[1] = splitString[1].substring(0, o.spaceCharLength) + " " + splitString[1].substr(o.spaceCharLength);
            }
            o.text = splitString.join("");
          };
        })(this));
        return false;
      }
    };

    Aligner.prototype.align = function(multiple) {
      var cont;
      this.__getRows();
      this.__generateAlignmentList();
      if (this.rows.length === 1 && multiple) {
        this.mode = "break";
      }
      if (multiple || this.mode === "break") {
        while (true) {
          cont = this.__computeRows();
          if (!cont) {
            break;
          }
        }
      } else {
        this.__computeRows();
      }
      return this.rows.forEach((function(_this) {
        return function(o) {
          return _this.editor.setTextInBufferRange([[o.row, 0], [o.row, o.length]], o.text);
        };
      })(this));
    };

    return Aligner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWFsaWdubWVudC9saWIvYWxpZ25lci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUJBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FGSixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDVTtBQUVXLElBQUEsaUJBQUUsTUFBRixFQUFXLFVBQVgsRUFBd0IsT0FBeEIsRUFBa0MsZUFBbEMsR0FBQTtBQUNULE1BRFUsSUFBQyxDQUFBLFNBQUEsTUFDWCxDQUFBO0FBQUEsTUFEbUIsSUFBQyxDQUFBLGFBQUEsVUFDcEIsQ0FBQTtBQUFBLE1BRGdDLElBQUMsQ0FBQSxVQUFBLE9BQ2pDLENBQUE7QUFBQSxNQUQwQyxJQUFDLENBQUEsa0JBQUEsZUFDM0MsQ0FBQTtBQUFBLDJDQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLCtFQUFBLENBQUE7QUFBQSxtREFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLEVBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxFQURkLENBRFM7SUFBQSxDQUFiOztBQUFBLHNCQUtBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDUCxVQUFBLGlHQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQUEsTUFDQSxVQUFBLEdBQWEsRUFEYixDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBQSxDQUFULEVBQStCLFNBQUMs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

//# sourceURL=/Users/kswedberg/.atom/packages/atom-alignment/lib/aligner.coffee
