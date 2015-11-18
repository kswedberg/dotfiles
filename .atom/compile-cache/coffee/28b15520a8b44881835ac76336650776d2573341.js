(function() {
  var PublishDraft;

  PublishDraft = require("../../lib/commands/publish-draft");

  describe("PublishDraft", function() {
    var editor, publishDraft, _ref;
    _ref = [], editor = _ref[0], publishDraft = _ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe(".trigger", function() {
      return it("abort publish draft when not confirm publish", function() {
        publishDraft = new PublishDraft({});
        publishDraft.confirmPublish = function() {
          return {};
        };
        publishDraft.trigger();
        expect(publishDraft.draftPath).toMatch("fixtures/empty.markdown");
        return expect(publishDraft.postPath).toMatch(/\/\d{4}\/\d{4}-\d\d-\d\d-empty\.markdown/);
      });
    });
    describe(".getPostTile", function() {
      it("get title from front matter by config", function() {
        atom.config.set("markdown-writer.publishRenameBasedOnTitle", true);
        editor.setText("---\ntitle: Markdown Writer\n---");
        publishDraft = new PublishDraft({});
        return expect(publishDraft._getPostTitle()).toBe("markdown-writer");
      });
      it("get title from front matter if no draft path", function() {
        editor.setText("---\ntitle: Markdown Writer (New Post)\n---");
        publishDraft = new PublishDraft({});
        return expect(publishDraft._getPostTitle()).toBe("markdown-writer-new-post");
      });
      it("get title from draft path", function() {
        publishDraft = new PublishDraft({});
        publishDraft.draftPath = "test/name-of-post.md";
        return expect(publishDraft._getPostTitle()).toBe("name-of-post");
      });
      return it("get new-post when no front matter/draft path", function() {
        publishDraft = new PublishDraft({});
        return expect(publishDraft._getPostTitle()).toBe("new-post");
      });
    });
    return describe(".getPostExtension", function() {
      beforeEach(function() {
        return publishDraft = new PublishDraft({});
      });
      it("get draft path extname by config", function() {
        atom.config.set("markdown-writer.publishKeepFileExtname", true);
        publishDraft.draftPath = "test/name.md";
        return expect(publishDraft._getPostExtension()).toBe(".md");
      });
      return it("get default extname", function() {
        publishDraft.draftPath = "test/name.md";
        return expect(publishDraft._getPostExtension()).toBe(".markdown");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvc3BlYy9jb21tYW5kcy9wdWJsaXNoLWRyYWZ0LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGtDQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLDBCQUFBO0FBQUEsSUFBQSxPQUF5QixFQUF6QixFQUFDLGdCQUFELEVBQVMsc0JBQVQsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZ0JBQXBCLEVBQUg7TUFBQSxDQUFoQixDQUFBLENBQUE7YUFDQSxJQUFBLENBQUssU0FBQSxHQUFBO2VBQUcsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxFQUFaO01BQUEsQ0FBTCxFQUZTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQU1BLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTthQUNuQixFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQSxHQUFBO0FBQ2pELFFBQUEsWUFBQSxHQUFtQixJQUFBLFlBQUEsQ0FBYSxFQUFiLENBQW5CLENBQUE7QUFBQSxRQUNBLFlBQVksQ0FBQyxjQUFiLEdBQThCLFNBQUEsR0FBQTtpQkFBRyxHQUFIO1FBQUEsQ0FEOUIsQ0FBQTtBQUFBLFFBR0EsWUFBWSxDQUFDLE9BQWIsQ0FBQSxDQUhBLENBQUE7QUFBQSxRQUtBLE1BQUEsQ0FBTyxZQUFZLENBQUMsU0FBcEIsQ0FBOEIsQ0FBQyxP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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/spec/commands/publish-draft-spec.coffee
