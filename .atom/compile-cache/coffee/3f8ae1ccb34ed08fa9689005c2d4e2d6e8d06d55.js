(function() {
  describe('message-registry', function() {
    var EditorLinter, LinterRegistry, MessageRegistry, getLinterRegistry, getMessage, messageRegistry, objectSize, _ref;
    messageRegistry = null;
    MessageRegistry = require('../lib/message-registry');
    EditorLinter = require('../lib/editor-linter');
    LinterRegistry = require('../lib/linter-registry');
    objectSize = function(obj) {
      var size, value;
      size = 0;
      for (value in obj) {
        size++;
      }
      return size;
    };
    _ref = require('./common'), getLinterRegistry = _ref.getLinterRegistry, getMessage = _ref.getMessage;
    beforeEach(function() {
      return waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('test.txt').then(function() {
          if (messageRegistry != null) {
            messageRegistry.dispose();
          }
          return messageRegistry = new MessageRegistry();
        });
      });
    });
    describe('::set', function() {
      it('accepts info from LinterRegistry::lint', function() {
        var editorLinter, linterRegistry, wasUpdated, _ref1;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        wasUpdated = false;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          wasUpdated = true;
          messageRegistry.set(linterInfo);
          return expect(messageRegistry.hasChanged).toBe(true);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
      return it('ignores deactivated linters', function() {
        var editorLinter, linter, linterRegistry, _ref1;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter, linter = _ref1.linter;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        messageRegistry.updatePublic();
        expect(messageRegistry.publicMessages.length).toBe(2);
        linter.deactivated = true;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error')]
        });
        messageRegistry.updatePublic();
        expect(messageRegistry.publicMessages.length).toBe(2);
        linter.deactivated = false;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error')]
        });
        messageRegistry.updatePublic();
        return expect(messageRegistry.publicMessages.length).toBe(1);
      });
    });
    describe('::onDidUpdateMessages', function() {
      it('is triggered asyncly with results and provides a diff', function() {
        var editorLinter, linterRegistry, wasUpdated, _ref1;
        wasUpdated = false;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          expect(messageRegistry.hasChanged).toBe(true);
          return messageRegistry.updatePublic();
        });
        messageRegistry.onDidUpdateMessages(function(_arg) {
          var added, messages, removed;
          added = _arg.added, removed = _arg.removed, messages = _arg.messages;
          wasUpdated = true;
          expect(added.length).toBe(1);
          expect(removed.length).toBe(0);
          return expect(messages.length).toBe(1);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
      return it('provides the same objects when they dont change', function() {
        var disposable, editorLinter, linterRegistry, wasUpdated, _ref1;
        wasUpdated = false;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          return messageRegistry.updatePublic();
        });
        disposable = messageRegistry.onDidUpdateMessages(function(_arg) {
          var added, obj;
          added = _arg.added;
          expect(added.length).toBe(1);
          obj = added[0];
          disposable.dispose();
          return messageRegistry.onDidUpdateMessages(function(_arg1) {
            var messages;
            messages = _arg1.messages;
            wasUpdated = true;
            return expect(messages[0]).toBe(obj);
          });
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            return linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            });
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
    });
    return describe('::deleteEditorMessages', function() {
      return it('removes messages for that editor', function() {
        var editor, editorLinter, linterRegistry, wasUpdated, _ref1;
        wasUpdated = 0;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        editor = editorLinter.editor;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          expect(messageRegistry.hasChanged).toBe(true);
          return messageRegistry.updatePublic();
        });
        messageRegistry.onDidUpdateMessages(function(_arg) {
          var messages;
          messages = _arg.messages;
          wasUpdated = 1;
          expect(objectSize(messages)).toBe(1);
          return messageRegistry.deleteEditorMessages(editor);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(1);
            return linterRegistry.dispose();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9tZXNzYWdlLXJlZ2lzdHJ5LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsUUFBQSwrR0FBQTtBQUFBLElBQUEsZUFBQSxHQUFrQixJQUFsQixDQUFBO0FBQUEsSUFDQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx5QkFBUixDQURsQixDQUFBO0FBQUEsSUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSLENBRmYsQ0FBQTtBQUFBLElBR0EsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FIakIsQ0FBQTtBQUFBLElBSUEsVUFBQSxHQUFhLFNBQUMsR0FBRCxHQUFBO0FBQ1gsVUFBQSxXQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sQ0FBUCxDQUFBO0FBQ0EsV0FBQSxZQUFBLEdBQUE7QUFBQSxRQUFBLElBQUEsRUFBQSxDQUFBO0FBQUEsT0FEQTtBQUVBLGFBQU8sSUFBUCxDQUhXO0lBQUEsQ0FKYixDQUFBO0FBQUEsSUFRQSxPQUFrQyxPQUFBLENBQVEsVUFBUixDQUFsQyxFQUFDLHlCQUFBLGlCQUFELEVBQW9CLGtCQUFBLFVBUnBCLENBQUE7QUFBQSxJQVVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtBQUNkLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBZixDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLFNBQUEsR0FBQTs7WUFDbkMsZUFBZSxDQUFFLE9BQWpCLENBQUE7V0FBQTtpQkFDQSxlQUFBLEdBQXNCLElB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

//# sourceURL=/Users/kswedberg/.atom/packages/linter/spec/message-registry-spec.coffee
