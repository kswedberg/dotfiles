(function() {
  var ManageFrontMatterView, ManagePostCategoriesView, config, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = require("../config");

  utils = require("../utils");

  ManageFrontMatterView = require("./manage-front-matter-view");

  module.exports = ManagePostCategoriesView = (function(_super) {
    __extends(ManagePostCategoriesView, _super);

    function ManagePostCategoriesView() {
      return ManagePostCategoriesView.__super__.constructor.apply(this, arguments);
    }

    ManagePostCategoriesView.labelName = "Manage Post Categories";

    ManagePostCategoriesView.fieldName = "categories";

    ManagePostCategoriesView.prototype.fetchSiteFieldCandidates = function() {
      var error, succeed, uri;
      uri = config.get("urlForCategories");
      succeed = (function(_this) {
        return function(body) {
          return _this.displaySiteFieldItems(body.categories || []);
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || ("Error fetching categories from '" + uri + "'"));
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    return ManagePostCategoriesView;

  })(ManageFrontMatterView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL3ZpZXdzL21hbmFnZS1wb3N0LWNhdGVnb3JpZXMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOERBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUFULENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FEUixDQUFBOztBQUFBLEVBR0EscUJBQUEsR0FBd0IsT0FBQSxDQUFRLDRCQUFSLENBSHhCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osK0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsd0JBQUMsQ0FBQSxTQUFELEdBQVksd0JBQVosQ0FBQTs7QUFBQSxJQUNBLHdCQUFDLENBQUEsU0FBRCxHQUFZLFlBRFosQ0FBQTs7QUFBQSx1Q0FHQSx3QkFBQSxHQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxtQkFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLE1BQU0sQ0FBQyxHQUFQLENBQVcsa0JBQVgsQ0FBTixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO2lCQUNSLEtBQUMsQ0FBQSxxQkFBRCxDQUF1QixJQUFJLENBQUMsVUFBTCxJQUFtQixFQUExQyxFQURRO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEVixDQUFBO0FBQUEsTUFHQSxLQUFBLEdBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsR0FBRCxHQUFBO2lCQUNOLEtBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxnQkFBWSxHQUFHLENBQUUsaUJBQUwsSUFBZ0IsQ0FBQyxrQ0FBQSxHQUFrQyxHQUFsQyxHQUFzQyxHQUF2QyxDQUE1QixFQURNO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIUixDQUFBO2FBS0EsS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFkLEVBQW1CLE9BQW5CLEVBQTRCLEtBQTVCLEVBTndCO0lBQUEsQ0FIMUIsQ0FBQTs7b0NBQUE7O0tBRHFDLHNCQU52QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/views/manage-post-categories-view.coffee
