(function() {
  var fsUtil, pluginManager;

  fsUtil = require('./fs-util');

  pluginManager = require('./plugin-manager');

  module.exports = {

    /*
    @name getTextEditorById
    @param {String} id
    @returns {Editor|null}
     */
    getTextEditorById: function(id) {
      var editor, _i, _len, _ref, _ref1;
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        if (((_ref1 = editor.id) != null ? _ref1.toString() : void 0) === id.toString()) {
          return editor;
        }
      }
      return null;
    },

    /*
    @name compile
    @param {String} code
    @param {Editor} editor
    @returns {String} Compiled code
     */
    compile: function(code, editor) {
      var compiler, language, postCompiler, preCompiler, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      language = pluginManager.getLanguageByScope(editor.getGrammar().scopeName);
      if (language == null) {
        return code;
      }
      _ref = language.preCompilers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        preCompiler = _ref[_i];
        code = preCompiler(code, editor);
      }
      _ref1 = language.compilers;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        compiler = _ref1[_j];
        code = compiler(code, editor);
      }
      _ref2 = language.postCompilers;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        postCompiler = _ref2[_k];
        code = postCompiler(code, editor);
      }
      return code;
    },

    /*
    @name getSelectedCode
    @param {Editor} editor
    @returns {String} Selected text
     */
    getSelectedCode: function(editor) {
      var range, text;
      range = editor.getSelectedBufferRange();
      text = range.isEmpty() ? editor.getText() : editor.getTextInBufferRange(range);
      return text;
    },

    /*
    @name compileToFile
    @param {Editor} editor
     */
    compileToFile: function(editor) {
      var destPath, e, srcPath, text;
      try {
        srcPath = editor.getPath();
        if (!fsUtil.isPathInSrc(srcPath)) {
          return;
        }
        text = this.compile(editor.getText(), editor);
        destPath = fsUtil.resolvePath(editor.getPath());
        if (!atom.project.contains(destPath)) {
          atom.notifications.addError("Compile-compile: Failed to compile to file", {
            detail: "Cannot write outside of project root"
          });
        }
        destPath = fsUtil.toExt(destPath, 'js');
        return fsUtil.writeFile(destPath, text);
      } catch (_error) {
        e = _error;
        return atom.notifications.addError("Compile-compile: Failed to compile to file", {
          detail: e.stack
        });
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9jb2ZmZWUtY29tcGlsZS9saWIvdXRpbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUJBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQWdCLE9BQUEsQ0FBUSxXQUFSLENBQWhCLENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQURoQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBO0FBQUE7Ozs7T0FBQTtBQUFBLElBS0EsaUJBQUEsRUFBbUIsU0FBQyxFQUFELEdBQUE7QUFDakIsVUFBQSw2QkFBQTtBQUFBO0FBQUEsV0FBQSwyQ0FBQTswQkFBQTtBQUNFLFFBQUEsd0NBQTBCLENBQUUsUUFBWCxDQUFBLFdBQUEsS0FBeUIsRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUExQztBQUFBLGlCQUFPLE1BQVAsQ0FBQTtTQURGO0FBQUEsT0FBQTtBQUdBLGFBQU8sSUFBUCxDQUppQjtJQUFBLENBTG5CO0FBV0E7QUFBQTs7Ozs7T0FYQTtBQUFBLElBaUJBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxNQUFQLEdBQUE7QUFDUCxVQUFBLGlHQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsYUFBYSxDQUFDLGtCQUFkLENBQWlDLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUFyRCxDQUFYLENBQUE7QUFFQSxNQUFBLElBQW1CLGdCQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BRkE7QUFJQTtBQUFBLFdBQUEsMkNBQUE7K0JBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxXQUFBLENBQVksSUFBWixFQUFrQixNQUFsQixDQUFQLENBREY7QUFBQSxPQUpBO0FBT0E7QUFBQSxXQUFBLDhDQUFBOzZCQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU8sUUFBQSxDQUFTLElBQVQsRUFBZSxNQUFmLENBQVAsQ0FERjtBQUFBLE9BUEE7QUFVQTtBQUFBLFdBQUEsOENBQUE7aUNBQUE7QUFDRSxRQUFBLElBQUEsR0FBTyxZQUFBLENBQWEsSUFBYixFQUFtQixNQUFuQixDQUFQLENBREY7QUFBQSxPQVZBO0FBYUEsYUFBTyxJQUFQLENBZE87SUFBQSxDQWpCVDtBQWlDQTtBQUFBOzs7O09BakNBO0FBQUEsSUFzQ0EsZUFBQSxFQUFpQixTQUFDLE1BQUQsR0FBQTtBQUNmLFVBQUEsV0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLE1BQU0sQ0FBQyxzQkFBUCxDQUFBLENBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUNLLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FBSCxHQUNFLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FERixHQUdFLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQUxKLENBQUE7QUFPQSxhQUFPLElBQVAsQ0FSZTtJQUFBLENBdENqQjtBQWdEQTtBQUFBOzs7T0FoREE7QUFBQSxJQW9EQSxhQUFBLEVBQWUsU0FBQyxNQUFELEdBQUE7QUFDYixVQUFBLDBCQUFBO0FBQUE7QUFDRSxRQUFBLE9BQUEsR0FBVSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVYsQ0FBQTtBQUVBLFFBQUEsSUFBQSxDQUFBLE1BQW9CLENBQUMsV0FBUCxDQUFtQixPQUFuQixDQUFkO0FBQUEsZ0JBQUEsQ0FBQTtTQUZBO0FBQUEsUUFJQSxJQUFBLEdBQVcsSUFBQyxDQUFBLE9BQUQsQ0FBUyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVQsRUFBMkIsTUFBM0IsQ0FKWCxDQUFBO0FBQUEsUUFLQSxRQUFBLEdBQVcsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFuQixDQUxYLENBQUE7QUFPQSxRQUFBLElBQUEsQ0FBQSxJQUFXLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsUUFBdEIsQ0FBUDtBQUNFLFVBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0Qiw0Q0FBNUIsRUFDRTtBQUFBLFlBQUEsTUFBQSxFQUFRLHNDQUFSO1dBREYsQ0FBQSxDQURGO1NBUEE7QUFBQSxRQVdBLFFBQUEsR0FBVyxNQUFNLENBQUMsS0FBUCxDQUFhLFFBQWIsRUFBdUIsSUFBdkIsQ0FYWCxDQUFBO2VBWUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsUUFBakIsRUFBMkIsSUFBM0IsRUFiRjtPQUFBLGNBQUE7QUFnQkUsUUFESSxVQUNKLENBQUE7ZUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLDRDQUE1QixFQUNFO0FBQUEsVUFBQSxNQUFBLEVBQVEsQ0FBQyxDQUFDLEtBQVY7U0FERixFQWhCRjtPQURhO0lBQUEsQ0FwRGY7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/coffee-compile/lib/util.coffee
