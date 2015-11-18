'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');

var AutoSuggestProvider = (function () {
  function AutoSuggestProvider(exportIndex, importRepository) {
    _classCallCheck(this, AutoSuggestProvider);

    this.exportIndex = exportIndex;
    this.importRepository = importRepository;
    this.selector = '.source.js,.source.jsx';
  }

  _createClass(AutoSuggestProvider, [{
    key: 'getSuggestions',
    value: function getSuggestions(suggestionRequest) {
      var _this = this;

      var prefix = suggestionRequest.prefix;

      // TODO: filter out suggestions from currently opened file
      if (prefix !== '') {
        return _.filter(this.exportIndex.getIndex(), function (indexedExport) {
          var upperCaseChars = _this.extractUppercaseCharsFromText(indexedExport.text);

          return _.startsWith(indexedExport.text.toLowerCase(), prefix.toLowerCase()) || upperCaseChars !== '' && _.startsWith(upperCaseChars, prefix);
        }).map(function (suggestion) {
          return {
            text: suggestion.text,
            type: suggestion.type,
            file: suggestion.file,
            def: suggestion.def
          };
        });
      } else {
        return [];
      }
    }
  }, {
    key: 'extractUppercaseCharsFromText',
    value: function extractUppercaseCharsFromText(text) {
      return _.filter(text, function (character) {
        return !_.isNumber(character) && character === character.toUpperCase();
      }).join('');
    }
  }, {
    key: 'onDidInsertSuggestion',
    value: function onDidInsertSuggestion(suggested) {
      this.importRepository.pushSuggestedImport(suggested.suggestion, suggested.editor.getPath());
    }
  }]);

  return AutoSuggestProvider;
})();

