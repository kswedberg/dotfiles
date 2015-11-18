DiffView = require "./diff-view"
DiffHelper = require './helpers/diff-helper'

module.exports =
  diffHelper: null
  diffView: null

  activate: (state) ->
    atom.commands.add 'atom-workspace', 'diff:selected', => @selected()
    atom.commands.add 'atom-workspace', 'diff:clipboard', => @clipboard()

    if @diffView != null and @diffView.hasParent()
      @diffView.destroy()
    else
      @diffView = new DiffView(state)

  deactivate: ->
    @diffView.destroy()
    @diffHelper = null

  serialize: ->
    diffViewState: @diffView.serialize()

  selected: ->
    unless @diffHelper?
      @diffHelper = new DiffHelper()
    @treeView = atom.workspace.getLeftPanels()[0].getItem()
    selectedPaths = @treeView.selectedPaths()

    if selectedPaths.length != 2
      console.error "wrong number of arguments for this command"
      throw new Error("wrong number of arguments for this command")

    p = @diffHelper.execDiff selectedPaths, (error, stdout, stderr) =>
        if error?
          console.log "there was an error " + error
        atom.workspace.open(@diffHelper.createTempFile(stdout))

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
      throw new Error("Error")
    if selectedPaths[0]? and selectedPaths[1]?
      p = @diffHelper.execDiff selectedPaths, (error, stdout, stderr) =>
          if (error != null)
            console.log "there was an error " + error
          atom.workspace.open(@diffHelper.createTempFile(stdout))
    else
      console.error "either there is no active editor or no clipboard data"
      throw new Error("Error")
