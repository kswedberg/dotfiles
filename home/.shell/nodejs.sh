### Volta node version manager
if [ -d "$HOME/.volta" ]; then
  export VOLTA_HOME="$HOME/.volta"
  export PATH="$VOLTA_HOME/bin:$PATH"
fi

### "n" node version manager

if [ -d "$HOME/n" ]; then
  # Added by n-install (see http://git.io/n-install-repo).
  export N_PREFIX="$HOME/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"
fi

### nvm node version manager

export NVM_DIR="$HOME/.nvm"
# Load nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# Load nvm bash_completion
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

### Bun

# "-s" = file exists and has size > 0
if [ -s "/Users/kswedberg/.bun/_bun" ]; then
  # completions
  source "/Users/kswedberg/.bun/_bun"

  export BUN_INSTALL="/Users/kswedberg/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

### Yarn

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
