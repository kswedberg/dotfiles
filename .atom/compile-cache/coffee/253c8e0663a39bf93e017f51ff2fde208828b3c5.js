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

    LogListView.prototype.branchLog = function(repo) {
      this.repo = repo;
      this.skipCommits = 0;
      this.commitsListView.empty();
      this.onlyCurrentFile = false;
      this.currentFile = null;
      this.renderHeader();
      return this.getLog();
    };

    LogListView.prototype.currentFileLog = function(repo, currentFile) {
      this.repo = repo;
      this.currentFile = currentFile;
      this.onlyCurrentFile = true;
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
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(data) {
          return _this.parseData(data);
        };
      })(this));
    };

    return LogListView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvbG9nLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUdBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFERCxDQUFBOztBQUFBLEVBRUEsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsU0FBQSxDQUFELEVBQUksV0FBQSxHQUFKLEVBQVMsa0JBQUEsVUFGVCxDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSE4sQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FKVixDQUFBOztBQUFBLEVBTUEscUJBQUEsR0FBd0IsU0FBQSxHQUFBO1dBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFEc0I7RUFBQSxDQU54QixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLGtDQUFQO0FBQUEsUUFBMkMsUUFBQSxFQUFVLENBQUEsQ0FBckQ7T0FBTCxFQUE4RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM1RCxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsWUFBQSxFQUFBLEVBQUksa0JBQUo7QUFBQSxZQUF3QixNQUFBLEVBQVEsaUJBQWhDO1dBQVAs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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/views/log-list-view.coffee
