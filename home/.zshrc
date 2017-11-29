ZSH=$HOME/.oh-my-zsh

# LOAD STUFF BEFORE oh-my-zsh

# oh my zsh
COMPLETION_WAITING_DOTS="true"
# DISABLE_UPDATE_PROMPT=true

autoload -U zmv

zstyle ':completion:*' use-cache yes
zmodload -F zsh/stat b:zstat

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm


# Load shell dotfiles **BEFPRE* oh-my-zsh
source $HOME/.shell/index.sh

# Antigen
source /usr/local/share/antigen/antigen.zsh
antigen init $HOME/.antigenrc

# Load RBENV
eval "$(rbenv init -)"

# LOAD STUFF ***AFTER*** oh-my-zsh

source $HOME/.shell-after/index.sh

unsetopt correct_all

# tabtab source for yarn package
# uninstall by removing these lines or running `tabtab uninstall yarn`
[[ -f /Users/kswedberg/.nvm/versions/node/v8.9.1/lib/node_modules/yarn-completions/node_modules/tabtab/.completions/yarn.zsh ]] && . /Users/kswedberg/.nvm/versions/node/v8.9.1/lib/node_modules/yarn-completions/node_modules/tabtab/.completions/yarn.zsh
