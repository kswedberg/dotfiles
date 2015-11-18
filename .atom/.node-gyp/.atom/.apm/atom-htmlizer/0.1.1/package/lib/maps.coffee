module.exports =
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

  "italic":
    'text\.html':
      activate: (text)-> "<em>#{text}</em>"
      extract: [/^<(em[^>]*)>(.*?)<\/\1>$/im, 2]

    'source\.gfm':
      activate: (text)-> "*#{text}*"
      extract: [/^(\*)(.*?)\1/, 2]

    'source\.css':
      activate: (text)-> "font-style: italic;"
      extract: [/^font-style:\s*italic;?$/im, '/* font-style: italic; */']

  "underline":
    'text\.html':
      activate: (text)-> "<u>#{text}</u>"
      extract: [/^<(u[^>]*)>(.*?)<\/\1>$/im, 2]

    'source\.gfm':
      activate: (text)-> "_#{text}_"
      extract: [/^(\_)(.*?)\1/im, 2]

    'source\.css':
      activate: (text)-> "text-decoration: underline;"
      extract: [/^text-decoration:\s*underline;?$/im, '/* text-decortaion: underline; */']

  "image":
    'text\.html':
      activate: (text)-> "<img src=\"#{text}\" alt=\"\">"
      extract: [/^<img[^>]*src="([^>\"]+)"[^>]*\/?>$/, 1]

    'source\.gfm':
      activate: (text)-> "![](#{text})"
      extract: [/^!\[[^\]]*\]\((.*?)\)$/, 1]

    'source\.css':
      activate: (text)-> "background-image: url(#{text});"
      extract: [/^background-image\:\s*?url\(([^\)]+)\);?$/, 1]
