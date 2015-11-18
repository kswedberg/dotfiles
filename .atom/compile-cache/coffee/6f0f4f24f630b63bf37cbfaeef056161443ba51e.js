(function() {
  var ManagePostCategoriesView, ManagePostTagsView;

  ManagePostCategoriesView = require("../../lib/views/manage-post-categories-view");

  ManagePostTagsView = require("../../lib/views/manage-post-tags-view");

  describe("ManageFrontMatterView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe("ManagePostCategoriesView", function() {
      var categoriesView, editor, _ref;
      _ref = [], editor = _ref[0], categoriesView = _ref[1];
      beforeEach(function() {
        return categoriesView = new ManagePostCategoriesView({});
      });
      describe("when editor has malformed front matter", function() {
        return it("does nothing", function() {
          atom.confirm = function() {
            return {};
          };
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("---\ntitle: Markdown Writer (Jekyll)\n----\n---");
          categoriesView.display();
          return expect(categoriesView.panel.isVisible()).toBe(false);
        });
      });
      return describe("when editor has front matter", function() {
        beforeEach(function() {
          editor = atom.workspace.getActiveTextEditor();
          return editor.setText("---\ntitle: Markdown Writer (Jekyll)\ndate: 2015-08-12 23:19\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        });
        it("display edit panel", function() {
          categoriesView.display();
          return expect(categoriesView.panel.isVisible()).toBe(true);
        });
        return it("updates editor text", function() {
          categoriesView.display();
          categoriesView.saveFrontMatter();
          expect(categoriesView.panel.isVisible()).toBe(false);
          return expect(editor.getText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories:\n  - Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        });
      });
    });
    return describe("ManagePostTagsView", function() {
      var editor, tagsView, _ref;
      _ref = [], editor = _ref[0], tagsView = _ref[1];
      beforeEach(function() {
        return tagsView = new ManagePostTagsView({});
      });
      it("rank tags", function() {
        var fixture, tags;
        fixture = "ab ab cd ab ef gh ef";
        tags = ["ab", "cd", "ef", "ij"].map(function(t) {
          return {
            name: t
          };
        });
        tagsView.rankTags(tags, fixture);
        return expect(tags).toEqual([
          {
            name: "ab",
            count: 3
          }, {
            name: "ef",
            count: 2
          }, {
            name: "cd",
            count: 1
          }, {
            name: "ij",
            count: 0
          }
        ]);
      });
      return it("rank tags with regex escaped", function() {
        var fixture, tags;
        fixture = "c++ c.c^abc $10.0 +abc";
        tags = ["c++", "\\", "^", "$", "+abc"].map(function(t) {
          return {
            name: t
          };
        });
        tagsView.rankTags(tags, fixture);
        return expect(tags).toEqual([
          {
            name: "c++",
            count: 1
          }, {
            name: "^",
            count: 1
          }, {
            name: "$",
            count: 1
          }, {
            name: "+abc",
            count: 1
          }, {
            name: "\\",
            count: 0
          }
        ]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvc3BlYy92aWV3cy9tYW5hZ2UtZnJvbnQtbWF0dGVyLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNENBQUE7O0FBQUEsRUFBQSx3QkFBQSxHQUEyQixPQUFBLENBQVEsNkNBQVIsQ0FBM0IsQ0FBQTs7QUFBQSxFQUNBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx1Q0FBUixDQURyQixDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQix1QkFBcEIsRUFBSDtNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBR0EsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxVQUFBLDRCQUFBO0FBQUEsTUFBQSxPQUEyQixFQUEzQixFQUFDLGdCQUFELEVBQVMsd0JBQVQsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGNBQUEsR0FBcUIsSUFBQSx3QkFBQSxDQUF5QixFQUF6QixFQURaO01BQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxNQUtBLFFBQUEsQ0FBUyx3Q0FBVCxFQUFtRCxTQUFBLEdBQUE7ZUFDakQsRUFBQSxDQUFHLGNBQUgsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFVBQUEsSUFBSSxDQUFDLE9BQUwsR0FBZSxTQUFBLEdBQUE7bUJBQUcsR0FBSDtVQUFBLENBQWYsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJB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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/spec/views/manage-front-matter-view-spec.coffee
