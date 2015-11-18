(function() {
  var MockTreeView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = MockTreeView = (function(_super) {
    __extends(MockTreeView, _super);

    function MockTreeView() {
      return MockTreeView.__super__.constructor.apply(this, arguments);
    }

    MockTreeView.content = function() {
      return this.div({
        "class": 'tree-view'
      });
    };

    MockTreeView.prototype.selectedPaths = function() {
      return ["/Users/mafiuss/.atom/packages/diff/spec/data/file1.txt", "/Users/mafiuss/.atom/packages/diff/spec/data/file2.txt"];
    };

    return MockTreeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWNsaS1kaWZmL3NwZWMvbW9jay10cmVlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFFSixtQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxXQUFQO09BQUwsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSwyQkFHQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQ2IsQ0FDRSx3REFERixFQUVFLHdEQUZGLEVBRGE7SUFBQSxDQUhmLENBQUE7O3dCQUFBOztLQUZ5QixLQUg3QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/atom-cli-diff/spec/mock-tree-view.coffee
