#!/bin/bash

# this file sourced in ./.source_after

# For use in other functions/scripts
function about {
  echo "$1"
}
function example {
  echo "\nExample usage:"
  echo "\t$1"
}

reload() {
  exec $SHELL -l
}

help() {

  setopt sh_word_split
  echo 'What type of help do you want? Pick a number and press Return'
  list="man tldr cht.sh"
  select var in $list; do
    unsetopt sh_word_split
    if [ x"$var" != x"" ]; then
      export COLUMNS=99
      case $var in
        "man")
          echo "$(man "$@")"
          break
          ;;
        "tldr")
          echo "$(tldr "$@")"
          break
          ;;
        "cht.sh")
          echo "$(cht.sh "$@")"
          break
          ;;
      esac

    return
    fi
  done

  # MAN=$(env man "$@")
  # TLDR=$(tldr "$@")
  # less $MAN
  # echo $TLDR
}
# copy
# If argument passed, cat the file and pipe through copy
#   …otherwise, pipe stdin into copy.
# Finally, paste to stdout
copy() {
  if [ -t 0 ]; then
    cat $@ | pbcopy
  else
    pbcopy < /dev/stdin
  fi
  echo "\nCopied to your clipboard:\n"
  pbpaste
}

# Alias paste to pbpaste
alias paste=pbpaste

# fkill - find process using fuzzy finder and kill it
fkill() {
  local pid
  pid=$(ps -ef | sed 1d | fzf -m | awk '{print $2}')

  if [ "x$pid" != "x" ]
  then
    echo $pid | xargs kill -${1:-9}
  fi
}

#url encode the passed string
urlenc () {
  echo -n "$@" | perl -pe's/([^-_.~A-Za-z0-9])/sprintf("%%%02X", ord($1))/seg'
}

### Following functions modified from https://github.com/mathiasbynens/dotfiles

# Create a .tar.gz archive, using `zopfli`, `pigz` or `gzip` for compression
function targz() {
  local tmpFile="${@%/}.tar"
  tar -cvf "${tmpFile}" --exclude=".DS_Store" "${@}" || return 1

  size=$(
    stat -f"%z" "${tmpFile}" 2> /dev/null; # OS X `stat`
    stat -c"%s" "${tmpFile}" 2> /dev/null # GNU `stat`
  )

  local cmd=""
  if (( size < 52428800 )) && hash zopfli 2> /dev/null; then
    # the .tar file is smaller than 50 MB and Zopfli is available; use it
    cmd="zopfli"
  else
    if hash pigz 2> /dev/null; then
      cmd="pigz"
    else
      cmd="gzip"
    fi
  fi

  echo "Compressing .tar using \`${cmd}\`…"
  "${cmd}" -v "${tmpFile}" || return 1
  [ -f "${tmpFile}" ] && rm "${tmpFile}"
  echo "${tmpFile}.gz created successfully."
}

# Determine size of a file or total size of a directory
function fs() {
  # if du -b /dev/null > /dev/null 2>&1; then
  #   local arg=-sbh
  # else
  #   local arg=-sh
  # fi
  if [[ -n "$@" ]]; then
    du -- "$@"
  else
    du .[^.]* *
  fi
}

# Used in gz() function below
function _readsie() {
  num=$2
  if [[ $num -gt "1024" ]]; then
    ret="$(($num / 1024)) Kb"
  else
    ret="$num bytes"
  fi

  echo "$1: $ret"
}

# Compare original and gzipped file size
function gz() {
  local files=($@)
  for file in $files; do
    if [[ -f "$file" ]]; then
      local origsize=$(wc -c < "$file")
      local gzipsize=$(gzip -c "$file" | wc -c)
      local ratio=$(echo "$gzipsize * 100/ $origsize" | bc -l)

      echo "\n${file}:"
      echo "\t`_readsie "orig" $origsize`"
      printf "\t`_readsie "gzip" $gzipsize` (%2.2f%%)" "$ratio"
      echo ""
    fi
  done
}

# # `m` with no arguments opens the current directory in TextMate, otherwise
# # opens the given location
# function m() {
#   if [ $# -eq 0 ]; then
#     mate .
#   else
#     mate "$@"
#   fi
# }


# `o` with no arguments opens current directory, otherwise opens the given
# location
function o() {
  if [ $# -eq 0 ]; then
    open .
  else
    open "$@"
  fi
}

# `tre` is a shorthand for `tree` with hidden files and color enabled, ignoring
# the `.git` directory, listing directories first. The output gets piped into
# `less` with options to preserve color and line numbers, unless the output is
# small enough for one screen.
function tre() {
  tree -aC -I '.git|node_modules|bower_components' --dirsfirst "$@" | less -FRNX
}

# Test whether a Homebrew formula is already installed
# $1 - formula name (may include options)
formula_exists() {
  if ! `brew list $1 >/dev/null`; then
    e_warning "Missing formula: $1"
    return 1
  fi

  echo $1 "already installed."
  return 0
}
