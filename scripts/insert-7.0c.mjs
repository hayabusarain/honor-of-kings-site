import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: '7.0c',
    champion_name: 'ノラ',
    champion_name_en: 'Norra',
    change_type: 'buff',
    description: 'ノラは生存力とウェーブクリア能力が他のメイジに比べてやや不足しているため、リスクを背負わずに他のメイジに追いつけるよう、これらの面で強化を行います。あわせて、ノラがランク戦に登場した際にさらに輝けるよう、彼女のメカニクスについても整理とクオリティー向上を実施します。\n\n愛用のトリンケット\nチャンピオンに命中時のクールダウン短縮：1.5秒 → 最大クールダウンの20%\n\n記憶の波動\nチャージ開始時のスロウ効果：25% → 20%\nチャージ中の最大スロウ効果：55% → 30%\nクールダウン：8/7/6/5秒 → 7.5/6.5/5.5/4.5秒\n基本ダメージ：60/110/160/210 → 60/120/180/240\n\nどこでもない場所へ\nスキル発動中のスレッドのサイズ増加効果の持続時間計算を最適化しました。これにより、対象が異次元にいる間は、サイズ増加効果のタイマーが一時停止するようになります。\n\n帰郷のスレッド\n[NEW] モンスターとミニオンには115%のダメージを与える',
    description_en: 'Enhanced survivability and wave clear. Trinket CD refund adjusted. Skill 1 slow reduced but damage increased and CD reduced. Portal timer optimized. Portal now deals 115% damage to monsters and minions.',
    is_champion: true
  },
  {
    version: '7.0c',
    champion_name: 'ライズ',
    champion_name_en: 'Ryze',
    change_type: 'adjust',
    description: 'ライズのスキルコンボの対象ロジックを最適化し、攻撃の精度を向上しました。\n\nオーバーロード\n「スペルフラックス→オーバーロード」（スキル3→1）コンボの対象ロジックを調整しました。このコンボを素早く連続で繰り出すとき、「オーバーロード」（スキル1）が「スペルフラックス」（スキル3）のマークが付いた対象を優先して攻撃するようになりました。',
    description_en: 'Skill target logic optimized for E->Q combo. Q will now prioritize targets marked with E when cast in rapid succession.',
    is_champion: true
  },
  {
    version: '7.0c',
    champion_name: 'アーリ',
    champion_name_en: 'Ahri',
    change_type: 'adjust',
    description: 'アーリのスキルの使用感と対象ロジックを最適化し、集団戦でより活躍できるようにしました。\n\nフォックスファイア\nアーリの「フォックスファイア」（スキル2）の対象ロジックを最適化しました。通常攻撃または「チャーム」（スキル3）で敵にマークを付与すると、「フォックスファイア」（スキル2）の拡散が抑えられます。\n\nチャーム\n「チャーム」（スキル3）の操作感を最適化し、「チャーム→フラッシュ」のコンボ（スキル3→フラッシュ）をより簡単に行えるようにすることで、ハイライト級のプレイを生み出しやすくしました。',
    description_en: 'Optimized skill feel and targeting logic. W targeting logic improved when marking enemies with auto attacks or E. E->Flash combo made easier.',
    is_champion: true
  },
  {
    version: '7.0c',
    champion_name: 'バード',
    champion_name_en: 'Bard',
    change_type: 'nerf',
    description: 'バードの序盤のプレッシャーは強力すぎる状態でした。高いダメージと長い通常攻撃の射程により、敵に対して安全にハラスやゾーニングを行えていました。そこで、敵が対抗できる機会を確保できるように調整を行います。\n\n基本ステータス\n射程距離：550 → 500\n\n宇宙の法則\n基本ダメージ：90/140/190/240 → 80/130/180/230\nエネルギー弾の飛翔速度を低下させました。\nエネルギー弾の当たり判定の幅を狭くしました。',
    description_en: 'Attack range decreased. Q base damage reduced, projectile speed slowed, and hit box width narrowed to reduce early pressure.',
    is_champion: true
  },
  {
    version: '7.0c',
    champion_name: 'ナサス',
    champion_name_en: 'Nasus',
    change_type: 'nerf',
    description: '最近のタワーの調整により、ナサスの序盤のファームは安定しましたが、その強力なスロウ効果は対戦相手にとって非常に厄介な存在にもなっています。ナサスのスロウ効果のスケーリング曲線を調整し、自動効果による序盤のサステインを低下させました。これにより、対戦相手が彼の成長を妨げる機会が増えるでしょう。\n\nソウルイーター\n物理ヴァンプ：8/16/24%（チャンピオンレベル1/5/9） → 6/12/18/24%（チャンピオンレベル1/5/9/13）\n\nウィザー\nスロウ効果は最初の4秒間で徐々に増加して45/60/75/90%に達し、最後の1秒間は最大スロウ効果が維持される → スロウ効果は5秒間かけて徐々に増加して45/60/75/90%に達する',
    description_en: 'Passive physical vamp reduced at early levels. W slow scaling curve adjusted to build up over 5 seconds instead of 4.',
    is_champion: true
  },
  {
    version: '7.0c',
    champion_name: 'アッシュ',
    champion_name_en: 'Ashe',
    change_type: 'buff',
    description: '今回のアップデートでは、アイテムの変更によってマークスマン全体が強化されました。しかし、ここ最近のアッシュのパフォーマンスが芳しくないため、他のマークスマンに追いつけるよう彼女の能力を強化することにしました。\n\n基本ステータス\n基本体力：600 → 630\n\nレンジャーフォーカス\n攻撃速度増加：15/25/35/45% → 20/30/40/50%',
    description_en: 'Base HP increased. Q attack speed boost increased to help her compete with other marksmen.',
    is_champion: true
  },
  {
    version: '7.0c',
    champion_name: 'マスター・イー',
    champion_name_en: 'MasterYi',
    change_type: 'nerf',
    description: '新アイテムがリフトのゲームプレイに新鮮さをもたらしていることを嬉しく思いますが、その強さは適正な範囲に留めておく必要があります。マスター・イーと「グインソー レイジブレード」のシナジーは想定以上に強力で、カウンタープレイの余地がほとんどありませんでした。そこで、「アルファストライク」のクールダウンを延長し、全体的なダメージも調整することで、スケールは維持しつつも対処しやすくしました。\n\nアルファストライク\nクールダウン：16/15/14/13秒 → 17/16/15/14秒\nダメージ：30/70/110/150 → 20/60/100/140\nモンスターとミニオンへの追加ダメージ：95/125/155/185 → 105/135/165/195',
    description_en: 'Q cooldown increased and base damage reduced to tone down synergy with Guinsoo\'s Rageblade. Monster bonus damage increased to compensate for jungle clear.',
    is_champion: true
  },
  {
    version: '7.0c',
    champion_name: 'カタリナ',
    champion_name_en: 'Katarina',
    change_type: 'buff',
    description: 'カタリナは最上位帯では活躍していますが、大多数のプレイヤーにとっては依然として扱いづらく、特に「クイックシルバー エンチャント」の変更による影響が出ています。今回の変更によって序盤から中盤にかけての交戦力と柔軟性が強化され、早期から機動力を活かしてスノーボールを狙えるようになるでしょう。\n\n基本ステータス\n基本物理防御：30 → 34\n\n瞬歩\nクールダウン：14/12/10/8秒 → 11/10/9/8秒',
    description_en: 'Base armor increased. E cooldown reduced at early levels to improve early-mid game skirmishing.',
    is_champion: true
  },
  {
    version: '7.0c',
    champion_name: 'ルインドキング ブレード',
    champion_name_en: 'BladeOfTheRuinedKing',
    change_type: 'buff',
    description: '「ルインドキング ブレード」は通常攻撃時効果を主軸とするマークスマンにとって重要なアイテムですが、戦闘での有効性は私たちが望む水準に達していません。特に、このアイテムのステータスをより効果的に活用できる近接攻撃チャンピオンと比較すると、その差は明らかです。そのため、遠隔攻撃チャンピオンが使用した際の自動効果を強化し、マークスマン向けのコアアイテムとしての競争力を高めます。',
    description_en: 'Passive effects enhanced for ranged champions to increase its viability as a core item for marksmen.',
    is_champion: false
  },
  {
    version: '7.0c',
    champion_name: 'テルミヌス',
    champion_name_en: 'Terminus',
    change_type: 'buff',
    description: '終盤の集団戦における通常攻撃時効果中心のマークスマンのパフォーマンスを向上させるため、「テルミヌス」のコストパフォーマンスを強化します。',
    description_en: 'Cost-effectiveness improved to boost the performance of on-hit marksmen in late-game team fights.',
    is_champion: false
  },
  {
    version: '7.0c',
    champion_name: 'ウィッツ エンド',
    champion_name_en: 'WitsEnd',
    change_type: 'buff',
    description: '「ウィッツ エンド」の効果は遠隔攻撃チャンピオンにとっては弱すぎたため、十分なサステインと回復効果を発揮しにくい状態でした。そこで、遠隔攻撃チャンピオンが使用した際の自動効果を強化します。',
    description_en: 'Passive effects enhanced for ranged champions to improve sustain and healing.',
    is_champion: false
  },
  {
    version: '7.0c',
    champion_name: 'デス ダンス',
    champion_name_en: 'DeathsDance',
    change_type: 'nerf',
    description: '「デス ダンス」がファイターにもたらす生存能力が過剰であったため、コストをわずかに増加させて費用対効果を調整します。',
    description_en: 'Cost slightly increased to adjust its cost-effectiveness, as it was providing excessive survivability to fighters.',
    is_champion: false
  },
  {
    version: '7.0c',
    champion_name: 'クイックシルバー エンチャント',
    champion_name_en: 'QuicksilverEnchant',
    change_type: 'nerf',
    description: '「クイックシルバー エンチャント」はクールダウンが短すぎる上に行動妨害無効の効果時間も長いため、アルティメットスキルの行動妨害に頼るチャンピオンにとって、アイテムのクールダウンの隙を突くのが難しくなっています。また、耐久力の低いチャンピオンがアサシンやファイターによるエンゲージに対抗するのも困難になっています。そこで、行動妨害を得意とするチャンピオンがその強みをもっと発揮できるように、このアイテムを弱体化します。',
    description_en: 'Weakened to allow CC-reliant champions more opportunities, as its short cooldown and long CC immunity duration were oppressive.',
    is_champion: false
  },
  {
    version: '7.0c',
    champion_name: '不滅パス',
    champion_name_en: 'Resolve',
    change_type: 'nerf',
    description: '全体のダメージ量を抑えたこともあり、キルタイムが極端に短くならないよう目指しています。しかし、現状としてルーンの「不滅」パスが全体的に強力すぎるため、過度なパワーを持つ一部のルーンを調整し、各クラスの特徴をより的確に強化できる形にします。',
    description_en: 'Overperforming runes in the Resolve path adjusted to ensure each class\'s characteristics are appropriately enhanced without making TTK too slow.',
    is_champion: false
  },
  {
    version: '7.0c',
    champion_name: 'アリーナ',
    champion_name_en: 'Arena',
    change_type: 'adjust',
    description: 'チャンピオンのバランス調整\nノラ、ヴェックス\n\nオーグメントのバランス調整\nピックスアタック、電撃連鎖',
    description_en: 'Balance adjustments for champions (Norra, Vex) and augments (Pix Attack, Chain Lightning) in Arena mode.',
    is_champion: false
  }
];

