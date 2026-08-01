const fs = require('fs');

const en = JSON.parse(fs.readFileSync('public/data/skills/en.json', 'utf8'));

// 1. Zhao Yun (107)
if(en['107']) {
  en['107'].passive.description = 'Zhao Yun reduces incoming damage (5%/10%/20%) based on his current HP tier (70%/40%). If Zhao Yun receives healing that exceeds his max HP, the excess amount is converted into a permanent shield.';
  en['107'].skill1.cooldown = 'CD : 8s / Mana : 30';
  en['107'].skill1.description = 'Dashes in the specified direction, dealing 350 (+120% extra Physical Attack) physical damage to enemies in his path. His next basic attack is enhanced, dealing 120 (+40% extra Physical Attack) extra physical damage and slowing the target\'s movement speed for 2 seconds. The dash distance increases with skill level (0-100). When his passive tier changes, this skill\'s charges are restored by 1.';
  if (en['107'].skill1.table && en['107'].skill1.table.rows[1]) en['107'].skill1.table.rows[1].values = ['350', '420', '490', '560', '630', '700'];

  en['107'].skill2.cooldown = 'CD : 6s / Mana : 40';
  en['107'].skill2.description = 'Thrusts his spear rapidly 5 times in the specified direction, each hit dealing 200 (+65% extra Physical Attack) physical damage. Each hit restores 65 (+2.5% extra HP) HP. If consecutive hits strike the same target, damage and healing decay by 8% per hit (minimum 4%).';

  en['107'].skill3.cooldown = 'CD : 18s / Mana : 75';
  en['107'].skill3.description = 'Leaps to the specified location, dealing 550 (+150% extra Physical Attack) physical damage to enemies in the area and knocking them up for 1 second. Marks enemies hit with "Shock" for 5 seconds, causing his skills to deal extra magical damage upon hitting them. If no enemy heroes are hit, 50% of the cooldown is refunded.';
  if (en['107'].skill3.table && en['107'].skill3.table.rows[0]) en['107'].skill3.table.rows[0].values = ['18', '16.5', '15'];
  if (en['107'].skill3.table && en['107'].skill3.table.rows[1]) en['107'].skill3.table.rows[1].values = ['550', '825', '1100'];
}

// 2. Arthur (166)
if(en['166']) {
  en['166'].passive.description = 'Restores 1% of max HP every 2 seconds. In addition, increases movement speed by 10% and boosts Physical and Magical Defense. Base healing amount is 100-200.';
  en['166'].skill1.description = 'Blinks (can be cast without target) or charges at the target, dealing 325 (+100% extra Physical Attack) physical damage and silencing them for 1 second. Simultaneously marks the target; dealing damage to marked enemies inflicts an extra 1% of their max HP as magical damage.';
  if (en['166'].skill1.table && en['166'].skill1.table.rows[1]) en['166'].skill1.table.rows[1].values = ['325', '390', '455', '520', '585', '650'];
  en['166'].skill2.description = 'Summons holy shields that rotate around him for up to 5 seconds, dealing 145 (+18/Lv) physical damage each time they hit an enemy.';
  if (en['166'].skill2.table && en['166'].skill2.table.rows[1]) en['166'].skill2.table.rows[1].values = ['145', '163', '181', '199', '217', '235'];
  en['166'].skill3.description = 'Leaps at an enemy hero, dealing 16% of their max HP as magical damage and knocking them up for 0.5 seconds.';
}

// 3. Bai Long / Han Xin (519)
if(en['519']) {
  en['519'].passive.description = 'Hitting with a skill increases Attack Speed. His 4th basic attack knocks up the target. Sub-attribute damage is 35%-70% (can critically strike).';
  en['519'].skill1.cooldown = 'CD : 12.5s / Mana : 45';
  en['519'].skill1.description = 'Dashes in the specified direction, dealing 270 (+70% extra Physical Attack) physical damage. Enhanced basic attack deals 48 extra damage. The cast speed of this skill scales with Attack Speed.';
  en['519'].skill2.cooldown = 'CD : 12.5s / Mana : 50';
  en['519'].skill2.description = 'Leaps backward and enhances his next basic attack. The enhanced attack deals 180 (+45% extra Physical Attack) physical damage (healing effect on minions reduced uniformly by 50%). The cast speed of this skill scales with Attack Speed.';
  en['519'].skill3.cooldown = 'CD : 12.5s / Mana : 100';
  en['519'].skill3.description = 'Unleashes a flurry of strikes in the specified direction, dealing 180 (+45% extra Physical Attack) physical damage and knocking up enemies in range. The cast speed of this skill scales with Attack Speed.';
  if (en['519'].skill4) {
    en['519'].skill4.description = 'Transforms into the Illusory Dragon. Attack range increases by +25 and hits up to 2 additional targets. Flight speed increases with skill level.';
  }
}

