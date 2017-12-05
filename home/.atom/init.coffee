# Your init script
#
# Atom will evaluate this file each time a new window is opened. It is run
# after packages are loaded/activated and after the previous editor state
# has been restored.
#
# An example hack to log to the console when each text editor is saved.
#
# atom.workspace.observeTextEditors (editor) ->
#   editor.onDidSave ->
#     console.log "Saved! #{editor.getPath()}"

atom.commands.add 'atom-workspace', 'swed:ignore-toggle', ->
  workspaceView = atom.views.getView atom.workspace
  atom.commands.dispatch workspaceView, 'tree-view:toggle-focus'
  atom.commands.dispatch workspaceView, 'tree-ignore:toggle'

atom.commands.add 'atom-workspace', 'swed:toggle-vcs-ignored-files', ->
  treeView = atom.views.getView(document.querySelector('div.tree-view.tool-panel'))
  atom.commands.dispatch(treeView, 'tree-view:toggle-vcs-ignored-files');

atom.commands.add 'atom-text-editor', 'swed:revert-to-saved', (event) ->
  event.target.closest('atom-text-editor').getModel().getBuffer().reload()
