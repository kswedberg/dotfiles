(function() {
  var NewDraftView, NewFileView, NewPostView;

  NewFileView = require("../../lib/views/new-file-view");

  NewDraftView = require("../../lib/views/new-draft-view");

  NewPostView = require("../../lib/views/new-post-view");

  describe("NewFileView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
    });
    describe("NewFileView", function() {
      var newFileView;
      newFileView = null;
      beforeEach(function() {
        return newFileView = new NewFileView({});
      });
      describe('.getFileName', function() {
        return it("get filename in hexo format", function() {
          atom.config.set("markdown-writer.newFileFileName", "file-{title}{extension}");
          atom.config.set("markdown-writer.fileExtension", ".md");
          newFileView.titleEditor.setText("Hexo format");
          newFileView.dateEditor.setText("2014-11-19");
          return expect(newFileView.getFileName()).toBe("file-hexo-format.md");
        });
      });
      return describe('.generateFrontMatter', function() {
        it("generate correctly", function() {
          var frontMatter;
          frontMatter = {
            layout: "test",
            title: "the actual title",
            date: "2014-11-19"
          };
          return expect(newFileView.generateFrontMatter(frontMatter)).toBe("---\nlayout: test\ntitle: \"the actual title\"\ndate: \"2014-11-19\"\n---");
        });
        return it("generate based on setting", function() {
          var frontMatter;
          frontMatter = {
            layout: "test",
            title: "the actual title",
            date: "2014-11-19"
          };
          atom.config.set("markdown-writer.frontMatter", "title: <title>");
          return expect(newFileView.generateFrontMatter(frontMatter)).toBe("title: the actual title");
        });
      });
    });
    describe("NewDraftView", function() {
      var newDraftView;
      newDraftView = null;
      beforeEach(function() {
        return newDraftView = new NewDraftView({});
      });
      describe("class methods", function() {
        return it("override correctly", function() {
          expect(NewDraftView.fileType).toBe("Draft");
          expect(NewDraftView.pathConfig).toBe("siteDraftsDir");
          return expect(NewDraftView.fileNameConfig).toBe("newDraftFileName");
        });
      });
      describe(".display", function() {
        return it('display correct message', function() {
          newDraftView.display();
          newDraftView.dateEditor.setText("2015-08-23");
          newDraftView.titleEditor.setText("Draft Title");
          return expect(newDraftView.message.text()).toBe("Site Directory: /config/your/local/directory/in/settings/\nCreate Draft At: _drafts/draft-title.markdown");
        });
      });
      return describe(".getFrontMatter", function() {
        return it("get the correct front matter", function() {
          var frontMatter;
          newDraftView.dateEditor.setText("2015-08-23");
          newDraftView.titleEditor.setText("Draft Title");
          frontMatter = newDraftView.getFrontMatter();
          expect(frontMatter.layout).toBe("post");
          expect(frontMatter.published).toBe(false);
          expect(frontMatter.title).toBe("Draft Title");
          return expect(frontMatter.slug).toBe("draft-title");
        });
      });
    });
    return describe("NewPostView", function() {
      var newPostView;
      newPostView = null;
      beforeEach(function() {
        return newPostView = new NewPostView({});
      });
      describe("class methods", function() {
        return it("override correctly", function() {
          expect(NewPostView.fileType).toBe("Post");
          expect(NewPostView.pathConfig).toBe("sitePostsDir");
          return expect(NewPostView.fileNameConfig).toBe("newPostFileName");
        });
      });
      describe(".display", function() {
        return it('display correct message', function() {
          newPostView.display();
          newPostView.dateEditor.setText("2015-08-23");
          newPostView.titleEditor.setText("Post's Title");
          return expect(newPostView.message.text()).toBe("Site Directory: /config/your/local/directory/in/settings/\nCreate Post At: _posts/2015/2015-08-23-posts-title.markdown");
        });
      });
      return describe(".getFrontMatter", function() {
        return it("get the correct front matter", function() {
          var frontMatter;
          newPostView.dateEditor.setText("2015-08-24");
          newPostView.titleEditor.setText("Post's Title: Subtitle");
          frontMatter = newPostView.getFrontMatter();
          expect(frontMatter.layout).toBe("post");
          expect(frontMatter.published).toBe(true);
          expect(frontMatter.title).toBe("Post's Title: Subtitle");
          return expect(frontMatter.slug).toBe("posts-title-subtitle");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvc3BlYy92aWV3cy9uZXctZmlsZS12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSwrQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGdDQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsK0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGdCQUFwQixFQUFIO01BQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFHQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsVUFBQSxXQUFBO0FBQUEsTUFBQSxXQUFBLEdBQWMsSUFBZCxDQUFBO0FBQUEsTUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2VBQ1QsV0FBQSxHQUFrQixJQUFBLFdBQUEsQ0FBWSxFQUFaLEVBRFQ7TUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLE1BS0EsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO2VBQ3ZCLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsVUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLEVBQW1ELHlCQUFuRCxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FB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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/spec/views/new-file-view-spec.coffee
