/**
 * 第20回アジア競技大会（2026／愛知・名古屋）の Honor of Kings 競技。
 *
 * 裏取りの状況:
 *
 *   確定（2026-09-30）— 大会公式リザルト（results.asiangames2026.org、運営は Bornan）の結果の文書で確認した。
 *     ・Medallists（C92B、9/28 16:16 作成）: 金 中国／銀 マレーシア／銅 香港・フィリピン
 *     ・Bracket（C75、9/28 16:22 作成）と決勝の Results（FNL の C73B、9/28 16:15 作成）:
 *       準々決勝 香港 2-0 ラオス／マレーシア 2-0 ミャンマー／フィリピン 2-0 韓国／中国 2-0 インドネシア、
 *       準決勝 マレーシア 2-0 香港／中国 2-0 フィリピン、決勝 中国 4-0 マレーシア（4ゲームとも中国）
 *     ・Group Results（C76、9/27 14:37 時点）: A 香港・インドネシア・タイ／B マレーシア・フィリピン・カザフスタン／
 *       C 韓国・ミャンマー／D 中国・ラオスの順。9/27・9/28 の日程画面でも全15試合が Official
 *     ・全15試合のうち、負けたチームが1ゲームでも取ったのは B組のマレーシア 2-1 フィリピンだけ
 *   確定（2026-09-26）— 大会公式の競技スケジュール（C08）・Competition Format and Rules（CFR）・出場登録（entries）。
 *     3位決定戦は無く、準決勝の敗者2チームが銅（joint third place）。10 NOC・58人。ネパールとベトナムは予選を通ったが登録に無い
 *   確定 — JESU の発表（2025-11-07）: 日本代表を選ぶのは7種目9タイトルで、HoK は入っていない。
 *     団体名は 2025年8月に「日本eスポーツ連合」から「日本eスポーツ協会」に変わった。英語名は Japan esports Union のまま
 *   確定 — Honor of Kings 公式（X・YouTube）: 前回大会のメダル3か国は予選免除、予選は 6/13〜21 クアラルンプール、
 *     大会用バージョンはシーズン13ベースで85体、予選の通過9チーム。
 *
 *   未確認 — 本大会の BAN/PICK 方式（CFR に記載なし）、使える85体の名前、ネパールとベトナムが出なかった理由（公式発表なし）。
 *
 *   調査の記録は scratch/wf_asian_games_hok_0926_result.json、公式文書の写しは scratch/ag2026_0926/ と scratch/ag2026_0930/。
 *   結果の文書は、大会公式リザルトの REPORTS の一覧から HOK の行を拾った（scratch/probe_ag2026_results2_0930.mjs）。
 *
 * 数字や日付を直すときは、必ず一次ソースを見てから直すこと。
 *
 * 大会が終わったあとの扱い（2026-09-30 に実施）:
 *   ページと sitemap 登録は消さない。裏取り済みの実コンテンツを1本減らす取引になる。
 *   /guide や /patches への転送も入れない。内容が対応しないので soft 404 になりやすい。
 *   未来形の箇所を過去形に直し、結果を足した。観かた（中継・チケット）と「まだ分かっていないこと」の節は落とし、
 *   残る未確認（BAN/PICK 方式・85体の名前）は「試合形式」の節に書いた。
 *   将来ページ自体を消すと決めたときは、next.config.ts の /esports の転送先も
 *   同時に最終目的地へ直すこと（2段のリダイレクトにしない）。
 */

/** value が配列のときは1要素1行で出す（試合の結果や組の順位を、スコアの途中で折らないため） */
type Row = { label: string; value: string | string[] };
type Section = { heading: string; body: string[]; list?: Row[] };
type Source = { label: string; url: string };

const REPORTS = 'https://results.asiangames2026.org/ag2026/reports';
const URL = {
  medallists: `${REPORTS}/ELSOHOK---------------------------.C92B_1_0.pdf`,
  bracket: `${REPORTS}/ELSOHOK---------------------------.C75_2_0.pdf`,
  final: `${REPORTS}/ELSOHOK---------------FNL-000100--.C73B_1_0.pdf`,
  groupResults: `${REPORTS}/ELSOHOK---------------------------.C76_1_0.pdf`,
  schedule: `${REPORTS}/ELS-------------------------------.C08_1_0.pdf`,
  rules: `${REPORTS}/ELS-------------------------------.CFR_1_0.pdf`,
  entries: 'https://results.asiangames2026.org/#/discipline/ELS/entries/O.HOK---------------',
  jesuSelection: 'https://jesu.or.jp/contents/news/news-251107/',
  hokQualifierExempt: 'https://x.com/HonorOfKings/status/2047613807162458155',
  hokVersion: 'https://x.com/HonorOfKings/status/2052991989046755683',
  hokQualifierDay1: 'https://www.youtube.com/watch?v=NmrvkJBpuy0',
  hokQualified: 'https://x.com/HonorOfKings/status/2068937037496156423',
};

