import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: '6.3e',
    champion_name: 'コグ＝マウ',
    champion_name_en: 'KogMaw',
    change_type: 'new',
    description: '新チャンピオン。イカシアの荒れ地の奥深くにあるヴォイドの浸食から生まれたコグ＝マウは腐食性の大きな口を持つ好奇心旺盛な腐敗した生物だ。',
    description_en: 'New Champion: Kog\'Maw. A curious and corrosive creature from the Void.',
    is_champion: true
  },
  {
    version: '6.3e',
    champion_name: 'ユーミ',
    champion_name_en: 'Yuumi',
    change_type: 'buff',
    description: '序盤の性能を強化。固有スキル、Q、W、Eの回復・シールド量やダメージが向上。',
    description_en: 'Early game buffs. Increased damage, healing, and shielding across her abilities.',
    is_champion: true
  },
  {
    version: '6.3e',
    champion_name: 'イブリン',
    champion_name_en: 'Evelynn',
    change_type: 'buff',
    description: 'ジャングル周回がスムーズに。Qの基本ダメージとミニオンに対するダメージが増加。',
    description_en: 'Smoother jungle clear. Increased Q base damage and damage to minions.',
    is_champion: true
  },
  {
    version: '6.3e',
    champion_name: 'カリスタ',
    champion_name_en: 'Kalista',
    change_type: 'buff',
    description: '味方と協力して確実に敵を仕留められるように。Eのダメージ増加とRのクールダウン短縮。',
    description_en: 'Better synergy with allies. Increased E damage and reduced R cooldown.',
    is_champion: true
  },
  {
    version: '6.3e',
    champion_name: 'ニダリー',
    champion_name_en: 'Nidalee',
    change_type: 'nerf',
    description: 'ダメージ抑制。基本攻撃力低下、クーガー形態のQのダメージが低下。',
    description_en: 'Damage output reduced. Lowered base AD and cougar Q damage.',
    is_champion: true
  },
  {
    version: '6.3e',
    champion_name: 'ティーモ',
    champion_name_en: 'Teemo',
    change_type: 'nerf',
    description: 'キノコの爆発力が低下。QとRの魔力反映率が減少。',
    description_en: 'Mushroom burst reduced. Lowered AP ratios on Q and R.',
    is_champion: true
  },
  {
    version: '6.3e',
    champion_name: 'モルガナ',
    champion_name_en: 'Morgana',
    change_type: 'nerf',
    description: 'スキル連打を抑制。Wによるクールダウン短縮効果が減少。',
    description_en: 'Skill spamming nerfed. Reduced cooldown refund on W.',
    is_champion: true
  },
  {
    version: '6.3e',
    champion_name: 'ヴェイン',
    champion_name_en: 'Vayne',
    change_type: 'nerf',
    description: '機動性を抑制。Qの序盤のクールダウンが延長。',
    description_en: 'Mobility nerfed. Increased Q cooldown in the early game.',
    is_champion: true
  },
  {
    version: '6.3e',
    champion_name: 'ブラッドサースター',
    champion_name_en: 'Bloodthirster',
    change_type: 'adjust',
    description: '価格低下、攻撃力増加、最大体力追加。攻撃速度とライフライン効果が削除。',
    description_en: 'Adjusted: Lower price, added Max HP, removed Attack Speed and Lifeline passive.',
    is_champion: false
  },
  {
    version: '6.3e',
    champion_name: 'ファントムダンサー',
    champion_name_en: 'PhantomDancer',
    change_type: 'buff',
    description: '攻撃速度と移動速度増加の持続時間が6秒に延長、クールダウンが10秒に短縮。',
    description_en: 'Buffed: Increased buff duration and reduced cooldown.',
    is_champion: false
  },
  {
    version: '6.3e',
    champion_name: 'マグネティック ブラスター',
    champion_name_en: 'MagneticBlaster',
    change_type: 'adjust',
    description: '価格上昇。チャンピオンへのダメージが低下し、ミニオンへの追加ダメージが上昇。',
    description_en: 'Adjusted: Increased price, lower damage to champions, higher damage to minions.',
    is_champion: false
  },
  {
    version: '6.3e',
    champion_name: 'デス ダンス',
    champion_name_en: 'DeathsDance',
    change_type: 'nerf',
    description: '物理・魔法ダメージの蓄積量が30%から27%へ低下。',
    description_en: 'Nerfed: Damage storage reduced from 30% to 27%.',
    is_champion: false
  },
  {
    version: '6.3e',
    champion_name: 'リーライ クリスタル セプター',
    champion_name_en: 'RylaisCrystalScepter',
    change_type: 'nerf',
    description: 'スロウ効果の持続時間が1秒から0.75秒へ短縮。',
    description_en: 'Nerfed: Slow duration reduced to 0.75 seconds.',
    is_champion: false
  },
  {
    version: '6.3e',
    champion_name: 'バーサーカー ブーツ',
    champion_name_en: 'BerserkersGreaves',
    change_type: 'buff',
    description: '通常攻撃命中時の体力回復量が8から10に増加。',
    description_en: 'Buffed: Increased healing on hit.',
    is_champion: false
  },
  {
    version: '6.3e',
    champion_name: 'マーキュリー ブーツ',
    champion_name_en: 'MercurysTreads',
    change_type: 'nerf',
    description: 'チャンピオンから受ける魔法ダメージ軽減量が3%～12%から3%～10%に低下。',
    description_en: 'Nerfed: Reduced magic damage reduction.',
    is_champion: false
  },
  {
    version: '6.3e',
    champion_name: 'プレート スチールキャップ',
    champion_name_en: 'PlatedSteelcaps',
    change_type: 'nerf',
    description: 'チャンピオンから受ける物理ダメージ軽減量が3%～10%から3%～9%に低下。',
    description_en: 'Nerfed: Reduced physical damage reduction.',
    is_champion: false
  },
  {
    version: '6.3e',
    champion_name: 'ガーゴイル エンチャント',
    champion_name_en: 'GargoyleEnchant',
    change_type: 'nerf',
    description: 'シールドの基本量および物理・魔法防御に応じた上限値が低下。',
    description_en: 'Nerfed: Reduced base shield and bonus shield from resistances.',
    is_champion: false
  }
];

