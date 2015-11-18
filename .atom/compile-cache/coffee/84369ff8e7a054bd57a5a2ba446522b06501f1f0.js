(function() {
  var MarkdownPreviewView, fs, imageRegister, isMarkdownPreviewView, path, pathWatcher, pathWatcherPath, renderPreviews, srcClosure, _;

  fs = require('fs-plus');

  _ = require('lodash');

  path = require('path');

  pathWatcherPath = path.join(atom.packages.resourcePath, '/node_modules/pathwatcher/lib/main');

  pathWatcher = require(pathWatcherPath);

  imageRegister = {};

  MarkdownPreviewView = null;

  isMarkdownPreviewView = function(object) {
    if (MarkdownPreviewView == null) {
      MarkdownPreviewView = require('./markdown-preview-view');
    }
    return object instanceof MarkdownPreviewView;
  };

  renderPreviews = _.debounce((function() {
    var item, _i, _len, _ref;
    if (atom.workspace != null) {
      _ref = atom.workspace.getPaneItems();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (isMarkdownPreviewView(item)) {
          item.renderMarkdown();
        }
      }
    }
  }), 250);

  srcClosure = function(src) {
    return function(event, path) {
      if (event === 'change' && fs.isFileSync(src)) {
        imageRegister[src].version = Date.now();
      } else {
        imageRegister[src].version = void 0;
      }
      renderPreviews();
    };
  };

  module.exports = {
    removeFile: function(file) {
      return imageRegister = _.mapValues(imageRegister, function(image) {
        image.files = _.without(image.files, file);
        image.files = _.filter(image.files, fs.isFileSync);
        if (_.isEmpty(image.files)) {
          image.watched = false;
          image.watcher.close();
        }
        return image;
      });
    },
    getVersion: function(image, file) {
      var files, i, version;
      i = _.get(imageRegister, image, {});
      if (_.isEmpty(i)) {
        if (fs.isFileSync(image)) {
          version = Date.now();
          imageRegister[image] = {
            path: image,
            watched: true,
            files: [file],
            version: version,
            watcher: pathWatcher.watch(image, srcClosure(image))
          };
          return version;
        } else {
          return false;
        }
      }
      files = _.get(i, 'files');
      if (!_.contains(files, file)) {
        imageRegister[image].files.push(file);
      }
      version = _.get(i, 'version');
      if (!version && fs.isFileSync(image)) {
        version = Date.now();
        imageRegister[image].version = version;
      }
      return version;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvbGliL2ltYWdlLXdhdGNoLWhlbHBlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ0lBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUF4QixFQUFzQyxvQ0FBdEMsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUixDQUpkLENBQUE7O0FBQUEsRUFNQSxhQUFBLEdBQWdCLEVBTmhCLENBQUE7O0FBQUEsRUFRQSxtQkFBQSxHQUFzQixJQVJ0QixDQUFBOztBQUFBLEVBU0EscUJBQUEsR0FBd0IsU0FBQyxNQUFELEdBQUE7O01BQ3RCLHNCQUF1QixPQUFBLENBQVEseUJBQVI7S0FBdkI7V0FDQSxNQUFBLFlBQWtCLG9CQUZJO0VBQUEsQ0FUeEIsQ0FBQTs7QUFBQSxFQWFBLGNBQUEsR0FBaUIsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLFNBQUEsR0FBQTtBQUMzQixRQUFBLG9CQUFBO0FBQUEsSUFBQSxJQUFHLHNCQUFIO0FBQ0U7QUFBQSxXQUFBLDJDQUFBO3dCQUFBO0FBQ0UsUUFBQSxJQUFHLHFCQUFBLENBQXNCLElBQXRCLENBQUg7QUFDRSxVQUFBLElBQUksQ0FBQyxjQUFMLENBQUEsQ0FBQSxDQURGO1NBREY7QUFBQSxPQURGO0tBRDJCO0VBQUEsQ0FBRCxD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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/lib/image-watch-helper.coffee
