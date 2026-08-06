const fs = require('fs');
const https = require('https');

const jaPath = 'public/data/skills/ja.json';
const enPath = 'public/data/skills/en.json';

const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const heroIds = Object.keys(ja);
let fetched = 0;

console.log('Fetching official skill priority for', heroIds.length, 'heroes from Tencent CN...');

async function run() {
  for (const id of heroIds) {
    await new Promise((resolve) => {
      https.get('https://pvp.qq.com/web201605/herodetail/' + id + '.shtml', (res) => {
        if (res.statusCode !== 200) {
          if (ja[id] && ja[id].meta) delete ja[id].meta.official_skill_priority;
          if (en[id] && en[id].meta) delete en[id].meta.official_skill_priority;
          return resolve();
        }

        let chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          const decoder = new TextDecoder('gbk');
          const html = decoder.decode(buf);

          const idx = html.indexOf('sugg-info2');
          if (idx !== -1) {
            const section = html.slice(idx, idx + 600);
            
            const mainIdx = section.indexOf('主升');
            const subIdx = section.indexOf('副升');

            if (mainIdx !== -1) {
              const mainBlock = section.slice(mainIdx, subIdx !== -1 ? subIdx : mainIdx + 300);
              
              let primaryNum = 1;
              if (mainBlock.includes('技能2') || mainBlock.includes('alt="技能2"') || mainBlock.includes(`${id}20.png`)) {
                primaryNum = 2;
              } else if (mainBlock.includes('技能1') || mainBlock.includes('alt="技能1"') || mainBlock.includes(`${id}10.png`)) {
                primaryNum = 1;
              }

              const secondaryNum = primaryNum === 1 ? 2 : 1;

              ja[id].meta = ja[id].meta || {};
              en[id].meta = en[id].meta || {};

              ja[id].meta.official_skill_priority = {
                primary: 'スキル' + primaryNum,
                secondary: 'スキル' + secondaryNum,
                primary_num: primaryNum,
                secondary_num: secondaryNum
              };

              en[id].meta.official_skill_priority = {
                primary: 'Skill ' + primaryNum,
                secondary: 'Skill ' + secondaryNum,
                primary_num: primaryNum,
                secondary_num: secondaryNum
              };

              fetched++;
              console.log('ID:', id, '| 主升: スキル' + primaryNum, '| 副升: スキル' + secondaryNum);
            }
          } else {
            if (ja[id] && ja[id].meta) delete ja[id].meta.official_skill_priority;
            if (en[id] && en[id].meta) delete en[id].meta.official_skill_priority;
          }
          resolve();
        });
      }).on('error', () => resolve());
    });
  }

  fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2), 'utf8');
  fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
  console.log('Done! Successfully saved official skill priority for', fetched, 'heroes.');
}

run();
