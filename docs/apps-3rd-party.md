# Third-party Apps

## QuickLook Applets

* Open `~/Library/Quicklook/` in Finder (probably using ⌘⇧G)
* For each quicklook applet, right-click and choose Show Package Contents
* Navigate to `Contents/MacOS/` and double-click the file in there.
* When the Confirmation prompt appears, click ok

## Sequel Ace

* Old machine: Export connections (bottom left statusbar item) to `~/Documents/Settings/Sequel Ace`
* New machine: Import connections from same place

## elasticvue

* Export/back up config from old machine and import into new

## SSH Tunnel Manager

* Note to self: See connections in Notes.app

## iTerm

### General Preferences

* Open Preferences
* In General pane, select Preferences
* Check "Load preferences from a custom folder…"
* Choose a folder (e.g. ~/Dropbox/Settings)
* Quit iTerm
* Open iTerm and go back into Preferences > General > Preferences
* Check "Save changes to folder when iTerm2 quits

### Profiles

* On old machine:
  * Open Preferences > Profiles
  * Click "Other Actions…" below the list of profiles
  * Choose "Save All Profiles" as JSON
* On new machine:
  * Open Preferences > Profiles
  * Click "Other Actions…" below the list of profiles
  * Choose "Import JSON Profiles" and select the file you saved above



## Others to copy from ~/Library

### ~/Library/Application Support

* Dash
* Insomnia
* Transmit


### ~/Library/Preferences

* com.kapeli.dashdoc.plist
* com.sequelpro.SequelPro.plist
* com.panic.Transmit.plist
