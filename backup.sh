#!/bin/sh
declare -a backup_cmds=("brew bundle dump --file=$DOTFILES/Brewfile --force"
  "mackup backup --force")

echo "\nYou are about to back up your settings and files."
echo "\nThis will run the following commands:"

for (( i = 0; i < ${#backup_cmds[@]} ; i++ )); do
    printf "\n* ${backup_cmds[$i]}"
done

echo "\n\nAre you sure? (y/n)"
read CONFIRM

if [ "$CONFIRM" = "y" ]; then
  for (( i = 0; i < ${#backup_cmds[@]} ; i++ )); do
      printf "\n**** Running: ${backup_cmds[$i]} *****"

      # Run each command
      RESULT=`${backup_cmds[$i]}`
      ### Check if the command gave any output, and echo it if so
      if [ -n "$RESULT" ]; then
        echo "\n"
        echo "$RESULT"
      fi
  done
else
  echo "\nOkay, not gonna do it. Have a nice day!"
fi
