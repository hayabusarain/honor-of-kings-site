const fs = require('fs');

const ja = JSON.parse(fs.readFileSync('public/data/skills/ja.json', 'utf8'));

// Helper to safely update
const update = (id, key, newDesc, newCd, newTableRows) => {
  if (!ja[id] || !ja[id][key]) return;
  if (newDesc) ja[id][key].description = newDesc;
  if (newCd) ja[id][key].cooldown = newCd;
  if (newTableRows) {
    ja[id][key].table = ja[id][key].table || { headers: [], rows: [] };
    ja[id][key].table.rows = newTableRows;
  }
};

// 1. Zhao Yun (107)
ja['107'].passive.description = '趙雲は現在のHP段階（70%/40%）に応じて受けるダメージを軽減（5%/10%/20%）する。趙雲が受ける回復量が最大HPを超過した場合、超過分は永続的なシールドに変換される。';
ja['107'].skill1.cooldown = 'CD : 8秒 / 消費MP : 30';
ja['107'].skill1.description = '指定方向へ突進し、経路上の敵に350（350+追加物理攻撃の120%）の物理ダメージを与える。次の通常攻撃が強化され、120（120+追加物理攻撃の40%）の追加物理ダメージと2秒間の移動速度低下を付与する。移動距離はスキルレベルに応じて増加する（0〜100）。パッシブの段階が変化した時、スキル1の使用回数を1回回復する。';
ja['107'].skill1.table.rows[1].values = ['350', '420', '490', '560', '630', '700'];

ja['107'].skill2.cooldown = 'CD : 6秒 / 消費MP : 40';
ja['107'].skill2.description = '指定方向に槍で5回連続突きを繰り出し、それぞれ200（200+追加物理攻撃の65%）の物理ダメージを与える。命中するごとにHPを65（65+追加HPの2.5%）回復する。連続して命中した場合、ダメージと回復量は1回ごとに8%減衰する（最大4%まで）。';

ja['107'].skill3.cooldown = 'CD : 18秒 / 消費MP : 75';
ja['107'].skill3.description = '指定位置へ跳躍し、範囲内の敵に550（550+追加物理攻撃の150%）の物理ダメージを与え、1秒間ノックアップさせる。命中した敵に5秒間「感電」を付与し、自身のスキルが命中する度に追加魔法ダメージを与える。敵ヒーローに命中しなかった場合、クールダウンの50%が返却される。';
ja['107'].skill3.table.rows[0].values = ['18', '16.5', '15'];
ja['107'].skill3.table.rows[1].values = ['550', '825', '1100'];

// 2. Arthur (166)
ja['166'].passive.description = '2秒毎に最大HPの1%を回復する。さらに移動速度が10%上昇し、物理防御および魔法防御を増加させる。基本回復量は100〜200。';
ja['166'].skill1.description = '指定方向へブリンク（空打ち可能）またはターゲットへ突撃し、325（325+追加物理攻撃の100%）の物理ダメージを与え、1秒間サイレンスを付与する。同時にターゲットをマークし、マークされた敵にダメージを与えると、対象の最大HPの1%の追加魔法ダメージを与える。';
ja['166'].skill1.table.rows[1].values = ['325', '390', '455', '520', '585', '650'];
ja['166'].skill2.description = '聖なる盾を召喚して自身の周囲を回転させ、最大5秒間、命中した敵に毎回145（145+18/Lv）の物理ダメージを与える。';
ja['166'].skill2.table.rows[1].values = ['145', '163', '181', '199', '217', '235'];
ja['166'].skill3.description = '対象の敵ヒーローへ跳躍し、対象の最大HPの16%の魔法ダメージを与え、0.5秒間ノックアップさせる。';

// 3. Bai Long / Han Xin (519)
ja['519'].passive.description = 'スキル命中時、攻撃速度が増加する。通常攻撃4回目にターゲットをノックアップさせる。サブ属性ダメージは35%〜70%（クリティカル可能）。';
ja['519'].skill1.cooldown = 'CD : 12.5秒 / 消費MP : 45';
ja['519'].skill1.description = '指定方向へ突進し、270（270+追加物理攻撃の70%）の物理ダメージを与える。強化通常攻撃は48の追加ダメージ。このスキルの発動速度は攻撃速度に応じて増加する。';
ja['519'].skill2.cooldown = 'CD : 12.5秒 / 消費MP : 50';
ja['519'].skill2.description = '後方へ跳躍し、次の通常攻撃を強化する。強化通常攻撃は180（180+追加物理攻撃の45%）の物理ダメージを与える（ミニオン等への回復効果は一律50%減少）。このスキルの発動速度は攻撃速度に応じて増加する。';
ja['519'].skill3.cooldown = 'CD : 12.5秒 / 消費MP : 100';
ja['519'].skill3.description = '指定方向へ乱舞し、範囲内の敵に180（180+追加物理攻撃の45%）の物理ダメージを与えノックアップさせる。このスキルの発動速度は攻撃速度に応じて増加する。';
if (ja['519'].skill4) {
  ja['519'].skill4.description = '夢玄龍に変身する。攻撃射程が+25増加し、最大2体の追加ターゲットへダメージを与える。飛行速度はスキルレベルに応じて増加する。';
}

