'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewLine = /\r?\n/;

var Message = (function (_HTMLElement) {
  _inherits(Message, _HTMLElement);

  function Message() {
    _classCallCheck(this, Message);

    _get(Object.getPrototypeOf(Message.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Message, [{
    key: 'initialize',
    value: function initialize(message) {
      var includeLink = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.message = message;
      this.includeLink = includeLink;
      this.scope = 'Project';
      return this;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility(scope) {
      var visibility = scope === 'Line' ? Boolean(this.message.currentLine && this.message.currentFile) : true;
      if (this.scope !== scope) {
        var link = this.querySelector('.linter-message-link span');
        if (link) {
          if (scope === 'Project') {
            link.removeAttribute('hidden');
          } else link.setAttribute('hidden', true);
        }
        this.scope = scope;
      }
      if (visibility !== this.visibility) {
        if (visibility) {
          this.removeAttribute('hidden');
        } else this.setAttribute('hidden', true);
        this.visibility = visibility;
      }
      return this;
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      if (!this.childNodes.length) {
        if (atom.config.get('linter.showProviderName') && this.message.linter) {
          this.appendChild(Message.getName(this.message));
        }
        this.appendChild(Message.getRibbon(this.message));
        this.appendChild(Message.getMessage(this.message, this.includeLink));
      }
    }
  }], [{
    key: 'getLink',
    value: function getLink(message) {
      var el = document.createElement('a');
      var pathEl = document.createElement('span');

      el.className = 'linter-message-link';
      if (message.range) {
        el.textContent = 'at line ' + (message.range.start.row + 1) + ' col ' + (message.range.start.column + 1);
      }
      pathEl.textContent = ' in ' + atom.project.relativizePath(message.filePath)[1];
      el.appendChild(pathEl);
      el.addEventListener('click', function () {
        atom.workspace.open(message.filePath).then(function () {
          if (message.range) {
            atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
          }
        });
      });
      return el;
    }
  }, {
    key: 'getMessage',
    value: function getMessage(message, includeLink) {
      if (message.multiline || NewLine.test(message.text)) {
        return Message.getMultiLineMessage(message, includeLink);
      }

      var el = document.createElement('span');
      var messageEl = document.createElement('linter-message-line');

      el.className = 'linter-message-item';

      el.appendChild(messageEl);

      if (includeLink && message.filePath) {
        el.appendChild(Message.getLink(message));
      }

      if (message.html && typeof message.html !== 'string') {
        messageEl.appendChild(message.html.cloneNode(true));
      } else if (message.html) {
        messageEl.innerHTML = message.html;
      } else if (message.text) {
        messageEl.textContent = message.text;
      }

      return el;
    }
  }, {
    key: 'getMultiLineMessage',
    value: function getMultiLineMessage(message, includeLink) {
      var container = document.createElement('span');
      var messageEl = document.createElement('linter-multiline-message');

      container.className = 'linter-message-item';
      messageEl.setAttribute('title', message.text);

      message.text.split(NewLine).forEach(function (line, index) {
        if (!line) return;

        var el = document.createElement('linter-message-line');
        el.textContent = line;
        messageEl.appendChild(el);

        // Render the link in the "title" line.
        if (index === 0 && includeLink && message.filePath) {
          messageEl.appendChild(Message.getLink(message));
        }
      });

      container.appendChild(messageEl);

      messageEl.addEventListener('click', function (e) {
        // Avoid opening the message contents when we click the link.
        var link = e.target.tagName === 'A' ? e.target : e.target.parentNode;

        if (!link.classList.contains('linter-message-link')) {
          messageEl.classList.toggle('expanded');
        }
      });

      return container;
    }
  }, {
    key: 'getName',
    value: function getName(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight';
      el.textContent = message.linter;
      return el;
    }
  }, {
    key: 'getRibbon',
    value: function getRibbon(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight ' + message['class'];
      el.textContent = message.type;
      return el;
    }
  }, {
    key: 'fromMessage',
    value: function fromMessage(message, includeLink) {
      return new MessageElement().initialize(message, includeLink);
    }
  }]);

  return Message;
})(HTMLElement);

exports.Message = Message;
var MessageElement = document.registerElement('linter-message', {
  prototype: Message.prototype
});
exports.MessageElement = MessageElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9rc3dlZGJlcmcvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9tZXNzYWdlLWVsZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7OztBQUVYLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQTs7SUFFVixPQUFPO1lBQVAsT0FBTzs7V0FBUCxPQUFPOzBCQUFQLE9BQU87OytCQUFQLE9BQU87OztlQUFQLE9BQU87O1dBQ1Isb0JBQUMsT0FBTyxFQUFzQjtVQUFwQixXQUFXLHlEQUFHLElBQUk7O0FBQ3BDLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0FBQzlCLFVBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFBO0FBQ3RCLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztXQUNlLDBCQUFDLEtBQUssRUFBRTtBQUN0QixVQUFNLFVBQVUsR0FBRyxLQUFLLEtBQUssTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQTtBQUMxRyxVQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFFO0FBQ3hCLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtBQUM1RCxZQUFJLElBQUksRUFBRTtBQUNSLGNBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUN2QixnQkFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtXQUMvQixNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ3pDO0FBQ0QsWUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7T0FDbkI7QUFDRCxVQUFJLFVBQVUsS0FBSyxJQUFJLENBQUMsVUFBVSxF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LElBQUksQ0FBQTtBQUM3QixhQUFPLEVBQUUsQ0FBQTtLQUNWOzs7V0FDaUIscUJBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRTtBQUN2QyxhQUFPLElBQUksY0FBYyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQTtLQUM3RDs7O1NBL0hVLE9BQU87R0FBUyxXQUFXOzs7QUFrSWpDLElBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUU7QUFDdkUsV0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO0NBQzdCLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMva3N3ZWRiZXJnLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvbWVzc2FnZS1lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuY29uc3QgTmV3TGluZSA9IC9cXHI/XFxuL1xuXG5leHBvcnQgY2xhc3MgTWVzc2FnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgaW5pdGlhbGl6ZShtZXNzYWdlLCBpbmNsdWRlTGluayA9IHRydWUpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgdGhpcy5pbmNsdWRlTGluayA9IGluY2x1ZGVMaW5rXG4gICAgdGhpcy5zY29wZSA9ICdQcm9qZWN0J1xuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdXBkYXRlVmlzaWJpbGl0eShzY29wZSkge1xuICAgIGNvbnN0IHZpc2liaWxpdHkgPSBzY29wZSA9PT0gJ0xpbmUnID8gQm9vbGVhbih0aGlzLm1lc3NhZ2UuY3VycmVudExpbmUgJiYgdGhpcy5tZXNzYWdlLmN1cnJlbnRGaWxlKSA6IHRydWVcbiAgICBpZiAodGhpcy5zY29wZSAhPT0gc2NvcGUpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5saW50ZXItbWVzc2FnZS1saW5rIHNwYW4nKVxuICAgICAgaWYgKGxpbmspIHtcbiAgICAgICAgaWYgKHNjb3BlID09PSAnUHJvamVjdCcpIHtcbiAgICAgICAgICBsaW5rLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICAgICAgfSBlbHNlIGxpbmsuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgICAgfVxuICAgICAgdGhpcy5zY29wZSA9IHNjb3BlXG4gICAgfVxuICAgIGlmICh2aXNpYmlsaXR5ICE9PSB0aGlzLnZpc2liaWxpdHkpIHtcbiAgICAgIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgfSBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgICAgdGhpcy52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgaWYgKCF0aGlzLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuc2hvd1Byb3ZpZGVyTmFtZScpICYmIHRoaXMubWVzc2FnZS5saW50ZXIpIHtcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmdldE5hbWUodGhpcy5tZXNzYWdlKSlcbiAgICAgIH1cbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXRSaWJib24odGhpcy5tZXNzYWdlKSlcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXRNZXNzYWdlKHRoaXMubWVzc2FnZSwgdGhpcy5pbmNsdWRlTGluaykpXG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXRMaW5rKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgIGNvbnN0IHBhdGhFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuXG4gICAgZWwuY2xhc3NOYW1lID0gJ2xpbnRlci1tZXNzYWdlLWxpbmsnXG4gICAgaWYgKG1lc3NhZ2UucmFuZ2UpIHtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gYGF0IGxpbmUgJHttZXNzYWdlLnJhbmdlLnN0YXJ0LnJvdyArIDF9IGNvbCAke21lc3NhZ2UucmFuZ2Uuc3RhcnQuY29sdW1uICsgMX1gXG4gICAgfVxuICAgIHBhdGhFbC50ZXh0Q29udGVudCA9ICcgaW4gJyArIGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChtZXNzYWdlLmZpbGVQYXRoKVsxXVxuICAgIGVsLmFwcGVuZENoaWxkKHBhdGhFbClcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihtZXNzYWdlLmZpbGVQYXRoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAobWVzc2FnZS5yYW5nZSkge1xuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihtZXNzYWdlLnJhbmdlLnN0YXJ0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGdldE1lc3NhZ2UobWVzc2FnZSwgaW5jbHVkZUxpbmspIHtcbiAgICBpZiAobWVzc2FnZS5tdWx0aWxpbmUgfHwgTmV3TGluZS50ZXN0KG1lc3NhZ2UudGV4dCkpIHtcbiAgICAgIHJldHVybiBNZXNzYWdlLmdldE11bHRpTGluZU1lc3NhZ2UobWVzc2FnZSwgaW5jbHVkZUxpbmspXG4gICAgfVxuXG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBjb25zdCBtZXNzYWdlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbWVzc2FnZS1saW5lJylcblxuICAgIGVsLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1pdGVtJ1xuXG4gICAgZWwuYXBwZW5kQ2hpbGQobWVzc2FnZUVsKVxuXG4gICAgaWYgKGluY2x1ZGVMaW5rICYmIG1lc3NhZ2UuZmlsZVBhdGgpIHtcbiAgICAgIGVsLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TGluayhtZXNzYWdlKSlcbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZS5odG1sICYmIHR5cGVvZiBtZXNzYWdlLmh0bWwgIT09ICdzdHJpbmcnKSB7XG4gICAgICBtZXNzYWdlRWwuYXBwZW5kQ2hpbGQobWVzc2FnZS5odG1sLmNsb25lTm9kZSh0cnVlKSlcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuaHRtbCkge1xuICAgICAgbWVzc2FnZUVsLmlubmVySFRNTCA9IG1lc3NhZ2UuaHRtbFxuICAgIH0gZWxzZSBpZiAobWVzc2FnZS50ZXh0KSB7XG4gICAgICBtZXNzYWdlRWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLnRleHRcbiAgICB9XG5cbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZ2V0TXVsdGlMaW5lTWVzc2FnZShtZXNzYWdlLCBpbmNsdWRlTGluaykge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGNvbnN0IG1lc3NhZ2VFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1tdWx0aWxpbmUtbWVzc2FnZScpXG5cbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ2xpbnRlci1tZXNzYWdlLWl0ZW0nXG4gICAgbWVzc2FnZUVsLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBtZXNzYWdlLnRleHQpXG5cbiAgICBtZXNzYWdlLnRleHQuc3BsaXQoTmV3TGluZSkuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBpbmRleCkge1xuICAgICAgaWYgKCFsaW5lKSByZXR1cm5cblxuICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbWVzc2FnZS1saW5lJylcbiAgICAgIGVsLnRleHRDb250ZW50ID0gbGluZVxuICAgICAgbWVzc2FnZUVsLmFwcGVuZENoaWxkKGVsKVxuXG4gICAgICAvLyBSZW5kZXIgdGhlIGxpbmsgaW4gdGhlIFwidGl0bGVcIiBsaW5lLlxuICAgICAgaWYgKGluZGV4ID09PSAwICYmIGluY2x1ZGVMaW5rICYmIG1lc3NhZ2UuZmlsZVBhdGgpIHtcbiAgICAgICAgbWVzc2FnZUVsLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TGluayhtZXNzYWdlKSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG1lc3NhZ2VFbClcblxuICAgIG1lc3NhZ2VFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIC8vIEF2b2lkIG9wZW5pbmcgdGhlIG1lc3NhZ2UgY29udGVudHMgd2hlbiB3ZSBjbGljayB0aGUgbGluay5cbiAgICAgIHZhciBsaW5rID0gZS50YXJnZXQudGFnTmFtZSA9PT0gJ0EnID8gZS50YXJnZXQgOiBlLnRhcmdldC5wYXJlbnROb2RlXG5cbiAgICAgIGlmICghbGluay5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbnRlci1tZXNzYWdlLWxpbmsnKSkge1xuICAgICAgICBtZXNzYWdlRWwuY2xhc3NMaXN0LnRvZ2dsZSgnZXhwYW5kZWQnKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gY29udGFpbmVyXG4gIH1cbiAgc3RhdGljIGdldE5hbWUobWVzc2FnZSkge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgZWwuY2xhc3NOYW1lID0gJ2xpbnRlci1tZXNzYWdlLWl0ZW0gYmFkZ2UgYmFkZ2UtZmxleGlibGUgbGludGVyLWhpZ2hsaWdodCdcbiAgICBlbC50ZXh0Q29udGVudCA9IG1lc3NhZ2UubGludGVyXG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGdldFJpYmJvbihtZXNzYWdlKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBlbC5jbGFzc05hbWUgPSBgbGludGVyLW1lc3NhZ2UtaXRlbSBiYWRnZSBiYWRnZS1mbGV4aWJsZSBsaW50ZXItaGlnaGxpZ2h0ICR7bWVzc2FnZS5jbGFzc31gXG4gICAgZWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLnR5cGVcbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZnJvbU1lc3NhZ2UobWVzc2FnZSwgaW5jbHVkZUxpbmspIHtcbiAgICByZXR1cm4gbmV3IE1lc3NhZ2VFbGVtZW50KCkuaW5pdGlhbGl6ZShtZXNzYWdlLCBpbmNsdWRlTGluaylcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgTWVzc2FnZUVsZW1lbnQgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1tZXNzYWdlJywge1xuICBwcm90b3R5cGU6IE1lc3NhZ2UucHJvdG90eXBlXG59KVxuIl19
//# sourceURL=/Users/kswedberg/.atom/packages/linter/lib/ui/message-element.js
