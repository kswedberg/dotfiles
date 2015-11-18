
/*
 */

(function() {
  "use strict";
  var Beautifier, Gherkin, Lexer, logger,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  Lexer = require('gherkin').Lexer('en');

  logger = require('../logger')(__filename);

  module.exports = Gherkin = (function(_super) {
    __extends(Gherkin, _super);

    function Gherkin() {
      return Gherkin.__super__.constructor.apply(this, arguments);
    }

    Gherkin.prototype.name = "Gherkin formatter";

    Gherkin.prototype.options = {
      gherkin: true
    };

    Gherkin.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var lexer, line, loggerLevel, recorder, _i, _len, _ref;
        recorder = {
          lines: [],
          tags: [],
          comments: [],
          last_obj: null,
          indent_to: function(indent_level) {
            if (indent_level == null) {
              indent_level = 0;
            }
            return options.indent_char.repeat(options.indent_size * indent_level);
          },
          write_blank: function() {
            return this.lines.push('');
          },
          write_indented: function(content, indent) {
            var line, _i, _len, _ref, _results;
            if (indent == null) {
              indent = 0;
            }
            _ref = content.trim().split("\n");
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              line = _ref[_i];
              _results.push(this.lines.push("" + (this.indent_to(indent)) + (line.trim())));
            }
            return _results;
          },
          write_comments: function(indent) {
            var comment, _i, _len, _ref, _results;
            if (indent == null) {
              indent = 0;
            }
            _ref = this.comments.splice(0, this.comments.length);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              comment = _ref[_i];
              _results.push(this.write_indented(comment, indent));
            }
            return _results;
          },
          write_tags: function(indent) {
            if (indent == null) {
              indent = 0;
            }
            if (this.tags.length > 0) {
              return this.write_indented(this.tags.splice(0, this.tags.length).join(' '), indent);
            }
          },
          comment: function(value, line) {
            logger.verbose({
              token: 'comment',
              value: value.trim(),
              line: line
            });
            return this.comments.push(value);
          },
          tag: function(value, line) {
            logger.verbose({
              token: 'tag',
              value: value,
              line: line
            });
            return this.tags.push(value);
          },
          feature: function(keyword, name, description, line) {
            logger.verbose({
              token: 'feature',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_comments(0);
            this.write_tags(0);
            this.write_indented("" + keyword + ": " + name, '');
            if (description) {
              return this.write_indented(description, 1);
            }
          },
          background: function(keyword, name, description, line) {
            logger.verbose({
              token: 'background',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_indented("" + keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario: function(keyword, name, description, line) {
            logger.verbose({
              token: 'scenario',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented("" + keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario_outline: function(keyword, name, description, line) {
            logger.verbose({
              token: 'outline',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented("" + keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          examples: function(keyword, name, description, line) {
            logger.verbose({
              token: 'examples',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(2);
            this.write_tags(2);
            this.write_indented("" + keyword + ": " + name, 2);
            if (description) {
              return this.write_indented(description, 3);
            }
          },
          step: function(keyword, name, line) {
            logger.verbose({
              token: 'step',
              keyword: keyword,
              name: name,
              line: line
            });
            this.write_comments(2);
            return this.write_indented("" + keyword + name, 2);
          },
          doc_string: function(content_type, string, line) {
            var three_quotes;
            logger.verbose({
              token: 'doc_string',
              content_type: content_type,
              string: string,
              line: line
            });
            three_quotes = '"""';
            this.write_comments(2);
            return this.write_indented("" + three_quotes + content_type + "\n" + string + "\n" + three_quotes, 3);
          },
          row: function(cells, line) {
            logger.verbose({
              token: 'row',
              cells: cells,
              line: line
            });
            this.write_comments(3);
            return this.write_indented("| " + (cells.join(' | ')) + " |", 3);
          },
          eof: function() {
            logger.verbose({
              token: 'eof'
            });
            return this.write_comments(2);
          }
        };
        lexer = new Lexer(recorder);
        lexer.scan(text);
        loggerLevel = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify._loggerLevel') : void 0;
        if (loggerLevel === 'verbose') {
          _ref = recorder.lines;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            line = _ref[_i];
            logger.verbose("> " + line);
          }
        }
        return resolve(recorder.lines.join("\n"));
      });
    };

    return Gherkin;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9naGVya2luLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUdBLFlBSEEsQ0FBQTtBQUFBLE1BQUEsa0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FBa0IsQ0FBQyxLQUFuQixDQUF5QixJQUF6QixDQUxSLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FBQSxDQUFxQixVQUFyQixDQU5ULENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0JBQUEsSUFBQSxHQUFNLG1CQUFOLENBQUE7O0FBQUEsc0JBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxPQUFBLEVBQVMsSUFERjtLQUZULENBQUE7O0FBQUEsc0JBTUEsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNsQixZQUFBLGtEQUFBO0FBQUEsUUFBQSxRQUFBLEdBQVc7QUFBQSxVQUNULEtBQUEsRUFBTyxFQURFO0FBQUEsVUFFVCxJQUFBLEVBQU0sRUFGRztBQUFBLFVBR1QsUUFBQSxFQUFVLEVBSEQ7QUFBQSxVQUtULFFBQUEsRUFBVSxJQUxEO0FBQUEsVUFPVCxTQUFBLEVBQVcsU0FBQyxZQUFELEdBQUE7O2NBQUMsZUFBZTthQUN6QjtBQUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/beautifiers/gherkin.coffee
