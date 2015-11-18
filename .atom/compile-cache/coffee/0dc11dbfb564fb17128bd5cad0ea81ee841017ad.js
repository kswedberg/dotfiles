(function() {
  var $$, BufferedProcess, SelectListView, TagCreateView, TagListView, TagView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  TagView = require('./tag-view');

  TagCreateView = require('./tag-create-view');

  module.exports = TagListView = (function(_super) {
    __extends(TagListView, _super);

    function TagListView() {
      return TagListView.__super__.constructor.apply(this, arguments);
    }

    TagListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data != null ? data : '';
      TagListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagListView.prototype.parseData = function() {
      var item, items, tmp;
      if (this.data.length > 0) {
        this.data = this.data.split("\n").slice(0, -1);
        items = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.data.reverse();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            if (!(item !== '')) {
              continue;
            }
            tmp = item.match(/([\w\d-_/.]+)\s(.*)/);
            _results.push({
              tag: tmp != null ? tmp[1] : void 0,
              annotation: tmp != null ? tmp[2] : void 0
            });
          }
          return _results;
        }).call(this);
      } else {
        items = [];
      }
      items.push({
        tag: '+ Add Tag',
        annotation: 'Add a tag referencing the current commit.'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagListView.prototype.getFilterKey = function() {
      return 'tag';
    };

    TagListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagListView.prototype.cancelled = function() {
      return this.hide();
    };

    TagListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    TagListView.prototype.viewForItem = function(_arg) {
      var annotation, tag;
      tag = _arg.tag, annotation = _arg.annotation;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, tag);
            return _this.div({
              "class": 'text-warning'
            }, annotation);
          };
        })(this));
      });
    };

    TagListView.prototype.confirmed = function(_arg) {
      var tag;
      tag = _arg.tag;
      this.cancel();
      if (tag === '+ Add Tag') {
        return new TagCreateView(this.repo);
      } else {
        return new TagView(this.repo, tag);
      }
    };

    return TagListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvdGFnLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQSxPQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxVQUFBLEVBQUQsRUFBSyxzQkFBQSxjQURMLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FIVixDQUFBOztBQUFBLEVBSUEsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVIsQ0FKaEIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixrQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsMEJBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFTLElBQVQsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFEa0IsSUFBQyxDQUFBLHNCQUFBLE9BQUssRUFDeEIsQ0FBQTtBQUFBLE1BQUEsNkNBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxFQUhVO0lBQUEsQ0FBWixDQUFBOztBQUFBLDBCQUtBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGdCQUFBO0FBQUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixHQUFlLENBQWxCO0FBQ0UsUUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLElBQVosQ0FBa0IsYUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/tag-list-view.coffee
