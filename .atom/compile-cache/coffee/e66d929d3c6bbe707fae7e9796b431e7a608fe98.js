(function() {
  var TagListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  TagListView = require('../../lib/views/tag-list-view');

  describe("TagListView", function() {
    describe("when there are two tags", function() {
      return it("displays a list of tags", function() {
        var view;
        view = new TagListView(repo, "tag1\ntag2");
        return expect(view.items.length).toBe(2);
      });
    });
    return describe("when there are no tags", function() {
      return it("displays a message to 'Add Tag'", function() {
        var view;
        view = new TagListView(repo);
        expect(view.items.length).toBe(1);
        return expect(view.items[0].tag).toBe('+ Add Tag');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL3ZpZXdzL3RhZy1saXN0LXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0JBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsK0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLElBQUEsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTthQUNsQyxFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFXLElBQUEsV0FBQSxDQUFZLElBQVosRUFBa0IsWUFBbEIsQ0FBWCxDQUFBO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixDQUEvQixFQUY0QjtNQUFBLENBQTlCLEVBRGtDO0lBQUEsQ0FBcEMsQ0FBQSxDQUFBO1dBS0EsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTthQUNqQyxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBQ3BDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFXLElBQUEsV0FBQSxDQUFZLElBQVosQ0FBWCxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFsQixDQUF5QixDQUFDLElBQTFCLENBQStCLENBQS9CLENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLEdBQXJCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsV0FBL0IsRUFIb0M7TUFBQSxDQUF0QyxFQURpQztJQUFBLENBQW5DLEVBTnNCO0VBQUEsQ0FBeEIsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/views/tag-list-view-spec.coffee
