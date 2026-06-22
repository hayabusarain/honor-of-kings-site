import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const patchMetas = [
  {
    "version": "7.1d",
    "prediction_ja": "シヴィアやゼリといったレイトゲーム向けADCが強化された一方で、リーサルテンポがナーフされたため、マークスマンのビルド選択により多様性が生まれます。アーゴットやブラッドミアのバフにより、トップやミッドでのスケーリングピックが再び注目されるでしょう。ヴェインやメルのナーフによって、対面時の理不尽なプレッシャーは和らぐと予想されます。",
    "prediction_en": "With buffs to late-game hypercarries like Sivir and Zeri, alongside Lethal Tempo nerfs for ranged champions, ADC build paths will see more diversity. Buffs to Urgot and Vladimir will bring scaling picks back into the spotlight for Top and Mid lanes. Facing Vayne and Mel will be slightly less oppressive following their nerfs."
  },
  {
    "version": "7.1c",
    "prediction_ja": "「ソーンメイル」や「炎術師のクローク」といったアイテムのダメージが低下したことで、タンクや重装ファイターのパッシブなダメージアウトプットが若干低下します。サモナーズリフトのメタへの影響は限定的ですが、アリーナなどの冒険モードではオーグメントプールの最適化により、これまでとは異なる強力なシナジーがメタの主流になる可能性があります。",
    "prediction_en": "Nerfs to Thornmail and Pyromancer's Cloak will slightly reduce the passive damage output of tanks and juggernauts. While the impact on Summoner's Rift is limited, the augment pool optimization in Arena will likely give rise to new, powerful synergies."
  },
  {
    "version": "7.1b",
    "prediction_ja": "「トリニティ フォース」からキル時の移動速度上昇が削除されたことで、一部ファイターの機動力が低下し、集団戦でカイトされやすくなります。その反面、サポートアイテムのマナ回復力強化によりエンチャンターのポークが強力になり、タロンやフィズといったアサシンの強化と相まって、序盤から中盤にかけてのロームや小競り合いが試合を動かす鍵となるメタが予想されます。",
    "prediction_en": "The removal of movement speed on kill from Trinity Force will make some fighters easier to kite in teamfights. Meanwhile, mana regen buffs for Enchanter items and buffs to assassins like Talon and Fizz suggest a meta where early-to-mid game roaming and skirmishes dictate the pace of the game."
  },
  {
    "version": "7.1",
    "prediction_ja": "冒険モード（アリーナやランダムミッド）において、「雪玉チャリオット」のダメージや射程が大幅にナーフされたため、遠距離から雪玉で強引にエンゲージしてキルをもぎ取る戦術の理不尽さが解消されました。今後はエンゲージのタイミングや、ポーク構成の立ち回りがより重要視される環境になるでしょう。",
    "prediction_en": "Significant nerfs to Snowball Chariot's damage and range in Arena/ARAM mean that aggressive, cross-screen snowball engages are far less oppressive. The mode will shift toward valuing careful engage timing and traditional poke compositions."
  }
];

async function main() {
  console.log('Inserting AI Meta Predictions...');
  for (const meta of patchMetas) {
    const { error } = await supabase.from('patch_meta').insert(meta);
    if (error) {
      console.error(`Failed to insert meta for version ${meta.version}:`, error);
    } else {
      console.log(`Inserted meta prediction for version ${meta.version}`);
    }
  }
  console.log('Done.');
}

main();
