(function() {
  var $, BlameLineComponent, BlameListLinesComponent, BlameListView, RP, React, Reactionary, div, renderLoading, _, _ref;

  $ = require('atom-space-pen-views').$;

  React = require('react-atom-fork');

  Reactionary = require('reactionary-atom-fork');

  div = Reactionary.div;

  RP = React.PropTypes;

  _ = require('underscore');

  _ref = require('./blame-line-view'), BlameLineComponent = _ref.BlameLineComponent, renderLoading = _ref.renderLoading;

  BlameListLinesComponent = React.createClass({
    propTypes: {
      annotations: RP.arrayOf(RP.object),
      loading: RP.bool.isRequired,
      dirty: RP.bool.isRequired,
      initialLineCount: RP.number.isRequired,
      remoteRevision: RP.object.isRequired,
      showOnlyLastNames: RP.bool.isRequired
    },
    renderLoading: function() {
      var lines, _i, _ref1, _results;
      lines = (function() {
        _results = [];
        for (var _i = 0, _ref1 = this.props.initialLineCount; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; 0 <= _ref1 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(renderLoading);
      return div(null, lines);
    },
    _addAlternatingBackgroundColor: function(lines) {
      var bgClass, lastHash, line, _i, _len;
      bgClass = null;
      lastHash = null;
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        bgClass = line.noCommit ? '' : line.hash === lastHash ? bgClass : bgClass === 'line-bg-lighter' ? 'line-bg-darker' : 'line-bg-lighter';
        line['backgroundClass'] = bgClass;
        lastHash = line.hash;
      }
      return lines;
    },
    renderLoaded: function() {
      var l, lines, _i, _len;
      lines = _.clone(this.props.annotations);
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        l = lines[_i];
        l.remoteRevision = this.props.remoteRevision;
        l.showOnlyLastNames = this.props.showOnlyLastNames;
      }
      this._addAlternatingBackgroundColor(lines);
      return div(null, lines.map(BlameLineComponent));
    },
    render: function() {
      if (this.props.loading) {
        return this.renderLoading();
      } else {
        return this.renderLoaded();
      }
    },
    shouldComponentUpdate: function(_arg) {
      var dirty, finishedEdit, finishedInitialLoad, loading, showOnlyLastNames, showOnlyLastNamesChanged;
      loading = _arg.loading, dirty = _arg.dirty, showOnlyLastNames = _arg.showOnlyLastNames;
      finishedInitialLoad = this.props.loading && !loading && !this.props.dirty;
      finishedEdit = this.props.dirty && !dirty;
      showOnlyLastNamesChanged = this.props.showOnlyLastNames !== showOnlyLastNames;
      return finishedInitialLoad || finishedEdit || showOnlyLastNamesChanged;
    }
  });

  BlameListView = React.createClass({
    propTypes: {
      projectBlamer: RP.object.isRequired,
      remoteRevision: RP.object.isRequired,
      editorView: RP.object.isRequired
    },
    getInitialState: function() {
      return {
        scrollTop: this.scrollbar().scrollTop(),
        width: atom.config.get('git-blame.columnWidth'),
        loading: true,
        visible: true,
        dirty: false,
        showOnlyLastNames: atom.config.get('git-blame.showOnlyLastNames')
      };
    },
    scrollbar: function() {
      var _ref1;
      return this._scrollbar != null ? this._scrollbar : this._scrollbar = $((_ref1 = this.props.editorView.rootElement) != null ? _ref1.querySelector('.vertical-scrollbar') : void 0);
    },
    editor: function() {
      return this._editor != null ? this._editor : this._editor = this.props.editorView.getModel();
    },
    render: function() {
      var body, display;
      display = this.state.visible ? 'inline-block' : 'none';
      body = this.state.error ? div("Sorry, an error occurred.") : div({
        className: 'git-blame-scroller'
      }, div({
        className: 'blame-lines',
        style: {
          WebkitTransform: this.getTransform()
        }
      }, BlameListLinesComponent({
        annotations: this.state.annotations,
        loading: this.state.loading,
        dirty: this.state.dirty,
        initialLineCount: this.editor().getLineCount(),
        remoteRevision: this.props.remoteRevision,
        showOnlyLastNames: this.state.showOnlyLastNames
      })));
      return div({
        className: 'git-blame',
        style: {
          width: this.state.width,
          display: display
        }
      }, div({
        className: 'git-blame-resize-handle',
        onMouseDown: this.resizeStarted
      }), body);
    },
    getTransform: function() {
      var scrollTop, useHardwareAcceleration;
      scrollTop = this.state.scrollTop;
      useHardwareAcceleration = false;
      if (useHardwareAcceleration) {
        return "translate3d(0px, " + (-scrollTop) + "px, 0px)";
      } else {
        return "translate(0px, " + (-scrollTop) + "px)";
      }
    },
    componentWillMount: function() {
      this.loadBlame();
      this.editor().onDidStopChanging(this.contentsModified);
      return this.editor().onDidSave(this.saved);
    },
    loadBlame: function() {
      this.setState({
        loading: true
      });
      return this.props.projectBlamer.blame(this.editor().getPath(), (function(_this) {
        return function(err, data) {
          if (err) {
            return _this.setState({
              loading: false,
              error: true,
              dirty: false
            });
          } else {
            return _this.setState({
              loading: false,
              error: false,
              dirty: false,
              annotations: data
            });
          }
        };
      })(this));
    },
    contentsModified: function() {
      if (!this.isMounted()) {
        return;
      }
      if (!this.state.dirty) {
        return this.setState({
          dirty: true
        });
      }
    },
    saved: function() {
      if (!this.isMounted()) {
        return;
      }
      if (this.state.visible && this.state.dirty) {
        return this.loadBlame();
      }
    },
    toggle: function() {
      if (this.state.visible) {
        return this.setState({
          visible: false
        });
      } else {
        if (this.state.dirty) {
          this.loadBlame();
        }
        return this.setState({
          visible: true
        });
      }
    },
    componentDidMount: function() {
      this.scrollbar().on('scroll', this.matchScrollPosition);
      return this.showOnlyLastNamesObserver = atom.config.observe('git-blame.showOnlyLastNames', (function(_this) {
        return function(value) {
          return _this.setState({
            showOnlyLastNames: value
          });
        };
      })(this));
    },
    componentWillUnmount: function() {
      this.scrollbar().off('scroll', this.matchScrollPosition);
      this.editor().off('contents-modified', this.contentsModified);
      this.editor().buffer.off('saved', this.saved);
      return this.showOnlyLastNamesObserver.dispose();
    },
    matchScrollPosition: function() {
      return this.setState({
        scrollTop: this.scrollbar().scrollTop()
      });
    },
    resizeStarted: function(_arg) {
      var pageX;
      pageX = _arg.pageX;
      this.setState({
        dragging: true,
        initialPageX: pageX,
        initialWidth: this.state.width
      });
      $(document).on('mousemove', this.onResizeMouseMove);
      return $(document).on('mouseup', this.resizeStopped);
    },
    resizeStopped: function(e) {
      $(document).off('mousemove', this.onResizeMouseMove);
      $(document).off('mouseup', this.resizeStopped);
      this.setState({
        dragging: false
      });
      e.stopPropagation();
      return e.preventDefault();
    },
    onResizeMouseMove: function(e) {
      if (!(this.state.dragging && e.which === 1)) {
        return this.resizeStopped();
      }
      this.setState({
        width: this.state.initialWidth + e.pageX - this.state.initialPageX
      });
      e.stopPropagation();
      return e.preventDefault();
    }
  });

  module.exports = BlameListView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2tzd2VkYmVyZy8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3ZpZXdzL2JsYW1lLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0hBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsaUJBQVIsQ0FEUixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSx1QkFBUixDQUZkLENBQUE7O0FBQUEsRUFHQyxNQUFPLFlBQVAsR0FIRCxDQUFBOztBQUFBLEVBSUEsRUFBQSxHQUFLLEtBQUssQ0FBQyxTQUpYLENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FMSixDQUFBOztBQUFBLEVBTUEsT0FBc0MsT0FBQSxDQUFRLG1CQUFSLENBQXRDLEVBQUMsMEJBQUEsa0JBQUQsRUFBcUIscUJBQUEsYUFOckIsQ0FBQTs7QUFBQSxFQVNBLHVCQUFBLEdBQTBCLEtBQUssQ0FBQyxXQUFOLENBQ3hCO0FBQUEsSUFBQSxTQUFBLEVBQ0U7QUFBQSxNQUFBLFdBQUEsRUFBYSxFQUFFLENBQUMsT0FBSCxDQUFXLEVBQUUsQ0FBQyxNQUFkLENBQWI7QUFBQSxNQUNBLE9BQUEsRUFBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBRGpCO0FBQUEsTUFFQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUZmO0FBQUEsTUFHQSxnQkFBQSxFQUFrQixFQUFFLENBQUMsTUFBTSxDQUFDLFVBSDVCO0FBQUEsTUFJQSxjQUFBLEVBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFKMUI7QUFBQSxNQUtBLGlCQUFBLEVBQW1CLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFMM0I7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

//# sourceURL=/Users/kswedberg/.atom/packages/git-blame/lib/views/blame-list-view.coffee
