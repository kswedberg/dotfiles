(function() {
  var BlameErrorView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = BlameErrorView = (function(_super) {
    __extends(BlameErrorView, _super);

    function BlameErrorView() {
      this.onOk = __bind(this.onOk, this);
      return BlameErrorView.__super__.constructor.apply(this, arguments);
    }

    BlameErrorView.content = function(params) {
      return this.div({
        "class": 'overlay from-top'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block text-highlight'
          }, 'Git Blame Error:');
          _this.div({
            "class": 'error-message block'
          }, params.message);
          return _this.div({
            "class": 'block'
          }, function() {
            return _this.button({
              "class": 'btn',
              click: 'onOk'
            }, 'Ok');
          });
        };
      })(this));
    };

    BlameErrorView.prototype.onOk = function(event, element) {
      return this.remove();
    };

    BlameErrorView.prototype.attach = function() {
      return atom.workspace.addTopPanel({
        item: this
      });
    };

    return BlameErrorView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3ZpZXdzL2JsYW1lLWVycm9yLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9CQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUoscUNBQUEsQ0FBQTs7Ozs7S0FBQTs7QUFBQSxJQUFBLGNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxNQUFELEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sa0JBQVA7T0FBTCxFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzlCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLHNCQUFQO1dBQUwsRUFBb0Msa0JBQXBDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLHFCQUFQO1dBQUwsRUFBbUMsTUFBTSxDQUFDLE9BQTFDLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFMLEVBQXFCLFNBQUEsR0FBQTttQkFDbkIsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGNBQUEsT0FBQSxFQUFPLEtBQVA7QUFBQSxjQUFjLEtBQUEsRUFBTyxNQUFyQjthQUFSLEVBQXFDLElBQXJDLEVBRG1CO1VBQUEsQ0FBckIsRUFIOEI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDZCQU9BLElBQUEsR0FBTSxTQUFDLEtBQUQsRUFBUSxPQUFSLEdBQUE7YUFDSixJQUFJLENBQUMsTUFBTCxDQUFBLEVBREk7SUFBQSxDQVBOLENBQUE7O0FBQUEsNkJBVUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBZixDQUEyQjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47T0FBM0IsRUFETTtJQUFBLENBVlIsQ0FBQTs7MEJBQUE7O0tBRjJCLEtBSDdCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/git-blame/lib/views/blame-error-view.coffee