export const ASIAN_GAMES_2026 = {
  /** 裏取りした日。ページに出す */
  verifiedOn: '2026-09-30',

  /**
   * トップページのバナーを出す期限。HoK の試合は9月27〜28日だったので、29日0時に落とす。
   * バナーの表示はビルド時に決まるので、期限を過ぎたら再ビルドで消える（2026-09-30 の再ビルドで消えた）。
   * バナー本文（HomeClient.tsx）が「9月27〜28日」と名指ししているので、期限を延ばすなら本文も併せて直すこと。
   */
  bannerUntil: '2026-09-29T00:00:00+09:00',

  ja: {
    title: 'アジア競技大会2026のHonor of Kings',
    lead:
      'Honor of Kings は、第20回アジア競技大会（愛知・名古屋）のeスポーツ11種目の1つでした。9月27日（日）と28日（月）の2日間で、10の国と地域が戦った。金メダルは中国で、決勝でマレーシアを4−0で破っています。日本代表は出場していない。',

    factsHeading: '結果と大会の概要',
    facts: [
      { label: '金メダル', value: '中国' },
      { label: '銀メダル', value: 'マレーシア' },
      { label: '銅メダル', value: '香港、フィリピン（3位決定戦は無く、準決勝で負けた2チームがどちらも銅）' },
      { label: '決勝', value: '9月28日（月）14:00開始、中国 4−0 マレーシア（BO7）' },
      { label: '日程', value: '9月27日（日）グループステージ・準々決勝／9月28日（月）準決勝・決勝' },
      { label: '会場', value: 'Aichi Sky Expo（愛知県国際展示場）。準決勝と決勝は展示ホールD' },
      { label: '出場', value: '10の国と地域（選手58人）。日本代表は出場していない' },
      { label: '位置づけ', value: 'eスポーツ11種目13タイトルの1つ（メダル種目）' },
    ] satisfies Row[],

    sections: [
      {
        heading: '準々決勝から決勝まで',
        body: [
          '準々決勝は9月27日の17:00に、4試合が同時に始まった。C組1位の韓国はB組2位のフィリピンに0−2で敗れ、ほかの3試合は組の1位が勝っています。',
          '9月28日は展示ホールDに移って、準決勝と決勝。準決勝はマレーシアと中国がどちらも2−0で勝ち上がった。BO7の決勝は、中国がマレーシアから4ゲームを続けて取っています。',
        ],
        list: [
          { label: '準々決勝', value: ['香港 2−0 ラオス', 'マレーシア 2−0 ミャンマー', 'フィリピン 2−0 韓国', '中国 2−0 インドネシア'] },
          { label: '準決勝', value: ['マレーシア 2−0 香港', '中国 2−0 フィリピン'] },
          { label: '決勝', value: '中国 4−0 マレーシア' },
        ],
      },
      {
        heading: 'グループステージ（9月27日）',
        body: [
          '組ごとの総当たりで、上位2チームが準々決勝へ進んだ。大会の全15試合のうち、負けたチームが1ゲームでも取ったのは、B組のマレーシア対フィリピン（2−1）だけでした。',
        ],
        list: [
          { label: 'A組', value: ['1位 香港（2勝）', '2位 インドネシア（1勝1敗）', '3位 タイ（2敗）'] },
          { label: 'B組', value: ['1位 マレーシア（2勝）', '2位 フィリピン（1勝1敗）', '3位 カザフスタン（2敗）'] },
          { label: 'C組', value: '1位 韓国、2位 ミャンマー（韓国が2−0）' },
          { label: 'D組', value: '1位 中国、2位 ラオス（中国が2−0）' },
        ],
      },
      {
        heading: '試合形式',
        body: [
          'グループステージの1試合はBO3（2本先取）。C組とD組は2チームだけなので、負けても準々決勝に残れる形で、この2組の1試合は組の1位と2位を決める戦いだった。',
          '準々決勝の組み合わせは、A組1位対D組2位、B組1位対C組2位、C組1位対B組2位、D組1位対A組2位。準々決勝と準決勝はBO3で、金メダルを決める決勝だけがBO7（4本先取）でした。3位決定戦は無く、準決勝で負けた2チームがどちらも銅メダルになる。',
          '使ったのは大会用の専用バージョン。シーズン13をもとにしていて、使えるヒーローは85体に絞られていた。公式の告知はアイコンの画像だけで、どの85体かはこのページでは確かめていません。BAN/PICKの方式も、大会公式のルール文書には書かれていない（予選は通常のBAN/PICKだった）。',
        ],
      },
      {
        heading: '予選',
        body: [
          '前回2022年の杭州大会でこの種目のメダルを取った中国・マレーシア・タイは、予選を免除された。ほかの国と地域は、6月13日から21日にマレーシアのクアラルンプールで予選を戦っています。',
          '予選には20チームが出場し、9チームが通過した。通過したのは香港、インドネシア、カザフスタン、ラオス、ミャンマー、ネパール、フィリピン、韓国、ベトナム。このうちネパールとベトナムは本大会に出場していない。理由の公式発表は確認できていません。',
          '日本は代表を出していない。JESU（日本eスポーツ協会）が代表を選んだ7種目9タイトルに、Honor of Kings は入っていなかった。',
        ],
      },
    ] satisfies Section[],

    ctaHeading: 'あわせて読むもの',
    verifiedNote: (d: string) =>
      `※${d}時点で、大会公式のリザルト（メダリスト・トーナメント表・各試合の結果）・ルール・出場登録と、JESU・Honor of Kings 公式の発表で確認しました。`,
    sourcesHeading: '出典',
    sources: [
      { label: '大会公式リザルト「Medallists」（9月28日）', url: URL.medallists },
      { label: '大会公式リザルト「Bracket」（9月28日）', url: URL.bracket },
      { label: '大会公式リザルト「決勝の結果」（9月28日）', url: URL.final },
      { label: '大会公式リザルト「Group Results」（9月27日）', url: URL.groupResults },
      { label: '大会公式リザルト「競技スケジュール」（9月22日時点）', url: URL.schedule },
      { label: '大会公式「Competition Format and Rules」', url: URL.rules },
      { label: '大会公式リザルト「出場登録」', url: URL.entries },
      { label: 'JESU「日本代表候補選手の最終選考に関するお知らせ」（2025年11月7日）', url: URL.jesuSelection },
      { label: 'Honor of Kings 公式 X「予選の免除と開催地」（2026年4月24日）', url: URL.hokQualifierExempt },
      { label: 'Honor of Kings 公式 X「大会用バージョン」（2026年5月9日）', url: URL.hokVersion },
      { label: 'Honor of Kings 公式 YouTube「予選 Day 1」（2026年6月13日）', url: URL.hokQualifierDay1 },
      { label: 'Honor of Kings 公式 X「予選の通過チーム」（2026年6月22日）', url: URL.hokQualified },
    ] satisfies Source[],
  },

  en: {
    title: 'Honor of Kings at the 2026 Asian Games',
    lead:
      'Honor of Kings was one of eleven esports disciplines at the 20th Asian Games in Aichi-Nagoya, Japan. Ten nations and regions competed over two days, 27 and 28 September 2026, and China took gold after beating Malaysia 4–0 in the final. Japan did not enter a team.',

    factsHeading: 'Results and key facts',
    facts: [
      { label: 'Gold', value: 'China' },
      { label: 'Silver', value: 'Malaysia' },
      { label: 'Bronze', value: 'Hong Kong and the Philippines (no third-place match; both losing semifinalists receive bronze)' },
      { label: 'Final', value: 'Mon 28 Sept, 14:00 JST: China 4–0 Malaysia (best of seven)' },
      { label: 'Schedule', value: 'Sun 27 Sept: group stage and quarterfinals / Mon 28 Sept: semifinals and final' },
      { label: 'Venue', value: 'Aichi Sky Expo. Semifinals and final in Exhibition Hall D' },
      { label: 'Teams', value: '10 nations and regions (58 athletes). Japan did not compete' },
      { label: 'Status', value: 'One of 11 esports disciplines (13 titles), a medal event' },
    ] satisfies Row[],

    sections: [
      {
        heading: 'Quarterfinals to the final',
        body: [
          'All four quarterfinals started together at 17:00 on 27 September. South Korea, winners of Group C, lost 0–2 to the Philippines, second in Group B; the other three group winners went through.',
          'On 28 September the event moved to Exhibition Hall D for the semifinals and final. Malaysia and China both won their semifinals 2–0, and China then took all four games of the best-of-seven final against Malaysia.',
        ],
        list: [
          { label: 'Quarterfinals', value: ['Hong Kong 2–0 Laos', 'Malaysia 2–0 Myanmar', 'The Philippines 2–0 South Korea', 'China 2–0 Indonesia'] },
          { label: 'Semifinals', value: ['Malaysia 2–0 Hong Kong', 'China 2–0 the Philippines'] },
          { label: 'Final', value: 'China 4–0 Malaysia' },
        ],
      },
      {
        heading: 'Group stage (27 September)',
        body: [
          'Each group played a round robin, and the top two went through to the quarterfinals. Of the 15 matches in the whole event, the only one in which the losing team took a game was Malaysia v the Philippines in Group B (2–1).',
        ],
        list: [
          { label: 'Group A', value: ['1st Hong Kong (2 wins)', '2nd Indonesia (1 win, 1 loss)', '3rd Thailand (2 losses)'] },
          { label: 'Group B', value: ['1st Malaysia (2 wins)', '2nd the Philippines (1 win, 1 loss)', '3rd Kazakhstan (2 losses)'] },
          { label: 'Group C', value: '1st South Korea, 2nd Myanmar (South Korea won 2–0)' },
          { label: 'Group D', value: '1st China, 2nd Laos (China won 2–0)' },
        ],
      },
      {
        heading: 'Format',
        body: [
          'Group matches were best of three. Groups C and D had only two teams, so both advanced whatever happened, and their one match decided first and second place.',
          'The quarterfinals paired A1 v D2, B1 v C2, C1 v B2 and D1 v A2. Quarterfinals and semifinals were best of three, and only the gold medal match was best of seven. There was no third-place match: both losing semifinalists received bronze.',
          'Teams played a dedicated Asian Games version based on Season 13, with the hero pool cut to 85. The official announcement showed the pool only as icons, and this page has not checked which 85 heroes they were. The official rules do not state the ban and pick format either (the qualifiers used Standard Ban & Pick).',
        ],
      },
      {
        heading: 'Qualifiers',
        body: [
          'China, Malaysia and Thailand, the medallists in this event at Hangzhou 2022, were exempt from qualifying. Everyone else played the qualifiers in Kuala Lumpur, Malaysia, from 13 to 21 June.',
          'Twenty teams entered the qualifiers and nine went through: Hong Kong, Indonesia, Kazakhstan, Laos, Myanmar, Nepal, the Philippines, South Korea and Vietnam. Nepal and Vietnam did not compete in the main event, and no official reason has been found.',
          'Japan had no team. The Japan esports Union (JESU) selected national teams for seven disciplines across nine titles, and Honor of Kings was not one of them.',
        ],
      },
    ] satisfies Section[],

    ctaHeading: 'Further reading',
    verifiedNote: (d: string) =>
      `Checked on ${d} against the official results (medallists, bracket and match results), the competition rules and entry list, and announcements from JESU and Honor of Kings.`,
    sourcesHeading: 'Sources',
    sources: [
      { label: 'Official results: Medallists (28 September)', url: URL.medallists },
      { label: 'Official results: Bracket (28 September)', url: URL.bracket },
      { label: 'Official results: Final (28 September)', url: URL.final },
      { label: 'Official results: Group Results (27 September)', url: URL.groupResults },
      { label: 'Official results: Competition Schedule (as of 22 September)', url: URL.schedule },
      { label: 'Official: Competition Format and Rules', url: URL.rules },
      { label: 'Official results: Entries', url: URL.entries },
      { label: 'JESU: final selection of national team candidates (7 November 2025, Japanese)', url: URL.jesuSelection },
      { label: 'Honor of Kings on X: qualifier exemptions and venue (24 April 2026)', url: URL.hokQualifierExempt },
      { label: 'Honor of Kings on X: the Asian Games version (9 May 2026)', url: URL.hokVersion },
      { label: 'Honor of Kings on YouTube: qualifiers Day 1 (13 June 2026)', url: URL.hokQualifierDay1 },
      { label: 'Honor of Kings on X: qualified teams (22 June 2026)', url: URL.hokQualified },
    ] satisfies Source[],
  },
};
