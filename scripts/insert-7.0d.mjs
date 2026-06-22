import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: '7.0d',
    champion_name: 'メル',
    champion_name_en: 'Mel',
    change_type: 'new',
    description: 'メル・メダルダは、かつてはノクサスで最も権勢を誇ったメダルダ家の後継者と目される人物。表向きは優雅な貴族のように見えるが、その実体は、出会う相手のすべてについて知り尽くそうとする、卓越した政治家である。謎に満ちた黒薔薇団との邂逅を経て、母の欺瞞の深さを知ることとなったメルは、自分自身の手に余る可能性がある状況に直面する。新たに目覚めた魔法の力を携え、答えを求めて故郷へと出帆したメル。その内なる光を押さえ込もうとする者は後を絶たないが、彼女の魂が屈することは決してない。\n\nメルは日本時間3月13日09時01分にリリースされます。',
    description_en: 'Mel is introduced as a new champion. She is a powerful politician from Noxus with newly awakened magical powers. She will be released on March 13.',
    is_champion: true
  },
  {
    version: '7.0d',
    champion_name: 'フィドルスティックス',
    champion_name_en: 'Fiddlesticks',
    change_type: 'adjust',
    description: 'フィドルスティックスは全体的にパフォーマンスが低く、意図しないテクニックがいくつか存在することで、上達への道筋が不明瞭になっていました。この変更により、彼の強さの分かりにくい部分を取り除き、その分の強さを彼の核となるゲームプレイに戻すことを目指しています。さらに、彼の固有スキルは効果が分かりにくく、どう反応すべきか敵の判断を迷わせる一方で、戦略的な価値もありませんでした。そこで、リターンと総合的なダメージ、クラウドコントロール性能を向上させ、トリッキーな要素への依存度を下げ、スキル下限とスキル上限の差を縮めることにしました。また、彼のパッシブである「身代わり人形」の明瞭性を向上させ、発動時のカウンタープレイと効果の両方を、より明確でインパクトのあるものにします。\n\n【無害なカカシ】(固有スキル)\n[New] キルまたはアシストを達成すると、最も近くにいる敵に向かって歩く「身代わり人形」を召喚する。3秒後、または対象に到達すると爆発し、周囲の敵チャンピオンに「フィアー」を与える。\n\n【テラー】\n[削除] 経路上にいる対象に「フィアー」を与える。\n[New] 選択した対象に「フィアー」を与える。\nフィアー効果時間：1/1.1/1.2/1.3秒 → 1.2/1.4/1.6/1.8秒\n\n【豊かな収穫】\n[New] 発動中、フィドルスティックスは30%のスロウ状態になる。\n[New] スキルの詠唱を完了するか、詠唱が終了する前に範囲内のすべての対象をキルすると、このスキルのクールダウンが50%短縮される。\n[New] 1秒後、このスキルを再発動して早めに終了できる。\n[New] 詠唱中、フィドルスティックスはその他のスキルや通常攻撃を使用できない。\nクールダウン：8/7.5/7/6.5秒 → 11/10/9/8秒\n毎秒ダメージ：60/90/120/150 + 魔力の25% → 60/90/120/150 + 魔力の35%\n対象の減少体力に応じたダメージ：減少体力の10/11.5/13/14.5% → 12/14/16/18%\n\n【クロウストーム】\n0.25秒ごとのダメージ：25/42.5/60 + 魔力の10% → 30/50/70 + 魔力の10%',
    description_en: 'Fiddlesticks receives an adjustment. Passive reworked to summon an effigy on takedown. Q now targets specifically. W slows him, has cooldown refund on full channel/kill, can be recast to end early, locks out other actions, cooldown and damage increased. R damage increased.',
    is_champion: true
  },
  {
    version: '7.0d',
    champion_name: 'ザヤ',
    champion_name_en: 'Xayah',
    change_type: 'buff',
    description: 'オートエイム使用時のザヤのアルティメットスキルは、近くに攻撃可能な対象がいない場合には信頼性が低く、飛んでくる遠隔攻撃を効果的に回避できないことが判明しました。そこで、使いやすさを最適化しました。\n\n【フェザーストーム】\n[New] 近くにターゲットがいない場合でも、タップでスキルを発動できるようになりました。',
    description_en: 'Xayah\'s ultimate (Featherstorm) can now be cast with a simple tap even when there are no targets nearby, improving reliability for dodging.',
    is_champion: true
  },
  {
    version: '7.0d',
    champion_name: 'レル',
    champion_name_en: 'Rell',
    change_type: 'buff',
    description: '最近のレルは少々手綱が緩すぎる状態にあるようです。ルーンの変更によって耐久力が他のサポートに比べて見劣りするようになったため、生存能力と序盤のレーン戦での交戦力を強化することで、彼女が再び疾走できるように後押しします。\n\n【基本ステータス】\n基本物理防御：40 → 46\n基本攻撃力：58 → 62\n\n【破鋼撃】\nダメージ：70/125/180/235 → 70/130/190/250',
    description_en: 'Rell base armor and attack damage increased. Q (Shattering Strike) damage increased.',
    is_champion: true
  },
  {
    version: '7.0d',
    champion_name: 'ノラ',
    champion_name_en: 'Norra',
    change_type: 'nerf',
    description: '現在ノラはスキル2の行動妨害によってサポートロールにより圧倒的な強さを見せており、想定を上回る活躍をしています。このダメージを低下させ、中盤から終盤にかけてのクールダウンを延長することで、相手が反撃できる機会を増やします。\n\n【どこでもない場所へ】\nクールダウン：18/16.5/15/13.5秒 → 18/17/16/15秒\nダメージ：75/115/155/195 → 65/105/145/185',
    description_en: 'Norra W (Portal) cooldown increased and damage decreased to reduce her dominant crowd control presence as a support.',
    is_champion: true
  },
  {
    version: '7.0d',
    champion_name: 'モルデカイザー',
    champion_name_en: 'Mordekaiser',
    change_type: 'buff',
    description: 'モルデカイザーは、アルティメットで奪った増加攻撃力の効果を実感しにくい状態でした。そこで、スキル1の増加攻撃力反映率を増加させました。これにより、奪ったステータスの意義が向上し、アイテムビルドの選択肢も広がります。\n\n【滅魂の一撃】\nダメージ：80/110/140/170（+4～70（チャンピオンレベルに応じて））（+魔力の70%）） → 80/110/140/170（+4～70（チャンピオンレベルに応じて））（+魔力の70%）（+増加攻撃力の120%）',
    description_en: 'Mordekaiser Q (Obliterate) now scales with 120% bonus AD, making the AD stolen from his ultimate more impactful.',
    is_champion: true
  },
  {
    version: '7.0d',
    champion_name: 'ヘカリム',
    champion_name_en: 'Hecarim',
    change_type: 'adjust',
    description: '高レベル帯では、ヘカリムが序盤のローム性能の高さによって圧倒的な活躍を見せています。そこで序盤のダメージを抑え、終盤の勢いを強化しました。\n\n【基本ステータス】\n基本攻撃力：58 → 54\nレベルアップごとの攻撃力増加量：3.6 → 4\n\n【ソウルドレイン】\nダメージ：15/20/25/30 → 12/18/24/30',
    description_en: 'Hecarim base AD decreased but AD growth increased. W (Spirit of Dread) damage adjusted, decreasing early but matching late game.',
    is_champion: true
  },
  {
    version: '7.0d',
    champion_name: 'クラーケン スレイヤー',
    champion_name_en: 'KrakenSlayer',
    change_type: 'new',
    description: 'マークスマン向けに、通常攻撃時効果を持つアイテムを新たに追加します。これにより、継続的な戦闘で高いダメージを与えられるようになるでしょう。',
    description_en: 'New on-hit item added for marksmen to deal sustained damage in combat.',
    is_champion: false
  },
  {
    version: '7.0d',
    champion_name: '騎士の誓い',
    champion_name_en: 'KnightsVow',
    change_type: 'new',
    description: 'サポート向けに、味方1人を守ることに特化した新アイテムが登場します。このアイテムを装備すると、味方のダメージを一部肩代わりしつつ、自分の体力を回復できるようになります。',
    description_en: 'New support item to protect an ally, absorbing some of their damage and healing the user.',
    is_champion: false
  },
  {
    version: '7.0d',
    champion_name: '覇王のブラッドメイル',
    champion_name_en: 'OverlordsBloodmail',
    change_type: 'new',
    description: 'ファイター向けに、体力が低下した際に大量の攻撃力を獲得して反撃を可能にする、新たな逆転用アイテムを追加します。',
    description_en: 'New fighter item that grants massive Attack Damage when health is low for turnaround plays.',
    is_champion: false
  },
  {
    version: '7.0d',
    champion_name: '終わりなき絶望',
    champion_name_en: 'UnendingDespair',
    change_type: 'new',
    description: 'タンク向けに、戦闘中に継続的に回復しながら敵にダメージを与え続けられるサステインアイテムを実装します。',
    description_en: 'New tank item providing sustained healing and continuous damage in combat.',
    is_champion: false
  },
  {
    version: '7.0d',
    champion_name: '実験的ヘクスプレート',
    champion_name_en: 'ExperimentalHexplate',
    change_type: 'new',
    description: 'ファイター向けに、アルティメットスキル使用後に大幅なパワーを得られる、まったく新しいアルティメットスキルアイテムを追加します。',
    description_en: 'New fighter item that grants significant power after casting an ultimate ability.',
    is_champion: false
  },
  {
    version: '7.0d',
    champion_name: 'タイタン ハイドラ',
    champion_name_en: 'TitanicHydra',
    change_type: 'adjust',
    description: 'タイタン ハイドラがステータスを得る方法を調整しました。今後は体力ベースではなく、購入時に直接一定量の攻撃力が付与されるようになります。',
    description_en: 'Titanic Hydra no longer grants AD based on health; it now provides a flat amount of Attack Damage directly upon purchase.',
    is_champion: false
  },
  {
    version: '7.0d',
    champion_name: 'ラララランダムミッド',
    champion_name_en: 'ARAM',
    change_type: 'adjust',
    description: '今回のパッチで、15種類の全く新しいオーグメントが追加されました。さらに、過去に人気だった4つのオーグメントと8つのイースターエッグが復活します。',
    description_en: 'ARAM receives 15 new augments, 4 returning popular augments, and 8 easter eggs.',
    is_champion: false
  },
  {
    version: '7.0d',
    champion_name: 'アリーナ',
    champion_name_en: 'Arena',
    change_type: 'adjust',
    description: '炎術師のクローク、モーグル メイルの調整など',
    description_en: 'Adjustments made to Arena items like Pyromancer Cloak and Mogul Mail.',
    is_champion: false
  },
  {
    version: '7.0d',
    champion_name: 'ゾーイ(バグ修正)',
    champion_name_en: 'ZoeBugFix',
    change_type: 'adjust',
    description: 'ゾーイの「スリープバブル」をオートエイムで使用した際、標的の位置を余分に索敵してしまう不具合を修正しました。',
    description_en: 'Fixed a bug where Zoe\'s Sleepy Trouble Bubble would over-track target locations when using auto-aim.',
    is_champion: false
  }
];

