These caveats appeared when I ran `brew bundle` with this repo's `Brewfile`:

```
==> Installing vim dependency: ruby
==> Downloading https://homebrew.bintray.com/bottles/ruby-2.6.1.mojave.bottle.tar.gz
==> Pouring ruby-2.6.1.mojave.bottle.tar.gz
Error: The `brew link` step did not complete successfully
The formula built, but is not symlinked into /usr/local
Could not symlink bin/bundle
Target /usr/local/bin/bundle
is a symlink belonging to ruby. You can unlink it:
  brew unlink ruby

To force the link and overwrite all conflicting files:
  brew link --overwrite ruby

To list all files that would be deleted:
  brew link --overwrite --dry-run ruby

Possible conflicting files are:
/usr/local/bin/bundle -> /usr/local/Cellar/ruby/2.5.1/libexec/gembin/bundle
/usr/local/bin/bundler -> /usr/local/Cellar/ruby/2.5.1/libexec/gembin/bundler
==> Caveats
By default, binaries installed by gem will be placed into:
  /usr/local/lib/ruby/gems/2.6.0/bin

You may want to add this to your PATH.

ruby is keg-only, which means it was not symlinked into /usr/local,
because macOS already provides this software and installing another version in
parallel can cause all kinds of trouble.

If you need to have ruby first in your PATH run:
  echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc

For compilers to find ruby you may need to set:
  export LDFLAGS="-L/usr/local/opt/ruby/lib"
  export CPPFLAGS="-I/usr/local/opt/ruby/include"

For pkg-config to find ruby you may need to set:
  export PKG_CONFIG_PATH="/usr/local/opt/ruby/lib/pkgconfig"

==> python
Python has been installed as
  /usr/local/bin/python3

Unversioned symlinks `python`, `python-config`, `pip` etc. pointing to
`python3`, `python3-config`, `pip3` etc., respectively, have been installed into
  /usr/local/opt/python/libexec/bin

If you need Homebrew's Python 2.7 run
  brew install python@2

You can install Python packages with
  pip3 install <package>
  ```
