# oh-my-zsh git-prompt defines precmd_update_git_vars with `[ -n "$__EXECUTED_GIT_COMMAND" ]`,
# which errors under `setopt nounset`. Redefine using expansions that tolerate unset keys.
if (( ${+functions[precmd_update_git_vars]} )); then
  function precmd_update_git_vars() {
    if [[ -n ${__EXECUTED_GIT_COMMAND-} ]] || [[ -z ${ZSH_THEME_GIT_PROMPT_CACHE-} ]]; then
      update_current_git_vars
      unset __EXECUTED_GIT_COMMAND
    fi
  }
fi
