ZSH=$HOME/.oh-my-zsh

# Some OMZ plugins rely on this
if [[ -z "$ZSH_CACHE_DIR" ]]; then
  ZSH_CACHE_DIR="$ZSH/cache"
fi

COMPLETION_WAITING_DOTS="true"
# DISABLE_UPDATE_PROMPT=true

autoload -U zmv

zstyle ':completion:*' use-cache yes
zmodload -F zsh/stat b:zstat

# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

eval "$(/opt/homebrew/bin/brew shellenv)"
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"

# Load shell dotfiles **BEFORE* oh-my-zsh
source $HOME/.shell/index.sh

# Antigen (loads oh-my-zsh and others)
source /opt/homebrew/share/antigen/antigen.zsh
antigen init $HOME/.antigenrc

# Load RBENV
# eval "$(rbenv init -)"

# LOAD STUFF ***AFTER*** oh-my-zsh
source $HOME/.shell-after/index.sh

unsetopt correct_all

# From https://github.com/mathiasbynens/dotfiles
if which brew &> /dev/null && [ -r "$(brew --prefix)/etc/profile.d/bash_completion.sh" ]; then
  # Ensure existing Homebrew v1 completions continue to work
  export BASH_COMPLETION_COMPAT_DIR="$(brew --prefix)/etc/bash_completion.d";
  source "$(brew --prefix)/etc/profile.d/bash_completion.sh";
elif [ -f /etc/bash_completion ]; then
  source /etc/bash_completion;
fi;

# Add tab completion for SSH hostnames based on ~/.ssh/config, ignoring wildcards
[ -e "$HOME/.ssh/config" ] && complete -o "default" -o "nospace" -W "$(grep "^Host" ~/.ssh/config | grep -v "[?*]" | cut -d " " -f2- | tr ' ' '\n')" scp sftp ssh;

# tabtab source for yarn package
# uninstall by removing these lines or running `tabtab uninstall yarn`
# [[ -f /Users/kswedberg/.nvm/versions/node/v10.9.0/lib/node_modules/yarn-completions/node_modules/tabtab/.completions/yarn.zsh ]] && . /Users/kswedberg/.nvm/versions/node/v10.9.0/lib/node_modules/yarn-completions/node_modules/tabtab/.completions/yarn.zsh

test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
