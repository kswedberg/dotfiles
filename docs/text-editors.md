# Text Editor Configuration

## Vim

Before using Vim, you should install Vundle and then run it to install other Vim plugins:

* Install Vundle:

    ```bash
    git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
    ```

Vundle.vim

* Install plugins listed in this project's `.vimrc` file:

    ```bash
    vim +PluginInstall +qall
    ```

## Visual Studio Code

* Install the **Settings Sync extension** (`shan.code-settings-sync`)
* Log in with Github
* If a new tab appears with a gist that you can select, select it.
* If you already have a gist, but it didn't appear:
* go to old computer and copy `Sync: Gist` value from `Extensions > Code Settings Sync` in Preferences
* paste it into same place on new computer
* Press `⌥ ⇧ d` to download settings


## Atom

* Install the package-sync package.
* Run the `package-sync:Sync` command (using ⌘⇧P)

## Sublime Text

To get the files in this repo to appear in SublimeText as shell scripts, install the ApplySyntax package and add this to the "syntaxes" array in its Settings - User file:

```json
{
"name": "ShellScript/Shell-Unix-Generic",
"rules": [
      {"file_name": ".*\\/(dotfiles)\\/(?!\\.git).*(?<!\\.(md|txt))$"}
]
}
```

That applies the ShellScript syntax to all files within the `/dotfiles/` directory, except for those that start with `.git` or end with `.md` or `.txt`.

Alternatively, you can directly modify the fileTypes array in `~/Library/Application Support/Sublime Text 2/Packages/ShellScript/Shell-Unix-Generic.tmLanguage`. See [Addy Osmani's dotfiles repo](https://github.com/addyosmani/dotfiles) for more info about this approach.
