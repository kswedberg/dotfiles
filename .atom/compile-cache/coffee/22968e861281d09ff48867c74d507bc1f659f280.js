(function() {
  var InsertImageView;

  InsertImageView = require("../../lib/views/insert-image-view");

  describe("InsertImageView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("empty.markdown");
      });
    });
    return it('can be initialized', function() {
      var insertImageView;
      return insertImageView = new InsertImageView({});
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvc3BlYy92aWV3cy9pbnNlcnQtaW1hZ2Utdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxlQUFBOztBQUFBLEVBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsbUNBQVIsQ0FBbEIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZ0JBQXBCLEVBQUg7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUFBLENBQUE7V0FHQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFVBQUEsZUFBQTthQUFBLGVBQUEsR0FBc0IsSUFBQSxlQUFBLENBQWdCLEVBQWhCLEVBREM7SUFBQSxDQUF6QixFQUowQjtFQUFBLENBQTVCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/spec/views/insert-image-view-spec.coffee
