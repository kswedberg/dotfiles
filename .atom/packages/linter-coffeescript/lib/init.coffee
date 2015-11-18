LinterCoffeeScript = require './linter-coffeescript'

module.exports =
  config: {}
  provideLinter: ->
    new LinterCoffeeScript
