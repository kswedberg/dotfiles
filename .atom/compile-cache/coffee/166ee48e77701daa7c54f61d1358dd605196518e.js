(function() {
  var JavascriptSnippetsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = JavascriptSnippetsView = (function(_super) {
    __extends(JavascriptSnippetsView, _super);

    function JavascriptSnippetsView() {
      return JavascriptSnippetsView.__super__.constructor.apply(this, arguments);
    }

    JavascriptSnippetsView.content = function() {
      return this.div({
        "class": 'javascript-snippets overlay from-top'
      }, (function(_this) {
        return function() {
          return _this.div("The JavascriptSnippets package is Alive! It's ALIVE!", {
            "class": "message"
          });
        };
      })(this));
    };

    JavascriptSnippetsView.prototype.initialize = function(serializeState) {
      return atom.workspaceView.command("javascript-snippets:toggle", (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    };

    JavascriptSnippetsView.prototype.serialize = function() {};

    JavascriptSnippetsView.prototype.destroy = function() {
      return this.detach();
    };

    JavascriptSnippetsView.prototype.toggle = function() {
      console.log("JavascriptSnippetsView was toggled!");
      if (this.hasParent()) {
        return this.detach();
      } else {
        return atom.workspaceView.append(this);
      }
    };

    return JavascriptSnippetsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDZDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLHNCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxzQ0FBUDtPQUFMLEVBQW9ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2xELEtBQUMsQ0FBQSxHQUFELENBQUssc0RBQUwsRUFBNkQ7QUFBQSxZQUFBLE9BQUEsRUFBTyxTQUFQO1dBQTdELEVBRGtEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEQsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxxQ0FJQSxVQUFBLEdBQVksU0FBQyxjQUFELEdBQUE7YUFDVixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLDRCQUEzQixFQUF5RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpELEVBRFU7SUFBQSxDQUpaLENBQUE7O0FBQUEscUNBUUEsU0FBQSxHQUFXLFNBQUEsR0FBQSxDQVJYLENBQUE7O0FBQUEscUNBV0EsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxNQUFELENBQUEsRUFETztJQUFBLENBWFQsQ0FBQTs7QUFBQSxxQ0FjQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHFDQUFaLENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFuQixDQUEwQixJQUExQixFQUhGO09BRk07SUFBQSxDQWRSLENBQUE7O2tDQUFBOztLQURtQyxLQUhyQyxDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/kswedberg/.atom/packages/javascript-snippets/lib/javascript-snippets-view.coffee