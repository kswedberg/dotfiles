
# My elements:
KARL_CURRENT_TIME_="%{$fg[white]%}%{$fg[yellow]%}%W %t%{$fg[white]%}%{$reset_color%}"
KARL_OPEN_ANGLE="%{$fg[white]%}‹%{$fg[red]%}"
KARL_CLOSE_ANGLE="%{$fg[white]%}›%{$reset_color%}"

function karl_precmd {
  KARL_PRE_STATUS=""
  KARL_POST_STATUS=""
  gitstatus=$(git_prompt_status)
  if [ ${#gitstatus} != 0 ]; then
    KARL_PRE_STATUS="( "
    KARL_POST_STATUS=" %{$reset_color%})"
  fi

  KARL_POST_GIT="%{$reset_color%}"
  git=$(git_prompt_info)
  if [ ${#git} != 0 ]; then
    KARL_POST_GIT=" %{$reset_color%}
"
  fi

  local IN_RMOUNT_PATH=`echo "${PWD}" | grep "${RMOUNT_DIR}"`
  PATHCOLOR="%{$reset_color%}"
  if [[ -n "${IN_RMOUNT_PATH}" ]]; then
    PATHCOLOR="%{${fg[red]}%}"
  fi
}

# Remove `add-zsh-hook precmd karl_precmd` in favor of `precmd_function+=(...)`
# cf https://github.com/robbyrussell/oh-my-zsh/issues/748#issuecomment-37862691
precmd_functions+=(karl_precmd)

if [[ $USER == "root" ]]; then
  CARETCOLOR="red"
else
  CARETCOLOR="white"
fi

local user_host='%{$terminfo[bold]$fg[green]%}%n@%m%{$reset_color%}'
current_dir='%~'

local rvm_ruby=''
if which rvm-prompt &> /dev/null; then
  rvm_ruby='%{$fg[red]%}$(rvm-prompt i v g)%{$reset_color%}'
else
  if which rbenv &> /dev/null; then
   rvm_ruby="\${\$(rbenv version | sed -e 's/ (set.*$//' -e 's/^ruby-//')}"
  fi
fi


ZSH_THEME_GIT_PROMPT_PREFIX="[%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="] %{$reset_color%}"

ZSH_THEME_GIT_PROMPT_DIRTY=" %{$fg[red]%}✗%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_CLEAN=" %{$fg[green]%}✔%{$reset_color%}"

ZSH_THEME_GIT_PROMPT_UNTRACKED="%{$fg[cyan]%}✚"
ZSH_THEME_GIT_PROMPT_AHEAD="%{$fg[cyan]%}⇡"
ZSH_THEME_GIT_PROMPT_BEHIND="%{$fg[cyan]%}⇣"
ZSH_THEME_GIT_PROMPT_DIVERGED="%{$fg[yellow]%}⚑"

PROMPT='
${KARL_CURRENT_TIME_} ${KARL_OPEN_ANGLE}rb '"${rvm_ruby}"'${KARL_CLOSE_ANGLE} [%{$fg[cyan]%}node `node -v`%{$reset_color%}]${PATHCOLOR} ${current_dir}
$(git_super_status)${KARL_POST_GIT}%{${fg[$CARETCOLOR]}%}❯ %{${reset_color}%}'
# $(git_prompt_info)${KARL_PRE_STATUS}$(git_prompt_status)${KARL_POST_STATUS}${KARL_POST_GIT}%{${fg[$CARETCOLOR]}%}❯ %{${reset_color}%}'
# RPROMPT='[`node -v`]'
RPROMPT=''
