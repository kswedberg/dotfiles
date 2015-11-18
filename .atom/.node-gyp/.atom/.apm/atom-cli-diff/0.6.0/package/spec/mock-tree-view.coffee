{View} = require 'atom'

module.exports =
  class MockTreeView extends View

    @content: ->
      @div class: 'tree-view'

    selectedPaths: ->
      [
        "/Users/mafiuss/.atom/packages/diff/spec/data/file1.txt"
        "/Users/mafiuss/.atom/packages/diff/spec/data/file2.txt"
      ] 
