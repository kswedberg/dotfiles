# HTMLizer

HTMLizer is a tool simply captures basic **Bold, Italic and Underline**
keys. Just use `CMD-B`, `CMD-I` and `CMD-U` keys. It will wrap the selection.

## HTML Scope

### Bold `CMD-B`
It will wrap `any text` to `<strong>any text</strong>`

### Italic `CMD-I`
It will wrap `any text` to `<em>any text</em>`

### Underline `CMD-U`
It will wrap `any text` to `<u>any text</u>`

## Markdown Scope

### Bold `CMD-B`
It will wrap `any text` to `**any text**`

### Italic `CMD-I`
It will wrap `any text` to `*any text*`

### Underline `CMD-U`
It will wrap `any text` to `_any text_`

## CSS Scope

### Bold `CMD-B`
It will add `font-weight: bold` to CSS rule.

### Italic `CMD-I`
It will add `font-style: italic` to CSS rule.

### Underline `CMD-U`
It will add `text-decoration: underline` to CSS rule.

## Extend and Contribute

Also you can extend the package with editing `maps.coffee` file.

You need to write an object like below. `activate` is the function
explains how to wrap text, and extract is the array explains how to
extract wrapped text back.

```coffeescript
  "bold":
    'text\.html':
      activate: (text)-> "<strong>#{text}</strong>"
      extract: [/^<(strong[^>]*)>(.*?)<\/\1>$/im, 2]

    'source\.gfm':
      activate: (text)-> "**#{text}**"
      extract: [/^(\*\*)(.*?)\1/im, 2]

    'source\.css':
      activate: (text)-> "font-weight: bold;";
      extract: [/^font-weight:\s*bold;?$/im, '/* font-weight: bold; */']
```
