(function() {
  var $, FrontMatter, PublishDraft, config, fs, path, shell, utils;

  $ = require("atom-space-pen-views").$;

  fs = require("fs-plus");

  path = require("path");

  shell = require("shell");

  config = require("../config");

  utils = require("../utils");

  FrontMatter = require("../helpers/front-matter");

  module.exports = PublishDraft = (function() {
    function PublishDraft() {
      this.editor = atom.workspace.getActiveTextEditor();
      this.frontMatter = new FrontMatter(this.editor);
    }

    PublishDraft.prototype.trigger = function(e) {
      this.updateFrontMatter();
      this.draftPath = this.editor.getPath();
      this.postPath = this.getPostPath();
      return this.confirmPublish((function(_this) {
        return function() {
          var error;
          try {
            _this.editor.saveAs(_this.postPath);
            if (_this.draftPath) {
              return shell.moveItemToTrash(_this.draftPath);
            }
          } catch (_error) {
            error = _error;
            return atom.confirm({
              message: "[Markdown Writer] Error!",
              detailedMessage: "Publish Draft:\n" + error.message,
              buttons: ['OK']
            });
          }
        };
      })(this));
    };

    PublishDraft.prototype.confirmPublish = function(callback) {
      if (fs.existsSync(this.postPath)) {
        return atom.confirm({
          message: "Do you want to overwrite file?",
          detailedMessage: "Another file already exists at:\n" + this.postPath,
          buttons: {
            "Confirm": callback,
            "Cancel": null
          }
        });
      } else if (this.draftPath === this.postPath) {
        return atom.confirm({
          message: "This file is published!",
          detailedMessage: "This file already published at:\n" + this.draftPath,
          buttons: ['OK']
        });
      } else {
        return callback();
      }
    };

    PublishDraft.prototype.updateFrontMatter = function() {
      if (this.frontMatter.isEmpty) {
        return;
      }
      this.frontMatter.setIfExists("published", true);
      this.frontMatter.setIfExists("date", "" + (utils.getDateStr()) + " " + (utils.getTimeStr()));
      return this.frontMatter.save();
    };

    PublishDraft.prototype.getPostPath = function() {
      var localDir, postsDir;
      localDir = config.get("siteLocalDir");
      postsDir = utils.dirTemplate(config.get("sitePostsDir"));
      return path.join(localDir, postsDir, this._getPostName());
    };

    PublishDraft.prototype._getPostName = function() {
      var date, info, template;
      template = config.get("newPostFileName");
      date = utils.getDate();
      info = {
        title: this._getPostTitle(),
        extension: this._getPostExtension()
      };
      return utils.template(template, $.extend(info, date));
    };

    PublishDraft.prototype._getPostTitle = function() {
      var title, useFrontMatter;
      useFrontMatter = !this.draftPath || !!config.get("publishRenameBasedOnTitle");
      if (useFrontMatter) {
        title = utils.dasherize(this.frontMatter.get("title"));
      }
      return title || utils.getTitleSlug(this.draftPath) || utils.dasherize("New Post");
    };

    PublishDraft.prototype._getPostExtension = function() {
      var extname;
      if (!!config.get("publishKeepFileExtname")) {
        extname = path.extname(this.draftPath);
      }
      return extname || config.get("fileExtension");
    };

    return PublishDraft;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbW1hbmRzL3B1Ymxpc2gtZHJhZnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDREQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUhSLENBQUE7O0FBQUEsRUFLQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FMVCxDQUFBOztBQUFBLEVBTUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxVQUFSLENBTlIsQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxPQUFBLENBQVEseUJBQVIsQ0FQZCxDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsc0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsTUFBYixDQURuQixDQURXO0lBQUEsQ0FBYjs7QUFBQSwyQkFJQSxPQUFBLEdBQVMsU0FBQyxDQUFELEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUZiLENBQUE7QUFBQSxNQUdBLElB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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/commands/publish-draft.coffee
