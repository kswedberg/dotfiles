(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter, indie) {
      if (indie == null) {
        indie = false;
      }
      if (!indie) {
        if (!(linter.grammarScopes instanceof Array)) {
          throw new Error("grammarScopes is not an Array. Got: " + linter.grammarScopes);
        }
        if (linter.lint) {
          if (typeof linter.lint !== 'function') {
            throw new Error("linter.lint isn't a function on provider");
          }
        } else {
          throw new Error('Missing linter.lint on provider');
        }
        if (linter.scope && typeof linter.scope === 'string') {
          linter.scope = linter.scope.toLowerCase();
        }
        if (linter.scope !== 'file' && linter.scope !== 'project') {
          throw new Error('Linter.scope must be either `file` or `project`');
        }
      }
      if (linter.name) {
        if (typeof linter.name !== 'string') {
          throw new Error('Linter.name must be a string');
        }
      } else {
        linter.name = null;
      }
      return true;
    },
    messages: function(messages, linter) {
      if (!(messages instanceof Array)) {
        throw new Error("Expected messages to be array, provided: " + (typeof messages));
      }
      if (!linter) {
        throw new Error('No linter provided');
      }
      messages.forEach(function(result) {
        if (result.type) {
          if (typeof result.type !== 'string') {
            throw new Error('Invalid type field on Linter Response');
          }
        } else {
          throw new Error('Missing type field on Linter Response');
        }
        if (result.html) {
          if (typeof result.text === 'string') {
            throw new Error('Got both html and text fields on Linter Response, expecting only one');
          }
          if (typeof result.html !== 'string' && !(result.html instanceof HTMLElement)) {
            throw new Error('Invalid html field on Linter Response');
          }
          result.text = null;
        } else if (result.text) {
          if (typeof result.text !== 'string') {
            throw new Error('Invalid text field on Linter Response');
          }
          result.html = null;
        } else {
          throw new Error('Missing html/text field on Linter Response');
        }
        if (result.trace) {
          if (!(result.trace instanceof Array)) {
            throw new Error('Invalid trace field on Linter Response');
          }
        } else {
          result.trace = null;
        }
        if (result["class"]) {
          if (typeof result["class"] !== 'string') {
            throw new Error('Invalid class field on Linter Response');
          }
        } else {
          result["class"] = result.type.toLowerCase().replace(' ', '-');
        }
        if (result.filePath) {
          if (typeof result.filePath !== 'string') {
            throw new Error('Invalid filePath field on Linter response');
          }
        } else {
          result.filePath = null;
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result.key = JSON.stringify(result);
        result.linter = linter.name;
        if (result.trace && result.trace.length) {
          return Validate.messages(result.trace, linter);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZhbGlkYXRlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBQSxHQUVmO0FBQUEsSUFBQSxNQUFBLEVBQVEsU0FBQyxNQUFELEVBQVMsS0FBVCxHQUFBOztRQUFTLFFBQVE7T0FDdkI7QUFBQSxNQUFBLElBQUEsQ0FBQSxLQUFBO0FBQ0UsUUFBQSxJQUFBLENBQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxZQUFnQyxLQUF2QyxDQUFBO0FBQ0UsZ0JBQVUsSUFBQSxLQUFBLENBQU8sc0NBQUEsR0FBc0MsTUFBTSxDQUFDLGFBQXBELENBQVYsQ0FERjtTQUFBO0FBRUEsUUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO0FBQ0UsVUFBQSxJQUErRCxNQUFBLENBQUEsTUFBYSxDQUFDLElBQWQsS0FBd0IsVUFBdkY7QUFBQSxrQkFBVSxJQUFBLEtBQUEsQ0FBTSwwQ0FBTixDQUFWLENBQUE7V0FERjtTQUFBLE1BQUE7QUFHRSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSxpQ0FBTixDQUFWLENBSEY7U0FGQTtBQU1BLFFBQUEsSUFBRyxNQUFNLENBQUMsS0FBUCxJQUFpQixNQUFBLENBQUEsTUFBYSxDQUFDLEtBQWQsS0FBdUIsUUFBM0M7QUFDRSxVQUFBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFiLENBQUEsQ0FBZixDQURGO1NBTkE7QUFRQSxRQUFBLElBQXNFLE1BQU0s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

//# sourceURL=/Users/kswedberg/dotfiles/.atom/packages/linter/lib/validate.coffee
