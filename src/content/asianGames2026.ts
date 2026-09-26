/**
 * 第20回アジア競技大会（2026／愛知・名古屋）の Honor of Kings 競技。
 *
 * 裏取りの状況（2026-09-26 時点）:
 *
 *   確定 — 大会公式リザルト（results.asiangames2026.org、運営は Bornan）の文書で確認した。
 *     ・競技スケジュール（C08、9/22 時点）: HoK は 9/27 にグループステージ（9:00・11:00・13:00、計8試合）と
 *       準々決勝（17:00 に4試合同時）を競技室で行い、9/28 に展示ホールDで準決勝（9:00・11:00）と
 *       決勝（14:00 開始、終了見込み 18:30）を行う
 *     ・組み分け（C50、9/25 時点）: A 香港・インドネシア・タイ／B カザフスタン・マレーシア・フィリピン／
 *       C 韓国・ミャンマー／D 中国・ラオス
 *     ・Competition Format and Rules（CFR）: 各組 BO3 の総当たり、各組上位2チームが準々決勝、
 *       準々決勝の組み合わせ A1-D2・B1-C2・C1-B2・D1-A2、準々決勝と準決勝は BO3、決勝だけ BO7、
 *       3位決定戦は無く準決勝の敗者2チームが銅（joint third place）
 *     ・出場登録（entries）: 10 NOC・58人。ネパールとベトナムは予選を通ったが登録に無い
 *   確定 — JESU の発表。
 *     ・2026-09-14「中継配信について」: TBS スポーツ YouTube の日本語中継表に HoK が無い。
 *       日本語中継の無い種目は OCA の Asian Games TV で英語配信を予定
 *     ・2025-11-07「最終選考に関するお知らせ」: 日本代表を選ぶのは7種目9タイトルで、HoK は入っていない
 *     ・団体名は 2025年8月に「日本eスポーツ連合」から「日本eスポーツ協会」に変わった。英語名は Japan esports Union のまま
 *   確定 — Honor of Kings 公式（X・YouTube）。
 *     ・2026-04-24: 前回大会のメダル3か国（中国・マレーシア・タイ）は予選免除、予選は 6/13〜21 クアラルンプール
 *     ・2026-05-09: 大会用バージョンはシーズン13ベースで、使えるヒーローは85体（画像はアイコンのみで名前が無い）
 *     ・2026-06-13: 予選のグループステージは20チーム、Standard Ban & Pick
 *     ・2026-06-22: 予選の通過9チーム
 *
 *   未確認 — 本大会の BAN/PICK 方式（CFR に記載なし）、9/27 の観戦チケットの有無、
 *     Asian Games TV の HoK 本大会の配信ページ（9/26 時点で見当たらない）、使える85体の名前、
 *     ネパールとベトナムが出ない理由（公式発表なし）。
 *
 *   調査の記録は scratch/wf_asian_games_hok_0926_result.json、公式PDFの写しは scratch/ag2026_0926/。
 *
 *   2026-08-15 版は JESU の 2026-06-16 発表だけを根拠に「9月28日の1日で決勝まで」と書いていた。
 *   JESU 特設ページと JOC の日程表は、いまも展示ホールDの 9/28 の枠しか載せていない。
 *   日程は大会公式の競技スケジュールを正とする。
 *
 * 数字や日付を直すときは、必ず一次ソースを見てから直すこと。
 *
 * 大会が終わったあとの扱い:
 *   ページと sitemap 登録は消さない。裏取り済みの実コンテンツを1本減らす取引になる。
 *   /guide や /patches への転送も入れない。内容が対応しないので soft 404 になりやすい。
 *   代わりに、未来形・現在形で書いている箇所（lead、facts の日程、sections の日程・観かた・未確認）を
 *   結果に合わせて過去形へ振り直し、メダルの結果を足す。ja と en の両方。
 *   「まだ分かっていないこと／Still unconfirmed」の節は、結果が出たあとは
 *   残さず、確認できたことに差し替えるか、節ごと落とす。
 *   将来ページ自体を消すと決めたときは、next.config.ts の /esports の転送先も
 *   同時に最終目的地へ直すこと（2段のリダイレクトにしない）。
 */

type Row = { label: string; value: string };
type Section = { heading: string; body: string[]; list?: Row[] };
type Source = { label: string; url: string };

