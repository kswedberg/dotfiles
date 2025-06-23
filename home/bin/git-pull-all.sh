#!/usr/bin/env zsh
# I set up a git alias for this in home/.gitconfig.secrets

START_DIR=$(pwd)
DIR=$(pwd)
DIR_BASE="$(basename "$DIR")"
CYAN='\033[0;36m'
NC='\033[0m' # No Color

get_current_branch() {
  git rev-parse --abbrev-ref HEAD
}
change_git() {
  # $1 is typically gonna be $(pwd)
  # $2 is the branch to checkout
  GIT_DIR="${1}/.git"
  GIT_WORK_TREE="${1}"

  if [[ -n $2 ]]; then
    git checkout "$2"
  fi
}

PROJECT=clinic
START_BRANCH="$(get_current_branch)"
BRANCH=""

while getopts ':p:b:h' OPTION; do
  case "$OPTION" in
    p)
      PROJECT=$OPTARG
      # echo "Pulling $PROJECT"
      ;;
    b)
      BRANCH="$OPTARG"
      ;;
    h)
      echo "Usage: git pull-all [-p project] [-b branch]"
      exit 0
      ;;
  esac
done

REPOS=(backend clinic scheduling treatment preview-clinic)

if [[ $PROJECT == "rrx" ]]
then
  REPOS=(be fe)
fi

if [[ ${REPOS[(ie)$DIR_BASE]} -le ${#REPOS} ]]; then
    echo 'changing to base directory…'
    cd ../../
    DIR=$(pwd)
fi

for (( i = 1; i <= ${#REPOS[@]}; i++ )) do
  ( # subshell to contain the effect of the chdir
    echo ""
    echo -e "Changing to ${DIR}/services/${CYAN}${REPOS[i]}${NC}"
    cd "${DIR}/services/${REPOS[i]}"
    change_git "$(pwd)" $BRANCH
    # GIT_DIR="$(pwd)/.git"
    # GIT_WORK_TREE="$(pwd)"

    # checkout branch if passed as argument
    # if [[ -n $BRANCH ]]; then
    #   git checkout "$BRANCH"
    # fi
    echo -e "Pulling${CYAN} ${REPOS[i]}${NC} in >${CYAN} $(get_current_branch)${NC}"
    git pull
  )
done

# RESET branch and directory:
if [[ $DIR != $START_DIR ]]
then
  echo -e "Changing back to ${CYAN}${START_DIR}${NC}"
  cd $START_DIR
  # GIT_DIR="$(pwd)/.git"
  # GIT_WORK_TREE="$(pwd)"

fi

if [[ -n $BRANCH ]]
then
  change_git "$(pwd)" $START_BRANCH
  # GIT_DIR="$(pwd)/.git"
  # GIT_WORK_TREE="$(pwd)"
  # git checkout "$START_BRANCH"
fi
