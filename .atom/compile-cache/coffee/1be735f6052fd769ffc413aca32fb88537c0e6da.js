(function() {
  var $, $$, $$$, MessageView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("atom-space-pen-views"), $ = _ref.$, $$ = _ref.$$, $$$ = _ref.$$$, View = _ref.View;

  module.exports = MessageView = (function(_super) {
    __extends(MessageView, _super);

    MessageView.prototype.messages = [];

    MessageView.content = function() {
      return this.div({
        "class": 'atom-beautify message-panel'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top'
          }, function() {
            return _this.div({
              "class": "tool-panel panel-bottom"
            }, function() {
              return _this.div({
                "class": "inset-panel"
              }, function() {
                _this.div({
                  "class": "panel-heading"
                }, function() {
                  _this.div({
                    "class": 'btn-toolbar pull-right'
                  }, function() {
                    return _this.button({
                      "class": 'btn',
                      click: 'clearMessages'
                    }, 'Clear');
                  });
                  return _this.span({
                    "class": '',
                    outlet: 'title'
                  }, 'Atom Beautify Message');
                });
                return _this.div({
                  "class": "panel-body padded select-list",
                  outlet: 'body'
                }, function() {
                  return _this.ol({
                    "class": 'list-group',
                    outlet: 'messageItems'
                  }, function() {
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title Currently there is no way to display a message to the user, such as errors or warnings or deprecation notices (see #40). Let\'s put a little overlay on the top for displaying such information.');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'This is the title Currently there is no way to display a message to the user, such as errors or warnings or deprecation notices (see #40). Let\'s put a little overlay on the top for displaying such information.');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'test');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-removed icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-alert'
                      }, 'This is the title');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                    return _this.li({
                      "class": 'two-lines'
                    }, function() {
                      _this.div({
                        "class": 'status status-added icon icon-diff-added'
                      }, '');
                      _this.div({
                        "class": 'primary-line icon icon-file-text'
                      }, 'Primary line');
                      return _this.div({
                        "class": 'secondary-line no-icon'
                      }, 'Secondary line');
                    });
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    function MessageView() {
      this.refresh = __bind(this.refresh, this);
      this.show = __bind(this.show, this);
      this.close = __bind(this.close, this);
      this.clearMessages = __bind(this.clearMessages, this);
      this.addMessage = __bind(this.addMessage, this);
      MessageView.__super__.constructor.apply(this, arguments);
    }

    MessageView.prototype.destroy = function() {};

    MessageView.prototype.addMessage = function(message) {
      this.messages.push(message);
      return this.refresh();
    };

    MessageView.prototype.clearMessages = function() {
      this.messages = [];
      return this.refresh();
    };

    MessageView.prototype.close = function(event, element) {
      return this.detach();
    };

    MessageView.prototype.show = function() {
      if (!this.hasParent()) {
        return atom.workspaceView.appendToTop(this);
      }
    };

    MessageView.prototype.refresh = function() {
      if (this.messages.length === 0) {
        return this.close();
      } else {
        return this.show();
      }
    };

    return MessageView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy92aWV3cy9tZXNzYWdlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBcUIsT0FBQSxDQUFRLHNCQUFSLENBQXJCLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUFKLEVBQVEsV0FBQSxHQUFSLEVBQWEsWUFBQSxJQUFiLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7QUFBQSwwQkFBQSxRQUFBLEdBQVUsRUFBVixDQUFBOztBQUFBLElBQ0EsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUNFO0FBQUEsUUFBQSxPQUFBLEVBQU8sNkJBQVA7T0FERixFQUN3QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNwQyxLQUFDLENBQUEsR0FBRCxDQUNFO0FBQUEsWUFBQSxPQUFBLEVBQU8sa0JBQVA7V0FERixFQUM2QixTQUFBLEdBQUE7bUJBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyx5QkFBUDthQUFMLEVBQXVDLFNBQUEsR0FBQTtxQkFDckMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxhQUFQO2VBQUwsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLGdCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sZUFBUDtpQkFBTCxFQUE2QixTQUFBLEdBQUE7QUFDM0Isa0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLG9CQUFBLE9BQUEsRUFBTyx3QkFBUDtt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

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/views/message-view.coffee
