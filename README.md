# dot files

These are the dot files for my MacBook Pro. A lot of the stuff in here was
taken from the illustrious Mathias Bynens (https://github.com/mathiasbynens/dotfiles) and others.

**This README is a work in progress.**

Using:

* Mackup: This is the primary thing
* Antigen for zsh bundles
* Homebrew

**Note**: If you are using a 2020+ Mac with an **Apple Silicon** CPU, some of the file paths have changed for tools installed by Homebrew. In particular, `/usr/local` has changed to `/opt/homebrew`. In this case, you should use the [apple-silicon](https://github.com/kswedberg/dotfiles/tree/apple-silicon) branch instead.

## Initial Setup

1. From Terminal.app, clone this repository from the home directory.
    * If you get a warning about xCode developer tools being required, follow the instructions to install them.
    * After installing xCode dev tools, run `sudo xcodebuild -license accept`. Otherwise, the setup routine could abort.
2. Modify `Brewfile` to only include the apps you want to install.
3. Modify files in `init/` directory to only install dependencies you want to install
4. **Important**: The `init/macos.sh` file has some very opinionated settings. Make sure you comment out the ones you don't want to set.
5. Run `./setup.sh` from *this project's main directory*. Doing so makes the following happen:
    * **Homebrew**: Installs Homebrew if not already installed. Updates brew, and runs `brew bundle`, which install a crap-ton of brew, cask, and Mac App Store apps via the `Brewfile`.
    * **Node.js / nvm**: Installs `nvm` if not already installed. Installs the most recent version of node.js. Installs global npm packages specified in `init/npm.sh`.
    * **Zsh**: Sets the default shell environment to Zsh
    * **Composer** Installs global Composer packages for PHP
6. Install and set a global Ruby version using `rbenv`:

    ```bash
    # List available versions
    rbenv install -l
    # Install a recent version. For example:
    rbenv install 2.6.5
    # Set global version to installed. For example:
    rbenv global 2.6.5
    ```

7. Run `./setup2.sh` from *this project's main directory* to install global node modules and ruby gems listed in `./init/npm.sh` and `./init/gem.sh`, respectively.
8. Run `mackup restore`

## Files to manually copy

* ~/Library/Fonts

## Additional Configuration

* [Text Editors](docs/text-editors.md): Vim, VSCode, Atom, Sublime
* [Database Servers](docs/db.md): Rethink, Mongo
* [MacOS Apps](docs/apps-macos.md): Finder, Messages
* [MacOS System Preferences](docs/system-prefs.md): Keyboard Shortcuts
* [Third-party Apps](docs/apps-3rd-party.md): QuickLook Applets, iTerm

## File Associations

Associating multiple files types with a particular app can be a hassle, so this repo contains a function to make the process a little easier for files you might want to open with your text editor of choice.

* From the command line, run `create-dummies-for-open-with`
* Follow the instructions, repeated here for your edification:
  1. Open `~/dotfiles/dummies` in the Finder
  2. Select all the files (<kbd>⌘</kbd> <kbd>a</kbd>)
  3. Press <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>i</kbd>
  4. In the info window that appears, click "Open with…", select the app, click "Change All…"

When you're finished, you can delete the `dummies` folder.

## Enable TouchID for sudo

Source: [tweet on 2017-11-16 by @cabel](https://twitter.com/cabel/status/931292107372838912)

_Note:_ There might be security implications to doing this. Proceed at your own risk.

1. Open `/etc/pam.d/sudo` for editing: `sudo vim /etc/pam.d/sudo`
2. Add this to the top of the file and save: `auth sufficient pam_tid.so`
3. Profit

## Apps Not Installed Here

The following apps need to be manually installed:

* Luminar
* MAMP Pro
* SuperDuper!

## Some Important Files

* **Brewfile**: manifest for installing brew packages, cask apps, and MacOS App Store apps
* **home/.antigenrc**: config for installing zsh plugins, etc
* **home/.mackup/custom.cfg**: config for extra files to symlink from `~/dotfiles/home/` to `~/`


## Before wiping a drive

* Backup the whole thing. Duh.
* Run `./backup.sh` from _this project's main directory_
* Dump local rethinkdb databases
* Dump local MySQL databases
* Dump local mongodb databases
