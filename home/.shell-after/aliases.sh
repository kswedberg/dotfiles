# this file sourced in ./.source_after

# DEFAULT EDITOR
# alias e="subl"
# alias e.="subl ."

# No longer using ↑ here
# INSTEAD...
#
# SET EDITOR="..." IN .exports AND
# DEFINE e() FUNCTION IN dotfiles/fn/e

# usage for "sa" on command line:
# 1: alias foo="bar"
# 2: sa
# alias sa="alias > ~/dotfiles/.aliases"

# Caddy Server
alias caddyserve="sudo caddy -conf ~/Caddyfile"

# TextMate
alias m="mate"
alias m.="mate ."
alias tmbundles='cd ~/Library/Application\ Support/TextMate/Bundles/'

# Sublime Text 2
alias sb="subl"

# Micro
alias mi="micro"

# OPEN files/projects in default editor
# Also, see ./fn/e file
alias dotfiles="$EDITOR -n $DOTFILES $ZSH"
alias zshconfig="$EDITOR -n ~/.zshrc"
alias ohmyzsh="$EDITOR -n ~/.oh-my-zsh"
alias aliases="$EDITOR -n ~/dotfiles/.aliases"

# SourceTree
alias st="/Applications/SourceTree.app/Contents/Resources/stree"

# PostGreSQL
alias startpg="pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start"

# File Manipulation (rename multiple files mmv stands for multiple move)
alias mmv='noglob zmv -W'

# Dir navigation
alias ....='cd ../../..'

## These are handled by ohmyzsh
# alias ..='cd ..'
# alias ...='cd ../..'

alias ls="ls"

# -l    use a long listing format
# -A    almost-all: do not list implied . and ..
# -s    print the allocated size of each file, in blocks
# -h    with -l and/or -s, print human readable sizes (e.g., 1K 234M 2G)
# -b    print C-style escapes for nongraphic characters
# p     append / indicator to directories
alias ll="ls -lAshbp"
alias lll="stat -c '%A %a (%F) %n' *"
alias lo="ls -alh --color | awk '{k=0;for(i=0;i<=8;i++)k+=((substr(\$1,i+2,1)~/[rwx]/)*2^(8-i));if(k)printf(\" %0o \",k);print}'"
# alias lo="stat -c '%A %a %h %U %G %s %y %n' *| sed 's/\.[[:digit:]]\+[ ]\+-[[:digit:]]\+/ /'"
alias sites='cd ~/Sites'
alias sties='cd ~/Sites'

# gulp shipit
alias gsdeploy="gulp shipit -r deploy"
alias gsdb="gulp shipit -r db:pull"
alias gsass="gulp shipit -r assets:pull"
alias gsapp="gulp shipit -r app:pull"

# doing (http://brettterpstra.com/projects/doing/)
alias d="doing"
alias dd="doing done"
alias dn="doing now"
alias dt="doing today"
alias dy='d yesterday | cut -d " " -f 2- | sed -e "s/^/ /"'
alias idea="doing now -s Ideas"

# yarn
alias y="yarn"
alias yap="yarn add"
alias yad="yarn add --dev"
alias yae="yarn add --exact"
alias yi="yarn install"
alias yip="yarn install --production"
alias yrm="yarn remove"

# DOCKER
# (PROJECT-SPECIFIC DOCKER aliases are in .extra)
alias dmstart="docker-machine start default"
alias dmstop="docker-machine stop default"
# Get ip address of docker machine
alias dmip="docker-machine ip default"

# Build a docker image based on a Dockerfile in current dir
# And do it after every `git pull` because gems might change
alias dcb="docker-compose build"

# start the built image
alias dcu="docker-compose up"

# stop the built image
alias dcd="docker-compose down"

# run a one-off command in the container
alias dcr="docker-compose run"

# "transient run" removes the container after it finishes.
alias dctr="docker-compose run --rm"

# NPM
alias nr="npm run"
alias nid="npm install -D"
alias nis="npm install -S"
alias npmls="npm ls --depth=0"
alias npmlsg="npm ls -g --depth=0"

