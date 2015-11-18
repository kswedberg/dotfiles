(function() {
  var scopesByFenceName;

  scopesByFenceName = {
    'sh': 'source.shell',
    'bash': 'source.shell',
    'c': 'source.c',
    'c++': 'source.cpp',
    'cpp': 'source.cpp',
    'coffee': 'source.coffee',
    'coffeescript': 'source.coffee',
    'coffee-script': 'source.coffee',
    'cs': 'source.cs',
    'csharp': 'source.cs',
    'css': 'source.css',
    'scss': 'source.css.scss',
    'sass': 'source.sass',
    'erlang': 'source.erl',
    'go': 'source.go',
    'html': 'text.html.basic',
    'java': 'source.java',
    'js': 'source.js',
    'javascript': 'source.js',
    'json': 'source.json',
    'less': 'source.less',
    'mustache': 'text.html.mustache',
    'objc': 'source.objc',
    'objective-c': 'source.objc',
    'php': 'text.html.php',
    'py': 'source.python',
    'python': 'source.python',
    'rb': 'source.ruby',
    'ruby': 'source.ruby',
    'text': 'text.plain',
    'toml': 'source.toml',
    'xml': 'text.xml',
    'yaml': 'source.yaml',
    'yml': 'source.yaml'
  };

  module.exports = {
    scopeForFenceName: function(fenceName) {
      var _ref;
      return (_ref = scopesByFenceName[fenceName]) != null ? _ref : "source." + fenceName;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvbGliL2V4dGVuc2lvbi1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQUEsaUJBQUEsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLGNBQU47QUFBQSxJQUNBLE1BQUEsRUFBUSxjQURSO0FBQUEsSUFFQSxHQUFBLEVBQUssVUFGTDtBQUFBLElBR0EsS0FBQSxFQUFPLFlBSFA7QUFBQSxJQUlBLEtBQUEsRUFBTyxZQUpQO0FBQUEsSUFLQSxRQUFBLEVBQVUsZUFMVjtBQUFBLElBTUEsY0FBQSxFQUFnQixlQU5oQjtBQUFBLElBT0EsZUFBQSxFQUFpQixlQVBqQjtBQUFBLElBUUEsSUFBQSxFQUFNLFdBUk47QUFBQSxJQVNBLFFBQUEsRUFBVSxXQVRWO0FBQUEsSUFVQSxLQUFBLEVBQU8sWUFWUDtBQUFBLElBV0EsTUFBQSxFQUFRLGlCQVhSO0FBQUEsSUFZQSxNQUFBLEVBQVEsYUFaUjtBQUFBLElBYUEsUUFBQSxFQUFVLFlBYlY7QUFBQSxJQWNBLElBQUEsRUFBTSxXQWROO0FBQUEsSUFlQSxNQUFBLEVBQVEsaUJBZlI7QUFBQSxJQWdCQSxNQUFBLEVBQVEsYUFoQlI7QUFBQSxJQWlCQSxJQUFBLEVBQU0sV0FqQk47QUFBQSxJQWtCQSxZQUFBLEVBQWMsV0FsQmQ7QUFBQSxJQW1CQSxNQUFBLEVBQVEsYUFuQlI7QUFBQSxJQW9CQSxNQUFBLEVBQVEsYUFwQlI7QUFBQSxJQXFCQSxVQUFBLEVBQVksb0JBckJaO0FBQUEsSUFzQkEsTUFBQSxFQUFRLGFBdEJSO0FBQUEsSUF1QkEsYUFBQSxFQUFlLGFBdkJmO0FBQUEsSUF3QkEsS0FBQSxFQUFPLGVBeEJQO0FBQUEsSUF5QkEsSUFBQSxFQUFNLGVBekJOO0FBQUEsSUEwQkEsUUFBQSxFQUFVLGVBMUJWO0FBQUEsSUEyQkEsSUFBQSxFQUFNLGFBM0JOO0FBQUEsSUE0QkEsTUFBQSxFQUFRLGFBNUJSO0FBQUEsSUE2QkEsTUFBQSxFQUFRLFlBN0JSO0FBQUEsSUE4QkEsTUFBQSxFQUFRLGFBOUJSO0FBQUEsSUErQkEsS0FBQSxFQUFPLFVBL0JQO0FBQUEsSUFnQ0EsTUFBQSxFQUFRLGFBaENSO0FBQUEsSUFpQ0EsS0FBQSxFQUFPLGFBakNQO0dBREYsQ0FBQTs7QUFBQSxFQW9DQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxpQkFBQSxFQUFtQixTQUFDLFNBQUQsR0FBQTtBQUNqQixVQUFBLElBQUE7b0VBQWdDLFNBQUEsR0FBUyxVQUR4QjtJQUFBLENBQW5CO0dBckNGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/lib/extension-helper.coffee
