#!/bin/sh

function setup() {
  echo "\nThis script runs a number of commands to set up a new Mac. Do you want to continue? (y/n)"
  read DOIT

  if [ "$DOIT" != "y" ]; then
    echo "Okay. Aborting setup script. Bye!"
    return
  fi
  # Ask for the administrator password upfront
  sudo -v

  # Keep-alive: update existing `sudo` time stamp until `setup.sh` has finished
  while true; do
    sudo -n true
    sleep 60
    kill -0 "$$" || exit
  done 2>/dev/null &

  DOTFILES="$( cd "$( dirname "${BASH_SOURCE[0]}")"  && pwd)"
  red=$(tput setaf 1)
  reset=$(tput sgr0)

  #### HOMEBREW
  # Install Homebrew if not already there
  if [[ ! -f /usr/local/bin/brew ]]; then
    echo "Homebrew does not exist. Installing…"
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  fi

  # Update Homebrew recipes
  brew update

  # Install all Homebrew dependencies with bundle (See Brewfile)
  brew tap homebrew/bundle
  brew bundle -v

  # Make ZSH the default shell environment
  chsh -s $(which zsh)

  # Create some unsourced files if they don't already exist:
  touch "$DOTFILES/home/.gitconfig.secrets"
  touch "$DOTFILES/home/.shell/secrets.sh"
  touch "$DOTFILES/home/.shell-after/secrets.sh"
  # In case there is no .zshrc yet:
  touch ~/.zshrc

  source ~/.zshrc

  # Python package
  pip install virtualenvwrapper

  # Symlink the Mackup config file to the home directory
  ln -s ~/dotfiles/home/.mackup.cfg ~/

  # Install nvm if not already there
  if [[ ! -d ~/.nvm ]]; then
    echo "nvm does not exist. Installing…"
    export NVM_DIR="$HOME/.nvm" && (
      git clone https://github.com/nvm-sh/nvm.git "$NVM_DIR"
      cd "$NVM_DIR"
      git checkout $(git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1))
    ) && \. "$NVM_DIR/nvm.sh"
  fi

  # Install latest LTS node.js
  nvm install --lts

  # Install a "recent" Ruby version (as of 2017-12-01) and use it
  # (rbenv was installed from homebrew with the brew bundle command above)
  rbenv install 2.4.2
  rbenv global 2.4.2

  # Create default directory and set permissions for MongoDB
  sudo mkdir -p /data/db
  sudo chown -R $(id -un) /data/db

  echo "\nDo you want launchd to start mongodb now and restart at login? (y/n)"
  read CONFIRM

  if [ "$CONFIRM" = "y" ]; then
    brew services start mongodb
    echo "mongodb added to launchd"
  else
    echo "Okay. To run mongodb on your own… "
    echo "$ mongod --config /usr/local/etc/mongod.conf"
  fi

  # Install global Composer packages
  composer global require laravel/installer

  # Set some MacOS defaults
  # source $DOTFILES/init/macos.sh

  echo "All done!"

  echo "\nConsider running the setup2.sh script as well"
}

setup
