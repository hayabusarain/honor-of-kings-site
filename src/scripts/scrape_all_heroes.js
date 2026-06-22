const fs = require('fs');
const path = require('path');

async function scrapeAll() {
  const heroesPath = path.join(__dirname, '../data/hok_heroes.json');
  const heroes = JSON.parse(fs.readFileSync(heroesPath, 'utf8'));
  const outDir = path.join(__dirname, '../data/parsed_skills');
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (let i = 0; i < heroes.length; i++) {
    const hero = heroes[i];
    const outFile = path.join(outDir, `champ_${hero.id}.json`);
    
    if (fs.existsSync(outFile)) {
      console.log(`Skipping ${hero.nameEn} (already exists)`);
      continue;
    }

    console.log(`Scraping ${hero.nameEn} (${hero.id})...`);
    
    try {
      const r = await fetch(`https://pvp.qq.com/web201605/herodetail/${hero.id}.shtml`);
      const b = await r.arrayBuffer();
      const html = new TextDecoder('gbk').decode(b);

      const skillNames = [...html.matchAll(/<p class="skill-name"><b>(.*?)<\/b>(.*?)<\/p>/g)];
      const skillDescs = [...html.matchAll(/<p class="skill-desc">(.*?)<\/p>/g)];
      
      const skills = [];
      const keys = ['P', 'Q', 'W', 'E', 'R'];
      
      for (let j = 0; j < Math.min(skillNames.length, keys.length); j++) {
        let name = skillNames[j][1];
        let meta = skillNames[j][2] || '';
        let desc = skillDescs[j] ? skillDescs[j][1] : '';
        
        meta = meta.replace(/<span.*?>/g, '').replace(/<\/span>/g, ' ');
        
        let fullDesc = meta.trim() ? `[${meta.trim()}]\n${desc}` : desc;

        skills.push({
          id: keys[j],
          name: name,
          description: fullDesc,
          icon: `/images/skills/${hero.id}_${j}.png` // optional placeholder
        });
      }

      const outData = {
        zh: skills,
        ja: skills // Will be translated later
      };

      fs.writeFileSync(outFile, JSON.stringify(outData, null, 2));
      console.log(`Saved ${hero.nameEn} (${skills.length} skills)`);
      
    } catch (e) {
      console.error(`Failed to scrape ${hero.nameEn}:`, e.message);
    }

    // Wait 2 seconds
    await new Promise(res => setTimeout(res, 2000));
  }
  
  console.log('All done!');
}

scrapeAll().catch(console.error);
