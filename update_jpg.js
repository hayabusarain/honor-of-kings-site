const fs = require('fs');

const getFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = dir + '/' + file;
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
};

const files = getFiles('src');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('.jpg')) {
    
    // For HeroDetailClient.tsx
    if (file.includes('HeroDetailClient.tsx')) {
      content = content.replace(/`\/images\/heroes\/\$\{hero\.key \|\| id\}\.jpg`/g, '(hero?.image || `/images/heroes/${id}.jpg`)');
      content = content.replace(/`\/images\/heroes\/\$\{hero\?\.key \|\| id\}\.jpg`/g, '(hero?.image || `/images/heroes/${id}.jpg`)');
      content = content.replace(/`\/images\/heroes\/\$\{syn\.hero_id\}\.jpg`/g, '((HOK_HEROES as any[]).find(h => h.id === syn.hero_id)?.image || `/images/heroes/${syn.hero_id}.jpg`)');
      content = content.replace(/`\/images\/heroes\/\$\{cnt\.hero_id\}\.jpg`/g, '((HOK_HEROES as any[]).find(h => h.id === cnt.hero_id)?.image || `/images/heroes/${cnt.hero_id}.jpg`)');
      changed = true;
    }
    
    // For heroes/page.tsx
    if (file.endsWith('heroes/page.tsx') || file.endsWith('heroes\\page.tsx')) {
       content = content.replace(/src=\{`\/images\/heroes\/\$\{hero\.key\}\.jpg`\}/g, 'src={hero.image}');
       changed = true;
    }
    
    // For [id]/page.tsx
    if (file.endsWith('[id]/page.tsx') || file.endsWith('[id]\\page.tsx')) {
       content = content.replace(/"image": `https:\/\/hok\.hub-game\.com\/images\/heroes\/\$\{hero\?\.id\}\.jpg`,/g, '"image": `https://hok.hub-game.com${hero?.image || `/images/heroes/${hero?.id}.jpg`}`,');
       changed = true;
    }
    
    // For TierListClient.tsx
    if (file.includes('TierListClient.tsx')) {
       content = content.replace(/src=\{`\/images\/heroes\/\$\{hero\.key \|\| hero\.id\}\.jpg`\}/g, 'src={hero.image}');
       changed = true;
    }
    
    // For PatchTable.tsx
    if (file.includes('PatchTable.tsx')) {
       content = content.replace(/src=\{`\/images\/heroes\/\$\{matchedHero\.id\}\.jpg`\}/g, 'src={matchedHero.image}');
       changed = true;
    }
    
    // For CounterPickVoting.tsx
    if (file.includes('CounterPickVoting.tsx')) {
       content = content.replace(/src=\{`\/images\/heroes\/\$\{\(HOK_HEROES as any\[\]\)\.find\(h => h\.nameEn === heroImageId\)\?\.id \|\| heroImageId\}\.jpg`\}/g, 'src={(HOK_HEROES as any[]).find(h => h.nameEn === heroImageId)?.image || `/images/heroes/${heroImageId}.jpg`}');
       content = content.replace(/src=\{`\/images\/heroes\/\$\{\(HOK_HEROES as any\[\]\)\.find\(h => h\.nameEn === enName\)\?\.id \|\| enName\}\.jpg`\}/g, 'src={(HOK_HEROES as any[]).find(h => h.nameEn === enName)?.image || `/images/heroes/${enName}.jpg`}');
       changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
