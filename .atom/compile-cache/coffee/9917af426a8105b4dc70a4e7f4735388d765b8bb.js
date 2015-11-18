(function() {
  var CompositeDisposable, Os, Path, disposables, fs, git, notifier, prepFile, showFile, splitPane;

  CompositeDisposable = require('atom').CompositeDisposable;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  splitPane = require('../splitPane');

  disposables = new CompositeDisposable;

  module.exports = function(repo, _arg) {
    var args, diffFilePath, diffStat, file, _ref, _ref1;
    _ref = _arg != null ? _arg : {}, diffStat = _ref.diffStat, file = _ref.file;
    diffFilePath = Path.join(repo.getPath(), "atom_git_plus.diff");
    if (file == null) {
      file = repo.relativize((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0);
    }
    if (!file) {
      return notifier.addError("No open file. Select 'Diff All'.");
    }
    args = ['diff', '--color=never'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    if (!diffStat) {
      args.push(file);
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return prepFile((diffStat != null ? diffStat : '') + data, diffFilePath);
    }).then(function() {
      return showFile(diffFilePath);
    }).then(function(textEditor) {
      return disposables.add(textEditor.onDidDestroy(function() {
        return fs.unlink(diffFilePath);
      }));
    });
  };

  prepFile = function(text, filePath) {
    return new Promise(function(resolve, reject) {
      if ((text != null ? text.length : void 0) === 0) {
        return notifier.addInfo('Nothing to show.');
      } else {
        return fs.writeFile(filePath, text, {
          flag: 'w+'
        }, function(err) {
          if (err) {
            return reject(err);
          } else {
            return resolve(true);
          }
        });
      }
    });
  };

  showFile = function(filePath) {
    return atom.workspace.open(filePath, {
      searchAllPanes: true
    }).then(function(textEditor) {
      if (atom.config.get('git-plus.openInPane')) {
        return splitPane(atom.config.get('git-plus.splitPane'), textEditor);
      } else {
        return textEditor;
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0RkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBTE4sQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQU5YLENBQUE7O0FBQUEsRUFPQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FQWixDQUFBOztBQUFBLEVBU0EsV0FBQSxHQUFjLEdBQUEsQ0FBQSxtQkFUZCxDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ2YsUUFBQSwrQ0FBQTtBQUFBLDBCQURzQixPQUFpQixJQUFoQixnQkFBQSxVQUFVLFlBQUEsSUFDakMsQ0FBQTtBQUFBLElBQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBQSxDQUFWLEVBQTBCLG9CQUExQixDQUFmLENBQUE7O01BQ0EsT0FBUSxJQUFJLENBQUMsVUFBTCwrREFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCO0tBRFI7QUFFQSxJQUFBLElBQUcsQ0FBQSxJQUFIO0FBQ0UsYUFBTyxRQUFRLENBQUMsUUFBVCxDQUFrQixrQ0FBbEIs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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/lib/models/git-diff.coffee
