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


# Install other useful binaries
brew install ack
#brew install exiv2
# brew install git
brew install hub
#brew install imagemagick
# brew install node
# brew install pigz
brew install rename
brew install tree
# brew install webkit2png
brew install zopfli

# Remove outdated versions from the cellar
brew cleanup
