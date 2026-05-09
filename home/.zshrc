ZSH=$HOME/.oh-my-zsh
HOMEBREW=$(brew --prefix)
# Some OMZ plugins rely on this
if [[ -z "$ZSH_CACHE_DIR" ]]; then
  ZSH_CACHE_DIR="$ZSH/cache"
fi

COMPLETION_WAITING_DOTS="true"
# DISABLE_UPDATE_PROMPT=true

autoload -U zmv

zstyle ':completion:*' use-cache yes
zmodload -F zsh/stat b:zstat

# eval "$(/opt/homebrew/bin/brew shellenv)"
eval "$(${HOMEBREW}/bin/brew shellenv)"

# Load shell dotfiles **BEFORE* oh-my-zsh
source $HOME/.shell/index.sh

# Antigen (loads oh-my-zsh and others). Antigen and many OMZ plugins assume unset
# parameters are readable; define this before sourcing so `setopt nounset` never
# errors on $ANTIGEN_AUTO_CONFIG (see antigen.zsh ~line 19).
export ANTIGEN_AUTO_CONFIG="${ANTIGEN_AUTO_CONFIG:-true}"
() {
  # Do not use `emulate -L zsh` here: it enables local_options, so `setopt prompt_subst`
  # from oh-my-zsh would be scoped to this function and the prompt would print literally.
  local nounset_was="${options[nounset]}"
  [[ ${nounset_was} == on ]] && unsetopt nounset
  source "${HOMEBREW}/share/antigen/antigen.zsh"
  antigen init "${HOME}/.antigenrc"
  [[ ${nounset_was} == on ]] && setopt nounset
}

# Load RBENV [don't need to load it here because ohmyzsh rbenv plugin in .antigenrc is taking care of it ]
# eval "$(rbenv init -)"

# LOAD STUFF ***AFTER*** oh-my-zsh
source $HOME/.shell-after/index.sh

unsetopt correct_all

###-tns-completion-start-###
if [ -f /Users/kswedberg/.tnsrc ]; then
  source /Users/kswedberg/.tnsrc
fi
###-tns-completion-end-###

# From https://github.com/mathiasbynens/dotfiles
if which brew &>/dev/null  && [ -r "$(brew --prefix)/etc/profile.d/bash_completion.sh" ]; then
  # Ensure existing Homebrew v1 completions continue to work
  export BASH_COMPLETION_COMPAT_DIR="$(brew --prefix)/etc/bash_completion.d"
  source "$(brew --prefix)/etc/profile.d/bash_completion.sh"
elif [ -f /etc/bash_completion ]; then
  source /etc/bash_completion
fi

# Add tab completion for SSH hostnames based on ~/.ssh/config, ignoring wildcards
[ -e "$HOME/.ssh/config" ] && complete -o "default" -o "nospace" -W "$(grep "^Host" ~/.ssh/config | grep -v "[?*]" | cut -d " " -f2- | tr ' ' '\n')" scp sftp ssh

# Add tab completion for 1Password
eval "$(op completion zsh)"; compdef _op op

# tabtab source for yarn package
# uninstall by removing these lines or running `tabtab uninstall yarn`

test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# Completions for lla
fpath=(~/.zsh/completions $fpath)

# pnpm
export PNPM_HOME="$HOME/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

# fnm
FNM_PATH="/opt/homebrew/opt/fnm/bin"
if [ -d "$FNM_PATH" ]; then
  eval "`fnm env`"
fi
