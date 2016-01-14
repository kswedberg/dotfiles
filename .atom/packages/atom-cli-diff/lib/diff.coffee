WordModeView = require "./word-mode-view"
DiffHelper = require './helpers/diff-helper'
{CompositeDisposable} = require 'atom'

module.exports = Diff =
  diffHelper: null
  wordModeView: null
  modalPanel: null
  subscriptions: null
  opener: 'atom://diff'

  activate: (state) ->
    atom.commands.add 'atom-workspace', 'diff:selected', => @selected()
    atom.commands.add 'atom-workspace', 'diff:selectedWordMode', =>
      atom.workspace.open @opener

    atom.commands.add 'atom-workspace', 'diff:clipboard', => @clipboard()

    atom.workspace.addOpener (uri) =>
      if uri is @opener
        console.log 'custom opener triggered'
        if @wordModeView?
          @wordModeView.destroy()
        else
          @wordModeView = new WordModeView(state)
        @selectedWordMode()
        return @wordModeView

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

  deactivate: ->
    @wordModeView.destroy()
    @diffHelper = null

  serialize: ->
    wordModeViewState: @wordModeView.serialize()

  selected: ->
    unless @diffHelper?
      @diffHelper = new DiffHelper()

    selectedPaths = @_selectedPaths()

    if selectedPaths.length != 2
      # console.error 'wrong number of arguments for this command'
      atom.notifications.addWarning 'missing argument',
        detail: 'this command requires two files selected in the treeview'
        dissmisable: on
      return

    p = @diffHelper.execDiff selectedPaths, (error, stdout, stderr) =>
      if error?.code isnt 0
        # ignoring the error for now, child_process.exec fails with the error
        # diff: missing operand after `diff'
        # diff: Try `diff --help' for more information.
        # however the command succeds and gives the right output
        console.log "apparently there was an error ", error, stderr
        # atom.notifications.addError 'error', {detail: error, dissmisable: on}
        # return
      atom.workspace.open @diffHelper.createTempFile(stdout)

  clipboard: ->
    unless @diffHelper?
      @diffHelper = new DiffHelper()

    # console.log atom.workspace.getActivePaneItem().getPath()
    selectedPaths = [
      atom.workspace.getActivePaneItem().getPath(),
      @diffHelper.createTempFileFromClipboard(atom.clipboard)
    ]

    if selectedPaths.length != 2
      console.error "wrong number of arguments for this command"
      atom.notifications.addWarning 'missing argument',
        detail: 'select two files from the treeview'
        dissmisable: on
    if selectedPaths[0]? and selectedPaths[1]?
      p = @diffHelper.execDiff selectedPaths, (error, stdout, stderr) =>
          if (error != null)
            console.log "there was an error " + error
          atom.workspace.open(@diffHelper.createTempFile(stdout))
    else
      console.error "either there is no active editor or no clipboard data"
      atom.notifications.addWarning 'File not found',
        detail: 'File needs to be saved first'
        dissmisable: on

  selectedWordMode: ->
    unless @diffHelper?
      @diffHelper = new DiffHelper()

    selectedPaths = @_selectedPaths()

    if selectedPaths.length != 2
      atom.notifications.addWarning 'missing argument',
        detail: 'select two files from the treeview'
        dissmisable: on

    p = @diffHelper.diffPrettyHTMLFiles selectedPaths[0], selectedPaths[1]
    if @wordModeView?
      @wordModeView.updateDiff p
    else
      console.log 'no word mode view'

  _selectedPaths: ->
    treeViewPanel = atom.workspace.getLeftPanels()[0]
    if !treeViewPanel
      treeViewPanel = atom.workspace.getRightPanels()[0]
    @treeView = treeViewPanel.getItem()
    @treeView.selectedPaths()
