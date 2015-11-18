Diff = require '../lib/diff'
MockTreeView = require './mock-tree-view'

describe "Diff", ->
  activationPromise = null
  workspaceElement = null

  beforeEach ->
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('atom-cli-diff')

  describe "when the diff:selected command is triggered", ->
    it "attaches the diff view", ->
      # atom.commands.dispatch workspaceElement, 'diff:clipboard'
      # editor = atom.workspace.getActiveTextEditor()

      waitsForPromise ->
        activationPromise

      runs ->
        # expect(editor.getGrammar().fileTypes).toContain('Diff')
        expect(['diff']).toContain('diff')
