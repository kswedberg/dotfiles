(function() {
  var FormatText, LIST_OL_REGEX, config, utils;

  config = require("../config");

  utils = require("../utils");

  LIST_OL_REGEX = /^(\s*)(\d+)\.\s*(.*)$/;

  module.exports = FormatText = (function() {
    function FormatText(action) {
      this.action = action;
      this.editor = atom.workspace.getActiveTextEditor();
    }

    FormatText.prototype.trigger = function(e) {
      var fn;
      fn = this.action.replace(/-[a-z]/ig, function(s) {
        return s[1].toUpperCase();
      });
      return this.editor.transact((function(_this) {
        return function() {
          var formattedText, paragraphRange, range, text;
          paragraphRange = _this.editor.getCurrentParagraphBufferRange();
          range = _this.editor.getSelectedBufferRange();
          if (paragraphRange) {
            range = paragraphRange.union(range);
          }
          text = _this.editor.getTextInBufferRange(range);
          if (range.start.row === range.end.row || text.trim() === "") {
            return;
          }
          formattedText = _this[fn](e, range, text.split("\n"));
          if (formattedText) {
            return _this.editor.setTextInBufferRange(range, formattedText);
          }
        };
      })(this));
    };

    FormatText.prototype.correctOrderListNumbers = function(e, range, lines) {
      var correctedLines, idx, indent, indentStack, line, matches, orderStack, _i, _len;
      correctedLines = [];
      indentStack = [];
      orderStack = [];
      for (idx = _i = 0, _len = lines.length; _i < _len; idx = ++_i) {
        line = lines[idx];
        if (matches = LIST_OL_REGEX.exec(line)) {
          indent = matches[1];
          if (indentStack.length === 0 || indent.length > indentStack[0].length) {
            indentStack.unshift(indent);
            orderStack.unshift(1);
          } else if (indent.length < indentStack[0].length) {
            indentStack.shift();
            orderStack.shift();
            orderStack.unshift(orderStack.shift() + 1);
          } else {
            orderStack.unshift(orderStack.shift() + 1);
          }
          correctedLines[idx] = "" + indentStack[0] + orderStack[0] + ". " + matches[3];
        } else {
          correctedLines[idx] = line;
        }
      }
      return correctedLines.join("\n");
    };

    FormatText.prototype.formatTable = function(e, range, lines) {
      var options, row, rows, table, _i, _len, _ref, _ref1;
      if (lines.some(function(line) {
        return line.trim() !== "" && !utils.isTableRow(line);
      })) {
        return;
      }
      _ref = this._parseTable(lines), rows = _ref.rows, options = _ref.options;
      table = [];
      table.push(utils.createTableRow(rows[0], options).trimRight());
      table.push(utils.createTableSeparator(options));
      _ref1 = rows.slice(1);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        row = _ref1[_i];
        table.push(utils.createTableRow(row, options).trimRight());
      }
      return table.join("\n");
    };

    FormatText.prototype._parseTable = function(lines) {
      var columnWidth, i, line, options, row, rows, separator, _i, _j, _len, _len1, _ref;
      rows = [];
      options = {
        numOfColumns: 1,
        extraPipes: config.get("tableExtraPipes"),
        columnWidth: 1,
        columnWidths: [],
        alignment: config.get("tableAlignment"),
        alignments: []
      };
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (line.trim() === "") {
          continue;
        } else if (utils.isTableSeparator(line)) {
          separator = utils.parseTableSeparator(line);
          options.extraPipes = options.extraPipes || separator.extraPipes;
          options.alignments = separator.alignments;
          options.numOfColumns = Math.max(options.numOfColumns, separator.columns.length);
        } else {
          row = utils.parseTableRow(line);
          rows.push(row.columns);
          options.numOfColumns = Math.max(options.numOfColumns, row.columns.length);
          _ref = row.columnWidths;
          for (i = _j = 0, _len1 = _ref.length; _j < _len1; i = ++_j) {
            columnWidth = _ref[i];
            options.columnWidths[i] = Math.max(options.columnWidths[i] || 0, columnWidth);
          }
        }
      }
      return {
        rows: rows,
        options: options
      };
    };

    return FormatText;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL2NvbW1hbmRzL2Zvcm1hdC10ZXh0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUixDQUFULENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVIsQ0FEUixDQUFBOztBQUFBLEVBR0EsYUFBQSxHQUFnQix1QkFIaEIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFUyxJQUFBLG9CQUFDLE1BQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxNQUFWLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBRFYsQ0FEVztJQUFBLENBQWI7O0FBQUEseUJBSUEsT0FBQSxHQUFTLFNBQUMsQ0FBRCxHQUFBO0FBQ1AsVUFBQSxFQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQWdCLFVBQWhCLEVBQTRCLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBRSxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQUwsQ0FBQSxFQUFQO01BQUEsQ0FBNUIsQ0FBTCxDQUFBO2FBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFFZixjQUFBLDBDQUFBO0FBQUEsVUFBQSxjQUFBLEdBQWlCLEtBQUMsQ0FBQSxNQUFNLENBQUMsOEJBQVIsQ0FBQSxDQUFqQixDQUFBO0FBQUEsVUFFQSxLQUFBLEdBQVEsS0FBQyxDQUFBLE1BQU0sQ0FBQyxz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

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/commands/format-text.coffee
