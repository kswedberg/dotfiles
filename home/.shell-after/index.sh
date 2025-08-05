[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

src_files=(
  completion.sh
  secrets.sh
  # spaceship-theme-options.sh
  zsh-theme.sh
)

function source_files() {
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

autoload -U compinit && compinit

fpath=(~/.shell-after/completions $fpath)
