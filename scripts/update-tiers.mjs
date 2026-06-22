import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const championMap = {
  "齐天大圣": { en: "MonkeyKing", ja: "ウーコン" },
  "迅捷斥候": { en: "Teemo", ja: "ティーモ" },
  "亡灵战神": { en: "Sion", ja: "サイオン" },
  "暗夜猎手": { en: "Vayne", ja: "ヴェイン" },
  "炼金术士": { en: "Singed", ja: "シンジド" },
  "深海泰坦": { en: "Nautilus", ja: "ノーチラス" },
  "符文法师": { en: "Ryze", ja: "ライズ" },
  "铁血狼母": { en: "Ambessa", ja: "アンベッサ" },
  "狂暴之心": { en: "Kennen", ja: "ケネン" },
  "腕豪": { en: "Sett", ja: "セト" },
  "德玛西亚之力": { en: "Garen", ja: "ガレン" },
  "熔岩巨兽": { en: "Malphite", ja: "マルファイト" },
  "纳祖芒荣耀": { en: "KSante", ja: "カ・サンテ" },
  "圣锤之毅": { en: "Poppy", ja: "ポッピー" },
  "祖安狂人": { en: "DrMundo", ja: "ドクター・ムンド" },
  "炽炎雏龙": { en: "Smolder", ja: "スモルダー" },
  "复仇之矛": { en: "Kalista", ja: "カリスタ" },
  "正义天使": { en: "Kayle", ja: "ケイル" },
  "机械公敌": { en: "Rumble", ja: "ランブル" },
  "暮光之眼": { en: "Shen", ja: "シェン" },
  "荒漠屠夫": { en: "Renekton", ja: "レネクトン" },
  "不灭狂雷": { en: "Volibear", ja: "ボリベア" },
  "山隐之焰": { en: "Ornn", ja: "オーン" },
  "未来守护者": { en: "Jayce", ja: "ジェイス" },
  "无畏战车": { en: "Urgot", ja: "アーゴット" },
  "沙漠死神": { en: "Nasus", ja: "ナサス" },
  "蛮族之王": { en: "Tryndamere", ja: "トリンダメア" },
  "迷失之牙": { en: "Gnar", ja: "ナー" },
  "暗裔剑魔": { en: "Aatrox", ja: "エイトロックス" },
  "刀锋舞者": { en: "Irelia", ja: "イレリア" },
  "封魔剑魂": { en: "Yone", ja: "ヨネ" },
  "放逐之刃": { en: "Riven", ja: "リヴェン" },
  "铁铠冥魂": { en: "Mordekaiser", ja: "モルデカイザー" },
  "灵罗娃娃": { en: "Gwen", ja: "グウェン" },
  "青钢影": { en: "Camille", ja: "カミール" },
  "武器大师": { en: "Jax", ja: "ジャックス" },
  "诺克萨斯之手": { en: "Darius", ja: "ダリウス" },
  "猩红收割者": { en: "Vladimir", ja: "ブラッドミア" },
  "疾风剑豪": { en: "Yasuo", ja: "ヤスオ" },
  "无双剑姬": { en: "Fiora", ja: "フィオラ" },
  "殇之木乃伊": { en: "Amumu", ja: "アムム" },
  "雪原双子": { en: "Nunu", ja: "ヌヌ＆ウィルンプ" },
  "披甲龙龟": { en: "Rammus", ja: "ラムス" },
  "岩雀": { en: "Taliyah", ja: "タリヤ" },
  "远古恐惧": { en: "Fiddlesticks", ja: "フィドルスティックス" },
  "祖安怒兽": { en: "Warwick", ja: "ワーウィック" },
  "含羞蓓蕾": { en: "Lillia", ja: "リリア" },
  "龙血武姬": { en: "Shyvana", ja: "シヴァーナ" },
  "皮城执法官": { en: "Vi", ja: "ヴァイ" },
  "德玛西亚皇子": { en: "JarvanIV", ja: "ジャーヴァンIV" },
  "痛苦之拥": { en: "Evelynn", ja: "イブリン" },
  "德邦总管": { en: "XinZhao", ja: "シン・ジャオ" },
  "无极剑圣": { en: "MasterYi", ja: "マスター・イー" },
  "战争之影": { en: "Hecarim", ja: "ヘカリム" },
  "永恒梦魇": { en: "Nocturne", ja: "ノクターン" },
  "潮汐海灵": { en: "Fizz", ja: "フィズ" },
  "不屈之枪": { en: "Pantheon", ja: "パンテオン" },
  "狂战士": { en: "Olaf", ja: "オラフ" },
  "刀锋之影": { en: "Talon", ja: "タロン" },
  "狂野女猎手": { en: "Nidalee", ja: "ニダリー" },
  "破败之王": { en: "Viego", ja: "ヴィエゴ" },
  "堕落天使": { en: "Morgana", ja: "モルガナ" },
  "时间刺客": { en: "Ekko", ja: "エコー" },
  "永猎双子": { en: "Kindred", ja: "キンドレッド" },
  "影流之主": { en: "Zed", ja: "ゼド" },
  "枪火狂徒": { en: "Graves", ja: "グレイブス" },
  "影流之镰": { en: "Kayn", ja: "ケイン" },
  "虚空掠夺者": { en: "Khazix", ja: "カ＝ジックス" },
  "傲之追猎者": { en: "Rengar", ja: "レンガー" },
  "酒桶": { en: "Gragas", ja: "グラガス" },
  "盲僧": { en: "LeeSin", ja: "リー・シン" },
};