exports['default'] = AutoSuggestProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvanMtYXV0b2ltcG9ydC9saWIvYXV0b3N1Z2dlc3QvQXV0b1N1Z2dlc3RQcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7QUFFWixJQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0lBRVAsbUJBQW1CO0FBRTNCLFdBRlEsbUJBQW1CLENBRTFCLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRTswQkFGeEIsbUJBQW1COztBQUdwQyxRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUMvQixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7QUFDekMsUUFBSSxDQUFDLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQztHQUMxQzs7ZUFOa0IsbUJBQW1COztXQVF4Qix3QkFBQyxpQkFBaUIsRUFBRTs7O0FBQ2hDLFVBQU0sTUFBTSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQzs7O0FBR3hDLFVBQUksTUFBTSxLQUFLLEVBQUUsRUFBRTtBQUNqQixlQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxVQUFDLGFBQWEsRUFBSztBQUM5RCxjQUFNLGNBQWMsR0FBRyxNQUFLLDZCQUE2QixDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFOUUsaUJBQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUNwRSxjQUFjLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxBQUFDLENBQUM7U0FDdkUsQ0FBQyxDQUNELEdBQUcsQ0FBQyxVQUFDLFVBQVUsRUFBSztBQUNuQixpQkFBTztBQUNMLGdCQUFJLEVBQUUsVUFBVSxDQUFDLElBQUk7QUFDckIsZ0JBQUksRUFBRSxVQUFVLENBQUMsSUFBSTtBQUNyQixnQkFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJO0FBQ3JCLGVBQUcsRUFBRSxVQUFVLENBQUMsR0FBRztXQUNwQixDQUFDO1NBQ0gsQ0FBQyxDQUFDO09BQ0osTUFBTTtBQUNMLGVBQU8sRUFBRSxDQUFDO09BQ1g7S0FDRjs7O1dBRTRCLHVDQUFDLElBQUksRUFBRTtBQUNsQyxhQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQUMsU0FBUyxFQUFLO0FBQ25DLGVBQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsS0FBSyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7T0FDeEUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNiOzs7V0FFb0IsK0JBQUMsU0FBUyxFQUFFO0FBQy9CLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FDdkMsU0FBUyxDQUFDLFVBQVUsRUFDcEIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FDM0IsQ0FBQztLQUNIOzs7U0EzQ2tCLG1CQUFtQjs7O3FCQUFuQixtQkFBbUIiLCJmaWxlIjoiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9qcy1hdXRvaW1wb3J0L2xpYi9hdXRvc3VnZ2VzdC9BdXRvU3VnZ2VzdFByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b1N1Z2dlc3RQcm92aWRlciB7XG5cbiAgY29uc3RydWN0b3IoZXhwb3J0SW5kZXgsIGltcG9ydFJlcG9zaXRvcnkpIHtcbiAgICB0aGlzLmV4cG9ydEluZGV4ID0gZXhwb3J0SW5kZXg7XG4gICAgdGhpcy5pbXBvcnRSZXBvc2l0b3J5ID0gaW1wb3J0UmVwb3NpdG9yeTtcbiAgICB0aGlzLnNlbGVjdG9yID0gJy5zb3VyY2UuanMsLnNvdXJjZS5qc3gnO1xuICB9XG5cbiAgZ2V0U3VnZ2VzdGlvbnMoc3VnZ2VzdGlvblJlcXVlc3QpIHtcbiAgICBjb25zdCBwcmVmaXggPSBzdWdnZXN0aW9uUmVxdWVzdC5wcmVmaXg7XG5cbiAgICAvLyBUT0RPOiBmaWx0ZXIgb3V0IHN1Z2dlc3Rpb25zIGZyb20gY3VycmVudGx5IG9wZW5lZCBmaWxlXG4gICAgaWYgKHByZWZpeCAhPT0gJycpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLmV4cG9ydEluZGV4LmdldEluZGV4KCksIChpbmRleGVkRXhwb3J0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVwcGVyQ2FzZUNoYXJzID0gdGhpcy5leHRyYWN0VXBwZXJjYXNlQ2hhcnNGcm9tVGV4dChpbmRleGVkRXhwb3J0LnRleHQpO1xuXG4gICAgICAgIHJldHVybiBfLnN0YXJ0c1dpdGgoaW5kZXhlZEV4cG9ydC50ZXh0LnRvTG93ZXJDYXNlKCksIHByZWZpeC50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICAgICAgICAodXBwZXJDYXNlQ2hhcnMgIT09ICcnICYmIF8uc3RhcnRzV2l0aCh1cHBlckNhc2VDaGFycywgcHJlZml4KSk7XG4gICAgICB9KVxuICAgICAgLm1hcCgoc3VnZ2VzdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRleHQ6IHN1Z2dlc3Rpb24udGV4dCxcbiAgICAgICAgICB0eXBlOiBzdWdnZXN0aW9uLnR5cGUsXG4gICAgICAgICAgZmlsZTogc3VnZ2VzdGlvbi5maWxlLFxuICAgICAgICAgIGRlZjogc3VnZ2VzdGlvbi5kZWZcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICB9XG5cbiAgZXh0cmFjdFVwcGVyY2FzZUNoYXJzRnJvbVRleHQodGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcih0ZXh0LCAoY2hhcmFjdGVyKSA9PiB7XG4gICAgICByZXR1cm4gIV8uaXNOdW1iZXIoY2hhcmFjdGVyKSAmJiBjaGFyYWN0ZXIgPT09IGNoYXJhY3Rlci50b1VwcGVyQ2FzZSgpO1xuICAgIH0pLmpvaW4oJycpO1xuICB9XG5cbiAgb25EaWRJbnNlcnRTdWdnZXN0aW9uKHN1Z2dlc3RlZCkge1xuICAgIHRoaXMuaW1wb3J0UmVwb3NpdG9yeS5wdXNoU3VnZ2VzdGVkSW1wb3J0KFxuICAgICAgc3VnZ2VzdGVkLnN1Z2dlc3Rpb24sXG4gICAgICBzdWdnZXN0ZWQuZWRpdG9yLmdldFBhdGgoKVxuICAgICk7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/kswedberg/.atom/packages/js-autoimport/lib/autosuggest/AutoSuggestProvider.js
