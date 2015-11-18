(function() {
  var arrayEquals, objectEquals,
    __slice = [].slice;

  arrayEquals = function(arr1, arr2) {
    return arr1.forEach(function(a, i) {
      return expect(a).toEqual(arr2[i]);
    });
  };

  objectEquals = function(o1, o2) {
    return Object.keys(o1).forEach(function(prop) {
      return expect(o1[prop]).toEqual(o2[prop]);
    });
  };

  module.exports = function(obj, fn) {
    var mock, spy;
    spy = spyOn(obj, fn);
    return mock = {
      "do": function(method) {
        spy.andCallFake(method);
        return mock;
      },
      verifyCalledWith: function() {
        var args, calledWith;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        calledWith = spy.mostRecentCall.args;
        return args.forEach(function(arg, i) {
          if (arg.forEach != null) {
            arrayEquals(arg, calledWith[i]);
          }
          if (arg.charAt != null) {
            return expect(arg).toEqual(calledWith[i]);
          } else {
            return objectEquals(arg, calledWith[i]);
          }
        });
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL21vY2suY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO1dBQ1osSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFDLENBQUQsRUFBSSxDQUFKLEdBQUE7YUFDWCxNQUFBLENBQU8sQ0FBUCxDQUFTLENBQUMsT0FBVixDQUFrQixJQUFLLENBQUEsQ0FBQSxDQUF2QixFQURXO0lBQUEsQ0FBYixFQURZO0VBQUEsQ0FBZCxDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLFNBQUMsRUFBRCxFQUFLLEVBQUwsR0FBQTtXQUNiLE1BQU0sQ0FBQyxJQUFQLENBQVksRUFBWixDQUFlLENBQUMsT0FBaEIsQ0FBd0IsU0FBQyxJQUFELEdBQUE7YUFDdEIsTUFBQSxDQUFPLEVBQUcsQ0FBQSxJQUFBLENBQVYsQ0FBZ0IsQ0FBQyxPQUFqQixDQUF5QixFQUFHLENBQUEsSUFBQSxDQUE1QixFQURzQjtJQUFBLENBQXhCLEVBRGE7RUFBQSxDQUpmLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLEdBQUQsRUFBTSxFQUFOLEdBQUE7QUFDZixRQUFBLFNBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxLQUFBLENBQU0sR0FBTixFQUFXLEVBQVgsQ0FBTixDQUFBO0FBQ0EsV0FBTyxJQUFBLEdBQ0w7QUFBQSxNQUFBLElBQUEsRUFBSSxTQUFDLE1BQUQsR0FBQTtBQUNGLFFBQUEsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsTUFBaEIsQ0FBQSxDQUFBO0FBQ0EsZUFBTyxJQUFQLENBRkU7TUFBQSxDQUFKO0FBQUEsTUFHQSxnQkFBQSxFQUFrQixTQUFBLEdBQUE7QUFDaEIsWUFBQSxnQkFBQTtBQUFBLFFBRGlCLDhEQUNqQixDQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFoQyxDQUFBO2VBQ0EsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFDLEdBQUQsRUFBTSxDQUFOLEdBQUE7QUFDWCxVQUFBLElBQUcsbUJBQUg7QUFDRSxZQUFBLFdBQUEsQ0FBWSxHQUFaLEVBQWlCLFVBQVcsQ0FBQSxDQUFBLENBQTVCLENBQUEsQ0FERjtXQUFBO0FBRUEsVUFBQSxJQUFHLGtCQUFIO21CQUNFLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxPQUFaLENBQW9CLFVBQVcsQ0FBQSxDQUFBLENBQS9CLEVBREY7V0FBQSxNQUFBO21CQUdFLFlBQUEsQ0FBYSxHQUFiLEVBQWtCLFVBQVcsQ0FBQSxDQUFBLENBQTdCLEVBSEY7V0FIVztRQUFBLENBQWIsRUFGZ0I7TUFBQSxDQUhsQjtLQURGLENBRmU7RUFBQSxDQVJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/mock.coffee