// 4. Li Bai (131)
if(en['131']) {
  en['131'].passive.description = en['131'].passive.description.replace('Physical Attack', 'extra Physical Attack (Sword Icon)');
  if (!en['131'].skill1.cooldown.includes('Mana')) en['131'].skill1.cooldown += ' / Mana : 50';
  if (!en['131'].skill2.cooldown.includes('Mana')) en['131'].skill2.cooldown += ' / Mana : 60';
  if (!en['131'].skill2.description.includes('dodge')) en['131'].skill2.description += '\nIf Li Bai is inside the sword circle, he has a 10% chance to dodge basic attacks from enemies inside it (dodge chance is doubled against basic attacks from outside).';
  if (en['131'].skill2.table && en['131'].skill2.table.rows && !en['131'].skill2.table.rows.find(r => r.label === 'Dodge Rate')) en['131'].skill2.table.rows.push({ label: 'Dodge Rate', values: ['10%', '12%', '14%', '16%', '18%', '20%'] });
  if (!en['131'].skill3.cooldown.includes('Mana')) en['131'].skill3.cooldown += ' / Mana : 100';
}

// 5. Yang Jian (178)
if(en['178']) {
  if (!en['178'].skill1.cooldown.includes('Mana')) en['178'].skill1.cooldown += ' / Mana : 25';
  if (!en['178'].skill2.cooldown.includes('Mana')) en['178'].skill2.cooldown += ' / Mana : 70';
  en['178'].skill2.description = en['178'].skill2.description.replace('1 second', '0.5 seconds');
  if (!en['178'].skill3.cooldown.includes('Mana')) en['178'].skill3.cooldown += ' / Mana : 80';
}

// 6. Cai Wenji (184)
if(en['184']) {
  if (!en['184'].skill1.cooldown.includes('Mana')) en['184'].skill1.cooldown += ' / Mana : 75';
  if (!en['184'].skill2.cooldown.includes('Mana')) en['184'].skill2.cooldown += ' / Mana : 50';
  en['184'].skill3.cooldown = 'CD : 60s (-6s per Lv) / Mana : 120';
  en['184'].skill3.description = en['184'].skill3.description.replace('45% of Magical Attack', '45% of Magical Attack (Staff Icon)').replace('Physical and Magical Defense', 'Physical Defense (Orange Shield Icon) and Magical Defense (Purple Shield Icon)');
  if (en['184'].skill3.table && en['184'].skill3.table.rows[0]) en['184'].skill3.table.rows[0].values = ['60', '54', '48'];
}

// 7. Zhong Wuyan (117)
if(en['117']) {
  if (!en['117'].skill1.cooldown.includes('Mana')) en['117'].skill1.cooldown += ' / Mana : 30';
  if (!en['117'].skill2.cooldown.includes('Mana')) en['117'].skill2.cooldown += ' / Mana : 40';
  if (!en['117'].skill3.cooldown.includes('Mana')) en['117'].skill3.cooldown += ' / Mana : 70';
  en['117'].skill3.description = en['117'].skill3.description.replace('95% of extra Physical Attack', '100% of extra Physical Attack').replace('70 (+3% of extra HP)', '80 (+3% of extra HP)');
  if (en['117'].skill3.table && en['117'].skill3.table.rows) {
    const shieldRow = en['117'].skill3.table.rows.find(r => r.label.includes('Shield'));
    if (shieldRow) shieldRow.values = ['80', '120', '160'];
  }
}

// 8. Xiahou Dun (126)
if(en['126']) {
  en['126'].passive.description = en['126'].passive.description.replace('6% of extra max HP', '6% of extra HP');
  if (!en['126'].skill1.cooldown.includes('Mana')) en['126'].skill1.cooldown += ' / Mana : 40';
  en['126'].skill1.description = en['126'].skill1.description.replace(/420/g, '400');
  if (en['126'].skill1.table && en['126'].skill1.table.rows) {
    const dmgRow = en['126'].skill1.table.rows.find(r => r.label.includes('Damage'));
    if (dmgRow) dmgRow.values = ['400', '480', '560', '640', '720', '800'];
  }
  if (!en['126'].skill2.cooldown.includes('Mana')) en['126'].skill2.cooldown += ' / Mana : 35';
  en['126'].skill2.description = en['126'].skill2.description.replace('12% of extra max HP', '12% of extra HP');
  if (!en['126'].skill3.cooldown.includes('Mana')) en['126'].skill3.cooldown += ' / Mana : 50';
  en['126'].skill3.description = en['126'].skill3.description.replace(/420/g, '400').replace('10% of extra max HP', '10% of extra HP');
  if (en['126'].skill3.table && en['126'].skill3.table.rows) {
    const dmgRow = en['126'].skill3.table.rows.find(r => r.label.includes('Damage'));
    if (dmgRow) dmgRow.values = ['400', '600', '800'];
  }
}

// 9. Zhuangzi (113)
if(en['113']) {
  en['113'].skill3.description = en['113'].skill3.description.replace('2 seconds', '1.5 seconds').replace('700 (+13% of extra HP)', '600 (+12% of extra HP)');
  if (en['113'].skill3.table && en['113'].skill3.table.rows) {
    const shieldRow = en['113'].skill3.table.rows.find(r => r.label.includes('Shield'));
    if (shieldRow) shieldRow.values = ['600', '900', '1200'];
  }
}

fs.writeFileSync('public/data/skills/en.json', JSON.stringify(en, null, 2), 'utf8');
console.log('Successfully updated en.json!');
