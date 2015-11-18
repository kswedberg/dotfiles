(function() {
  var $$, GitDiff, Path, SelectListView, StatusListView, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  fs = require('fs-plus');

  Path = require('path');

  git = require('../git');

  GitDiff = require('../models/git-diff');

  notifier = require('../notifier');

  module.exports = StatusListView = (function(_super) {
    __extends(StatusListView, _super);

    function StatusListView() {
      return StatusListView.__super__.constructor.apply(this, arguments);
    }

    StatusListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      StatusListView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(this.parseData(this.data.slice(0, -1)));
      return this.focusFilterEditor();
    };

    StatusListView.prototype.parseData = function(files) {
      var line, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        line = files[_i];
        if (!(/^([ MADRCU?!]{2})\s{1}(.*)/.test(line))) {
          continue;
        }
        line = line.match(/^([ MADRCU?!]{2})\s{1}(.*)/);
        _results.push({
          type: line[1],
          path: line[2]
        });
      }
      return _results;
    };

    StatusListView.prototype.getFilterKey = function() {
      return 'path';
    };

    StatusListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    StatusListView.prototype.cancelled = function() {
      return this.hide();
    };

    StatusListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    StatusListView.prototype.viewForItem = function(_arg) {
      var getIcon, path, type;
      type = _arg.type, path = _arg.path;
      getIcon = function(s) {
        if (s[0] === 'A') {
          return 'status-added icon icon-diff-added';
        }
        if (s[0] === 'D') {
          return 'status-removed icon icon-diff-removed';
        }
        if (s[0] === 'R') {
          return 'status-renamed icon icon-diff-renamed';
        }
        if (s[0] === 'M' || s[1] === 'M') {
          return 'status-modified icon icon-diff-modified';
        }
        return '';
      };
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'pull-right highlight',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, type);
            _this.span({
              "class": getIcon(type)
            });
            return _this.span(path);
          };
        })(this));
      });
    };

    StatusListView.prototype.confirmed = function(_arg) {
      var fullPath, openFile, path, type;
      type = _arg.type, path = _arg.path;
      this.cancel();
      if (type === '??') {
        return git.add(this.repo, {
          file: path
        });
      } else {
        openFile = confirm("Open " + path + "?");
        fullPath = Path.join(this.repo.getWorkingDirectory(), path);
        return fs.stat(fullPath, (function(_this) {
          return function(err, stat) {
            var isDirectory;
            if (err) {
              return notifier.addError(err.message);
            } else {
              isDirectory = stat != null ? stat.isDirectory() : void 0;
              if (openFile) {
                if (isDirectory) {
                  return atom.open({
                    pathsToOpen: fullPath,
                    newWindow: true
                  });
                } else {
                  return atom.workspace.open(fullPath);
                }
              } else {
                return GitDiff(_this.repo, {
                  file: path
                });
              }
            }
          };
        })(this));
      }
    };

    return StatusListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvc3RhdHVzLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFVBQUEsRUFBRCxFQUFLLHNCQUFBLGNBQUwsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FKVixDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBTFgsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNkJBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFTLElBQVQsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFEa0IsSUFBQyxDQUFBLE9BQUEsSUFDbkIsQ0FBQTtBQUFBLE1BQUEsZ0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLElBQUssYUFBakIsQ0FBVixDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUpVO0lBQUEsQ0FBWixDQUFBOztB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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/status-list-view.coffee
