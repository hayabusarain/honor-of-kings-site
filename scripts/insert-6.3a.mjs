import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: '6.3a',
    champion_name: 'マナ ブーツ',
    champion_name_en: 'BootsOfMana',
    change_type: 'nerf',
    description: '基本ステータス\n魔力：55 → 魔力：45',
    description_en: 'Base AP decreased from 55 to 45.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: 'グラトナス ブーツ',
    champion_name_en: 'GluttonousGreaves',
    change_type: 'nerf',
    description: '基本ステータス\n攻撃力：35 → 攻撃力：30',
    description_en: 'Base AD decreased from 35 to 30.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: 'バーサーカー ブーツ',
    champion_name_en: 'BerserkersGreaves',
    change_type: 'nerf',
    description: '基本ステータス\n攻撃力：20 → 攻撃力：15',
    description_en: 'Base AD decreased from 20 to 15.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: 'アイオニア ブーツ',
    champion_name_en: 'IonianBootsOfLucidity',
    change_type: 'nerf',
    description: '基本ステータス \nスキルヘイスト：30 → スキルヘイスト：+20',
    description_en: 'Ability Haste decreased from 30 to 20.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: 'ダイナミズム ブーツ',
    champion_name_en: 'BootsOfDynamism',
    change_type: 'nerf',
    description: 'ストライク\n物理防御貫通：10 → 物理防御貫通：8',
    description_en: 'Armor Penetration decreased from 10 to 8.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: 'プレート スチールキャップ',
    champion_name_en: 'PlatedSteelcaps',
    change_type: 'nerf',
    description: 'ブロック\nチャンピオンから受ける物理ダメージ軽減量：7%～10% → チャンピオンから受ける物理ダメージ軽減量：3%～10%',
    description_en: 'Physical damage reduction from champions decreased from 7%-10% to 3%-10%.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: 'マーキュリー ブーツ',
    champion_name_en: 'MercurysTreads',
    change_type: 'nerf',
    description: 'ディゾルブ： \nチャンピオンから受ける魔法ダメージを7%～12%軽減 → チャンピオンから受ける魔法ダメージを3%～12%軽減',
    description_en: 'Magic damage reduction from champions decreased from 7%-12% to 3%-12%.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: '魂の収穫',
    champion_name_en: 'DarkHarvest',
    change_type: 'new',
    description: 'キーストーンルーン：魂の収穫\n体力が50%未満の敵チャンピオンを攻撃すると、アダプティブダメージを与え、その魂を収穫し、「魂の収穫」のダメージが恒久的に10増加する。\n\n「魂の収穫」のダメージ：50 + 「魂」スタック数×10 + 増加攻撃力の25% + 魔力の15%\n\nクールダウン20秒。敵からキルまたはアシストを奪うとクールダウンが1秒にリセットされる。',
    description_en: 'New Keystone Rune: Dark Harvest. Damaging a champion below 50% HP deals adaptive damage and permanently increases Dark Harvest damage by 10.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: 'チェーンアサルト',
    champion_name_en: 'ChainAssault',
    change_type: 'new',
    description: '覇道：チェーンアサルト\n発動効果スキルで敵を攻撃すると、その敵に印がつき、次の2回の攻撃または発動効果スキルで（20～35 + 増加攻撃力の5% + 魔力の2.5%）の追加アダプティブダメージを与える。（クールダウン15秒）',
    description_en: 'New Domination Rune: Chain Assault. Hitting an enemy with an active ability marks them, causing the next 2 attacks or abilities to deal bonus adaptive damage.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: 'タイラント',
    champion_name_en: 'Tyrant',
    change_type: 'new',
    description: '覇道：タイラント\n体力が50%未満の敵チャンピオンに通常攻撃を行うと、（30～50 + 増加攻撃力の7.5% + 増加魔力の3.5%）の追加アダプティブダメージを与える。（クールダウン10秒）',
    description_en: 'New Domination Rune: Tyrant. Basic attacks against champions below 50% HP deal bonus adaptive damage.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: '堅忍不抜',
    champion_name_en: 'Fortitude',
    change_type: 'new',
    description: '不滅：堅忍不抜\n物理防御と魔法防御が5%増加する。周囲の敵チャンピオン1体ごとに、物理防御と魔法防御が追加で4%増加する（最大3体まで）。スタックが最大になると、スロウ耐性が20%増加する。',
    description_en: 'New Resolve Rune: Fortitude. Increases Armor and MR by 5%, plus 4% per nearby enemy champion (up to 3). Max stacks grant 20% slow resist.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: '追い風',
    champion_name_en: 'Celerity',
    change_type: 'new',
    description: '天啓：追い風 \nすべての増加移動速度が7%増加し、さらに増加移動速度が2%増加する。',
    description_en: 'New Inspiration Rune: Celerity. Increases all bonus movement speed by 7%, plus an additional 2% bonus MS.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: 'アクシオム アルカニスト',
    champion_name_en: 'AxiomArcanist',
    change_type: 'new',
    description: '天啓：アクシオム アルカニスト \nアルティメットスキルのダメージ、体力回復効果、シールド量が10%増加する（範囲ダメージの場合は5%）。\n\n敵からキルまたはアシストを奪うと、アルティメットスキルの現在のクールダウンが7%短縮される。',
    description_en: 'New Inspiration Rune: Axiom Arcanist. Increases Ultimate damage, healing, and shielding by 10%. Takedowns refund 7% of current Ultimate cooldown.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: '敗者の烙印',
    champion_name_en: 'MarkOfTheWeak',
    change_type: 'remove',
    description: '削除されたルーン \n覇道：敗者の烙印',
    description_en: 'Removed Domination Rune: Mark of the Weak.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: 'オンスロート',
    champion_name_en: 'Onslaught',
    change_type: 'remove',
    description: '削除されたルーン\n不滅：オンスロート',
    description_en: 'Removed Resolve Rune: Onslaught.',
    is_champion: false,
  },
  {
    version: '6.3a',
    champion_name: '狙撃手',
    champion_name_en: 'Sniper',
    change_type: 'remove',
    description: '削除されたルーン\n天啓：狙撃手',
    description_en: 'Removed Inspiration Rune: Sniper.',
    is_champion: false,
  }
];

