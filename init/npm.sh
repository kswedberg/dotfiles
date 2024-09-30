modules=(
  # @storybook/cli
  # @vue/cli
  # @vue/cli-init
  # autoprefixer
  # browser-sync
  # cordova
  # depcheck
  # express-generator
  # gifify # video -> animated gif
  # git-changelog
  # grunt-cli
  # grunt-init
  # gulp-cli
  http-server
  # hyperlink
  # lerna # for mono repos
  # localtunnel # command is `lt`
  # lodash-cli
  # marked
  # mermaid # http://knsv.github.io/mermaid/
  # nativescript
  # ngrok
  # nodemon
  npm-check-updates # command is `ncu`
  # plugman
  pm2
  # prettier
  # react-native-cli
  snyk
  tldr # Nice simple alternative to man. Gives good examples
  # ttystudio # terminal -> animated gif
  # webpack
  # yarn-completions
  # yo
)

printf -v str_modules ' %s' "${modules[@]}"
str_modules=${str_modules:1}

echo "About to install the following packages global modules:\n\t$str_modules\n"

echo "Do you want to use Yarn [default] or npm? (Y/n)"
read CONFIRM_PKG
if [ "$CONFIRM_PKG" == "n" ]; then
  npm install -g $str_modules
else
  yarn global add $str_modules
fi
