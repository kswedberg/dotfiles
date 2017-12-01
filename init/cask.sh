### Modified from https://github.com/mathiasbynens/dotfiles

# Install native apps
function installcask() {
  brew cask install "${@}" 2> /dev/null
}

# APPS ALREADY INSTALLED BY OTHER MEANS…
installcask dropbox
installcask firefox
installcask google-chrome
installcask iterm2
installcask 1password
installcask keybase

# APPS TO CONSIDER
# installcask google-chrome-canary
# installcask miro-video-converter
# installcask slowy
