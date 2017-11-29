[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

src_files=(
  aliases.sh
  autoloads.sh
  completion-pm2.sh
  extra.sh
  functions.sh
  nvm_load.sh
  opts.sh
  zsh-theme.sh
)

function source_files {
  for file in "${@}"; do
    src_file=$HOME/.shell-after/${file}
    if [[ -f $src_file ]]; then
      source $src_file
    else
      echo "$src_file does not exist"
    fi
  done
}

source_files $src_files

unset src_files
