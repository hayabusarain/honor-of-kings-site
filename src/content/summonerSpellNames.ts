/**
 * skills/ja.json の meta.summoner_spells に入っている表記を、サイトの正式名へ寄せる対応表。
 *
 * 元データは中国版名（閃現・懲撃）、英語名（Flash・Smite）、カタカナ（フラッシュ・ヒール）が
 * 混在している。値そのものは信用できる。2026-08-25 に次を実測して確認した（英語キー追加後の再集計）。
 *
 *   - lane が JUNGLE のヒーロー26体すべて（100%）がスマイトを持つ
 *   - JUNGLE 以外でスマイトを持つ5体（影・ミーユエ・李元芳・孔明・カイザー）は
 *     いずれもジャングルを回せるヒーロー
 *   - ピュリファイを持つ12体のうち7体がマークスマン、4体がメイジと、CCで落ちるロールに集中
 *   - ヒール／ジャミングを持つ11体のうち9体がサポート系
 *
 * この偏りは無作為な値では出ない。表記が乱れているだけで、対応そのものは筋が通っている。
 *
 * 英語キーは en.json 側の meta.summoner_spells に入っている表記。2026-08-25 の監査で、
 * Flash/Smite/Execute/Purify/Heal の5語しか無く、Stun・Frenzy・Weakness・Sprint・
 * Teleport・Disrupt を持つ18体が EN ページで丸ごと落ちていたのが見つかった。
 * 対応表に無い値は捨てる作りなので、片方の言語だけ増やすと静かに欠落する。
 *
 * 右辺は hok_spells.json の japanese_name と一致させること。
 * 一致しないとアイコンとリンク先を引けない。
 */

export const SUMMONER_SPELL_ALIASES: Record<string, string> = {
  // フラッシュ
  閃現: 'フラッシュ',
  Flash: 'フラッシュ',
  フラッシュ: 'フラッシュ',
  // スマイト
  懲撃: 'スマイト',
  Smite: 'スマイト',
  // ターミネート
  処刑: 'ターミネート',
  Execute: 'ターミネート',
  // ピュリファイ
  浄化: 'ピュリファイ',
  Purify: 'ピュリファイ',
  // ヒール
  治療: 'ヒール',
  Heal: 'ヒール',
  ヒール: 'ヒール',
  回復: 'ヒール',
  // ウィークネス
  弱化: 'ウィークネス',
  Weakness: 'ウィークネス',
  // バーサーク
  狂暴: 'バーサーク',
  Frenzy: 'バーサーク',
  // ジャミング
  妨害: 'ジャミング',
  Disrupt: 'ジャミング',
  // スタン
  気絶: 'スタン',
  眩暈: 'スタン',
  Stun: 'スタン',
  // ダッシュ
  疾歩: 'ダッシュ',
  疾跑: 'ダッシュ',
  Sprint: 'ダッシュ',
  // ワープ
  瞬間移動: 'ワープ',
  Teleport: 'ワープ',
};

/** 生の値を正式名に直す。対応表に無い値は捨てる（推測で表示しない） */
export function normalizeSummonerSpells(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const v of raw) {
    const key = typeof v === 'string' ? v.trim() : '';
    const name = SUMMONER_SPELL_ALIASES[key];
    if (name && !out.includes(name)) out.push(name);
  }
  return out;
}
