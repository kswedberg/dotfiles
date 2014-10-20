#!/usr/bin/env bash

### Modified from https://github.com/mathiasbynens/dotfiles

# Make sure we’re using the latest Homebrew
brew update

# Upgrade any already-installed formulae
brew upgrade

# For some rails app
# brew install qt

# GNU core utilities (those that come with OS X are outdated)
brew install coreutils
echo "Don’t forget to add $(brew --prefix coreutils)/libexec/gnubin to \$PATH."
# GNU `find`, `locate`, `updatedb`, and `xargs`, g-prefixed
brew install findutils

# Bash 4
brew install bash

# Composer (PHP package manager)
brew tap josegonzalez/homebrew-php
brew install josegonzalez/php/composer

# wget with IRI support
brew install wget --enable-iri

# More recent versions of some OS X tools
brew tap homebrew/dupes
brew install homebrew/dupes/grep

# Install html5 tidy. Eventually, won't need the --HEAD part
brew install --HEAD tidy

## Binaries needed for `rmount` function
brew install sshfs
# brew install fuse4x (install os-x binary instead)

## GITHUB
brew install hub
brew install ghi
## Oher useful binaries
brew install ack
brew install rename
brew install tree
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