const topData = [
  { cn: "齐天大圣", wr: 53.18, pr: 2.63, br: 0.42 },
  { cn: "迅捷斥候", wr: 53.04, pr: 4.01, br: 18.62 },
  { cn: "亡灵战神", wr: 52.79, pr: 4.05, br: 0.43 },
  { cn: "暗夜猎手", wr: 52.22, pr: 2.29, br: 12.46 },
  { cn: "炼金术士", wr: 52.09, pr: 1.55, br: 0.23 },
  { cn: "深海泰坦", wr: 51.80, pr: 2.32, br: 7.05 },
  { cn: "符文法师", wr: 51.73, pr: 1.42, br: 3.86 },
  { cn: "铁血狼母", wr: 51.70, pr: 4.02, br: 2.34 },
  { cn: "狂暴之心", wr: 51.64, pr: 1.33, br: 0.34 },
  { cn: "腕豪", wr: 51.47, pr: 14.70, br: 3.18 },
  { cn: "德玛西亚之力", wr: 51.39, pr: 15.96, br: 6.39 },
  { cn: "熔岩巨兽", wr: 51.34, pr: 5.21, br: 18.00 },
  { cn: "纳祖芒荣耀", wr: 51.24, pr: 7.82, br: 64.32 },
  { cn: "圣锤之毅", wr: 51.15, pr: 2.45, br: 0.25 },
  { cn: "祖安狂人", wr: 51.14, pr: 5.92, br: 1.13 },
  { cn: "炽炎雏龙", wr: 50.98, pr: 1.11, br: 16.37 },
  { cn: "复仇之矛", wr: 50.89, pr: 1.30, br: 3.41 },
  { cn: "正义天使", wr: 50.60, pr: 5.77, br: 0.68 },
  { cn: "机械公敌", wr: 50.50, pr: 2.87, br: 0.52 },
  { cn: "暮光之眼", wr: 50.11, pr: 3.20, br: 0.14 },
  { cn: "荒漠屠夫", wr: 50.11, pr: 4.50, br: 0.33 },
  { cn: "不灭狂雷", wr: 50.01, pr: 4.57, br: 2.64 },
  { cn: "山隐之焰", wr: 49.97, pr: 2.29, br: 0.17 },
  { cn: "未来守护者", wr: 49.59, pr: 2.80, br: 0.62 },
  { cn: "无畏战车", wr: 49.36, pr: 5.83, br: 3.30 },
  { cn: "沙漠死神", wr: 49.29, pr: 9.22, br: 3.88 },
  { cn: "蛮族之王", wr: 49.25, pr: 3.12, br: 23.04 },
  { cn: "迷失之牙", wr: 49.13, pr: 2.77, br: 0.24 },
  { cn: "暗裔剑魔", wr: 49.11, pr: 6.30, br: 5.44 },
  { cn: "刀锋舞者", wr: 48.89, pr: 1.97, br: 0.92 },
  { cn: "封魔剑魂", wr: 48.84, pr: 5.59, br: 4.86 },
  { cn: "放逐之刃", wr: 48.78, pr: 1.94, br: 0.38 },
  { cn: "铁铠冥魂", wr: 48.77, pr: 8.57, br: 14.00 },
  { cn: "灵罗娃娃", wr: 48.69, pr: 1.53, br: 0.32 },
  { cn: "青钢影", wr: 48.60, pr: 1.91, br: 0.06 },
  { cn: "武器大师", wr: 48.15, pr: 2.37, br: 0.18 },
  { cn: "诺克萨斯之手", wr: 47.84, pr: 16.04, br: 7.33 },
  { cn: "猩红收割者", wr: 47.75, pr: 1.28, br: 1.73 },
  { cn: "疾风剑豪", wr: 47.17, pr: 2.85, br: 11.87 },
  { cn: "无双剑姬", wr: 47.05, pr: 2.29, br: 0.42 },
];

