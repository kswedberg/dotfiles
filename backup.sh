#!/usr/bin/env bash
declare -a backup_cmds=(
  "brew bundle dump --file=$DOTFILES/Brewfile --force"
  # "mackup backup --force"
)

echo "You are about to back up your settings and files."
echo "This will run the following commands:"

for ((i = 0; i < ${#backup_cmds[@]}; i++)); do
  printf   "\n* ${backup_cmds[$i]}"
done

echo -e "\n\n"

echo "Are you sure? [y/N]"
read CONFIRM

if [ "$CONFIRM" = "y" ]; then
  for ((i = 0; i < ${#backup_cmds[@]}; i++)); do
    printf "
    **** Running: ${backup_cmds[$i]} *****"

    # Run each command
    RESULT=$( ${backup_cmds[$i]})
    ### Check if the command gave any output, and echo it if so
    if  [ -n "$RESULT" ]; then
      echo ""
      echo "$RESULT"
    fi
  done

else
  echo -e "\nOkay, not gonna do it."
fi

echo -e "\nWant to run bundle-ignored to put all your secret files from this project into secrets.tar.gz? [y/N]"
read CONFIRM_BUNDLE

if [ "$CONFIRM_BUNDLE" = "y" ]; then
  echo "Bundling…"
  $(./fn/bundle-ignored secrets)

  echo "(Ignore the warning about no such file or directory if you see it)"
  echo -e "\nFinished!"
else
  echo -e "\nOkay, bye!"
fi
