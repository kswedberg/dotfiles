ZSH=$HOME/.oh-my-zsh

# LOAD STUFF BEFORE oh-my-zsh

# oh my zsh
COMPLETION_WAITING_DOTS="true"
# DISABLE_UPDATE_PROMPT=true

autoload -U zmv

zstyle ':completion:*' use-cache yes

# Don't use the bundler plugin.
# Can't use nvm plugin if using jshint in sublime text
# For SublimeLinter: Load nvm and rbenv in .zprofile (and symlink to ~/.zprofile)

# zsh-syntax-highlighting must come last in plugins list
plugins=(bower brew brew-cask capistrano docker emoji emoji-clock extract gem git-extras git-prompt git-remote-branch gnu-utils grunt jira nmap npm osx rbenv rsync ssh-agent web-search z zsh_reload zsh-syntax-highlighting)

# Load oh my zsh
source $ZSH/oh-my-zsh.sh

# LOAD STUFF ***AFTER*** oh-my-zsh
source $HOME/dotfiles/.source_after
# ZSH_THEME="pure"

unsetopt correct_all
