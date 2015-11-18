(function() {
  module.exports = function(projectPath) {
    var babel, babelCoreUsed, callback, path, projectBabelCore;
    path = require('path');
    callback = this.async();
    process.chdir(projectPath);
    projectBabelCore = path.normalize(path.join(projectPath, '/node_modules/babel-core'));
    try {
      babel = require(projectBabelCore);
    } catch (_error) {
      projectBabelCore = '../node_modules/babel-core';
      babel = require(projectBabelCore);
    }
    babelCoreUsed = "Using babel-core at\n" + (require.resolve(projectBabelCore));
    return process.on('message', function(mObj) {
      var err, msgRet;
      if (mObj.command === 'transpile') {
        try {
          babel.transformFile(mObj.pathTo.sourceFile, mObj.babelOptions, (function(_this) {
            return function(err, result) {
              var msgRet;
              msgRet = {};
              msgRet.reqId = mObj.reqId;
              if (err) {
                msgRet.err = {};
                if (err.loc) {
                  msgRet.err.loc = err.loc;
                }
                if (err.codeFrame) {
                  msgRet.err.codeFrame = err.codeFrame;
                } else {
                  msgRet.err.codeFrame = "";
                }
                msgRet.err.message = err.message;
              }
              if (result) {
                msgRet.result = result;
                msgRet.result.ast = null;
              }
              msgRet.babelVersion = babel.version;
              msgRet.babelCoreUsed = babelCoreUsed;
              emit("transpile:" + mObj.reqId, msgRet);
              if (!mObj.pathTo.sourceFileInProject) {
                return callback();
              }
            };
          })(this));
        } catch (_error) {
          err = _error;
          msgRet = {};
          msgRet.reqId = mObj.reqId;
          msgRet.err = {};
          msgRet.err.message = err.message;
          msgRet.err.stack = err.stack;
          msgRet.babelCoreUsed = babelCoreUsed;
          emit("transpile:" + mObj.reqId, msgRet);
          callback();
        }
      }
      if (mObj.command === 'stop') {
        return callback();
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9saWIvdHJhbnNwaWxlci10YXNrLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUVBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFdBQUQsR0FBQTtBQUNmLFFBQUEsc0RBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7QUFBQSxJQUNBLFFBQUEsR0FBVyxJQUFDLENBQUEsS0FBRCxDQUFBLENBRFgsQ0FBQTtBQUFBLElBRUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxXQUFkLENBRkEsQ0FBQTtBQUFBLElBSUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLFNBQUwsQ0FBZ0IsSUFBSSxDQUFDLElBQUwsQ0FBVyxXQUFYLEVBQXdCLDBCQUF4QixDQUFoQixDQUpuQixDQUFBO0FBS0E7QUFDRSxNQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsZ0JBQVIsQ0FBUixDQURGO0tBQUEsY0FBQTtBQUlFLE1BQUEsZ0JBQUEsR0FBbUIsNEJBQW5CLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsZ0JBQVIsQ0FEUixDQUpGO0tBTEE7QUFBQSxJQVlBLGFBQUEsR0FBaUIsdUJBQUEsR0FBc0IsQ0FBQyxPQUFPLENBQUMsT0FBUixDQUFnQixnQkFBaEIsQ0FBRCxDQVp2QyxDQUFBO1dBY0EsT0FBTyxDQUFDLEVBQVIsQ0FBVyxTQUFYLEVBQXNCLFNBQUMsSUFBRCxHQUFBO0FBQ3BCLFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBRyxJQUFJLENBQUMsT0FBTCxLQUFnQixXQUFuQjtBQUNFO0FBQ0UsVUFBQSxLQUFLLENBQUMsYUFBTixDQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQWhDLEVBQTRDLElBQUksQ0FB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

//# sourceURL=/Users/kswedberg/.atom/packages/language-babel/lib/transpiler-task.coffee
