
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
}

add-zsh-hook precmd karl_precmd

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
if [[ $USER == "root" ]]; then
  CARETCOLOR="red"
else
  CARETCOLOR="white"
fi

ZSH_THEME_GIT_PROMPT_PREFIX="[%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="] %{$reset_color%}"

ZSH_THEME_GIT_PROMPT_DIRTY=" %{$fg[red]%}✗%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_CLEAN=" %{$fg[green]%}✔%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_ADDED="%{$fg[yellow]%}✚"
ZSH_THEME_GIT_PROMPT_MODIFIED="%{$fg[yellow]%}⚑"
ZSH_THEME_GIT_PROMPT_DELETED="%{$fg[red]%}✖"
ZSH_THEME_GIT_PROMPT_RENAMED="%{$fg[blue]%}▴"
ZSH_THEME_GIT_PROMPT_UNMERGED="%{$fg[red]%}§"
ZSH_THEME_GIT_PROMPT_UNTRACKED="%{$fg[cyan]%}◒"

PROMPT='
${KARL_CURRENT_TIME_} ${KARL_OPEN_ANGLE}rb '"${rvm_ruby}"'${KARL_CLOSE_ANGLE} [%{$fg[cyan]%}node `node -v`%{$reset_color%}] ${current_dir}
$(git_prompt_info)${KARL_PRE_STATUS}$(git_prompt_status)${KARL_POST_STATUS}${KARL_POST_GIT}%{${fg[$CARETCOLOR]}%}❯ %{${reset_color}%}'

# RPROMPT='[`node -v`]'
