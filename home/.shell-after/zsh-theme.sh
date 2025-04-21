# My elements:
KARL_CURRENT_TIME_="%{$fg[white]%}%{$fg[yellow]%}%W %t%{$fg[white]%}%{$reset_color%}"
KARL_OPEN_ANGLE="%{$fg[white]%}‹%{$fg[red]%}"
KARL_CLOSE_ANGLE="%{$fg[white]%}›%{$reset_color%}"

function karl_precmd() {
  KARL_PRE_STATUS=""
  KARL_POST_STATUS=""
  KARL_POST_GIT="%{$reset_color%}"
  karl_virtualenv=""

#   if which git_prompt_status &>/dev/null; then
#     gitstatus=$(git_prompt_status)
#     if [ ${#gitstatus} != 0 ]; then
#       KARL_PRE_STATUS="( "
#       KARL_POST_STATUS=" %{$reset_color%})"
#     fi

#     git=$(git_prompt_info)
#     if [ ${#git} != 0 ]; then
#       KARL_POST_GIT=" %{$reset_color%}
# "
#     fi
#   fi

  if which virtualenv_prompt_info &>/dev/null; then
    karl_virtualenv=$(virtualenv_prompt_info)
  fi
  # local IN_RMOUNT_PATH=`echo "${PWD}" | grep "${RMOUNT_DIR}"`
  PATHCOLOR="%{$reset_color%}"

  if [[ $USER == "root" ]]; then
    CARETCOLOR="red"
  else
    CARETCOLOR="white"
  fi

  local user_host='%{$terminfo[bold]$fg[green]%}%n@%m%{$reset_color%}'
  current_dir='%~'

  local rvm_ruby=''
  if which rbenv &>/dev/null; then
    rvm_ruby="\${\$(rbenv version | sed -e 's/ (set.*$//' -e 's/^ruby-//')}"
  else
    if which rvm-prompt &>/dev/null; then
      rvm_ruby='%{$fg[red]%}$(rvm-prompt i v g)%{$reset_color%}'
    fi
  fi

  local node_version='?'
  if which node &>/dev/null; then
    node_version="$(node -v)"
  fi


  ZSH_THEME_GIT_PROMPT_PREFIX="[%{$reset_color%}"
  ZSH_THEME_GIT_PROMPT_SUFFIX="] %{$reset_color%}"

  ZSH_THEME_GIT_PROMPT_DIRTY=" %{$fg[red]%}✗%{$reset_color%}"
  ZSH_THEME_GIT_PROMPT_CLEAN=" %{$fg[green]%}✔%{$reset_color%}"
  ZSH_THEME_GIT_PROMPT_CHANGED="%{$fg[yellow]%}%{~%G%}"
  ZSH_THEME_GIT_PROMPT_DELETED="%{$fg[red]%}%{-%G%}"
  ZSH_THEME_GIT_PROMPT_BRANCH="%{$fg_bold[magenta]%}"
  ZSH_THEME_GIT_PROMPT_UNTRACKED="%{$fg[green]%}✚"
  ZSH_THEME_GIT_PROMPT_AHEAD="%{$fg[cyan]%}⇡"
  ZSH_THEME_GIT_PROMPT_BEHIND="%{$fg[cyan]%}⇣"
  ZSH_THEME_GIT_PROMPT_DIVERGED="%{$fg[yellow]%}⚑"

  # local KS_VIRTUAL_ENV_PROMPT = ''
  # if [[ -n ${VIRTUAL_ENV} ]]; then
  #   KS_VIRTUAL_ENV_PROMPT = ''
  # else
  #   KS_VIRTUAL_ENV_PROMPT = "${ZSH_THEME_VIRTUALENV_PREFIX:=[}${VIRTUAL_ENV:t}${ZSH_THEME_VIRTUALENV_SUFFIX:=]}"
  # fi

  NODE_ICON=$'\U2B22'
  RUBY_ICON=$'\U2B18'

  PROMPT='
  ${KARL_CURRENT_TIME_} ${karl_virtualenv} ${KARL_OPEN_ANGLE}${RUBY_ICON} '"${rvm_ruby}"'${KARL_CLOSE_ANGLE} [%{$fg[green]%}${NODE_ICON} '"${node_version}"'%{$reset_color%}]${PATHCOLOR} ${current_dir}
  %{$reset_color%}$(git_super_status)${KARL_POST_GIT}%{${fg[$CARETCOLOR]}%}❯ %{$reset_color%}'
  # $(git_prompt_info)${KARL_PRE_STATUS}$(git_prompt_status)${KARL_POST_STATUS}${KARL_POST_GIT}%{${fg[$CARETCOLOR]}%}❯ %{${reset_color}%}'
  # RPROMPT='[`node -v`]'
  RPROMPT=''
}

if [[ $TERM_PROGRAM != "WarpTerminal" ]]; then

  # Remove `add-zsh-hook precmd karl_precmd` in favor of `precmd_function+=(...)`
  # cf https://github.com/robbyrussell/oh-my-zsh/issues/748#issuecomment-37862691
  precmd_functions+=(karl_precmd)
fi
