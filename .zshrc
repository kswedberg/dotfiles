# Path to your oh-my-zsh configuration.
ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
ZSH_THEME="karl"
source $HOME/.profile


# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Uncomment following line if you want to disable command autocorrection
# DISABLE_CORRECTION="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
COMPLETION_WAITING_DOTS="true"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
plugins=(bower brew bundler cap extract gem git git-remote-branch gnu-utils grunt npm nvm osx pip rake rbenv ruby ssh-agent z)

# Load oh-my-zsh
source $ZSH/oh-my-zsh.sh

#Load a bunch o scripts
source $HOME/dotfiles/.exports
source $HOME/dotfiles/.opts
source $HOME/dotfiles/.aliases
source $HOME/dotfiles/.jekyll
source $HOME/dotfiles/.inputrc
source $HOME/dotfiles/.extra
source $HOME/dotfiles/.functions



# Customize to your needs...
export PATH=$PATH:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin
