{CompositeDisposable} = require 'atom'

crypto = require 'crypto'
Entities = new (require('html-entities').AllHtmlEntities)

getText = ->
  if editor = atom.workspace.getActiveTextEditor()
    selection = editor.getSelectedText()
    unless selection
      selection = editor.getText() unless selection
    else
      selected = true

    [editor, selection, selected]

insertText = (editor, text, selected) ->
  if selected
    editor.insertText(text)
  else
    editor.setText(text)

cryptoHash = (type) ->
  [editor, text, selected] = getText()

  insertText(editor, crypto.createHash(type).update(text).digest('hex'), selected) if editor and text


base64 = (decode) ->
  [editor, text, selected] = getText()

  return unless editor and text

  if decode
    insertText(editor, new Buffer(text, 'base64').toString(), selected)
  else
    insertText(editor, new Buffer(text).toString('base64'), selected)

entities = (decode) ->
  [editor, text, selected] = getText()

  return unless editor and text

  if decode
    insertText(editor, Entities.decode(text), selected)
  else
    insertText(editor, Entities.encode(text), selected)

md5 = -> cryptoHash('md5')
sha256 = -> cryptoHash('sha256')
sha512 = -> cryptoHash('sha512')

uri = (decode) ->
  [editor, text, selected] = getText()

  return unless editor and text

  if decode
    insertText(editor, decodeURIComponent(text), selected)
  else
    insertText(editor, encodeURIComponent(text), selected)

module.exports = StringEncoder =
  subscriptions: null

  activate: () ->
    @subscriptions = new CompositeDisposable

    @subscriptions.add atom.commands.add 'atom-workspace',
      'string-encoder:base64-decode': -> base64(true)
      'string-encoder:base64-encode': -> base64()
      'string-encoder:html-entities-decode': -> entities(true)
      'string-encoder:html-entities-encode': -> entities()
      'string-encoder:md5-encode': md5
      'string-encoder:sha256-encode': sha256
      'string-encoder:sha512-encode': sha512
      'string-encoder:uri-decode': -> uri(true)
      'string-encoder:uri-encode': -> uri()

  deactivate: ->
    @subscriptions.dispose()
