(function() {
  var $, FrontMatter, ManageFrontMatterView, TextEditorView, View, config, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  config = require("../config");

  utils = require("../utils");

  FrontMatter = require("../helpers/front-matter");

  module.exports = ManageFrontMatterView = (function(_super) {
    __extends(ManageFrontMatterView, _super);

    function ManageFrontMatterView() {
      return ManageFrontMatterView.__super__.constructor.apply(this, arguments);
    }

    ManageFrontMatterView.labelName = "Manage Field";

    ManageFrontMatterView.fieldName = "fieldName";

    ManageFrontMatterView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-selection"
      }, (function(_this) {
        return function() {
          _this.label(_this.labelName, {
            "class": "icon icon-book"
          });
          _this.p({
            "class": "error",
            outlet: "error"
          });
          _this.subview("fieldEditor", new TextEditorView({
            mini: true
          }));
          return _this.ul({
            "class": "candidates",
            outlet: "candidates"
          }, function() {
            return _this.li("Loading...");
          });
        };
      })(this));
    };

    ManageFrontMatterView.prototype.initialize = function() {
      this.candidates.on("click", "li", (function(_this) {
        return function(e) {
          return _this.appendFieldItem(e);
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.saveFrontMatter();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    ManageFrontMatterView.prototype.display = function() {
      this.editor = atom.workspace.getActiveTextEditor();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.fetchSiteFieldCandidates();
      this.frontMatter = new FrontMatter(this.editor);
      if (this.frontMatter.parseError) {
        return this.detach();
      }
      this.frontMatter.normalizeField(this.constructor.fieldName);
      this.setEditorFieldItems(this.frontMatter.get(this.constructor.fieldName));
      this.panel.show();
      return this.fieldEditor.focus();
    };

    ManageFrontMatterView.prototype.detach = function() {
      var _ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((_ref1 = this.previouslyFocusedElement) != null) {
          _ref1.focus();
        }
      }
      return ManageFrontMatterView.__super__.detach.apply(this, arguments);
    };

    ManageFrontMatterView.prototype.saveFrontMatter = function() {
      this.frontMatter.set(this.constructor.fieldName, this.getEditorFieldItems());
      this.frontMatter.save();
      return this.detach();
    };

    ManageFrontMatterView.prototype.setEditorFieldItems = function(fieldItems) {
      return this.fieldEditor.setText(fieldItems.join(","));
    };

    ManageFrontMatterView.prototype.getEditorFieldItems = function() {
      return this.fieldEditor.getText().split(/\s*,\s*/).filter(function(c) {
        return !!c.trim();
      });
    };

    ManageFrontMatterView.prototype.fetchSiteFieldCandidates = function() {};

    ManageFrontMatterView.prototype.displaySiteFieldItems = function(siteFieldItems) {
      var fieldItems, tagElems;
      fieldItems = this.frontMatter.get(this.constructor.fieldName) || [];
      tagElems = siteFieldItems.map(function(tag) {
        if (fieldItems.indexOf(tag) < 0) {
          return "<li>" + tag + "</li>";
        } else {
          return "<li class='selected'>" + tag + "</li>";
        }
      });
      return this.candidates.empty().append(tagElems.join(""));
    };

    ManageFrontMatterView.prototype.appendFieldItem = function(e) {
      var fieldItem, fieldItems, idx;
      fieldItem = e.target.textContent;
      fieldItems = this.getEditorFieldItems();
      idx = fieldItems.indexOf(fieldItem);
      if (idx < 0) {
        fieldItems.push(fieldItem);
        e.target.classList.add("selected");
      } else {
        fieldItems.splice(idx, 1);
        e.target.classList.remove("selected");
      }
      this.setEditorFieldItems(fieldItems);
      return this.fieldEditor.focus();
    };

    return ManageFrontMatterView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL3ZpZXdzL21hbmFnZS1mcm9udC1tYXR0ZXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0ZBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixFQUFVLHNCQUFBLGNBQVYsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUZULENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FIUixDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSx5QkFBUixDQUpkLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEscUJBQUMsQ0FBQSxTQUFELEdBQVksY0FBWixDQUFBOztBQUFBLElBQ0EscUJBQUMsQ0FBQSxTQUFELEdBQVksV0FEWixDQUFBOztBQUFBLElBR0EscUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDJDQUFQO09BQUwsRUFBeUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN2RCxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sS0FBQyxDQUFBLFNBQVIsRUFBbUI7QUFBQSxZQUFBLE9BQUEsRUFBTyxnQkFBUDtXQUFuQixDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO0FBQUEsWUFBZ0IsTUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/views/manage-front-matter-view.coffee
