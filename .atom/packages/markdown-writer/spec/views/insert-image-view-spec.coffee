InsertImageView = require "../../lib/views/insert-image-view"

describe "InsertImageView", ->
  beforeEach ->
    waitsForPromise -> atom.workspace.open("empty.markdown")

  it 'can be initialized', ->
    insertImageView = new InsertImageView({})
