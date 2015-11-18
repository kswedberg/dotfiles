(function() {
  var Beautifier, PHPCSFixer, isWindows, path;

  PHPCSFixer = require("../src/beautifiers/php-cs-fixer");

  Beautifier = require("../src/beautifiers/beautifier");

  path = require('path');

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("PHP-CS-Fixer Beautifier", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        return activationPromise;
      });
    });
    return describe("Beautifier::beautify", function() {
      var OSSpecificSpecs, beautifier;
      beautifier = null;
      beforeEach(function() {
        return beautifier = new PHPCSFixer();
      });
      OSSpecificSpecs = function() {
        var failWhichProgram, text;
        text = "<?php echo \"test\"; ?>";
        it("should error when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, language, options, p;
            language = "PHP";
            options = {
              fixers: "",
              levels: ""
            };
            beautifier.spawn = function(exe, args, options) {
              var er;
              er = new Error('ENOENT');
              er.code = 'ENOENT';
              return beautifier.Promise.reject(er);
            };
            p = beautifier.beautify(text, language, options);
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
              expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        failWhichProgram = function(failingProgram) {
          return it("should error when '" + failingProgram + "' not found", function() {
            expect(beautifier).not.toBe(null);
            expect(beautifier instanceof Beautifier).toBe(true);
            if (!beautifier.isWindows && failingProgram === "php") {
              return;
            }
            return waitsForPromise({
              shouldReject: true
            }, function() {
              var cb, language, oldSpawn, options, p;
              language = "PHP";
              options = {
                fixers: "",
                levels: ""
              };
              cb = function(v) {
                expect(v).not.toBe(null);
                expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
                expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
                expect(v.file).toBe(failingProgram);
                return v;
              };
              beautifier.which = function(exe, options) {
                if (exe == null) {
                  return beautifier.Promise.resolve(null);
                }
                if (exe === failingProgram) {
                  return beautifier.Promise.resolve(failingProgram);
                } else {
                  return beautifier.Promise.resolve("/" + exe);
                }
              };
              oldSpawn = beautifier.spawn.bind(beautifier);
              beautifier.spawn = function(exe, args, options) {
                var er;
                if (exe === failingProgram) {
                  er = new Error('ENOENT');
                  er.code = 'ENOENT';
                  return beautifier.Promise.reject(er);
                } else {
                  return beautifier.Promise.resolve({
                    returnCode: 0,
                    stdout: 'stdout',
                    stderr: ''
                  });
                }
              };
              p = beautifier.beautify(text, language, options);
              expect(p).not.toBe(null);
              expect(p instanceof beautifier.Promise).toBe(true);
              p.then(cb, cb);
              return p;
            });
          });
        };
        return failWhichProgram('php-cs-fixer');
      };
      if (!isWindows) {
        describe("Mac/Linux", function() {
          beforeEach(function() {
            return beautifier.isWindows = false;
          });
          return OSSpecificSpecs();
        });
      }
      return describe("Windows", function() {
        beforeEach(function() {
          return beautifier.isWindows = true;
        });
        return OSSpecificSpecs();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NwZWMvYmVhdXRpZmllci1waHAtY3MtZml4ZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGlDQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsK0JBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQVVBLFNBQUEsR0FBWSxPQUFPLENBQUMsUUFBUixLQUFvQixPQUFwQixJQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBWixLQUFzQixRQURaLElBRVYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFaLEtBQXNCLE1BWnhCLENBQUE7O0FBQUEsRUFjQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO0FBRWxDLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUdULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsWUFBQSx1QkFBQTtBQUFBLFFBQUEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCLENBQXBCLENBQUE7QUFBQSxRQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGVBQS9CLENBRlAsQ0FBQTtBQUFBLFFBR0EsSUFBSSxDQUFDLFdBQUwsQ0FBQSxDQUhBLENBQUE7QUFPQSxlQUFPLGlCQUFQLENBUmM7TUFBQSxDQUFoQixFQUhTO0lBQUEsQ0FBWCxDQUFBLENBQUE7V0FhQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBRS9CLFVBQUEsMkJBQUE7QUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/spec/beautifier-php-cs-fixer-spec.coffee
