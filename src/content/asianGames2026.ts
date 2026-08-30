/**
 * 第20回アジア競技大会（2026／愛知・名古屋）の Honor of Kings 競技。
 *
 * 裏取りの状況（2026-08-15 時点）:
 *
 *   確定 — 日本eスポーツ連合（JESU）2026-06-16 発表の競技スケジュールで確認した。
 *     ・eスポーツ競技期間: 2026年9月23日（水・祝）〜10月2日（金）の10日間
 *     ・会場: Aichi Sky Expo（愛知県国際展示場）展示ホールD
 *     ・Honor of Kings: 9月28日（月）9:00〜20:00、決勝トーナメント〜決勝
 *     ・11種目13タイトルの1つとして実施
 *     https://jesu.or.jp/contents/news/news-260616/
 *
 *   未確認 — 出場国・出場チーム、予選の開催地と日程、放送・配信の方法、
 *     試合形式（BO何本か）。公式発表が出ていないか、こちらで確認できていない。
 *     ページ上でも「未確認」と明記し、確認できたら書き足す。
 *
 * 数字や日付を直すときは、必ず一次ソースを見てから直すこと。
 */

export const ASIAN_GAMES_2026 = {
  /** 裏取りした日。ページに出す */
  verifiedOn: '2026-08-15',
  sourceUrl: 'https://jesu.or.jp/contents/news/news-260616/',

  ja: {
    title: 'アジア競技大会2026のHonor of Kings',
    lead:
      'Honor of Kings は、2026年9月23日から10月2日にかけて愛知・名古屋で行われる第20回アジア競技大会の、eスポーツ11種目のうちの1つです。国内開催なので、日本にいれば現地で観られます。',

    facts: [
      { label: '競技日', value: '2026年9月28日（月）9:00〜20:00' },
      { label: '実施内容', value: '決勝トーナメント 〜 決勝' },
      { label: '会場', value: 'Aichi Sky Expo（愛知県国際展示場）展示ホールD' },
      { label: 'eスポーツ競技期間', value: '2026年9月23日（水・祝）〜10月2日（金）' },
      { label: '位置づけ', value: 'eスポーツ11種目13タイトルの1つ（メダル種目）' },
    ],

    sections: [
      {
        heading: '1日で決勝まで終わる',
        body: [
          'Honor of Kings に割り当てられているのは9月28日の1日だけで、その日のうちに決勝トーナメントから決勝まで進みます。9:00開始、20:00終了の予定。',
          '他の種目は複数日にまたがるものもありますが、Honor of Kings は1日完結です。観るつもりなら、この日を空けておく必要があります。',
        ],
      },
      {
        heading: '同じ会場で11種目が行われる',
        body: [
          '会場は Aichi Sky Expo の展示ホールD。eスポーツ競技はすべてここで行われます。',
          '実施タイトルは、グランツーリスモ7、eFootball、NARAKA: BLADEPOINT、対戦格闘ゲーム団体戦、ぷよぷよeスポーツ、ポケモンユナイト、Honor of Kings、PUBG Mobile、Identity V 第五人格、Mobile Legends: Bang Bang、League of Legends の11タイトルです。',
        ],
      },
      {
        heading: 'まだ分かっていないこと',
        body: [
          '出場国と出場チーム、予選の開催地と日程、試合形式（何本先取か）、放送・配信の方法は、この記事を書いた時点で確認できていません。',
          '推測で埋めることはしません。公式発表を確認でき次第、ここに書き足します。',
        ],
      },
    ],

    ctaHeading: '大会に向けて読むもの',
    verifiedNote: (d: string) =>
      `※日程・会場・実施内容は、日本eスポーツ連合（JESU）が2026年6月16日に発表した競技スケジュールで確認しました（確認日 ${d}）。大会の運営都合で変更される場合があります。最新の情報は公式発表をご確認ください。`,
  },

  en: {
    title: 'Honor of Kings at the 2026 Asian Games',
    lead:
      'Honor of Kings is one of eleven esports disciplines at the 20th Asian Games, held in Aichi and Nagoya, Japan from 23 September to 2 October 2026.',

    facts: [
      { label: 'Competition day', value: 'Monday, 28 September 2026, 09:00–20:00 (JST)' },
      { label: 'Stage', value: 'Knockout bracket through the final' },
      { label: 'Venue', value: 'Aichi Sky Expo, Exhibition Hall D' },
      { label: 'Esports period', value: '23 September – 2 October 2026' },
      { label: 'Status', value: 'One of 11 esports disciplines (13 titles) — a medal event' },
    ],

    sections: [
      {
        heading: 'The whole event runs in a single day',
        body: [
          'Honor of Kings has one day allocated to it — 28 September — and goes from the knockout bracket through to the final within it. Scheduled 09:00 to 20:00 local time.',
          'Some other disciplines are spread across several days; this one is not. If you plan to watch, that is the date to keep free.',
        ],
      },
      {
        heading: 'All eleven disciplines share one venue',
        body: [
          'Everything takes place in Exhibition Hall D at Aichi Sky Expo.',
          'The full list of titles: Gran Turismo 7, eFootball, NARAKA: BLADEPOINT, the fighting game team event, Puyo Puyo eSports, Pokémon UNITE, Honor of Kings, PUBG Mobile, Identity V, Mobile Legends: Bang Bang and League of Legends — eleven disciplines across thirteen titles.',
        ],
      },
      {
        heading: 'What is not confirmed yet',
        body: [
          'The participating nations and teams, the location and dates of qualifiers, the match format, and how the event will be broadcast were all unconfirmed at the time of writing.',
          'Rather than fill those in by guesswork, this page will be updated once the official announcements can be checked.',
        ],
      },
    ],

    ctaHeading: 'Reading before the tournament',
    verifiedNote: (d: string) =>
      `Dates, venue and stage were confirmed against the competition schedule published by the Japan esports Union (JESU) on 16 June 2026 (checked ${d}). Details may change at the organisers' discretion; check official announcements for the latest.`,
  },
};
