ZSH=$HOME/.oh-my-zsh

# LOAD STUFF BEFORE oh-my-zsh
source $HOME/.profile

# oh my zsh
COMPLETION_WAITING_DOTS="true"
# DISABLE_UPDATE_PROMPT=true
# not in tim's: brew composer gnu-utils npm bower
# plugins=(bower capistrano jira rbenv bundler extract gem git git-remote-branch grunt nvm osx ssh-agent z)

zstyle ':completion:*' use-cache yes

plugins=(bundler bower npm nvm jira rsync rbenv capistrano extract gem git ssh-agent git-remote-branch gnu-utils grunt web-search z)

# Load oh my zsh
source $ZSH/oh-my-zsh.sh

# if [[ -f config/deploy.rb || -f Capfile ]]; then
#   if [[ ! -f .cap_tasks~ || config/deploy.rb -nt .cap_tasks~ ]]; then
#     echo "\nGenerating .cap_tasks~..." > /dev/stderr
#     cap -v --tasks | grep '#' | cut -d " " -f 2 > .cap_tasks~
#   fi
#   compadd `cat .cap_tasks~`
# fi


# LOAD STUFF ***AFTER*** oh-my-zsh
source $HOME/dotfiles/.source_after

unsetopt correct_all
