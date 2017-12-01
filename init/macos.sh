#!/usr/bin/env bash

###############################################################################
# Commands to use as-needed
###############################################################################

# Set Help Viewer windows to non-floating mode
# defaults write com.apple.helpviewer DevMode -bool true

# Show hard drives on desktop
# defaults write com.apple.finder ShowHardDrivesOnDesktop -bool true

# Finder: show hidden files by default
# defaults write com.apple.finder AppleShowAllFiles -bool true

# Finder: show all filename extensions
# defaults write NSGlobalDomain AppleShowAllExtensions -bool true


###############################################################################
# Commands for initial setup
###############################################################################

echo ""
echo "About to change ALL of the MacOS settings to those in dotfiles/init/macos.sh"
echo "Are you sure you want to do this? [y/N]"
read CONFIRMMACOS

if [ "$CONFIRMMACOS" = "y" ]; then
  echo "OK. You were warned!"

  # Ask for the administrator password upfront
  sudo -v

  # Keep-alive: update existing `sudo` time stamp until `macos.sh` has finished
  while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

  ######################################
  # General UI/UX
  ######################################

  # Always show scrollbars
  defaults write NSGlobalDomain AppleShowScrollBars -string "Always"
  # Possible values: `WhenScrolling`, `Automatic` and `Always`

  # Expand save panel by default
  defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true

  # Expand print panel by default
  defaults write NSGlobalDomain PMPrintingExpandedStateForPrint -bool true

  # Automatically quit printer app once the print jobs complete
  defaults write com.apple.print.PrintingPrefs "Quit When Finished" -bool true


  ######################################
  # Trackpad, mouse, keyboard, $ input
  ######################################

  # Enable full keyboard access for all controls
  # (e.g. enable Tab in modal dialogs)
  defaults write NSGlobalDomain AppleKeyboardUIMode -int 3

  # Use scroll gesture with the Ctrl (^) modifier key to zoom
  defaults write com.apple.universalaccess closeViewScrollWheelToggle -bool true
  defaults write com.apple.universalaccess HIDScrollZoomModifierMask -int 262144
  # Follow the keyboard focus while zoomed in
  defaults write com.apple.universalaccess closeViewZoomFollowsFocus -bool true

  # Disable press-and-hold for keys in favor of key repeat
  defaults write NSGlobalDomain ApplePressAndHoldEnabled -bool false

  # Set a fast keyboard repeat rate
  defaults write NSGlobalDomain KeyRepeat -int 1

  # Disable smart quotes as they’re annoying when typing code
  defaults write NSGlobalDomain NSAutomaticQuoteSubstitutionEnabled -bool false
  # Disable automatic capitalization as it’s annoying when typing code
  defaults write NSGlobalDomain NSAutomaticCapitalizationEnabled -bool false

  ######################################
  # Screenshots
  ######################################

  # Save screenshots in PNG format (other options: BMP, GIF, JPG, PDF, TIFF)
  defaults write com.apple.screencapture type -string "png"

  # Disable shadow in screenshots
  defaults write com.apple.screencapture disable-shadow -bool true

  ######################################
  # Finder
  ######################################

  # Show icons for hard drives, servers, and removable media on the desktop
  defaults write com.apple.finder ShowExternalHardDrivesOnDesktop -bool true
  defaults write com.apple.finder ShowMountedServersOnDesktop -bool true
  defaults write com.apple.finder ShowRemovableMediaOnDesktop -bool true

  # Finder: show status bar
  defaults write com.apple.finder ShowStatusBar -bool true

  # Finder: show path bar
  defaults write com.apple.finder ShowPathbar -bool true

  # Disable the warning when changing a file extension
  defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false

  # Enable spring loading for directories
  # defaults write NSGlobalDomain com.apple.springing.enabled -bool true

  # Avoid creating .DS_Store files on network volumes
  defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true

  # Use column view in all Finder windows by default
  # Four-letter codes for the other view modes:
  # icon view`icnv`
  # coverflow view: `Flwv`
  # list view: Nlsv
  defaults write com.apple.finder FXPreferredViewStyle -string "clmv"

  # Enable AirDrop over Ethernet and on unsupported Macs running Lion
  defaults write com.apple.NetworkBrowser BrowseAllInterfaces -bool true

  # Show the ~/Library folder
  chflags nohidden ~/Library

  ######################################
  # Dock
  ######################################

  # Automatically hide and show the Dock
  defaults write com.apple.dock autohide -bool true

  ######################################
  # Time Machine
  ######################################

  # Prevent Time Machine from prompting to use new hard drives as backup volume
  defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool true

  # Disable local Time Machine backups
  hash tmutil &> /dev/null && sudo tmutil disablelocal

  ######################################
  # SSD-specific tweaks
  ######################################

  # Disable hibernation (speeds up entering sleep mode)
  sudo pmset -a hibernatemode 0

  # Remove the sleep image file to save disk space
  sudo rm /private/var/vm/sleepimage
  # Create a zero-byte file instead…
  sudo touch /private/var/vm/sleepimage
  # …and make sure it can’t be rewritten
  sudo chflags uchg /private/var/vm/sleepimage

  ######################################
  # Safari & WebKit
  ######################################

  # Enable Safari’s debug menu
  defaults write com.apple.Safari IncludeInternalDebugMenu -bool true

  # Make Safari’s search banners default to Contains instead of Starts With
  defaults write com.apple.Safari FindOnPageMatchesWordStartsOnly -bool false

  # Enable the Develop menu and the Web Inspector in Safari
  defaults write com.apple.Safari IncludeDevelopMenu -bool true
  defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true
  defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled -bool true

  # Add a context menu item for showing the Web Inspector in web views
  defaults write NSGlobalDomain WebKitDeveloperExtras -bool true

  ######################################
  # Terminal
  ######################################

  # Enable Secure Keyboard Entry in Terminal.app
  # See: https://security.stackexchange.com/a/47786/8918
  defaults write com.apple.terminal SecureKeyboardEntry -bool true

  # Disable the annoying line marks
  defaults write com.apple.Terminal ShowLineMarks -int 0

  ######################################
  # Kill affected applications
  ######################################

  for app in "Dock" "Finder" "Safari" "SystemUIServer" "Transmission"; do
    killall "${app}" > /dev/null 2>&1
  done
  echo "Done. Note that some of these changes require a logout/restart to take effect."

else
  echo "Okay, not gonna do it"

fi
