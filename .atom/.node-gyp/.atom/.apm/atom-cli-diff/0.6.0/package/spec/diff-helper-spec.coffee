{_, WorkspaceView} = require 'atom'
DiffHelper = require '../lib/helpers/diff-helper'
MockTreeView = require './mock-tree-view'

describe "Diff Helper", ->
  diffHelper = null
  mockTreeView = null

  beforeEach ->
    fakeWorkspaceView = new WorkspaceView
    @mockTreeView = new MockTreeView
    fakeWorkspaceView.append(@mockTreeView)
    atom.workspaceView = fakeWorkspaceView
    diffHelper = new DiffHelper(fakeWorkspaceView)

  describe "DiffHelper construction", ->
    it "can be created", ->
      expect(diffHelper).not.toBe(null)

    it "has a myWorkspaceView member", ->
      expect(diffHelper.myWorkspaceView).toBeDefined()
      expect(diffHelper.myWorkspaceView).not.toBeNull()

  describe "Helper finding selected files in the tree view", ->
    it "finds the selected files", ->
      selectedFiles = diffHelper.selectedFiles()

      expect(selectedFiles).toBeDefined()
      expect(selectedFiles).not.toBeNull()
      expect(selectedFiles.length).toBe(2)

  describe "Helper executing the diff command", ->
    it "returns the stdoutput string", ->
      stdoutstr = diffHelper.execDiff(@mockTreeView.selectedPaths())

      expect(stdoutstr).toBeDefined()
      expect(stdoutstr).not.toBeNull()

  describe "Helper creating temp files", ->
    it "creates a temp file with the provided contents", ->
      data = 'the quick brown fox jumps'
      filepath = diffHelper.createTempFile data
      fs = require('fs')
      expect(fs.existsSync(filepath)).toBe(true)
      readData = fs.readFileSync(filepath, {encoding: 'utf8'})
      expect(readData).toBe(data)

      fs.unlinkSync(filepath)
