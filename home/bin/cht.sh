#!/bin/sh
#
## The only cheat sheet you need
##  / __| '_ \ / _ \/ _` | __| / __| '_ \ \ \     Unified access to the best
## | (__| | | |  __/ (_| | |_ _\__ \ | | |/ /     community driven documentation
## \___|_| |_|\___|\__,_|\__(_)___/_| |_/_/      repositories of the world
##
# [X] open section
# [X] one shot mode
# [X] usage info
# [X] dependencies check
# [X] help
# [X] yank/y/copy/c
# [X] Y/C
# [X] eof problem
# [X] more
# [X] stealth mode
#
# here are several examples for the stealth mode:
#
# zip lists
# list permutation
# random list element
# reverse a list
# read json from file
# append string to a file
# run process in background
# count words in text counter
# group elements list

__CHTSH_VERSION=4
__CHTSH_DATETIME="2018-07-08 22:26:46 +0200"

export LESSSECURE=1
STEALTH_MAX_SELECTION_LENGTH=5

case $(uname -s) in
Darwin)   is_macos=yes ;;
*)   is_macos=no ;;
esac

# for KSH93
if echo $KSH_VERSION | grep -q ' 93' && ! local foo 2>/dev/null; then
  alias local=typeset
fi

# any better test not involving either OS matching or actual query?
if [ $(uname -s) = OpenBSD ] && [ -x /usr/bin/ftp ]; then
  curl() {
    local opt args="-o -"
    while getopts "b:s" opt; do
      case $opt in
      b)   args="$args -c $OPTARG" ;;
      s)   args="$args -M -V" ;;
      *)
        echo "internal error: unsupported cURL option '$opt'" >&2
        exit 1
        ;;
      esac
    done
    shift $(($OPTIND - 1))
    /usr/bin/ftp $args "$@"
  }
fi

get_query_options() {
  local query="$*"
  if [ -n "$CHTSH_QUERY_OPTIONS" ]; then
    case $query in
    *\?*)     query="$query&${CHTSH_QUERY_OPTIONS}" ;;
    *)        query="$query?${CHTSH_QUERY_OPTIONS}" ;;
    esac
  fi
  printf "%s" "$query"
}

do_query() {
  local query="$*"
  local b_opts=
  local uri="https://cht.sh/\"\$(get_query_options $query)\""

  if [ -e "$HOME/.cht.sh/id" ]; then
    b_opts="-b \"\$HOME/.cht.sh/id\""
  fi

  eval curl $b_opts -s $uri >"$TMP1"

  if [ -z "$lines" ] || [ "$(wc -l "$TMP1" | awk '{print $1}')" -lt "$lines" ]; then
    cat "$TMP1"
  else
    ${PAGER:-$defpager} "$TMP1"
  fi
}

prepare_query() {
  local section="$1"
  shift
  local input="$1"
  shift
  local arguments="$1"

  local query
  if [ -z "$section" ] || [ x"${input}" != x"${input#/}" ]; then
    query=$(printf %s "$input" | sed 's@ @/@; s@ @+@g')
  else
    query=$(printf %s "$section/$input" | sed 's@ @+@g')
  fi

  [ -n "$arguments" ] && arguments="?$arguments"
  printf %s "$query$arguments"
}

get_list_of_sections() {
  curl -s https://cht.sh/:list | grep -v '/.*/' | grep '/$' | xargs
}

gen_random_str() (
  len=$1
  if command -v openssl >/dev/null; then
    openssl rand -base64 $(($len * 3 / 4)) | awk -v ORS='' //
  else
    rdev=/dev/urandom
    for d in /dev/{srandom,random,arandom}; do
      test -r $d && rdev=$d
    done
    if command -v hexdump >/dev/null; then
      hexdump -vn $(($len / 2)) -e '1/1 "%02X" 1 ""' $rdev
    elif command -v xxd >/dev/null; then
      xxd -l $(($len / 2)) -ps $dev | awk -v ORS='' //
    else
      cd /tmp
      s=
      while [ $(echo "$s" | wc -c) -lt $len ]; do
        s="$s$(mktemp -u XXXXXXXXXX)"
      done
      printf %.${len}s "$s"
    fi
  fi
)

