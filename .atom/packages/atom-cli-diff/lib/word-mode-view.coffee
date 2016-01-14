module.exports =
class wordModeView

  constructor: (serializedState) ->
    # Create root element
    @element = document.createElement('div')
    @element.classList.add('worddiff')

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @element.remove()

  getElement: ->
    @element

  updateDiff: (diff) ->
    console.log 'updating diff', diff
    @element.innerHTML =  diff
    console.log 'diff updated'

  getTitle: -> 'Diff'
