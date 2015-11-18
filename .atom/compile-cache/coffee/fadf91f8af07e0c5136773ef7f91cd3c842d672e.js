(function() {
  var InsertTableView;

  InsertTableView = require("../../lib/views/insert-table-view");

  describe("InsertTableView", function() {
    var insertTableView;
    insertTableView = null;
    beforeEach(function() {
      return insertTableView = new InsertTableView({});
    });
    it("validates table rows/columns", function() {
      expect(insertTableView.isValidRange(1, 1)).toBe(false);
      return expect(insertTableView.isValidRange(2, 2)).toBe(true);
    });
    describe("tableExtraPipes disabled", function() {
      it("create correct (2,2) table", function() {
        var table;
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["  |  ", "--|--", "  |  "].join("\n"));
      });
      return it("create correct (3,4) table", function() {
        var table;
        table = insertTableView.createTable(3, 4);
        return expect(table).toEqual(["  |   |   |  ", "--|---|---|--", "  |   |   |  ", "  |   |   |  "].join("\n"));
      });
    });
    describe("tableExtraPipes enabled", function() {
      beforeEach(function() {
        return atom.config.set("markdown-writer.tableExtraPipes", true);
      });
      it("create correct (2,2) table", function() {
        var table;
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["|   |   |", "|---|---|", "|   |   |"].join("\n"));
      });
      return it("create correct (3,4) table", function() {
        var table;
        table = insertTableView.createTable(3, 4);
        return expect(table).toEqual(["|   |   |   |   |", "|---|---|---|---|", "|   |   |   |   |", "|   |   |   |   |"].join("\n"));
      });
    });
    return describe("tableAlignment has set", function() {
      it("create correct (2,2) table (center)", function() {
        var table;
        atom.config.set("markdown-writer.tableAlignment", "center");
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["  |  ", "::|::", "  |  "].join("\n"));
      });
      it("create correct (2,2) table (left)", function() {
        var table;
        atom.config.set("markdown-writer.tableExtraPipes", true);
        atom.config.set("markdown-writer.tableAlignment", "left");
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["|   |   |", "|:--|:--|", "|   |   |"].join("\n"));
      });
      return it("create correct (2,2) table (right)", function() {
        var table;
        atom.config.set("markdown-writer.tableExtraPipes", true);
        atom.config.set("markdown-writer.tableAlignment", "right");
        table = insertTableView.createTable(2, 2);
        return expect(table).toEqual(["|   |   |", "|--:|--:|", "|   |   |"].join("\n"));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvc3BlYy92aWV3cy9pbnNlcnQtdGFibGUtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxlQUFBOztBQUFBLEVBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsbUNBQVIsQ0FBbEIsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSxlQUFBO0FBQUEsSUFBQSxlQUFBLEdBQWtCLElBQWxCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFBRyxlQUFBLEdBQXNCLElBQUEsZUFBQSxDQUFnQixFQUFoQixFQUF6QjtJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFJQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLE1BQUEsTUFBQSxDQUFPLGVBQWUsQ0FBQyxZQUFoQixDQUE2QixDQUE3QixFQUFnQyxDQUFoQyxDQUFQLENBQTBDLENBQUMsSUFBM0MsQ0FBZ0QsS0FBaEQsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLGVBQWUsQ0FBQyxZQUFoQixDQUE2QixDQUE3QixFQUFnQyxDQUFoQyxDQUFQLENBQTBDLENBQUMsSUFBM0MsQ0FBZ0QsSUFBaEQsRUFGaUM7SUFBQSxDQUFuQyxDQUpBLENBQUE7QUFBQSxJQVFBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsTUFBQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFlBQUEsS0FBQTtBQUFBLFFBQUEsS0FBQSxHQUFRLGVBQWUsQ0FBQyxXQUFoQixDQUE0QixDQUE1QixFQUErQixDQUEvQixDQUFSLENBQUE7ZUFDQSxNQUFBLENBQU8s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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/spec/views/insert-table-view-spec.coffee
