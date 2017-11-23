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

# More recent versions of some OS X tools
brew tap homebrew/dupes
brew install homebrew/dupes/grep

# Bash 4
brew install bash

# PHP
brew tap homebrew/homebrew-php

brew install composer
brew install php-code-sniffer
brew install php-cs-fixer

# Install html5 tidy.
brew install tidy

# Network tools
brew install wget --enable-iri # wget with IRI support
brew install sshfs ## Binaries needed for `rmount` function
brew install ngrep # network grep
brew install httpie # More friendly cURL-like CLI using `http`

# brew install fuse4x (install os-x binary instead)

## GIT
# Need to install git without completions so git-extras completions will work for some reason
brew install git --without-completions
brew install git-extras
brew install hub
brew install ghi

## Oher useful binaries
brew install ack # find files
brew install rename # nice file renaming
brew install fzf # fast fuzzy finder
brew install tree
brew install zopfli
brew install couchdb

## Optional things to possibly install
# brew install exiv2
# brew install imagemagick
# brew install pigz
# brew install webkit2png

# Remove outdated versions from the cellar
brew cleanup
