'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');

var IMPORT_REGEXP = /^import(.|\n)*?from(.)*\n/gm;
var NEW_LINES_BETWEEN_IMPORTS = /from(.)+\n(\n)+import/gm;
var REPLACE_PLACEHOLDER = '@replaceMe@';
var REPLACE_PLACEHOLDER_REGEXP = new RegExp(REPLACE_PLACEHOLDER + '(.)*' + REPLACE_PLACEHOLDER, 'gm');

var LIBRARY_IMPORT = 0;
var PROJECT_IMPORT = 1;

var ImportOrganiser = (function () {
  function ImportOrganiser() {
    _classCallCheck(this, ImportOrganiser);
  }

  _createClass(ImportOrganiser, [{
    key: 'setEditor',
    value: function setEditor(editor) {
      this.editor = editor;
      this.buffer = editor.getBuffer();
    }
  }, {
    key: 'groupByLibraryImport',
    value: function groupByLibraryImport(singleImport) {
      if (singleImport.file[0] === '.') {
        return PROJECT_IMPORT;
      } else {
        return LIBRARY_IMPORT;
      }
    }
  }, {
    key: 'getNewImportsRows',
    value: function getNewImportsRows(imports) {
      var groupedImports = _.groupBy(imports, this.groupByLibraryImport);
      groupedImports[LIBRARY_IMPORT] = _.sortBy(groupedImports[LIBRARY_IMPORT], 'file');
      groupedImports[PROJECT_IMPORT] = _.sortBy(groupedImports[PROJECT_IMPORT], 'file');

      function renderSpecifier(specifier) {
        if (specifier.textLocal !== specifier.textImported) {
          return specifier.textImported + ' as ' + specifier.textLocal;
        } else {
          if (specifier.textImported) {
            return specifier.textImported;
          } else {
            return '';
          }
        }
      }

      return groupedImports[LIBRARY_IMPORT].concat(groupedImports[PROJECT_IMPORT]).map(function (singleImport, row) {

        // TODO: add newlines
        if (singleImport.specifiers.length > 0) {
          var spaceForNamedImports = atom.config.get('js-autoimport.spaceForNamedImports') ? ' ' : '';
          var defaultSpecifiers = _.filter(singleImport.specifiers, function (specifier) {
            return specifier.def;
          });
          var namedSpecifiers = _.filter(singleImport.specifiers, function (specifier) {
            return !specifier.def;
          });
          var leftBracketWithComma = defaultSpecifiers.length === 1 ? ', {' + spaceForNamedImports : '{' + spaceForNamedImports;
          var leftBracket = namedSpecifiers.length > 0 ? leftBracketWithComma : spaceForNamedImports;
          var rightBracket = namedSpecifiers.length > 0 ? spaceForNamedImports + '}' : '';
          var defaultSpecifier = defaultSpecifiers.length === 1 ? defaultSpecifiers[0] : '';
          var trailingSemicolon = atom.config.get('js-autoimport.trailingSemicolon') ? ';' : '';

          return 'import ' + renderSpecifier(defaultSpecifier) + leftBracket + namedSpecifiers.map(renderSpecifier).join(', ') + rightBracket + ' from \'' + singleImport.file + '\'' + trailingSemicolon;
        } else {
          return 'import \'' + singleImport.file + '\'';
        }
      });
    }
  }, {
    key: 'organiseImports',
    value: function organiseImports(newImports) {
      this.organising = true;

      var newImportsRows = this.getNewImportsRows(newImports);
      var bufferText = this.buffer.getText();

      if (bufferText.match(IMPORT_REGEXP)) {
        this.buffer.setTextViaDiff(bufferText.replace(NEW_LINES_BETWEEN_IMPORTS, 'from\$1\nimport').replace(IMPORT_REGEXP, REPLACE_PLACEHOLDER).replace(REPLACE_PLACEHOLDER_REGEXP, REPLACE_PLACEHOLDER).replace(REPLACE_PLACEHOLDER, newImportsRows.length > 0 ? newImportsRows.join('\n') + '\n' : ''));
      } else {
        this.buffer.setTextViaDiff((newImportsRows.length > 0 ? newImportsRows.join('\n') + '\n\n' : '') + bufferText);
      }
    }
  }, {
    key: 'isOrganising',
    value: function isOrganising() {
      if (this.organising) {
        this.organising = false;
        return true;
      } else {
        return false;
      }
    }
  }]);

  return ImportOrganiser;
})();

