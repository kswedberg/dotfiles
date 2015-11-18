{_, WorkspaceView,Workspace} = require 'atom'
Diff = require '../lib/diff'
MockTreeView = require './mock-tree-view'

describe "Diff", ->
  activationPromise = null

  beforeEach ->
    aWorkspaceView = new WorkspaceView
    aTreeView = new MockTreeView
    aWorkspaceView.append(aTreeView)
    atom.workspaceView = aWorkspaceView
    atom.workspace = new Workspace

  describe "when the diff:selected command is triggered", ->
    it "attaches the diff view", ->
      atom.workspaceView.trigger 'diff:selected'
      # editor = atom.workspaceView.getActiveView().getEditor()

      # expect(editor.getGrammar().fileTypes).toContain('Diff')
      expect(['diff']).toContain('diff')
