# CDPATH=:$HOME/Sites

#Load a bunch o scripts
source $HOME/dotfiles/.path
source $HOME/dotfiles/.exports
source $HOME/dotfiles/.opts
source $HOME/dotfiles/.aliases
source $HOME/dotfiles/.jekyll
source $HOME/dotfiles/.inputrc
source $HOME/dotfiles/.extra
source $HOME/dotfiles/.functions

fpath=(
  $DOT_FILES/fn
  "${fpath[@]}"
)

autoload -Uz e
autoload -Uz keygen


#RBENV
eval "$(rbenv init -)"

# This loads NVM
[ -s $HOME/.nvm/nvm.sh ] && . $HOME/.nvm/nvm.sh


