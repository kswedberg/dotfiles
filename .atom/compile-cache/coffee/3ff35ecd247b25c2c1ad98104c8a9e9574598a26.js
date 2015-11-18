(function() {
  var CompositeDisposable, SymbolIndex, fs, generate, minimatch, path, utils, _;

  fs = require('fs');

  path = require('path');

  _ = require('underscore');

  minimatch = require('minimatch');

  generate = require('./symbol-generator');

  utils = require('./symbol-utils');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = SymbolIndex = (function() {
    function SymbolIndex(entries) {
      var n, _ref, _ref1, _ref2;
      this.entries = {};
      this.rescanDirectories = true;
      this.roots = atom.project.getDirectories();
      this.getProjectRepositories();
      this.ignoredNames = (_ref = atom.config.get('core.ignoredNames')) != null ? _ref : [];
      if (typeof this.ignoredNames === 'string') {
        this.ignoredNames = [ignoredNames];
      }
      this.logToConsole = (_ref1 = atom.config.get('goto.logToConsole')) != null ? _ref1 : false;
      this.moreIgnoredNames = (_ref2 = atom.config.get('goto.moreIgnoredNames')) != null ? _ref2 : '';
      this.moreIgnoredNames = (function() {
        var _i, _len, _ref3, _results;
        _ref3 = this.moreIgnoredNames.split(/[, \t]+/);
        _results = [];
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          n = _ref3[_i];
          if (n != null ? n.length : void 0) {
            _results.push(n);
          }
        }
        return _results;
      }).call(this);
      this.noGrammar = {};
      this.disposables = new CompositeDisposable;
      this.subscribe();
    }

    SymbolIndex.prototype.invalidate = function() {
      this.entries = {};
      return this.rescanDirectories = true;
    };

    SymbolIndex.prototype.subscribe = function() {
      this.disposables.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          _this.roots = atom.project.getDirectories();
          _this.getProjectRepositories();
          return _this.invalidate();
        };
      })(this)));
      atom.config.observe('core.ignoredNames', (function(_this) {
        return function() {
          var _ref;
          _this.ignoredNames = (_ref = atom.config.get('core.ignoredNames')) != null ? _ref : [];
          if (typeof _this.ignoredNames === 'string') {
            _this.ignoredNames = [ignoredNames];
          }
          return _this.invalidate();
        };
      })(this));
      atom.config.observe('goto.moreIgnoredNames', (function(_this) {
        return function() {
          var n, _ref;
          _this.moreIgnoredNames = (_ref = atom.config.get('goto.moreIgnoredNames')) != null ? _ref : '';
          _this.moreIgnoredNames = (function() {
            var _i, _len, _ref1, _results;
            _ref1 = this.moreIgnoredNames.split(/[, \t]+/);
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              n = _ref1[_i];
              if (n != null ? n.length : void 0) {
                _results.push(n);
              }
            }
            return _results;
          }).call(_this);
          return _this.invalidate();
        };
      })(this));
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var editor_disposables;
          editor_disposables = new CompositeDisposable;
          editor_disposables.add(editor.onDidChangeGrammar(function() {
            return _this.entries[editor.getPath()] = null;
          }));
          editor_disposables.add(editor.onDidStopChanging(function() {
            return _this.entries[editor.getPath()] = null;
          }));
          return editor_disposables.add(editor.onDidDestroy(function() {
            return editor_disposables.dispose();
          }));
        };
      })(this));
    };

    SymbolIndex.prototype.destroy = function() {
      this.entries = null;
      return this.disposables.dispose();
    };

    SymbolIndex.prototype.getEditorSymbols = function(editor) {
      var fqn;
      fqn = editor.getPath();
      if (!this.entries[fqn] && this.keepPath(fqn)) {
        this.entries[fqn] = generate(fqn, editor.getGrammar(), editor.getText());
      }
      return this.entries[fqn];
    };

    SymbolIndex.prototype.getAllSymbols = function() {
      var fqn, s, symbols, _ref;
      this.update();
      s = [];
      _ref = this.entries;
      for (fqn in _ref) {
        symbols = _ref[fqn];
        Array.prototype.push.apply(s, symbols);
      }
      return s;
    };

    SymbolIndex.prototype.update = function() {
      var fqn, symbols, _ref, _results;
      if (this.rescanDirectories) {
        return this.rebuild();
      } else {
        _ref = this.entries;
        _results = [];
        for (fqn in _ref) {
          symbols = _ref[fqn];
          if (symbols === null && this.keepPath(fqn)) {
            _results.push(this.processFile(fqn));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    SymbolIndex.prototype.rebuild = function() {
      var root, _i, _len, _ref;
      _ref = this.roots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        root = _ref[_i];
        this.processDirectory(root.path);
      }
      this.rescanDirectories = false;
      if (this.logToConsole) {
        return console.log('No Grammar:', Object.keys(this.noGrammar));
      }
    };

    SymbolIndex.prototype.gotoDeclaration = function() {
      var editor, filePath, fqn, matches, symbols, word, _ref;
      editor = atom.workspace.getActiveTextEditor();
      if (editor != null) {
        editor.selectWordsContainingCursors();
      }
      word = editor != null ? editor.getSelectedText() : void 0;
      if (!(word != null ? word.length : void 0)) {
        return null;
      }
      this.update();
      filePath = editor.getPath();
      matches = [];
      this.matchSymbol(matches, word, this.entries[filePath]);
      _ref = this.entries;
      for (fqn in _ref) {
        symbols = _ref[fqn];
        if (fqn !== filePath) {
          this.matchSymbol(matches, word, symbols);
        }
      }
      if (matches.length === 0) {
        return null;
      }
      if (matches.length > 1) {
        return matches;
      }
      return utils.gotoSymbol(matches[0]);
    };

    SymbolIndex.prototype.matchSymbol = function(matches, word, symbols) {
      var symbol, _i, _len, _results;
      if (symbols) {
        _results = [];
        for (_i = 0, _len = symbols.length; _i < _len; _i++) {
          symbol = symbols[_i];
          if (symbol.name === word) {
            _results.push(matches.push(symbol));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    SymbolIndex.prototype.getProjectRepositories = function() {
      return Promise.all(this.roots.map(atom.project.repositoryForDirectory.bind(atom.project))).then((function(_this) {
        return function(repos) {
          return _this.repos = repos;
        };
      })(this));
    };

    SymbolIndex.prototype.processDirectory = function(dirPath) {
      var dir, dirs, entries, entry, fqn, stats, _i, _j, _len, _len1, _results;
      if (this.logToConsole) {
        console.log('GOTO: directory', dirPath);
      }
      entries = fs.readdirSync(dirPath);
      dirs = [];
      for (_i = 0, _len = entries.length; _i < _len; _i++) {
        entry = entries[_i];
        fqn = path.join(dirPath, entry);
        stats = fs.statSync(fqn);
        if (this.keepPath(fqn, stats.isFile())) {
          if (stats.isDirectory()) {
            dirs.push(fqn);
          } else if (stats.isFile()) {
            this.processFile(fqn);
          }
        }
      }
      entries = null;
      _results = [];
      for (_j = 0, _len1 = dirs.length; _j < _len1; _j++) {
        dir = dirs[_j];
        _results.push(this.processDirectory(dir));
      }
      return _results;
    };

    SymbolIndex.prototype.processFile = function(fqn) {
      var grammar, text;
      if (this.logToConsole) {
        console.log('GOTO: file', fqn);
      }
      text = fs.readFileSync(fqn, {
        encoding: 'utf8'
      });
      grammar = atom.grammars.selectGrammar(fqn, text);
      if ((grammar != null ? grammar.scopeName : void 0) !== 'text.plain.null-grammar') {
        return this.entries[fqn] = generate(fqn, grammar, text);
      } else {
        return this.noGrammar[path.extname(fqn)] = true;
      }
    };

    SymbolIndex.prototype.keepPath = function(filePath, isFile) {
      var base, ext, glob, repo, _i, _j, _len, _len1, _ref, _ref1;
      if (isFile == null) {
        isFile = true;
      }
      base = path.basename(filePath);
      ext = path.extname(base);
      if (isFile && (this.noGrammar[ext] != null)) {
        if (this.logToConsole) {
          console.log('GOTO: ignore/grammar', filePath);
        }
        return false;
      }
      _ref = this.moreIgnoredNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        glob = _ref[_i];
        if (minimatch(base, glob)) {
          if (this.logToConsole) {
            console.log('GOTO: ignore/core', filePath);
          }
          return false;
        }
      }
      if (_.contains(this.ignoredNames, base)) {
        if (this.logToConsole) {
          console.log('GOTO: ignore/core', filePath);
        }
        return false;
      }
      if (ext && _.contains(this.ignoredNames, '*#{ext}')) {
        if (this.logToConsole) {
          console.log('GOTO: ignore/core', filePath);
        }
        return false;
      }
      if (this.repos) {
        _ref1 = this.repos;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          repo = _ref1[_j];
          if (repo != null ? repo.isPathIgnored(filePath) : void 0) {
            if (this.logToConsole) {
              console.log('GOTO: ignore/git', filePath);
            }
            return false;
          }
        }
      }
      return true;
    };

    return SymbolIndex;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9nb3RvL2xpYi9zeW1ib2wtaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLHlFQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsb0JBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxnQkFBUixDQUxSLENBQUE7O0FBQUEsRUFNQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBTkQsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHFCQUFDLE9BQUQsR0FBQTtBQUVYLFVBQUEscUJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFBWCxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsaUJBQUQsR0FBcUIsSUFQckIsQ0FBQTtBQUFBLE1BcUJBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQUEsQ0FyQlQsQ0FBQTtBQUFBLE1Bc0JBLElBQUMsQ0FBQSxzQkFBRCxDQUFBLENBdEJBLENBQUE7QUFBQSxNQXdCQSxJQUFDLENBQUEsWUFBRCxrRUFBdUQsRUF4QnZELENBQUE7QUF5QkEsTUFBQSxJQUFHLE1BQUEsQ0FBQSxJQUFRLENBQUEsWUFBUixLQUF3QixRQUEzQjtBQUNFLFFBQUEsSUFB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

//# sourceURL=/Users/kswedberg/.atom/packages/goto/lib/symbol-index.coffee
