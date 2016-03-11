#!/bin/sh

DOTFILES="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Install Homebrew if not already there
if [[ ! -f /usr/local/bin/brew ]]; then
  echo "Homebrew does not exist. Installing…"
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi
# Install oh-my-zsh if not already there
if [[ ! -d ~/.oh-my-zsh ]]; then
  echo ".oh-my-zsh does not exist. Installing…"
  sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
fi

# Install nvm if not already there
if [[ ! -d ~/.nvm ]]; then
  echo ".nvm does not exist. Installing…"
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
fi

# Install rbenv if not already there
if [[ ! -d ~/.rbenv ]]; then
  echo ".nvm does not exist. Installing…"
  git clone https://github.com/rbenv/rbenv.git ~/.rbenv
  # cd ~/.rbenv && src/configure && make -C src
fi

# Add the .extra file if it doesn't already exist (because it's gitignored)
if [[ ! -f ${DOTFILES}/.extra ]]; then
  touch ${DOTFILES}/.extra
fi

# Sym link files
symlink_files=(
  .gitconfig
  .jscsrc
  .jshintrc
  .profile
  .slate
  .zshrc
  .zprofile
)

function symlink {
  for file in "${@}"; do
    home_file=$HOME/${file}

    # If a real file with the name exists in the home directory, rename it
    if [[ -f ${home_file} ]]; then
      echo "Moving $home_file to ${home_file}-pre-dotfiles"
      mv $home_file ${home_file}-pre-dotfiles
    fi

    # If it's not already symlinked, symlink it from the dotfiles directory
    if [[ ! -h ${home_file} ]]; then
      echo "Sym-linking ${file} from ${DOTFILES} to ${HOME} directory"
      ln -s ${DOTFILES}/${file} ${HOME}/${file}
    fi
  done
}

symlink $symlink_files
