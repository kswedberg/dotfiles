(function() {
  var $, $$, SelectListMultipleView, SelectListView, View, fuzzyFilter, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fuzzyFilter = require('../models/fuzzy').filter;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View, SelectListView = _ref.SelectListView;

  module.exports = SelectListMultipleView = (function(_super) {
    var selectedItems;

    __extends(SelectListMultipleView, _super);

    function SelectListMultipleView() {
      return SelectListMultipleView.__super__.constructor.apply(this, arguments);
    }

    selectedItems = [];

    SelectListMultipleView.prototype.initialize = function() {
      SelectListMultipleView.__super__.initialize.apply(this, arguments);
      selectedItems = [];
      this.list.addClass('mark-active');
      this.on('mousedown', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if (target === _this.list[0] || $(target).hasClass('btn')) {
            return false;
          }
        };
      })(this));
      this.on('keypress', (function(_this) {
        return function(_arg) {
          var keyCode;
          keyCode = _arg.keyCode;
          if (keyCode === 13) {
            return _this.complete();
          }
        };
      })(this));
      return this.addButtons();
    };

    SelectListMultipleView.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-complete-button'
              }, 'Confirm');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-complete-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectListMultipleView.prototype.confirmSelection = function() {
      var item, viewItem;
      item = this.getSelectedItem();
      viewItem = this.getSelectedItemView();
      if (viewItem != null) {
        return this.confirmed(item, viewItem);
      } else {
        return this.cancel();
      }
    };

    SelectListMultipleView.prototype.confirmed = function(item, viewItem) {
      if (__indexOf.call(selectedItems, item) >= 0) {
        selectedItems = selectedItems.filter(function(i) {
          return i !== item;
        });
        return viewItem.removeClass('active');
      } else {
        selectedItems.push(item);
        return viewItem.addClass('active');
      }
    };

    SelectListMultipleView.prototype.complete = function() {
      if (selectedItems.length > 0) {
        return this.completed(selectedItems);
      } else {
        return this.cancel();
      }
    };

    SelectListMultipleView.prototype.populateList = function() {
      var filterQuery, filteredItems, i, item, itemView, options, _i, _ref1, _ref2, _ref3;
      if (this.items == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      if (filterQuery.length) {
        options = {
          pre: '<span class="text-warning" style="font-weight:bold">',
          post: "</span>",
          extract: (function(_this) {
            return function(el) {
              if (_this.getFilterKey() != null) {
                return el[_this.getFilterKey()];
              } else {
                return el;
              }
            };
          })(this)
        };
        filteredItems = fuzzyFilter(filterQuery, this.items, options);
      } else {
        filteredItems = this.items;
      }
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = _i = 0, _ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          item = (_ref2 = filteredItems[i].original) != null ? _ref2 : filteredItems[i];
          itemView = $(this.viewForItem(item, (_ref3 = filteredItems[i].string) != null ? _ref3 : null));
          itemView.data('select-list-item', item);
          if (__indexOf.call(selectedItems, item) >= 0) {
            itemView.addClass('active');
          }
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    SelectListMultipleView.prototype.viewForItem = function(item, matchedStr) {
      throw new Error("Subclass must implement a viewForItem(item) method");
    };

    SelectListMultipleView.prototype.completed = function(items) {
      throw new Error("Subclass must implement a completed(items) method");
    };

    return SelectListMultipleView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvc2VsZWN0LWxpc3QtbXVsdGlwbGUtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0VBQUE7SUFBQTs7eUpBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGlCQUFSLENBQTBCLENBQUMsTUFBekMsQ0FBQTs7QUFBQSxFQUNBLE9BQWdDLE9BQUEsQ0FBUSxzQkFBUixDQUFoQyxFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLFlBQUEsSUFBUixFQUFjLHNCQUFBLGNBRGQsQ0FBQTs7QUFBQSxFQWtDQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosUUFBQSxhQUFBOztBQUFBLDZDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGFBQUEsR0FBZ0IsRUFBaEIsQ0FBQTs7QUFBQSxxQ0FLQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSx3REFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsYUFBQSxHQUFnQixFQURoQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBZSxhQUFmLENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLEVBQUQsQ0FBSSxXQUFKLEVBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUNmLGNBQUEsTUFBQTtBQUFBLFVBRGlCLFNBQUQsS0FBQyxNQUNqQixDQUFBO0FBQUEsVUFBQSxJQUFTLE1BQUEsS0FBVSxLQUFDLENBQUEsSUFBSyxDQUFBLENBQUEsQ0FBaEIsSUFBc0IsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLFFBQVYsQ0FBbUIsS0FBbkIsQ0FBL0I7bUJBQUEsTUFBQTtXQURlO1FB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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/select-list-multiple-view.coffee