if [ -e "$HOME"/.cht.sh/cht.sh.conf ]; then
  # shellcheck disable=SC1090,SC2002
  . "$HOME"/.cht.sh/cht.sh.conf
fi

if [ "$1" = --read ]; then
  read -r a || a=exit
  printf "%s\n" "$a"
  exit 0
elif [ x"$1" = x--help ] || [ -z "$1" ]; then
  cat <<EOF
Usage:

    ${0##*/} --help           show this help
    ${0##*/} #                show extended help
    ${0##*/} --shell [LANG]   shell mode (open LANG if specified)
    ${0##*/} QUERY            process QUERY and exit
EOF
  exit 0
elif [ x"$1" = x--shell ]; then
  shell_mode=yes
  shift
fi

prompt="cht.sh"

prompt="cht.sh"
opts=""
input=""
for o; do
  if [ x"$o" != x"${o#-}" ]; then
    opts="${opts}${o#-}"
  else
    input="$input $o"
  fi
done
query=$(echo "$input" | sed 's@ *$@@; s@^ *@@; s@ @/@; s@ @+@g')

if [ "$shell_mode" != yes ]; then
  curl -s https://cht.sh/"$(get_query_options "$query")"
  exit 0
else
  new_section="$1"
  valid_sections=$(get_list_of_sections)
  valid=no
  for q in $valid_sections; do
    [ "$q" = "$new_section/" ] && {
      valid=yes
      break
    }
  done

  if [ "$valid" = yes ]; then
    section="$new_section"
    this_query="$(echo "$input" | sed 's@ *[^ ]* *@@')"
    this_prompt="\033[0;32mcht.sh/$section>\033[0m "
  else
    this_query="$input"
    this_prompt="\033[0;32mcht.sh>\033[0m "
  fi
  if [ -n "$this_query" ] && [ -z "$CHEATSH_RESTART" ]; then
    printf "$this_prompt$this_query\n"
    curl -s https://cht.sh/"$(get_query_options "$query")"
  fi
fi

if [ "$is_macos" != yes ]; then
  command -v xsel >/dev/null || echo 'DEPENDENCY: please install "xsel" for "copy"' >&2
fi
command -v rlwrap >/dev/null || {
  echo 'DEPENDENCY: install "rlwrap" to use cht.sh in the shell mode' >&2
  exit 1
}
command -v curl >/dev/null || {
  echo 'DEPENDENCY: install "curl" to use cht.sh' >&2
  exit 1
}

mkdir -p "$HOME/.cht.sh/"
lines=$(tput lines)

if command -v less >/dev/null; then
  defpager="less -R"
elif command -v more >/dev/null; then
  defpager=more
else
  defpager=cat
fi

TMP1=$(mktemp /tmp/cht.sh.XXXXXXXXXXXXX)
trap 'rm -f $TMP1 $TMP2' EXIT
trap 'true' INT

if ! [ -e "$HOME/.cht.sh/.hushlogin" ] && [ -z "$this_query" ]; then
  echo "type 'help' for the cht.sh shell help"
fi

while true; do
  if [ "$section" != "" ]; then
    full_prompt="$prompt/$section> "
  else
    full_prompt="$prompt> "
  fi

  input=$(
    rlwrap -H "$HOME/.cht.sh/history" -pgreen -C cht.sh -S "$full_prompt" sh "$0" --read | sed 's/ *#.*//'
  )

  case "$input" in
  '?' | h | help)
    cat <<EOF
help    - show this help
hush    - do not show the 'help' string at start anymore
cd LANG - change the language context
copy    - copy the last answer in the clipboard (aliases: yank, y, c)
ccopy   - copy the last answer w/o comments (cut comments; aliases: cc, Y, C)
exit    - exit the cheat shell (aliases: quit, ^D)
id [ID] - set/show an unique session id ("reset" to reset, "remove" to remove)
stealth - stealth mode (automatic queries for selected text)
update  - self update (only if the scriptfile is writeable)
version - show current cht.sh version
/:help  - service help
QUERY   - space ceparated query staring (examples are below)
              cht.sh> python zip list
              cht.sh/python> zip list
              cht.sh/go> /python zip list
EOF
    continue
    ;;
  hush)
    mkdir   -p $HOME/.cht.sh/ && touch $HOME/.cht.sh/.hushlogin && echo "Initial 'use help' message was disabled"
    continue
    ;;
  cd)
    section=""
    continue
    ;;
  "cd "*)
    new_section=$(  echo "$input" | sed 's/cd  *//; s@/*$@@; s@^/*@@')
    if [ -z "$new_section" ] || [ ".." = "$new_section" ]; then
      section=""
    else
      valid_sections=$(  get_list_of_sections)
      valid=no
      for q in $valid_sections; do
        [ "$q" = "$new_section/" ] && {
          valid=yes
          break
        }
      done
      if [ "$valid" = no ]; then
        echo "Invalid section: $new_section"
        echo "Valid sections:"
        echo $valid_sections | xargs printf "%-10s\n" | tr ' ' .  | xargs -n 10 | sed 's/\./ /g; s/^/  /'
        continue
      else
        section="$new_section"
      fi
    fi
    continue
    ;;
  exit | quit)
    break
    ;;
  copy | yank | c | y)
    if [ -z "$DISPLAY" ]; then
      echo copy: supported only in the Desktop version
      continue
    fi
    if [ -z "$input" ]; then
      echo copy: Make at least one query first.
      continue
    else
      curl -s https://cht.sh/"$(get_query_options "$query"?T)" >"$TMP1"
      if [ "$is_macos" != yes ]; then
        xsel -i <"$TMP1"
      else
        cat "$TMP1" | pbcopy
      fi
      echo "copy: $(wc -l "$TMP1" | awk '{print $1}') lines copied to the selection"
      continue
    fi
    ;;
  ccopy | cc | C | Y)
    if [ -z "$DISPLAY" ]; then
      echo copy: supported only in the Desktop version
      continue
    fi
    if [ -z "$input" ]; then
      echo copy: Make at least one query first.
      continue
    else
      curl -s https://cht.sh/"$(get_query_options "$query"?TQ)" >"$TMP1"
      if [ "$is_macos" != yes ]; then
        xsel -i <"$TMP1"
      else
        cat "$TMP1" | pbcopy
      fi
      echo "copy: $(wc -l "$TMP1" | awk '{print $1}') lines copied to the selection"
      continue
    fi
    ;;
  id | "id "*)
    id_file="$HOME/.cht.sh/id"

    if [ id = "$input" ]; then
      new_id=""
    else
      new_id=$(  echo "$input" | sed 's/id  *//; s/ *$//; s/ /+/g')
    fi
    if [ "$new_id" = remove ]; then
      if [ -e "$id_file" ]; then
        rm -f -- "$id_file" && echo "id is removed"
      else
        echo "id was not set, so you can't remove it"
      fi
      continue
    fi
    if [ -n "$new_id" ] && [ reset != "$new_id" ] && [ $(/bin/echo -n "$new_id" | wc -c) -lt 16 ]; then
      echo "ERROR: $new_id: Too short id. Minimal id length is 16. Use 'id reset' for a random id"
      continue
    fi
    if [ -z "$new_id" ]; then
      # if new_id is not specified check if we have some id already
      # if yes, just show it
      # if not, generate a new id
      if [ -e "$id_file" ]; then
        echo $(awk '$6 == "id" {print $NF}' <"$id_file" | tail -n 1)
        continue
      else
        new_id=reset
      fi
    fi
    if [ "$new_id" = reset ]; then
      new_id=$(  gen_random_str 12)
    else
      echo WARNING: if someone gueses your id, he can read your cht.sh search history
    fi
    if [ -e "$id_file" ] && grep -q '\tid\t[^\t][^\t]*$' "$id_file" 2>/dev/null; then
      sed -i 's/\tid\t[^\t][^\t]*$/ id '"$new_id"'/' "$id_file"
    else
      if ! [ -e "$id_file" ]; then
        printf '#\n\n' >"$id_file"
      fi
      printf ".cht.sh\tTRUE\t/\tTRUE\t0\tid\t$new_id\n" >>"$id_file"
    fi
    echo "$new_id"
    continue
    ;;
  stealth | "stealth "*)
    if   [ "$input" != stealth ]; then
      arguments=$(    echo "$input" | sed 's/stealth //; s/ /\&/')
    fi
    trap   break INT
    if   [ "$is_macos" = yes ]; then
      past=$(    pbpaste)
    else
      past=$(    xsel -o)
    fi
    printf   "\033[0;31mstealth:\033[0m you are in the stealth mode; select any text in any window for a query\n"
    printf   "\033[0;31mstealth:\033[0m selections longer than $STEALTH_MAX_SELECTION_LENGTH words are ignored\n"
    if   [ -n "$arguments" ]; then
      printf   "\033[0;31mstealth:\033[0m query arguments: ?$arguments\n"
    fi
    printf   "\033[0;31mstealth:\033[0m use ^C to leave this mode\n"
    while   true; do
      if   [ "$is_macos" = yes ]; then
        current=$(    pbpaste)
      else
        current=$(    xsel -o)
      fi
      if [ "$past" != "$current" ]; then
        past=$current
        current_text="$(    echo $current | tr -c '[a-zA-Z0-9]' ' ')"
        if   [ $(echo $current_text | wc -w) -gt "$STEALTH_MAX_SELECTION_LENGTH" ]; then
          echo   "\033[0;31mstealth:\033[0m selection length is longer than $STEALTH_MAX_SELECTION_LENGTH words; ignoring"
          continue
        else
          printf "\n\033[0;31mstealth: \033[7m $current_text\033[0m\n"
          query=$(prepare_query "$section" "$current_text" "$arguments")
          do_query "$query"
        fi
      fi
      sleep   1
    done
    trap   - INT
    continue
    ;;
  update)
    [   -w "$0" ] || {
      echo "The script is readonly; please update manually: curl -s https://cht.sh/:bash | sudo tee $0"
      continue
    }
    TMP2=$(  mktemp /tmp/cht.sh.XXXXXXXXXXXXX)
    curl -s https://cht.sh/:cht.sh >"$TMP2"
    if ! cmp "$0" "$TMP2" >/dev/null  2>&1; then
      if grep -q ^__CHTSH_VERSION= "$TMP2"; then
        # section was vaildated by us already
        args="--shell $section"
        cp "$TMP2" "$0" && echo "Updated. Restarting..." && rm "$TMP2" && CHEATSH_RESTART=1 exec "$0" $args
      else
        echo "Something went wrong. Please update manually"
      fi
    else
      echo "cht.sh is up to date. No update needed"
    fi
    rm -f "$TMP2" >/dev/null  2>&1
    continue
    ;;
  version)
    insttime=$(  ls -l -- "$0" | sed 's/  */ /g' | cut -d ' ' -f 6-8)
    echo "cht.sh version $__CHTSH_VERSION of $__CHTSH_DATETIME; installed at: $insttime"
    TMP2=$(  mktemp /tmp/cht.sh.XXXXXXXXXXXXX)
    if curl -s https://cht.sh/:cht.sh >"$TMP2"; then
      if ! cmp "$0" "$TMP2" >/dev/null  2>&1; then
        echo "Update needed (type 'update' for that)".
      else
        echo "Up to date. No update needed"
      fi
    fi
    rm -f "$TMP2" >/dev/null  2>&1
    continue
    ;;
  "")
    continue
    ;;
  esac

  query=$(prepare_query "$section" "$input")
  do_query "$query"
done
