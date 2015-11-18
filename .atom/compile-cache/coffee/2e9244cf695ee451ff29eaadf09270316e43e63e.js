(function() {
  var CSON, Configuration, fs, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require("path");

  CSON = require("season");

  fs = require("fs-plus");

  Configuration = (function() {
    function Configuration() {}

    Configuration.prefix = "markdown-writer";

    Configuration.defaults = {
      siteEngine: "general",
      projectConfigFile: "_mdwriter.cson",
      siteLocalDir: "/config/your/local/directory/in/settings",
      siteDraftsDir: "_drafts/",
      sitePostsDir: "_posts/{year}/",
      siteImagesDir: "images/{year}/{month}/",
      siteUrl: "",
      urlForTags: "",
      urlForPosts: "",
      urlForCategories: "",
      newDraftFileName: "{title}{extension}",
      newPostFileName: "{year}-{month}-{day}-{title}{extension}",
      frontMatter: "---\nlayout: <layout>\ntitle: \"<title>\"\ndate: \"<date>\"\n---",
      fileExtension: ".markdown",
      publishRenameBasedOnTitle: false,
      publishKeepFileExtname: false,
      inlineNewLineContinuation: false,
      siteLinkPath: path.join(atom.getConfigDirPath(), "" + Configuration.prefix + "-links.cson"),
      referenceInsertPosition: "paragraph",
      referenceIndentLength: 2,
      textStyles: {
        code: {
          before: "`",
          after: "`"
        },
        bold: {
          before: "**",
          after: "**"
        },
        italic: {
          before: "_",
          after: "_"
        },
        keystroke: {
          before: "<kbd>",
          after: "</kbd>"
        },
        strikethrough: {
          before: "~~",
          after: "~~"
        },
        codeblock: {
          before: "```\n",
          after: "\n```",
          regexBefore: "```(?:[\\w- ]+)?\\n",
          regexAfter: "\\n```"
        }
      },
      lineStyles: {
        h1: {
          before: "# "
        },
        h2: {
          before: "## "
        },
        h3: {
          before: "### "
        },
        h4: {
          before: "#### "
        },
        h5: {
          before: "##### "
        },
        ul: {
          before: "- ",
          regexMatchBefore: "(?:-|\\*|\\+)\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s"
        },
        ol: {
          before: "1. ",
          regexMatchBefore: "(?:\\d+\\.)\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s"
        },
        task: {
          before: "- [ ] ",
          regexMatchBefore: "(?:-|\\*|\\+|\\d+\\.)\\s+\\[ ]\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s*(?:\\[[xX ]])?\\s"
        },
        taskdone: {
          before: "- [X] ",
          regexMatchBefore: "(?:-|\\*|\\+|\\d+\\.)\\s+\\[[xX]]\\s",
          regexBefore: "(?:-|\\*|\\+|\\d+\\.)\\s*(?:\\[[xX ]])?\\s"
        },
        blockquote: {
          before: "> "
        }
      },
      imageTag: "![<alt>](<src>)",
      tableAlignment: "empty",
      tableExtraPipes: false,
      grammars: ['source.gfm', 'source.litcoffee', 'text.plain', 'text.plain.null-grammar']
    };

    Configuration.engines = {
      html: {
        imageTag: "<a href=\"<site>/<slug>.html\" target=\"_blank\">\n  <img class=\"align<align>\" alt=\"<alt>\" src=\"<src>\" width=\"<width>\" height=\"<height>\" />\n</a>"
      },
      jekyll: {
        textStyles: {
          codeblock: {
            before: "{% highlight %}\n",
            after: "\n{% endhighlight %}",
            regexBefore: "{% highlight(?: .+)? %}\n",
            regexAfter: "\n{% endhighlight %}"
          }
        }
      },
      octopress: {
        imageTag: "{% img {align} {src} {width} {height} '{alt}' %}"
      },
      hexo: {
        newPostFileName: "{title}{extension}",
        frontMatter: "layout: <layout>\ntitle: \"<title>\"\ndate: \"<date>\"\n---"
      }
    };

    Configuration.projectConfigs = {};

    Configuration.prototype.engineNames = function() {
      return Object.keys(this.constructor.engines);
    };

    Configuration.prototype.keyPath = function(key) {
      return "" + this.constructor.prefix + "." + key;
    };

    Configuration.prototype.get = function(key) {
      return this.getProject(key) || this.getUser(key) || this.getEngine(key) || this.getDefault(key);
    };

    Configuration.prototype.set = function(key, val) {
      return atom.config.set(this.keyPath(key), val);
    };

    Configuration.prototype.restoreDefault = function(key) {
      return atom.config.unset(this.keyPath(key));
    };

    Configuration.prototype.getDefault = function(key) {
      return this._valueForKeyPath(this.constructor.defaults, key);
    };

    Configuration.prototype.getEngine = function(key) {
      var engine;
      engine = this.getProject("siteEngine") || this.getUser("siteEngine") || this.getDefault("siteEngine");
      if (__indexOf.call(this.engineNames(), engine) >= 0) {
        return this._valueForKeyPath(this.constructor.engines[engine], key);
      }
    };

    Configuration.prototype.getCurrentDefault = function(key) {
      return this.getEngine(key) || this.getDefault(key);
    };

    Configuration.prototype.getUser = function(key) {
      return atom.config.get(this.keyPath(key), {
        sources: [atom.config.getUserConfigPath()]
      });
    };

    Configuration.prototype.getProject = function(key) {
      var config, project;
      if (!atom.project || atom.project.getPaths().length < 1) {
        return;
      }
      project = atom.project.getPaths()[0];
      config = this._loadProjectConfig(project);
      return this._valueForKeyPath(config, key);
    };

    Configuration.prototype._loadProjectConfig = function(project) {
      var config, file, filePath;
      if (this.constructor.projectConfigs[project]) {
        return this.constructor.projectConfigs[project];
      }
      file = this.getUser("projectConfigFile") || this.getDefault("projectConfigFile");
      filePath = path.join(project, file);
      if (fs.existsSync(filePath)) {
        config = CSON.readFileSync(filePath);
      }
      return this.constructor.projectConfigs[project] = config || {};
    };

    Configuration.prototype._valueForKeyPath = function(object, keyPath) {
      var key, keys, _i, _len;
      keys = keyPath.split('.');
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        object = object[key];
        if (object == null) {
          return;
        }
      }
      return object;
    };

    return Configuration;

  })();

  module.exports = new Configuration();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkJBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUlNOytCQUNKOztBQUFBLElBQUEsYUFBQyxDQUFBLE1BQUQsR0FBUyxpQkFBVCxDQUFBOztBQUFBLElBRUEsYUFBQyxDQUFBLFFBQUQsR0FFRTtBQUFBLE1BQUEsVUFBQSxFQUFZLFNBQVo7QUFBQSxNQUlBLGlCQUFBLEVBQW1CLGdCQUpuQjtBQUFBLE1BT0EsWUFBQSxFQUFjLDBDQVBkO0FBQUEsTUFTQSxhQUFBLEVBQWUsVUFUZjtBQUFBLE1BV0EsWUFBQSxFQUFjLGdCQVhkO0FBQUEsTUFhQSxhQUFBLEVBQWUsd0JBYmY7QUFBQSxNQWdCQSxPQUFBLEVBQVMsRUFoQlQ7QUFBQSxNQW1CQSxVQUFBLEVBQVksRUFuQlo7QUFBQSxNQW9CQSxXQUFBLEVBQWEsRUFwQmI7QUFBQSxNQXFCQSxnQkFBQSxFQUFrQixFQXJCbEI7QUFBQSxNQXdCQSxnQkFBQSxFQUFrQixvQkF4QmxCO0FBQUEsTUEwQkEsZUFBQSxFQUFpQix5Q0ExQmpCO0FBQUEsTUE0QkEsV0FBQSxFQUFhLGtFQTVCYjtBQUFBLE1BcUNBLGFBQUEsRUFBZSxXQXJDZjtBQUFBLE1Bd0NBLHlCQUFBLEVBQTJCLEtBeEMzQjtBQUFBLE1BMENBLHNCQUFBLEVBQXdCLEtBMUN4QjtBQUFBLE1BNkNBLHlCQUFBLEVBQTJC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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/config.coffee
