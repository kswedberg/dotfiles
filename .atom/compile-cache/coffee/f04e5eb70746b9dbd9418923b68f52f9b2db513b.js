(function() {
  var $, NewFileView, TextEditorView, View, config, fs, path, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  config = require("../config");

  utils = require("../utils");

  module.exports = NewFileView = (function(_super) {
    __extends(NewFileView, _super);

    function NewFileView() {
      return NewFileView.__super__.constructor.apply(this, arguments);
    }

    NewFileView.fileType = "File";

    NewFileView.pathConfig = "siteFilesDir";

    NewFileView.fileNameConfig = "newFileFileName";

    NewFileView.content = function() {
      return this.div({
        "class": "markdown-writer"
      }, (function(_this) {
        return function() {
          _this.label("Add New " + _this.fileType, {
            "class": "icon icon-file-add"
          });
          _this.div(function() {
            _this.label("Directory", {
              "class": "message"
            });
            _this.subview("pathEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Date", {
              "class": "message"
            });
            _this.subview("dateEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Title", {
              "class": "message"
            });
            return _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
          });
          _this.p({
            "class": "message",
            outlet: "message"
          });
          return _this.p({
            "class": "error",
            outlet: "error"
          });
        };
      })(this));
    };

    NewFileView.prototype.initialize = function() {
      utils.setTabIndex([this.titleEditor, this.pathEditor, this.dateEditor]);
      this.pathEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.dateEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      this.titleEditor.getModel().onDidChange((function(_this) {
        return function() {
          return _this.updatePath();
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.createPost();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    NewFileView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.dateEditor.setText(utils.getDateStr());
      this.pathEditor.setText(utils.dirTemplate(config.get(this.constructor.pathConfig)));
      this.panel.show();
      return this.titleEditor.focus();
    };

    NewFileView.prototype.detach = function() {
      var _ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((_ref1 = this.previouslyFocusedElement) != null) {
          _ref1.focus();
        }
      }
      return NewFileView.__super__.detach.apply(this, arguments);
    };

    NewFileView.prototype.createPost = function() {
      var error, post;
      try {
        post = this.getFullPath();
        if (fs.existsSync(post)) {
          return this.error.text("File " + (this.getFullPath()) + " already exists!");
        } else {
          fs.writeFileSync(post, this.generateFrontMatter(this.getFrontMatter()));
          atom.workspace.open(post);
          return this.detach();
        }
      } catch (_error) {
        error = _error;
        return this.error.text("" + error.message);
      }
    };

    NewFileView.prototype.updatePath = function() {
      return this.message.html("<b>Site Directory:</b> " + (config.get('siteLocalDir')) + "/<br/>\n<b>Create " + this.constructor.fileType + " At:</b> " + (this.getPostPath()));
    };

    NewFileView.prototype.getFullPath = function() {
      return path.join(config.get("siteLocalDir"), this.getPostPath());
    };

    NewFileView.prototype.getPostPath = function() {
      return path.join(this.pathEditor.getText(), this.getFileName());
    };

    NewFileView.prototype.getFileName = function() {
      var info, template;
      template = config.get(this.constructor.fileNameConfig);
      info = {
        title: utils.dasherize(this.getTitle()),
        extension: config.get("fileExtension")
      };
      return utils.template(template, $.extend(info, this.getDate()));
    };

    NewFileView.prototype.getTitle = function() {
      return this.titleEditor.getText() || ("New " + this.constructor.fileType);
    };

    NewFileView.prototype.getDate = function() {
      return utils.parseDateStr(this.dateEditor.getText());
    };

    NewFileView.prototype.getPublished = function() {
      return this.constructor.fileType === 'Post';
    };

    NewFileView.prototype.generateFrontMatter = function(data) {
      return utils.template(config.get("frontMatter"), data);
    };

    NewFileView.prototype.getFrontMatter = function() {
      return {
        layout: "post",
        published: this.getPublished(),
        title: this.getTitle(),
        slug: utils.dasherize(this.getTitle()),
        date: "" + (this.dateEditor.getText()) + " " + (utils.getTimeStr()),
        dateTime: this.getDate()
      };
    };

    return NewFileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL3ZpZXdzL25ldy1maWxlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1FQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosRUFBVSxzQkFBQSxjQUFWLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUpULENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FMUixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxRQUFELEdBQVksTUFBWixDQUFBOztBQUFBLElBQ0EsV0FBQyxDQUFBLFVBQUQsR0FBYyxjQURkLENBQUE7O0FBQUEsSUFFQSxXQUFDLENBQUEsY0FBRCxHQUFrQixpQkFGbEIsQ0FBQTs7QUFBQSxJQUlBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGlCQUFQO09BQUwsRUFBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM3QixVQUFBLEtBQUMsQ0FBQSxLQUFELENBQVEsVUFBQSxHQUFVLEtBQUMsQ0FBQSxRQUFuQixFQUErQjtBQUFBLFlBQUEsT0FBQSxFQUFPLG9CQUFQO1dBQS9CLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7QUFDSCxZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sV0FBUCxFQUFvQjtBQUFBLGNBQUEsT0FBQSxFQUFPLFNBQVA7YUFBcEIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxjQUFBLENBQWU7QUFBQSxjQUFBLElBQUEsRUFBTSxJQUFOO2FBQWYsQ0FBM0IsQ0FEQSxDQUFBO0FBQUEsWUFFQSxLQUFDLENBQUEsS0FBRCxDQUFPLE1BQVAsRUFBZTtBQUFBLGNBQUEsT0FBQSxFQUFPLFNBQVA7YUFBZixDQUZBLENBQUE7QUFBQSxZQUdBLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUEyQixJQUFBLGNBQUEsQ0FBZTtBQUFBLGNBQUEsSUFBQSxFQUFNLElBQU47YUFBZixDQUEzQixDQUhBLENBQUE7QUFBQSxZQUlBLEtBQUMsQ0FBQSxLQUFELENBQU8sT0FBUCxFQUFnQjtBQUFBLGNBQUEsT0FBQSxFQUFPLFNBQVA7YUFBaEIsQ0FKQSxDQUFBO21CQUtBLEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUE0QixJQUFBLGNBQUEsQ0FBZTtBQUFBLGNBQUEsSUFBQSxFQUFNLElBQU47YUFBZixDQUE1QixFQU5HO1VBQUEsQ0FBTCxDQURBLENBQUE7QUFBQSxVQVFBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxZQUFBLE9BQUEsRUFBTyxTQUFQO0FBQUEsWUFBa0IsTUFBQSxFQUFRLFNBQTFCO1dBQUgsQ0FSQSxDQUFBO2lCQVNBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO0FBQUEsWUFBZ0IsTUFBQSxFQUFRLE9BQXhCO1dBQUgsRUFWNkI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixFQURRO0lBQUEsQ0FKVixDQUFBOztBQUFBLDBCQWlCQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxLQUFLLENBQUMsV0FBTixDQUFrQixDQUFDLElBQUMsQ0FBQSxXQUFGLEVBQWUsSUFBQyxDQUFBLFVBQWhCLEVBQTRCLElBQUMsQ0FBQSxVQUE3QixDQUFsQixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsV0FBdkIsQ0FBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsVUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQyxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsV0FBdkIsQ0FBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsVUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQyxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBLENBQXVCLENBQUMsV0FBeEIsQ0FBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsVUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQyxDQUpBLENBQUE7YUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLE9BQW5CLEVBQ0U7QUFBQSxRQUFBLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFVBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEI7QUFBQSxRQUNBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURmO09BREYsRUFQVTtJQUFBLENBakJaLENBQUE7O0FBQUEsMEJBNEJBLE9BQUEsR0FBUyxTQUFBLEdBQUE7O1FBQ1AsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLFVBQVksT0FBQSxFQUFTLEtBQXJCO1NBQTdCO09BQVY7QUFBQSxNQUNBLElBQUMsQ0FBQSx3QkFBRCxHQUE0QixDQUFBLENBQUUsUUFBUSxDQUFDLGFBQVgsQ0FENUIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQW9CLEtBQUssQ0FBQyxVQUFOLENBQUEsQ0FBcEIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBb0IsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsTUFBTSxDQUFDLEdBQVAsQ0FBVyxJQUFDLENBQUEsV0FBVyxDQUFDLFVBQXhCLENBQWxCLENBQXBCLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsQ0FKQSxDQUFBO2FBS0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQUEsRUFOTztJQUFBLENBNUJULENBQUE7O0FBQUEsMEJBb0NBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLEtBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFQLENBQUEsQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUEsQ0FBQSxDQUFBOztlQUN5QixDQUFFLEtBQTNCLENBQUE7U0FGRjtPQUFBO2FBR0EseUNBQUEsU0FBQSxFQUpNO0lBQUEsQ0FwQ1IsQ0FBQTs7QUFBQSwwQkEwQ0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsV0FBQTtBQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFQLENBQUE7QUFFQSxRQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxJQUFkLENBQUg7aUJBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQWEsT0FBQSxHQUFNLENBQUMsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFELENBQU4sR0FBc0Isa0JBQW5DLEVBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxFQUFFLENBQUMsYUFBSCxDQUFpQixJQUFqQixFQUF1QixJQUFDLENBQUEsbUJBQUQsQ0FBcUIsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFyQixDQUF2QixDQUFBLENBQUE7QUFBQSxVQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFwQixDQURBLENBQUE7aUJBRUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUxGO1NBSEY7T0FBQSxjQUFBO0FBVUUsUUFESSxjQUNKLENBQUE7ZUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxFQUFBLEdBQUcsS0FBSyxDQUFDLE9BQXJCLEVBVkY7T0FEVTtJQUFBLENBMUNaLENBQUE7O0FBQUEsMEJBdURBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FDSix5QkFBQSxHQUF3QixDQUFDLE1BQU0sQ0FBQyxHQUFQLENBQVcsY0FBWCxDQUFELENBQXhCLEdBQW9ELG9CQUFwRCxHQUNRLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFEckIsR0FDOEIsV0FEOUIsR0FDd0MsQ0FBQyxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUQsQ0FGcEMsRUFEVTtJQUFBLENBdkRaLENBQUE7O0FBQUEsMEJBNkRBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFBRyxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQU0sQ0FBQyxHQUFQLENBQVcsY0FBWCxDQUFWLEVBQXNDLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBdEMsRUFBSDtJQUFBLENBN0RiLENBQUE7O0FBQUEsMEJBK0RBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFBRyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQVYsRUFBaUMsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFqQyxFQUFIO0lBQUEsQ0EvRGIsQ0FBQTs7QUFBQSwwQkFpRUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLFVBQUEsY0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxHQUFQLENBQVcsSUFBQyxDQUFBLFdBQVcsQ0FBQyxjQUF4QixDQUFYLENBQUE7QUFBQSxNQUVBLElBQUEsR0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBaEIsQ0FBUDtBQUFBLFFBQ0EsU0FBQSxFQUFXLE1BQU0sQ0FBQyxHQUFQLENBQVcsZUFBWCxDQURYO09BSEYsQ0FBQTthQU1BLEtBQUssQ0FBQyxRQUFOLENBQWUsUUFBZixFQUF5QixDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQWYsQ0FBekIsRUFQVztJQUFBLENBakViLENBQUE7O0FBQUEsMEJBMEVBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFBLElBQTBCLENBQUMsTUFBQSxHQUFNLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBcEIsRUFBN0I7SUFBQSxDQTFFVixDQUFBOztBQUFBLDBCQTRFQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQUcsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBbkIsRUFBSDtJQUFBLENBNUVULENBQUE7O0FBQUEsMEJBOEVBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsS0FBeUIsT0FBNUI7SUFBQSxDQTlFZCxDQUFBOztBQUFBLDBCQWdGQSxtQkFBQSxHQUFxQixTQUFDLElBQUQsR0FBQTthQUNuQixLQUFLLENBQUMsUUFBTixDQUFlLE1BQU0sQ0FBQyxHQUFQLENBQVcsYUFBWCxDQUFmLEVBQTBDLElBQTFDLEVBRG1CO0lBQUEsQ0FoRnJCLENBQUE7O0FBQUEsMEJBbUZBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO2FBQ2Q7QUFBQSxRQUFBLE1BQUEsRUFBUSxNQUFSO0FBQUEsUUFDQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQURYO0FBQUEsUUFFQSxLQUFBLEVBQU8sSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUZQO0FBQUEsUUFHQSxJQUFBLEVBQU0sS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFoQixDQUhOO0FBQUEsUUFJQSxJQUFBLEVBQU0sRUFBQSxHQUFFLENBQUMsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBRCxDQUFGLEdBQXlCLEdBQXpCLEdBQTJCLENBQUMsS0FBSyxDQUFDLFVBQU4sQ0FBQSxDQUFELENBSmpDO0FBQUEsUUFLQSxRQUFBLEVBQVUsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUxWO1FBRGM7SUFBQSxDQW5GaEIsQ0FBQTs7dUJBQUE7O0tBRHdCLEtBUjFCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/views/new-file-view.coffee
