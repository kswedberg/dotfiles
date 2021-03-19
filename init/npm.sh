# npm install -g autoprefixer
# npm install -g bower
modules=(
  @storybook/cli
  @vue/cli
  # @vue/cli-init
  # browser-sync
  # cordova
  # create-react-native-app
  # depcheck
  # exp
  # express-generator
  # gatsby-cli
  # gifify # video -> animated gif
  git-changelog
  # grunt-cli
  gulp-cli
  http-server
  lerna # for mono repos
  # localtunnel # command is `lt`
  # napa
  # nativescript
  # nectarjs
  # ngrok
  # plugman
  pm2
  prettier
  # react-native-cli
  # react-viro-cli
  shipit-cli
  snyk
  tldr # Nice simple alternative to man. Gives good examples
  # ttystudio # terminal -> animated gif
  # uglify-js
  # webpack
  # yarn-completions
  yo
)

printf -v str_modules ' %s' "${modules[@]}"
str_modules=${str_modules:1}

npm install -g $str_modules

# Others:
# npm install -g grunt-init

# # Node Utilities

# npm install -g nodemon

# General Utilities
# npm install -g hyperlink
# npm install -g lodash-cli
# npm install -g marked
# npm install -g mermaid # http://knsv.github.io/mermaid/

# Mobile & Desktop Dev
# npm install -g electron-prebuilt
# npm install -g hoodie-cli
# npm install -g ios-sim

### 3rd Party Services:
# npm install -g firebase-tools
# npm install -g surge
# npm install -g jitsu

### Yeoman Generators:
# npm install -g generator-craftplugin
# npm install -g generator-baseline
# npm install -g generator-mobile
# npm install -g generator-mocha
# npm install -g generator-webapp
# npm install -g generator-react-webpack
