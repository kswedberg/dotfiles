#### Find and load a node version manager

if [ -d "/opt/homebrew/opt/fnm/bin" ]; then
  # fnm node version manager (https://github.com/Schniz/fnm)
  export FNM_PATH="/opt/homebrew/opt/fnm/bin"
  eval "`fnm env`"
  eval "$(fnm env --use-on-cd --version-file-strategy recursive --shell zsh)"
  # echo "fnm loaded from $FNM_PATH"
elif [ -d "$HOME/.volta" ]; then
  ### Volta node version manager
  export VOLTA_HOME="$HOME/.volta"
  export PATH="$VOLTA_HOME/bin:$PATH"
elif [ -d "$HOME/n" ]; then
  ### "n" node version manager
  # Added by n-install (see http://git.io/n-install-repo).
  export N_PREFIX="$HOME/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"
else
  ### nvm node version manager
  export NVM_DIR="$HOME/.nvm"
  # Load nvm
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  # Load nvm bash_completion
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

  [ -s "$NVM_DIR/nvm.sh" ] && source $HOME/.shell/nvm_load.sh
  # echo "nvm loaded"
fi


### Bun

# "-s" = file exists and has size > 0
if [ -s "/Users/kswedberg/.bun/_bun" ]; then
  # completions
  source "/Users/kswedberg/.bun/_bun"

  export BUN_INSTALL="/Users/kswedberg/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi
