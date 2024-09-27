import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline/promises';
import {stdin as input, stdout as output } from 'node:process';

const home = os.homedir();
const files = await fs.readdir(home, {encoding: 'utf-8'});
const rootDir = process.env.DOTFILES || process.cwd();

const getHomeFiles = async() => {

  const groups = {
    directories: [],
    files: [],
    symlinks: [],
  };
  for (const file of files) {
    const filePath = path.join(home, file);
    try {
      const stat = await fs.lstat(filePath);
      let group = stat.isSymbolicLink() && 'symlinks';

      if (!group) {
        group = stat.isDirectory() ? 'directories' : stat.isFile() ? 'files' : 'unknown';
      }

      groups[group].push(file);

    } catch (err) {
      console.log(err);
    }

  }
  const destDir = process.argv[2] || 'bundle';
  const dest = path.join(rootDir, destDir, dotfiles.json);

  await fs.writeFile(dest, JSON.stringify(groups, null, 2));
  console.log('Created dotfiles.json in', destDir);
};

const copyFiles = async() => {
  const destDir = process.argv[2] || 'bundle';
  const dest = path.join(rootDir, destDir);
  const copyFile = path.join(rootDir, 'secrets.copy.mjs');
  let files = null;
  try {
    await fs.access(copyFile);
    files = await import('./secrets.copy.mjs');
  } catch (err) {
    console.log(err);
  }

  const {toCopy} = files || {}

  if (!toCopy) {
    const rl = readline.createInterface({input, output});

    if (!files) {
      console.log(`If you want to include extra files and directories to copy from your home directory, create a file at ${copyFile}, exporting a toCopy array.`);

      const answer = await rl.question(`\nWould you like me to halt backing up and set up the file for you (y)?
Or would you rather continue without including extra files (n)?`);

      if (answer === 'y') {
        console.log('Setting up file…');
        await getHomeFiles();
        await fs.writeFile(copyFile, 'export const toCopy = [];');
        rl.close();
        console.log('Aborting the rest of this backup for now.')
        process.exit(0);
      } else {
        console.log('Okay, continuing on our merry way…');
      }
    } else {
      console.log(`The file at ${copyFile} is not exporting a toCopy array.`);

      const answer = await rl.question('Do you want to continue anyway? (y/N)');
      if (answer !== 'y') {
        console.log('Aborting');
        rl.close();
        process.exit(0);
      }
    }

    rl.close();
    return console.log('Not copying any extra files.');
  }

  for (let c of toCopy) {
    const orig = path.join(home, c);
    const copy = path.join(dest, c);
    try {
      await fs.cp(orig, copy, {recursive: true});
      console.log('Copied', c);
    } catch (err) {
      console.log('Could not copy', c);
    }
  }
  console.log('Copied a bunch of files');
};

copyFiles();
