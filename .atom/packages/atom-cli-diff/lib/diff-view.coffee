{ScrollView} = require 'atom-space-pen-views'

module.exports =
class DiffView extends ScrollView

  @content: ->
    @div class: 'diff-view'
  initialize: (state) ->
    super state

  serialize: ->

  destroy: ->
    @detach()
