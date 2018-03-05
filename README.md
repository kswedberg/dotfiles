# dot files

These are the dot files for my MacBook Pro. A lot of the stuff in here was
taken from the illustrious Mathias Bynens (https://github.com/mathiasbynens/dotfiles) and others.

**This README is a work in progress.**

Using:
* Mackup: This is the primary thing
* Antigen for zsh bundles
* Homebrew

## Initial Setup

* Modify `Brewfile` to only include the apps you want to install.
* Modify files in `init/` directory to only install dependencies you want to install
* **Important**: The `init/macos.sh` file has some very opinionated settings. Make sure you comment out the ones you don't want to set.
* Run `./setup.sh` from _this project's main directory_. Doing so makes the following happen:
  * **Homebrew**: Installs Homebrew if not already installed. Updates brew, and runs `brew bundle`, which install a crap-ton of brew, cask, and Mac App Store apps via the `Brewfile`.
  * **Node.js / nvm**: Installs `nvm` if not already installed. Installs the most recent version of node.js. Installs global npm packages specified in `init/npm.sh`.
  * **Zsh**: Sets the default shell environment to Zsh
  * **Ruby / rbenv**: Installs a "recent" Ruby version (as of 2017-12-01) via `rbenv` (which was installed via Homebrew).
  * **Composer** Installs global Composer packages for PHP

* Run `mackup restore` (?)
* In **Atom**: install the package-sync package. Then run the `package-sync:Sync` command (using ⌘⇧P)

## RethinkDB

Additional customizing is required for rethinkdb after initial setup.

* Probably want to change the host port from `:8080` to one that won't clobber a lot of local dev sites—something like `:8090`.
* Set password for admin user
* Create a new user and grant privileges

## MongoDB

Additional customizing is required for mongodb after initial setup.

1. Create a user administration account. This user only has privileges to manage users and roles, so you can use it to create other users that have permission to manage actual databases. (Details: https://docs.mongodb.com/manual/tutorial/enable-authentication/)

    `$ mongo --port 27017`

    ```js
    use admin
    db.createUser(
      {
        user: 'userAdmin',
        pwd: 'YOURPASSWORD',
        roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]
      }
    )
    ```

2. Restart mongod with auth
    `brew services restart mongod --auth`
3. Start a mongo shell with `userAdmin`
    `$ mongo --port 27017 -u "userAdmin" -p "YOURPASSWORD" --authenticationDatabase "admin"`

## Apps Not Installed Here
* Luminar
* Mamp Pro

## Some Important Files
* **Brewfile**: manifest for installing brew packages, cask apps, and MacOS App Store apps
* **home/.antigenrc**: config for installing zsh plugins, etc
* **home/.mackup/custom.cfg**: config for extra files to symlink from `~/dotfiles/home/` to `~/`


## Before wiping a drive

* Backup the whole thing. Duh.
* Dump local rethinkdb databases
* Dump local MySQL databases
* * Dump local mongodb databases

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
