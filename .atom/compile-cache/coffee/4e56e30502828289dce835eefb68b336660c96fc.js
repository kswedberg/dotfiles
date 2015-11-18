(function() {
  var NewFileView, NewPostView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NewFileView = require("./new-file-view");

  module.exports = NewPostView = (function(_super) {
    __extends(NewPostView, _super);

    function NewPostView() {
      return NewPostView.__super__.constructor.apply(this, arguments);
    }

    NewPostView.fileType = "Post";

    NewPostView.pathConfig = "sitePostsDir";

    NewPostView.fileNameConfig = "newPostFileName";

    return NewPostView;

  })(NewFileView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL3ZpZXdzL25ldy1wb3N0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGlCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxXQUFDLENBQUEsUUFBRCxHQUFZLE1BQVosQ0FBQTs7QUFBQSxJQUNBLFdBQUMsQ0FBQSxVQUFELEdBQWMsY0FEZCxDQUFBOztBQUFBLElBRUEsV0FBQyxDQUFBLGNBQUQsR0FBa0IsaUJBRmxCLENBQUE7O3VCQUFBOztLQUR3QixZQUgxQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/views/new-post-view.coffee
