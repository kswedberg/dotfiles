#!/usr/bin/env bash

current_branch() {
    git rev-parse --abbrev-ref HEAD
}

usage() {
    echo "Usage: git push-to [src] dest"
}

cur_branch=$(current_branch)
case $# in
    1 )
        git checkout "$1" && git pull
        git merge "$cur_branch" "$1" --no-edit && git push
        git checkout "$cur_branch"
        ;;
    2 )
        git checkout "$2" && git pull
        git merge "$1" "$2" --no-edit && git push
        git checkout "$cur_branch"
        ;;
    * )
        usage
esac
