(function() {
  var LoadingView, TextEditorView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, TextEditorView = _ref.TextEditorView;

  module.exports = LoadingView = (function(_super) {
    __extends(LoadingView, _super);

    function LoadingView() {
      this.show = __bind(this.show, this);
      this.hide = __bind(this.hide, this);
      return LoadingView.__super__.constructor.apply(this, arguments);
    }

    LoadingView.content = function() {
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
                      click: 'hide'
                    }, 'Hide');
                  });
                  return _this.span({
                    "class": 'text-primary',
                    outlet: 'title'
                  }, 'Atom Beautify');
                });
                return _this.div({
                  "class": "panel-body padded select-list text-center",
                  outlet: 'body'
                }, function() {
                  return _this.div(function() {
                    _this.span({
                      "class": 'text-center loading loading-spinner-large inline-block'
                    });
                    return _this.div({
                      "class": ''
                    }, 'Beautification in progress.');
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    LoadingView.prototype.hide = function(event, element) {
      return this.detach();
    };

    LoadingView.prototype.show = function() {
      if (!this.hasParent()) {
        return atom.workspace.addTopPanel({
          item: this
        });
      }
    };

    return LoadingView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy92aWV3cy9sb2FkaW5nLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBeUIsT0FBQSxDQUFRLHNCQUFSLENBQXpCLEVBQUMsWUFBQSxJQUFELEVBQU8sc0JBQUEsY0FBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7OztLQUFBOztBQUFBLElBQUEsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUNFO0FBQUEsUUFBQSxPQUFBLEVBQU8sNkJBQVA7T0FERixFQUN3QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNwQyxLQUFDLENBQUEsR0FBRCxDQUNFO0FBQUEsWUFBQSxPQUFBLEVBQU8sa0JBQVA7V0FERixFQUM2QixTQUFBLEdBQUE7bUJBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyx5QkFBUDthQUFMLEVBQXVDLFNBQUEsR0FBQTtxQkFDckMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxhQUFQO2VBQUwsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLGdCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sZUFBUDtpQkFBTCxFQUE2QixTQUFBLEdBQUE7QUFDM0Isa0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLG9CQUFBLE9BQUEsRUFBTyx3QkFBUDttQkFBTCxFQUFzQyxTQUFBLEdBQUE7MkJBQ3BDLEtBQUMsQ0FBQSxNQUFELENBQ0U7QUFBQSxzQkFBQSxPQUFBLEVBQU8sS0FBUDtBQUFBLHNCQUNBLEtBQUEsRUFBTyxNQURQO3FCQURGLEVBR0UsTUFIRixFQURvQztrQkFBQSxDQUF0QyxDQUFBLENBQUE7eUJBS0EsS0FBQyxDQUFBLElBQUQsQ0FDRTtBQUFBLG9CQUFBLE9BQUEsRUFBTyxjQUFQO0FBQUEsb0JBQ0EsTUFBQSxFQUFRLE9BRFI7bUJBREYsRUFHRSxlQUhGLEVBTjJCO2dCQUFBLENBQTdCLENBQUEsQ0FBQTt1QkFVQSxLQUFDLENBQUEsR0FBRCxDQUNFO0FBQUEsa0JBQUEsT0FBQSxFQUFPLDJDQUFQO0FBQUEsa0JBQ0EsTUFBQSxFQUFRLE1BRFI7aUJBREYsRUFHRSxTQUFBLEdBQUE7eUJBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7QUFDSCxvQkFBQSxLQUFDLENBQUEsSUFBRCxDQUNFO0FBQUEsc0JBQUEsT0FBQSxFQUFPLHdEQUFQO3FCQURGLENBQUEsQ0FBQTsyQkFFQSxLQUFDLENBQUEsR0FBRCxDQUNFO0FBQUEsc0JBQUEsT0FBQSxFQUFPLEVBQVA7cUJBREYsRUFFRSw2QkFGRixFQUhHO2tCQUFBLENBQUwsRUFERjtnQkFBQSxDQUhGLEVBWHlCO2NBQUEsQ0FBM0IsRUFEcUM7WUFBQSxDQUF2QyxFQUR5QjtVQUFBLENBRDdCLEVBRG9DO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEeEMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSwwQkE0QkEsSUFBQSxHQUFNLFNBQUMsS0FBRCxFQUFRLE9BQVIsR0FBQTthQUNKLElBQUMsQ0FBQSxNQUFELENBQUEsRUFESTtJQUFBLENBNUJOLENBQUE7O0FBQUEsMEJBK0JBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixNQUFBLElBQUcsQ0FBQSxJQUFLLENBQUMsU0FBRixDQUFBLENBQVA7ZUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQWYsQ0FBMkI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTNCLEVBREY7T0FESTtJQUFBLENBL0JOLENBQUE7O3VCQUFBOztLQUR3QixLQUgxQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/kswedberg/.atom/packages/atom-beautify/src/views/loading-view.coffee
