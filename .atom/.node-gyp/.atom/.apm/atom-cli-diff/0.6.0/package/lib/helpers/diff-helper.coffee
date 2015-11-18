shellescape = require 'shell-escape'
tmp         = require('temporary');

module.exports =
  class DiffHelper
    defaults:
      'treeViewSelector': '.tree-view'
    myWorkspaceView: null

    baseCommand: 'diff --strip-trailing-cr --label "left" --label "right" -u '

    constructor: (aWorkspaceView)->
      @myWorkspaceView = aWorkspaceView

    selectedFiles: ->
      treeView = @myWorkspaceView.find(@defaults.treeViewSelector).view()
      if treeView is null
        console.error 'tree-view not found or already set'
        throw "Error"
      else
        treeView.selectedPaths()

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
