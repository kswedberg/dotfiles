(function() {
  var CompositeDisposable, actionDecorator, atomActionName, editorProxy, emmet, emmetActions, fs, getUserHome, isValidTabContext, loadExtensions, multiSelectionActionDecorator, path, registerInteractiveActions, resources, runAction, singleSelectionActions, toggleCommentSyntaxes;

  path = require('path');

  fs = require('fs');

  CompositeDisposable = require('atom').CompositeDisposable;

  emmet = require('emmet');

  emmetActions = require('emmet/lib/action/main');

  resources = require('emmet/lib/assets/resources');

  editorProxy = require('./editor-proxy');

  singleSelectionActions = ['prev_edit_point', 'next_edit_point', 'merge_lines', 'reflect_css_value', 'select_next_item', 'select_previous_item', 'wrap_with_abbreviation', 'update_tag'];

  toggleCommentSyntaxes = ['html', 'css', 'less', 'scss'];

  getUserHome = function() {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE;
    }
    return process.env.HOME;
  };

  isValidTabContext = function() {
    var contains, scopes;
    if (editorProxy.getGrammar() === 'html') {
      scopes = editorProxy.getCurrentScope();
      contains = function(regexp) {
        return scopes.filter(function(s) {
          return regexp.test(s);
        }).length;
      };
      if (contains(/\.js\.embedded\./)) {
        return contains(/^string\./);
      }
    }
    return true;
  };

  actionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return runAction(action, evt);
        };
      })(this));
    };
  };

  multiSelectionActionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return editorProxy.exec(function(i) {
            runAction(action, evt);
            if (evt.keyBindingAborted) {
              return false;
            }
          });
        };
      })(this));
    };
  };

  runAction = function(action, evt) {
    var activeEditor, result, se, syntax;
    syntax = editorProxy.getSyntax();
    if (action === 'expand_abbreviation_with_tab') {
      activeEditor = editorProxy.editor;
      if (!isValidTabContext() || !activeEditor.getLastSelection().isEmpty()) {
        return evt.abortKeyBinding();
      }
      if (activeEditor.snippetExpansion) {
        se = activeEditor.snippetExpansion;
        if (se.tabStopIndex + 1 >= se.tabStopMarkers.length) {
          se.destroy();
        } else {
          return evt.abortKeyBinding();
        }
      }
    }
    if (action === 'toggle_comment' && (toggleCommentSyntaxes.indexOf(syntax) === -1 || !atom.config.get('emmet.useEmmetComments'))) {
      return evt.abortKeyBinding();
    }
    if (action === 'insert_formatted_line_break_only') {
      if (syntax !== 'html' || !atom.config.get('emmet.formatLineBreaks')) {
        return evt.abortKeyBinding();
      }
      result = emmet.run(action, editorProxy);
      if (!result) {
        return evt.abortKeyBinding();
      } else {
        return true;
      }
    }
    return emmet.run(action, editorProxy);
  };

  atomActionName = function(name) {
    return 'emmet:' + name.replace(/_/g, '-');
  };

  registerInteractiveActions = function(actions) {
    var name, _i, _len, _ref, _results;
    _ref = ['wrap_with_abbreviation', 'update_tag', 'interactive_expand_abbreviation'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      _results.push((function(name) {
        var atomAction;
        atomAction = atomActionName(name);
        return actions[atomAction] = function(evt) {
          var interactive;
          editorProxy.setup(this.getModel());
          interactive = require('./interactive');
          return interactive.run(name, editorProxy);
        };
      })(name));
    }
    return _results;
  };

  loadExtensions = function() {
    var extPath, files;
    extPath = atom.config.get('emmet.extensionsPath');
    console.log('Loading Emmet extensions from', extPath);
    if (!extPath) {
      return;
    }
    if (extPath[0] === '~') {
      extPath = getUserHome() + extPath.substr(1);
    }
    if (fs.existsSync(extPath)) {
      emmet.resetUserData();
      files = fs.readdirSync(extPath);
      files = files.map(function(item) {
        return path.join(extPath, item);
      }).filter(function(file) {
        return !fs.statSync(file).isDirectory();
      });
      return emmet.loadExtensions(files);
    } else {
      return console.warn('Emmet: no such extension folder:', extPath);
    }
  };

  module.exports = {
    config: {
      extensionsPath: {
        type: 'string',
        "default": '~/emmet'
      },
      formatLineBreaks: {
        type: 'boolean',
        "default": true
      },
      useEmmetComments: {
        type: 'boolean',
        "default": false,
        description: 'disable to use atom native commenting system'
      }
    },
    activate: function(state) {
      var action, atomAction, cmd, _i, _len, _ref;
      this.state = state;
      this.subscriptions = new CompositeDisposable;
      if (!this.actions) {
        this.subscriptions.add(atom.config.observe('emmet.extensionsPath', loadExtensions));
        this.actions = {};
        registerInteractiveActions(this.actions);
        _ref = emmetActions.getList();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          action = _ref[_i];
          atomAction = atomActionName(action.name);
          if (this.actions[atomAction] != null) {
            continue;
          }
          cmd = singleSelectionActions.indexOf(action.name) !== -1 ? actionDecorator(action.name) : multiSelectionActionDecorator(action.name);
          this.actions[atomAction] = cmd;
        }
      }
      return this.subscriptions.add(atom.commands.add('atom-text-editor', this.actions));
    },
    deactivate: function() {
      return atom.config.transact((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9lbW1ldC9saWIvZW1tZXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdSQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBRkQsQ0FBQTs7QUFBQSxFQUlBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUpSLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHVCQUFSLENBTGYsQ0FBQTs7QUFBQSxFQU1BLFNBQUEsR0FBWSxPQUFBLENBQVEsNEJBQVIsQ0FOWixDQUFBOztBQUFBLEVBUUEsV0FBQSxHQUFlLE9BQUEsQ0FBUSxnQkFBUixDQVJmLENBQUE7O0FBQUEsRUFXQSxzQkFBQSxHQUF5QixDQUN2QixpQkFEdUIsRUFDSixpQkFESSxFQUNlLGFBRGYsRUFFdkIsbUJBRnVCLEVBRUYsa0JBRkUsRUFFa0Isc0JBRmxCLEVBR3ZCLHdCQUh1QixFQUdHLFlBSEgsQ0FYekIsQ0FBQTs7QUFBQSxFQWlCQSxxQkFBQSxHQUF3QixDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCLE1BQXhCLENBakJ4QixDQUFBOztBQUFBLEVBbUJBLFdBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixJQUFBLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBdkI7QUFDRSxhQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBbkIsQ0FERjtLQUFBO1dBR0EsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUpBO0VBQUEsQ0FuQmQsQ0FBQTs7QUFBQSxFQXlCQSxp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

//# sourceURL=/Users/kswedberg/.atom/packages/emmet/lib/emmet.coffee