exports['default'] = ImportOrganiser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvanMtYXV0b2ltcG9ydC9saWIvaW1wb3J0cy9JbXBvcnRPcmdhbmlzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0FBRVosSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU1QixJQUFNLGFBQWEsR0FBRyw2QkFBNkIsQ0FBQztBQUNwRCxJQUFNLHlCQUF5QixHQUFHLHlCQUF5QixDQUFDO0FBQzVELElBQU0sbUJBQW1CLEdBQUcsYUFBYSxDQUFDO0FBQzFDLElBQU0sMEJBQTBCLEdBQUcsSUFBSSxNQUFNLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxHQUFHLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDOztBQUV4RyxJQUFNLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFDekIsSUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDOztJQUVKLGVBQWU7V0FBZixlQUFlOzBCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBRXpCLG1CQUFDLE1BQU0sRUFBRTtBQUNoQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUNsQzs7O1dBRW1CLDhCQUFDLFlBQVksRUFBRTtBQUNqQyxVQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO0FBQ2hDLGVBQU8sY0FBYyxDQUFDO09BQ3ZCLE1BQU07QUFDTCxlQUFPLGNBQWMsQ0FBQztPQUN2QjtLQUNGOzs7V0FFZ0IsMkJBQUMsT0FBTyxFQUFFO0FBQ3pCLFVBQU0sY0FBYyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3JFLG9CQUFjLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbEYsb0JBQWMsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbEYsZUFBUyxlQUFlLENBQUMsU0FBUyxFQUFFO0FBQ2xDLFlBQUksU0FBUyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsWUFBWSxFQUFFO0FBQ2xELGlCQUFVLFNBQVMsQ0FBQyxZQUFZLFlBQU8sU0FBUyxDQUFDLFNBQVMsQ0FBRztTQUM5RCxNQUFNO0FBQ0wsY0FBSSxTQUFTLENBQUMsWUFBWSxFQUFFO0FBQzFCLG1CQUFPLFNBQVMsQ0FBQyxZQUFZLENBQUM7V0FDL0IsTUFBTTtBQUNMLG1CQUFPLEVBQUUsQ0FBQztXQUNYO1NBQ0Y7T0FDRjs7QUFFRCxhQUFPLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FDOUIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUN0QyxHQUFHLENBQUMsVUFBQyxZQUFZLEVBQUUsR0FBRyxFQUFLOzs7QUFHMUIsWUFBSSxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdEMsY0FBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUE7QUFDN0YsY0FBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsVUFBQyxTQUFTO21CQUFLLFNBQVMsQ0FBQyxHQUFHO1dBQUEsQ0FBQyxDQUFDO0FBQzFGLGNBQU0sZUFBZSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxVQUFDLFNBQVM7bUJBQUssQ0FBQyxTQUFTLENBQUMsR0FBRztXQUFBLENBQUMsQ0FBQztBQUN6RixjQUFNLG9CQUFvQixHQUFHLGlCQUFpQixDQUFDLE1BQU0sS0FBSyxDQUFDLFdBQVMsb0JBQW9CLFNBQVMsb0JBQW9CLEFBQUUsQ0FBQztBQUN4SCxjQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztBQUM3RixjQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBTSxvQkFBb0IsU0FBTSxFQUFFLENBQUM7QUFDbEYsY0FBTSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNwRixjQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQzs7QUFFeEYsNkJBQWlCLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLFdBQVcsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxZQUFZLGdCQUFVLFlBQVksQ0FBQyxJQUFJLFVBQUksaUJBQWlCLENBQUc7U0FDckwsTUFBTTtBQUNMLCtCQUFrQixZQUFZLENBQUMsSUFBSSxRQUFJO1NBQ3hDO09BQ0YsQ0FBQyxDQUFDO0tBQ1Y7OztXQUVjLHlCQUFDLFVBQVUsRUFBRTtBQUMxQixVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdkIsVUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzFELFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRXpDLFVBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUNuQyxZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FDeEIsVUFBVSxDQUNULE9BQU8sQ0FBQyx5QkFBeUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUNyRCxPQUFPLENBQUMsYUFBYSxFQUFFLG1CQUFtQixDQUFDLENBQzNDLE9BQU8sQ0FBQywwQkFBMEIsRUFBRSxtQkFBbUIsQ0FBQyxDQUN4RCxPQUFPLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUksRUFBRSxDQUFDLENBQ25HLENBQUM7T0FDSCxNQUFNO0FBQ0wsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQ3hCLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLEdBQUksRUFBRSxDQUFBLEdBQ3RFLFVBQVUsQ0FDWCxDQUFDO09BQ0g7S0FDRjs7O1dBRVcsd0JBQUc7QUFDYixVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsWUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsZUFBTyxJQUFJLENBQUM7T0FDYixNQUFNO0FBQ0wsZUFBTyxLQUFLLENBQUM7T0FDZDtLQUNGOzs7U0FuRmtCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvanMtYXV0b2ltcG9ydC9saWIvaW1wb3J0cy9JbXBvcnRPcmdhbmlzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5jb25zdCBJTVBPUlRfUkVHRVhQID0gL15pbXBvcnQoLnxcXG4pKj9mcm9tKC4pKlxcbi9nbTtcbmNvbnN0IE5FV19MSU5FU19CRVRXRUVOX0lNUE9SVFMgPSAvZnJvbSguKStcXG4oXFxuKStpbXBvcnQvZ207XG5jb25zdCBSRVBMQUNFX1BMQUNFSE9MREVSID0gJ0ByZXBsYWNlTWVAJztcbmNvbnN0IFJFUExBQ0VfUExBQ0VIT0xERVJfUkVHRVhQID0gbmV3IFJlZ0V4cChSRVBMQUNFX1BMQUNFSE9MREVSICsgJyguKSonICsgUkVQTEFDRV9QTEFDRUhPTERFUiwgJ2dtJyk7XG5cbmNvbnN0IExJQlJBUllfSU1QT1JUID0gMDtcbmNvbnN0IFBST0pFQ1RfSU1QT1JUID0gMTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wb3J0T3JnYW5pc2VyIHtcblxuICBzZXRFZGl0b3IoZWRpdG9yKSB7XG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgdGhpcy5idWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gIH1cblxuICBncm91cEJ5TGlicmFyeUltcG9ydChzaW5nbGVJbXBvcnQpIHtcbiAgICBpZiAoc2luZ2xlSW1wb3J0LmZpbGVbMF0gPT09ICcuJykge1xuICAgICAgcmV0dXJuIFBST0pFQ1RfSU1QT1JUO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTElCUkFSWV9JTVBPUlQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0TmV3SW1wb3J0c1Jvd3MoaW1wb3J0cykge1xuICAgIGNvbnN0IGdyb3VwZWRJbXBvcnRzID0gXy5ncm91cEJ5KGltcG9ydHMsIHRoaXMuZ3JvdXBCeUxpYnJhcnlJbXBvcnQpO1xuICAgIGdyb3VwZWRJbXBvcnRzW0xJQlJBUllfSU1QT1JUXSA9IF8uc29ydEJ5KGdyb3VwZWRJbXBvcnRzW0xJQlJBUllfSU1QT1JUXSwgJ2ZpbGUnKTtcbiAgICBncm91cGVkSW1wb3J0c1tQUk9KRUNUX0lNUE9SVF0gPSBfLnNvcnRCeShncm91cGVkSW1wb3J0c1tQUk9KRUNUX0lNUE9SVF0sICdmaWxlJyk7XG5cbiAgICBmdW5jdGlvbiByZW5kZXJTcGVjaWZpZXIoc3BlY2lmaWVyKSB7XG4gICAgICBpZiAoc3BlY2lmaWVyLnRleHRMb2NhbCAhPT0gc3BlY2lmaWVyLnRleHRJbXBvcnRlZCkge1xuICAgICAgICByZXR1cm4gYCR7c3BlY2lmaWVyLnRleHRJbXBvcnRlZH0gYXMgJHtzcGVjaWZpZXIudGV4dExvY2FsfWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3BlY2lmaWVyLnRleHRJbXBvcnRlZCkge1xuICAgICAgICAgIHJldHVybiBzcGVjaWZpZXIudGV4dEltcG9ydGVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBncm91cGVkSW1wb3J0c1tMSUJSQVJZX0lNUE9SVF1cbiAgICAgICAgICAuY29uY2F0KGdyb3VwZWRJbXBvcnRzW1BST0pFQ1RfSU1QT1JUXSlcbiAgICAgICAgICAubWFwKChzaW5nbGVJbXBvcnQsIHJvdykgPT4ge1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBhZGQgbmV3bGluZXNcbiAgICAgICAgICAgIGlmIChzaW5nbGVJbXBvcnQuc3BlY2lmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHNwYWNlRm9yTmFtZWRJbXBvcnRzID0gYXRvbS5jb25maWcuZ2V0KCdqcy1hdXRvaW1wb3J0LnNwYWNlRm9yTmFtZWRJbXBvcnRzJykgPyAnICcgOiAnJ1xuICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0U3BlY2lmaWVycyA9IF8uZmlsdGVyKHNpbmdsZUltcG9ydC5zcGVjaWZpZXJzLCAoc3BlY2lmaWVyKSA9PiBzcGVjaWZpZXIuZGVmKTtcbiAgICAgICAgICAgICAgY29uc3QgbmFtZWRTcGVjaWZpZXJzID0gXy5maWx0ZXIoc2luZ2xlSW1wb3J0LnNwZWNpZmllcnMsIChzcGVjaWZpZXIpID0+ICFzcGVjaWZpZXIuZGVmKTtcbiAgICAgICAgICAgICAgY29uc3QgbGVmdEJyYWNrZXRXaXRoQ29tbWEgPSBkZWZhdWx0U3BlY2lmaWVycy5sZW5ndGggPT09IDEgPyBgLCB7JHtzcGFjZUZvck5hbWVkSW1wb3J0c31gIDogYHske3NwYWNlRm9yTmFtZWRJbXBvcnRzfWA7XG4gICAgICAgICAgICAgIGNvbnN0IGxlZnRCcmFja2V0ID0gbmFtZWRTcGVjaWZpZXJzLmxlbmd0aCA+IDAgPyBsZWZ0QnJhY2tldFdpdGhDb21tYSA6IHNwYWNlRm9yTmFtZWRJbXBvcnRzO1xuICAgICAgICAgICAgICBjb25zdCByaWdodEJyYWNrZXQgPSBuYW1lZFNwZWNpZmllcnMubGVuZ3RoID4gMCA/IGAke3NwYWNlRm9yTmFtZWRJbXBvcnRzfX1gIDogJyc7XG4gICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRTcGVjaWZpZXIgPSBkZWZhdWx0U3BlY2lmaWVycy5sZW5ndGggPT09IDEgPyBkZWZhdWx0U3BlY2lmaWVyc1swXSA6ICcnO1xuICAgICAgICAgICAgICBjb25zdCB0cmFpbGluZ1NlbWljb2xvbiA9IGF0b20uY29uZmlnLmdldCgnanMtYXV0b2ltcG9ydC50cmFpbGluZ1NlbWljb2xvbicpID8gJzsnIDogJyc7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGBpbXBvcnQgJHtyZW5kZXJTcGVjaWZpZXIoZGVmYXVsdFNwZWNpZmllcil9JHtsZWZ0QnJhY2tldH0ke25hbWVkU3BlY2lmaWVycy5tYXAocmVuZGVyU3BlY2lmaWVyKS5qb2luKCcsICcpfSR7cmlnaHRCcmFja2V0fSBmcm9tICcke3NpbmdsZUltcG9ydC5maWxlfScke3RyYWlsaW5nU2VtaWNvbG9ufWA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gYGltcG9ydCAnJHtzaW5nbGVJbXBvcnQuZmlsZX0nYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgfVxuXG4gIG9yZ2FuaXNlSW1wb3J0cyhuZXdJbXBvcnRzKSB7XG4gICAgdGhpcy5vcmdhbmlzaW5nID0gdHJ1ZTtcblxuICAgIGNvbnN0IG5ld0ltcG9ydHNSb3dzID0gdGhpcy5nZXROZXdJbXBvcnRzUm93cyhuZXdJbXBvcnRzKTtcbiAgICBjb25zdCBidWZmZXJUZXh0ID0gdGhpcy5idWZmZXIuZ2V0VGV4dCgpO1xuXG4gICAgaWYgKGJ1ZmZlclRleHQubWF0Y2goSU1QT1JUX1JFR0VYUCkpIHtcbiAgICAgIHRoaXMuYnVmZmVyLnNldFRleHRWaWFEaWZmKFxuICAgICAgICBidWZmZXJUZXh0XG4gICAgICAgIC5yZXBsYWNlKE5FV19MSU5FU19CRVRXRUVOX0lNUE9SVFMsICdmcm9tXFwkMVxcbmltcG9ydCcpXG4gICAgICAgIC5yZXBsYWNlKElNUE9SVF9SRUdFWFAsIFJFUExBQ0VfUExBQ0VIT0xERVIpXG4gICAgICAgIC5yZXBsYWNlKFJFUExBQ0VfUExBQ0VIT0xERVJfUkVHRVhQLCBSRVBMQUNFX1BMQUNFSE9MREVSKVxuICAgICAgICAucmVwbGFjZShSRVBMQUNFX1BMQUNFSE9MREVSLCBuZXdJbXBvcnRzUm93cy5sZW5ndGggPiAwID8gKG5ld0ltcG9ydHNSb3dzLmpvaW4oJ1xcbicpICsgJ1xcbicpIDogJycpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJ1ZmZlci5zZXRUZXh0VmlhRGlmZihcbiAgICAgICAgKG5ld0ltcG9ydHNSb3dzLmxlbmd0aCA+IDAgPyAobmV3SW1wb3J0c1Jvd3Muam9pbignXFxuJykgKyAnXFxuXFxuJykgOiAnJykgK1xuICAgICAgICBidWZmZXJUZXh0XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlzT3JnYW5pc2luZygpIHtcbiAgICBpZiAodGhpcy5vcmdhbmlzaW5nKSB7XG4gICAgICB0aGlzLm9yZ2FuaXNpbmcgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/kswedberg/.atom/packages/js-autoimport/lib/imports/ImportOrganiser.js
