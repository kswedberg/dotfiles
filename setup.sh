#!/bin/sh

DOTFILES="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
red=`tput setaf 1`
reset=`tput sgr0`

# Install Homebrew if not already there
if [[ ! -f /usr/local/bin/brew ]]; then
  echo "Homebrew does not exist. Installing…"
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

# Install nvm if not already there
if [[ ! -d ~/.nvm ]]; then
  echo ".nvm does not exist. Installing…"
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
fi

# Install rbenv if not already there
if [[ ! -d ~/.rbenv ]]; then
  echo ".rbenv does not exist. Installing…"
  git clone https://github.com/rbenv/rbenv.git ~/.rbenv
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

# Install global Composer packages
composer global require laravel/installer

# Install global npm packages
source $DOTFILES/init/npm.sh

# Install Ruby Gems
source $DOTFILES/init/gem.sh

# Set some MacOS defaults
source $DOTFILES/init/macos.sh
