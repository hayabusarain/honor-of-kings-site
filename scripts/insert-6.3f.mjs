import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const version = '6.3f';

const patches = [
  {
    version,
    champion_name: 'ザイラ',
    champion_name_en: 'Zyra',
    change_type: 'adjust',
    description: 'リワーク実施。植物の存在感を高める調整。「棘吹草」のステータス調整、追加効果付与。「狂い咲き」が周囲の棘吹草を激昂させるようにリワークされるなど、キット全体が変更。',
    description_en: 'Reworked to enhance plant presence and impact. Plants trigger item effects, W enrages plants.',
    is_champion: true
  },
  {
    version,
    champion_name: 'ゼド',
    champion_name_en: 'Zed',
    change_type: 'buff',
    description: 'アサシンとしての扱いやすさを向上するため、気コストを減少。「風魔手裏剣」の気コスト減少、「影分身」の気回復量増加。',
    description_en: 'Energy costs reduced for Q, energy restore increased for W to make him more accessible.',
    is_champion: true
  },
  {
    version,
    champion_name: 'ケイトリン',
    champion_name_en: 'Caitlyn',
    change_type: 'buff',
    description: 'レーン戦以降の火力を底上げするため、レベルごとの攻撃力増加量を上昇 (4 → 4.5)。',
    description_en: 'AD growth increased to improve mid-to-late game scaling.',
    is_champion: true
  },
  {
    version,
    champion_name: 'ジンクス',
    champion_name_en: 'Jinx',
    change_type: 'buff',
    description: 'アイテム変更の影響による勝率低下を補うため、「スイッチング！」ロケットのダメージ倍率を上昇。',
    description_en: 'Q rocket launcher AD ratio increased to compensate for recent item changes.',
    is_champion: true
  },
  {
    version,
    champion_name: 'ミス・フォーチュン',
    champion_name_en: 'MissFortune',
    change_type: 'nerf',
    description: '序盤のレーン戦での圧倒的な強さを抑えるため、「ダブルアップ」の基本ダメージと序盤のAD反映率を低下。',
    description_en: 'Q base damage and early AD ratio reduced to balance her oppressive laning phase.',
    is_champion: true
  },
  {
    version,
    champion_name: 'ケイル',
    champion_name_en: 'Kayle',
    change_type: 'nerf',
    description: '終盤の無敵と高火力が強力すぎるため弱体化。基本移動速度低下、Eの自動効果基本ダメージ低下、Rのダメージと反映率低下。',
    description_en: 'Base MS decreased, E passive base damage reduced, and R damage/scaling lowered to tone down her late-game godhood.',
    is_champion: true
  },
  {
    version,
    champion_name: 'コグ＝マウ',
    champion_name_en: 'KogMaw',
    change_type: 'nerf',
    description: '中盤のパワースパイクが早すぎるため、序盤の基本攻撃力を低下させ、Wの最大体力割合ダメージを低レベル帯で減少。',
    description_en: 'Base AD decreased and W max health damage reduced at early ranks to delay his power spike.',
    is_champion: true
  },
  {
    version,
    champion_name: 'アーデント センサー',
    champion_name_en: 'ArdentCenser',
    change_type: 'adjust',
    description: 'サポートの回復とシールド効果が強力すぎたため数値を低下させ、より早く購入できるよう調整。',
    description_en: 'Healing and shielding numbers reduced, cost likely adjusted for earlier purchase.',
    is_champion: false
  },
  {
    version,
    champion_name: 'フロー ウォーター スタッフ',
    champion_name_en: 'StaffOfFlowingWater',
    change_type: 'adjust',
    description: '回復とシールド効果が強力すぎたため性能を低下させ、ステータスを調整。',
    description_en: 'Healing and shielding effects reduced, base stats adjusted.',
    is_champion: false
  },
  {
    version,
    champion_name: 'フォビドゥンアイドル',
    champion_name_en: 'ForbiddenIdol',
    change_type: 'adjust',
    description: '上位アイテムの変更に合わせてステータスを調整。',
    description_en: 'Stats adjusted in line with its completed items.',
    is_champion: false
  },
  {
    version,
    champion_name: 'オケアノス トライデント',
    champion_name_en: 'OceanidsTrident',
    change_type: 'nerf',
    description: 'シールド破壊効果は維持しつつ、強力になりすぎていた基本ステータスを引き下げ。',
    description_en: 'Base stats reduced to balance its strong shield-breaking utility.',
    is_champion: false
  },
  {
    version,
    champion_name: 'ジーク コンバージェンス',
    champion_name_en: 'ZekesConvergence',
    change_type: 'nerf',
    description: 'タンクチャンピオンに過剰なダメージと追撃性能を与えていたため弱体化。',
    description_en: 'Nerfed to reduce the excessive damage and chase potential it gave to tank champions.',
    is_champion: false
  },
  {
    version,
    champion_name: 'プロトベルト エンチャント',
    champion_name_en: 'ProtobeltEnchant',
    change_type: 'nerf',
    description: 'エンチャントアイテムのダメージを減少。',
    description_en: 'Damage reduced.',
    is_champion: false
  },
  {
    version,
    champion_name: 'ゲイルフォース',
    champion_name_en: 'Galeforce',
    change_type: 'nerf',
    description: 'エンチャントアイテムのダメージを減少。',
    description_en: 'Damage reduced.',
    is_champion: false
  },
  {
    version,
    champion_name: 'ゴアドリンカー',
    champion_name_en: 'Goredrinker',
    change_type: 'nerf',
    description: 'エンチャントアイテムのダメージを減少。',
    description_en: 'Damage reduced.',
    is_champion: false
  },
  {
    version,
    champion_name: 'ストライドブレイカー',
    champion_name_en: 'Stridebreaker',
    change_type: 'nerf',
    description: 'エンチャントアイテムのダメージを減少。',
    description_en: 'Damage reduced.',
    is_champion: false
  },
  {
    version,
    champion_name: 'ハウリングアビス / ARAM',
    champion_name_en: 'ARAM',
    change_type: 'adjust',
    description: 'ハウリングアビスのマップ調整、ラララランダムミッドの新たなオーグメント追加など。',
    description_en: 'Howling Abyss map adjustments and new augments added to ARAM.',
    is_champion: false
  }
];

