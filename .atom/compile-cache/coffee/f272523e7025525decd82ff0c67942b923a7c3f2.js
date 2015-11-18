(function() {
  "use strict";
  var TwoDimArray, WrappedDomTree, curHash, hashTo,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  TwoDimArray = require('./two-dim-array');

  curHash = 0;

  hashTo = {};

  module.exports = WrappedDomTree = (function() {
    function WrappedDomTree(dom, clone, rep) {
      if (clone) {
        this.shownTree = new WrappedDomTree(dom, false, this);
        this.dom = dom.cloneNode(true);
      } else {
        this.dom = dom;
        this.rep = rep;
      }
      this.clone = clone;
      this.hash = curHash++;
      hashTo[this.hash] = this;
      this.isText = dom.nodeType === 3;
      this.tagName = dom.tagName;
      this.className = dom.className;
      this.textData = dom.data;
      this.diffHash = {};
      if (this.isText) {
        this.size = 1;
      } else {
        rep = this.rep;
        this.children = [].map.call(this.dom.childNodes, function(dom, ind) {
          return new WrappedDomTree(dom, false, rep ? rep.children[ind] : null);
        });
        this.size = this.children.length ? this.children.reduce((function(prev, cur) {
          return prev + cur.size;
        }), 0) : 0;
        if (!this.size) {
          this.size = 1;
        }
      }
    }

    WrappedDomTree.prototype.diffTo = function(otherTree) {
      var diff, indexShift, inserted, last, lastElmDeleted, lastElmInserted, lastOp, op, operations, possibleReplace, r, score, _fn, _i, _len, _ref;
      if (this.clone) {
        return this.shownTree.diffTo(otherTree);
      }
      diff = this.rep.diff(otherTree);
      score = diff.score;
      operations = diff.operations;
      indexShift = 0;
      inserted = [];
      _ref = [], last = _ref[0], possibleReplace = _ref[1], r = _ref[2], lastOp = _ref[3], lastElmDeleted = _ref[4], lastElmInserted = _ref[5];
      if (operations) {
        if (operations instanceof Array) {
          _fn = (function(_this) {
            return function(op) {
              var possibleLastDeleted, re;
              if (op.type === "d") {
                possibleLastDeleted = _this.children[op.tree + indexShift].dom;
                r = _this.remove(op.tree + indexShift);
                _this.rep.remove(op.tree + indexShift);
                if (!last || last.nextSibling === r || last === r) {
                  last = r;
                  if (last && lastOp && op.tree === lastOp.pos) {
                    lastElmDeleted = possibleLastDeleted;
                  } else {
                    lastElmDeleted = null;
                    lastElmInserted = null;
                  }
                  lastOp = op;
                }
                indexShift--;
              } else if (op.type === "i") {
                _this.rep.insert(op.pos + indexShift, otherTree.children[op.otherTree]);
                r = _this.insert(op.pos + indexShift, otherTree.children[op.otherTree], _this.rep.children[op.pos + indexShift]);
                inserted.push(r);
                if (!last || last.nextSibling === r) {
                  last = r;
                  lastOp = op;
                  lastElmInserted = r;
                }
                indexShift++;
              } else {
                re = _this.children[op.tree + indexShift].diffTo(otherTree.children[op.otherTree]);
                if (!last || (last.nextSibling === _this.children[op.tree + indexShift].dom && re.last)) {
                  last = re.last;
                  if (re.possibleReplace) {
                    lastElmInserted = re.possibleReplace.cur;
                    lastElmDeleted = re.possibleReplace.prev;
                  }
                  lastOp = op;
                }
                inserted = inserted.concat(re.inserted);
              }
            };
          })(this);
          for (_i = 0, _len = operations.length; _i < _len; _i++) {
            op = operations[_i];
            _fn(op);
          }
        } else {
          console.log(operations);
          throw new Error("invalid operations");
        }
      }
      if (lastOp && lastOp.type !== 'i' && lastElmInserted && lastElmDeleted) {
        possibleReplace = {
          cur: lastElmInserted,
          prev: lastElmDeleted
        };
      }
      return {
        last: last,
        inserted: inserted,
        possibleReplace: possibleReplace
      };
    };

    WrappedDomTree.prototype.insert = function(i, tree, rep) {
      var ctree, dom;
      dom = tree.dom.cloneNode(true);
      if (i === this.dom.childNodes.length) {
        this.dom.appendChild(dom);
      } else {
        this.dom.insertBefore(dom, this.dom.childNodes[i]);
      }
      ctree = new WrappedDomTree(dom, false, rep);
      this.children.splice(i, 0, ctree);
      return this.dom.childNodes[i];
    };

    WrappedDomTree.prototype.remove = function(i) {
      this.dom.removeChild(this.dom.childNodes[i]);
      this.children[i].removeSelf();
      this.children.splice(i, 1);
      return this.dom.childNodes[i - 1];
    };

    WrappedDomTree.prototype.diff = function(otherTree, tmax) {
      var cc, cr, cur, dp, getScore, i, key, offset, op, operations, p, pc, pr, prev, rc, score, sum, _i, _j, _ref, _ref1;
      if (this.equalTo(otherTree)) {
        return {
          score: 0,
          operations: null
        };
      }
      if (this.cannotReplaceWith(otherTree)) {
        return {
          score: 1 / 0,
          operations: null
        };
      }
      key = otherTree.hash;
      if (__indexOf.call(this.diffHash, key) >= 0) {
        return this.diffHash[key];
      }
      if (tmax === void 0) {
        tmax = 100000;
      }
      if (tmax <= 0) {
        return 0;
      }
      offset = 0;
      while (offset < this.children.length && offset < otherTree.children.length && this.children[offset].equalTo(otherTree.children[offset])) {
        offset++;
      }
      dp = new TwoDimArray(this.children.length + 1 - offset, otherTree.children.length + 1 - offset);
      p = new TwoDimArray(this.children.length + 1 - offset, otherTree.children.length + 1 - offset);
      dp.set(0, 0, 0);
      sum = 0;
      if (otherTree.children.length - offset > 1) {
        for (i = _i = 1, _ref = otherTree.children.length - offset - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          dp.set(0, i, sum);
          p.set(0, i, i - 1);
          sum += otherTree.children[i + offset].size;
        }
      }
      if (otherTree.children.length - offset > 0) {
        dp.set(0, otherTree.children.length - offset, sum);
        p.set(0, otherTree.children.length - offset, otherTree.children.length - 1 - offset);
      }
      sum = 0;
      if (this.children.length - offset > 1) {
        for (i = _j = 1, _ref1 = this.children.length - offset - 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
          dp.set(i, 0, sum);
          p.set(i, 0, (i - 1) * p.col);
          sum += this.children[i + offset].size;
        }
      }
      if (this.children.length - offset) {
        dp.set(this.children.length - offset, 0, sum);
        p.set(this.children.length - offset, 0, (this.children.length - 1 - offset) * p.col);
      }
      getScore = (function(_this) {
        return function(i, j, max) {
          var bound, force, other, prev, subdiff, val;
          if (dp.get(i, j) !== void 0) {
            return dp.get(i, j);
          }
          if (max === void 0) {
            max = 1 / 0;
          }
          if (max <= 0) {
            return 1 / 0;
          }
          val = max;
          bound = max;
          subdiff = _this.children[i - 1 + offset].diff(otherTree.children[j - 1 + offset], bound).score;
          force = false;
          if (subdiff < bound && subdiff + 1 < _this.children[i - 1 + offset].size + otherTree.children[j - 1 + offset].size) {
            force = true;
          }
          val = getScore(i - 1, j - 1, bound - subdiff) + subdiff;
          prev = p.getInd(i - 1, j - 1);
          if (!force) {
            other = getScore(i - 1, j, Math.min(val, max) - _this.children[i - 1 + offset].size) + _this.children[i - 1 + offset].size;
            if (other < val) {
              prev = p.getInd(i - 1, j);
              val = other;
            }
            other = getScore(i, j - 1, Math.min(val, max) - otherTree.children[j - 1 + offset].size) + otherTree.children[j - 1 + offset].size;
            if (other < val) {
              prev = p.getInd(i, j - 1);
              val = other;
            }
          }
          if (val >= max) {
            val = 1 / 0;
          }
          dp.set(i, j, val);
          p.set(i, j, prev);
          return val;
        };
      })(this);
      score = getScore(this.children.length - offset, otherTree.children.length - offset, tmax);
      operations = [];
      cur = p.getInd(this.children.length - offset, otherTree.children.length - offset);
      cr = this.children.length - 1 - offset;
      cc = otherTree.children.length - 1 - offset;
      while (p.rawGet(cur) !== void 0) {
        prev = p.rawGet(cur);
        rc = p.get2DInd(prev);
        pr = rc.r - 1;
        pc = rc.c - 1;
        if (pr === cr) {
          operations.unshift({
            type: "i",
            otherTree: cc + offset,
            pos: cr + 1 + offset
          });
        } else if (pc === cc) {
          operations.unshift({
            type: "d",
            tree: cr + offset
          });
        } else {
          op = this.children[cr + offset].diff(otherTree.children[cc + offset]).operations;
          if (op && op.length) {
            operations.unshift({
              type: "r",
              tree: cr + offset,
              otherTree: cc + offset
            });
          }
        }
        cur = prev;
        cr = pr;
        cc = pc;
      }
      this.diffHash[key] = {
        score: score,
        operations: operations
      };
      return this.diffHash[key];
    };

    WrappedDomTree.prototype.equalTo = function(otherTree) {
      return this.dom.isEqualNode(otherTree.dom);
    };

    WrappedDomTree.prototype.cannotReplaceWith = function(otherTree) {
      return this.isText || otherTree.isText || this.tagName !== otherTree.tagName || this.className !== otherTree.className || this.className === "math" || this.className === "atom-text-editor" || this.tagName === "A" || (this.tagName === "IMG" && !this.dom.isEqualNode(otherTree.dom));
    };

    WrappedDomTree.prototype.getContent = function() {
      if (this.dom.outerHTML) {
        return this.dom.outerHTML;
      } else {
        return this.textData;
      }
    };

    WrappedDomTree.prototype.removeSelf = function() {
      hashTo[this.hash] = null;
      this.children && this.children.forEach(function(c) {
        return c.removeSelf();
      });
    };

    return WrappedDomTree;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvbGliL3dyYXBwZWQtZG9tLXRyZWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBc0JBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGlCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxDQUpWLENBQUE7O0FBQUEsRUFLQSxNQUFBLEdBQVUsRUFMVixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFLUixJQUFBLHdCQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWEsR0FBYixHQUFBO0FBQ1gsTUFBQSxJQUFHLEtBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxTQUFELEdBQWtCLElBQUEsY0FBQSxDQUFlLEdBQWYsRUFBb0IsS0FBcEIsRUFBMkIsSUFBM0IsQ0FBbEIsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLEdBQUQsR0FBYyxHQUFHLENBQUMsU0FBSixDQUFjLElBQWQsQ0FEZCxDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxHQUFQLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxHQUFELEdBQU8sR0FEUCxDQUpGO09BQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxLQUFELEdBQWdCLEtBUGhCLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxJQUFELEdBQWdCLE9BQUEsRUFSaEIsQ0FBQTtBQUFBLE1BU0EsTUFBTyxDQUFBLElBQUMsQ0FBQSxJQUFELENBQVAsR0FBZ0IsSUFUaEIsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLE1BQUQsR0FBZ0IsR0FBRyxDQUFDLFFBQUosS0FBZ0IsQ0FWaEMs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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/lib/wrapped-dom-tree.coffee
