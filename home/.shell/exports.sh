# For `export PATH…`, see ./path.sh

# Prefer US English and use UTF-8
export LANG="en_US"
export LC_ALL="en_US.UTF-8"

export CLICOLOR=1

# Highlight section titles in manual pages
export LESS_TERMCAP_md="$ORANGE"

# Don’t clear the screen after quitting a manual page
export MANPAGER="less -X"

# Always enable colored `grep` output
export GREP_OPTIONS="--color=auto"

# Link Homebrew casks in `/Applications` rather than `~/Applications`
export HOMEBREW_CASK_OPTS="--appdir=/Applications"

# The place for hosting Git repos. Use this for private repos.
export GIT_HOSTING='git@github.com'

# Set my editor and git editor
# export EDITOR="subl"
export EDITOR="atom"
export GIT_EDITOR="vim"
export JEKYLL_EDITOR="atom"

export JIRA_URL="http://fusionary.jira.com"

# CORDOVA BUG requires Java 8 installed and this in path:
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_161.jdk/Contents/Home

# Set a couple paths for use elsewhere
export DOTFILES="$HOME/dotfiles"

# virtualenv
export WORKON_HOME=$HOME/.virtualenvs
export PIP_VIRTUALENV_BASE=$WORKON_HOME
export PIP_RESPECT_VIRTUALENV=true
if [ -f /Users/kswedberg/Library/Python/2.7/bin/virtualenvwrapper.sh ]
then
    source /Users/kswedberg/Library/Python/2.7/bin/virtualenvwrapper.sh
fi