const meta = {
  version: '7.0d',
  prediction_ja: 'パッチ7.0dでは新チャンピオンのメルが登場し、メタに新たな風を吹き込みます。また、多数の新アイテム（クラーケンスレイヤー、騎士の誓い、覇王のブラッドメイル、終わりなき絶望、実験的ヘクスプレート）の追加により、マークスマン、サポート、ファイター、タンクそれぞれのビルドの幅が大きく広がります。特にファイターは新たなアイテムを活用することでスプリットプッシュや集団戦での影響力が増しそうです。チャンピオン調整では、フィドルスティックスが大幅にリワークされ操作性が改善し、レルやモルデカイザーの強化によりジャガーノートやエンゲージサポートの活躍が見込まれます。一方、ノラは弱体化を受け、サポートピックの優先度が少し下がるでしょう。',
  prediction_en: 'Patch 7.0d introduces the new champion Mel, bringing a fresh dynamic to the meta. The addition of several new items (Kraken Slayer, Knight\'s Vow, Overlord\'s Bloodmail, Unending Despair, Experimental Hexplate) significantly expands build options across marksmen, supports, fighters, and tanks. Fighters in particular will likely gain more influence in split-pushing and team fights. Fiddlesticks receives a major rework to improve usability, while buffs to Rell and Mordekaiser will likely see a rise in engage supports and juggernauts. Conversely, Norra\'s nerfs may slightly lower her priority as a support pick.'
};

async function insertData() {
  // Clear existing patches for 7.0d
  await supabase.from('patches').delete().eq('version', '7.0d');
  await supabase.from('patch_meta').delete().eq('version', '7.0d');

  const { data: pData, error: pError } = await supabase.from('patches').insert(patches);
  if (pError) {
    console.error('Error inserting patches:', pError);
    process.exit(1);
  }

  const { data: mData, error: mError } = await supabase.from('patch_meta').insert(meta);
  if (mError) {
    console.error('Error inserting patch_meta:', mError);
    process.exit(1);
  }

  console.log('Successfully inserted patches and meta for 7.0d');
}

insertData();