# capistrano / rails
alias capd='cap deploy'
alias bers='bundle exec rails server'
alias beu='bundle exec unicorn -E local -c config/unicorn.rb'
alias dbm='rake db:migrate'
alias ss='./script/server'
alias sc='./script/console'

# compass
alias cc="compass compile"
alias cw="compass watch"
alias cwh="compass watch httpdocs/compass"

# sass
alias sassw="sass --watch --style expanded"
alias sassu="sass --update --style expanded"

# git
alias stash="git stash"
alias stashp="git stash pop"
alias stashl="git stash list"
alias stasha="git stash apply"
alias stashc="git stash clear"

alias gitst='git status -sb'
alias gitlog="git log --pretty='format:%C(cyan)%h%Cgreen %ad %C(yellow)%an %Creset%s'"
# alias gitlog='git log --oneline --decorate'
alias gitpull='git pull --rebase'
alias gitpush='git push'
alias gitdiff='git diff | e'
alias gitbr='git branch'
alias pullall="git submodule foreach git pull origin master"
alias push\?="git cherry -v origin"
# alias grm="git status | grep deleted | awk '{print \$3}' | xargs git rm"
# alias changelog='git log `git log -1 --format=%H -- changelog*`; cat changelog*'


############### Miscellaneous ###############


# Quick way to rebuild the Launch Services database and get rid
# of duplicates in the Open With submenu.
alias fixopenwith='/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user && killall Finder'

alias gr='grunt'
alias gp='gulp'
# alias lg='legit'
alias tailphp='tail -f /Applications/MAMP/logs/php_error.log'
alias profile='e ~/.zprofile'

# use `src` function from zsh_reload plugin instead.
# alias src='source ~/.zshrc'

alias showhidden="defaults write com.apple.finder AppleShowAllFiles TRUE; killall Finder"
alias hidehidden="defaults write com.apple.finder AppleShowAllFiles FALSE; killall Finder"

# Show/Hide all desktop icons (useful when presenting)
alias hidedesktop="defaults write com.apple.finder CreateDesktop -bool false && killall Finder"
alias showdesktop="defaults write com.apple.finder CreateDesktop -bool true && killall Finder"

# Open Google Chrome with benchmarking enabled
alias chromebench='open -a "Google Chrome" --args --enable-benchmarking'

# Open Google Chrome, disabling web security
alias chromed="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security --allow-running-insecure-content --user-data-dir"

# Empty the Trash on all mounted volumes and the main HDD
# Also, clear Apple’s System Logs to improve shell startup speed
 alias emptytrash="sudo rm -rfv /Volumes/*/.Trashes; sudo rm -rfv ~/.Trash; sudo rm -rfv /private/var/log/asl/*.asl"

# alias c9="~/bin/cloud9.sh"

# MAC Address shortcuts for re-upping those "30 minutes free Wifi" in airports
# Change to a random mac address
alias random_mac='sudo ifconfig en0 ether `openssl rand -hex 6 | sed "s/\(..\)/\1:/g; s/.$//"`'
#Restore to original mac address
# Should it be 10:9a:dd:58:fd:fc ?
alias restore_mac='sudo ifconfig en0 ether 10:9a:dd:ad:82:5e'

# Utilities
alias dl="du -h -d 1"
alias df="df -h"
alias weather='curl http://wttr.in/'
# alias g="git"
alias grep='GREP_COLOR="1;37;41" LANG=C grep --color=auto'
alias h="history"
alias sniff="sudo ngrep -d 'en0' -t '^(GET|POST) ' 'tcp and port 80'"
alias httpdump="sudo tcpdump -i en0 -n -s 0 -w - | grep -a -o -E \"Host\: .*|GET \/.*\""
alias flushdns="dscacheutil -flushcache"
alias flush="dscacheutil -flushcache"
alias remoteip="curl -s http://checkip.dyndns.com/ | sed 's/[^0-9\.]//g'"
alias localip="ipconfig getifaddr en0"
alias ip="echo external: && remoteip && echo local: && localip"
