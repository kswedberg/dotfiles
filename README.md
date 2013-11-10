# dot files

These are the dot files for my MacBook Pro. A lot of the stuff in here was
taken from the illustrious Mathias Bynens (https://github.com/mathiasbynens/dotfiles).

This repository does not include the `.oh-my-zsh` directory.

The `.profile` and `.zshrc` files are symlinked to my home directory.

Files in the `init` folder should probably run only once, typically on a fresh
install.

You probably won't want to run the `init/osx.sh` wholesale. Instead, go in
there and either comment out all the lines you don't want to run
first, or grab the settings line by line and paste them in the terminal.

## Syntax Highlighting for SublimeText

Thanks, [Addy Osmani](https://github.com/addyosmani/dotfiles), for this tip.

Put this in the fileTypes array in `~/Library/Application Support/Sublime Text 2/Packages/ShellScript/Shell-Unix-Generic.tmLanguage`:

```xml
<string>sh</string>
<string>bash</string>
<string>zsh</string>
<string>zsh-theme</string>
<string>.ackrc</string>
<string>.aliases</string>
<string>.bash_login</string>
<string>.bash_logout</string>
<string>.bash_profile</string>
<string>.bashrc</string>
<string>.exports</string>
<string>.extra</string>
<string>.functions</string>
<string>.gemrc</string>
<string>.gitattributes</string>
<string>.gitconfig</string>
<string>.gitignore</string>
<string>.gitignore_global</string>
<string>.inputrc</string>
<string>.jekyll</string>
<string>.jekyllconfig</string>
<string>.opts</string>
<string>.path</string>
<string>.pearrc</string>
<string>.profile</string>
<string>.textmate_init</string>
<string>.tm_properties</string>
<string>.wgetrc</string>
<string>.zshrc</string>
```
