(function() {
  var BlameGutterView, CompositeDisposable, blame, getCommit, getCommitLink, gravatar, open,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  blame = require('./utils/blame');

  getCommit = require('./utils/get-commit');

  getCommitLink = require('./utils/get-commit-link');

  gravatar = require('gravatar');

  open = require('open');

  CompositeDisposable = require('atom').CompositeDisposable;

  BlameGutterView = (function() {
    function BlameGutterView(state, editor) {
      this.state = state;
      this.editor = editor;
      this.resizeMove = __bind(this.resizeMove, this);
      this.resizeStopped = __bind(this.resizeStopped, this);
      this.resizeStarted = __bind(this.resizeStarted, this);
      this.state.width = atom.config.get('blame.defaultWidth');
      this.setGutterWidth(this.state.width);
      this.colors = {};
      this.gutter = this.editor.addGutter({
        name: 'blame'
      });
      this.markers = [];
      this.setVisible(true);
    }

    BlameGutterView.prototype.toggleVisible = function() {
      return this.setVisible(!this.visible);
    };

    BlameGutterView.prototype.setVisible = function(visible) {
      var _ref;
      this.visible = visible;
      if (this.editor.isModified()) {
        this.visible = false;
      }
      if (this.visible) {
        this.update();
        if (this.disposables == null) {
          this.disposables = new CompositeDisposable;
        }
        this.disposables.add(this.editor.onDidSave((function(_this) {
          return function() {
            return _this.update();
          };
        })(this)));
        return this.gutter.show();
      } else {
        this.gutter.hide();
        if ((_ref = this.disposables) != null) {
          _ref.dispose();
        }
        this.disposables = null;
        return this.removeAllMarkers();
      }
    };

    BlameGutterView.prototype.update = function() {
      return blame(this.editor.getPath(), (function(_this) {
        return function(result) {
          var blameLines, commitColor, commitCount, dateStr, hash, idx, key, lastHash, line, lineStr, rowCls, _results;
          _this.removeAllMarkers();
          blameLines = [];
          lastHash = null;
          commitCount = 0;
          commitColor = null;
          _results = [];
          for (key in result) {
            line = result[key];
            idx = Number(key) - 1;
            hash = line.rev.replace(/\s.*/, '');
            if (lastHash !== hash) {
              dateStr = _this.formateDate(line.date);
              if (_this.isCommited(hash)) {
                lineStr = "" + hash + " " + dateStr + " " + line.author;
              } else {
                lineStr = "" + line.author;
              }
              if (commitCount++ % 2 === 0) {
                rowCls = 'blame-even';
              } else {
                rowCls = 'blame-odd';
              }
            } else {
              lineStr = '';
            }
            lastHash = hash;
            _results.push(_this.addMarker(idx, hash, rowCls, lineStr));
          }
          return _results;
        };
      })(this));
    };

    BlameGutterView.prototype.linkClicked = function(hash) {
      return getCommitLink(this.editor.getPath(), hash.replace(/^[\^]/, ''), function(link) {
        if (link) {
          return open(link);
        } else {
          return atom.notifications.addInfo("Unknown url.");
        }
      });
    };

    BlameGutterView.prototype.copyClicked = function(event) {
      var hash;
      hash = event.path[0].getAttribute('data-hash');
      return atom.clipboard.write(hash);
    };

    BlameGutterView.prototype.formateDate = function(date) {
      var dd, mm, yyyy;
      date = new Date(date);
      yyyy = date.getFullYear();
      mm = date.getMonth() + 1;
      if (mm < 10) {
        mm = "0" + mm;
      }
      dd = date.getDate();
      if (dd < 10) {
        dd = "0" + dd;
      }
      return "" + yyyy + "-" + mm + "-" + dd;
    };

    BlameGutterView.prototype.addMarker = function(lineNo, hash, rowCls, lineStr) {
      var item, marker;
      item = this.markerInnerDiv(rowCls);
      if (lineStr.length > 0) {
        if (this.isCommited(hash)) {
          item.appendChild(this.copySpan(hash));
          item.appendChild(this.linkSpan(hash));
        }
        item.appendChild(this.lineSpan(lineStr, hash));
        if (this.isCommited(hash)) {
          item.addEventListener('mouseenter', (function(_this) {
            return function() {
              return _this.showCommit(item, hash);
            };
          })(this));
        }
      }
      item.appendChild(this.resizeHandleDiv());
      marker = this.editor.markBufferRange([[lineNo, 0], [lineNo, 0]]);
      this.editor.decorateMarker(marker, {
        type: 'gutter',
        gutterName: 'blame',
        "class": 'blame-gutter',
        item: item
      });
      return this.markers.push(marker);
    };

    BlameGutterView.prototype.markerInnerDiv = function(rowCls) {
      var item;
      item = document.createElement('div');
      item.classList.add('blame-gutter-inner');
      item.classList.add(rowCls);
      return item;
    };

    BlameGutterView.prototype.resizeHandleDiv = function() {
      var resizeHandle;
      resizeHandle = document.createElement('div');
      resizeHandle.addEventListener('mousedown', this.resizeStarted);
      resizeHandle.classList.add('blame-gutter-handle');
      return resizeHandle;
    };

    BlameGutterView.prototype.lineSpan = function(str, hash) {
      var span;
      span = document.createElement('span');
      span.innerHTML = str;
      return span;
    };

    BlameGutterView.prototype.copySpan = function(hash) {
      var span;
      span = document.createElement('span');
      span.setAttribute('data-hash', hash);
      span.classList.add('icon');
      span.classList.add('icon-copy');
      span.addEventListener('click', this.copyClicked);
      return span;
    };

    BlameGutterView.prototype.linkSpan = function(hash) {
      var span;
      span = document.createElement('span');
      span.setAttribute('data-hash', hash);
      span.classList.add('icon');
      span.classList.add('icon-link');
      span.addEventListener('click', (function(_this) {
        return function() {
          return _this.linkClicked(hash);
        };
      })(this));
      return span;
    };

    BlameGutterView.prototype.removeAllMarkers = function() {
      var marker, _i, _len, _ref;
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.destroy();
      }
      return this.markers = [];
    };

    BlameGutterView.prototype.resizeStarted = function(e) {
      document.addEventListener('mousemove', this.resizeMove);
      document.addEventListener('mouseup', this.resizeStopped);
      this.resizeStartedAtX = e.pageX;
      return this.resizeWidth = this.state.width;
    };

    BlameGutterView.prototype.resizeStopped = function(e) {
      document.removeEventListener('mousemove', this.resizeMove);
      document.removeEventListener('mouseup', this.resizeStopped);
      e.stopPropagation();
      return e.preventDefault();
    };

    BlameGutterView.prototype.gutterStyle = function() {
      var sheet;
      sheet = document.createElement('style');
      sheet.type = 'text/css';
      sheet.id = 'blame-gutter-style';
      return sheet;
    };

    BlameGutterView.prototype.resizeMove = function(e) {
      var diff;
      diff = e.pageX - this.resizeStartedAtX;
      this.setGutterWidth(this.resizeWidth + diff);
      e.stopPropagation();
      return e.preventDefault();
    };

    BlameGutterView.prototype.setGutterWidth = function(width) {
      var sheet;
      this.state.width = Math.max(50, Math.min(width, 500));
      sheet = document.getElementById('blame-gutter-style');
      if (!sheet) {
        sheet = this.gutterStyle();
        document.head.appendChild(sheet);
      }
      return sheet.innerHTML = "atom-text-editor::shadow .gutter[gutter-name=\"blame\"] {\n  width: " + this.state.width + "px;\n}";
    };

    BlameGutterView.prototype.isCommited = function(hash) {
      return !/^[0]+$/.test(hash);
    };

    BlameGutterView.prototype.showCommit = function(item, hash) {
      var msgItem;
      if (!item.getAttribute('data-has-tooltip')) {
        item.setAttribute('data-has-tooltip', true);
        msgItem = document.createElement('div');
        msgItem.classList.add('blame-tooltip');
        return getCommit(this.editor.getPath(), hash.replace(/^[\^]/, ''), (function(_this) {
          return function(msg) {
            var avatar;
            avatar = gravatar.url(msg.email, {
              s: 80
            });
            _this.disposables.add(atom.tooltips.add(item, {
              title: "<div class=\"blame-tooltip\">\n  <div class=\"head\">\n    <img class=\"avatar\" src=\"http:" + avatar + "\"/>\n    <div class=\"subject\">" + msg.subject + "</div>\n    <div class=\"author\">" + msg.author + "</div>\n  </div>\n  <div class=\"body\">" + msg.message + "</div>\n</div>"
            }));
            return _this.triggerEvent(item, 'mouseenter');
          };
        })(this));
      }
    };

    BlameGutterView.prototype.triggerEvent = function(element, eventName) {
      var evObj;
      evObj = document.createEvent('Events');
      evObj.initEvent(eventName, true, false);
      return element.dispatchEvent(evObj);
    };

    BlameGutterView.prototype.dispose = function() {
      var _ref;
      this.gutter.destroy();
      return (_ref = this.disposables) != null ? _ref.dispose() : void 0;
    };

    return BlameGutterView;

  })();

  module.exports = BlameGutterView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9ibGFtZS9saWIvYmxhbWUtZ3V0dGVyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFGQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGVBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxvQkFBUixDQURaLENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSx5QkFBUixDQUZoQixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUpQLENBQUE7O0FBQUEsRUFNRSxzQkFBd0IsT0FBQSxDQUFRLE1BQVIsRUFBeEIsbUJBTkYsQ0FBQTs7QUFBQSxFQVFNO0FBRVMsSUFBQSx5QkFBRSxLQUFGLEVBQVUsTUFBVixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsUUFBQSxLQUNiLENBQUE7QUFBQSxNQURvQixJQUFDLENBQUEsU0FBQSxNQUNyQixDQUFBO0FBQUEscURBQUEsQ0FBQTtBQUFBLDJEQUFBLENBQUE7QUFBQSwyREFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLENBQWYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUF2QixDQURBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELEdBQVUsRUFIVixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FB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

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/blame/lib/blame-gutter-view.coffee
