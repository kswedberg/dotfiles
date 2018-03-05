# this file sourced in ./.source_after

# setopt autocd
## Command history configuration
# if [ -z "$HISTFILE" ]; then
#     HISTFILE=$HOME/.zsh_history
# fi
#
# HISTSIZE=10000
# SAVEHIST=10000
#
# # Show history
# case $HIST_STAMPS in
#   "mm/dd/yyyy") alias history='fc -fl 1' ;;
#   "dd.mm.yyyy") alias history='fc -El 1' ;;
#   "yyyy-mm-dd") alias history='fc -il 1' ;;
#   *) alias history='fc -l 1' ;;
# esac

setopt append_history
setopt extended_history
setopt hist_expire_dups_first
setopt hist_ignore_dups # ignore duplication command history list
setopt hist_ignore_space
setopt hist_verify

# Don't beep on errors
setopt no_beep

# Case-insensitive globbing (used in pathname expansion)
setopt no_case_glob

unsetopt inc_append_history

# Turn off shared history between tabs:

# unsetopt share_history
