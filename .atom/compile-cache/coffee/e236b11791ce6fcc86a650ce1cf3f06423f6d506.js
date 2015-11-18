(function() {
  var FrontMatter;

  FrontMatter = require("../../lib/helpers/front-matter");

  describe("FrontMatter", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe("editor without front matter", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
      it("is empty when editor is empty", function() {
        var frontMatter;
        frontMatter = new FrontMatter(editor);
        return expect(frontMatter.isEmpty).toBe(true);
      });
      it("is empty when editor has no front matter", function() {
        var frontMatter;
        editor.setText("some random text 1\nsome random text 2");
        frontMatter = new FrontMatter(editor);
        return expect(frontMatter.isEmpty).toBe(true);
      });
      return it("is empty when editor has invalid front matter", function() {
        var frontMatter;
        editor.setText("---\n---\n\nsome random text 1\nsome random text 2");
        frontMatter = new FrontMatter(editor);
        return expect(frontMatter.isEmpty).toBe(true);
      });
    });
    describe("editor with jekyll front matter", function() {
      var editor, frontMatter, _ref;
      _ref = [], editor = _ref[0], frontMatter = _ref[1];
      beforeEach(function() {
        editor = atom.workspace.getActiveTextEditor();
        editor.setText("---\ntitle: Markdown Writer (Jekyll)\ndate: 2015-08-12 23:19\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        return frontMatter = new FrontMatter(editor);
      });
      it("is not empty", function() {
        return expect(frontMatter.isEmpty).toBe(false);
      });
      it("has fields", function() {
        expect(frontMatter.has("title")).toBe(true);
        expect(frontMatter.has("date")).toBe(true);
        expect(frontMatter.has("categories")).toBe(true);
        return expect(frontMatter.has("tags")).toBe(true);
      });
      it("get field value", function() {
        expect(frontMatter.get("title")).toBe("Markdown Writer (Jekyll)");
        return expect(frontMatter.get("date")).toBe("2015-08-12 23:19");
      });
      it("set field value", function() {
        frontMatter.set("title", "Markdown Writer");
        return expect(frontMatter.get("title")).toBe("Markdown Writer");
      });
      it("normalize field to an array", function() {
        expect(frontMatter.normalizeField("field")).toEqual([]);
        expect(frontMatter.normalizeField("categories")).toEqual(["Markdown"]);
        return expect(frontMatter.normalizeField("tags")).toEqual(["Writer", "Jekyll"]);
      });
      it("get content text with leading fence", function() {
        return expect(frontMatter.getContentText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n");
      });
      return it("save the content to editor", function() {
        frontMatter.save();
        return expect(editor.getText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
      });
    });
    return describe("editor with hexo front matter", function() {
      var editor, frontMatter, _ref;
      _ref = [], editor = _ref[0], frontMatter = _ref[1];
      beforeEach(function() {
        editor = atom.workspace.getActiveTextEditor();
        editor.setText("title: Markdown Writer (Hexo)\ndate: 2015-08-12 23:19\n---\n\nsome random text 1\nsome random text 2");
        return frontMatter = new FrontMatter(editor);
      });
      it("is not empty", function() {
        return expect(frontMatter.isEmpty).toBe(false);
      });
      it("has field title/date", function() {
        expect(frontMatter.has("title")).toBe(true);
        return expect(frontMatter.has("date")).toBe(true);
      });
      it("get field value", function() {
        expect(frontMatter.get("title")).toBe("Markdown Writer (Hexo)");
        return expect(frontMatter.get("date")).toBe("2015-08-12 23:19");
      });
      return it("get content text without leading fence", function() {
        return expect(frontMatter.getContentText()).toBe("title: Markdown Writer (Hexo)\ndate: '2015-08-12 23:19'\n---\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvc3BlYy9oZWxwZXJzL2Zyb250LW1hdHRlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQ0FBUixDQUFkLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsdUJBQXBCLEVBQUg7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUdBLFFBQUEsQ0FBUyw2QkFBVCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBVCxDQUFBO0FBQUEsTUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxFQURBO01BQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxNQUtBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsWUFBQSxXQUFBO0FBQUEsUUFBQSxXQUFBLEdBQWtCLElBQUEsV0FBQSxDQUFZLE1BQVosQ0FBbEIsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxXQUFXLENBQUMsT0FBbkIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyxJQUFqQyxFQUZrQztNQUFBLENBQXBDLENBTEEsQ0FBQTtBQUFBLE1BU0EsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUEsR0FBQTtBQUM3QyxZQUFBLFdBQUE7QUFBQSxRQUFBLE1B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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/spec/helpers/front-matter-spec.coffee