const patchMeta = {
  version,
  prediction_ja: 'ザイラの大幅なリワークにより、サポートやミッドレーンでのゾーニング能力が飛躍的に向上し、新たなピックとして注目されるでしょう。一方、猛威を振るっていたケイルやコグ＝マウ、ミス・フォーチュンといったキャリー陣が弱体化されたことで、ボットレーンや終盤のキャリー枠にはジンクスやケイトリンなどの台頭が予想されます。また、エンチャンター系サポートアイテムの全体的な弱体化により、タンクサポートやエンゲージ構成が相対的に有利になる可能性があります。',
  prediction_en: 'Zyra\'s rework will significantly boost her zoning capabilities, likely making her a top-tier pick in Mid or Support. With heavy nerfs to dominant late-game carries like Kayle and Kog\'Maw, as well as early-game bully Miss Fortune, champions like Jinx and Caitlyn will likely rise in the meta. Furthermore, systemic nerfs to Enchanter items may shift the support meta back towards engage and tank supports.'
};

async function insertData() {
  try {
    console.log('Inserting patches data...');
    // Delete existing patches for this version to avoid duplicates
    await supabase.from('patches').delete().eq('version', version);
    const { data: pData, error: pError } = await supabase.from('patches').insert(patches);
    if (pError) throw pError;
    console.log('Successfully inserted patches.');

    console.log('Inserting patch meta data...');
    // Delete existing meta for this version
    await supabase.from('patch_meta').delete().eq('version', version);
    const { data: mData, error: mError } = await supabase.from('patch_meta').insert(patchMeta);
    if (mError) throw mError;
    console.log('Successfully inserted patch meta.');
    
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

insertData();
