(function() {
  var JquerySnippetsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = JquerySnippetsView = (function(_super) {
    __extends(JquerySnippetsView, _super);

    function JquerySnippetsView() {
      return JquerySnippetsView.__super__.constructor.apply(this, arguments);
    }

    JquerySnippetsView.content = function() {
      return this.div({
        "class": 'jquery-snippets overlay from-top'
      }, (function(_this) {
        return function() {
          return _this.div("The JquerySnippets package is Alive! It's ALIVE!", {
            "class": "message"
          });
        };
      })(this));
    };

    JquerySnippetsView.prototype.initialize = function(serializeState) {
      return atom.commands.add('atom-workspace', 'jquery-snippets:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    };

    JquerySnippetsView.prototype.serialize = function() {};

    JquerySnippetsView.prototype.destroy = function() {
      return this.detach();
    };

    return JquerySnippetsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9qcXVlcnktc25pcHBldHMvbGliL2pxdWVyeS1zbmlwcGV0cy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsa0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGtDQUFQO09BQUwsRUFBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDOUMsS0FBQyxDQUFBLEdBQUQsQ0FBSyxrREFBTCxFQUF5RDtBQUFBLFlBQUEsT0FBQSxFQUFPLFNBQVA7V0FBekQsRUFEOEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLGlDQUlBLFVBQUEsR0FBWSxTQUFDLGNBQUQsR0FBQTthQUNWLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0Msd0JBQXBDLEVBQThELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQsRUFEVTtJQUFBLENBSlosQ0FBQTs7QUFBQSxpQ0FRQSxTQUFBLEdBQVcsU0FBQSxHQUFBLENBUlgsQ0FBQTs7QUFBQSxpQ0FXQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURPO0lBQUEsQ0FYVCxDQUFBOzs4QkFBQTs7S0FEK0IsS0FIakMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/jquery-snippets/lib/jquery-snippets-view.coffee
