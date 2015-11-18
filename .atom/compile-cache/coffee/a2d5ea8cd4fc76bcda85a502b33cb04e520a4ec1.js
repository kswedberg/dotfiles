(function() {
  var $, fs, mathjaxHelper, path, temp;

  $ = require('atom-space-pen-views').$;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp').track();

  mathjaxHelper = require('../lib/mathjax-helper');

  describe("MathJax helper module", function() {
    return describe("loading MathJax TeX macros", function() {
      var configDirPath, macros, macrosPath, waitsForMacrosToLoad, _ref;
      _ref = [], configDirPath = _ref[0], macrosPath = _ref[1], macros = _ref[2];
      beforeEach(function() {
        configDirPath = temp.mkdirSync('atom-config-dir-');
        macrosPath = path.join(configDirPath, 'markdown-preview-plus.cson');
        spyOn(atom, 'getConfigDirPath').andReturn(configDirPath);
        jasmine.useRealClock();
        return mathjaxHelper.resetMathJax();
      });
      afterEach(function() {
        return mathjaxHelper.resetMathJax();
      });
      waitsForMacrosToLoad = function() {
        var span;
        span = [][0];
        waitsForPromise(function() {
          return atom.packages.activatePackage("markdown-preview-plus");
        });
        runs(function() {
          return mathjaxHelper.loadMathJax();
        });
        waitsFor("MathJax to load", function() {
          return typeof MathJax !== "undefined" && MathJax !== null;
        });
        runs(function() {
          var equation;
          span = document.createElement("span");
          equation = document.createElement("script");
          equation.type = "math/tex; mode=display";
          equation.textContent = "\\int_1^2";
          span.appendChild(equation);
          return mathjaxHelper.mathProcessor(span);
        });
        waitsFor("MathJax macros to be defined", function() {
          var _ref1, _ref2, _ref3;
          return macros = (_ref1 = MathJax.InputJax) != null ? (_ref2 = _ref1.TeX) != null ? (_ref3 = _ref2.Definitions) != null ? _ref3.macros : void 0 : void 0 : void 0;
        });
        return waitsFor("MathJax to process span", function() {
          return span.childElementCount === 2;
        });
      };
      describe("when a macros file exists", function() {
        beforeEach(function() {
          var fixturesFile, fixturesPath;
          fixturesPath = path.join(__dirname, 'fixtures/macros.cson');
          fixturesFile = fs.readFileSync(fixturesPath, 'utf8');
          return fs.writeFileSync(macrosPath, fixturesFile);
        });
        it("loads valid macros", function() {
          waitsForMacrosToLoad();
          return runs(function() {
            expect(macros.macroOne).toBeDefined();
            return expect(macros.macroParamOne).toBeDefined();
          });
        });
        return it("doesn't load invalid macros", function() {
          waitsForMacrosToLoad();
          return runs(function() {
            expect(macros.macro1).toBeUndefined();
            expect(macros.macroTwo).toBeUndefined();
            expect(macros.macroParam1).toBeUndefined();
            return expect(macros.macroParamTwo).toBeUndefined();
          });
        });
      });
      return describe("when a macros file doesn't exist", function() {
        return it("creates a template macros file", function() {
          expect(fs.isFileSync(macrosPath)).toBe(false);
          waitsForMacrosToLoad();
          return runs(function() {
            return expect(fs.isFileSync(macrosPath)).toBe(true);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3LXBsdXMvc3BlYy9tYXRoamF4LWhlbHBlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQ0FBQTs7QUFBQSxFQUFDLElBQWUsT0FBQSxDQUFRLHNCQUFSLEVBQWYsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFnQixPQUFBLENBQVEsTUFBUixDQURoQixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFnQixPQUFBLENBQVEsU0FBUixDQUZoQixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFnQixPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUhoQixDQUFBOztBQUFBLEVBSUEsYUFBQSxHQUFnQixPQUFBLENBQVEsdUJBQVIsQ0FKaEIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7V0FDaEMsUUFBQSxDQUFTLDRCQUFULEVBQXVDLFNBQUEsR0FBQTtBQUNyQyxVQUFBLDZEQUFBO0FBQUEsTUFBQSxPQUFzQyxFQUF0QyxFQUFDLHVCQUFELEVBQWdCLG9CQUFoQixFQUE0QixnQkFBNUIsQ0FBQTtBQUFBLE1BRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsYUFBQSxHQUFnQixJQUFJLENBQUMsU0FBTCxDQUFlLGtCQUFmLENBQWhCLENBQUE7QUFBQSxRQUNBLFVBQUEsR0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLGFBQVYsRUFBeUIsNEJBQXpCLENBRGIsQ0FBQTtBQUFBLFFBR0EsS0FBQSxDQUFNLElBQU4sRUFBWSxrQkFBWixDQUErQixDQUFDLFNBQWhDLENBQTBDLGFBQTFDLENBSEEsQ0FBQTtBQUFBLFFBSUEsT0FBTyxDQUFDLFlBQVIsQ0FBQSxDQUpBLENBQUE7ZUFNQSxhQUFhLENBQUMsWUFBZCxDQUFBLEVBUFM7TUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLE1BV0EsU0FBQSxDQUFVLFNBQUEsR0FBQTtlQUNSLGFBQWEsQ0FBQyxZQUFkLENBQUEsRUFEUTtNQUFBLENBQVYsQ0FYQSxDQUFBO0FBQUEsTUFjQSxvQkFBQSxHQUF1QixTQUFBLEdBQUE7QUFDckIsWUFBQSxJQUFBO0FBQUEsUUFBQyxPQUFRLEtBQVQsQ0FBQTtBQUFBLFFBRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHVCQUE5QixFQURjO1FBQUEsQ0FBaEIsQ0FGQSxDQUFBO0FBQUEsUUFLQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUNILGFBQWEsQ0FBQyxXQUFkLENBQUEsRUFERztRQUFBLENBQUwsQ0FMQSxDQUFBO0FBQUEsUUFRQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO2lCQUMxQixtREFEMEI7UUFBQSxDQUE1QixDQVJBLENBQUE7QUFBQSxRQWFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLFFBQUE7QUFBQSxVQUFBLElBQUEsR0FBd0IsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBeEIsQ0FBQTtBQUFBLFVBQ0EsUUFBQSxHQUF3QixRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QixDQUR4QixDQUFBO0FBQUEsVUFFQSxRQUFRLENBQUMsSUFBVCxHQUF3Qix3QkFGeEIsQ0FBQTtBQUFBLFVBR0EsUUFBUSxDQUFDLFdBQVQsR0FBd0IsV0FIeEIsQ0FBQTtBQUFBLFVBSUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsUUFBakIsQ0FKQSxDQUFBO2lCQUtBLGFBQWEsQ0FBQyxhQUFkLENBQTRCLElBQTVCLEVBTkc7UUFBQSxDQUFMLENBYkEsQ0FBQTtBQUFBLFFBcUJBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsY0FBQSxtQkFBQTtpQkFBQSxNQUFBLGlIQUEyQyxDQUFFLGtDQUROO1FBQUEsQ0FBekMsQ0FyQkEsQ0FBQTtlQXdCQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO2lCQUNsQyxJQUFJLENBQUMsaUJBQUwsS0FBMEIsRUFEUTtRQUFBLENBQXBDLEVBekJxQjtNQUFBLENBZHZCLENBQUE7QUFBQSxNQTBDQSxRQUFBLENBQVMsMkJBQVQsRUFBc0MsU0FBQSxHQUFBO0FBQ3BDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULGNBQUEsMEJBQUE7QUFBQSxVQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsc0JBQXJCLENBQWYsQ0FBQTtBQUFBLFVBQ0EsWUFBQSxHQUFlLEVBQUUsQ0FBQyxZQUFILENBQWdCLFlBQWhCLEVBQThCLE1BQTlCLENBRGYsQ0FBQTtpQkFFQSxFQUFFLENBQUMsYUFBSCxDQUFpQixVQUFqQixFQUE2QixZQUE3QixFQUhTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUtBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsVUFBQSxvQkFBQSxDQUFBLENBQUEsQ0FBQTtpQkFDQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLFFBQWQsQ0FBdUIsQ0FBQyxXQUF4QixDQUFBLENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLGFBQWQsQ0FBNEIsQ0FBQyxXQUE3QixDQUFBLEVBRkc7VUFBQSxDQUFMLEVBRnVCO1FBQUEsQ0FBekIsQ0FMQSxDQUFBO2VBV0EsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxVQUFBLG9CQUFBLENBQUEsQ0FBQSxDQUFBO2lCQUNBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxZQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsTUFBZCxDQUFxQixDQUFDLGFBQXRCLENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLFFBQWQsQ0FBdUIsQ0FBQyxhQUF4QixDQUFBLENBREEsQ0FBQTtBQUFBLFlBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxXQUFkLENBQTBCLENBQUMsYUFBM0IsQ0FBQSxDQUZBLENBQUE7bUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxhQUFkLENBQTRCLENBQUMsYUFBN0IsQ0FBQSxFQUpHO1VBQUEsQ0FBTCxFQUZnQztRQUFBLENBQWxDLEVBWm9DO01BQUEsQ0FBdEMsQ0ExQ0EsQ0FBQTthQThEQSxRQUFBLENBQVMsa0NBQVQsRUFBNkMsU0FBQSxHQUFBO2VBQzNDLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsVUFBQSxNQUFBLENBQU8sRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUFkLENBQVAsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxLQUF2QyxDQUFBLENBQUE7QUFBQSxVQUNBLG9CQUFBLENBQUEsQ0FEQSxDQUFBO2lCQUVBLElBQUEsQ0FBSyxTQUFBLEdBQUE7bUJBQUcsTUFBQSxDQUFPLEVBQUUsQ0FBQyxVQUFILENBQWMsVUFBZCxDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsSUFBdkMsRUFBSDtVQUFBLENBQUwsRUFIbUM7UUFBQSxDQUFyQyxFQUQyQztNQUFBLENBQTdDLEVBL0RxQztJQUFBLENBQXZDLEVBRGdDO0VBQUEsQ0FBbEMsQ0FOQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/markdown-preview-plus/spec/mathjax-helper-spec.coffee
