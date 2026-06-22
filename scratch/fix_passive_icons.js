const fs = require('fs');
const http = require('http');
const paths = ['public/data/skills/ja.json', 'public/data/all_skills.json'];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch(e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const dataJa = JSON.parse(fs.readFileSync(paths[0], 'utf8'));
  const champs = Object.keys(dataJa).slice(6, 16);
  
  for(const k of champs) {
    try {
      const dd = await fetchJson(`http://ddragon.leagueoflegends.com/cdn/16.10.1/data/en_US/champion/${k}.json`);
      const passiveImage = dd.data[k].passive.image.full;
      
      paths.forEach(p => {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        data[k].forEach(s => {
          if(s.id === 'P') {
            s.icon = `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/passive/${passiveImage}`;
          }
        });
        fs.writeFileSync(p, JSON.stringify(data, null, 2));
      });
      console.log('Fixed passive icon for', k, '->', passiveImage);
    } catch(e) {
      console.log('Failed for', k, e.message);
    }
  }
  console.log('All done');
}
main();
