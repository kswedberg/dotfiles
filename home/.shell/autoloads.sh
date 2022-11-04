
# cdpath all lowercase, so set as array:
cdpath=(
  $HOME
  $HOME/Sites
  "${fpath[@]}"
)

# AUTO LOAD files in dotfiles/fn when first called
fpath=(
  $HOME/dotfiles/fn
  "${fpath[@]}"
)
autoload -Uz ${fpath[1]}/*(:t)

if type brew &>/dev/null
then
  FPATH="$(brew --prefix)/share/zsh/site-functions:${FPATH}"
fi
