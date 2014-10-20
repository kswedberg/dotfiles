ZSH=$HOME/.oh-my-zsh

# LOAD STUFF BEFORE oh-my-zsh
source $HOME/.zprofile

# oh my zsh
COMPLETION_WAITING_DOTS="true"
# DISABLE_UPDATE_PROMPT=true

zstyle ':completion:*' use-cache yes

# Don't use the bundler plugin.
# Can't use nvm plugin if using jshint in sublime text
# For SublimeLinter: Load nvm and rbenv in .zprofile (and symlink to ~/.zprofile)

plugins=(bower npm jira rsync rbenv capistrano extract gem git git-extras git-remote-branch github gnu-utils grunt ssh-agent web-search z zsh_reload)

# Load oh my zsh
source $ZSH/oh-my-zsh.sh

# LOAD STUFF ***AFTER*** oh-my-zsh
source $HOME/dotfiles/.source_after
# ZSH_THEME="pure"

unsetopt correct_all

### Added by the Heroku Toolbelt
export PATH="/usr/local/heroku/bin:$PATH"
