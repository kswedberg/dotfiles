#!/bin/sh

# Ask for the administrator password upfront
sudo -v

# Keep-alive: update existing `sudo` time stamp until `macos.sh` has finished
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &


DOTFILES="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
red=`tput setaf 1`
reset=`tput sgr0`

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
brew bundle

# Make ZSH the default shell environment
chsh -s $(which zsh)

# In case there is no .zshrc yet:
touch ~/.zshrc

source ~/.zshrc

# Python package
pip install virtualenvwrapper

# Symlink the Mackup config file to the home directory
ln -s ~/dotfiles/home/.mackup.cfg ~/

# Install nvm if not already there
if [[ ! -d ~/.nvm ]]; then
  echo ".nvm does not exist. Installing…"
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
fi

# Install latest node.js
nvm install node

# Install a "recent" Ruby version (as of 2017-12-01) and use it
# (rbenv was installed from homebrew with the brew bundle command above)
rbenv install 2.4.2
rbenv global 2.4.2

# Create default directory and set permissions for MongoDB
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db

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
