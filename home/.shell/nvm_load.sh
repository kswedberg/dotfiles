# place this after nvm initialization!
autoload -U add-zsh-hook
loadnvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use --delete-prefix $nvmrc_node_version
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version $(nvm version default) from $node_version"
    nvm use --delete-prefix default
  fi
}
add-zsh-hook chpwd loadnvmrc
loadnvmrc
