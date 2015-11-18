(function() {
  var $, InsertImageView, TextEditorView, View, config, dialog, fs, imageExtensions, lastInsertImageDir, path, remote, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  remote = require("remote");

  dialog = remote.require("dialog");

  config = require("../config");

  utils = require("../utils");

  imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".ico"];

  lastInsertImageDir = null;

  module.exports = InsertImageView = (function(_super) {
    __extends(InsertImageView, _super);

    function InsertImageView() {
      return InsertImageView.__super__.constructor.apply(this, arguments);
    }

    InsertImageView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Image", {
            "class": "icon icon-device-camera"
          });
          _this.div(function() {
            _this.label("Image Path (src)", {
              "class": "message"
            });
            _this.subview("imageEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "dialog-row"
            }, function() {
              _this.button("Choose Local Image", {
                outlet: "openImageButton",
                "class": "btn"
              });
              return _this.label({
                outlet: "message",
                "class": "side-label"
              });
            });
            _this.label("Title (alt)", {
              "class": "message"
            });
            _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Width (px)", {
                "class": "message"
              });
              return _this.subview("widthEditor", new TextEditorView({
                mini: true
              }));
            });
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Height (px)", {
                "class": "message"
              });
              return _this.subview("heightEditor", new TextEditorView({
                mini: true
              }));
            });
            return _this.div({
              "class": "col-2"
            }, function() {
              _this.label("Alignment", {
                "class": "message"
              });
              return _this.subview("alignEditor", new TextEditorView({
                mini: true
              }));
            });
          });
          _this.div({
            outlet: "copyImagePanel",
            "class": "hidden dialog-row"
          }, function() {
            return _this.label({
              "for": "markdown-writer-copy-image-checkbox"
            }, function() {
              _this.input({
                id: "markdown-writer-copy-image-checkbox"
              }, {
                type: "checkbox",
                outlet: "copyImageCheckbox"
              });
              return _this.span("Copy Image to Site Image Directory", {
                "class": "side-label"
              });
            });
          });
          return _this.div({
            "class": "image-container"
          }, function() {
            return _this.img({
              outlet: 'imagePreview'
            });
          });
        };
      })(this));
    };

    InsertImageView.prototype.initialize = function() {
      utils.setTabIndex([this.imageEditor, this.openImageButton, this.titleEditor, this.widthEditor, this.heightEditor, this.alignEditor, this.copyImageCheckbox]);
      this.imageEditor.on("blur", (function(_this) {
        return function() {
          return _this.updateImageSource(_this.imageEditor.getText().trim());
        };
      })(this));
      this.openImageButton.on("click", (function(_this) {
        return function() {
          return _this.openImageDialog();
        };
      })(this));
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      });
    };

    InsertImageView.prototype.onConfirm = function() {
      var callback, imgUrl;
      imgUrl = this.imageEditor.getText().trim();
      if (!imgUrl) {
        return;
      }
      callback = (function(_this) {
        return function() {
          _this.insertImage();
          return _this.detach();
        };
      })(this);
      if (this.copyImageCheckbox.prop("checked")) {
        return this.copyImage(this.resolveImageUrl(imgUrl), callback);
      } else {
        return callback();
      }
    };

    InsertImageView.prototype.insertImage = function() {
      var img, text;
      img = {
        src: this.generateImageUrl(this.imageEditor.getText().trim()),
        alt: this.titleEditor.getText(),
        width: this.widthEditor.getText(),
        height: this.heightEditor.getText(),
        align: this.alignEditor.getText(),
        slug: utils.getTitleSlug(this.editor.getPath()),
        site: config.get("siteUrl")
      };
      text = img.src ? this.generateImageTag(img) : img.alt;
      return this.editor.setTextInBufferRange(this.range, text);
    };

    InsertImageView.prototype.copyImage = function(file, callback) {
      var destFile, error;
      if (utils.isUrl(file) || !fs.existsSync(file)) {
        return callback();
      }
      try {
        destFile = path.join(config.get("siteLocalDir"), this.imagesDir(), path.basename(file));
        if (fs.existsSync(destFile)) {
          return atom.confirm({
            message: "File already exists!",
            detailedMessage: "Another file already exists at:\n" + destPath,
            buttons: ['OK']
          });
        } else {
          return fs.copy(file, destFile, (function(_this) {
            return function() {
              _this.imageEditor.setText(destFile);
              return callback();
            };
          })(this));
        }
      } catch (_error) {
        error = _error;
        return atom.confirm({
          message: "[Markdown Writer] Error!",
          detailedMessage: "Copy Image:\n" + error.message,
          buttons: ['OK']
        });
      }
    };

    InsertImageView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.editor = atom.workspace.getActiveTextEditor();
      this.setFieldsFromSelection();
      this.panel.show();
      return this.imageEditor.focus();
    };

    InsertImageView.prototype.detach = function() {
      var _ref1;
      if (!this.panel.isVisible()) {
        return;
      }
      this.panel.hide();
      if ((_ref1 = this.previouslyFocusedElement) != null) {
        _ref1.focus();
      }
      return InsertImageView.__super__.detach.apply(this, arguments);
    };

    InsertImageView.prototype.setFieldsFromSelection = function() {
      var selection;
      this.range = utils.getTextBufferRange(this.editor, "link");
      selection = this.editor.getTextInRange(this.range);
      if (selection) {
        return this._setFieldsFromSelection(selection);
      }
    };

    InsertImageView.prototype._setFieldsFromSelection = function(selection) {
      var img;
      if (utils.isImage(selection)) {
        img = utils.parseImage(selection);
      } else if (utils.isImageTag(selection)) {
        img = utils.parseImageTag(selection);
      } else {
        img = {
          alt: selection
        };
      }
      this.titleEditor.setText(img.alt || "");
      this.widthEditor.setText(img.width || "");
      this.heightEditor.setText(img.height || "");
      this.imageEditor.setText(img.src || "");
      return this.updateImageSource(img.src);
    };

    InsertImageView.prototype.openImageDialog = function() {
      var files;
      files = dialog.showOpenDialog({
        properties: ['openFile'],
        defaultPath: lastInsertImageDir || atom.project.getPaths()[0]
      });
      if (!files) {
        return;
      }
      lastInsertImageDir = path.dirname(files[0]);
      this.imageEditor.setText(files[0]);
      this.updateImageSource(files[0]);
      return this.titleEditor.focus();
    };

    InsertImageView.prototype.updateImageSource = function(file) {
      if (!file) {
        return;
      }
      this.displayImagePreview(file);
      if (utils.isUrl(file) || this.isInSiteDir(this.resolveImageUrl(file))) {
        return this.copyImagePanel.addClass("hidden");
      } else {
        return this.copyImagePanel.removeClass("hidden");
      }
    };

    InsertImageView.prototype.displayImagePreview = function(file) {
      if (this.imageOnPreview === file) {
        return;
      }
      if (this.isValidImageFile(file)) {
        this.message.text("Opening Image Preview ...");
        this.imagePreview.attr("src", this.resolveImageUrl(file));
        this.imagePreview.load((function(_this) {
          return function() {
            _this.setImageContext();
            return _this.message.text("");
          };
        })(this));
        this.imagePreview.error((function(_this) {
          return function() {
            _this.message.text("Error: Failed to Load Image.");
            return _this.imagePreview.attr("src", "");
          };
        })(this));
      } else {
        if (file) {
          this.message.text("Error: Invalid Image File.");
        }
        this.imagePreview.attr("src", "");
        this.widthEditor.setText("");
        this.heightEditor.setText("");
        this.alignEditor.setText("");
      }
      return this.imageOnPreview = file;
    };

    InsertImageView.prototype.isValidImageFile = function(file) {
      var _ref1;
      return file && (_ref1 = path.extname(file).toLowerCase(), __indexOf.call(imageExtensions, _ref1) >= 0);
    };

    InsertImageView.prototype.setImageContext = function() {
      var naturalHeight, naturalWidth, position, _ref1;
      _ref1 = this.imagePreview.context, naturalWidth = _ref1.naturalWidth, naturalHeight = _ref1.naturalHeight;
      this.widthEditor.setText("" + naturalWidth);
      this.heightEditor.setText("" + naturalHeight);
      position = naturalWidth > 300 ? "center" : "right";
      return this.alignEditor.setText(position);
    };

    InsertImageView.prototype.isInSiteDir = function(file) {
      return file && file.startsWith(config.get("siteLocalDir"));
    };

    InsertImageView.prototype.imagesDir = function() {
      return utils.dirTemplate(config.get("siteImagesDir"));
    };

    InsertImageView.prototype.resolveImageUrl = function(file) {
      if (!file) {
        return "";
      }
      if (utils.isUrl(file) || fs.existsSync(file)) {
        return file;
      }
      return path.join(config.get("siteLocalDir"), file);
    };

    InsertImageView.prototype.generateImageUrl = function(file) {
      var filePath;
      if (!file) {
        return "";
      }
      if (utils.isUrl(file)) {
        return file;
      }
      if (this.isInSiteDir(file)) {
        filePath = path.relative(config.get("siteLocalDir"), file);
      } else {
        filePath = path.join(this.imagesDir(), path.basename(file));
      }
      return path.join("/", filePath);
    };

    InsertImageView.prototype.generateImageTag = function(data) {
      return utils.template(config.get("imageTag"), data);
    };

    return InsertImageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL3ZpZXdzL2luc2VydC1pbWFnZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0SEFBQTtJQUFBOzt5SkFBQTs7QUFBQSxFQUFBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixFQUFVLHNCQUFBLGNBQVYsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FBUCxDQUFlLFFBQWYsQ0FKVCxDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBTlQsQ0FBQTs7QUFBQSxFQU9BLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQVBSLENBQUE7O0FBQUEsRUFTQSxlQUFBLEdBQWtCLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBMEIsTUFBMUIsRUFBa0MsTUFBbEMsQ0FUbEIsQ0FBQTs7QUFBQSxFQVVBLGtCQUFBLEdBQXFCLElBVnJCLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sd0NBQVA7T0FBTCxFQUFzRCxDQUFBLFNBQUEsS0FBQSxHQUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/views/insert-image-view.coffee