// 4. Li Bai (131)
ja['131'].passive.description = ja['131'].passive.description.replace('物理攻撃が30増加し', '追加物理攻撃（剣アイコン）が30増加し');
ja['131'].skill1.cooldown += ' / 消費MP : 50';
ja['131'].skill2.cooldown += ' / 消費MP : 60';
ja['131'].skill2.description = ja['131'].skill2.description + '\n李白が剣陣内にいる場合、10%の確率で剣陣内の敵の通常攻撃を回避する（剣陣外からの通常攻撃は回避率2倍）。';
ja['131'].skill2.table.rows.push({ label: '回避率', values: ['10%', '12%', '14%', '16%', '18%', '20%'] });
ja['131'].skill3.cooldown += ' / 消費MP : 100';

// 5. Yang Jian (178)
ja['178'].skill1.cooldown += ' / 消費MP : 25';
ja['178'].skill2.cooldown += ' / 消費MP : 70';
ja['178'].skill2.description = ja['178'].skill2.description.replace('1秒間スタンさせる', '0.5秒間スタンさせる');
ja['178'].skill3.cooldown += ' / 消費MP : 80';

// 6. Cai Wenji (184)
ja['184'].skill1.cooldown += ' / 消費MP : 75';
ja['184'].skill2.cooldown += ' / 消費MP : 50';
ja['184'].skill3.cooldown = 'CD : 60秒（Lv毎に-6秒） / 消費MP : 120';
ja['184'].skill3.description = ja['184'].skill3.description.replace('魔法の45%', '魔法攻撃（杖アイコン）の45%').replace('物理防御および魔法防御', '物理防御（オレンジ盾アイコン）および魔法防御（紫盾アイコン）');
ja['184'].skill3.table.rows[0].values = ['60', '54', '48'];

// 7. Zhong Wuyan (117)
ja['117'].skill1.cooldown += ' / 消費MP : 30';
ja['117'].skill2.cooldown += ' / 消費MP : 40';
ja['117'].skill3.cooldown += ' / 消費MP : 70';
ja['117'].skill3.description = ja['117'].skill3.description.replace('追加物理攻撃の95%', '追加物理攻撃の100%').replace('70（70+追加HPの3%）', '80（80+追加HPの3%）');
if (ja['117'].skill3.table.rows) {
  const shieldRow = ja['117'].skill3.table.rows.find(r => r.label.includes('シールド'));
  if (shieldRow) shieldRow.values = ['80', '120', '160'];
}

// 8. Xiahou Dun (126)
ja['126'].passive.description = ja['126'].passive.description.replace('追加最大HPの6%', '追加HPの6%');
ja['126'].skill1.cooldown += ' / 消費MP : 40';
ja['126'].skill1.description = ja['126'].skill1.description.replace('420', '400').replace('420', '400');
if (ja['126'].skill1.table.rows) {
  const dmgRow = ja['126'].skill1.table.rows.find(r => r.label.includes('ダメージ'));
  if (dmgRow) dmgRow.values = ['400', '480', '560', '640', '720', '800'];
}
ja['126'].skill2.cooldown += ' / 消費MP : 35';
ja['126'].skill2.description = ja['126'].skill2.description.replace('追加最大HPの12%', '追加HPの12%');
ja['126'].skill3.cooldown += ' / 消費MP : 50';
ja['126'].skill3.description = ja['126'].skill3.description.replace('420', '400').replace('420', '400').replace('追加最大HPの10%', '追加HPの10%');
if (ja['126'].skill3.table.rows) {
  const dmgRow = ja['126'].skill3.table.rows.find(r => r.label.includes('ダメージ'));
  if (dmgRow) dmgRow.values = ['400', '600', '800'];
}

// 9. Zhuangzi (113)
ja['113'].skill3.description = ja['113'].skill3.description.replace('2秒間', '1.5秒間').replace('700（700+追加HPの13%）', '600（600+追加HPの12%）');
if (ja['113'].skill3.table.rows) {
  const shieldRow = ja['113'].skill3.table.rows.find(r => r.label.includes('シールド'));
  if (shieldRow) shieldRow.values = ['600', '900', '1200'];
}

fs.writeFileSync('public/data/skills/ja.json', JSON.stringify(ja, null, 2), 'utf8');
console.log('Successfully updated ja.json!');
