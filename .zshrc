ZSH=$HOME/.oh-my-zsh

# LOAD STUFF BEFORE oh-my-zsh
source $HOME/.profile

# oh my zsh
COMPLETION_WAITING_DOTS="true"
# DISABLE_UPDATE_PROMPT=true

zstyle ':completion:*' use-cache yes

# don't use the bundler plugin.
# Can't use nvm plugin if using jshint in sublime text
plugins=(bower npm jira rsync rbenv capistrano extract gem git git-remote-branch gnu-utils grunt ssh-agent web-search z)

# Load oh my zsh
source $ZSH/oh-my-zsh.sh

# LOAD STUFF ***AFTER*** oh-my-zsh
source $HOME/dotfiles/.source_after

unsetopt correct_all

### Added by the Heroku Toolbelt
export PATH="/usr/local/heroku/bin:$PATH"
