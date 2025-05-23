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

alias python="python3"
####
#### OVERRIDE standard shell commands
####
alias du="ncdu --color dark -rr"

# For "bat" styles, see BAT_STYLE line in exports.sh
alias cat="bat"

alias top="sudo htop"
alias diff="icdiff"

alias 7z="7zz"

# Caddy Server
alias caddyserve="ulimit -n 8192 && caddy start -config ~/Caddyfile"

# TextMate
# alias m="mate"
# alias m.="mate ."
alias tmbundles='cd ~/Library/Application\ Support/TextMate/Bundles/'

# OPEN files/projects in default editor
# Also, see ./fn/e file
alias zshconfig="$EDITOR -n ~/.zshrc"
alias ohmyzsh="$EDITOR -n ~/.oh-my-zsh"
alias aliases="$EDITOR -n ~/dotfiles/home/.shell/aliases.sh"
alias brewfile="$EDITOR -n ~/dotfiles/Brewfile"

# Create a lowercase UUID
alias uuid="uuidgen | tr '[:upper:]' '[:lower:]'"

# SourceTree
alias st="/Applications/SourceTree.app/Contents/Resources/stree"

# PostGreSQL
alias startpg="pg_ctl -D $HOMEBREW/var/postgres -l $HOMEBREW/var/postgres/server.log start"

# File Manipulation (rename multiple files mmv stands for multiple move)
alias mmv='noglob zmv -W'

# Dir navigation
alias ..="cd ../"
alias ...="cd ../../"
alias ....='cd ../../..'
alias .....='cd ../../../..'

# Command-line JavaScript
alias jsc="/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc"
# Directory Listings
#
# use coreutils `gls` if possible…
hash gls >/dev/null 2>&1 || alias gls="ls"

# always use color, even when piping (to awk,grep,etc)
if gls --color >/dev/null  2>&1; then colorflag="--color"; else colorflag="-G"; fi
export CLICOLOR_FORCE=1

# -l    use a long listing format
# -A    almost-all: do not list implied . and ..
# -s    print the allocated size of each file, in blocks
# -h    with -l and/or -s, print human readable sizes (e.g., 1K 234M 2G)
# -b    print C-style escapes for nongraphic characters
# p     append / indicator to directories

alias ls='gls -Aphb ${colorflag} --group-directories-first'
# alias ll='ls -lAshbp'

# ll alias here sets the command to the autoloading "ll" file in dotfiles/fn/
# The alias is needed here to override the oh-my-zsh `ll` alias
alias ll="ll"

alias sites='cd ~/Sites'
alias sties='cd ~/Sites'

# doing (http://brettterpstra.com/projects/doing/)
alias d="doing"
alias dd="doing done"
alias dn="doing now"
alias dt="doing today"
alias dy='d yesterday | cut -d " " -f 2- | sed -e "s/^/ /"'
alias idea="doing now -s Ideas"

# DOCKER
# `daliases` function is in .shell-after/secrets.sh so as not to pollute common files
# (PROJECT-SPECIFIC DOCKER aliases are in .shell-after/extra.sh)
alias dsp="docker system prune -a"
alias dps="docker ps -a"
# DOCKER MACHINE
alias dmstart="docker-machine start default"
alias dmstop="docker-machine stop default"
# Get ip address of docker machine
alias dmip="docker-machine ip default"

# DOCKER COMPOSE
# Build a docker image based on a Dockerfile in current dir
# And do it after every `git pull` because gems might change
alias dcb="docker compose --progress plain build"

# start the built image
alias dcu="docker compose --progress plain up --watch"

# start the built image and get terminal back
alias dcud="docker compose --progress plain up -d --watch"

# start the built image but FORCE A RECREATE first
alias dcuf="docker compose --progress plain up -V --force-recreate --watch"

# restart a built image (can be followed by name)
alias dcrs="docker compose --progress plain restart"

# stop the built image
alias dcd="docker compose down"

alias dcl="docker compose logs --follow"

# run a one-off command in the container
alias dcr="docker compose run"

# "transient run" removes the container after it finishes.
alias dctr="docker compose run --rm"
alias dcrt="docker compose run --rm"

