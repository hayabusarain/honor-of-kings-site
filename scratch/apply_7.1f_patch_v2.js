const fs = require('fs');
const paths = ['public/data/skills/ja.json', 'public/data/all_skills.json'];

function processSkill(skill, textMap, tableMap) {
  if (skill.description) {
    let res = skill.description;
    for (const [k, v] of Object.entries(textMap)) {
      res = res.split(k).join(v);
    }
    skill.description = res;
  }
  
  if (skill.table && skill.table.rows && tableMap) {
    skill.table.rows.forEach(r => {
      if (r.values) {
        for (let i = 0; i < r.values.length; i++) {
          let currentVal = r.values[i];
          for (const [k, v] of Object.entries(tableMap)) {
            if (currentVal === k) {
              r.values[i] = v;
            }
          }
        }
      }
    });
  }
}

paths.forEach(p => {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));

  if (data['Kayle']) {
    data['Kayle'].forEach(s => {
      if (s.name.includes('天の祝福') || s.name.includes('Celestial')) {
        processSkill(s, 
          { '65/105/145/185': '95/125/155/185' },
          { '65': '95', '105': '125', '145': '155', '185': '185' }
        );
      }
    });
  }

  if (data['Taliyah']) {
    data['Taliyah'].forEach(s => {
      if (s.name.includes('スレッドボレー')) {
        processSkill(s, 
          { '50/70/90/110': '40/60/80/100' },
          { '50': '40', '70': '60', '90': '80', '110': '100' }
        );
      }
      if (s.name.includes('アンレイベルアース')) {
        processSkill(s, 
          { '30/45/60/75': '20/35/50/65' },
          { '30': '20', '45': '35', '60': '50', '75': '65' }
        );
      }
    });
  }

  if (data['Ambessa']) {
    data['Ambessa'].forEach(s => {
      if (s.name.includes('断交')) {
        processSkill(s, {
          '95～319': '50～330', '95~319': '50~330', '95-319': '50-330',
          '125%': '120%'
        }, {
          '125%': '120%'
        });
      }
    });
  }

  if (data['KSante']) {
    data['KSante'].forEach(s => {
      if (s.name.includes('オールアウト')) {
        processSkill(s, {
          '最大体力が25%': '最大体力が30%', '最大体力25%': '最大体力30%',
          '25%低下': '30%低下', '物理防御と魔法防御を70%': '物理防御と魔法防御を80%', '70%低下': '80%低下'
        }, {
          '25%': '30%', '70%': '80%'
        });
      }
    });
  }

  if (data['Gragas']) {
    data['Gragas'].forEach(s => {
      if (s.name.includes('飲みすぎ注意')) {
        processSkill(s, {
          '65/90/115/140': '35/70/105/140',
          '90%AP': '70%AP', '魔力の90%': '魔力の70%',
          '最大体力の7%': '最大体力の8%', '7%': '8%'
        }, {
          '65': '35', '90': '70', '115': '105', '140': '140', '7%': '8%'
        });
      }
    });
  }

  if (data['Viego']) {
    data['Viego'].forEach(s => {
      if (s.name.includes('滅びの剣')) {
        processSkill(s, { 
          '現在体力の3%': '現在体力の2%', 
          '3%/4%/5%/6%': '2%/3%/4%/5%', '3/4/5/6%': '2/3/4/5%' 
        }, {
          '3%': '2%', '4%': '3%', '5%': '4%', '6%': '5%'
        });
      }
      if (s.name.includes('ハートブレイカー')) {
        processSkill(s, { '範囲: 3': '範囲: 2.75' }, {});
      }
    });
  }

  if (data['Akshan']) {
    data['Akshan'].forEach(s => {
      if (s.name.includes('報復のブーメラン')) {
        processSkill(s, {
          '5/35/65/95': '10/40/70/100',
          '80%攻撃力': '85%攻撃力', '80%AD': '85%AD', '80%': '85%'
        }, {
          '5': '10', '35': '40', '65': '70', '95': '100'
        });
      }
    });
  }

  if (data['Norra']) {
    data['Norra'].forEach(s => {
      if (s.name.includes('記憶の波動')) {
        processSkill(s, { '60/120/180/240': '55/110/165/220' }, {
          '60': '55', '120': '110', '180': '165', '240': '220'
        });
      }
      if (s.name.includes('どこでもない場所へ') || s.name.includes('ポータル')) {
        processSkill(s, {
          '100/150/200': '100/140/180',
          '60%AP': '55%AP', '魔力の60%': '魔力の55%'
        }, {
          '150': '140', '200': '180'
        });
      }
    });
  }

  if (data['KogMaw']) {
    data['KogMaw'].forEach(s => {
      if (s.name.includes('有機性魔力砲')) {
        processSkill(s, {
          '2/3/4/5%': '1.5/2.5/3.5/4.5%',
          '2%/3%/4%/5%': '1.5%/2.5%/3.5%/4.5%'
        }, {
          '2%': '1.5%', '3%': '2.5%', '4%': '3.5%', '5%': '4.5%'
        });
      }
    });
  }

  if (data['Shen']) {
    data['Shen'].forEach(s => {
      if (s.name.includes('護刃招来')) {
        processSkill(s, {
          '2.5/3/3.5/4%': '3/3.5/4/4.5%',
          '2.5%/3%/3.5%/4%': '3%/3.5%/4%/4.5%',
          '5/5.5/6/6.5%': '5.5/6/6.5/7%',
          '5%/5.5%/6%/6.5%': '5.5%/6%/6.5%/7%'
        }, {
          '2.5%': '3%', '3%': '3.5%', '3.5%': '4%', '4%': '4.5%',
          '5%': '5.5%', '5.5%': '6%', '6%': '6.5%', '6.5%': '7%'
        });
      }
    });
  }

  fs.writeFileSync(p, JSON.stringify(data, null, 2));
  console.log('Saved applied 7.1f patch data v2 to ' + p);
});
