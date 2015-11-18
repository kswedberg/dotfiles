(function() {
  describe('BottomPanel', function() {
    var BottomPanel, bottomPanel, getMessage, linter;
    BottomPanel = require('../../lib/ui/bottom-panel');
    linter = null;
    bottomPanel = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          linter = atom.packages.getActivePackage('linter').mainModule.instance;
          if (bottomPanel != null) {
            bottomPanel.dispose();
          }
          bottomPanel = new BottomPanel('File');
          return atom.workspace.open(__dirname + '/fixtures/file.txt');
        });
      });
    });
    getMessage = require('../common').getMessage;
    it('is not visible when there are no errors', function() {
      return expect(linter.views.bottomPanel.getVisibility()).toBe(false);
    });
    it('hides on config change', function() {
      linter.views.bottomPanel.scope = 'Project';
      linter.views.bottomPanel.setMessages({
        added: [getMessage('Error')],
        removed: []
      });
      expect(linter.views.bottomPanel.getVisibility()).toBe(true);
      atom.config.set('linter.showErrorPanel', false);
      expect(linter.views.bottomPanel.getVisibility()).toBe(false);
      atom.config.set('linter.showErrorPanel', true);
      return expect(linter.views.bottomPanel.getVisibility()).toBe(true);
    });
    return describe('{set, remove}Messages', function() {
      return it('works as expected', function() {
        var messages;
        bottomPanel.scope = 'Project';
        messages = [getMessage('Error'), getMessage('Warning')];
        bottomPanel.setMessages({
          added: messages,
          removed: []
        });
        expect(bottomPanel.messagesElement.childNodes.length).toBe(1);
        expect(bottomPanel.messagesElement.childNodes[0].childNodes.length).toBe(2);
        bottomPanel.setMessages({
          added: [],
          removed: messages
        });
        expect(bottomPanel.messagesElement.childNodes.length).toBe(1);
        expect(bottomPanel.messagesElement.childNodes[0].childNodes.length).toBe(0);
        bottomPanel.setMessages({
          added: messages,
          removed: []
        });
        expect(bottomPanel.messagesElement.childNodes[0].childNodes.length).toBe(2);
        bottomPanel.removeMessages(messages);
        expect(bottomPanel.messagesElement.childNodes.length).toBe(1);
        return expect(bottomPanel.messagesElement.childNodes[0].childNodes.length).toBe(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy91aS9ib3R0b20tcGFuZWwtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsNENBQUE7QUFBQSxJQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsMkJBQVIsQ0FBZCxDQUFBO0FBQUEsSUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO0FBQUEsSUFFQSxXQUFBLEdBQWMsSUFGZCxDQUFBO0FBQUEsSUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsUUFBOUIsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxTQUFBLEdBQUE7QUFDM0MsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixRQUEvQixDQUF3QyxDQUFDLFVBQVUsQ0FBQyxRQUE3RCxDQUFBOztZQUNBLFdBQVcsQ0FBRSxPQUFiLENBQUE7V0FEQTtBQUFBLFVBRUEsV0FBQSxHQUFrQixJQUFBLFdBQUEsQ0FBWSxNQUFaLENBRmxCLENBQUE7aUJBR0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFNBQUEsR0FBWSxvQkFBaEMsRUFKMkM7UUFBQSxDQUE3QyxFQURjO01BQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FIQSxDQUFBO0FBQUEsSUFXQyxhQUFjLE9BQUEsQ0FBUSxXQUFSLEVBQWQsVUFYRCxDQUFBO0FBQUEsSUFhQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO2FBQzVDLE1BQUEsQ0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxh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

//# sourceURL=/Users/kswedberg/.atom/packages/linter/spec/ui/bottom-panel-spec.coffee
