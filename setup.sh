#!/bin/sh

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

# Install a few other apps that I forgot to do via Homebrew last time. Doh!
source $DOTFILES/init/cask.sh

# Make ZSH the default shell environment
chsh -s $(which zsh)

source ~/.zshrc

# Install nvm if not already there
if [[ ! -d ~/.nvm ]]; then
  echo ".nvm does not exist. Installing…"
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
fi

# Install latest node.js
nvm install node

# Install global npm packages
source $DOTFILES/init/npm.sh

# Install a "recent" Ruby version (as of 2017-12-01) and use it
rbenv install 2.4.2
rbenv global 2.4.2

# Install Ruby Gems
source $DOTFILES/init/gem.sh

# Install global Composer packages
composer global require laravel/installer

# Set some MacOS defaults
source $DOTFILES/init/macos.sh

echo "All done!"
