#!/bin/sh

function setup() {
  echo "\nThis script runs a number of commands to set up a new Mac. Do you want to continue? (y/n)"
  read DOIT

  if [ "$DOIT" != "y" ]; then
    echo "Okay. Aborting setup script. Bye!"
    return
  fi
  # Ask for the administrator password upfront
  sudo -v

  # Keep-alive: update existing `sudo` time stamp until `setup.sh` has finished
  while true; do
    sudo -n true
    sleep 60
    kill -0 "$$" || exit
  done 2>/dev/null &

  DOTFILES="$( cd "$( dirname "${BASH_SOURCE[0]}")"  && pwd)"
  red=$(tput setaf 1)
  reset=$(tput sgr0)

  rm ~/.zshrc
  for file in $(find $DOTFILES/home -maxdepth 1)
  do
    if [[ ! "$file" =~ DS_Store ]]
    then
      base=`basename $file`
      ln -s $file "$HOME/$base"
    fi
  done

  #### HOMEBREW
  # Install Homebrew if not already there
  if [[ ! -f /usr/local/bin/brew && ! -f /opt/homebrew/bin/brew ]]; then
    echo "Homebrew does not exist. Installing…"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi

  fi
  PATH="/opt/homebrew/bin:$PATH"
  if [[ ! -f /usr/local/bin/brew && -f /opt/homebrew/bin/brew ]]; then
    echo "Homebrew is installed at /opt/homebrew but not at /usr/local. Setting path to /opt/homebrew/bin for setup"
    PATH="/opt/homebrew/bin:$PATH"
  fi
  # Update Homebrew recipes

  brew update

  # Install all Homebrew dependencies with bundle (See Brewfile)
  echo "Installing Homebrew apps…"
  brew tap homebrew/bundle
  brew bundle -v

  # Install Vim Vundle
  echo "Installing Vim Vundle…"
  git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim


  # Create some unsourced files if they don't already exist:
  touch "$DOTFILES/home/.gitconfig.secrets"
  touch "$DOTFILES/home/.shell/secrets.sh"
  touch "$DOTFILES/home/.shell-after/secrets.sh"

  # In case there is no .zshrc yet:
  touch ~/.zshrc
  # Get shell to recognize all the new goodness
  source ~/.zshrc

  # Install nvm if not already there
  if [[ ! -d ~/.nvm ]]; then
    echo "nvm does not exist. Installing…"
    export NVM_DIR="$HOME/.nvm" && (
      git clone https://github.com/nvm-sh/nvm.git "$NVM_DIR"
      cd "$NVM_DIR"
      git checkout $(git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1))
    ) && \. "$NVM_DIR/nvm.sh"
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  fi

  # Install latest LTS node.js
  echo "\nDo you want to install the lts version of Node.js?  (y/N)"
  read CONFIRM_NODE_LTS

  if [ "$CONFIRM_NODE_LTS" = "y" ]; then
    nvm install node
    nvm use node
    nvm alias default node

    node --version
    npm --version

    echo "\n**NOTE**: Some things installed by Homebrew (such as mongodb) might automatically install node.js as a dependency, which could force the homebrew node as the default version. If this happens, run `brew unlink node`."
  else
    echo "Okay, skipping Node installation. You can install it later with nvm install"
  fi

  # Install Classic Yarn

  echo "\nDo you want to install Yarn?  (y/N)"
  read CONFIRM_YARN
  if [ "$CONFIRM_YARN" = "y" ]; then
    curl -o- -L https://yarnpkg.com/install.sh | bash
    echo "Yarn installed. Version:"
    yarn --version
  fi

  # Install a "recent" Ruby version (as of 2017-12-01) and use it
  # (rbenv was installed from homebrew with the brew bundle command above)
  echo "\nDo you want to a version of Ruby? (y/N)"
  read CONFIRM_RUBY

  if [ "$CONFIRM_RUBY" = "y" ]; then
    RUBY_VERSION="3.0.4"
    read "?Choose a version [default is $RUBY_VERSION]: " USER_RUBY_VERSION
    RUBY_VERSION=${USER_RUBY_VERSION:-$RUBY_VERSION}
    rbenv install $RUBY_VERSION
    rbenv global $RUBY_VERSION
  else
    echo "Okay, skipping Node installation. You can install it later with rbenv install"
  fi
  echo "\nDo you want to install Rust via rustup?  (y/N)"
  read CONFIRM_RUST
  if [ "$CONFIRM_RUST" = "y" ]; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

  else
    echo "Okay, skipping Rust. You can install it later with this command:"
    echo "$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
  fi

  # Create default directory and set permissions for MongoDB
  # sudo mkdir -p /data/db
  # sudo chown -R $(id -un) /data/db

  echo "\nDo you want launchd to start mongodb now and restart at login? (y/N)"
  read CONFIRM_MONGO_LAUNCHD

  if [ "$CONFIRM_MONGO_LAUNCHD" = "y" ]; then
    brew services start mongodb/brew/mongodb-community
    echo "mongodb added to launchd"
  else
    echo "Okay. To run mongodb on your own… "
    echo "$ mongod --config ${HOMEBREW}/etc/mongod.conf"
  fi

  # Install global Composer packages
  composer global require laravel/installer

  echo "All done!"

  echo "\nConsider running the setup2.sh script as well"
}

setup
