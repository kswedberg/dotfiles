(function() {
  describe('Bottom Status Element', function() {
    var BottomStatus, bottomStatus;
    BottomStatus = require('../../lib/ui/bottom-status');
    bottomStatus = null;
    beforeEach(function() {
      return bottomStatus = new BottomStatus;
    });
    return describe('::visibility', function() {
      it('adds and removes the hidden attribute', function() {
        expect(bottomStatus.hasAttribute('hidden')).toBe(false);
        bottomStatus.visibility = true;
        expect(bottomStatus.hasAttribute('hidden')).toBe(false);
        bottomStatus.visibility = false;
        expect(bottomStatus.hasAttribute('hidden')).toBe(true);
        bottomStatus.visibility = true;
        return expect(bottomStatus.hasAttribute('hidden')).toBe(false);
      });
      return it('reports the visibility when getter is invoked', function() {
        expect(bottomStatus.visibility).toBe(true);
        bottomStatus.visibility = true;
        expect(bottomStatus.visibility).toBe(true);
        bottomStatus.visibility = false;
        expect(bottomStatus.visibility).toBe(false);
        bottomStatus.visibility = true;
        return expect(bottomStatus.visibility).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy91aS9ib3R0b20tc3RhdHVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsUUFBQSwwQkFBQTtBQUFBLElBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSw0QkFBUixDQUFmLENBQUE7QUFBQSxJQUNBLFlBQUEsR0FBZSxJQURmLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxZQUFBLEdBQWUsR0FBQSxDQUFBLGFBRE47SUFBQSxDQUFYLENBSEEsQ0FBQTtXQU1BLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixNQUFBLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsUUFBQSxNQUFBLENBQU8sWUFBWSxDQUFDLFlBQWIsQ0FBMEIsUUFBMUIsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELEtBQWpELENBQUEsQ0FBQTtBQUFBLFFBQ0EsWUFBWSxDQUFDLFVBQWIsR0FBMEIsSUFEMUIsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxZQUFiLENBQTBCLFFBQTFCLENBQVAsQ0FBMkMsQ0FBQyxJQUE1QyxDQUFpRCxLQUFqRCxDQUZBLENBQUE7QUFBQSxRQUdBLFlBQVksQ0FBQyxVQUFiLEdBQTBCLEtBSDFCLENBQUE7QUFBQSxRQUlBLE1BQUEsQ0FBTyxZQUFZLENBQUMsWUFBYixDQUEwQixRQUExQixDQUFQLENBQTJDLENBQUMsSUFBNUMsQ0FBaUQsSUFBakQsQ0FKQSxDQUFBO0FBQUEsUUFLQSxZQUFZLENBQUMsVUFBYixHQUEwQixJQUwxQixDQUFBO2VBTUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxZQUFiLENBQTBCLFFBQTFCLENBQVAsQ0FBMkMsQ0FBQyxJQUE1QyxDQUFpRCxLQUFqRCxFQVAwQztNQUFBLENBQTVDLENBQUEsQ0FBQTthQVNBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsUUFBQSxNQUFBLENBQU8sWUFBWSxDQUFDLFVBQXBCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsSUFBckMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxZQUFZLENBQUMsVUFBYixHQUEwQixJQUQxQixDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sWUFBWSxDQUFDLFVBQXBCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsSUFBckMsQ0FGQSxDQUFBO0FBQUEsUUFHQSxZQUFZLENBQUMsVUFBYixHQUEwQixLQUgxQixDQUFBO0FBQUEsUUFJQSxNQUFBLENBQU8sWUFBWSxDQUFDLFVBQXBCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsS0FBckMsQ0FKQSxDQUFBO0FBQUEsUUFLQSxZQUFZLENBQUMsVUFBYixHQUEwQixJQUwxQixDQUFBO2VBTUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLElBQXJDLEVBUGtEO01BQUEsQ0FBcEQsRUFWdUI7SUFBQSxDQUF6QixFQVBnQztFQUFBLENBQWxDLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/linter/spec/ui/bottom-status-spec.coffee
