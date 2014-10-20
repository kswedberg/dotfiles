
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

# Load NVM
# do it here instead of nvm bundle because of some SublimeLinter issue
[ -s $HOME/.nvm/nvm.sh ] && . $HOME/.nvm/nvm.sh

# Load RBENV
eval "$(rbenv init -)"

# Defeat node errors for max open files
# http://ghickman.co.uk/2012/02/25/extending-os-x-lions-maxfiles-limit-for-neo4j.html
# launchctl limit maxfiles 16384 32768

zmodload -F zsh/stat b:zstat

# {{{
# Node Completion - Auto-generated, do not touch.
# shopt -s progcomp
# for f in $(command ls ~/.node-completion); do
#   f="$HOME/.node-completion/$f"
#   test -f "$f" && . "$f"
# done
# }}}
