(function() {
  describe("JSX indent", function() {
    var buffer, editor, formattedFile, formattedLines, formattedSample, fs, languageMode, sampleFile, _ref;
    fs = require('fs');
    formattedFile = require.resolve('./fixtures/sample-formatted.jsx');
    sampleFile = require.resolve('./fixtures/sample.jsx');
    formattedSample = fs.readFileSync(formattedFile);
    formattedLines = formattedSample.toString().split('\n');
    _ref = [], editor = _ref[0], buffer = _ref[1], languageMode = _ref[2];
    afterEach(function() {
      return editor.destroy();
    });
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open(sampleFile, {
          autoIndent: false
        }).then(function(o) {
          editor = o;
          return buffer = editor.buffer, languageMode = editor.languageMode, editor;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
      return runs(function() {
        var grammar;
        grammar = atom.grammars.grammarForScopeName("source.js.jsx");
        return editor.setGrammar(grammar);
      });
    });
    return describe("should indent sample file correctly", function() {
      return it("autoIndentBufferRows should indent same as sample file", function() {
        var i, line, _i, _ref1, _results;
        editor.autoIndentBufferRows(0, formattedLines.length - 1);
        _results = [];
        for (i = _i = 0, _ref1 = formattedLines.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          line = formattedLines[i];
          if (!line.trim()) {
            continue;
          }
          _results.push(expect((i + 1) + ":" + buffer.lineForRow(i)).toBe((i + 1) + ":" + line));
        }
        return _results;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9yZWFjdC9zcGVjL2luZGVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBLEdBQUE7QUFDckIsUUFBQSxrR0FBQTtBQUFBLElBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTtBQUFBLElBQ0EsYUFBQSxHQUFnQixPQUFPLENBQUMsT0FBUixDQUFnQixpQ0FBaEIsQ0FEaEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxHQUFhLE9BQU8sQ0FBQyxPQUFSLENBQWdCLHVCQUFoQixDQUZiLENBQUE7QUFBQSxJQUdBLGVBQUEsR0FBa0IsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsYUFBaEIsQ0FIbEIsQ0FBQTtBQUFBLElBSUEsY0FBQSxHQUFpQixlQUFlLENBQUMsUUFBaEIsQ0FBQSxDQUEwQixDQUFDLEtBQTNCLENBQWlDLElBQWpDLENBSmpCLENBQUE7QUFBQSxJQUtBLE9BQWlDLEVBQWpDLEVBQUMsZ0JBQUQsRUFBUyxnQkFBVCxFQUFpQixzQkFMakIsQ0FBQTtBQUFBLElBT0EsU0FBQSxDQUFVLFNBQUEsR0FBQTthQUNSLE1BQU0sQ0FBQyxPQUFQLENBQUEsRUFEUTtJQUFBLENBQVYsQ0FQQSxDQUFBO0FBQUEsSUFVQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNaLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixVQUFwQixFQUFnQztBQUFBLFVBQUEsVUFBQSxFQUFZLEtBQVo7U0FBaEMsQ0FBa0QsQ0FBQyxJQUFuRCxDQUF3RCxTQUFDLENBQUQsR0FBQTtBQUN0RCxVQUFBLE1BQUEsR0FBUyxDQUFULENBQUE7aUJBQ0MsZ0JBQUEsTUFBRCxFQUFTLHNCQUFBLFlBQVQsRUFBeUIsT0FGNkI7UUFBQSxDQUF4RCxFQURZO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO0FBQUEsTUFLQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixPQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FMQSxDQUFBO0FBQUEsTUFRQSxTQUFBLENBQVUsU0FBQSxHQUFBO0FBQ1IsUUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFkLENBQUEsRUFGUTtNQUFBLENBQVYsQ0FSQSxDQUFBO2FBWUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsT0FBQTtBQUFBLFFBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MsZUFBbEMsQ0FBVixDQUFBO2VBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsRUFGRztNQUFBLENBQUwsRUFiUztJQUFBLENBQVgsQ0FWQSxDQUFBO1dBMkJBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7YUFDOUMsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUEsR0FBQTtBQUMzRCxZQUFBLDRCQUFBO0FBQUEsUUFBQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsQ0FBNUIsRUFBK0IsY0FBYyxDQUFDLE1BQWYsR0FBd0IsQ0FBdkQsQ0FBQSxDQUFBO0FBQ0E7YUFBUyw2R0FBVCxHQUFBO0FBQ0UsVUFBQSxJQUFBLEdBQU8sY0FBZSxDQUFBLENBQUEsQ0FBdEIsQ0FBQTtBQUNBLFVBQUEsSUFBWSxDQUFBLElBQUssQ0FBQyxJQUFMLENBQUEsQ0FBYjtBQUFBLHFCQUFBO1dBREE7QUFBQSx3QkFFQSxNQUFBLENBQU8sQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsR0FBVixHQUFnQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUF2QixDQUE0QyxDQUFDLElBQTdDLENBQW1ELENBQUMsQ0FBQSxHQUFJLENBQUwsQ0FBQSxHQUFVLEdBQVYsR0FBZ0IsSUFBbkUsRUFGQSxDQURGO0FBQUE7d0JBRjJEO01BQUEsQ0FBN0QsRUFEOEM7SUFBQSxDQUFoRCxFQTVCcUI7RUFBQSxDQUF2QixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/react/spec/indent-spec.coffee
