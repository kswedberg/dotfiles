(function() {
  var CmdModule, CompositeDisposable, basicConfig, config,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require("atom").CompositeDisposable;

  config = require("./config");

  basicConfig = require("./config-basic");

  CmdModule = {};

  module.exports = {
    config: basicConfig,
    activate: function() {
      this.disposables = new CompositeDisposable();
      this.registerWorkspaceCommands();
      return this.registerEditorCommands();
    },
    registerWorkspaceCommands: function() {
      var workspaceCommands;
      workspaceCommands = {};
      ["draft", "post"].forEach((function(_this) {
        return function(file) {
          return workspaceCommands["markdown-writer:new-" + file] = _this.registerView("./views/new-" + file + "-view", {
            optOutGrammars: true
          });
        };
      })(this));
      ["open-cheat-sheet", "create-default-keymaps"].forEach((function(_this) {
        return function(command) {
          return workspaceCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command, {
            optOutGrammars: true
          });
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-workspace", workspaceCommands));
    },
    registerEditorCommands: function() {
      var editorCommands;
      editorCommands = {};
      ["tags", "categories"].forEach((function(_this) {
        return function(attr) {
          return editorCommands["markdown-writer:manage-post-" + attr] = _this.registerView("./views/manage-post-" + attr + "-view");
        };
      })(this));
      ["link", "image", "table"].forEach((function(_this) {
        return function(media) {
          return editorCommands["markdown-writer:insert-" + media] = _this.registerView("./views/insert-" + media + "-view");
        };
      })(this));
      ["code", "codeblock", "bold", "italic", "keystroke", "strikethrough"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style + "-text"] = _this.registerCommand("./commands/style-text", {
            args: style
          });
        };
      })(this));
      ["h1", "h2", "h3", "h4", "h5", "ul", "ol", "task", "taskdone", "blockquote"].forEach((function(_this) {
        return function(style) {
          return editorCommands["markdown-writer:toggle-" + style] = _this.registerCommand("./commands/style-line", {
            args: style
          });
        };
      })(this));
      ["previous-heading", "next-heading", "next-table-cell", "reference-definition"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:jump-to-" + command] = _this.registerCommand("./commands/jump-to", {
            args: command
          });
        };
      })(this));
      ["insert-new-line", "indent-list-line"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/edit-line", {
            args: command
          });
        };
      })(this));
      ["correct-order-list-numbers", "format-table"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/format-text", {
            args: command
          });
        };
      })(this));
      ["publish-draft"].forEach((function(_this) {
        return function(command) {
          return editorCommands["markdown-writer:" + command] = _this.registerCommand("./commands/" + command);
        };
      })(this));
      return this.disposables.add(atom.commands.add("atom-text-editor", editorCommands));
    },
    registerView: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var cmdInstance;
          if (!(options.optOutGrammars || _this.isMarkdown())) {
            return e.abortKeyBinding();
          }
          if (CmdModule[path] == null) {
            CmdModule[path] = require(path);
          }
          cmdInstance = new CmdModule[path](options.args);
          return cmdInstance.display();
        };
      })(this);
    },
    registerCommand: function(path, options) {
      if (options == null) {
        options = {};
      }
      return (function(_this) {
        return function(e) {
          var cmdInstance;
          if (!(options.optOutGrammars || _this.isMarkdown())) {
            return e.abortKeyBinding();
          }
          if (CmdModule[path] == null) {
            CmdModule[path] = require(path);
          }
          cmdInstance = new CmdModule[path](options.args);
          return cmdInstance.trigger(e);
        };
      })(this);
    },
    isMarkdown: function() {
      var editor, _ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return false;
      }
      return _ref = editor.getGrammar().scopeName, __indexOf.call(config.get("grammars"), _ref) >= 0;
    },
    deactivate: function() {
      this.disposables.dispose();
      return CmdModule = {};
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi13cml0ZXIvbGliL21hcmtkb3duLXdyaXRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUdBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FIZCxDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLEVBTFosQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFBUSxXQUFSO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLG1CQUFBLENBQUEsQ0FBbkIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLHlCQUFELENBQUEsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLHNCQUFELENBQUEsRUFKUTtJQUFBLENBRlY7QUFBQSxJQVFBLHlCQUFBLEVBQTJCLFNBQUEsR0FBQTtBQUN6QixVQUFBLGlCQUFBO0FBQUEsTUFBQSxpQkFBQSxHQUFvQixFQUFwQixDQUFBO0FBQUEsTUFFQSxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQWlCLENBQUMsT0FBbEIsQ0FBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO2lCQUN4QixpQkFBa0IsQ0FBQyxzQkFBQSxHQUFzQixJQUF2QixDQUFsQixHQUNFLEtBQUMsQ0FBQSxZQUFELENBQWUsY0FBQSxHQUFjLElBQWQsR0FBbUIsT0FBbEMsRUFBMEM7QUFBQSxZQUFBLGNBQUEsRUFBZ0IsSUFBaEI7V0FBMUMsRUFGc0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUZBLENBQUE7QUFBQSxNQU1BLENBQUMsa0JBQUQsRUFBcUIsd0JBQXJCLENBQThDLENBQUMsT0FBL0MsQ0FBdUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxHQUFBO2lCQUNyRCxpQkFBa0IsQ0FBQyxrQkFBQSxHQUFrQixPQUFuQixDQUFsQixHQUNFLEtBQUMsQ0FBQSxlQUFELENBQWtCLGFBQUEsR0FBYSxPQUEvQixFQUEwQztBQUFBLFlBQUEsY0FBQSxFQUFnQixJQUFoQjtXQUExQyxFQUZtRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZELENBTkEsQ0FBQTthQVVBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGlCQUFwQyxDQUFqQixFQVh5QjtJQUFBLENBUjNCO0FBQUEsSUFxQkEsc0JBQUEsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsY0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixFQUFqQixDQUFBO0FBQUEsTUFFQSxDQUFDLE1BQUQsRUFBUyxZQUFULENBQXNCLENBQUMsT0FBdkIsQ0FBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO2lCQUM3QixjQUFlLENBQUMsOEJBQUEsR0FBOEIsSUFBL0IsQ0FBZixHQUNFLEtBQUMsQ0FBQSxZQUFELENBQWUsc0JBQUEsR0FBc0IsSUFBdEIsR0FBMkIsT0FBMUMsRUFGMkI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixDQUZBLENBQUE7QUFBQSxNQU1BLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0IsT0FBbEIsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7aUJBQ2pDLGNBQWUsQ0FBQyx5QkFBQSxHQUF5QixLQUExQixDQUFmLEdBQ0UsS0FBQyxDQUFBLFlBQUQsQ0FBZSxpQkFBQSxHQUFpQixLQUFqQixHQUF1QixPQUF0QyxFQUYrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLENBTkEsQ0FBQTtBQUFBLE1BVUEsQ0FBQyxNQUFELEVBQVMsV0FBVCxFQUFzQixNQUF0QixFQUE4QixRQUE5QixFQUNDLFdBREQsRUFDYyxlQURkLENBQzhCLENBQUMsT0FEL0IsQ0FDdUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO2lCQUNyQyxjQUFlLENBQUMseUJBQUEsR0FBeUIsS0FBekIsR0FBK0IsT0FBaEMsQ0FBZixHQUNFLEtBQUMsQ0FBQSxlQUFELENBQWlCLHVCQUFqQixFQUEwQztBQUFBLFlBQUEsSUFBQSxFQUFNLEtBQU47V0FBMUMsRUFGbUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUR2QyxDQVZBLENBQUE7QUFBQSxNQWVBLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQ0MsTUFERCxFQUNTLFVBRFQsRUFDcUIsWUFEckIsQ0FDa0MsQ0FBQyxPQURuQyxDQUMyQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7aUJBQ3pDLGNBQWUsQ0FBQyx5QkFBQSxHQUF5QixLQUExQixDQUFmLEdBQ0UsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsdUJBQWpCLEVBQTBDO0FBQUEsWUFBQSxJQUFBLEVBQU0sS0FBTjtXQUExQyxFQUZ1QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRDNDLENBZkEsQ0FBQTtBQUFBLE1Bb0JBLENBQUMsa0JBQUQsRUFBcUIsY0FBckIsRUFBcUMsaUJBQXJDLEVBQ0Msc0JBREQsQ0FDd0IsQ0FBQyxPQUR6QixDQUNpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7aUJBQy9CLGNBQWUsQ0FBQywwQkFBQSxHQUEwQixPQUEzQixDQUFmLEdBQ0UsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsb0JBQWpCLEVBQXVDO0FBQUEsWUFBQSxJQUFBLEVBQU0sT0FBTjtXQUF2QyxFQUY2QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGpDLENBcEJBLENBQUE7QUFBQSxNQXlCQSxDQUFDLGlCQUFELEVBQW9CLGtCQUFwQixDQUF1QyxDQUFDLE9BQXhDLENBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtpQkFDOUMsY0FBZSxDQUFDLGtCQUFBLEdBQWtCLE9BQW5CLENBQWYsR0FDRSxLQUFDLENBQUEsZUFBRCxDQUFpQixzQkFBakIsRUFBeUM7QUFBQSxZQUFBLElBQUEsRUFBTSxPQUFOO1dBQXpDLEVBRjRDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsQ0F6QkEsQ0FBQTtBQUFBLE1BNkJBLENBQUMsNEJBQUQsRUFBK0IsY0FBL0IsQ0FBOEMsQ0FBQyxPQUEvQyxDQUF1RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7aUJBQ3JELGNBQWUsQ0FBQyxrQkFBQSxHQUFrQixPQUFuQixDQUFmLEdBQ0UsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsd0JBQWpCLEVBQTJDO0FBQUEsWUFBQSxJQUFBLEVBQU0sT0FBTjtXQUEzQyxFQUZtRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZELENBN0JBLENBQUE7QUFBQSxNQWlDQSxDQUFDLGVBQUQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7aUJBQ3hCLGNBQWUsQ0FBQyxrQkFBQSxHQUFrQixPQUFuQixDQUFmLEdBQ0UsS0FBQyxDQUFBLGVBQUQsQ0FBa0IsYUFBQSxHQUFhLE9BQS9CLEVBRnNCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FqQ0EsQ0FBQTthQXFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxjQUF0QyxDQUFqQixFQXRDc0I7SUFBQSxDQXJCeEI7QUFBQSxJQTZEQSxZQUFBLEVBQWMsU0FBQyxJQUFELEVBQU8sT0FBUCxHQUFBOztRQUFPLFVBQVU7T0FDN0I7YUFBQSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFDRSxjQUFBLFdBQUE7QUFBQSxVQUFBLElBQUEsQ0FBQSxDQUFPLE9BQU8sQ0FBQyxjQUFSLElBQTBCLEtBQUMsQ0FBQSxVQUFELENBQUEsQ0FBakMsQ0FBQTtBQUNFLG1CQUFPLENBQUMsQ0FBQyxlQUFGLENBQUEsQ0FBUCxDQURGO1dBQUE7O1lBR0EsU0FBVSxDQUFBLElBQUEsSUFBUyxPQUFBLENBQVEsSUFBUjtXQUhuQjtBQUFBLFVBSUEsV0FBQSxHQUFrQixJQUFBLFNBQVUsQ0FBQSxJQUFBLENBQVYsQ0FBZ0IsT0FBTyxDQUFDLElBQXhCLENBSmxCLENBQUE7aUJBS0EsV0FBVyxDQUFDLE9BQVosQ0FBQSxFQU5GO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsRUFEWTtJQUFBLENBN0RkO0FBQUEsSUFzRUEsZUFBQSxFQUFpQixTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7O1FBQU8sVUFBVTtPQUNoQzthQUFBLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUNFLGNBQUEsV0FBQTtBQUFBLFVBQUEsSUFBQSxDQUFBLENBQU8sT0FBTyxDQUFDLGNBQVIsSUFBMEIsS0FBQyxDQUFBLFVBQUQsQ0FBQSxDQUFqQyxDQUFBO0FBQ0UsbUJBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBQSxDQUFQLENBREY7V0FBQTs7WUFHQSxTQUFVLENBQUEsSUFBQSxJQUFTLE9BQUEsQ0FBUSxJQUFSO1dBSG5CO0FBQUEsVUFJQSxXQUFBLEdBQWtCLElBQUEsU0FBVSxDQUFBLElBQUEsQ0FBVixDQUFnQixPQUFPLENBQUMsSUFBeEIsQ0FKbEIsQ0FBQTtpQkFLQSxXQUFXLENBQUMsT0FBWixDQUFvQixDQUFwQixFQU5GO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsRUFEZTtJQUFBLENBdEVqQjtBQUFBLElBK0VBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLFlBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUFvQixjQUFwQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BREE7QUFFQSxvQkFBTyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsU0FBcEIsRUFBQSxlQUFpQyxNQUFNLENBQUMsR0FBUCxDQUFXLFVBQVgsQ0FBakMsRUFBQSxJQUFBLE1BQVAsQ0FIVTtJQUFBLENBL0VaO0FBQUEsSUFvRkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FBQSxDQUFBO2FBQ0EsU0FBQSxHQUFZLEdBRkY7SUFBQSxDQXBGWjtHQVJGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-writer/lib/markdown-writer.coffee
