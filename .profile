
function source_files {
  for file in "${@}"; do
    src_file=$HOME/dotfiles/${file}
    if [[ -f $src_file ]]; then
      source $src_file
    else
      echo "$src_file does not exist"
    fi
  done
}

# These files get sourced BEFORE $ZSH/oh-my-zsh.sh

src_files=(
  .path
  .exports
)

source_files ${src_files}

# Load RBENV
eval "$(rbenv init -)"

# Load NVM (no need. done in nvm bundle)
# [ -s $HOME/.nvm/nvm.sh ] && . $HOME/.nvm/nvm.sh

