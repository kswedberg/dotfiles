#!/usr/bin/env bash

current_branch() {
    git rev-parse --abbrev-ref HEAD
}

usage() {
    echo "Usage: git fb [remote = origin] branch"
    echo ""
    echo "ex: git fb staging"
    echo " → git fetch origin staging:staging"
    echo "ex: git fb upstream main"
    echo " → git fetch upstream main:main"
}

cur_branch=$(current_branch)
case $# in
    1 )
        git fetch origin "$1:$1"
        ;;
    2 )
        git fetch "$1" "$2:$2"
        ;;
    * )
        usage
esac
