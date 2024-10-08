# For `export PATH…`, see ./path.sh

# Prefer US English and use UTF-8
export LANG="en_US"
export LC_ALL="en_US.UTF-8"

export CLICOLOR=1

export LESS=-RXFi
# Highlight section titles in manual pages
# export LESS_TERMCAP_md="$ORANGE"
# export LESS_TERMCAP_mb=$(printf "\e[1;31m")
# export LESS_TERMCAP_md=$(printf "\e[1;31m")
# export LESS_TERMCAP_me=$(printf "\e[0m")
# export LESS_TERMCAP_se=$(printf "\e[0m")
# export LESS_TERMCAP_so=$(printf "\e[1;44;33m")
# export LESS_TERMCAP_ue=$(printf "\e[0m")
# export LESS_TERMCAP_us=$(printf "\e[1;32m")

# Don’t clear the screen after quitting a manual page
export MANPAGER="less -X -M +Gg"

# Always enable colored `grep` output
export GREP_OPTIONS="--color=auto"

# Link Homebrew casks in `/Applications` rather than `~/Applications`
export HOMEBREW_CASK_OPTS="--appdir=/Applications"

# Style options for `bat` command (which I've aliased to `cat`)
export BAT_STYLE="header,changes"

# The place for hosting Git repos. Use this for private repos.
export GIT_HOSTING='git@github.com'

# navi (https://github.com/denisidoro/navi)
NAVI_PATH=$HOME/.navi/cheats

# Set my editor and git editor
# export EDITOR="subl"
# export EDITOR="atom"
export EDITOR="code"
export GIT_EDITOR="vim"
export JEKYLL_EDITOR="code"

# CORDOVA BUG requires Java 8 installed and this in path:
# export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_161.jdk/Contents/Home

# Set a couple paths for use elsewhere
export DOTFILES="$HOME/dotfiles"

# virtualenv
export WORKON_HOME=$HOME/.virtualenvs
export PIP_VIRTUALENV_BASE=$WORKON_HOME
export PIP_RESPECT_VIRTUALENV=true
