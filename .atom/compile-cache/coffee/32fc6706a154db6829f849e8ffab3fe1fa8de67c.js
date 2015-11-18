(function() {
  var CompositeDisposable, _;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  module.exports = {
    activate: function() {
      this.disposables = new CompositeDisposable;
      atom.grammars.getGrammars().map((function(_this) {
        return function(grammar) {
          return _this.disposables.add(_this.createCommand(grammar));
        };
      })(this));
      return this.disposables.add(atom.grammars.onDidAddGrammar((function(_this) {
        return function(grammar) {
          return _this.disposables.add(_this.createCommand(grammar));
        };
      })(this)));
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    createCommand: function(grammar) {
      var workspaceElement;
      if ((grammar != null ? grammar.name : void 0) != null) {
        workspaceElement = atom.views.getView(atom.workspace);
        return atom.commands.add(workspaceElement, "set-syntax:" + grammar.name, function() {
          var _ref;
          return (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.setGrammar(grammar) : void 0;
        });
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9zZXQtc3ludGF4L2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFBZixDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQWQsQ0FBQSxDQUEyQixDQUFDLEdBQTVCLENBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtpQkFDOUIsS0FBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLEtBQUMsQ0FBQSxhQUFELENBQWUsT0FBZixDQUFqQixFQUQ4QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDLENBRkEsQ0FBQTthQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxHQUFBO2lCQUM3QyxLQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsS0FBQyxDQUFBLGFBQUQsQ0FBZSxPQUFmLENBQWpCLEVBRDZDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUIsQ0FBakIsRUFOUTtJQUFBLENBQVY7QUFBQSxJQVVBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxFQURVO0lBQUEsQ0FWWjtBQUFBLElBZ0JBLGFBQUEsRUFBZSxTQUFDLE9BQUQsR0FBQTtBQUNiLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLElBQUcsaURBQUg7QUFDRSxRQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTtlQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBcUMsYUFBQSxHQUFhLE9BQU8sQ0FBQyxJQUExRCxFQUFrRSxTQUFBLEdBQUE7QUFDaEUsY0FBQSxJQUFBOzZFQUFvQyxDQUFFLFVBQXRDLENBQWlELE9BQWpELFdBRGdFO1FBQUEsQ0FBbEUsRUFGRjtPQURhO0lBQUEsQ0FoQmY7R0FORixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/set-syntax/lib/main.coffee
