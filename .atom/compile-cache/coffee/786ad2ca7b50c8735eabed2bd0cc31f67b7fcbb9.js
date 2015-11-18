(function() {
  var DiffHelper;

  DiffHelper = require('../lib/helpers/diff-helper');

  describe("Diff Helper", function() {
    var diffHelper;
    diffHelper = null;
    beforeEach(function() {
      return diffHelper = new DiffHelper();
    });
    describe("DiffHelper construction", function() {
      return it("can be created", function() {
        return expect(diffHelper).not.toBe(null);
      });
    });
    describe("Helper executing the diff command", function() {
      return it("returns the stdoutput string", function() {
        var stdoutstr;
        stdoutstr = diffHelper.execDiff(["/Users/mafiuss/.atom/packages/diff/spec/data/file1.txt", "/Users/mafiuss/.atom/packages/diff/spec/data/file2.txt"]);
        expect(stdoutstr).toBeDefined();
        return expect(stdoutstr).not.toBeNull();
      });
    });
    describe("Helper creating temp files", function() {
      return it("creates a temp file with the provided contents", function() {
        var data, filepath, fs, readData;
        data = 'the quick brown fox jumps';
        filepath = diffHelper.createTempFile(data);
        fs = require('fs');
        expect(fs.existsSync(filepath)).toBe(true);
        readData = fs.readFileSync(filepath, {
          encoding: 'utf8'
        });
        expect(readData).toBe(data);
        return fs.unlinkSync(filepath);
      });
    });
    return describe("Helper creating temp files from clipboard", function() {
      return it("creates a temp file with the clipboard contents", function() {
        var data, filepath, fs, readData;
        data = 'the quick brown fox jumps';
        atom.clipboard.write(data);
        filepath = diffHelper.createTempFileFromClipboard(atom.clipboard);
        fs = require('fs');
        expect(fs.existsSync(filepath)).toBe(true);
        readData = fs.readFileSync(filepath, {
          encoding: 'utf8'
        });
        expect(readData).toBe(data);
        return fs.unlinkSync(filepath);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWNsaS1kaWZmL3NwZWMvZGlmZi1oZWxwZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsNEJBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsVUFBQTtBQUFBLElBQUEsVUFBQSxHQUFhLElBQWIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQUEsRUFEUjtJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFLQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO2FBQ2xDLEVBQUEsQ0FBRyxnQkFBSCxFQUFxQixTQUFBLEdBQUE7ZUFDbkIsTUFBQSxDQUFPLFVBQVAsQ0FBa0IsQ0FBQyxHQUFHLENBQUMsSUFBdkIsQ0FBNEIsSUFBNUIsRUFEbUI7TUFBQSxDQUFyQixFQURrQztJQUFBLENBQXBDLENBTEEsQ0FBQTtBQUFBLElBU0EsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTthQUM1QyxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFlBQUEsU0FBQTtBQUFBLFFBQUEsU0FBQSxHQUFZLFVBQVUsQ0FBQyxRQUFYLENBQW9CLENBQzlCLHdEQUQ4QixFQUU5Qix3REFGOEIsQ0FBcEIsQ0FBWixDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sU0FBUCxDQUFpQixDQUFDLFdBQWxCLENBQUEsQ0FMQSxDQUFBO2VBTUEsTUFBQSxDQUFPLFNBQVAsQ0FBaUIsQ0FBQyxHQUFHLENBQUMsUUFBdEIsQ0FBQSxFQVBpQztNQUFBLENBQW5DLEVBRDRDO0lBQUEsQ0FBOUMsQ0FUQSxDQUFBO0FBQUEsSUFtQkEsUUFBQSxDQUFTLDRCQUFULEVBQXVDLFNBQUEsR0FBQTthQUNyQyxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFlBQUEsNEJBQUE7QUFBQSxRQUFBLElBQUEsR0FBTywyQkFBUCxDQUFBO0FBQUEsUUFDQSxRQUFBLEdBQVcsVUFBVSxDQUFDLGNBQVgsQ0FBMEIsSUFBMUIsQ0FEWCxDQUFBO0FBQUEsUUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQVAsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxJQUFyQyxDQUhBLENBQUE7QUFBQSxRQUlBLFFBQUEsR0FBVyxFQUFFLENBQUMsWUFBSCxDQUFnQixRQUFoQixFQUEwQjtBQUFBLFVBQUMsUUFBQSxFQUFVLE1BQVg7U0FBMUIsQ0FKWCxDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sUUFBUCxDQUFnQixDQUFDLElBQWpCLENBQXNCLElBQXRCLENBTEEsQ0FBQTtlQU9BLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxFQVJtRDtNQUFBLENBQXJELEVBRHFDO0lBQUEsQ0FBdkMsQ0FuQkEsQ0FBQTtXQThCQSxRQUFBLENBQVMsMkNBQVQsRUFBc0QsU0FBQSxHQUFBO2FBQ3BELEVBQUEsQ0FBRyxpREFBSCxFQUFzRCxTQUFBLEdBQUE7QUFDcEQsWUFBQSw0QkFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLDJCQUFQLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBZixDQUFxQixJQUFyQixDQURBLENBQUE7QUFBQSxRQUVBLFFBQUEsR0FBVyxVQUFVLENBQUMsMkJBQVgsQ0FBdUMsSUFBSSxDQUFDLFNBQTVDLENBRlgsQ0FBQTtBQUFBLFFBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBSEwsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUFQLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsSUFBckMsQ0FKQSxDQUFBO0FBQUEsUUFLQSxRQUFBLEdBQVcsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsUUFBaEIsRUFBMEI7QUFBQSxVQUFDLFFBQUEsRUFBVSxNQUFYO1NBQTFCLENBTFgsQ0FBQTtBQUFBLFFBTUEsTUFBQSxDQUFPLFFBQVAsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixJQUF0QixDQU5BLENBQUE7ZUFRQSxFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsRUFUb0Q7TUFBQSxDQUF0RCxFQURvRDtJQUFBLENBQXRELEVBL0JzQjtFQUFBLENBQXhCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/atom-cli-diff/spec/diff-helper-spec.coffee
