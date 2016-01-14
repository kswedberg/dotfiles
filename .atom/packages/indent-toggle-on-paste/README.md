# indent-toggle-on-paste package

> Add a shortcut to toggle the auto-indent mecanism on paste

* * *

Sometimes, when you paste text, the `Auto Indent On Paste` mecanism can bother you. Instead of passing by the settings panel to deactivate it for a moment, this package put a keyboard shortcut to a command which will toggle the mecanism, paste the content of your clipboard, then reset the setting value to its previous state.

**Note:** this package is kinda like in beta: it works in cases I need it, but I still doesn't understand some specific cases of auto-indenting from Atom's core.

* * *

## Keybindings

With the success of Atom, it's really difficult to choose keybindings that will not enter in conflict whit anyone else's packages, so I have removed the default keystrokes and let the keymap empty to let you set your own keybindings.

See [keymaps/indent-toggle-on-paste.cson](https://github.com/leny/atom-indent-toggle-on-paste/blob/master/keymaps/indent-toggle-on-paste.cson) for suggestions.
