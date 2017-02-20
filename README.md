# dot files

These are the dot files for my MacBook Pro. A lot of the stuff in here was
taken from the illustrious Mathias Bynens (https://github.com/mathiasbynens/dotfiles).


## Initial Setup

To get things rolling on a new machine, **you can run `./setup.sh` from this project's main directory**. Doing so should make the following happen:

* Install Homebrew, `oh my zsh`, `nvm`, and `rbenv` if they aren't already installed.
* Add the *unsourced* `.extra ` file into this directory, if it doesn't already exist.
* Sym-link the following files to the home directory (if real files by these names exist already, they'll be renamed to, for example, `.gitconfig-pre-dotfiles`. If symlinks exist, they'll be left alone.):
    * `.gitconfig` : **You'll need to change the user name and email in this file**
    * `.jscsrc`
    * `.jshintrc`
    * `.profile`
    * `.slate`
    * `.zshrc`
    * `.zprofile`

## Init files

Files in the `init` folder install various applications (`brew.sh`, `cask.sh`) and modules (`gem.sh` for Ruby, `npm.sh` for Node.js). **Look through these files and comment out unwanted apps/modules before calling them**.

Whatever you do, **DON'T run `init/osx.sh` wholesale**. You probably don't want to run most of the commands. Either comment out all the lines you don't want to run
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

To change the git user name and email:

```bash
git config --global user.name "John Doe"
git config --global user.email "john@example.com"
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
