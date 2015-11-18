(function() {
  var File, configManager, path;

  path = require('path');

  configManager = require('./config-manager');

  File = require('atom').File;

  module.exports = {
    toExt: function(srcPath, ext) {
      var srcExt;
      srcExt = path.extname(srcPath);
      return path.join(path.dirname(srcPath), "" + (path.basename(srcPath, srcExt)) + "." + ext);
    },
    resolvePath: function(srcPath) {
      var cwd, destination, flatten, projectPath, relativePath, _ref;
      destination = configManager.get('destination') || '.';
      flatten = configManager.get('flatten');
      cwd = configManager.get('cwd') || '.';
      _ref = atom.project.relativizePath(srcPath), projectPath = _ref[0], relativePath = _ref[1];
      if (flatten) {
        relativePath = path.basename(relativePath);
      }
      relativePath = path.relative(cwd, relativePath);
      return path.join(projectPath, destination, relativePath);
    },
    writeFile: function(filename, data) {
      var file;
      file = new File(filename);
      return file.create().then(function() {
        return file.write(data);
      });
    },
    isPathInSrc: function(srcPath) {
      var cwd, projectPath, relativePath, source, _ref;
      source = configManager.get('source') || ['.'];
      cwd = configManager.get('cwd') || '.';
      _ref = atom.project.relativizePath(srcPath), projectPath = _ref[0], relativePath = _ref[1];
      if (!projectPath) {
        return false;
      }
      if (typeof source === 'string') {
        source = [source];
      } else if (!Array.isArray(source)) {
        source = ['.'];
      }
      return source.some(function(folderPath) {
        var fullFolderPath, relative;
        if (typeof projectPath !== 'string' || typeof cwd !== 'string' || typeof folderPath !== 'string') {
          return false;
        }
        fullFolderPath = path.join(projectPath, cwd, folderPath);
        relative = path.relative(srcPath, fullFolderPath);
        return relative !== "" && !/\w+/.test(relative);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9saWIvZnMtdXRpbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQWdCLE9BQUEsQ0FBUSxNQUFSLENBQWhCLENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQURoQixDQUFBOztBQUFBLEVBRUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBRkQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFDLE9BQUQsRUFBVSxHQUFWLEdBQUE7QUFDTCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsQ0FBVCxDQUFBO0FBQ0EsYUFBTyxJQUFJLENBQUMsSUFBTCxDQUNMLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBYixDQURLLEVBRUwsRUFBQSxHQUFFLENBQUMsSUFBSSxDQUFDLFFBQUwsQ0FBYyxPQUFkLEVBQXVCLE1BQXZCLENBQUQsQ0FBRixHQUFrQyxHQUFsQyxHQUFxQyxHQUZoQyxDQUFQLENBRks7SUFBQSxDQUFQO0FBQUEsSUFPQSxXQUFBLEVBQWEsU0FBQyxPQUFELEdBQUE7QUFDWCxVQUFBLDBEQUFBO0FBQUEsTUFBQSxXQUFBLEdBQWMsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsYUFBbEIsQ0FBQSxJQUFvQyxHQUFsRCxDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQWMsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsU0FBbEIsQ0FEZCxDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQWMsYUFBYSxDQUFDLEdBQWQsQ0FBa0IsS0FBbEIsQ0FBQSxJQUE0QixHQUYxQyxDQUFBO0FBQUEsTUFJQSxPQUE4QixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsT0FBNUIsQ0FBOUIsRUFBQyxxQkFBRCxFQUFjLHNCQUpkLENBQUE7QUFPQSxNQUFBLElBQUcsT0FBSDtBQUNFLFFBQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFMLENBQWMsWUFBZCxDQUFmLENBREY7T0FQQTtBQUFBLE1BVUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFMLENBQWMsR0FBZCxFQUFtQixZQUFuQixDQVZmLENBQUE7QUFXQSxhQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUF1QixXQUF2QixFQUFvQyxZQUFwQyxDQUFQLENBWlc7SUFBQSxDQVBiO0FBQUEsSUFxQkEsU0FBQSxFQUFXLFNBQUMsUUFBRCxFQUFXLElBQVgsR0FBQTtBQUNULFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFXLElBQUEsSUFBQSxDQUFLLFFBQUwsQ0FBWCxDQUFBO2FBQ0EsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFBLEdBQUE7ZUFDakIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLEVBRGlCO01BQUEsQ0FBbkIsRUFGUztJQUFBLENBckJYO0FBQUEsSUEwQkEsV0FBQSxFQUFhLFNBQUMsT0FBRCxHQUFBO0FBQ1gsVUFBQSw0Q0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLGFBQWEsQ0FBQyxHQUFkLENBQWtCLFFBQWxCLENBQUEsSUFBK0IsQ0FBQyxHQUFELENBQXhDLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBUyxhQUFhLENBQUMsR0FBZCxDQUFrQixLQUFsQixDQUFBLElBQTRCLEdBRHJDLENBQUE7QUFBQSxNQUdBLE9BQThCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixPQUE1QixDQUE5QixFQUFDLHFCQUFELEVBQWMsc0JBSGQsQ0FBQTtBQUtBLE1BQUEsSUFBQSxDQUFBLFdBQUE7QUFBQSxlQUFPLEtBQVAsQ0FBQTtPQUxBO0FBUUEsTUFBQSxJQUFHLE1BQUEsQ0FBQSxNQUFBLEtBQWlCLFFBQXBCO0FBQ0UsUUFBQSxNQUFBLEdBQVMsQ0FBQyxNQUFELENBQVQsQ0FERjtPQUFBLE1BR0ssSUFBRyxDQUFBLEtBQVMsQ0FBQyxPQUFOLENBQWMsTUFBZCxDQUFQO0FBQ0gsUUFBQSxNQUFBLEdBQVMsQ0FBQyxHQUFELENBQVQsQ0FERztPQVhMO2FBY0EsTUFBTSxDQUFDLElBQVAsQ0FBWSxTQUFDLFVBQUQsR0FBQTtBQUVWLFlBQUEsd0JBQUE7QUFBQSxRQUFBLElBQUcsTUFBQSxDQUFBLFdBQUEsS0FBd0IsUUFBeEIsSUFDQyxNQUFBLENBQUEsR0FBQSxLQUFnQixRQURqQixJQUVDLE1BQUEsQ0FBQSxVQUFBLEtBQXVCLFFBRjNCO0FBR0UsaUJBQU8sS0FBUCxDQUhGO1NBQUE7QUFBQSxRQUtBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFWLEVBQXVCLEdBQXZCLEVBQTRCLFVBQTVCLENBTGpCLENBQUE7QUFBQSxRQU1BLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBTCxDQUFjLE9BQWQsRUFBdUIsY0FBdkIsQ0FOWCxDQUFBO0FBUUEsZUFBTyxRQUFBLEtBQWMsRUFBZCxJQUFxQixDQUFBLEtBQU0sQ0FBQyxJQUFOLENBQVcsUUFBWCxDQUE3QixDQVZVO01BQUEsQ0FBWixFQWZXO0lBQUEsQ0ExQmI7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/lib/fs-util.coffee
