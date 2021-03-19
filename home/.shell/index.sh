function source_files() {
  for file in "${@}"; do
    src_file=$HOME/.shell/${file}
    if [[ -f $src_file ]]; then
      source $src_file
    else
      echo "$src_file does not exist"
    fi
  done
}

# These files get sourced BEFORE $ZSH/oh-my-zsh.sh
src_files=(
  path.sh
  exports.sh
  aliases.sh
  autoloads.sh
  functions.sh
  # nvm_load.sh
  opts.sh
  secrets.sh
)

source_files ${src_files}

unset src_files

# [ -r "$file" ] && [ -f "$file" ] && source "$file"
# for file in $HOME/.shell/{exports,path}.sh; do
#   [ -r "$file" ] && [ -f "$file" ] && source "$file"
# done
# unset file
