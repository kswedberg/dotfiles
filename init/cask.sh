### Modified from https://github.com/mathiasbynens/dotfiles

# After first time, comment next 2 lines
brew tap phinze/homebrew-cask
brew install brew-cask

# Install native apps
function installcask() {
  brew cask install "${@}" 2> /dev/null
}

installcask cheat-sheet
installcask clip-menu
# installcask controlplane
# installcask dropbox
# installcask firefox
installcask flip4mac
installcask gitx-l
# installcask google-chrome
installcask google-chrome-canary
installcask handbrake
installcask hip-chat
# installcask imagealpha
# installcask imageoptim
installcask integrity
# installcask iterm2
# installcask livereload
# installcask macvim
installcask miro-video-converter
installcask name-changer
# installcask nv-alt
# installcask one-password
installcask p4merge
# installcask plex-media-server
installcask sequel-pro
# installcask skitch
installcask skype
installcask slate
installcask slowy
# installcask sitesucker
installcask sonos
installcask sparrow
# installcask spotify
# installcask sublime-text
# installcask sublime-text-3
installcask super-duper
# installcask textexpander
# installcask total-finder
installcask transmit
installcask the-unarchiver
# installcask virtualbox
installcask vlc
installcask vmware-fusion