const jungleData = [
  { cn: "殇之木乃伊", wr: 56.31, pr: 4.06, br: 0.14 },
  { cn: "雪原双子", wr: 55.11, pr: 1.97, br: 0.46 },
  { cn: "披甲龙龟", wr: 54.71, pr: 4.65, br: 3.86 },
  { cn: "岩雀", wr: 53.91, pr: 2.82, br: 52.31 },
  { cn: "远古恐惧", wr: 53.21, pr: 3.34, br: 2.62 },
  { cn: "祖安怒兽", wr: 53.03, pr: 3.19, br: 0.77 },
  { cn: "含羞蓓蕾", wr: 52.94, pr: 2.90, br: 0.96 },
  { cn: "龙血武姬", wr: 52.05, pr: 9.15, br: 5.74 },
  { cn: "祖安狂人", wr: 51.92, pr: 1.67, br: 1.13 },
  { cn: "皮城执法官", wr: 51.88, pr: 7.87, br: 0.67 },
  { cn: "德玛西亚皇子", wr: 51.73, pr: 7.18, br: 0.40 },
  { cn: "痛苦之拥", wr: 51.53, pr: 3.58, br: 2.24 },
  { cn: "德邦总管", wr: 50.78, pr: 10.20, br: 1.57 },
  { cn: "无极剑圣", wr: 50.54, pr: 13.44, br: 63.22 },
  { cn: "战争之影", wr: 50.54, pr: 3.53, br: 3.75 },
  { cn: "永恒梦魇", wr: 50.47, pr: 4.33, br: 8.40 },
  { cn: "潮汐海灵", wr: 50.46, pr: 3.69, br: 3.91 },
  { cn: "深海泰坦", wr: 50.42, pr: 4.35, br: 7.05 },
  { cn: "不屈之枪", wr: 50.19, pr: 6.23, br: 2.54 },
  { cn: "狂战士", wr: 50.12, pr: 1.54, br: 0.71 },
  { cn: "刀锋之影", wr: 50.04, pr: 1.66, br: 0.30 },
  { cn: "狂野女猎手", wr: 49.84, pr: 2.66, br: 2.04 },
  { cn: "蛮族之王", wr: 49.70, pr: 7.45, br: 23.04 },
  { cn: "破败之王", wr: 49.49, pr: 5.69, br: 12.00 },
  { cn: "堕落天使", wr: 49.41, pr: 1.02, br: 24.78 },
  { cn: "时间刺客", wr: 49.38, pr: 1.73, br: 0.09 },
  { cn: "永猎双子", wr: 49.24, pr: 1.73, br: 0.15 },
  { cn: "铁血狼母", wr: 48.95, pr: 1.33, br: 2.34 },
  { cn: "影流之主", wr: 48.56, pr: 2.12, br: 1.40 },
  { cn: "枪火狂徒", wr: 48.56, pr: 11.72, br: 1.13 },
  { cn: "诺克萨斯之手", wr: 48.52, pr: 4.09, br: 7.33 },
  { cn: "影流之镰", wr: 48.37, pr: 5.74, br: 0.46 },
  { cn: "虚空掠夺者", wr: 48.12, pr: 3.80, br: 0.15 },
  { cn: "武器大师", wr: 47.90, pr: 2.17, br: 0.18 },
  { cn: "傲之追猎者", wr: 47.88, pr: 1.45, br: 1.00 },
  { cn: "不灭狂雷", wr: 47.82, pr: 2.52, br: 2.64 },
  { cn: "封魔剑魂", wr: 47.71, pr: 2.40, br: 4.86 },
  { cn: "酒桶", wr: 47.39, pr: 2.05, br: 0.24 },
  { cn: "齐天大圣", wr: 47.15, pr: 3.07, br: 0.42 },
  { cn: "盲僧", wr: 46.45, pr: 13.39, br: 7.16 }
];

function getTier(wr) {
  if (wr >= 52) return 'S';
  if (wr >= 50.5) return 'A';
  if (wr >= 49.5) return 'B';
  return 'C';
}

function processData(rawData, role) {
  return rawData.map(item => {
    const mapInfo = championMap[item.cn] || { en: "Unknown", ja: item.cn };
    return {
      champion_name: mapInfo.ja,
      champion_name_en: mapInfo.en,
      win_rate: item.wr,
      pick_rate: item.pr,
      ban_rate: item.br,
      tier: getTier(item.wr),
      role: role
    };
  });
}

async function run() {
  const topRecords = processData(topData, 'TOP');
  const jungleRecords = processData(jungleData, 'JUNGLE');
  
  const allRecords = [...topRecords, ...jungleRecords];

  console.log('Deleting old TOP and JUNGLE stats...');
  await supabase.from('champion_stats').delete().in('role', ['TOP', 'JUNGLE']);

  console.log('Inserting new stats...');
  const { error } = await supabase.from('champion_stats').insert(allRecords);
  
  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Successfully updated tier lists for TOP and JUNGLE!');
  }
}

run();
