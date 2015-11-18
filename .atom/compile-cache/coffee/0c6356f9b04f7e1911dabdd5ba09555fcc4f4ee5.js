(function() {
  var GitBridge, MergeState;

  GitBridge = require('./git-bridge').GitBridge;

  MergeState = (function() {
    function MergeState(conflicts, repo, isRebase) {
      this.conflicts = conflicts;
      this.repo = repo;
      this.isRebase = isRebase;
    }

    MergeState.prototype.conflictPaths = function() {
      var c, _i, _len, _ref, _results;
      _ref = this.conflicts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.path);
      }
      return _results;
    };

    MergeState.prototype.reread = function(callback) {
      return GitBridge.withConflicts(this.repo, (function(_this) {
        return function(err, conflicts) {
          _this.conflicts = conflicts;
          return callback(err, _this);
        };
      })(this));
    };

    MergeState.prototype.isEmpty = function() {
      return this.conflicts.length === 0;
    };

    MergeState.read = function(repo, callback) {
      var isr;
      isr = GitBridge.isRebasing();
      return GitBridge.withConflicts(repo, function(err, cs) {
        if (err != null) {
          return callback(err, null);
        } else {
          return callback(null, new MergeState(cs, repo, isr));
        }
      });
    };

    return MergeState;

  })();

  module.exports = {
    MergeState: MergeState
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tZXJnZS1jb25mbGljdHMvbGliL21lcmdlLXN0YXRlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTs7QUFBQSxFQUFDLFlBQWEsT0FBQSxDQUFRLGNBQVIsRUFBYixTQUFELENBQUE7O0FBQUEsRUFFTTtBQUVTLElBQUEsb0JBQUUsU0FBRixFQUFjLElBQWQsRUFBcUIsUUFBckIsR0FBQTtBQUFnQyxNQUEvQixJQUFDLENBQUEsWUFBQSxTQUE4QixDQUFBO0FBQUEsTUFBbkIsSUFBQyxDQUFBLE9BQUEsSUFBa0IsQ0FBQTtBQUFBLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFoQztJQUFBLENBQWI7O0FBQUEseUJBRUEsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUFHLFVBQUEsMkJBQUE7QUFBQTtBQUFBO1dBQUEsMkNBQUE7cUJBQUE7QUFBQSxzQkFBQSxDQUFDLENBQUMsS0FBRixDQUFBO0FBQUE7c0JBQUg7SUFBQSxDQUZmLENBQUE7O0FBQUEseUJBSUEsTUFBQSxHQUFRLFNBQUMsUUFBRCxHQUFBO2FBQ04sU0FBUyxDQUFDLGFBQVYsQ0FBd0IsSUFBQyxDQUFBLElBQXpCLEVBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsRUFBTyxTQUFQLEdBQUE7QUFDN0IsVUFEbUMsS0FBQyxDQUFBLFlBQUEsU0FDcEMsQ0FBQTtpQkFBQSxRQUFBLENBQVMsR0FBVCxFQUFjLEtBQWQsRUFENkI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixFQURNO0lBQUEsQ0FKUixDQUFBOztBQUFBLHlCQVFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsS0FBcUIsRUFBeEI7SUFBQSxDQVJULENBQUE7O0FBQUEsSUFVQSxVQUFDLENBQUEsSUFBRCxHQUFPLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtBQUNMLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLFNBQVMsQ0FBQyxVQUFWLENBQUEsQ0FBTixDQUFBO2FBQ0EsU0FBUyxDQUFDLGFBQVYsQ0FBd0IsSUFBeEIsRUFBOEIsU0FBQyxHQUFELEVBQU0sRUFBTixHQUFBO0FBQzVCLFFBQUEsSUFBRyxXQUFIO2lCQUNFLFFBQUEsQ0FBUyxHQUFULEVBQWMsSUFBZCxFQURGO1NBQUEsTUFBQTtpQkFHRSxRQUFBLENBQVMsSUFBVCxFQUFtQixJQUFBLFVBQUEsQ0FBVyxFQUFYLEVBQWUsSUFBZixFQUFxQixHQUFyQixDQUFuQixFQUhGO1NBRDRCO01BQUEsQ0FBOUIsRUFGSztJQUFBLENBVlAsQ0FBQTs7c0JBQUE7O01BSkYsQ0FBQTs7QUFBQSxFQXNCQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxVQUFBLEVBQVksVUFBWjtHQXZCRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/merge-conflicts/lib/merge-state.coffee
