(function() {
  var CSON, actions, caniuse, editorProxy, emmet, fs, path, resources;

  CSON = require('season');

  fs = require('fs');

  path = require('path');

  emmet = require('../vendor/emmet-app').emmet;

  actions = emmet.require('action/main');

  resources = emmet.require('assets/resources');

  caniuse = emmet.require('assets/caniuse');

  emmet.define('file', require('./file'));

  editorProxy = require('./editor-proxy');

  module.exports = {
    editorSubscription: null,
    activate: function(state) {
      var action, bindings, emmet_action, key, selector, _ref;
      this.state = state;
      if (!this.actionTranslation) {
        this.actionTranslation = {};
        _ref = CSON.readFileSync(path.join(__dirname, "../keymaps/emmet.cson"));
        for (selector in _ref) {
          bindings = _ref[selector];
          for (key in bindings) {
            action = bindings[key];
            emmet_action = action.split(":")[1].replace(/\-/g, "_");
            this.actionTranslation[action] = emmet_action;
          }
        }
      }
      this.setupSnippets();
      return this.editorViewSubscription = atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          var emmetAction, _ref1, _results;
          if (editorView.attached && !editorView.mini) {
            _ref1 = _this.actionTranslation;
            _results = [];
            for (action in _ref1) {
              emmetAction = _ref1[action];
              _results.push((function(action) {
                return editorView.command(action, function(e) {
                  var cursor, cursorNum, editor, syntax, _i, _len, _ref2;
                  editor = editorView.getEditor();
                  cursorNum = 0;
                  _ref2 = editor.getCursors();
                  for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
                    cursor = _ref2[_i];
                    editorProxy.setupContext(editorView, cursor, cursorNum++);
                    syntax = editorProxy.getSyntax();
                    if (syntax) {
                      emmetAction = _this.actionTranslation[action];
                      if (emmetAction === "expand_abbreviation_with_tab" && !editor.getSelection().isEmpty()) {
                        e.abortKeyBinding();
                        return;
                      } else {
                        actions.run(emmetAction, editorProxy);
                      }
                    } else {
                      e.abortKeyBinding();
                      return;
                    }
                  }
                });
              })(action));
            }
            return _results;
          }
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.editorViewSubscription) != null) {
        _ref.off();
      }
      return this.editorViewSubscription = null;
    },
    setupSnippets: function() {
      var db, defaultSnippets;
      defaultSnippets = fs.readFileSync(path.join(__dirname, '../vendor/snippets.json'), {
        encoding: 'utf8'
      });
      resources.setVocabulary(JSON.parse(defaultSnippets), 'system');
      db = fs.readFileSync(path.join(__dirname, '../vendor/caniuse.json'), {
        encoding: 'utf8'
      });
      return caniuse.load(db);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtEQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxxQkFBUixDQUE4QixDQUFDLEtBSnZDLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsS0FBSyxDQUFDLE9BQU4sQ0FBYyxhQUFkLENBTFYsQ0FBQTs7QUFBQSxFQU1BLFNBQUEsR0FBWSxLQUFLLENBQUMsT0FBTixDQUFjLGtCQUFkLENBTlosQ0FBQTs7QUFBQSxFQU9BLE9BQUEsR0FBVSxLQUFLLENBQUMsT0FBTixDQUFjLGdCQUFkLENBUFYsQ0FBQTs7QUFBQSxFQVNBLEtBQUssQ0FBQyxNQUFOLENBQWEsTUFBYixFQUFxQixPQUFBLENBQVEsUUFBUixDQUFyQixDQVRBLENBQUE7O0FBQUEsRUFXQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBWGQsQ0FBQTs7QUFBQSxFQWFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGtCQUFBLEVBQW9CLElBQXBCO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBRSxLQUFGLEdBQUE7QUFDUixVQUFBLG1EQUFBO0FBQUEsTUFEUyxJQUFDLENBQUEsUUFBQSxLQUNWLENBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxJQUFRLENBQUEsaUJBQVI7QUFDRSxRQUFBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixFQUFyQixDQUFBO0FBQ0E7QUFBQSxhQUFBLGdCQUFBO29DQUFBO0FBQ0UsZUFBQSxlQUFBO21DQUFBO0FBRUUsWUFBQSxZ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
//# sourceURL=/Users/kswedberg/.atom/packages/emmet/lib/emmet.coffee