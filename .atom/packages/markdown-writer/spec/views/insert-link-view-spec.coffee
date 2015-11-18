InsertLinkView = require "../../lib/views/insert-link-view"

describe "InsertLinkView", ->
  [editor, insertLinkView] = []

  beforeEach ->
    waitsForPromise -> atom.workspace.open("empty.markdown")

    runs ->
      insertLinkView = new InsertLinkView({})
      editor = atom.workspace.getActiveTextEditor()

  describe ".insertLink", ->
    it "insert inline link", ->
      insertLinkView.editor = { setTextInBufferRange: -> {} }
      spyOn(insertLinkView.editor, "setTextInBufferRange")

      link = text: "text", url: "http://"
      insertLinkView.insertLink(link)

      expect(insertLinkView.editor.setTextInBufferRange).toHaveBeenCalledWith(undefined, "[text](http://)")

    it "insert reference link", ->
      spyOn(insertLinkView, "insertReferenceLink")

      link = text: "text", title: "this is title", url: "http://"
      insertLinkView.insertLink(link)

      expect(insertLinkView.insertReferenceLink).toHaveBeenCalledWith(link)

    it "update reference link", ->
      insertLinkView.definitionRange = {}
      spyOn(insertLinkView, "updateReferenceLink")

      link = text: "text", title: "this is title", url: "http://"
      insertLinkView.insertLink(link)

      expect(insertLinkView.updateReferenceLink).toHaveBeenCalledWith(link)

  describe ".updateReferenceLink", ->
    beforeEach ->
      atom.config.set("markdown-writer.referenceIndentLength", 2)

    it "insert reference and definition", ->
      insertLinkView.referenceId = "ABC123"
      insertLinkView.range = "Range"
      insertLinkView.definitionRange = "DRange"

      insertLinkView.editor = { setTextInBufferRange: -> {} }
      spyOn(insertLinkView.editor, "setTextInBufferRange")

      link = text: "text", title: "this is title", url: "http://"
      insertLinkView.updateReferenceLink(link)

      expect(insertLinkView.editor.setTextInBufferRange.calls[0].args).toEqual(
        ["Range", "[text][ABC123]"])
      expect(insertLinkView.editor.setTextInBufferRange.calls[1].args).toEqual(
        ["DRange", '  [ABC123]: http:// "this is title"'])

  describe ".setLink", ->
    it "sets all the editors", ->
      link = text: "text", title: "this is title", url: "http://"

      insertLinkView.setLink(link)

      expect(insertLinkView.textEditor.getText()).toBe(link.text)
      expect(insertLinkView.titleEditor.getText()).toBe(link.title)
      expect(insertLinkView.urlEditor.getText()).toBe(link.url)

  describe ".getSavedLink", ->
    beforeEach ->
      insertLinkView.links =
        "oldstyle": {"title": "this is title", "url": "http://"}
        "newstyle": {"text": "NewStyle", "title": "this is title", "url": "http://"}

    it "return undefined if text does not exists", ->
      expect(insertLinkView.getSavedLink("notExists")).toEqual(undefined)

    it "return the link with text, title, url", ->
      expect(insertLinkView.getSavedLink("oldStyle")).toEqual({
        "text": "oldStyle", "title": "this is title", "url": "http://"})

      expect(insertLinkView.getSavedLink("newStyle")).toEqual({
        "text": "NewStyle", "title": "this is title", "url": "http://"})

  describe ".isInSavedLink", ->
    beforeEach ->
      insertLinkView.links =
        "oldstyle": {"title": "this is title", "url": "http://"}
        "newstyle": {"text": "NewStyle", "title": "this is title", "url": "http://"}

    it "return false if the text does not exists", ->
      expect(insertLinkView.isInSavedLink(text: "notExists")).toBe(false)

    it "return false if the url does not match", ->
      link = text: "oldStyle", title: "this is title", url: "anything"
      expect(insertLinkView.isInSavedLink(link)).toBe(false)

    it "return true", ->
      link = text: "NewStyle", title: "this is title", url: "http://"
      expect(insertLinkView.isInSavedLink(link)).toBe(true)

  describe ".updateToLinks", ->
    beforeEach ->
      insertLinkView.links =
        "oldstyle": {"title": "this is title", "url": "http://"}
        "newstyle": {"text": "NewStyle", "title": "this is title", "url": "http://"}

    it "saves the new link if it does not exists before and checkbox checked", ->
      insertLinkView.saveCheckbox.prop("checked", true)

      link = text: "New Link", title: "this is title", url: "http://new.link"
      expect(insertLinkView.updateToLinks(link)).toBe(true)
      expect(insertLinkView.links["new link"]).toEqual(link)

    it "does not save the new link if checkbox is unchecked", ->
      insertLinkView.saveCheckbox.prop("checked", false)

      link = text: "New Link", title: "this is title", url: "http://new.link"
      expect(insertLinkView.updateToLinks(link)).toBe(false)

    it "saves the link if it is modified and checkbox checked", ->
      insertLinkView.saveCheckbox.prop("checked", true)

      link = text: "NewStyle", title: "this is new title", url: "http://"
      expect(insertLinkView.updateToLinks(link)).toBe(true)
      expect(insertLinkView.links["newstyle"]).toEqual(link)

    it "does not saves the link if it is not modified and checkbox checked", ->
      insertLinkView.saveCheckbox.prop("checked", true)

      link = text: "NewStyle", title: "this is title", url: "http://"
      expect(insertLinkView.updateToLinks(link)).toBe(false)

    it "removes the existed link if checkbox is unchecked", ->
      insertLinkView.saveCheckbox.prop("checked", false)

      link = text: "NewStyle", title: "this is title", url: "http://"
      expect(insertLinkView.updateToLinks(link)).toBe(true)
      expect(insertLinkView.links["newstyle"]).toBe(undefined)

  describe "integration", ->
    beforeEach ->
      atom.config.set("markdown-writer.referenceIndentLength", 2)

      insertLinkView.fetchPosts = -> {}
      insertLinkView.loadSavedLinks = (cb) -> cb()

    it "insert new link", ->
      insertLinkView.display()
      insertLinkView.textEditor.setText("text")
      insertLinkView.urlEditor.setText("url")
      insertLinkView.onConfirm()

      expect(editor.getText()).toBe "[text](url)"

    it "insert new link with text", ->
      editor.setText "text"
      insertLinkView.display()
      insertLinkView.urlEditor.setText("url")
      insertLinkView.onConfirm()

      expect(editor.getText()).toBe "[text](url)"

    it "insert new reference link", ->
      insertLinkView.display()
      insertLinkView.textEditor.setText("text")
      insertLinkView.titleEditor.setText("title")
      insertLinkView.urlEditor.setText("url")
      insertLinkView.onConfirm()

      expect(editor.getText()).toBe """
        [text][#{insertLinkView.referenceId}]

          [#{insertLinkView.referenceId}]: url "title"
        """

    it "insert new reference link with text", ->
      editor.setText "text"
      insertLinkView.display()
      insertLinkView.titleEditor.setText("title")
      insertLinkView.urlEditor.setText("url")
      insertLinkView.onConfirm()

      expect(editor.getText()).toBe """
        [text][#{insertLinkView.referenceId}]

          [#{insertLinkView.referenceId}]: url "title"
        """

    it "update inline link", ->
      editor.setText("[text](url)")
      editor.selectAll()
      insertLinkView.display()

      expect(insertLinkView.textEditor.getText()).toEqual("text")
      expect(insertLinkView.urlEditor.getText()).toEqual("url")

      insertLinkView.textEditor.setText("new text")
      insertLinkView.urlEditor.setText("new url")
      insertLinkView.onConfirm()

      expect(editor.getText()).toBe "[new text](new url)"

    it "update inline link to reference link", ->
      editor.setText("[text](url)")
      editor.setCursorBufferPosition([0, 0])
      editor.selectToEndOfLine()
      insertLinkView.display()

      expect(insertLinkView.textEditor.getText()).toEqual("text")
      expect(insertLinkView.urlEditor.getText()).toEqual("url")

      insertLinkView.textEditor.setText("new text")
      insertLinkView.titleEditor.setText("title")
      insertLinkView.urlEditor.setText("new url")
      insertLinkView.onConfirm()

      expect(editor.getText()).toBe """
        [new text][#{insertLinkView.referenceId}]

          [#{insertLinkView.referenceId}]: new url "title"
        """

    it "update reference link to inline link", ->
      editor.setText """
      [text][ABC123]

      [ABC123]: url "title"
      """
      editor.setCursorBufferPosition([0, 0])
      editor.selectToEndOfLine()
      insertLinkView.display()

      expect(insertLinkView.textEditor.getText()).toEqual("text")
      expect(insertLinkView.titleEditor.getText()).toEqual("title")
      expect(insertLinkView.urlEditor.getText()).toEqual("url")

      insertLinkView.textEditor.setText("new text")
      insertLinkView.titleEditor.setText("")
      insertLinkView.urlEditor.setText("new url")
      insertLinkView.onConfirm()

      expect(editor.getText().trim()).toBe "[new text](new url)"

    it "remove inline link", ->
      editor.setText("[text](url)")
      editor.setCursorBufferPosition([0, 0])
      editor.selectToEndOfLine()
      insertLinkView.display()

      expect(insertLinkView.textEditor.getText()).toEqual("text")
      expect(insertLinkView.urlEditor.getText()).toEqual("url")

      insertLinkView.urlEditor.setText("")
      insertLinkView.onConfirm()

      expect(editor.getText()).toBe "text"

    it "remove reference link", ->
      editor.setText """
      [text][ABC123]

      [ABC123]: url "title"
      """
      editor.setCursorBufferPosition([0, 0])
      editor.selectToEndOfLine()
      insertLinkView.display()

      expect(insertLinkView.textEditor.getText()).toEqual("text")
      expect(insertLinkView.titleEditor.getText()).toEqual("title")
      expect(insertLinkView.urlEditor.getText()).toEqual("url")

      insertLinkView.urlEditor.setText("")
      insertLinkView.onConfirm()

      expect(editor.getText().trim()).toBe "text"
