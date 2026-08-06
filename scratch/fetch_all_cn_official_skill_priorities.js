const fs = require('fs');
const https = require('https');

const jaPath = 'public/data/skills/ja.json';
const enPath = 'public/data/skills/en.json';

const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const heroIds = Object.keys(ja);
let fetched = 0;
let skippedGlobal = 0;

console.log('Scraping official Tencent CN skill priority for all', heroIds.length, 'heroes...');

function fetchHero(id) {
  return new Promise((resolve) => {
    const req = https.get('https://pvp.qq.com/web201605/herodetail/' + id + '.shtml', (res) => {
      if (res.statusCode !== 200) {
        skippedGlobal++;
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
          const section = html.slice(idx, idx + 800);
          const mainIdx = section.indexOf('<b>主升</b>');
          const subIdx = section.indexOf('<b>副升</b>');
          
          if (mainIdx !== -1 && subIdx !== -1) {
            const mainImgChunk = section.slice(mainIdx, subIdx);
            const isS2 = mainImgChunk.includes('技能2') || mainImgChunk.includes(`${id}20.png`);
            
            const primaryNum = isS2 ? 2 : 1;
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
            console.log(`[${fetched}] Hero ${id} -> 主升: スキル${primaryNum} | 副升: スキル${secondaryNum}`);
          }
        } else {
          if (ja[id] && ja[id].meta) delete ja[id].meta.official_skill_priority;
          if (en[id] && en[id].meta) delete en[id].meta.official_skill_priority;
        }
        resolve();
      });
    });

    req.on('error', () => {
      // Retry once after delay
      setTimeout(() => {
        https.get('https://pvp.qq.com/web201605/herodetail/' + id + '.shtml', (res2) => {
          if (res2.statusCode !== 200) return resolve();
          let chunks2 = [];
          res2.on('data', c => chunks2.push(c));
          res2.on('end', () => {
            const buf = Buffer.concat(chunks2);
            const decoder = new TextDecoder('gbk');
            const html = decoder.decode(buf);
            const idx = html.indexOf('sugg-info2');
            if (idx !== -1) {
              const section = html.slice(idx, idx + 800);
              const mainIdx = section.indexOf('<b>主升</b>');
              const subIdx = section.indexOf('<b>副升</b>');
              if (mainIdx !== -1 && subIdx !== -1) {
                const mainImgChunk = section.slice(mainIdx, subIdx);
                const isS2 = mainImgChunk.includes('技能2') || mainImgChunk.includes(`${id}20.png`);
                const primaryNum = isS2 ? 2 : 1;
                const secondaryNum = primaryNum === 1 ? 2 : 1;
                ja[id].meta = ja[id].meta || {};
                en[id].meta = en[id].meta || {};
                ja[id].meta.official_skill_priority = { primary: 'スキル' + primaryNum, secondary: 'スキル' + secondaryNum, primary_num: primaryNum, secondary_num: secondaryNum };
                en[id].meta.official_skill_priority = { primary: 'Skill ' + primaryNum, secondary: 'Skill ' + secondaryNum, primary_num: primaryNum, secondary_num: secondaryNum };
                fetched++;
                console.log(`[RETRY SUCCESS] Hero ${id} -> 主升: スキル${primaryNum}`);
              }
            }
            resolve();
          });
        }).on('error', () => resolve());
      }, 500);
    });
  });
}

async function main() {
  for (const id of heroIds) {
    await fetchHero(id);
    // Small delay to prevent rate limits
    await new Promise(r => setTimeout(r, 100));
  }

  fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2), 'utf8');
  fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
  console.log(`COMPLETE: Successfully saved official skill priorities for ${fetched} CN heroes! (${skippedGlobal} global exclusive / unmapped heroes skipped)`);
}

main();