const patchMeta = {
  version: '6.3e',
  prediction_ja: 'パッチ6.3eでは、コグ＝マウの登場によりレイトゲームのキャリーポテンシャルが高まるマークスマンメタが予想されます。ユーミやカリスタの強化により、ボットレーンでのスノーボールがより強力になるでしょう。一方、防具ブーツやガーゴイルエンチャントなどの耐久系アイテムが弱体化されたことで、アサシンやバーストダメージを持つチャンピオンのキルラインが下がり、より攻撃的な立ち回りが求められる環境になりそうです。ブラッドサースターの変更でファイターやADCのビルドパスに変化が生じる点にも注目です。',
  prediction_en: 'In Patch 6.3e, the introduction of Kog\'Maw will likely shift the meta towards late-game hyper-carries. Buffs to Yuumi and Kalista amplify the snowball potential in the Dragon Lane. Systemic nerfs to defensive boots and Gargoyle Enchant lower the survivability of many champions, indirectly buffing assassins and burst-heavy team comps. The rework to Bloodthirster will prompt new build paths for fighters and marksmen.'
};

async function main() {
  console.log('Inserting patch data for version 6.3e...');
  
  // Clean up old data for this patch to avoid duplicates
  const { error: deleteError } = await supabase
    .from('patches')
    .delete()
    .eq('version', '6.3e');
    
  if (deleteError) {
    console.error('Error deleting old patches:', deleteError);
  } else {
    console.log('Successfully cleared old patches for 6.3e.');
  }

  const { error: insertError } = await supabase
    .from('patches')
    .insert(patches);

  if (insertError) {
    console.error('Error inserting patches:', insertError);
  } else {
    console.log('Successfully inserted patches for 6.3e.');
  }

  // Meta prediction
  const { error: deleteMetaError } = await supabase
    .from('patch_meta')
    .delete()
    .eq('version', '6.3e');
    
  if (deleteMetaError) {
    console.error('Error deleting old patch_meta:', deleteMetaError);
  }

  const { error: insertMetaError } = await supabase
    .from('patch_meta')
    .insert(patchMeta);

  if (insertMetaError) {
    console.error('Error inserting patch_meta:', insertMetaError);
  } else {
    console.log('Successfully inserted patch_meta for 6.3e.');
  }
  
  console.log('Done!');
}

main();
