{$, View, TextEditorView} = require "atom-space-pen-views"

config = require "../config"
utils = require "../utils"
FrontMatter = require "../helpers/front-matter"

module.exports =
class ManageFrontMatterView extends View
  @labelName: "Manage Field" # override
  @fieldName: "fieldName" # override

  @content: ->
    @div class: "markdown-writer markdown-writer-selection", =>
      @label @labelName, class: "icon icon-book"
      @p class: "error", outlet: "error"
      @subview "fieldEditor", new TextEditorView(mini: true)
      @ul class: "candidates", outlet: "candidates", =>
        @li "Loading..."

  initialize: ->
    @candidates.on "click", "li", (e) => @appendFieldItem(e)

    atom.commands.add @element,
      "core:confirm": => @saveFrontMatter()
      "core:cancel":  => @detach()

  display: ->
    @editor = atom.workspace.getActiveTextEditor()
    @panel ?= atom.workspace.addModalPanel(item: this, visible: false)
    @previouslyFocusedElement = $(document.activeElement)

    @fetchSiteFieldCandidates()
    @frontMatter = new FrontMatter(@editor)
    return @detach() if @frontMatter.parseError
    @frontMatter.normalizeField(@constructor.fieldName)
    @setEditorFieldItems(@frontMatter.get(@constructor.fieldName))

    @panel.show()
    @fieldEditor.focus()

  detach: ->
    if @panel.isVisible()
      @panel.hide()
      @previouslyFocusedElement?.focus()
    super

  saveFrontMatter: ->
    @frontMatter.set(@constructor.fieldName, @getEditorFieldItems())
    @frontMatter.save()
    @detach()

  setEditorFieldItems: (fieldItems) ->
    @fieldEditor.setText(fieldItems.join(","))

  getEditorFieldItems: ->
    @fieldEditor.getText().split(/\s*,\s*/).filter((c) -> !!c.trim())

  fetchSiteFieldCandidates: -> # override

  displaySiteFieldItems: (siteFieldItems) ->
    fieldItems = @frontMatter.get(@constructor.fieldName) || []
    tagElems = siteFieldItems.map (tag) ->
      if fieldItems.indexOf(tag) < 0
        "<li>#{tag}</li>"
      else
        "<li class='selected'>#{tag}</li>"
    @candidates.empty().append(tagElems.join(""))

  appendFieldItem: (e) ->
    fieldItem = e.target.textContent
    fieldItems = @getEditorFieldItems()
    idx = fieldItems.indexOf(fieldItem)
    if idx < 0
      fieldItems.push(fieldItem)
      e.target.classList.add("selected")
    else
      fieldItems.splice(idx, 1)
      e.target.classList.remove("selected")
    @setEditorFieldItems(fieldItems)
    @fieldEditor.focus()