# View running docker processes
alias dcps="docker compose ps"

# Execute a command within the docker container
# e.g. dce container_name npm install
alias dce="docker compose exec"

###############
### Node Package Managers

# NPM
alias nr="npm run"
alias nid="npm install -D"
alias nis="npm install -S"
alias npmls="npm ls --depth=0"
alias npmlsg="npm ls -g --depth=0"
# npm-check-updates
alias ncu="ncu -i --format group,ownerChanged"
alias nup="ncu -i --format group,ownerChanged"

# yarn
alias y="yarn"
alias yap="yarn add"
alias yad="yarn add --dev"
alias yae="yarn add --exact"
alias yi="yarn install"
alias yip="yarn install --production"
alias yrm="yarn remove"
alias yup="yarn upgrade-interactive"

# pnpm
alias p="pnpm"
alias pa="pnpm add"
alias pap="pnpm add"
alias pad="pnpm add --save-dev"
alias pi="pnpm install"
alias prm="pnpm remove"
alias pt="pnpm test"
alias pu="pnpm update -i"
alias pup="pnpm update -i"

###############

# compass
alias cc="compass compile"
alias cw="compass watch"
alias cwh="compass watch httpdocs/compass"

# sass
alias sassw="sass --watch --style expanded"
alias sassu="sass --update --style expanded"

# git
alias stash="git stash push"
alias stashp="git stash pop"
alias stashl="git stash list"
alias stasha="git stash apply"
alias stashd="git stash drop"
alias stashc="git stash clear"
alias stashs="git stash show -pu"

alias gitst='git status -sb'
alias gitlog="git log --pretty='format:%C(cyan)%h%Cgreen %ad %C(yellow)%an %Creset%s'"
# alias gitlog='git log --oneline --decorate'
alias gitpull='git pull --rebase'
alias gitpush='git push'
alias gitdiff='git diff | e -'
alias gitbr='git branch'
alias pullall="git submodule foreach git pull origin master"
alias push\?="git cherry -v"
# alias grm="git status | grep deleted | awk '{print \$3}' | xargs git rm"
# alias changelog='git log `git log -1 --format=%H -- changelog*`; cat changelog*'

############### Miscellaneous ###############

# Quick way to rebuild the Launch Services database and get rid
# of duplicates in the Open With submenu.
alias fixopenwith='/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user && killall Finder'

alias gr='grunt'
alias gp='gulp'
alias tailphp='tail -f /Applications/MAMP/logs/php_error.log'

alias src='source ~/.zshrc > /dev/null && echo "reloaded ~/.zshrc" '

alias hiddenshow="defaults write com.apple.finder AppleShowAllFiles TRUE; killall Finder"
alias showhidden="defaults write com.apple.finder AppleShowAllFiles TRUE; killall Finder"
alias hiddenhide="defaults write com.apple.finder AppleShowAllFiles FALSE; killall Finder"
alias hidehidden="defaults write com.apple.finder AppleShowAllFiles FALSE; killall Finder"

alias random="node -e \"process.stdout.write(require('crypto').randomBytes(8).toString('hex'))"\"

# Show/Hide all desktop icons (useful when presenting)
alias hidedesktop="defaults write com.apple.finder CreateDesktop -bool false && killall Finder"
alias showdesktop="defaults write com.apple.finder CreateDesktop -bool true && killall Finder"

# Open Google Chrome with benchmarking enabled
alias chromebench='open -a "Google Chrome" --args --enable-benchmarking'

# Open Google Chrome, disabling web security
alias chromed="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security --allow-running-insecure-content --user-data-dir"

# Empty the Trash on all mounted volumes and the main HDD
# Also, clear Apple’s System Logs to improve shell startup speed
alias  emptytrash="sudo rm -rfv /Volumes/*/.Trashes; sudo rm -rfv ~/.Trash; sudo rm -rfv /private/var/log/asl/*.asl"

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

alias sleep-disable="sudo pmset -a hibernatemode 0; sudo pmset -a disablesleep 1;"
alias sleep-enable="sudo pmset -a hibernatemode 3; sudo pmset -a disablesleep 0;"
