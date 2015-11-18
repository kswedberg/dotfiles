(function() {
  var ManageFrontMatterView, ManagePostTagsView, config, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  config = require("../config");

  utils = require("../utils");

  ManageFrontMatterView = require("./manage-front-matter-view");

  module.exports = ManagePostTagsView = (function(_super) {
    __extends(ManagePostTagsView, _super);

    function ManagePostTagsView() {
      return ManagePostTagsView.__super__.constructor.apply(this, arguments);
    }

    ManagePostTagsView.labelName = "Manage Post Tags";

    ManagePostTagsView.fieldName = "tags";

    ManagePostTagsView.prototype.fetchSiteFieldCandidates = function() {
      var error, succeed, uri;
      uri = config.get("urlForTags");
      succeed = (function(_this) {
        return function(body) {
          var tags;
          tags = body.tags.map(function(tag) {
            return {
              name: tag,
              count: 0
            };
          });
          _this.rankTags(tags, _this.editor.getText());
          return _this.displaySiteFieldItems(tags.map(function(tag) {
            return tag.name;
          }));
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.error.text((err != null ? err.message : void 0) || ("Error fetching tags from '" + uri + "'"));
        };
      })(this);
      return utils.getJSON(uri, succeed, error);
    };

    ManagePostTagsView.prototype.rankTags = function(tags, content) {
      tags.forEach(function(tag) {
        var tagRegex, _ref;
        tagRegex = RegExp("" + (utils.regexpEscape(tag.name)), "ig");
        return tag.count = ((_ref = content.match(tagRegex)) != null ? _ref.length : void 0) || 0;
      });
      return tags.sort(function(t1, t2) {
        return t2.count - t1.count;
      });
    };

    return ManagePostTagsView;

  })(ManageFrontMatterView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL3ZpZXdzL21hbmFnZS1wb3N0LXRhZ3Mtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0RBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUFULENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FEUixDQUFBOztBQUFBLEVBR0EscUJBQUEsR0FBd0IsT0FBQSxDQUFRLDRCQUFSLENBSHhCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oseUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsa0JBQUMsQ0FBQSxTQUFELEdBQVksa0JBQVosQ0FBQTs7QUFBQSxJQUNBLGtCQUFDLENBQUEsU0FBRCxHQUFZLE1BRFosQ0FBQTs7QUFBQSxpQ0FHQSx3QkFBQSxHQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxtQkFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLE1BQU0sQ0FBQyxHQUFQLENBQVcsWUFBWCxDQUFOLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDUixjQUFBLElBQUE7QUFBQSxVQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQVYsQ0FBYyxTQUFDLEdBQUQsR0FBQTttQkFBUztBQUFBLGNBQUEsSUFBQSxFQUFNLEdBQU47QUFBQSxjQUFXLEtBQUEsRUFBTyxDQUFsQjtjQUFUO1VBQUEsQ0FBZCxDQUFQLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFnQixLQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUFoQixDQURBLENBQUE7aUJBRUEsS0FBQyxDQUFBLHFCQUFELENBQXVCLElBQUksQ0FBQyxHQUFMLENBQVMsU0FBQyxHQUFELEdBQUE7bUJBQVMsR0FBRyxDQUFDLEtBQWI7VUFBQSxDQUFULENBQXZCLEVBSFE7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURWLENBQUE7QUFBQSxNQUtBLEtBQUEsR0FBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEdBQUE7aUJBQ04sS0FBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLGdCQUFZLEdBQUcsQ0FBRSxpQkFBTCxJQUFnQixDQUFDLDRCQUFBLEdBQTRCLEdBQTVCLEdBQWdDLEdBQWpDLENBQTVCLEVBRE07UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUxSLENBQUE7YUFPQSxLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsRUFBbUIsT0FBbkIsRUFBNEIsS0FBNUIsRUFSd0I7SUFBQSxDQUgxQixDQUFBOztBQUFBLGlDQWNBLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBQyxHQUFELEdBQUE7QUFDWCxZQUFBLGNBQUE7QUFBQSxRQUFBLFFBQUEsR0FBVyxNQUFBLENBQUEsRUFBQSxHQUFLLENBQUMsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsR0FBRyxDQUFDLElBQXZCLENBQUQsQ0FBTCxFQUF1QyxJQUF2QyxDQUFYLENBQUE7ZUFDQSxHQUFHLENBQUMsS0FBSixtREFBbUMsQ0FBRSxnQkFBekIsSUFBbUMsRUFGcEM7TUFBQSxDQUFiLENBQUEsQ0FBQTthQUdBLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBQyxFQUFELEVBQUssRUFBTCxHQUFBO2VBQVksRUFBRSxDQUFDLEtBQUgsR0FBVyxFQUFFLENBQUMsTUFBMUI7TUFBQSxDQUFWLEVBSlE7SUFBQSxDQWRWLENBQUE7OzhCQUFBOztLQUQrQixzQkFOakMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/views/manage-post-tags-view.coffee
