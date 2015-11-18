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
          if (typeof result.html !== 'string') {
            throw new Error('Invalid html field on Linter Response');
          }
          if (typeof result.text === 'string') {
            throw new Error('Got both html and text fields on Linter Response, expecting only one');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZhbGlkYXRlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FEVixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBQSxHQUVmO0FBQUEsSUFBQSxNQUFBLEVBQVEsU0FBQyxNQUFELEVBQVMsS0FBVCxHQUFBOztRQUFTLFFBQVE7T0FDdkI7QUFBQSxNQUFBLElBQUEsQ0FBQSxLQUFBO0FBQ0UsUUFBQSxJQUFBLENBQUEsQ0FBTyxNQUFNLENBQUMsYUFBUCxZQUFnQyxLQUF2QyxDQUFBO0FBQ0UsZ0JBQVUsSUFBQSxLQUFBLENBQU8sc0NBQUEsR0FBc0MsTUFBTSxDQUFDLGFBQXBELENBQVYsQ0FERjtTQUFBO0FBRUEsUUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO0FBQ0UsVUFBQSxJQUErRCxNQUFBLENBQUEsTUFBYSxDQUFDLElBQWQsS0FBd0IsVUFBdkY7QUFBQSxrQkFBVSxJQUFBLEtBQUEsQ0FBTSwwQ0FBTixDQUFWLENBQUE7V0FERjtTQUFBLE1BQUE7QUFHRSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSxpQ0FBTixDQUFWLENBSEY7U0FGQTtBQU1BLFFBQUEsSUFBRyxNQUFNLENBQUMsS0FBUCxJQUFpQixNQUFBLENBQUEsTUFBYSxDQUFDLEtBQWQsS0FBdUIsUUFBM0M7QUFDRSxVQUFBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFiLENBQUEsQ0FBZixDQURGO1NBTkE7QUFRQSxRQUFBLElBQXNFLE1BQU0sQ0FBQyxLQUFQ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

//# sourceURL=/Users/kswedberg/.atom/packages/linter/lib/validate.coffee
