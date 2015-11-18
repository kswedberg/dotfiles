(function() {
  var attributePattern, firstCharsEqual, fs, path, tagPattern, trailingWhitespace;

  fs = require('fs');

  path = require('path');

  trailingWhitespace = /\s$/;

  attributePattern = /\s+([a-zA-Z][-a-zA-Z]*)\s*=\s*$/;

  tagPattern = /<([a-zA-Z][-a-zA-Z]*)(?:\s|$)/;

  module.exports = {
    selector: '.text.html',
    disableForSelector: '.text.html .comment',
    filterSuggestions: true,
    getSuggestions: function(request) {
      var prefix;
      prefix = request.prefix;
      if (this.isAttributeValueStartWithNoPrefix(request)) {
        return this.getAttributeValueCompletions(request);
      } else if (this.isAttributeValueStartWithPrefix(request)) {
        return this.getAttributeValueCompletions(request, prefix);
      } else if (this.isAttributeStartWithNoPrefix(request)) {
        return this.getAttributeNameCompletions(request);
      } else if (this.isAttributeStartWithPrefix(request)) {
        return this.getAttributeNameCompletions(request, prefix);
      } else if (this.isTagStartWithNoPrefix(request)) {
        return this.getTagNameCompletions();
      } else if (this.isTagStartTagWithPrefix(request)) {
        return this.getTagNameCompletions(prefix);
      } else {
        return [];
      }
    },
    onDidInsertSuggestion: function(_arg) {
      var editor, suggestion;
      editor = _arg.editor, suggestion = _arg.suggestion;
      if (suggestion.type === 'attribute') {
        return setTimeout(this.triggerAutocomplete.bind(this, editor), 1);
      }
    },
    triggerAutocomplete: function(editor) {
      return atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate', {
        activatedManually: false
      });
    },
    isTagStartWithNoPrefix: function(_arg) {
      var prefix, scopeDescriptor, scopes;
      prefix = _arg.prefix, scopeDescriptor = _arg.scopeDescriptor;
      scopes = scopeDescriptor.getScopesArray();
      if (prefix === '<' && scopes.length === 1) {
        return scopes[0] === 'text.html.basic';
      } else if (prefix === '<' && scopes.length === 2) {
        return scopes[0] === 'text.html.basic' && scopes[1] === 'meta.scope.outside-tag.html';
      } else {
        return false;
      }
    },
    isTagStartTagWithPrefix: function(_arg) {
      var prefix, scopeDescriptor;
      prefix = _arg.prefix, scopeDescriptor = _arg.scopeDescriptor;
      if (!prefix) {
        return false;
      }
      if (trailingWhitespace.test(prefix)) {
        return false;
      }
      return this.hasTagScope(scopeDescriptor.getScopesArray());
    },
    isAttributeStartWithNoPrefix: function(_arg) {
      var prefix, scopeDescriptor;
      prefix = _arg.prefix, scopeDescriptor = _arg.scopeDescriptor;
      if (!trailingWhitespace.test(prefix)) {
        return false;
      }
      return this.hasTagScope(scopeDescriptor.getScopesArray());
    },
    isAttributeStartWithPrefix: function(_arg) {
      var prefix, scopeDescriptor, scopes;
      prefix = _arg.prefix, scopeDescriptor = _arg.scopeDescriptor;
      if (!prefix) {
        return false;
      }
      if (trailingWhitespace.test(prefix)) {
        return false;
      }
      scopes = scopeDescriptor.getScopesArray();
      if (scopes.indexOf('entity.other.attribute-name.html') !== -1) {
        return true;
      }
      if (!this.hasTagScope(scopes)) {
        return false;
      }
      return scopes.indexOf('punctuation.definition.tag.html') !== -1 || scopes.indexOf('punctuation.definition.tag.end.html') !== -1;
    },
    isAttributeValueStartWithNoPrefix: function(_arg) {
      var lastPrefixCharacter, prefix, scopeDescriptor, scopes;
      scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      lastPrefixCharacter = prefix[prefix.length - 1];
      if (lastPrefixCharacter !== '"' && lastPrefixCharacter !== "'") {
        return false;
      }
      scopes = scopeDescriptor.getScopesArray();
      return this.hasStringScope(scopes) && this.hasTagScope(scopes);
    },
    isAttributeValueStartWithPrefix: function(_arg) {
      var lastPrefixCharacter, prefix, scopeDescriptor, scopes;
      scopeDescriptor = _arg.scopeDescriptor, prefix = _arg.prefix;
      lastPrefixCharacter = prefix[prefix.length - 1];
      if (lastPrefixCharacter === '"' || lastPrefixCharacter === "'") {
        return false;
      }
      scopes = scopeDescriptor.getScopesArray();
      return this.hasStringScope(scopes) && this.hasTagScope(scopes);
    },
    hasTagScope: function(scopes) {
      return scopes.indexOf('meta.tag.any.html') !== -1 || scopes.indexOf('meta.tag.other.html') !== -1 || scopes.indexOf('meta.tag.block.any.html') !== -1 || scopes.indexOf('meta.tag.inline.any.html') !== -1 || scopes.indexOf('meta.tag.structure.any.html') !== -1;
    },
    hasStringScope: function(scopes) {
      return scopes.indexOf('string.quoted.double.html') !== -1 || scopes.indexOf('string.quoted.single.html') !== -1;
    },
    getTagNameCompletions: function(prefix) {
      var attributes, completions, tag, _ref;
      completions = [];
      _ref = this.completions.tags;
      for (tag in _ref) {
        attributes = _ref[tag];
        if (!prefix || firstCharsEqual(tag, prefix)) {
          completions.push(this.buildTagCompletion(tag));
        }
      }
      return completions;
    },
    buildTagCompletion: function(tag) {
      return {
        text: tag,
        type: 'tag',
        description: "HTML <" + tag + "> tag",
        descriptionMoreURL: this.getTagDocsURL(tag)
      };
    },
    getAttributeNameCompletions: function(_arg, prefix) {
      var attribute, bufferPosition, completions, editor, options, tag, tagAttributes, _i, _len, _ref;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
      completions = [];
      tag = this.getPreviousTag(editor, bufferPosition);
      tagAttributes = this.getTagAttributes(tag);
      for (_i = 0, _len = tagAttributes.length; _i < _len; _i++) {
        attribute = tagAttributes[_i];
        if (!prefix || firstCharsEqual(attribute, prefix)) {
          completions.push(this.buildAttributeCompletion(attribute, tag));
        }
      }
      _ref = this.completions.attributes;
      for (attribute in _ref) {
        options = _ref[attribute];
        if (!prefix || firstCharsEqual(attribute, prefix)) {
          if (options.global) {
            completions.push(this.buildAttributeCompletion(attribute));
          }
        }
      }
      return completions;
    },
    buildAttributeCompletion: function(attribute, tag) {
      if (tag != null) {
        return {
          snippet: "" + attribute + "=\"$1\"$0",
          displayText: attribute,
          type: 'attribute',
          rightLabel: "<" + tag + ">",
          description: "" + attribute + " attribute local to <" + tag + "> tags",
          descriptionMoreURL: this.getLocalAttributeDocsURL(attribute, tag)
        };
      } else {
        return {
          snippet: "" + attribute + "=\"$1\"$0",
          displayText: attribute,
          type: 'attribute',
          description: "Global " + attribute + " attribute",
          descriptionMoreURL: this.getGlobalAttributeDocsURL(attribute)
        };
      }
    },
    getAttributeValueCompletions: function(_arg, prefix) {
      var attribute, bufferPosition, editor, tag, value, values, _i, _len, _results;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
      tag = this.getPreviousTag(editor, bufferPosition);
      attribute = this.getPreviousAttribute(editor, bufferPosition);
      values = this.getAttributeValues(attribute);
      _results = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        if (!prefix || firstCharsEqual(value, prefix)) {
          _results.push(this.buildAttributeValueCompletion(tag, attribute, value));
        }
      }
      return _results;
    },
    buildAttributeValueCompletion: function(tag, attribute, value) {
      if (this.completions.attributes[attribute].global) {
        return {
          text: value,
          type: 'value',
          description: "" + value + " value for global " + attribute + " attribute",
          descriptionMoreURL: this.getGlobalAttributeDocsURL(attribute)
        };
      } else {
        return {
          text: value,
          type: 'value',
          description: "" + value + " value for " + attribute + " attribute local to <" + tag + ">",
          descriptionMoreURL: this.getLocalAttributeDocsURL(attribute, tag)
        };
      }
    },
    loadCompletions: function() {
      this.completions = {};
      return fs.readFile(path.resolve(__dirname, '..', 'completions.json'), (function(_this) {
        return function(error, content) {
          if (error == null) {
            _this.completions = JSON.parse(content);
          }
        };
      })(this));
    },
    getPreviousTag: function(editor, bufferPosition) {
      var row, tag, _ref;
      row = bufferPosition.row;
      while (row >= 0) {
        tag = (_ref = tagPattern.exec(editor.lineTextForBufferRow(row))) != null ? _ref[1] : void 0;
        if (tag) {
          return tag;
        }
        row--;
      }
    },
    getPreviousAttribute: function(editor, bufferPosition) {
      var line, quoteIndex, _ref, _ref1;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]).trim();
      quoteIndex = line.length - 1;
      while (line[quoteIndex] && !((_ref = line[quoteIndex]) === '"' || _ref === "'")) {
        quoteIndex--;
      }
      line = line.substring(0, quoteIndex);
      return (_ref1 = attributePattern.exec(line)) != null ? _ref1[1] : void 0;
    },
    getAttributeValues: function(attribute) {
      var _ref;
      attribute = this.completions.attributes[attribute];
      return (_ref = attribute != null ? attribute.attribOption : void 0) != null ? _ref : [];
    },
    getTagAttributes: function(tag) {
      var _ref, _ref1;
      return (_ref = (_ref1 = this.completions.tags[tag]) != null ? _ref1.attributes : void 0) != null ? _ref : [];
    },
    getTagDocsURL: function(tag) {
      return "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/" + tag;
    },
    getLocalAttributeDocsURL: function(attribute, tag) {
      return "" + (this.getTagDocsURL(tag)) + "#attr-" + attribute;
    },
    getGlobalAttributeDocsURL: function(attribute) {
      return "https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/" + attribute;
    }
  };

  firstCharsEqual = function(str1, str2) {
    return str1[0].toLowerCase() === str2[0].toLowerCase();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtanF1ZXJ5LW1vYmlsZS9saWIvcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJFQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixLQUhyQixDQUFBOztBQUFBLEVBSUEsZ0JBQUEsR0FBbUIsaUNBSm5CLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsK0JBTGIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxZQUFWO0FBQUEsSUFDQSxrQkFBQSxFQUFvQixxQkFEcEI7QUFBQSxJQUVBLGlCQUFBLEVBQW1CLElBRm5CO0FBQUEsSUFJQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxHQUFBO0FBQ2QsVUFBQSxNQUFBO0FBQUEsTUFBQyxTQUFVLFFBQVYsTUFBRCxDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxpQ0FBRCxDQUFtQyxPQUFuQyxDQUFIO2VBQ0UsSUFBQyxDQUFBLDRCQUFELENBQThCLE9BQTlCLEVBREY7T0FBQSxNQUVLLElBQUcsSUFBQyxDQUFBLCtCQUFELENBQWlDLE9BQWpDLENBQUg7ZUFDSCxJQUFDLENBQUEsNEJBQUQsQ0FBOEIsT0FBOUIsRUFBdUMsTUFBdkMsRUFERztPQUFBLE1BRUEsSUFBRyxJQUFDLENBQUEsNEJBQUQsQ0FBOEIsT0FBOUIsQ0FBSDtlQUNILElBQUMsQ0FBQSwyQkFBRCxDQUE2QixPQUE3QixFQURHO09BQUEsTUFFQSxJQUFHLElBQUMsQ0FBQSwwQkFBRCxDQUE0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

//# sourceURL=/Users/kswedberg/.atom/packages/autocomplete-jquery-mobile/lib/provider.coffee
