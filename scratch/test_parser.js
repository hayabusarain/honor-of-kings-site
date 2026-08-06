const https = require('https');

function testHero(id) {
  https.get('https://pvp.qq.com/web201605/herodetail/' + id + '.shtml', (res) => {
    if (res.statusCode !== 200) {
      console.log(id, '-> 404 (Not on CN server / Global exclusive)');
      return;
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
          const isS1 = mainImgChunk.includes('技能1') || mainImgChunk.includes(`${id}10.png`);
          console.log(`ID ${id} -> Primary: ${isS2 ? 'Skill 2' : 'Skill 1'}`);
        }
      }
    });
  });
}

['111', '112', '125', '131', '150', '519', '631', '635', '640'].forEach(testHero);