const meta = {
  version: '7.0c',
  prediction_ja: 'パッチ7.0cでは、遠隔攻撃チャンピオン向けの「ルインドキング ブレード」や「テルミヌス」、「ウィッツ エンド」の強化により、オンヒット系マークスマンの存在感が高まるでしょう。さらにアッシュの直接強化も相まって、ADCが試合をキャリーしやすい環境になると予想されます。一方、「デス ダンス」の弱体化によってファイターの生存能力が低下し、相対的にマークスマンの地位が向上します。また、マスター・イーやナサス、バードといった序盤・中盤で高い影響力を持つチャンピオンが軒並みナーフされたことで、試合展開がやや落ち着き、スケーリングを重視する構成が有利になる可能性があります。メイジ・アサシン層ではカタリナの序盤強化やアーリの操作性向上が入るため、ミッドレーンでの主導権争いがよりアクティブになりそうです。',
  prediction_en: 'In Patch 7.0c, the buffs to ranged on-hit items like Blade of the Ruined King, Terminus, and Wit\'s End, coupled with Ashe\'s direct buff, will likely elevate the prominence of on-hit marksmen, creating an environment where ADCs can more easily carry. Meanwhile, the nerf to Death\'s Dance reduces fighter survivability, further solidifying the marksmen\'s relative power. Nerfs to early-mid game powerhouses like Master Yi, Nasus, and Bard suggest a slightly more stabilized early game, favoring scaling team compositions. In the mid lane, Katarina\'s early-game buffs and Ahri\'s logic optimizations will likely make skirmishes for priority much more active and rewarding.',
};

async function run() {
  try {
    console.log('Deleting existing 7.0c patches...');
    await supabase.from('patches').delete().eq('version', '7.0c');
    
    console.log('Inserting 7.0c patches...');
    const { error } = await supabase.from('patches').insert(patches);
    if (error) throw error;
    
    console.log('Deleting existing 7.0c meta...');
    await supabase.from('patch_meta').delete().eq('version', '7.0c');
    
    console.log('Inserting 7.0c meta...');
    const { error: metaError } = await supabase.from('patch_meta').insert(meta);
    if (metaError) throw metaError;
    
    console.log('SUCCESS');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
