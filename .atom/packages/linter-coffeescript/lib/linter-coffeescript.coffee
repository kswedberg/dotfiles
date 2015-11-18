coffee = require 'coffee-script'

class LinterCoffeeScript
  grammarScopes: ['source.coffee', 'source.litcoffee', 'source.coffee.jsx']
  scope: 'file'
  lintOnFly: true
  lint: (textEditor) ->
    filePath = textEditor.getPath()
    source = textEditor.getText()

    try
      coffee.compile source
    catch err
      return [{
        type: 'error'
        filePath: filePath
        text: err.message
        range: @computeRange(err.location)
      }]

    return []

  computeRange: ({first_line, first_column, last_line, last_column}) ->
    lineStart = first_line
    lineEnd = last_line || first_line
    colStart = first_column
    colEnd = (last_column || last_column) + 1

    return [[lineStart, colStart], [lineEnd, colEnd]]

module.exports = LinterCoffeeScript
