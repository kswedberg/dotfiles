(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: require('./config'),
    activate: function(state) {
      if (this.transpiler == null) {
        this.transpiler = new (require('./transpiler'));
      }
      this.disposable = new CompositeDisposable;
      this.disposable.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.transpiler.stopUnusedTasks();
        };
      })(this)));
      return this.disposable.add(atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          return _this.disposable.add(textEditor.onDidSave(function(event) {
            var grammar;
            grammar = textEditor.getGrammar();
            if (grammar.packageName !== 'language-babel') {
              return;
            }
            return _this.transpiler.transpile(event.path, textEditor);
          }));
        };
      })(this)));
    },
    deactivate: function() {
      if (this.disposable != null) {
        this.disposable.dispose();
      }
      return this.transpiler.stopAllTranspilerTask();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxPQUFBLENBQVEsVUFBUixDQUFSO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7O1FBQ1IsSUFBQyxDQUFBLGFBQWMsR0FBQSxDQUFBLENBQUssT0FBQSxDQUFRLGNBQVIsQ0FBRDtPQUFuQjtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxHQUFBLENBQUEsbUJBRmQsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxHQUFaLENBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDNUMsS0FBQyxDQUFBLFVBQVUsQ0FBQyxlQUFaLENBQUEsRUFENEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QixDQUFoQixDQUhBLENBQUE7YUFLQSxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxVQUFELEdBQUE7aUJBQ2pELEtBQUMsQ0FBQSxVQUFVLENBQUMsR0FBWixDQUFnQixVQUFVLENBQUMsU0FBWCxDQUFxQixTQUFDLEtBQUQsR0FBQTtBQUNuQyxnQkFBQSxPQUFBO0FBQUEsWUFBQSxPQUFBLEdBQVUsVUFBVSxDQUFDLFVBQVgsQ0FBQSxDQUFWLENBQUE7QUFDQSxZQUFBLElBQVUsT0FBTyxDQUFDLFdBQVIsS0FBeUIsZ0JBQW5DO0FBQUEsb0JBQUEsQ0FBQTthQURBO21CQUVBLEtBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFzQixLQUFLLENBQUMsSUFBNUIsRUFBa0MsVUFBbEMsRUFIbUM7VUFBQSxDQUFyQixDQUFoQixFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQWpCLEVBTlE7SUFBQSxDQUZWO0FBQUEsSUFjQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFHLHVCQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxDQUFBLENBREY7T0FBQTthQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMscUJBQVosQ0FBQSxFQUhVO0lBQUEsQ0FkWjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/language-babel/lib/main.coffee
