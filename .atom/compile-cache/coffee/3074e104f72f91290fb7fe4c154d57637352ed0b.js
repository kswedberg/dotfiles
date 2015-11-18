(function() {
  var config,
    __slice = [].slice;

  config = require("./config");

  module.exports = {
    siteEngine: {
      title: "Site Engine",
      type: "string",
      "default": config.getDefault("siteEngine"),
      "enum": [config.getDefault("siteEngine")].concat(__slice.call(config.engineNames()))
    },
    siteUrl: {
      title: "Site URL",
      type: "string",
      "default": config.getDefault("siteUrl")
    },
    siteLocalDir: {
      title: "Site Local Directory",
      description: "The absolute path to your site's local directory",
      type: "string",
      "default": config.getDefault("siteLocalDir")
    },
    siteDraftsDir: {
      title: "Site Drafts Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("siteDraftsDir")
    },
    sitePostsDir: {
      title: "Site Posts Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("sitePostsDir")
    },
    siteImagesDir: {
      title: "Site Images Directory",
      description: "The relative path from your site's local directory",
      type: "string",
      "default": config.getDefault("siteImagesDir")
    },
    urlForTags: {
      title: "URL to Tags JSON definitions",
      type: "string",
      "default": config.getDefault("urlForTags")
    },
    urlForPosts: {
      title: "URL to Posts JSON definitions",
      type: "string",
      "default": config.getDefault("urlForPosts")
    },
    urlForCategories: {
      title: "URL to Categories JSON definitions",
      type: "string",
      "default": config.getDefault("urlForCategories")
    },
    newDraftFileName: {
      title: "New Draft File Name",
      type: "string",
      "default": config.getCurrentDefault("newDraftFileName")
    },
    newPostFileName: {
      title: "New Post File Name",
      type: "string",
      "default": config.getCurrentDefault("newPostFileName")
    },
    fileExtension: {
      title: "File Extension",
      type: "string",
      "default": config.getCurrentDefault("fileExtension")
    },
    tableAlignment: {
      title: "Table Cell Alignment",
      type: "string",
      "default": config.getDefault("tableAlignment"),
      "enum": ["empty", "left", "right", "center"]
    },
    tableExtraPipes: {
      title: "Table Extra Pipes",
      description: "Insert extra pipes at the start and the end of the table rows",
      type: "boolean",
      "default": config.getDefault("tableExtraPipes")
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbmZpZy1iYXNpYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFVBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLGFBQVA7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsWUFBbEIsQ0FGVDtBQUFBLE1BR0EsTUFBQSxFQUFPLENBQUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsWUFBbEIsQ0FBaUMsU0FBQSxhQUFBLE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBQSxDQUFBLENBSHhDO0tBREY7QUFBQSxJQUtBLE9BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLFVBQVA7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxTQUFBLEVBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsU0FBbEIsQ0FGVDtLQU5GO0FBQUEsSUFTQSxZQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLE1BQ0EsV0FBQSxFQUFhLGtEQURiO0FBQUEsTUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLE1BR0EsU0FBQSxFQUFTLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGNBQWxCLENBSFQ7S0FWRjtBQUFBLElBY0EsYUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sdUJBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSxvREFEYjtBQUFBLE1BRUEsSUFBQSxFQUFNLFFBRk47QUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/config-basic.coffee
