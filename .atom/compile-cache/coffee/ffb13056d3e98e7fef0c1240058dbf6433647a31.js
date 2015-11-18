(function() {
  var CompositeDisposable, CoveringView, SideView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  CoveringView = require('./covering-view').CoveringView;

  SideView = (function(_super) {
    __extends(SideView, _super);

    function SideView() {
      return SideView.__super__.constructor.apply(this, arguments);
    }

    SideView.content = function(side, editor) {
      return this.div({
        "class": "side " + (side.klass()) + " " + side.position + " ui-site-" + (side.site())
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'controls'
          }, function() {
            _this.label({
              "class": 'text-highlight'
            }, side.ref);
            _this.span({
              "class": 'text-subtle'
            }, "// " + (side.description()));
            return _this.span({
              "class": 'pull-right'
            }, function() {
              _this.button({
                "class": 'btn btn-xs inline-block-tight revert',
                click: 'revert',
                outlet: 'revertBtn'
              }, 'Revert');
              return _this.button({
                "class": 'btn btn-xs inline-block-tight',
                click: 'useMe',
                outlet: 'useMeBtn'
              }, 'Use Me');
            });
          });
        };
      })(this));
    };

    SideView.prototype.initialize = function(side, editor) {
      this.side = side;
      this.subs = new CompositeDisposable;
      this.decoration = null;
      SideView.__super__.initialize.call(this, editor);
      this.detectDirty();
      this.prependKeystroke(this.side.eventName(), this.useMeBtn);
      return this.prependKeystroke('merge-conflicts:revert-current', this.revertBtn);
    };

    SideView.prototype.attached = function() {
      SideView.__super__.attached.apply(this, arguments);
      this.decorate();
      return this.subs.add(this.side.conflict.onDidResolveConflict((function(_this) {
        return function() {
          _this.deleteMarker(_this.side.refBannerMarker);
          if (!_this.side.wasChosen()) {
            _this.deleteMarker(_this.side.marker);
          }
          _this.remove();
          return _this.cleanup();
        };
      })(this)));
    };

    SideView.prototype.cleanup = function() {
      SideView.__super__.cleanup.apply(this, arguments);
      return this.subs.dispose();
    };

    SideView.prototype.cover = function() {
      return this.side.refBannerMarker;
    };

    SideView.prototype.decorate = function() {
      var args, _ref;
      if ((_ref = this.decoration) != null) {
        _ref.destroy();
      }
      if (this.side.conflict.isResolved() && !this.side.wasChosen()) {
        return;
      }
      args = {
        type: 'line',
        "class": this.side.lineClass()
      };
      return this.decoration = this.editor.decorateMarker(this.side.marker, args);
    };

    SideView.prototype.conflict = function() {
      return this.side.conflict;
    };

    SideView.prototype.isDirty = function() {
      return this.side.isDirty;
    };

    SideView.prototype.includesCursor = function(cursor) {
      var h, m, p, t, _ref;
      m = this.side.marker;
      _ref = [m.getHeadBufferPosition(), m.getTailBufferPosition()], h = _ref[0], t = _ref[1];
      p = cursor.getBufferPosition();
      return t.isLessThanOrEqual(p) && h.isGreaterThanOrEqual(p);
    };

    SideView.prototype.useMe = function() {
      this.side.resolve();
      return this.decorate();
    };

    SideView.prototype.revert = function() {
      this.editor.setTextInBufferRange(this.side.marker.getBufferRange(), this.side.originalText);
      return this.decorate();
    };

    SideView.prototype.detectDirty = function() {
      var currentText;
      currentText = this.editor.getTextInBufferRange(this.side.marker.getBufferRange());
      this.side.isDirty = currentText !== this.side.originalText;
      this.decorate();
      this.removeClass('dirty');
      if (this.side.isDirty) {
        return this.addClass('dirty');
      }
    };

    SideView.prototype.toString = function() {
      return "{SideView of: " + this.side + "}";
    };

    return SideView;

  })(CoveringView);

  module.exports = {
    SideView: SideView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvbGliL3ZpZXcvc2lkZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxlQUFnQixPQUFBLENBQVEsaUJBQVIsRUFBaEIsWUFERCxDQUFBOztBQUFBLEVBR007QUFFSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBUSxPQUFBLEdBQU0sQ0FBQyxJQUFJLENBQUMsS0FBTCxDQUFBLENBQUQsQ0FBTixHQUFvQixHQUFwQixHQUF1QixJQUFJLENBQUMsUUFBNUIsR0FBcUMsV0FBckMsR0FBK0MsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFBLENBQUQsQ0FBdkQ7T0FBTCxFQUE0RSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUMxRSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sVUFBUDtXQUFMLEVBQXdCLFNBQUEsR0FBQTtBQUN0QixZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU87QUFBQSxjQUFBLE9BQUEsRUFBTyxnQkFBUDthQUFQLEVBQWdDLElBQUksQ0FBQyxHQUFyQyxDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE9BQUEsRUFBTyxhQUFQO2FBQU4sRUFBNkIsS0FBQSxHQUFJLENBQUMsSUFBSSxDQUFDLFdBQUwsQ0FBQSxDQUFE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

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/lib/view/side-view.coffee
