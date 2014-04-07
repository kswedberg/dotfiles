#!/usr/bin/env bash

### Modified from https://github.com/mathiasbynens/dotfiles

# Make sure we’re using the latest Homebrew
brew update

# Upgrade any already-installed formulae
brew upgrade

# Install GNU core utilities (those that come with OS X are outdated)
brew install coreutils
echo "Don’t forget to add $(brew --prefix coreutils)/libexec/gnubin to \$PATH."
# Install GNU `find`, `locate`, `updatedb`, and `xargs`, g-prefixed
brew install findutils

# Install Bash 4
brew install bash

# Install Composer (PHP package manager)
brew tap josegonzalez/homebrew-php
brew install josegonzalez/php/composer

# Install wget with IRI support
brew install wget --enable-iri

# Install more recent versions of some OS X tools
brew tap homebrew/dupes
brew install homebrew/dupes/grep

# Install html5 tidy. Eventually, won't need the --HEAD part
brew install --HEAD tidy

### Install other useful binaries

brew install ack
brew install hub
brew install rename
brew install tree
# brew install fuse4x (install os-x binary instead)
brew install sshfs
brew install zopfli
brew install couchdb

## Optional things to possibly install
# brew install exiv2
# brew install git ##
# brew install imagemagick
# brew install node ## use nvm instead
# brew install pigz
# brew install webkit2png

# Remove outdated versions from the cellar
brew cleanup