const metaPrediction = {
  version: '6.3a',
  prediction_ja: 'ブーツ系アイテムが全体的にナーフされ、序盤のステータスによる有利が小さくなりました。一方で、攻撃的な新ルーン（魂の収穫、チェーンアサルト、タイラント）が多数追加されたため、バーストダメージやキルポテンシャルが高いチャンピオンがより脅威になり、スノーボールしやすいメタになると予想されます。',
  prediction_en: 'Overall nerfs to boot items reduce early game stat advantages. However, the introduction of aggressive new runes (such as Dark Harvest, Chain Assault, and Tyrant) will significantly enhance burst damage and kill potential. The meta is expected to favor snowballing and high-burst champions.'
};

async function main() {
  console.log('Inserting 6.3a patches...');
  
  // Clear existing patches for 6.3a to avoid duplicates
  const { error: deleteError } = await supabase
    .from('patches')
    .delete()
    .eq('version', '6.3a');

  if (deleteError) {
    console.error('Error deleting old patches:', deleteError);
  }

  const { data, error } = await supabase
    .from('patches')
    .insert(patches);

  if (error) {
    console.error('Error inserting patches:', error);
  } else {
    console.log('Successfully inserted patches.');
  }
  
  // Meta prediction
  console.log('Inserting 6.3a meta prediction...');
  const { error: metaDeleteError } = await supabase
    .from('patch_meta')
    .delete()
    .eq('version', '6.3a');

  if (metaDeleteError) {
    console.error('Error deleting old meta prediction:', metaDeleteError);
  }

  const { error: metaError } = await supabase
    .from('patch_meta')
    .insert(metaPrediction);

  if (metaError) {
    console.error('Error inserting meta prediction:', metaError);
  } else {
    console.log('Successfully inserted meta prediction.');
  }
}

main();
