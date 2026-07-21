const fs = require('fs');
const path = require('path');

async function main() {
  const cnHeroesRes = await fetch('https://pvp.qq.com/web201605/js/herolist.json');
  const cnHeroes = await cnHeroesRes.json();
  
  const jaPath = path.join(__dirname, '../public/data/skills/ja.json');
  const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
  
  // Blacklist for heroes with heavily modified visual identities in Global or missing in CN.
  const blacklist = [
    '547', // Luara (Global exclusive)
    '556', // Ata (Pigsy in CN, totally different model)
    '631', // Alessio (Missing in CN DB under this ID?)
    '635', // Furia / Mulan?
    '640', // Mayene?
    '646'  // Butterfly (Global exclusive/AoV)
  ];
  
  let updatedCount = 0;
  
  for (const [id, data] of Object.entries(ja)) {
    if (blacklist.includes(id)) {
      data.skins = [];
      continue;
    }
    
    const cnHero = cnHeroes.find(h => h.ename == id);
    if (cnHero && cnHero.skin_name) {
      const skinNames = cnHero.skin_name.split('|');
      // The first skin is usually the default (classic) skin. Let's include it.
      // Images are 1-indexed.
      const skins = skinNames.map((name, index) => {
        return {
          name: name,
          url: `https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/${id}/${id}-bigskin-${index + 1}.jpg`
        };
      });
      data.skins = skins;
      updatedCount++;
    } else {
      data.skins = [];
    }
  }
  
  fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2));
  console.log(`Successfully added skin data to ${updatedCount} heroes.`);
}

main().catch(console.error);
