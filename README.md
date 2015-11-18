# dot files

These are the dot files for my MacBook Pro. A lot of the stuff in here was
taken from the illustrious Mathias Bynens (https://github.com/mathiasbynens/dotfiles).

This repository does not include the `.oh-my-zsh` directory.

## Symlinked files
The following files are symlinked to my home directory:

* `.atom`
* `.jscsrc`
* `.jshintrc`
* `.profile`
* `.slate`
* `.zshrc`
* `.zprofile`

To symlink them all at once, execute the `init/sym.sh` file.

## Init files

Files in the `init` folder should probably run only once, typically on a fresh
install.

You probably won't want to run the `init/osx.sh` wholesale. Instead, go in
there and either comment out all the lines you don't want to run
first, or grab the settings line by line and paste them in the terminal.

## Git files

If you want to use `.gitignore_global` as your global `.gitignore` file, run this in the terminal:

```bash
git config --global core.excludesfile  ~/dotfiles/.gitignore_global
```

To have the post-checkout git hook loaded whenever you init or clone a new repo, run this line in the terminal:

```bash
git config --global init.templatedir ~/dotfiles/.git_template
```

## Syntax Highlighting for SublimeText

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
