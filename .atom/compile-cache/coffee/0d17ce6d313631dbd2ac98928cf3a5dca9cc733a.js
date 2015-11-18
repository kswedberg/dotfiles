(function() {
  var ScopeNameProvider, extname;

  extname = require('path').extname;

  module.exports = ScopeNameProvider = (function() {
    function ScopeNameProvider() {
      this._exts = {};
      this._matchers = {};
      this._scopeNames = {};
    }

    ScopeNameProvider.prototype.registerExtension = function(ext, scopeName) {
      this._exts["." + ext] = scopeName;
      this._scopeNames[scopeName] = scopeName;
    };

    ScopeNameProvider.prototype.registerMatcher = function(matcher, scopeName) {
      var _base;
      if ((_base = this._matchers)[scopeName] == null) {
        _base[scopeName] = [];
      }
      this._matchers[scopeName].push(matcher);
      this._scopeNames[scopeName] = scopeName;
    };

    ScopeNameProvider.prototype.getScopeName = function(filename, opts) {
      var ext, matches, scopeName;
      if (opts == null) {
        opts = {};
      }
      ext = extname(filename);
      if (opts.caseSensitive) {
        scopeName = this._exts[ext];
      } else {
        matches = Object.keys(this._exts).filter(function(e) {
          return e.toLowerCase() === ext.toLowerCase();
        });
        if (matches.length >= 1) {
          scopeName = this._exts[matches[0]];
          if (matches.length > 1) {
            atom.notifications.addWarning('[file-types] Multiple Matches', {
              detail: "Assuming '" + matches[0] + "' (" + scopeName + ") for file '" + filename + "'.",
              dismissable: true
            });
          }
        }
      }
      if (scopeName != null) {
        return scopeName;
      }
      return this._matchFilename(filename, opts);
    };

    ScopeNameProvider.prototype.getScopeNames = function() {
      return Object.keys(this._scopeNames);
    };

    ScopeNameProvider.prototype._matchFilename = function(filename, opts) {
      var matcher, matchers, regexp, scopeName, _i, _len, _ref;
      if (opts == null) {
        opts = {};
      }
      _ref = this._matchers;
      for (scopeName in _ref) {
        matchers = _ref[scopeName];
        for (_i = 0, _len = matchers.length; _i < _len; _i++) {
          matcher = matchers[_i];
          if (opts.caseSensitive) {
            regexp = new RegExp(matcher);
          } else {
            regexp = new RegExp(matcher, 'i');
          }
          if (regexp.test(filename)) {
            return scopeName;
          }
        }
      }
    };

    return ScopeNameProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9maWxlLXR5cGVzL2xpYi9zY29wZS1uYW1lLXByb3ZpZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSwyQkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBQVQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxFQURiLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsRUFGZixDQURXO0lBQUEsQ0FBYjs7QUFBQSxnQ0FLQSxpQkFBQSxHQUFtQixTQUFDLEdBQUQsRUFBTSxTQUFOLEdBQUE7QUFDakIsTUFBQSxJQUFDLENBQUEsS0FBTSxDQUFDLEdBQUEsR0FBRyxHQUFKLENBQVAsR0FBb0IsU0FBcEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQVksQ0FBQSxTQUFBLENBQWIsR0FBMEIsU0FEMUIsQ0FEaUI7SUFBQSxDQUxuQixDQUFBOztBQUFBLGdDQVVBLGVBQUEsR0FBaUIsU0FBQyxPQUFELEVBQVUsU0FBVixHQUFBO0FBQ2YsVUFBQSxLQUFBOzthQUFXLENBQUEsU0FBQSxJQUFjO09BQXpCO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBVSxDQUFBLFNBQUEsQ0FBVSxDQUFDLElBQXRCLENBQTJCLE9BQTNCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFdBQVksQ0FBQSxTQUFBLENBQWIsR0FBMEIsU0FGMUIsQ0FEZTtJQUFBLENBVmpCLENBQUE7O0FBQUEsZ0NBZ0JBLFlBQUEsR0FBYyxTQUFDLFFBQUQsRUFBVyxJQUFYLEdBQUE7QUFDWixVQUFBLHVCQUFBOztRQUR1QixPQUFPO09BQzlCO0FBQUEsTUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBO0FBRUEsTUFBQSxJQUFHLElBQUksQ0FBQyxhQUFSO0FBQ0UsUUFBQSxTQUFBLEdBQVksSUFBQyxDQUFBLEtBQU0sQ0FBQSxHQUFBLENBQW5CLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxPQUFBLEdBQVUsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFDLENBQUEsS0FBYixDQUFtQixDQUFDLE1BQXBCLENBQTJCLFNBQUMsQ0FBRCxHQUFBO2lCQUNuQyxDQUFDLENBQUMsV0FBRixDQUFBLENBQUEsS0FBbUIsR0FBRyxDQUFDLFdBQUosQ0FBQSxFQURnQjtRQUFBLENBQTNCLENBQVYsQ0FBQTtBQUVBLFFBQUEsSUFBRyxPQUFPLENBQUMsTUFBUixJQUFrQixDQUFyQjtBQUNFLFVBQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxLQUFNLENBQUEsT0FBUSxDQUFBLENBQUEsQ0FBUixDQUFuQixDQUFBO0FBQ0EsVUFBQSxJQUFHLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQXBCO0FBQ0UsWUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLCtCQUE5QixFQUNFO0FBQUEsY0FBQSxNQUFBLEVBQVMsWUFBQSxHQUFZLE9BQVEsQ0FBQSxDQUFBLENBQXBCLEdBQXVCLEtBQXZCLEdBQTRCLFNBQTVCLEdBQXNDLGNBQXRDLEdBQW9ELFFBQXBELEdBQTZELElBQXRFO0FBQUEsY0FDQSxXQUFBLEVBQWEsSUFEYjthQURGLENBQUEsQ0FERjtXQUZGO1NBTEY7T0FGQTtBQWNBLE1BQUEsSUFBb0IsaUJBQXBCO0FBQUEsZUFBTyxTQUFQLENBQUE7T0FkQTthQWdCQSxJQUFDLENBQUEsY0FBRCxDQUFnQixRQUFoQixFQUEwQixJQUExQixFQWpCWTtJQUFBLENBaEJkLENBQUE7O0FBQUEsZ0NBbUNBLGFBQUEsR0FBZSxTQUFBLEdBQUE7YUFDYixNQUFNLENBQUMsSUFBUCxDQUFZLElBQUMsQ0FBQSxXQUFiLEVBRGE7SUFBQSxDQW5DZixDQUFBOztBQUFBLGdDQTBDQSxjQUFBLEdBQWdCLFNBQUMsUUFBRCxFQUFXLElBQVgsR0FBQTtBQUNkLFVBQUEsb0RBQUE7O1FBRHlCLE9BQU87T0FDaEM7QUFBQTtBQUFBLFdBQUEsaUJBQUE7bUNBQUE7QUFDRSxhQUFBLCtDQUFBO2lDQUFBO0FBQ0UsVUFBQSxJQUFHLElBQUksQ0FBQyxhQUFSO0FBQ0UsWUFBQSxNQUFBLEdBQWEsSUFBQSxNQUFBLENBQU8sT0FBUCxDQUFiLENBREY7V0FBQSxNQUFBO0FBR0UsWUFBQSxNQUFBLEdBQWEsSUFBQSxNQUFBLENBQU8sT0FBUCxFQUFnQixHQUFoQixDQUFiLENBSEY7V0FBQTtBQUlBLFVBQUEsSUFBb0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxRQUFaLENBQXBCO0FBQUEsbUJBQU8sU0FBUCxDQUFBO1dBTEY7QUFBQSxTQURGO0FBQUEsT0FEYztJQUFBLENBMUNoQixDQUFBOzs2QkFBQTs7TUFKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/file-types/lib/scope-name-provider.coffee
