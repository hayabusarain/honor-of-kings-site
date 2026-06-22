import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    "version": "6.3d",
    "champion_name": "ユーミ",
    "champion_name_en": "Yuumi",
    "change_type": "adjust",
    "description": "パッシブが「ネコはトモダチ」に変更され、キル/アシストで「フレンドシップ」を獲得して「ベストフレンド」を強化する仕組みに。通常攻撃で回復とシールドの付与が可能。きまぐれミサイルは常にスロウを与え、ダメージが調整された。バビューン！はシールド付与と攻撃速度アップに変更。ファイナルチャプターは命中時に味方を回復し、敵にスロウを付与するように調整。",
    "description_en": "Reworked passive introducing 'Feline Friendship' to empower 'Best Friend'. Prowling Projectile now always slows. Zoomies changed to grant shield and attack speed. Final Chapter now heals allies and slows enemies on hit.",
    "is_champion": true
  },
  {
    "version": "6.3d",
    "champion_name": "ジェイス",
    "champion_name_en": "Jayce",
    "change_type": "buff",
    "description": "基本体力自動回復が7.5から10に増加。「ライトニング」の通常攻撃ごとの獲得マナと合計ダメージが増加。",
    "description_en": "Base health regen increased. Lightning mana on attack and total damage increased.",
    "is_champion": true
  },
  {
    "version": "6.3d",
    "champion_name": "グラガス",
    "champion_name_en": "Gragas",
    "change_type": "buff",
    "description": "「ハッピーアワー」と「タル転がし」のクールダウンが短縮。「タル転がし」のミニオンダメージが50%から80%に増加。「飲みすぎ注意」の基本ダメージが増加。",
    "description_en": "Happy Hour and Barrel Roll cooldowns decreased. Barrel Roll minion damage increased. Drunken Rage base damage increased.",
    "is_champion": true
  },
  {
    "version": "6.3d",
    "champion_name": "ゼリ",
    "champion_name_en": "Zeri",
    "change_type": "buff",
    "description": "基本攻撃力が54から58に増加。「スパークサージ」のクールダウンが短縮。",
    "description_en": "Base AD increased. Spark Surge cooldown decreased.",
    "is_champion": true
  },
  {
    "version": "6.3d",
    "champion_name": "ランブル",
    "champion_name_en": "Rumble",
    "change_type": "nerf",
    "description": "「スピットファイア」の基本ダメージとデンジャーゾーンの基本ダメージが減少。",
    "description_en": "Flamespitter base damage and Danger Zone damage decreased.",
    "is_champion": true
  },
  {
    "version": "6.3d",
    "champion_name": "シヴァーナ",
    "champion_name_en": "Shyvana",
    "change_type": "nerf",
    "description": "「バーンアウト」の毎秒基本ダメージと「フレイムブレス」のドラゴンフォーム時の継続炎ダメージが減少。",
    "description_en": "Burnout base damage per second and Flame Breath dragon form burn damage decreased.",
    "is_champion": true
  },
  {
    "version": "6.3d",
    "champion_name": "ヴィエゴ",
    "champion_name_en": "Viego",
    "change_type": "nerf",
    "description": "「滅びの王剣」の突きの基本ダメージと「ハートブレイカー」の範囲ダメージが減少。",
    "description_en": "Blade of the Ruined King base thrust damage and Heartbreaker AoE damage decreased.",
    "is_champion": true
  },
  {
    "version": "6.3d",
    "champion_name": "リー・シン",
    "champion_name_en": "LeeSin",
    "change_type": "nerf",
    "description": "「響掌」「共鳴撃」および「龍の怒り」の増加攻撃力反映率が減少。",
    "description_en": "Sonic Wave/Resonating Strike and Dragon's Rage bonus AD ratios decreased.",
    "is_champion": true
  },
  {
    "version": "6.3d",
    "champion_name": "ルシアン",
    "champion_name_en": "Lucian",
    "change_type": "nerf",
    "description": "「二挺拳銃」の2発目のダメージと「ピアシングライト」の基本ダメージが減少。",
    "description_en": "Lightslinger second shot damage and Piercing Light base damage decreased.",
    "is_champion": true
  },
  {
    "version": "6.3d",
    "champion_name": "ルナーン ハリケーン",
    "champion_name_en": "RunaansHurricane",
    "change_type": "buff",
    "description": "連撃の風：矢1本ごとの物理ダメージが攻撃力の55%から60%に増加。",
    "description_en": "Wind's Fury: Physical damage per bolt increased from 55% to 60% AD.",
    "is_champion": false
  },
  {
    "version": "6.3d",
    "champion_name": "ルーンのバランス調整",
    "champion_name_en": "Runes",
    "change_type": "adjust",
    "description": "電撃、フリートフットワーク、魂の収穫、溢れる力、追火の調整。",
    "description_en": "Adjustments to Electrocute, Fleet Footwork, Dark Harvest, Overheal, and Scorch.",
    "is_champion": false
  },
  {
    "version": "6.3d",
    "champion_name": "ゲームモードの変更",
    "champion_name_en": "GameModes",
    "change_type": "adjust",
    "description": "ラララランダムミッド等の調整。",
    "description_en": "Adjustments to ARAM and other game modes.",
    "is_champion": false
  }
];

const patchMeta = {
  version: '6.3d',
  prediction_ja: 'ユーミの大幅なリワークにより、サポートとしてのプレイスタイルが再定義され、チームファイトでの影響力が高まります。また、ジェイス、グラガス、ゼリがバフされたことで、各レーンでの柔軟性が増し、後半戦のADCとしてゼリのピック率上昇が期待されます。一方でランブル、シヴァーナ、ヴィエゴ、リー・シンといった強力なジャングラーが弱体化されたため、ジャングルのメタがよりバランスの取れたものになり、他のチャンピオンの台頭が予想されます。',
  prediction_en: "Yuumi's significant rework redefines her playstyle as a support, increasing her impact in team fights. Buffs to Jayce, Gragas, and Zeri provide more flexibility across lanes and expect a rise in Zeri's pick rate as a late-game ADC. Meanwhile, nerfs to strong junglers like Rumble, Shyvana, Viego, and Lee Sin will balance the jungle meta, allowing other champions to emerge."
};

async function run() {
  console.log('Inserting patch meta...');
  const { error: metaDeleteError } = await supabase.from('patch_meta').delete().eq('version', '6.3d');
  if (metaDeleteError) console.error('Error deleting old meta:', metaDeleteError);
  
  const { error: metaInsertError } = await supabase.from('patch_meta').insert(patchMeta);
  if (metaInsertError) {
    console.error('Error inserting meta:', metaInsertError);
  } else {
    console.log('Successfully inserted patch meta.');
  }

  console.log('Inserting patches...');
  const { error: patchDeleteError } = await supabase.from('patches').delete().eq('version', '6.3d');
  if (patchDeleteError) console.error('Error deleting old patches:', patchDeleteError);

  const { error: patchInsertError } = await supabase.from('patches').insert(patches);
  if (patchInsertError) {
    console.error('Error inserting patches:', patchInsertError);
  } else {
    console.log('Successfully inserted patches.');
  }
}

run();
