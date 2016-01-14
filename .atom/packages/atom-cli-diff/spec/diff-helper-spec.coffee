DiffHelper = require '../lib/helpers/diff-helper'
CSON = require 'season'
path = require 'path'
chaiExpect = require('chai').expect

describe "Diff Helper", ->
  diffHelper = null

  beforeEach ->
    diffHelper = new DiffHelper()

  describe "DiffHelper construction", ->
    it "can be created", ->
      expect(diffHelper).not.toBe(null)

  describe "Helper executing the diff command", ->
    it "returns the stdoutput string", ->
      stdoutstr = diffHelper.execDiff [
        "/Users/mafiuss/.atom/packages/diff/spec/data/file1.txt"
        "/Users/mafiuss/.atom/packages/diff/spec/data/file2.txt"
      ]

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

  describe "Helper creating temp files from clipboard", ->
    it "creates a temp file with the clipboard contents", ->
      data = 'the quick brown fox jumps'
      atom.clipboard.write(data);
      filepath = diffHelper.createTempFileFromClipboard atom.clipboard
      fs = require('fs')
      expect(fs.existsSync(filepath)).toBe(true)
      readData = fs.readFileSync(filepath, {encoding: 'utf8'})
      expect(readData).toBe(data)

      fs.unlinkSync(filepath)

  describe "Helper using dif_main from diff-match-patch", ->

    fixtures = CSON.readFileSync path.join(__dirname, '/data/fixtures.cson')
    it 'returns an array of diffs, the diff_main API', ->
      result = diffHelper.diffMain fixtures.text1, fixtures.text2
      expect(result).toBeDefined
      chaiExpect(result).to.be.an 'array'

    it 'works on line mode returning a line diff', ->
      result = diffHelper.diffLineMode fixtures.text5, fixtures.text6
      expect(result).toBeDefined
      chaiExpect(result).to.be.an 'array'

    it 'builds a pretty HTML string', ->
      console.log 'error',fixtures.text5 unless fixtures.text5
      console.log 'error',fixtures.text6 unless fixtures.text6

      result = diffHelper.diffPrettyHTML diffHelper.diffMain fixtures.text5, fixtures.text6
      expect(result).toBeDefined
      console.log result
      chaiExpect(result).to.be.a 'string'
