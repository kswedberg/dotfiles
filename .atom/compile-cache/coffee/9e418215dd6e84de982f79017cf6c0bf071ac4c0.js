(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitAdd, GitAddAllAndCommit, GitAddAllCommitAndPush, GitAddAndCommit, GitBranch, GitCheckoutAllFiles, GitCheckoutCurrentFile, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteLocalBranch, GitDeleteRemoteBranch, GitDiff, GitDiffAll, GitFetch, GitFetchPrune, GitInit, GitLog, GitMerge, GitPull, GitPush, GitRemove, GitRun, GitShow, GitStageFiles, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStatus, GitTags, GitUnstageFiles;
    GitAdd = require('./models/git-add');
    GitAddAllAndCommit = require('./models/git-add-all-and-commit');
    GitAddAllCommitAndPush = require('./models/git-add-all-commit-and-push');
    GitAddAndCommit = require('./models/git-add-and-commit');
    GitBranch = require('./models/git-branch');
    GitDeleteLocalBranch = require('./models/git-delete-local-branch.coffee');
    GitDeleteRemoteBranch = require('./models/git-delete-remote-branch.coffee');
    GitCheckoutAllFiles = require('./models/git-checkout-all-files');
    GitCheckoutCurrentFile = require('./models/git-checkout-current-file');
    GitCherryPick = require('./models/git-cherry-pick');
    GitCommit = require('./models/git-commit');
    GitCommitAmend = require('./models/git-commit-amend');
    GitDiff = require('./models/git-diff');
    GitDiffAll = require('./models/git-diff-all');
    GitFetch = require('./models/git-fetch');
    GitFetchPrune = require('./models/git-fetch-prune.coffee');
    GitInit = require('./models/git-init');
    GitLog = require('./models/git-log');
    GitPull = require('./models/git-pull');
    GitPush = require('./models/git-push');
    GitRemove = require('./models/git-remove');
    GitShow = require('./models/git-show');
    GitStageFiles = require('./models/git-stage-files');
    GitStageHunk = require('./models/git-stage-hunk');
    GitStashApply = require('./models/git-stash-apply');
    GitStashDrop = require('./models/git-stash-drop');
    GitStashPop = require('./models/git-stash-pop');
    GitStashSave = require('./models/git-stash-save');
    GitStatus = require('./models/git-status');
    GitTags = require('./models/git-tags');
    GitUnstageFiles = require('./models/git-unstage-files');
    GitRun = require('./models/git-run');
    GitMerge = require('./models/git-merge');
    return git.getRepo().then(function(repo) {
      var commands;
      git.refresh();
      commands = [];
      commands.push([
        'git-plus:add', 'Add', function() {
          return GitAdd(repo);
        }
      ]);
      commands.push([
        'git-plus:add-all', 'Add All', function() {
          return GitAdd(repo, {
            addAll: true
          });
        }
      ]);
      commands.push([
        'git-plus:log', 'Log', function() {
          return GitLog(repo);
        }
      ]);
      commands.push([
        'git-plus:log-current-file', 'Log Current File', function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove-current-file', 'Remove Current File', function() {
          return GitRemove(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-all-files', 'Checkout All Files', function() {
          return GitCheckoutAllFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-current-file', 'Checkout Current File', function() {
          return GitCheckoutCurrentFile(repo);
        }
      ]);
      commands.push([
        'git-plus:commit', 'Commit', function() {
          return new GitCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:commit-all', 'Commit All', function() {
          return new GitCommit(repo, {
            stageChanges: true
          });
        }
      ]);
      commands.push([
        'git-plus:commit-amend', 'Commit Amend', function() {
          return GitCommitAmend(repo);
        }
      ]);
      commands.push([
        'git-plus:add-and-commit', 'Add And Commit', function() {
          return GitAddAndCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:add-all-and-commit', 'Add All And Commit', function() {
          return GitAddAllAndCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:add-all-commit-and-push', 'Add All Commit And Push', function() {
          return GitAddAllCommitAndPush(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout', 'Checkout', function() {
          return GitBranch.gitBranches(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-remote', 'Checkout Remote', function() {
          return GitBranch.gitRemoteBranches(repo);
        }
      ]);
      commands.push([
        'git-plus:new-branch', 'Checkout New Branch', function() {
          return GitBranch.newBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-local-branch', 'Delete Local Branch', function() {
          return GitDeleteLocalBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-remote-branch', 'Delete Remote Branch', function() {
          return GitDeleteRemoteBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:cherry-pick', 'Cherry-Pick', function() {
          return GitCherryPick(repo);
        }
      ]);
      commands.push([
        'git-plus:diff', 'Diff', function() {
          return GitDiff(repo);
        }
      ]);
      commands.push([
        'git-plus:diff-all', 'Diff All', function() {
          return GitDiffAll(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch', 'Fetch', function() {
          return GitFetch(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch-prune', 'Fetch Prune', function() {
          return GitFetchPrune(repo);
        }
      ]);
      commands.push([
        'git-plus:pull', 'Pull', function() {
          return GitPull(repo);
        }
      ]);
      commands.push([
        'git-plus:pull-using-rebase', 'Pull Using Rebase', function() {
          return GitPull(repo, {
            rebase: true
          });
        }
      ]);
      commands.push([
        'git-plus:push', 'Push', function() {
          return GitPush(repo);
        }
      ]);
      commands.push([
        'git-plus:remove', 'Remove', function() {
          return GitRemove(repo, {
            showSelector: true
          });
        }
      ]);
      commands.push([
        'git-plus:reset', 'Reset HEAD', function() {
          return git.reset(repo);
        }
      ]);
      commands.push([
        'git-plus:show', 'Show', function() {
          return GitShow(repo);
        }
      ]);
      commands.push([
        'git-plus:stage-files', 'Stage Files', function() {
          return GitStageFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:unstage-files', 'Unstage Files', function() {
          return GitUnstageFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:stage-hunk', 'Stage Hunk', function() {
          return GitStageHunk(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save-changes', 'Stash: Save Changes', function() {
          return GitStashSave(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-pop', 'Stash: Apply (Pop)', function() {
          return GitStashPop(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-apply', 'Stash: Apply (Keep)', function() {
          return GitStashApply(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-delete', 'Stash: Delete (Drop)', function() {
          return GitStashDrop(repo);
        }
      ]);
      commands.push([
        'git-plus:status', 'Status', function() {
          return GitStatus(repo);
        }
      ]);
      commands.push([
        'git-plus:tags', 'Tags', function() {
          return GitTags(repo);
        }
      ]);
      commands.push([
        'git-plus:run', 'Run', function() {
          return new GitRun(repo);
        }
      ]);
      commands.push([
        'git-plus:merge', 'Merge', function() {
          return GitMerge(repo);
        }
      ]);
      return commands;
    });
  };

  module.exports = getCommands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvZ2l0LXBsdXMtY29tbWFuZHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixRQUFBLG1jQUFBO0FBQUEsSUFBQSxNQUFBLEdBQXlCLE9BQUEsQ0FBUSxrQkFBUixDQUF6QixDQUFBO0FBQUEsSUFDQSxrQkFBQSxHQUF5QixPQUFBLENBQVEsaUNBQVIsQ0FEekIsQ0FBQTtBQUFBLElBRUEsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLHNDQUFSLENBRnpCLENBQUE7QUFBQSxJQUdBLGVBQUEsR0FBeUIsT0FBQSxDQUFRLDZCQUFSLENBSHpCLENBQUE7QUFBQSxJQUlBLFNBQUEsR0FBeUIsT0FBQSxDQUFRLHFCQUFSLENBSnpCLENBQUE7QUFBQSxJQUtBLG9CQUFBLEdBQXlCLE9BQUEsQ0FBUSx5Q0FBUixDQUx6QixDQUFBO0FBQUEsSUFNQSxxQkFBQSxHQUF5QixPQUFBLENBQVEsMENBQVIsQ0FOekIsQ0FBQTtBQUFBLElBT0EsbUJBQUEsR0FBeUIsT0FBQSxDQUFRLGlDQUFSLENBUHpCLENBQUE7QUFBQSxJQVFBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSxvQ0FBUixDQVJ6QixDQUFBO0FBQUEsSUFTQSxhQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQkFBUixDQVR6QixDQUFBO0FBQUEsSUFVQSxTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUixDQVZ6QixDQUFBO0FBQUEsSUFXQSxjQUFBLEdBQXlCLE9BQUEsQ0FBUSwyQkFBUixDQVh6QixDQUFBO0FBQUEsSUFZQSxPQUFBLEdBQXlCLE9BQUEs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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/git-plus-commands.coffee