const URL = {
  schedule: 'https://results.asiangames2026.org/ag2026/reports/ELS-------------------------------.C08_1_0.pdf',
  groups: 'https://results.asiangames2026.org/ag2026/reports/ELSOHOK---------------------------.C50_1_0.pdf',
  rules: 'https://results.asiangames2026.org/ag2026/reports/ELS-------------------------------.CFR_1_0.pdf',
  entries: 'https://results.asiangames2026.org/#/discipline/ELS/entries/O.HOK---------------',
  jesuBroadcast: 'https://jesu.or.jp/contents/news/news-260914/',
  jesuSelection: 'https://jesu.or.jp/contents/news/news-251107/',
  hokQualifierExempt: 'https://x.com/HonorOfKings/status/2047613807162458155',
  hokVersion: 'https://x.com/HonorOfKings/status/2052991989046755683',
  hokQualifierDay1: 'https://www.youtube.com/watch?v=NmrvkJBpuy0',
  hokQualified: 'https://x.com/HonorOfKings/status/2068937037496156423',
  tickets: 'https://lp-ag.tickets-aichi-nagoya2026.org/',
  asianGamesTv: 'https://asiangamestv.com/',
};

export const ASIAN_GAMES_2026 = {
  /** 裏取りした日。ページに出す */
  verifiedOn: '2026-09-26',

  /**
   * トップページのバナーを出す期限。HoK の試合は9月27〜28日なので、29日0時に落とす。
   * Vercel は UTC で動くので、オフセット（+09:00）を省くと最大9時間ずれる。
   * バナーの表示はビルド時に決まるので、期限を過ぎたら再ビルドで消える。
   * バナー本文（HomeClient.tsx）が「9月27〜28日」と名指ししているので、期限を延ばすなら本文も併せて直すこと。
   */
  bannerUntil: '2026-09-29T00:00:00+09:00',

  ja: {
    title: 'アジア競技大会2026のHonor of Kings',
    lead:
      'Honor of Kings は、第20回アジア競技大会（愛知・名古屋）のeスポーツ11種目の1つです。試合は9月27日（日）と28日（月）の2日間で、10の国と地域が金メダルを争う。日本代表は出場しません。',

    facts: [
      { label: '日程', value: '9月27日（日）グループステージ・準々決勝／9月28日（月）準決勝・決勝' },
      { label: '決勝', value: '9月28日（月）14:00開始（終了見込み18:30）、BO7' },
      { label: '会場', value: 'Aichi Sky Expo（愛知県国際展示場）。準決勝と決勝は展示ホールD' },
      { label: '出場', value: '10の国と地域（選手58人）。日本代表は出場しない' },
      { label: '日本語の中継', value: '予定なし（TBSスポーツ YouTube の中継表に入っていない）' },
      { label: '位置づけ', value: 'eスポーツ11種目13タイトルの1つ（メダル種目）' },
    ] satisfies Row[],

    sections: [
      {
        heading: '9月27日から2日間で決勝まで',
        body: [
          'グループステージは9月27日（日）の9:00・11:00・13:00の3枠で、計8試合。準々決勝の4試合は、同じ日の17:00に一斉に始まります。',
          '9月28日（月）は展示ホールDに移り、準決勝を9:00と11:00に、決勝を14:00から戦う。決勝の終了見込みは18:30です。',
          'JESU の特設ページと JOC の日程表は、9月28日の分だけを載せています。9月27日の試合は、大会公式の競技スケジュールで確認した。',
        ],
      },
      {
        heading: '出場する10の国と地域',
        body: ['組み分けは抽選で決まりました（9月25日時点の大会公式発表）。試合はすべて9月27日です。'],
        list: [
          { label: 'A組', value: '香港、インドネシア、タイ（9:00・11:00・13:00の3試合）' },
          { label: 'B組', value: 'カザフスタン、マレーシア、フィリピン（9:00・11:00・13:00の3試合）' },
          { label: 'C組', value: '韓国、ミャンマー（9:00の1試合）' },
          { label: 'D組', value: '中国、ラオス（11:00の1試合）' },
        ],
      },
      {
        heading: '試合形式',
        body: [
          'グループステージは各組の総当たりで、1試合はBO3（2本先取）。各組の上位2チーム、計8チームが準々決勝に進みます。C組とD組は2チームだけなので、負けても準々決勝には残れる。この2組の1試合は、組の1位と2位を決める戦いです。',
          '準々決勝はA組1位対D組2位、B組1位対C組2位、C組1位対B組2位、D組1位対A組2位。準々決勝と準決勝はBO3で、金メダルを決める決勝だけがBO7（4本先取）になる。3位決定戦は無く、準決勝で負けた2チームがどちらも銅メダルです。',
          '使うのは大会用の専用バージョン。シーズン13をもとにしていて、使えるヒーローは85体に絞られています。公式の告知はアイコンの画像だけで、どの85体かはこのページではまだ確かめていない。',
        ],
      },
      {
        heading: '予選',
        body: [
          '前回2022年の杭州大会でこの種目のメダルを取った中国・マレーシア・タイは、予選を免除されました。ほかの国と地域は、6月13日から21日にマレーシアのクアラルンプールで予選を戦っている。',
          '予選には20チームが出場し、9チームが通過した。通過したのは香港、インドネシア、カザフスタン、ラオス、ミャンマー、ネパール、フィリピン、韓国、ベトナム。このうちネパールとベトナムは、本大会の出場登録に入っていません。理由の公式発表は確認できていない。',
        ],
      },
      {
        heading: '日本からの観かた',
        body: [
          '日本代表は出場しません。JESU（日本eスポーツ協会）が代表を選んだ7種目9タイトルに、Honor of Kings は入っていない。',
          'TBSスポーツの YouTube 公式チャンネルの日本語中継にも、Honor of Kings の枠はありません。日本語の中継が無い種目は、英語で配信する予定です（JESU の案内）。配信先はアジアオリンピック評議会（OCA）の「Asian Games TV」。9月26日時点では、Honor of Kings 本大会の配信ページはまだ見当たらなかった。',
          '現地で観る場合、観客席があるのは展示ホールDです。Honor of Kings がホールDを使うのは、9月28日の準決勝と決勝だけ。9月27日の試合は別の競技室で行い、観戦チケットがあるかは確認できていません。',
        ],
      },
      {
        heading: 'まだ分かっていないこと',
        body: [
          '本大会のBAN/PICKの方式は、大会公式のルール文書に書かれていません。予選は通常のBAN/PICK（Standard Ban & Pick）だった。',
          '9月27日の試合の観戦チケットと、Asian Games TV での配信は、確認でき次第ここに書き足します。',
        ],
      },
    ] satisfies Section[],

    ctaHeading: '大会に向けて読むもの',
    verifiedNote: (d: string) =>
      `※${d}時点で、大会公式の競技スケジュール・ルール・組み分け・出場登録と、JESU・Honor of Kings 公式の発表で確認しました。日程は運営の都合で変わることがあります。`,
    sourcesHeading: '出典',
    sources: [
      { label: '大会公式リザルト「競技スケジュール」（9月22日時点）', url: URL.schedule },
      { label: '大会公式リザルト「Groups」（9月25日時点）', url: URL.groups },
      { label: '大会公式「Competition Format and Rules」', url: URL.rules },
      { label: '大会公式リザルト「出場登録」', url: URL.entries },
      { label: 'JESU「eスポーツ競技の中継配信について」（2026年9月14日）', url: URL.jesuBroadcast },
      { label: 'JESU「日本代表候補選手の最終選考に関するお知らせ」（2025年11月7日）', url: URL.jesuSelection },
      { label: 'Honor of Kings 公式 X「予選の免除と開催地」（2026年4月24日）', url: URL.hokQualifierExempt },
      { label: 'Honor of Kings 公式 X「大会用バージョン」（2026年5月9日）', url: URL.hokVersion },
      { label: 'Honor of Kings 公式 YouTube「予選 Day 1」（2026年6月13日）', url: URL.hokQualifierDay1 },
      { label: 'Honor of Kings 公式 X「予選の通過チーム」（2026年6月22日）', url: URL.hokQualified },
      { label: '観戦チケット販売サイト', url: URL.tickets },
      { label: 'Asian Games TV（OCA）', url: URL.asianGamesTv },
    ] satisfies Source[],
  },

  en: {
    title: 'Honor of Kings at the 2026 Asian Games',
    lead:
      'Honor of Kings is one of eleven esports disciplines at the 20th Asian Games in Aichi-Nagoya, Japan. Its matches run over two days, 27 and 28 September 2026, with ten nations and regions competing for gold. Japan is not entering a team.',

    facts: [
      { label: 'Schedule', value: 'Sun 27 Sept: group stage and quarterfinals / Mon 28 Sept: semifinals and final' },
      { label: 'Final', value: 'Mon 28 Sept, 14:00 JST (expected to end around 18:30), best of seven' },
      { label: 'Venue', value: 'Aichi Sky Expo. Semifinals and final in Exhibition Hall D' },
      { label: 'Teams', value: '10 nations and regions (58 athletes). Japan is not competing' },
      { label: 'Broadcast', value: 'No Japanese-language stream. OCA plans English streams on Asian Games TV' },
      { label: 'Status', value: 'One of 11 esports disciplines (13 titles), a medal event' },
    ] satisfies Row[],

    sections: [
      {
        heading: 'Two days, from 27 September to the final',
        body: [
          'The group stage is played on Sunday 27 September in three slots, 09:00, 11:00 and 13:00, for eight matches in total. All four quarterfinals start together at 17:00 the same day.',
          'On Monday 28 September the event moves to Exhibition Hall D, with semifinals at 09:00 and 11:00 and the final from 14:00. The final is expected to finish around 18:30.',
          'The JESU event page and the JOC schedule list only the 28 September session. The 27 September matches come from the official competition schedule.',
        ],
      },
      {
        heading: 'The ten nations and regions',
        body: ['Groups were drawn by lot (official announcement as of 25 September). Every group match is on 27 September.'],
        list: [
          { label: 'Group A', value: 'Hong Kong, Indonesia, Thailand (three matches, 09:00, 11:00 and 13:00)' },
          { label: 'Group B', value: 'Kazakhstan, Malaysia, the Philippines (three matches, 09:00, 11:00 and 13:00)' },
          { label: 'Group C', value: 'South Korea, Myanmar (one match, 09:00)' },
          { label: 'Group D', value: 'China, Laos (one match, 11:00)' },
        ],
      },
      {
        heading: 'Format',
        body: [
          'Each group plays a single round robin of best-of-three matches, and the top two in every group, eight teams in all, reach the quarterfinals. Groups C and D have only two teams, so both advance whatever happens; their one match decides first and second place.',
          'The quarterfinals are A1 v D2, B1 v C2, C1 v B2 and D1 v A2. Quarterfinals and semifinals are best of three, and only the gold medal match is best of seven. There is no third-place match: both losing semifinalists receive bronze.',
          'Teams play a dedicated Asian Games version based on Season 13, with the hero pool cut to 85. The official announcement shows the pool only as icons, and this page has not yet checked which 85 heroes they are.',
        ],
      },
      {
        heading: 'Qualifiers',
        body: [
          'China, Malaysia and Thailand, the medallists in this event at Hangzhou 2022, were exempt from qualifying. Everyone else played the qualifiers in Kuala Lumpur, Malaysia, from 13 to 21 June.',
          'Twenty teams entered the qualifiers and nine went through: Hong Kong, Indonesia, Kazakhstan, Laos, Myanmar, Nepal, the Philippines, South Korea and Vietnam. Nepal and Vietnam are not in the final entry list, and no official reason has been found.',
        ],
      },
      {
        heading: 'Watching from Japan',
        body: [
          'Japan has no team in this event. The Japan esports Union (JESU) selected national teams for seven disciplines across nine titles, and Honor of Kings is not one of them.',
          'Honor of Kings is also missing from the Japanese-language coverage on the official TBS Sports YouTube channel. According to JESU, events without Japanese coverage are due to be streamed in English on Asian Games TV, run by the Olympic Council of Asia (OCA). As of 26 September, Asian Games TV had no page yet for the main Honor of Kings event.',
          'Spectator seating is in Exhibition Hall D, which Honor of Kings uses only for the semifinals and final on 28 September. The 27 September matches are played in separate competition rooms, and whether tickets are sold for them has not been confirmed.',
        ],
      },
      {
        heading: 'Still unconfirmed',
        body: [
          'The official rules do not state the ban and pick format for the main event. The qualifiers used Standard Ban & Pick.',
          'Tickets for the 27 September matches and the Asian Games TV stream will be added here once they can be confirmed.',
        ],
      },
    ] satisfies Section[],

    ctaHeading: 'Reading before the tournament',
    verifiedNote: (d: string) =>
      `Checked on ${d} against the official competition schedule, rules, groups and entry list, and against announcements from JESU and Honor of Kings. The organisers may still change the schedule.`,
    sourcesHeading: 'Sources',
    sources: [
      { label: 'Official results: Competition Schedule (as of 22 September)', url: URL.schedule },
      { label: 'Official results: Groups (as of 25 September)', url: URL.groups },
      { label: 'Official: Competition Format and Rules', url: URL.rules },
      { label: 'Official results: Entries', url: URL.entries },
      { label: 'JESU: broadcast of the esports events (14 September 2026, Japanese)', url: URL.jesuBroadcast },
      { label: 'JESU: final selection of national team candidates (7 November 2025, Japanese)', url: URL.jesuSelection },
      { label: 'Honor of Kings on X: qualifier exemptions and venue (24 April 2026)', url: URL.hokQualifierExempt },
      { label: 'Honor of Kings on X: the Asian Games version (9 May 2026)', url: URL.hokVersion },
      { label: 'Honor of Kings on YouTube: qualifiers Day 1 (13 June 2026)', url: URL.hokQualifierDay1 },
      { label: 'Honor of Kings on X: qualified teams (22 June 2026)', url: URL.hokQualified },
      { label: 'Ticket sales site', url: URL.tickets },
      { label: 'Asian Games TV (OCA)', url: URL.asianGamesTv },
    ] satisfies Source[],
  },
};
