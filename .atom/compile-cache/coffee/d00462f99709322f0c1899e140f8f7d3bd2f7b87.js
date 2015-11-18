(function() {
  var Navigator;

  Navigator = (function() {
    function Navigator(separatorMarker) {
      var _ref;
      this.separatorMarker = separatorMarker;
      _ref = [null, null, null], this.conflict = _ref[0], this.previous = _ref[1], this.next = _ref[2];
    }

    Navigator.prototype.linkToPrevious = function(c) {
      this.previous = c;
      if (c != null) {
        return c.navigator.next = this.conflict;
      }
    };

    Navigator.prototype.nextUnresolved = function() {
      var current;
      current = this.next;
      while ((current != null) && current.isResolved()) {
        current = current.navigator.next;
      }
      return current;
    };

    Navigator.prototype.previousUnresolved = function() {
      var current;
      current = this.previous;
      while ((current != null) && current.isResolved()) {
        current = current.navigator.previous;
      }
      return current;
    };

    Navigator.prototype.markers = function() {
      return [this.separatorMarker];
    };

    return Navigator;

  })();

  module.exports = {
    Navigator: Navigator
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvbGliL25hdmlnYXRvci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsU0FBQTs7QUFBQSxFQUFNO0FBRVMsSUFBQSxtQkFBRSxlQUFGLEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxrQkFBQSxlQUNiLENBQUE7QUFBQSxNQUFBLE9BQWdDLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLENBQWhDLEVBQUMsSUFBQyxDQUFBLGtCQUFGLEVBQVksSUFBQyxDQUFBLGtCQUFiLEVBQXVCLElBQUMsQ0FBQSxjQUF4QixDQURXO0lBQUEsQ0FBYjs7QUFBQSx3QkFHQSxjQUFBLEdBQWdCLFNBQUMsQ0FBRCxHQUFBO0FBQ2QsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLENBQVosQ0FBQTtBQUNBLE1BQUEsSUFBZ0MsU0FBaEM7ZUFBQSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQVosR0FBbUIsSUFBQyxDQUFBLFNBQXBCO09BRmM7SUFBQSxDQUhoQixDQUFBOztBQUFBLHdCQU9BLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLElBQVgsQ0FBQTtBQUNBLGFBQU0saUJBQUEsSUFBYSxPQUFPLENBQUMsVUFBUixDQUFBLENBQW5CLEdBQUE7QUFDRSxRQUFBLE9BQUEsR0FBVSxPQUFPLENBQUMsU0FBUyxDQUFDLElBQTVCLENBREY7TUFBQSxDQURBO2FBR0EsUUFKYztJQUFBLENBUGhCLENBQUE7O0FBQUEsd0JBYUEsa0JBQUEsR0FBb0IsU0FBQSxHQUFBO0FBQ2xCLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxRQUFYLENBQUE7QUFDQSxhQUFNLGlCQUFBLElBQWEsT0FBTyxDQUFDLFVBQVIsQ0FBQSxDQUFuQixHQUFBO0FBQ0UsUUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUE1QixDQURGO01BQUEsQ0FEQTthQUdBLFFBSmtCO0lBQUEsQ0FicEIsQ0FBQTs7QUFBQSx3QkFtQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUFHLENBQUMsSUFBQyxDQUFBLGVBQUYsRUFBSDtJQUFBLENBbkJULENBQUE7O3FCQUFBOztNQUZGLENBQUE7O0FBQUEsRUF1QkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsU0FBQSxFQUFXLFNBQVg7R0F4QkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/lib/navigator.coffee
