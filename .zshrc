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

# Custom theme copied into .oh-my-zsh/custom/themes
# https://github.com/bhilburn/powerlevel9k
# source .powerline-theme

# zsh-syntax-highlighting must come last in plugins list
plugins=(bower brew brew-cask capistrano composer docker docker-compose extract gem git-extras git-prompt git-remote-branch gnu-utils gulp nmap npm osx rbenv rsync ssh-agent web-search z zsh_reload zsh-syntax-highlighting)

# Load oh my zsh
source $ZSH/oh-my-zsh.sh

# LOAD STUFF ***AFTER*** oh-my-zsh

# $DOTFILES is set in .exports
source $DOTFILES/.source_after

# Personal theme needs to be set after oh-my-zsh to take advantage of it
source .zsh-theme

unsetopt correct_all
