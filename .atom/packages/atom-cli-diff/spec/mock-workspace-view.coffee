{View} = require 'atom-space-pen-views'

module.exports =
  class MockWorkspaceView extends View

    @content: ->
      @div class:'atom-workspace'
