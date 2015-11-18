(function() {
  var EditorLinter, LinterRegistry, Validators;

  LinterRegistry = require('../lib/linter-registry');

  EditorLinter = require('../lib/editor-linter');

  Validators = require('../lib/validate');

  module.exports = {
    wait: function(timeout) {
      return new Promise(function(resolve) {
        return setTimeout(resolve, timeout);
      });
    },
    getLinter: function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        scope: 'project',
        lint: function() {}
      };
    },
    getMessage: function(type, filePath, range) {
      var message;
      message = {
        type: type,
        text: 'Some Message',
        filePath: filePath,
        range: range
      };
      Validators.messages([message], {
        name: 'Some Linter'
      });
      return message;
    },
    getLinterRegistry: function() {
      var editorLinter, linter, linterRegistry;
      linterRegistry = new LinterRegistry;
      editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
      linter = {
        grammarScopes: ['*'],
        lintOnFly: false,
        scope: 'project',
        lint: function() {
          return [
            {
              type: 'Error',
              text: 'Something'
            }
          ];
        }
      };
      linterRegistry.addLinter(linter);
      return {
        linterRegistry: linterRegistry,
        editorLinter: editorLinter,
        linter: linter
      };
    },
    trigger: function(el, name) {
      var event;
      event = document.createEvent('HTMLEvents');
      event.initEvent(name, true, false);
      return el.dispatchEvent(event);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9jb21tb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxpQkFBUixDQUZiLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0sU0FBQyxPQUFELEdBQUE7QUFDSixhQUFXLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxHQUFBO2VBQ2pCLFVBQUEsQ0FBVyxPQUFYLEVBQW9CLE9BQXBCLEVBRGlCO01BQUEsQ0FBUixDQUFYLENBREk7SUFBQSxDQUFOO0FBQUEsSUFHQSxTQUFBLEVBQVcsU0FBQSxHQUFBO0FBQ1QsYUFBTztBQUFBLFFBQUMsYUFBQSxFQUFlLENBQUMsR0FBRCxDQUFoQjtBQUFBLFFBQXVCLFNBQUEsRUFBVyxLQUFsQztBQUFBLFFBQXlDLEtBQUEsRUFBTyxTQUFoRDtBQUFBLFFBQTJELElBQUEsRUFBTSxTQUFBLEdBQUEsQ0FBakU7T0FBUCxDQURTO0lBQUEsQ0FIWDtBQUFBLElBS0EsVUFBQSxFQUFZLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsS0FBakIsR0FBQTtBQUNWLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLElBQUEsRUFBTSxjQUFiO0FBQUEsUUFBNkIsVUFBQSxRQUE3QjtBQUFBLFFBQXVDLE9BQUEsS0FBdkM7T0FBVixDQUFBO0FBQUEsTUFDQSxVQUFVLENBQUMsUUFBWCxDQUFvQixDQUFDLE9BQUQsQ0FBcEIsRUFBK0I7QUFBQSxRQUFDLElBQUEsRUFBTSxhQUFQO09BQS9CLENBREEsQ0FBQTtBQUVBLGFBQU8sT0FBUCxDQUhVO0lBQUEsQ0FMWjtBQUFBLElBU0EsaUJBQUEsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFVBQUEsb0NBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsR0FBQSxDQUFBLGNBQWpCLENBQUE7QUFBQSxNQUNBLFlBQUEsR0FBbUIsSUFBQSxZQUFBLENBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQWIsQ0FEbkIsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFTO0FBQUEsUUFDUCxhQUFBLEVBQWUsQ0FBQyxHQUFELENBRFI7QUFBQSxRQUVQLFNBQUEsRUFBVyxLQUZKO0FBQUEsUUFHUCxLQUFBLEVBQU8sU0FIQTtBQUFBLFFBSVAsSUFBQSxFQUFNLFNBQUEsR0FBQTtBQUFHLGlCQUFPO1lBQUM7QUFBQSxjQUFDLElBQUEsRUFBTSxPQUFQO0FBQUEsY0FBZ0IsSUFBQSxFQUFNLFdBQXRCO2FBQUQ7V0FBUCxDQUFIO1FBQUEsQ0FKQztPQUZULENBQUE7QUFBQSxNQVFBLGNBQWMsQ0FBQyxTQUFmLENBQXlCLE1BQXpCLENBUkEsQ0FBQTtBQVNBLGFBQU87QUFBQSxRQUFDLGdCQUFBLGNBQUQ7QUFBQSxRQUFpQixjQUFBLFlBQWpCO0FBQUEsUUFBK0IsUUFBQSxNQUEvQjtPQUFQLENBVmlCO0lBQUEsQ0FUbkI7QUFBQSxJQW9CQSxPQUFBLEVBQVMsU0FBQyxFQUFELEVBQUssSUFBTCxHQUFBO0FBQ1AsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsWUFBckIsQ0FBUixDQUFBO0FBQUEsTUFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixLQUE1QixDQURBLENBQUE7YUFFQSxFQUFFLENBQUMsYUFBSCxDQUFpQixLQUFqQixFQUhPO0lBQUEsQ0FwQlQ7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/linter/spec/common.coffee
