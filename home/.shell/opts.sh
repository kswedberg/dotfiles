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
setopt hist_ignore_all_dups

setopt hist_ignore_space
setopt hist_verify

# Don't beep on errors
setopt no_beep

# Allow tabs to share history.
# Shouldn't have to set this explicitly, but something else must be unsetting it
setopt share_history

# Case-insensitive globbing (used in pathname expansion)
setopt no_case_glob

# Turn off shared history between tabs:
# unsetopt inc_append_history
