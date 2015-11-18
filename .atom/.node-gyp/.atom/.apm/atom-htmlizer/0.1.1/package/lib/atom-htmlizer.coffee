maps = require "./maps"

module.exports =

  activate: ->
    atom.workspaceView.command "atom-htmlizer:toggle-bold", => @toggle "bold"
    atom.workspaceView.command "atom-htmlizer:toggle-italic", => @toggle "italic"
    atom.workspaceView.command "atom-htmlizer:toggle-underline", => @toggle "underline"
    atom.workspaceView.command "atom-htmlizer:toggle-image", => @toggle "image"

  toggle: (type)->
    editor = atom.workspace.getActiveEditor()

    [scope] = editor.getCursorScopes()
    selection = editor.getSelectedText()
    typeScope = maps[type]

    for own scopeText, options of typeScope
      if scope.match new RegExp scopeText
        found = options

    return unless found

    {activate, extract} = found
    [matcher, index] = extract

    editor.getSelection().deleteSelectedText()

    is_match = selection.match matcher
    console.log is_match, selection, matcher
    ranges = editor.insertText(if is_match then (is_match[index] or index) else activate selection)
    editor.setSelectedBufferRanges ranges
