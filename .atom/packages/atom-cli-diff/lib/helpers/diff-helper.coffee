shellescape    = require 'shell-escape'
tmp            = require 'temporary'
DiffMatchPatch = require 'diff-match-patch'
fs             = require 'fs'

module.exports =
  class DiffHelper

    constructor: ->
      @baseCommand = [
        'diff'
        '--strip-trailing-cr'
        '--label'
        'left'
        '--label'
        'right'
        '-u']
      @diff = new DiffMatchPatch()

    execDiff: (files, kallback) ->
      cmd  = @buildCommand(files)
      exec = require('child_process').exec
      exec cmd, {}, kallback

    buildCommand: (files) ->
      if files.length isnt 2
        throw "Error"
      shellescape(@baseCommand.concat files)

    createTempFile: (contents) ->
      tmpfile = new tmp.File()
      tmpfile.writeFileSync(contents)
      tmpfile.path

    createTempFileFromClipboard: (clipboard) ->
      tmpfile = new tmp.File()
      tmpfile.writeFileSync(clipboard.read())
      tmpfile.path

    diffMain: (text1, text2) ->
      return @diff.diff_main text1, text2

    diffLineMode: (text1, text2) ->
      a = @diff.diff_linesToChars_(text1, text2)
      diffs = @diff.diff_main(a.chars1, a.chars2, false)
      @diff.diff_charsToLines_ diffs, a.lineArray
      diffs

    diffPatchMake: (text1, text2) ->
      diffs = @diffLineMode text1, text2
      @diff.patch_make text1, diffs

    diffPrettyHTMLFiles: (file1, file2) ->
      console.log 'diffing', file1, file2
      left  = fs.readFileSync file1
      right = fs.readFileSync file2
      console.log left
      console.log right
      diffs = @diffMain left.toString(), right.toString()
      @diff.diff_cleanupSemantic diffs
      @diffPrettyHTML diffs

    diffPrettyHTML: (diffs) ->
      @diff.diff_prettyHtml diffs
