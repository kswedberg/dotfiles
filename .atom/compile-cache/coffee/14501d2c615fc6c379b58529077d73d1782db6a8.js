(function() {
  var Path, commitPane, currentPane, fs, git, mockRepo, mockRepoWithSubmodule, mockSubmodule, pathToRepoFile, pathToSubmoduleFile, repo, textEditor, _ref;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../lib/git');

  _ref = require('./fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile, textEditor = _ref.textEditor, commitPane = _ref.commitPane, currentPane = _ref.currentPane;

  pathToSubmoduleFile = Path.get("~/some/submodule/file");

  mockRepo = {
    getWorkingDirectory: function() {
      return Path.get("~/some/repository");
    },
    refreshStatus: function() {
      return void 0;
    },
    relativize: function(path) {
      if (path === pathToRepoFile) {
        return "directory/file";
      }
    },
    repo: {
      submoduleForPath: function(path) {
        return void 0;
      }
    }
  };

  mockSubmodule = {
    getWorkingDirectory: function() {
      return Path.get("~/some/submodule");
    },
    relativize: function(path) {
      if (path === pathToSubmoduleFile) {
        return "file";
      }
    }
  };

  mockRepoWithSubmodule = Object.create(mockRepo);

  mockRepoWithSubmodule.repo = {
    submoduleForPath: function(path) {
      if (path === pathToSubmoduleFile) {
        return mockSubmodule;
      }
    }
  };

  describe("Git-Plus git module", function() {
    describe("git.getConfig", function() {
      var args;
      args = ['config', '--get', 'user.name'];
      beforeEach(function() {
        return spyOn(git, 'cmd').andReturn(Promise.resolve('akonwi'));
      });
      describe("when a repo file path isn't specified", function() {
        return it("spawns a command querying git for the given global setting", function() {
          waitsForPromise(function() {
            return git.getConfig('user.name');
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(args, {
              cwd: Path.get('~')
            });
          });
        });
      });
      return describe("when a repo file path is specified", function() {
        return it("checks for settings in that repo", function() {
          waitsForPromise(function() {
            return git.getConfig('user.name', repo.getWorkingDirectory());
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(args, {
              cwd: repo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.getRepo", function() {
      return it("returns a promise resolving to repository", function() {
        spyOn(atom.project, 'getRepositories').andReturn([repo]);
        return waitsForPromise(function() {
          return git.getRepo().then(function(actual) {
            return expect(actual.getWorkingDirectory()).toEqual(repo.getWorkingDirectory());
          });
        });
      });
    });
    describe("git.dir", function() {
      return it("returns a promise resolving to absolute path of repo", function() {
        spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
        spyOn(atom.project, 'getRepositories').andReturn([repo]);
        return git.dir().then(function(dir) {
          return expect(dir).toEqual(repo.getWorkingDirectory());
        });
      });
    });
    describe("git.getSubmodule", function() {
      it("returns undefined when there is no submodule", function() {
        return expect(git.getSubmodule(pathToRepoFile)).toBe(void 0);
      });
      return it("returns a submodule when given file is in a submodule of a project repo", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepoWithSubmodule];
        });
        return expect(git.getSubmodule(pathToSubmoduleFile).getWorkingDirectory()).toEqual(Path.get("~/some/submodule"));
      });
    });
    describe("git.relativize", function() {
      return it("returns relativized filepath for files in repo", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepo, mockRepoWithSubmodule];
        });
        expect(git.relativize(pathToRepoFile)).toBe('directory/file');
        return expect(git.relativize(pathToSubmoduleFile)).toBe("file");
      });
    });
    describe("git.cmd", function() {
      return it("returns a promise", function() {
        var promise;
        promise = git.cmd();
        expect(promise["catch"]).toBeDefined();
        return expect(promise.then).toBeDefined();
      });
    });
    describe("git.add", function() {
      it("calls git.cmd with ['add', '--all', {fileName}]", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo, {
            file: pathToSubmoduleFile
          }).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--all', pathToSubmoduleFile], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
      it("calls git.cmd with ['add', '--all', '.'] when no file is specified", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--all', '.'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
      return it("calls git.cmd with ['add', '--update'...] when update option is true", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo, {
            update: true
          }).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--update', '.'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.reset", function() {
      return it("resets and unstages all files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.reset(mockRepo).then(function() {
            return expect(git.cmd).toHaveBeenCalledWith(['reset', 'HEAD'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.stagedFiles", function() {
      return it("returns an empty array when there are no staged files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('');
        });
        return waitsForPromise(function() {
          return git.stagedFiles(mockRepo).then(function(files) {
            return expect(files.length).toEqual(0);
          });
        });
      });
    });
    describe("git.unstagedFiles", function() {
      return it("returns an empty array when there are no unstaged files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('');
        });
        return waitsForPromise(function() {
          return git.unstagedFiles(mockRepo).then(function(files) {
            return expect(files.length).toEqual(0);
          });
        });
      });
    });
    describe("git.status", function() {
      return it("calls git.cmd with 'status' as the first argument", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          var args;
          args = git.cmd.mostRecentCall.args;
          if (args[0][0] === 'status') {
            return Promise.resolve(true);
          }
        });
        return git.status(mockRepo).then(function() {
          return expect(true).toBeTruthy();
        });
      });
    });
    describe("git.refresh", function() {
      it("calls git.cmd with 'add' and '--refresh' arguments for each repo in project", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          var args;
          args = git.cmd.mostRecentCall.args[0];
          expect(args[0]).toBe('add');
          return expect(args[1]).toBe('--refresh');
        });
        spyOn(mockRepo, 'getWorkingDirectory').andCallFake(function() {
          return expect(mockRepo.getWorkingDirectory.callCount).toBe(1);
        });
        return git.refresh();
      });
      return it("calls repo.refreshStatus for each repo in project", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepo];
        });
        spyOn(mockRepo, 'refreshStatus');
        spyOn(git, 'cmd').andCallFake(function() {
          return void 0;
        });
        git.refresh();
        return expect(mockRepo.refreshStatus.callCount).toBe(1);
      });
    });
    return describe("git.diff", function() {
      return it("calls git.cmd with ['diff', '-p', '-U1'] and the file path", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve("string");
        });
        git.diff(mockRepo, pathToRepoFile);
        return expect(git.cmd).toHaveBeenCalledWith(['diff', '-p', '-U1', pathToRepoFile], {
          cwd: mockRepo.getWorkingDirectory()
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9zcGVjL2dpdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtSkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxZQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUdBLE9BTUksT0FBQSxDQUFRLFlBQVIsQ0FOSixFQUNFLFlBQUEsSUFERixFQUVFLHNCQUFBLGNBRkYsRUFHRSxrQkFBQSxVQUhGLEVBSUUsa0JBQUEsVUFKRixFQUtFLG1CQUFBLFdBUkYsQ0FBQTs7QUFBQSxFQVVBLG1CQUFBLEdBQXNCLElBQUksQ0FBQyxHQUFMLENBQVMsdUJBQVQsQ0FWdEIsQ0FBQTs7QUFBQSxFQVlBLFFBQUEsR0FDRTtBQUFBLElBQUEsbUJBQUEsRUFBcUIsU0FBQSxHQUFBO2FBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxtQkFBVCxFQUFIO0lBQUEsQ0FBckI7QUFBQSxJQUNBLGFBQUEsRUFBZSxTQUFBLEdBQUE7YUFBRyxPQUFIO0lBQUEsQ0FEZjtBQUFBLElBRUEsVUFBQSxFQUFZLFNBQUMsSUFBRCxHQUFBO0FBQVUsTUFBQSxJQUFvQixJQUFBLEtBQVEsY0FBNUI7ZUFBQSxpQkFBQTtPQUFWO0lBQUEsQ0FGWjtBQUFBLElBR0EsSUFBQSxFQUNFO0FBQUEsTUFBQSxnQkFBQSxFQUFrQixTQUFDLElBQUQsR0FBQTtlQUFVLE9BQVY7TUFBQSxDQUFsQjtLQUpGO0dBYkYsQ0FBQTs7QUFBQSxFQW1CQSxhQUFBLEdBQ0U7QUFBQSxJQUFBLG1CQUFBLEVBQXFCLFNBQUEsR0FBQTth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

//# sourceURL=/Users/kswedberg/.atom/packages/git-plus/spec/git-spec.coffee
