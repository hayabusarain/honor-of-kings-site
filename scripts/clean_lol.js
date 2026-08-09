/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

console.log('Starting cleanup of LoL text references and invalid keys...');

// 1. messages/ja.json
if (fs.existsSync('messages/ja.json')) {
  let content = fs.readFileSync('messages/ja.json', 'utf8');
  content = content.replace(/※こ.*E/g, '');
  content = content.replace(/LoL\/Honor of Kings/g, 'Honor of Kings');
  content = content.replace(/『ネクサス、E/g, '『クリスタル』');
  content = content.replace(/ネクサス/g, 'クリスタル');
  content = content.replace(/インヒビター/g, '高地塔');
  content = content.replace(/攻撁E.*?\(AD\)/g, '物理攻击力');
  content = content.replace(/魔力 \(AP\)/g, '魔法攻击力');
  fs.writeFileSync('messages/ja.json', content, 'utf8');
  console.log('✁EUpdated messages/ja.json');
}

// 2. messages/en.json
if (fs.existsSync('messages/en.json')) {
  let content = fs.readFileSync('messages/en.json', 'utf8');
  content = content.replace(/\*Data in this section is based on PC League of Legends.*?\n/g, '');
  content = content.replace(/'Nexus'/g, "'Crystal'");
  content = content.replace(/"Nexus"/g, '"Crystal"');
  content = content.replace(/\bNexus\b/g, 'Crystal');
  content = content.replace(/\bInhibitor\b/g, 'High Ground Tower');
  content = content.replace(/Attack Damage \(AD\)/g, 'Physical Attack');
  content = content.replace(/Ability Power \(AP\)/g, 'Magical Attack');
  fs.writeFileSync('messages/en.json', content, 'utf8');
  console.log('✁EUpdated messages/en.json');
}

// 3. public/data/guide/ja.json
if (fs.existsSync('public/data/guide/ja.json')) {
  let content = fs.readFileSync('public/data/guide/ja.json', 'utf8');
  content = content.replace(/4刁E.*?外塁E/g, '4分経過で外塔');
  content = content.replace(/敵の.*?奪ぁE/g, '敵のリソースを奪う');
  content = content.replace(/High Ground Tower.*?/g, 'High Ground Tower (高地塔)');
  content = content.replace(/インヒビター/g, '高地塔');
  fs.writeFileSync('public/data/guide/ja.json', content, 'utf8');
  console.log('✁EUpdated public/data/guide/ja.json');
}

// 4. public/data/guide/en.json
if (fs.existsSync('public/data/guide/en.json')) {
  let content = fs.readFileSync('public/data/guide/en.json', 'utf8');
  content = content.replace(/last hits, plates\)/g, 'last hits)');
  content = content.replace(/Inhibitor Turret/g, 'High Ground Tower');
  content = content.replace(/\bInhibitor\b/g, 'High Ground Tower');
  fs.writeFileSync('public/data/guide/en.json', content, 'utf8');
  console.log('✁EUpdated public/data/guide/en.json');
}

// 5. Clean public/data/skills/ko.json, vi.json, all_skills.json from LoL keys
['public/data/skills/ko.json', 'public/data/skills/vi.json', 'public/data/all_skills.json'].forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      let cleaned = false;
      Object.keys(data).forEach(k => {
        if (isNaN(parseInt(k)) || parseInt(k) < 105) {
          delete data[k];
          cleaned = true;
        }
      });
      if (cleaned) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        console.log('✁ECleaned LoL keys from', file);
      }
    } catch (e) {
      console.error('Error processing file:', file, e.message);
    }
  }
});

console.log('All text and JSON cleanup completed.');
