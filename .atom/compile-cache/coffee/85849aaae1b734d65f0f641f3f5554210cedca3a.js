(function() {
  var Point, cleanSymbol, isbefore, issymbol, mergeAdjacent, rebefore, resym;

  Point = require('atom').Point;

  resym = /^(entity.name.type.class|entity.name.function|entity.other.attribute-name.class)/;

  rebefore = /^(meta.rspec.behaviour)/;

  module.exports = function(path, grammar, text) {
    var lineno, lines, nextIsSymbol, offset, prev, symbol, symbols, token, tokens, _i, _j, _len, _len1;
    lines = grammar.tokenizeLines(text);
    symbols = [];
    nextIsSymbol = false;
    for (lineno = _i = 0, _len = lines.length; _i < _len; lineno = ++_i) {
      tokens = lines[lineno];
      offset = 0;
      prev = null;
      for (_j = 0, _len1 = tokens.length; _j < _len1; _j++) {
        token = tokens[_j];
        if (nextIsSymbol || issymbol(token)) {
          nextIsSymbol = false;
          symbol = cleanSymbol(token);
          if (symbol) {
            if (!mergeAdjacent(prev, token, symbols, offset)) {
              symbols.push({
                name: token.value,
                path: path,
                position: new Point(lineno, offset)
              });
              prev = token;
            }
          }
        }
        nextIsSymbol = isbefore(token);
        offset += token.value.length;
      }
    }
    return symbols;
  };

  cleanSymbol = function(token) {
    var name;
    name = token.value.trim().replace(/"/g, '');
    return name || null;
  };

  issymbol = function(token) {
    var scope, _i, _len, _ref;
    if (token.value.trim().length && token.scopes) {
      _ref = token.scopes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        scope = _ref[_i];
        if (resym.test(scope)) {
          return true;
        }
      }
    }
    return false;
  };

  isbefore = function(token) {
    var scope, _i, _len, _ref;
    if (token.value.trim().length && token.scopes) {
      _ref = token.scopes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        scope = _ref[_i];
        console.log('checking', scope, '=', rebefore.test(scope));
        if (rebefore.test(scope)) {
          return true;
        }
      }
    }
    return false;
  };

  mergeAdjacent = function(prevToken, thisToken, symbols, offset) {
    var prevSymbol;
    if (offset && prevToken) {
      prevSymbol = symbols[symbols.length - 1];
      if (offset === prevSymbol.position.column + prevToken.value.length) {
        prevSymbol.name += thisToken.value;
        return true;
      }
    }
    return false;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9nb3RvL2xpYi9zeW1ib2wtZ2VuZXJhdG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxzRUFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVIsRUFBVCxLQUFELENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsa0ZBTFIsQ0FBQTs7QUFBQSxFQWFBLFFBQUEsR0FBWSx5QkFiWixDQUFBOztBQUFBLEVBaUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsSUFBaEIsR0FBQTtBQUNmLFFBQUEsOEZBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxPQUFPLENBQUMsYUFBUixDQUFzQixJQUF0QixDQUFSLENBQUE7QUFBQSxJQUVBLE9BQUEsR0FBVSxFQUZWLENBQUE7QUFBQSxJQUlBLFlBQUEsR0FBZSxLQUpmLENBQUE7QUFNQSxTQUFBLDhEQUFBOzZCQUFBO0FBQ0UsTUFBQSxNQUFBLEdBQVMsQ0FBVCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sSUFEUCxDQUFBO0FBRUEsV0FBQSwrQ0FBQTsyQkFBQTtBQUNFLFFBQUEsSUFBRyxZQUFBLElBQWdCLFFBQUEsQ0FBUyxLQUFULENBQW5CO0FBQ0UsVUFBQSxZQUFBLEdBQWUsS0FBZixDQUFBO0FBQUEsVUFFQSxNQUFBLEdBQVMsV0FBQSxDQUFZLEtBQVosQ0FGVCxDQUFBO0FBR0EsVUFBQSxJQUFHLE1BQUg7QUFDRSxZQUFBLElBQUcsQ0FBQSxhQUFJLENBQWMsSUFBZCxFQUFvQixLQUFwQixFQUEyQixPQUEzQixFQUFvQyxNQUFwQyxDQUFQO0FBQ0UsY0FBQSxPQUFPLENBQUMsSUFBUixDQUFhO0FBQUEsZ0JBQUUsSUFBQSxFQUFNLEtBQUssQ0FBQyxLQUFkO0FBQUEs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

//# sourceURL=/Users/kswedberg/.atom/packages/goto/lib/symbol-generator.coffee
