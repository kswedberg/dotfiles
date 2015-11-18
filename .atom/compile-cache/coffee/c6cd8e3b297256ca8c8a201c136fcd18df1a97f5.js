(function() {
  var Aligner, alignLines, alignLinesMultiple;

  Aligner = require('./aligner');

  module.exports = {
    config: {
      alignmentSpaceChars: {
        type: 'array',
        "default": ['=>', ':=', '='],
        items: {
          type: "string"
        },
        description: "insert space in front of the character (a=1 > a =1)",
        order: 2
      },
      alignBy: {
        type: 'array',
        "default": ['=>', ':=', ':', '='],
        items: {
          type: "string"
        },
        description: "consider the order, the left most matching value is taken to compute the alignment",
        order: 1
      },
      addSpacePostfix: {
        type: 'boolean',
        "default": false,
        description: "insert space after the matching character (a=1 > a= 1) if character is part of the 'alignment space chars'",
        order: 3
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', {
        'atom-alignment:align': function() {
          var editor;
          editor = atom.workspace.getActivePaneItem();
          return alignLines(editor);
        },
        'atom-alignment:alignMultiple': function() {
          var editor;
          editor = atom.workspace.getActivePaneItem();
          return alignLinesMultiple(editor);
        }
      });
    }
  };

  alignLines = function(editor) {
    var a, addSpacePostfix, matcher, spaceChars;
    spaceChars = atom.config.get('atom-alignment.alignmentSpaceChars');
    matcher = atom.config.get('atom-alignment.alignBy');
    addSpacePostfix = atom.config.get('atom-alignment.addSpacePostfix');
    a = new Aligner(editor, spaceChars, matcher, addSpacePostfix);
    a.align(false);
  };

  alignLinesMultiple = function(editor) {
    var a, addSpacePostfix, matcher, spaceChars;
    spaceChars = atom.config.get('atom-alignment.alignmentSpaceChars');
    matcher = atom.config.get('atom-alignment.alignBy');
    addSpacePostfix = atom.config.get('atom-alignment.addSpacePostfix');
    a = new Aligner(editor, spaceChars, matcher, addSpacePostfix);
    a.align(true);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWFsaWdubWVudC9saWIvYXRvbS1hbGlnbm1lbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVDQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLE1BQUEsRUFDSTtBQUFBLE1BQUEsbUJBQUEsRUFDSTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsR0FBYixDQURUO0FBQUEsUUFFQSxLQUFBLEVBQ0k7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEo7QUFBQSxRQUlBLFdBQUEsRUFBYSxxREFKYjtBQUFBLFFBS0EsS0FBQSxFQUFPLENBTFA7T0FESjtBQUFBLE1BT0EsT0FBQSxFQUNJO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBRFQ7QUFBQSxRQUVBLEtBQUEsRUFDSTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FISjtBQUFBLFFBSUEsV0FBQSxFQUFhLG9GQUpiO0FBQUEsUUFLQSxLQUFBLEVBQU8sQ0FMUDtPQVJKO0FBQUEsTUFjQSxlQUFBLEVBQ0k7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDRHQUZiO0FBQUEsUUFHQSxLQUFBLEVBQU8sQ0FIUDtPQWZKO0tBREo7QUFBQSxJQXFCQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0k7QUFBQSxRQUFBLHNCQUFBLEVBQXdCLFNBQUEsR0FBQTtBQUNwQixjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBVCxDQUFBO2lCQUNBLFVBQUEsQ0FBVyxNQUFYLEVBRm9CO1FBQUEsQ0FBeEI7QUFBQSxRQUlBLDhCQUFBLEVBQWdDLFNBQUEsR0FBQTtBQUM1QixjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBVCxDQUFBO2lCQUNBLGtCQUFBLENBQW1CLE1BQW5CLEVBRjRCO1FBQUEsQ0FKaEM7T0FESixFQURNO0lBQUEsQ0FyQlY7R0FISixDQUFBOztBQUFBLEVBa0NBLFVBQUEsR0FBYSxTQUFDLE1BQUQsR0FBQTtBQUNULFFBQUEsdUNBQUE7QUFBQSxJQUFBLFVBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQUFuQixDQUFBO0FBQUEsSUFDQSxPQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FEbkIsQ0FBQTtBQUFBLElBRUEsZUFBQSxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLENBRm5CLENBQUE7QUFBQSxJQUdBLENBQUEsR0FBUSxJQUFBLE9BQUEsQ0FBUSxNQUFSLEVBQWdCLFVBQWhCLEVBQTRCLE9BQTVCLEVBQXFDLGVBQXJDLENBSFIsQ0FBQTtBQUFBLElBSUEsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSLENBSkEsQ0FEUztFQUFBLENBbENiLENBQUE7O0FBQUEsRUEwQ0Esa0JBQUEsR0FBcUIsU0FBQyxNQUFELEdBQUE7QUFDakIsUUFBQSx1Q0FBQTtBQUFBLElBQUEsVUFBQSxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCLENBQW5CLENBQUE7QUFBQSxJQUNBLE9BQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixDQURuQixDQUFBO0FBQUEsSUFFQSxlQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsQ0FGbkIsQ0FBQTtBQUFBLElBR0EsQ0FBQSxHQUFRLElBQUEsT0FBQSxDQUFRLE1BQVIsRUFBZ0IsVUFBaEIsRUFBNEIsT0FBNUIsRUFBcUMsZUFBckMsQ0FIUixDQUFBO0FBQUEsSUFJQSxDQUFDLENBQUMsS0FBRixDQUFRLElBQVIsQ0FKQSxDQURpQjtFQUFBLENBMUNyQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/atom-alignment/lib/atom-alignment.coffee
