(function() {
  describe('validate', function() {
    var getLinter, validate;
    validate = require('../lib/validate');
    getLinter = require('./common').getLinter;
    describe('::linter', function() {
      it('throws error if grammarScopes is not an array', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          linter.grammarScopes = false;
          return validate.linter(linter);
        }).toThrow('grammarScopes is not an Array. Got: false');
      });
      it('throws if lint is missing', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          delete linter.lint;
          return validate.linter(linter);
        }).toThrow();
      });
      it('throws if lint is not a function', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          linter.lint = 'woah';
          return validate.linter(linter);
        }).toThrow();
      });
      it('works well with name attribute', function() {
        var linter;
        expect(function() {
          var linter;
          linter = getLinter();
          linter.name = 1;
          return validate.linter(linter);
        }).toThrow('Linter.name must be a string');
        linter = getLinter();
        linter.name = null;
        return validate.linter(linter);
      });
      it('works well with scope attribute', function() {
        var linter;
        expect(function() {
          var linter;
          linter = getLinter();
          linter.scope = null;
          return validate.linter(linter);
        }).toThrow('Linter.scope must be either `file` or `project`');
        expect(function() {
          var linter;
          linter = getLinter();
          linter.scope = 'a';
          return validate.linter(linter);
        }).toThrow('Linter.scope must be either `file` or `project`');
        linter = getLinter();
        linter.scope = 'Project';
        return validate.linter(linter);
      });
      return it('works overall', function() {
        validate.linter(getLinter());
        return expect(true).toBe(true);
      });
    });
    return describe('::messages', function() {
      it('throws if messages is not an array', function() {
        expect(function() {
          return validate.messages();
        }).toThrow('Expected messages to be array, provided: undefined');
        return expect(function() {
          return validate.messages(true);
        }).toThrow('Expected messages to be array, provided: boolean');
      });
      it('throws if type field is not present', function() {
        return expect(function() {
          return validate.messages([{}], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if type field is invalid', function() {
        return expect(function() {
          return validate.messages([
            {
              type: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it("throws if there's no html/text field on message", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 'Error'
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if html/text is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: false
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: false
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: []
            }
          ], {
            name: ''
          });
        }).toThrow();
        return expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: []
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if trace is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 'a',
              trace: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            html: 'a',
            trace: false
          }
        ], {
          name: ''
        });
      });
      it('throws if class is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": []
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error'
          }
        ], {
          name: ''
        });
      });
      it('throws if filePath is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": 'error',
              filePath: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
      });
      return it('throws if both text and html are provided', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              html: 'a',
              "class": 'error',
              filePath: '/'
            }
          ], {
            name: ''
          });
        }).toThrow();
        validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
        return validate.messages([
          {
            type: 'Error',
            html: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy92YWxpZGF0ZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsUUFBQSxtQkFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQUFYLENBQUE7QUFBQSxJQUNDLFlBQWEsT0FBQSxDQUFRLFVBQVIsRUFBYixTQURELENBQUE7QUFBQSxJQUVBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7ZUFDbEQsTUFBQSxDQUFPLFNBQUEsR0FBQTtBQUNMLGNBQUEsTUFBQTtBQUFBLFVBQUEsTUFBQSxHQUFTLFNBQUEsQ0FBQSxDQUFULENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyxhQUFQLEdBQXVCLEtBRHZCLENBQUE7aUJBRUEsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsTUFBaEIsRUFISztRQUFBLENBQVAsQ0FJQSxDQUFDLE9BSkQsQ0FJUywyQ0FKVCxFQURrRDtNQUFBLENBQXBELENBQUEsQ0FBQTtBQUFBLE1BTUEsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUEsR0FBQTtlQUM5QixNQUFBLENBQU8sU0FBQSxHQUFBO0FBQ0wsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsU0FBQSxDQUFBLENBQVQsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFBLE1BQWEsQ0FBQyxJQURkLENBQUE7aUJBRUEsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsTUFBaEIsRUFISztRQUFBLENBQVAsQ0FJQSxDQUFDLE9BSkQsQ0FBQSxFQUQ4QjtNQUFBLENBQWhDLENBTkEsQ0FBQTtBQUFBLE1B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

//# sourceURL=/Users/kswedberg/.atom/packages/linter/spec/validate-spec.coffee
