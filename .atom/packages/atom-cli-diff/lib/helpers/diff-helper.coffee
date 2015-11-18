shellescape = require 'shell-escape'
tmp         = require 'temporary'

module.exports =
  class DiffHelper

    constructor: ->
      @baseCommand = 'diff --strip-trailing-cr --label "left" --label "right" -u '

    execDiff: (files, kallback) ->
      cmd  = @buildCommand(files)
      exec = require('child_process').exec
      exec cmd, kallback

    buildCommand: (files) ->
      if files.length > 2
        throw "Error"

      @baseCommand + shellescape(files)

    createTempFile: (contents) ->
      tmpfile = new tmp.File()
      tmpfile.writeFileSync(contents)
      tmpfile.path

    createTempFileFromClipboard: (clipboard) ->
      tmpfile = new tmp.File()
      tmpfile.writeFileSync(clipboard.read())
      tmpfile.path
