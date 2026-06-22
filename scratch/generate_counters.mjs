import fs from 'fs';
import path from 'path';

// Supabaseを使わずに静的なJSONファイルとしてカウンターデータを生成する
// 実際のアプローチA（PC版APIからの定期取得）の代わりに、
// このデモでは実装済みチャンピオン同士のカウンター相性データを生成します。

const CHAMPIONS = [
  "Aatrox", "Ahri", "Akali", "Akshan", "Alistar", "Amumu", "Annie", "Ashe", "AurelionSol", "Blitzcrank",
  "Brand", "Braum", "Caitlyn", "Camille", "Cassiopeia", "Corki", "Darius", "Diana", "DrMundo", "Draven",
  "Ekko", "Evelynn", "Ezreal", "Fiora", "Fizz", "Galio", "Garen", "Gragas", "Graves", "Gwen",
  "Hecarim", "Heimerdinger", "Irelia", "Janna", "JarvanIV", "Jax", "Jayce", "Jhin", "Jinx", "Kaisa",
  "Karma", "Kassadin", "Katarina", "Kayle", "Kayn", "Kennen", "Khazix", "Kindred", "LeeSin", "Leona",
  "Lillia", "Lucian", "Lulu", "Lux", "Malphite", "MasterYi", "MissFortune", "Morgana", "Nami", "Nasus",
  "Nautilus", "Nilah", "Norra", "Nunu", "Olaf", "Orianna", "Ornn", "Pantheon", "Pyke", "Rakan",
  "Rammus", "Renekton", "Rengar", "Riven", "Samira", "Senna", "Seraphine", "Sett", "Shen", "Shyvana",
  "Singed", "Sion", "Sivir", "Sona", "Soraka", "Swain", "Syndra", "Talon", "Teemo", "Thresh",
  "Tristana", "Tryndamere", "TwistedFate", "Twitch", "Urgot", "Varus", "Vayne", "Veigar", "Vex", "Vi",
  "Viego", "Vladimir", "Volibear", "Warwick", "Wukong", "Xayah", "XinZhao", "Yasuo", "Yone", "Yuumi",
  "Zed", "Zeri", "Ziggs", "Zoe", "Zyra"
];

const counters = {};

// 乱数で有利不利を生成（実際のPC版データのシミュレーション）
CHAMPIONS.forEach(champ => {
  counters[champ] = {
    strong_against: [],
    weak_against: []
  };

  // 他のチャンピオンをランダムにシャッフル
  const others = CHAMPIONS.filter(c => c !== champ).sort(() => 0.5 - Math.random());
  
  // 上位3体を有利、ワースト3体を不利とする
  for (let i = 0; i < 3; i++) {
    counters[champ].strong_against.push({
      champion_name_en: others[i],
      win_rate: (52 + Math.random() * 5).toFixed(1) // 52% ~ 57%
    });
  }
  for (let i = 3; i < 6; i++) {
    counters[champ].weak_against.push({
      champion_name_en: others[i],
      win_rate: (43 + Math.random() * 5).toFixed(1) // 43% ~ 48%
    });
  }
});

const outputPath = path.join(process.cwd(), 'public', 'data');
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

fs.writeFileSync(path.join(outputPath, 'counters.json'), JSON.stringify(counters, null, 2));
console.log('Successfully generated mock counter data at public/data/counters.json');
