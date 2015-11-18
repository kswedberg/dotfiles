(function() {
  var $, $$$, BufferedProcess, Disposable, GitShow, LogListView, ScrollView, amountOfCommitsToShow, git, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Disposable = require('atom').Disposable;

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, ScrollView = _ref.ScrollView;

  git = require('../git');

  GitShow = require('../models/git-show');

  amountOfCommitsToShow = function() {
    return atom.config.get('git-plus.amountOfCommitsToShow');
  };

  module.exports = LogListView = (function(_super) {
    __extends(LogListView, _super);

    function LogListView() {
      return LogListView.__super__.constructor.apply(this, arguments);
    }

    LogListView.content = function() {
      return this.div({
        "class": 'git-plus-log native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.table({
            id: 'git-plus-commits',
            outlet: 'commitsListView'
          });
        };
      })(this));
    };

    LogListView.prototype.onDidChangeTitle = function() {
      return new Disposable;
    };

    LogListView.prototype.onDidChangeModified = function() {
      return new Disposable;
    };

    LogListView.prototype.getURI = function() {
      return 'atom://git-plus:log';
    };

    LogListView.prototype.getTitle = function() {
      return 'git-plus: Log';
    };

    LogListView.prototype.initialize = function() {
      LogListView.__super__.initialize.apply(this, arguments);
      this.skipCommits = 0;
      this.on('click', '.commit-row', (function(_this) {
        return function(_arg) {
          var currentTarget;
          currentTarget = _arg.currentTarget;
          return _this.showCommitLog(currentTarget.getAttribute('hash'));
        };
      })(this));
      return this.scroll((function(_this) {
        return function() {
          if (_this.scrollTop() + _this.height() === _this.prop('scrollHeight')) {
            return _this.getLog();
          }
        };
      })(this));
    };

    LogListView.prototype.setRepo = function(repo) {
      this.repo = repo;
    };

    LogListView.prototype.parseData = function(data) {
      var commits, newline, separator;
      if (data.length > 0) {
        separator = ';|';
        newline = '_.;._';
        data = data.substring(0, data.length - newline.length - 1);
        commits = data.split(newline).map(function(line) {
          var tmpData;
          if (line.trim() !== '') {
            tmpData = line.trim().split(separator);
            return {
              hashShort: tmpData[0],
              hash: tmpData[1],
              author: tmpData[2],
              email: tmpData[3],
              message: tmpData[4],
              date: tmpData[5]
            };
          }
        });
        return this.renderLog(commits);
      }
    };

    LogListView.prototype.renderHeader = function() {
      var headerRow;
      headerRow = $$$(function() {
        return this.tr({
          "class": 'commit-header'
        }, (function(_this) {
          return function() {
            _this.td('Date');
            _this.td('Message');
            return _this.td({
              "class": 'hashShort'
            }, 'Short Hash');
          };
        })(this));
      });
      return this.commitsListView.append(headerRow);
    };

    LogListView.prototype.renderLog = function(commits) {
      commits.forEach((function(_this) {
        return function(commit) {
          return _this.renderCommit(commit);
        };
      })(this));
      return this.skipCommits += amountOfCommitsToShow();
    };

    LogListView.prototype.renderCommit = function(commit) {
      var commitRow;
      commitRow = $$$(function() {
        return this.tr({
          "class": 'commit-row',
          hash: "" + commit.hash
        }, (function(_this) {
          return function() {
            _this.td({
              "class": 'date'
            }, "" + commit.date + " by " + commit.author);
            _this.td({
              "class": 'message'
            }, "" + commit.message);
            return _this.td({
              "class": 'hashShort'
            }, "" + commit.hashShort);
          };
        })(this));
      });
      return this.commitsListView.append(commitRow);
    };

    LogListView.prototype.showCommitLog = function(hash) {
      return GitShow(this.repo, hash, this.onlyCurrentFile ? this.currentFile : void 0);
    };

    LogListView.prototype.branchLog = function() {
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.onlyCurrentFile = false;
      this.currentFile = null;
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.currentFileLog = function(onlyCurrentFile, currentFile) {
      this.onlyCurrentFile = onlyCurrentFile;
      this.currentFile = currentFile;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.getLog = function() {
      var args;
      args = ['log', "--pretty=%h;|%H;|%aN;|%aE;|%s;|%ai_.;._", "-" + (amountOfCommitsToShow()), '--skip=' + this.skipCommits];
      if (this.onlyCurrentFile && (this.currentFile != null)) {
        args.push(this.currentFile);
      }
      return git.cmd({
        args: args,
        cwd: this.repo.getWorkingDirectory(),
        stdout: (function(_this) {
          return function(data) {
            return _this.parseData(data);
          };
        })(this)
      });
    };

    return LogListView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvbG9nLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUdBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFERCxDQUFBOztBQUFBLEVBRUEsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsU0FBQSxDQUFELEVBQUksV0FBQSxHQUFKLEVBQVMsa0JBQUEsVUFGVCxDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FKVixDQUFBOztBQUFBLEVBTUEscUJBQUEsR0FBd0IsU0FBQSxHQUFBO1dBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFEc0I7RUFBQSxDQU54QixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGtDQUFQO0FBQUEsUUFBMkMsUUFBQSxFQUFVLENBQUEsQ0FBckQ7T0FBTCxFQUE4RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM1RCxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsWUFBQSxFQUFBLEVBQUksa0JBQUo7QUFBQSxZQUF3QixNQUFBLEVBQVEsaUJBQWhDO1dBQVAsRUFENEQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5RCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDBCQUlBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTthQUFHLEdBQUEsQ0FBQSxXQUFIO0lBQUEsQ0FKbEIsQ0FBQTs7QUFBQSwwQkFLQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7YUFBRyxHQUFBLENBQUEsV0FBSDtJQUFBLENBTHJCLENBQUE7O0FBQUEsMEJBT0EsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUFHLHNCQUFIO0lBQUEsQ0FQUixDQUFBOztBQUFBLDBCQVNBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxnQkFBSDtJQUFBLENBVFYsQ0FBQTs7QUFBQSwwQkFXQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSw2Q0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxDQURmLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLGFBQWIsRUFBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQzFCLGNBQUEsYUFBQTtBQUFBLFVBRDRCLGdCQUFELEtBQUMsYUFDNUIsQ0FBQTtpQkFBQSxLQUFDLENBQUEsYUFBRCxDQUFlLGFBQWEsQ0FBQyxZQUFkLENBQTJCLE1BQTNCLENBQWYsRUFEMEI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixDQUZBLENBQUE7YUFJQSxJQUFDLENBQUEsTUFBRCxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDTixVQUFBLElBQWEsS0FBQyxDQUFBLFNBQUQsQ0FBQSxDQUFBLEdBQWUsS0FBQyxDQUFBLE1BQUQsQ0FBQSxDQUFmLEtBQTRCLEtBQUMsQ0FBQSxJQUFELENBQU0sY0FBTixDQUF6QzttQkFBQSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUE7V0FETTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVIsRUFMVTtJQUFBLENBWFosQ0FBQTs7QUFBQSwwQkFtQkEsT0FBQSxHQUFTLFNBQUUsSUFBRixHQUFBO0FBQVMsTUFBUixJQUFDLENBQUEsT0FBQSxJQUFPLENBQVQ7SUFBQSxDQW5CVCxDQUFBOztBQUFBLDBCQXFCQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxVQUFBLDJCQUFBO0FBQUEsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBakI7QUFDRSxRQUFBLFNBQUEsR0FBWSxJQUFaLENBQUE7QUFBQSxRQUNBLE9BQUEsR0FBVSxPQURWLENBQUE7QUFBQSxRQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBTCxDQUFlLENBQWYsRUFBa0IsSUFBSSxDQUFDLE1BQUwsR0FBYyxPQUFPLENBQUMsTUFBdEIsR0FBK0IsQ0FBakQsQ0FGUCxDQUFBO0FBQUEsUUFJQSxPQUFBLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFYLENBQW1CLENBQUMsR0FBcEIsQ0FBd0IsU0FBQyxJQUFELEdBQUE7QUFDaEMsY0FBQSxPQUFBO0FBQUEsVUFBQSxJQUFHLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBQSxLQUFpQixFQUFwQjtBQUNFLFlBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBVyxDQUFDLEtBQVosQ0FBa0IsU0FBbEIsQ0FBVixDQUFBO0FBQ0EsbUJBQU87QUFBQSxjQUNMLFNBQUEsRUFBVyxPQUFRLENBQUEsQ0FBQSxDQURkO0FBQUEsY0FFTCxJQUFBLEVBQU0sT0FBUSxDQUFBLENBQUEsQ0FGVDtBQUFBLGNBR0wsTUFBQSxFQUFRLE9BQVEsQ0FBQSxDQUFBLENBSFg7QUFBQSxjQUlMLEtBQUEsRUFBTyxPQUFRLENBQUEsQ0FBQSxDQUpWO0FBQUEsY0FLTCxPQUFBLEVBQVMsT0FBUSxDQUFBLENBQUEsQ0FMWjtBQUFBLGNBTUwsSUFBQSxFQUFNLE9BQVEsQ0FBQSxDQUFBLENBTlQ7YUFBUCxDQUZGO1dBRGdDO1FBQUEsQ0FBeEIsQ0FKVixDQUFBO2VBZ0JBLElBQUMsQ0FBQSxTQUFELENBQVcsT0FBWCxFQWpCRjtPQURTO0lBQUEsQ0FyQlgsQ0FBQTs7QUFBQSwwQkF5Q0EsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLEdBQUEsQ0FBSSxTQUFBLEdBQUE7ZUFDZCxJQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsVUFBQSxPQUFBLEVBQU8sZUFBUDtTQUFKLEVBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQzFCLFlBQUEsS0FBQyxDQUFBLEVBQUQsQ0FBSSxNQUFKLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSSxTQUFKLENBREEsQ0FBQTttQkFFQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsY0FBQSxPQUFBLEVBQU8sV0FBUDthQUFKLEVBQXdCLFlBQXhCLEVBSDBCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUIsRUFEYztNQUFBLENBQUosQ0FBWixDQUFBO2FBTUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUF3QixTQUF4QixFQVBZO0lBQUEsQ0F6Q2QsQ0FBQTs7QUFBQSwwQkFrREEsU0FBQSxHQUFXLFNBQUMsT0FBRCxHQUFBO0FBQ1QsTUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQVksS0FBQyxDQUFBLFlBQUQsQ0FBYyxNQUFkLEVBQVo7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxJQUFnQixxQkFBQSxDQUFBLEVBRlA7SUFBQSxDQWxEWCxDQUFBOztBQUFBLDBCQXNEQSxZQUFBLEdBQWMsU0FBQyxNQUFELEdBQUE7QUFDWixVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxHQUFBLENBQUksU0FBQSxHQUFBO2VBQ2QsSUFBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFVBQUEsT0FBQSxFQUFPLFlBQVA7QUFBQSxVQUFxQixJQUFBLEVBQU0sRUFBQSxHQUFHLE1BQU0sQ0FBQyxJQUFyQztTQUFKLEVBQWlELENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQy9DLFlBQUEsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLGNBQUEsT0FBQSxFQUFPLE1BQVA7YUFBSixFQUFtQixFQUFBLEdBQUcsTUFBTSxDQUFDLElBQVYsR0FBZSxNQUFmLEdBQXFCLE1BQU0sQ0FBQyxNQUEvQyxDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxjQUFBLE9BQUEsRUFBTyxTQUFQO2FBQUosRUFBc0IsRUFBQSxHQUFHLE1BQU0sQ0FBQyxPQUFoQyxDQURBLENBQUE7bUJBRUEsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLGNBQUEsT0FBQSxFQUFPLFdBQVA7YUFBSixFQUF3QixFQUFBLEdBQUcsTUFBTSxDQUFDLFNBQWxDLEVBSCtDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakQsRUFEYztNQUFBLENBQUosQ0FBWixDQUFBO2FBTUEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxNQUFqQixDQUF3QixTQUF4QixFQVBZO0lBQUEsQ0F0RGQsQ0FBQTs7QUFBQSwwQkErREEsYUFBQSxHQUFlLFNBQUMsSUFBRCxHQUFBO2FBQ2IsT0FBQSxDQUFRLElBQUMsQ0FBQSxJQUFULEVBQWUsSUFBZixFQUFxQyxJQUFDLENBQUEsZUFBakIsR0FBQSxJQUFDLENBQUEsV0FBRCxHQUFBLE1BQXJCLEVBRGE7SUFBQSxDQS9EZixDQUFBOztBQUFBLDBCQWtFQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLENBQWYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxLQUFqQixDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsS0FGbkIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUhmLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FKQSxDQUFBO2FBS0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQU5TO0lBQUEsQ0FsRVgsQ0FBQTs7QUFBQSwwQkEwRUEsY0FBQSxHQUFnQixTQUFFLGVBQUYsRUFBb0IsV0FBcEIsR0FBQTtBQUNkLE1BRGUsSUFBQyxDQUFBLGtCQUFBLGVBQ2hCLENBQUE7QUFBQSxNQURpQyxJQUFDLENBQUEsY0FBQSxXQUNsQyxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLENBQWYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxLQUFqQixDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBSmM7SUFBQSxDQTFFaEIsQ0FBQTs7QUFBQSwwQkFnRkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLENBQUMsS0FBRCxFQUFRLHlDQUFSLEVBQW9ELEdBQUEsR0FBRSxDQUFDLHFCQUFBLENBQUEsQ0FBRCxDQUF0RCxFQUFrRixTQUFBLEdBQVksSUFBQyxDQUFBLFdBQS9GLENBQVAsQ0FBQTtBQUNBLE1BQUEsSUFBMEIsSUFBQyxDQUFBLGVBQUQsSUFBcUIsMEJBQS9DO0FBQUEsUUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxXQUFYLENBQUEsQ0FBQTtPQURBO2FBRUEsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxRQUNBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FETDtBQUFBLFFBRUEsTUFBQSxFQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxJQUFELEdBQUE7bUJBQ04sS0FBQyxDQUFBLFNBQUQsQ0FBVyxJQUFYLEVBRE07VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZSO09BREYsRUFITTtJQUFBLENBaEZSLENBQUE7O3VCQUFBOztLQUR3QixXQVYxQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/log-list-view.coffee
