(function() {
  var entities, entitiesCoderDecoder;

  entities = null;

  module.exports = {
    activate: function(state) {
      atom.workspaceView.command('html-entities:encode', function() {
        return entitiesCoderDecoder('encode');
      });
      return atom.workspaceView.command('html-entities:decode', function() {
        return entitiesCoderDecoder('decode');
      });
    }
  };

  entitiesCoderDecoder = function(action) {
    var editor, selectedText;
    editor = atom.workspace.getActiveEditor();
    if (editor == null) {
      return;
    }
    if (entities == null) {
      entities = require('entities');
    }
    selectedText = editor.getSelectedText();
    if (selectedText && action === 'decode') {
      return editor.insertText(entities.decodeXML(selectedText));
    } else if (selectedText) {
      return editor.insertText(entities.encodeXML(selectedText));
    } else if (action === 'decode') {
      return editor.setText(entities.decodeXML(editor.getText()));
    } else {
      return editor.setText(entities.encodeXML(editor.getText()));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLElBQVgsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixzQkFBM0IsRUFBbUQsU0FBQSxHQUFBO2VBQ2pELG9CQUFBLENBQXFCLFFBQXJCLEVBRGlEO01BQUEsQ0FBbkQsQ0FBQSxDQUFBO2FBR0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixzQkFBM0IsRUFBbUQsU0FBQSxHQUFBO2VBQ2pELG9CQUFBLENBQXFCLFFBQXJCLEVBRGlEO01BQUEsQ0FBbkQsRUFKUTtJQUFBLENBQVY7R0FIRixDQUFBOztBQUFBLEVBVUEsb0JBQUEsR0FBdUIsU0FBQyxNQUFELEdBQUE7QUFDckIsUUFBQSxvQkFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBQVQsQ0FBQTtBQUNBLElBQUEsSUFBYyxjQUFkO0FBQUEsWUFBQSxDQUFBO0tBREE7O01BR0EsV0FBWSxPQUFBLENBQVEsVUFBUjtLQUhaO0FBQUEsSUFLQSxZQUFBLEdBQWUsTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUxmLENBQUE7QUFNQSxJQUFBLElBQUcsWUFBQSxJQUFpQixNQUFBLEtBQVUsUUFBOUI7YUFDRSxNQUFNLENBQUMsVUFBUCxDQUFrQixRQUFRLENBQUMsU0FBVCxDQUFtQixZQUFuQixDQUFsQixFQURGO0tBQUEsTUFHSyxJQUFHLFlBQUg7YUFDSCxNQUFNLENBQUMsVUFBUCxDQUFrQixRQUFRLENBQUMsU0FBVCxDQUFtQixZQUFuQixDQUFsQixFQURHO0tBQUEsTUFHQSxJQUFHLE1BQUEsS0FBVSxRQUFiO2FBQ0gsTUFBTSxDQUFDLE9BQVAsQ0FBZSxRQUFRLENBQUMsU0FBVCxDQUFtQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQW5CLENBQWYsRUFERztLQUFBLE1BQUE7YUFJSCxNQUFNLENBQUMsT0FBUCxDQUFlLFFBQVEsQ0FBQyxTQUFULENBQW1CLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBbkIsQ0FBZixFQUpHO0tBYmdCO0VBQUEsQ0FWdkIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/kswedberg/.atom/packages/html-entities/lib/html-entities.coffee