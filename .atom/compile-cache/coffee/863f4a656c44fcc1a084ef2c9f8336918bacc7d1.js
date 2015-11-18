(function() {
  var CompositeDisposable, CoveringView, NavigationView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  CoveringView = require('./covering-view').CoveringView;

  NavigationView = (function(_super) {
    __extends(NavigationView, _super);

    function NavigationView() {
      return NavigationView.__super__.constructor.apply(this, arguments);
    }

    NavigationView.content = function(navigator, editor) {
      return this.div({
        "class": 'controls navigation'
      }, (function(_this) {
        return function() {
          _this.text(' ');
          return _this.span({
            "class": 'pull-right'
          }, function() {
            _this.button({
              "class": 'btn btn-xs',
              click: 'up',
              outlet: 'prevBtn'
            }, 'prev');
            return _this.button({
              "class": 'btn btn-xs',
              click: 'down',
              outlet: 'nextBtn'
            }, 'next');
          });
        };
      })(this));
    };

    NavigationView.prototype.initialize = function(navigator, editor) {
      this.navigator = navigator;
      this.subs = new CompositeDisposable;
      NavigationView.__super__.initialize.call(this, editor);
      this.prependKeystroke('merge-conflicts:previous-unresolved', this.prevBtn);
      this.prependKeystroke('merge-conflicts:next-unresolved', this.nextBtn);
      return this.subs.add(this.navigator.conflict.onDidResolveConflict((function(_this) {
        return function() {
          _this.deleteMarker(_this.cover());
          _this.remove();
          return _this.cleanup();
        };
      })(this)));
    };

    NavigationView.prototype.cleanup = function() {
      NavigationView.__super__.cleanup.apply(this, arguments);
      return this.subs.dispose();
    };

    NavigationView.prototype.cover = function() {
      return this.navigator.separatorMarker;
    };

    NavigationView.prototype.up = function() {
      var _ref;
      return this.scrollTo((_ref = this.navigator.previousUnresolved()) != null ? _ref.scrollTarget() : void 0);
    };

    NavigationView.prototype.down = function() {
      var _ref;
      return this.scrollTo((_ref = this.navigator.nextUnresolved()) != null ? _ref.scrollTarget() : void 0);
    };

    NavigationView.prototype.conflict = function() {
      return this.navigator.conflict;
    };

    NavigationView.prototype.toString = function() {
      return "{NavView of: " + (this.conflict()) + "}";
    };

    return NavigationView;

  })(CoveringView);

  module.exports = {
    NavigationView: NavigationView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvbGliL3ZpZXcvbmF2aWdhdGlvbi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxlQUFnQixPQUFBLENBQVEsaUJBQVIsRUFBaEIsWUFERCxDQUFBOztBQUFBLEVBR007QUFFSixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsU0FBRCxFQUFZLE1BQVosR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxxQkFBUDtPQUFMLEVBQW1DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDakMsVUFBQSxLQUFDLENBQUEsSUFBRCxDQUFNLEdBQU4sQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxZQUFQO1dBQU4sRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFlBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGNBQUEsT0FBQSxFQUFPLFlBQVA7QUFBQSxjQUFxQixLQUFBLEVBQU8sSUFBNUI7QUFBQSxjQUFrQyxNQUFBLEVBQVEsU0FBMUM7YUFBUixFQUE2RCxNQUE3RCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGNBQUEsT0FBQSxFQUFPLFlBQVA7QUFBQSxjQUFxQixLQUFBLEVBQU8sTUFBNUI7QUFBQSxjQUFvQyxNQUFBLEVBQVEsU0FBNUM7YUFBUixFQUErRCxNQUEvRCxFQUZ5QjtVQUFBLENBQTNCLEVBRmlDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw2QkFPQSxVQUFBLEdBQVksU0FBRSxTQUFGLEVBQWEsTUFBYixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsWUFBQSxTQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsR0FBQSxDQUFBLG1CQUFSLENBQUE7QUFBQSxNQUVBLCtDQUFNLE1BQU4sQ0FGQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IscUNBQWxCLEVBQXlELElBQUMsQ0FBQSxPQUExRCxDQUpBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixpQ0FBbEIsRUFBcUQsSUFBQyxDQUFBLE9BQXRELENBTEEsQ0FBQTthQU9BLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUMsQ0FBQSxTQUFTLENBQUMsUUFBUSxDQUFDLG9CQUFwQixDQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2pELFVBQUEsS0FBQyxDQUFBLFlBQUQsQ0FBYyxLQUFDLENBQUEsS0FBRCxDQUFBLENBQWQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsTUFBRCxDQUFBLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsT0FBRCxDQUFBLEVBSGlEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0FBVixFQVJVO0lBQUEsQ0FQWixDQUFBOztBQUFBLDZCQW9CQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSw2Q0FBQSxTQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLEVBRk87SUFBQSxDQXBCVCxDQUFBOztBQUFBLDZCQXdCQSxLQUFBLEdBQU8sU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxnQkFBZDtJQUFBLENBeEJQLENBQUE7O0FBQUEsNkJBMEJBLEVBQUEsR0FBSSxTQUFBLEdBQUE7QUFBRyxVQUFBLElBQUE7YUFBQSxJQUFDLENBQUEsUUFBRCw0REFBeUMsQ0FBRSxZQUFqQyxDQUFBLFVBQVYsRUFBSDtJQUFBLENBMUJKLENBQUE7O0FBQUEsNkJBNEJBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFBRyxVQUFBLElBQUE7YUFBQSxJQUFDLENBQUEsUUFBRCx3REFBcUMsQ0FBRSxZQUE3QixDQUFBLFVBQVYsRUFBSDtJQUFBLENBNUJOLENBQUE7O0FBQUEsNkJBOEJBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQWQ7SUFBQSxDQTlCVixDQUFBOztBQUFBLDZCQWdDQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUksZUFBQSxHQUFjLENBQUMsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFELENBQWQsR0FBMkIsSUFBL0I7SUFBQSxDQWhDVixDQUFBOzswQkFBQTs7S0FGMkIsYUFIN0IsQ0FBQTs7QUFBQSxFQXVDQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxjQUFBLEVBQWdCLGNBQWhCO0dBeENGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/lib/view/navigation-view.coffee
