const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json') || file.endsWith('.css') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}

function processFiles(dirs) {
  let files = [];
  dirs.forEach(d => {
    if (fs.existsSync(d)) {
      files = files.concat(walk(d));
    }
  });
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/Champion/g, 'Hero');
    content = content.replace(/champion/g, 'hero');
    content = content.replace(/CHAMPION/g, 'HERO');

    content = content.replace(/Rune/g, 'Arcana');
    content = content.replace(/rune/g, 'arcana');
    content = content.replace(/RUNE/g, 'ARCANA');

    content = content.replace(/Spell/g, 'Skill');
    content = content.replace(/spell/g, 'skill');
    content = content.replace(/SPELL/g, 'SKILL');

    content = content.replace(/ワイリフ/g, 'HoK');
    content = content.replace(/Wild Rift/g, 'Honor of Kings');

    if (original !== content) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated ' + file);
    }
  });
}

function renameDirs(baseDir) {
  const mappings = {
    'champions': 'heroes',
    'runes': 'arcana',
    'spells': 'skills'
  };

  function traverseAndRename(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const list = fs.readdirSync(currentDir);
    for (const item of list) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverseAndRename(fullPath); // recursively go down
        // Rename if matched
        if (mappings[item]) {
          const newPath = path.join(currentDir, mappings[item]);
          fs.renameSync(fullPath, newPath);
          console.log(`Renamed directory ${fullPath} to ${newPath}`);
        }
      }
    }
  }
  traverseAndRename(baseDir);
}

// 1. Process files text content
processFiles(['./src', './messages', './public']);

// 2. Rename directories (e.g. app/[locale]/champions -> heroes)
renameDirs('./src');
