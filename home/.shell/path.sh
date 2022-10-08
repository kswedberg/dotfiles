######## PATHS: EARLIER in path takes precedence ######

### Added by the Heroku Toolbelt
PATH="$(brew --prefix)/heroku/bin:$PATH"

# MAMP (if running rails app that requires mysql2 lib, put this before Homebrew libraries paths)
# PATH=/Applications/MAMP/Library/bin:$PATH

# For virtualenv:
# PATH=$(brew --prefix)/bin/python2.7:$PATH

# Homebrew libraries
PATH="$(brew --prefix)/sbin:$PATH"
PATH="$(brew --prefix)/bin:$PATH"
# PATH="$(brew --prefix homebrew/php/php70)/bin:$PATH"

# brew-installed libraries
PATH="$(brew --prefix)/opt/curl/bin:$PATH"
PATH="$(brew --prefix)/opt/imagemagick@7/bin:$PATH"

# Cargo: Rust package manager
PATH="$HOME/.cargo/bin:$PATH"

# golang
PATH=$PATH:$(brew --prefix)/opt/go/libexec/bin
PATH=$PATH:$(go env GOPATH)/bin

# Yarn
PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

# YARNPKG="$(which yarn)"
# if [[ "$(which yarn)" != "yarn not found" ]]; then
#   PATH="$(yarn global bin):$PATH"
# fi

# Project-specific NODE modules
PATH="./node_modules/.bin:$PATH"

# Project-specific Ruby gems
PATH="./bin:$PATH"

# DRUPAL
# PATH="$PATH:$HOME/Sites/drush"

# FONT CONVERTER STUFF
# PATH="$PATH:$HOME/bin/ttf2eot:$HOME/bin/font-converter"

# RBENV
# (No need to set this here, because ohmyzsh rbenv plugin loaded in .antigenrc is taking care of it)
# PATH=$HOME/.rbenv/bin:$PATH

# MY PATHS : make them come later so they don't accidentally override something critical
PATH="$PATH:$HOME/bin:$HOME/bin/tfs:$HOME/dotfiles"

# gnu commands added via homebrew...
PATH="$(brew --prefix)/opt/gnu-tar/libexec/gnubin:$PATH"
# PATH="$(brew --prefix)/opt/coreutils/libexec/gnubin:$PATH"
# MANPATH="$(brew --prefix)/opt/coreutils/libexec/gnuman:$MANPATH"

export PATH
