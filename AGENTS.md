# AGENTS.md - Developer & Agent Guidance

<!-- hub-game:shared:begin -->
<!-- 正本: Desktop/hub-game-rules/shared/AGENTS.shared.md  sha=ce8d9777ed9f -->
<!-- 手で編集しない。直すときは正本を変えて node sync.mjs -->

## 共通ルール（hub-game 全サイト）

この節は 4 サイト共通の正本から配られている。**このブロックを直接編集しない。**
直すときは `Desktop/hub-game-rules/shared/AGENTS.shared.md` を変えて `node sync.mjs` を実行する。
ずれたままコミットすると `npm run audit` が落ちる。

固有のルール（データの出どころ、ゲーム用語、デザインの色、ビルド手順）は、
このブロックの外に書くこと。

### 1. 事前承認が要る操作

取り消しにくいものは、実行前に何をするかを伝えて承認を得る。取り消せる編集は事後報告でよい。

- `git push` とデプロイ
- ファイルの削除、`git reset` / `checkout` / `restore` / `clean` / `revert`
- 本番データベースへの書き込み・更新・削除
- サブエージェントの起動。4 本以上回す前に、本数・目的・モデルを先に出す
- 他サイトのリポジトリへの書き込み。読むだけなら承認は要らない

巻き戻すときは、**どの時点に戻すか・消える未コミットの変更は何か・実行してよいか**の 3 点を
先に出す。「戻します」だけで実行しない。

細かい編集のたびに確認を求めない。**本当に確認が必要な操作が、承認の山に埋もれる。**
まとまった作業に入る前に全体の方針を出し、そのあとは取り消せる範囲で進めて事後に報告する。

サブエージェントは最高スペックで回す。Claude Code では `Agent` に `model` を**指定しない**
（省略すると親のモデルを継承する。これが最高スペックを保つ正しい方法）。格下げ指定はしない。

権限設定（`.claude/settings.json`）とフックは、これらをプロンプト任せにせず機械で止めるためにある。**解除しない。**

### 2. セキュリティ

過去に、サービスアカウントの秘密鍵が初回コミットから公開リポジトリに残っていた事故がある。

- 認証情報をコミットしない。`key.json` と `.env.local` は中身を画面に出すことも禁止。
  既にコミットされているものを見つけたら作業を止めて報告する（鍵の無効化は本人にしかできない）
- ブラウザに露出するキー（`NEXT_PUBLIC_`）で書き込めるテーブルを作らない。
  この環境変数はサイト訪問者全員が読める。書き込みが要るなら RLS で操作を限定する
- 本番 DB への書き込みは管理者クライアント経由のみ
- 外部から受け取る入力は、既知のデータと突き合わせてホワイトリスト方式で検証する。
  検証していない値をそのまま保存・表示しない
- 認証の無い管理画面と書き込み API は、本番で `NODE_ENV` により遮断し、`robots` でも止める

### 3. 掲載する数字と文章

**外部知識でデータの穴を埋めない。** 手元のデータに無いことは「無い」と書く。
PC 版や他タイトルの知識、外部 wiki で補完するのは禁止。これが一番やらかす。

- 公式が出している数値は、そのとおり正確に転記する。桁も単位も変えない
- その数値が何に効くかの解説は、公式の文章をコピーせず自分の言葉で書く
- どこから来た数字かを、読者が辿れる形で書く。出典名・取得日・対象範囲に加えて、
  日本を含むグローバル版との差（パッチ適用時期やバランス調整のずれ）も添える
- 確かめたことは言い切る。確かめていないことは「未確認」とはっきり書く。
  「可能性があります」で曖昧にするのが、いちばん信用を落とす
- 英語名が確認できない固有名詞を、ローマ字化や独自の英訳で埋めない。日本語のまま残す
- **埋められずに欠損のまま残した項目は、作業の最後に一覧にして報告する。**
  あとから出典が手に入ったときに、まとめて埋められるようにするため

### 4. 日本語の書き方

会話・コメント・コミットメッセージ・掲載文のすべてに適用する。

**中身**

- 主語を「彼」「それ」でぼかさない。名前をそのまま書く
- 名詞を動詞化しない（✗ 1スタックする → ✓ 1スタック獲得する）
- 用語は一度決めたら全ファイルで揃える。置換したら全体を再検索して残りを潰す
- 機械翻訳くさい直訳を残さない（✗ 初回清掃中 → ✓ 初回のジャングルクリア中）
- 助詞と係り受けを読み返す（✗ 敵のハードCCが出し切る → ✓ 敵がハードCCを使い切る）
- 効果ではなく結果まで書く（✗ 逃げやすくなる → ✓ 緊急時にも離脱しやすくなる）
- 「最強」「絶対」「圧倒的」は、データで裏が取れているとき以外は使わない
- 中身のない定型文を書かない。画面を見れば分かること、集計の内訳、書き手の都合は削る。
  **削って困らない文は削る。** 分量を増やすこと自体は目的ではない

**読みやすさ**（内容が正確でも「機械が書いた文章」に見える原因）

- 同じ語尾を 2 文続けない。3 文に 1 回は常体や体言止めを混ぜる
- 一文 45 字を目安に切る。情報を足したくなったら文を分ける
- 「ただし」「つまり」「そのため」「一方で」で埋めない。逆接や条件が本当に要るときだけ
- 3 項目以下なら箇条書きにせず地の文で書く。表にするのは比較軸が 2 つ以上あるとき

### 5. 掲載文の置き場所

- コンポーネントに生の日本語・英語を直接ハードコードしない。
  UI ラベルは `messages/*.json`、読み物は `src/content/*.ts` か `src/data/*.json`
- 日本語と英語は同時に更新する。片方だけ直すと、もう片方が古いまま残る
- **対象は `messages/` だけではない。** 画面に出る文字列はデータ JSON 由来のほうが多い。
  `messages/` のキーが完全に揃っていても、スキルやアイテムの英語フィールドが
  日本語のままなら英語ページは日本語で埋まる（実際にそうなっていた）
- 英語ページの品質は、キーの差分ではなく**実際のページを取得して日本語文字を数えて**確認する

### 6. 変更を出す前に

コミット前に、そのリポジトリで用意されているものを全部通す。

```
npx tsc --noEmit     型
npx eslint src       lint
npm run audit        監査
npm run build        ビルド
```

型は `any` や `Record<string, unknown>` で済ませない。データの構造に合わせて定義する。
`next.config.ts` の `ignoreBuildErrors` と `ignoreDuringBuilds` を復活させない。
握り潰すと気づかないうちに溜まる（実際に 56 件溜まっていた）。ビルドが型で止まったら型を直す。

画面に出る変更は、ローカルで起動して実際のページを見て確かめる。
一時ファイル（`scratch/` `scripts/` の生データやバックアップ）を明示の指示なく削除しない。

### 7. やらかしたら、検査に変える

**文章で書いたルールは破られる。機械で止めたルールだけが守られる。**

実際に事故が起きたら、この順で考える。

1. `scripts/audit.mjs` の検査に変換できないか
2. 無理なら `.claude/settings.json` で止められないか
3. どちらも無理なものだけ、このルールに 1 行足す

ルールを増やす前に、まず検査にできないか試すこと。読まれない長さになったら意味がない。

### 8. サイト統合（2026-09-27 運営者了承）

4 サイトを `hub-game.com` の 1 つにまとめる。ポータルが直下（`/ja`）、各サイトは `/hok/ja/…`・`/mlbb/ja/…`・`/wildrift/ja/…`。
ホスティングは Cloudflare（Workers の静的アセット）に一本化し、全サイト静的書き出しにする。計画は HoK の `docs/CONSOLIDATION_PLAN.md`。

- 前置きとドメインはビルド時の環境変数（`NEXT_PUBLIC_BASE_PATH`・`NEXT_PUBLIC_SITE_ORIGIN`）で切り替える。無ければ今の出力のまま。**前置きを固定で main に入れると、その時点で今の本番が壊れる**
- `next/image` の `src` とデータの `/images/…` には前置きが付かない。包みを通し、直接の import は監査で止める（見本は MLBB の試作）
- Service Worker は範囲を前置きの下にし、`activate` で消すのは自サイトの接頭辞のキャッシュだけ。ブラウザ保存のキーにもサイトの接頭辞を付ける
- 書き出し後の後処理 `scripts/postbuild_basepath.mjs` はここから配っている。手で直さない

<!-- hub-game:shared:end -->

This project is a Next.js 16 (Turbopack) web application for **Honor of Kings Global (HoK)**.

---

## ⚡ Quick Start & Verification Rules

1. **Local Development**:
   - `npm run dev` starts the dev server on `http://localhost:3000`.
   - Never deploy to production without explicit user confirmation.
2. **Build Verification**:
   - Always run `npm run build` after editing components or data. All static pages must compile cleanly with 0 TypeScript / Turbopack errors.
3. **Data Audit (must pass before commit)**:
   - `npm run audit` — checks i18n key parity, Japanese leakage in EN data, broken image references, ja/en skill data gaps, hero naming conventions, and the site's last-updated date. Run it after ANY data file change.
   - `npm run smoke` — opens the key pages listed in `scripts/smoke.mjs` in a real browser (requires `npm run dev` running) and checks for console errors, 404s, and Japanese text on EN pages.
   - CI (GitHub Actions) runs audit + lint + build on every push.
   - `npm run diff:items` — 装備データの日英で数値が食い違う箇所を出す。
     **合否の検査ではないので audit には入れていない。** 出るのは「実機で見る順番」で、
     どちらが正しいかは装備ショップを開かないと決まらない。いまは0件なので、
     何か出たら日英のどちらかを触ったということ。**数値しか見ない。**
     2026-09-01 の照合では、グリードバイトと巨人のグリップの「狩猟」が日本語だけ
     「魔法ダメージ」になっていた誤り（英語は physical で正しい）を素通りしている。
     数字は完全に一致していて、違うのが単語だけだったため。0件は正しさの証明ではない。
4. **サイトの最終更新日（プッシュ前に必ず）**:
   - 掲載内容を変えたら、プッシュ前に `npm run touch:updated` で
     `src/data/data_freshness.json` の `site.lastUpdated` を当日に上げる。
   - この日付はトップの「最終更新」バッジと、再訪した人に出す赤点（TabBar）が見ている。
     上げ忘れると、更新しているのに止まったサイトに映る。
   - `npm run audit` が上げ忘れを検出して落とす（src / public / messages に
     未コミットの変更があるのに日付が当日でない場合）。
   - 中身に関係のない作業（スクリプト整理・コメント修正など）だけのときは
     `SKIP_FRESHNESS_CHECK=1 npm run audit` で飛ばす。日付は上げない。
   - **ガイド4本（`/guide` `/guide/bosses` `/guide/beginner-heroes` `/guide/glossary`）は別の日付を持つ。**
     本文を書き換えたら `data_freshness.json` の `guides.*.updatedAt` も同じ規約で当日に上げる。
     これは各ページの構造化データ（`dateModified`）が見ている。`site.lastUpdated` とは混ぜていない
     （混ぜると4本とも同じ日になり、ページ別に持つ意味が消える）。検査15が上げ忘れを見張る。
     用語集の説明文は `/guide` と同じ `src/data/guide/{ja,en}.json` にあるので、そこを触ると両方の日付が要る。
5. **Hero Naming Convention**:
   - `name` = Japanese in-game name (Kanji for Chinese-origin heroes: 大司命, 白龍 — NOT オーグラン/アオイン). `name_en` = official global name (Augran, Ao'yin, Chicha, Luara, Flowborn).
   - The fields `jpName` / `enName` are abolished — do not re-add them.

---

## 🔑 Data & Routing Architecture

1. **Authentic HoK Hero Data**:
   - Valid HoK heroes begin at ID 105 (Lian Po / 廉頗).
   - Main datasets reside in `src/data/hok_heroes.json` and `src/data/hero_counters.json`.
   - Summoner Spells are located in `src/data/hok_spells.json` (do not import `hok_summoners.json`).

2. **Internationalization & Navigation**:
   - Uses `next-intl` with `@/i18n/routing`.
   - Hero Detail Page route is `/heroes/${id}` (plural). Never use `/heros/`.
   - Ensure both `messages/ja.json` and `messages/en.json` maintain matching JSON keys.

3. **Global Terminology**:
   - Monsters: `Tyrant`, `Overlord`, `Tempest Dragon`, `Spirit Crab` (In Japanese UI: `タイラント`, `オーバーロード`, `テンペストドラゴン`, `スピリットクラブ`).
   - Items: `Mortal Punisher`, `Venomous Staff`, `Ominous Premonition`.
   - Hero Names: Follow HoK Global Japanese in-game UI (Chinese-origin heroes use Kanji like `孫尚香`, `趙雲`, `程咬金`; Western-origin heroes use Katakana/English like `アンジェラ`, `ドリア`).

---

## 📝 Patch Notes Workflow

- **パッチノートを反映するときは必ず [`PATCH_NOTES_WORKFLOW.md`](./PATCH_NOTES_WORKFLOW.md) に従うこと。**
  公式サイトは SPA なので HTML からは本文が取れない。CMS の API から取得する手順、`change_type` の分類ルール
  （ヒーロー項目は `buff` / `nerf` のみ、`adjust` はシステム項目専用）、`id` の命名規則、本文の書式、
  日英の対応、反映後の検証コマンドまでこの1枚にまとめてある。
- 日本語と英語は**別々の記事**として公式が出しており、`content_id` も言語ごとに異なる。両方の原文を突き合わせる。

---

## 🔍 掲載データの出所（どこから来た数字か）

**新しいデータを足すときは、必ずここに1行足すこと。** 2026-08-14 に「スキル育成優先度は捏造ではないか」と
外部から指摘されたとき、出所がリポジトリのどこにも書かれておらず、削除済みスクリプトを git 履歴から
掘り起こして判定するのに半日かかった。同じことを繰り返さないための表。

| データ | 出所 | 取得方法 | 備考 |
|---|---|---|---|
| スキルの説明文・数値・ダメージ表 | ゲーム内表示（グローバル版）を実機で撮影 | 手動撮影 → 書き起こし（`PATCH_NOTES_WORKFLOW.md` 8章） | パッチノートからの逆算は禁止 |
| 最初に上げるスキル（`meta.skill_priority`） | ゲーム内公式 HoK Camp | `scripts/fetch_camp_hero_data.js` の `firstTimeUpgradeSkill` | 旧データは中国版 pvp.qq.com 由来で、グローバル版と116体中42体が食い違っていた |
| 編成マッチ率（`meta.official_team_combos`） | ゲーム内公式 HoK Camp | 同上の `combination` | **数値は「マッチ率」＝同じチームに揃った割合。勝率ではない** |
| Tier・勝率・採用率・BAN率 | ゲーム内公式 HoK Camp | `scripts/sync_camp_tier.js` | 手動実行なので常時最新ではない |
| 苦手な相手（`meta.counters`）・相性の良い味方（`meta.synergy`） | **当サイトの解説** | 各ヒーローのスキル構成からの推論 | 公式に相当データは存在しない。理由文は相手の実キットと照合済み（`c48a363`） |
| 立ち回り・強み・弱点・コンボ | **当サイトの解説** | 検証済みスキルデータ＋Web調査（`ab51293`） | 旧版は LLM のテンプレ量産で57体が同一文だった |
| スキルのアイコン | グローバル版公式 HoK Camp | `scripts/sync_global_skill_icons.js` | 2026-08-14 に中国版CDN由来から全面差し替え（23体で絵柄が違っていた） |
| ヒーロー／アイテム／召喚士スキルのアイコン | 中国版公式CDN（`game.gtimg.cn`） | 取得スクリプトはリポジトリに残っていない | 再ホスト。アイテム114点・召喚士11点は 2026-08-14 に公式と照合し、**絵柄は全件一致**（差し替え不要）。ヒーロー117点は未照合 |
| 新ヒーロー（583 元流の子（アサシン）・585 元流の子（サポート））の heroId・英語名・アイコン | グローバル版公式 HoK Camp | `scratch/_probe_s16_new_0924.cjs` で `getherodataall` を傍受 | 2026-09-24 取得。ヒーロー画像は `camp/admin/default/` 配下で、既存の `head_128-128/` とは置き場が違う（絵柄は同系統）。この時点でランキング・推奨ビルド・編成は空 |
| シャドウアロー（`hok_items.json` 1139）のアイコン | ゲーム内の装備ショップ画面 | スクショ 4646 の合成欄の最上段を円形に切り抜いた | **暫定**。公式の `equipIcon` が取れなかったため（下の「CAMP から取り直すとき」）。上端に上級装備の印が重なっている。公式ファイルが取れたら差し替える |
| 前回の統計（`hero_stats_camp_prev.json`、Tier表などの「前回比」） | ゲーム内公式 HoK Camp | `scripts/sync_camp_tier.js` が取り直しのたびに、上書き前の統計をここへ写す | 取得日は `data_freshness.json` の `campStats.prevUpdatedAt`。初回（2026-09-25）は git の `a6ee9a3` の版（2026-09-04 取得）から作った。同じ日付で取り直したときは据え置く |
| スキル名の索引（`src/data/generated/skill_index.json`、横断検索） | 上のスキルの書き起こし | `node scripts/build_skill_index.mjs` が skills/*.json から名前だけを抜く | スキル名を直したら実行し直す。ずれは `npm run audit` の検査27が落とす |
| アルカナ | ゲーム内表示（効果値）／グローバル版公式 HoK Camp（アイコン・名称） | アイコンは `res.sgameglobal.com/social/game/Symbol/{id}.png` | 2026-08-14 に中国版由来のアイコンを削除したが、公式グローバル版から取り直して 2026-08-15 に復活。**runeId とファイル名は一致する**（装備と違う）。効果値は公式 `runeEffect` と全30件一致 |

表示側は `src/data/data_freshness.json` を単一の正とし、日付や出典をコンポーネントに直書きしない。

### 画像について、やってはいけないこと

**公式CDN（`game.gtimg.cn` など）へ直リンクしない。** 再ホストと違って相手のCDNに負荷がかかるため、
権利者側で最初に気づかれて遮断される。2026-08 のスキンギャラリー撤去で参照は0件になった。

止めているのは `scripts/audit.mjs` の「6. 外部ホストの画像」検査で、CI が push ごとに走る。
`next.config.ts` の `images.remotePatterns` も空にしてあるが、こちらに実効性はない
（`unoptimized: true` のとき `next/image` は最適化器を通らず、`hasRemoteMatch` の検証が走らないため）。
許可が必要なホストは audit 側の `ALLOW_HOST` に理由を書いて足すこと。現状の例外は
`placehold.co`（画像が無いときのフォールバック）だけ。

**アイテムIDからアイコンURLを組み立てない。** 公式は `equipId` とアイコンのファイル名が一致しない。
例えば `equipId 1714`（ガーディアン）のアイコンは `BattleEquip/1724.png` で、`1721` は別アイテム
「極影の盾・救済」のIDでもある。IDで組み立てると108種中7種で別アイテムの絵になる。
必ず公式が返す `equipIcon` の値を使い、突き合わせは名前で行う。

**ロゴを差し替えるときは `src/app/icon.png` と `public/` の両方を更新する。**
タブの favicon は App Router が `src/app/icon.png` から出す。`public/` のアイコン
（`icon-512x512.png` / `icon-192x192.png` / `apple-icon.png`）は manifest と
apple-touch-icon 用で、別系統。片方だけ替えると、タブだけ旧ロゴのまま残る。
2026-08-31 まで実際にそうなっていた。手元の `next start` では `public/` が勝って
新ロゴが出るため気づけない。**本番で `/icon.png` を curl して確かめること。**

**`src/data/hok_items.json` のIDは公式のIDではない。** サイト内部の識別子で、公式とは
6件でずれている（サイト1123=サン・ストライク／公式1123=狂暴の双刃 など）。表示には影響しないが、
公式APIを引くときにこのIDを渡してはいけない。

**中国版のデータで、検証済みの掲載データを上書きしない。** `scripts/update_arcanas.js` は
中国版 `pvp.qq.com/web201605/js/ming.json` から `hok_arcanas.json` を全面上書きするスクリプトだった。
現行データは 2026-08-12（`e0f04b0`）にグローバル版のゲーム内表示から作り直したもので、
再実行すれば中国版アルカナ・`gtimg.cn` のアイコンURL・文字化けした訳語テーブルに戻る。
2026-08-14 に削除済み。同種のスクリプトを書き足すときは、出力先が検証済みデータでないか必ず確認する。

### CAMP から取り直すとき

```bash
node scripts/fetch_camp_hero_data.js            # 全116体・10分前後
```

`api-camp.honorofkings.com` への直接リクエストは 404 になる（署名と地域判定）。実ページを開いて
`getherodataall` のレスポンスを傍受する方式にしてある。スクリプト冒頭のコメントに、取れる項目と
`skillProirity` が「優先度ではなく並び順」である旨を書いてある。

このスクリプトは 2026-08-29（`4c930b4`）に scripts/ から消えている。使うときは
`git show 4c930b4^:scripts/fetch_camp_hero_data.js > scratch/fetch_camp_hero_data.js` で戻す。

**2026-09-24 時点で、`getherodataall` の `strategyData.suitStrategy`（推奨ビルド）は全ヒーローで空。**
装備の `equipIcon` はここからしか拾えていなかったので（`scratch/fetch_global_equips.js`）、
新しい装備のアイコンは公式から取れない。CAMP のアプリ本体にも装備一覧のAPIは見つからなかった
（`scratch/_probe_camp_equip_api_0924.cjs`）。

---

## 🎨 デザイン規約（玉璽）

配色の判断が実装のあちこちに散っていた。次に触る人が測り直して同じ取り違えを
しないよう、決まっていることをここに書く。実装との食い違いに気づいたら、
どちらが正しいかを決めてから両方を直すこと。

### 地は墨 `#0e0c09`、カードは `#1a1713`（夜の配色、2026-09-26〜）

MLBB Hub の作り直し（申し送りは `docs/handoff-from-mlbb-2026-09-24.md`）に合わせて、
全体を夜の配色にした。地の色は墨・漆・青墨の3案を試作し、運営者が「墨」を選んだ。

**部品のクラス名は変えずに、色の変数の値を段ごとに写し替えている**（`globals.css` の `@theme`）。
このサイトでは次のように読み替える。

- `bg-white` … カードの地（暗い）。`text-white` は「濃い地の上の文字」なので暗い色になる
- `slate-50`〜`300` … 暗い面と線（数字が大きいほど明るい面・強い線）。`slate-500` が補足、`700` が本文、`900` が見出し
- `brand` … 玉璽の金。文字・リンク・選択中は `brand-700`
- 有彩色（emerald・rose・amber など）も同じ読み替えで写してある

値は `scratch/dark_palette_hok_0926.mjs` が地の色相から OKLCH で作り、文字と地の112組を検算した。
**色を足すときも値を手で書かず、このスクリプトで作って検算する。** 描画後の比は
`scratch/contrast_render_0926.mjs` でページごとに測れる（2026-09-26 に全ページ不足0）。

| 文字色 | 実値 | 地 `#0e0c09` | カード `#1a1713` | slate-100 |
|---|---|---|---|---|
| slate-400 | `#96918c` | 6.26 | 5.72 | 4.84 |
| slate-500 | `#b1aba6` | 8.60 | 7.86 | 6.66 |
| slate-600 | `#c7c1bc` | 10.96 | 10.02 | 8.49 |
| slate-700 | `#dad7d3` | 13.62 | 12.45 | 10.55 |
| brand-700 | `#eec379` | 11.83 | 10.82 | 9.16 |
| jade-700 | `#90ddc0` | 12.36 | 11.30 | 9.57 |

`theme-color`（`[locale]/layout.tsx`）、`public/manifest.json` と `manifest.ja.json` の2色、
OGP画像の色（`src/lib/ogImage.tsx`）も墨の値にしてある。ここが割れると、アドレスバーとページの間に段差が出る。

### 夜の配色で壊れるもの（MLBB と HoK で実際に踏んだ）

- **墨の塗り `bg-slate-900 text-white` は白く光るピルになる。** 選択中（タブ・切り替え・チップ）は
  `src/components/common/tones.ts` の `SELECTED`（金の線と淡い塗りと金の文字）を使う。検査16が止める
- **暗幕 `bg-slate-900/60` は白い膜になる。** `bg-black/60` にする
- もともと暗い面（`bg-slate-800` などの帯）は明るい面になる。カード（`bg-white`）か `slate-100` の面にする
- インラインの `style` や SVG に直に書いた色、画像の地は写し替わらない。目で見る
- `shadow-*` は暗い地ではほぼ見えない。区切りは線（`border-slate-200` など）で出す
- `dark:` 変種は使わない（明暗の切り替えは提供しない。検査16が止める）

### 金の使い方

**線が既定。塗りは序列の最上位を示すときだけ。** 今の塗りは Tier S バッジの1系統。
「選ばれている」は金の線と淡い塗り（`SELECTED`）で、塗りの金とは分けてある。
ここを混ぜると、金が「最上位」を指すのか「選択中」を指すのか画面から読めなくなる。
焦点の輪郭は `globals.css` の `:focus-visible` が `brand-700` で出す。部品側に `focus-visible:outline-*` を書かない。

ページ冒頭の題名の帯は `.page-hero`（淡い金の光）、節の見出しは `.section-title`（左に金の縦線）を使う。
ロールとレーンの図柄は `src/components/icons/GameIcons.tsx`。

### 文字サイズ

**文字は 14px（`text-sm`）以上。** 運営者の方針は「文字を小さくしない。補足でも text-sm まで」（2026-09-26、MLBB Hub と同じ）。
`text-xs` と `text-[9px]`〜`text-[13px]` は使わない。例外はふりがな（`<rt>`）だけで、本文との比で決まる
（ヒーロー一覧は `text-[8px]`、ヒーロー詳細の見出しは `text-[0.5em]`）。固定幅のマスの文字は、マスのほうを広げて 14px にする。
14px にすると語の途中で折れるラベルは、日本語の区切りに `<wbr>` を置く（ヒーロー一覧の `SubRoleText`、ヒーロー詳細の `Phrase`）か、
`[word-break:auto-phrase]`（文節で折る。Chrome の機能で、iOS Safari は未確認）を使う。
スマホで主に押す操作は高さ 44px（`h-11`）以上にする。検査16が小さい文字の再発を止める。

### 書体

日本語ページの本文は端末のフォント（iPhone・Mac はヒラギノ、Android は Noto Sans CJK、
Windows はメイリオ）。英語ページだけ Noto Sans JP を読む。指定は `globals.css` の `--font-body`。

**日本語ページに Web フォントを戻さない。** 日本語の Noto Sans JP は文字の帯ごとに124個の
ファイルに分かれ、1ページで 1.4〜2.9MB を読み、届くたびにページ全体を組み直していた。
スマホ想定（CPU 4倍遅く）で、読み込み中に画面が固まる時間が /ja/heroes で 12.5秒あり、
端末のフォントにして 2.2秒になった（2026-09-25、`db2005b`）。

`font-semibold` は `--font-weight-semibold: 700` で 700 に固定してある。4つの太さを
宣言していたころの見た目（600 の宣言が無く 700 で描かれていた）を保つため。

### 骨格を変えるときは、古いHTMLを残り物として考える

レイアウトの組み方を変えると、その組み方でしか使っていなかった utility が CSS から消える。
**閲覧側には古いHTMLが残っている。** 新しいCSSと噛み合わないと、ページが崩れる。

2026-09-23 に実際に起きた。ヒーロー詳細を2カラムから1カラムへ変えた（5f4a7f6）ところ、
`lg:col-span-5` / `lg:col-span-7` が CSS から消え、`lg:grid-cols-12` だけが他ページ由来で
残った。古いHTMLを持っている再訪者の画面では、12分割の各列にカードが1つずつ入り、
1文字ずつ折り返す状態になった。

消える utility は `globals.css` の `@source inline(...)` に一定期間残す。
残す理由と、消してよい時期をコメントに書くこと。

### 重なり順

`globals.css` の末尾にコメントで段を書いてある。新しく `z-` を足すときは
そのどれかに入れる。段の外の値を足さない。

### 見張り

`npm run audit` の検査16が、上の規約のうち機械で見られるものを見張っている。
文字色クラスの件数の上限、14px 未満の文字（上限0）、墨の塗りの選択中、`<main>` の場所、`<th>` の `scope`、`<nav>` の
`aria-label`、スキップリンクの有無、`dark:` と `touch-action` の再発。
コントラスト比そのものは監査では見ていない。`scratch/contrast_render_0926.mjs` で描画後に測ること。

---

## 🗂 掲載文の置き場所（`messages/*.json` と `src/content/*.ts`）

- `messages/*.json` … UIのラベル。ナビ、ボタン、見出しなど短いもの。
  next-intl が読む。ja/en のキー一致は `npm run audit` の検査1が見ている。
- `src/content/*.ts` … 長文の掲載文。ビルド解説・レーン別講評・一覧の注記など。
  値は `{ ja: ...; en: ... }` の型で日英が対になっていて、**型が片方の抜けを止めている。**

**掲載文を JSON へ移さないこと。** 移すとこの型の強制が消える。
JSON 側の穴は検査2（EN日本語残留）が見ているが、`src/content` には同じ検査が
無かったため、2026-09-01 に検査14を足した。`en:` の値を括弧の対応で切り出し、
日本語が混じっていたら落とす（コメントは除く）。走査対象は272ブロック。

英語ページの目視は `npm run smoke` が担当する。`src/content` を英語で描画する
URLは `/en/spells`（spellGuide）・`/en/arcana`（listNotes）・
`/en/tier-list/jungle`（laneTierPages）の3本で、いずれもPAGESに入れてある。
ただしスモークは116体中2体しか踏まないので、buildNotes.ts の227ブロックを
守っているのは検査14のほうになる。

---

## ✍️ 掲載文の書き方（`skills/*.json` の strategy / playstyle / strengths / weaknesses）

文体の基本は `~/.claude/CLAUDE.md` の「自然な日本語のルール」12項目に従う。
ここには、このサイトの掲載文を全数計測して分かった固有の問題だけを書く（2026-08-14 実測、日本語15.8万字）。

### 1. 「向いている人」欄のテンプレートを崩す

最も直さなければならない箇所。`playstyle.suited` は **116体すべてが「〜たい人／〜が好きな人。〜人に向く。」の2文型**で、
110/116 が「人に向く。」で終わり、**64%は具体語がひとつも入っていない**。
外部から「LLMの標準出力そのもの」と指摘されたのはここ。

- ✗ 残りHP1割の攻防が好きな人。引き際を見誤らない胆力と計算を両立できる人に向く。
  （検証できない性格論だけで、読者が自分に当てはまるか判断できない）
- ✓ スキル1を外すと即死する場面が多いので、CDを数えながら殴れる人向け。
  逆に、殴り合いの最中に味方の位置を見る余裕がないうちは事故が多い。

文型を固定しない。「〜な人に向く」で締めない回を作る。操作・判断・練習量など、
読者が自己判定できる基準を1つは入れる。

### 2. アイテムは実名で書く

15.8万字のうちアイテム実名の言及は**10件程度**しかなく、代わりに「コアアイテム」という抽象語で**11回逃げている**。
ビルドは攻略記事の核心なので、ここが空だと「実際に使っていない人が書いた」と読まれる。

- ✗ コアアイテムが1〜2個完成する7〜9分から
- ✓ 賢者の書と冷徹の杖が揃う7〜9分から

### 3. 立ち回り4節の水準は維持する

`strategy` の序盤/中盤/終盤/集団戦は **464件すべてが数値かスキル名を含み、一般論だけの文は0件**。
秒数322回・%251回・分181回・レベル指定131回が入っている。この水準は落とさない。

良い例（108 墨子 earlyGame）:
> 砲弾は最初に触れた敵で爆発するため、ウェーブの切れ目や相手がラストヒットを取りに前へ出た瞬間を狙うこと。
> 1秒スタンが決まればスキル1の突進から強化通常攻撃まで確定で入ります。

### 4. スキル説明に解説を混ぜない

`passive` / `skill1`〜`skill4` の `description` は**ゲーム内表示の書き起こし**であって、解説ではない。
攻略のコツ・評価・立ち回りを混ぜない。それらは `strategy` 側に書く。
（詳細は `scratch/ocr/REWRITE_SPEC.md`）

### 5. 過去にやらかしたことなので繰り返さない

- 同一文が57体で使い回されていた（`scratch/forbidden_template_sentences.json` に62種を記録）。
  現在は残存0件。書き足すときは、この一覧に載っている文型を再登場させない
- 相性の理由文に、相手ヒーローが持っていない能力を書いていた（貂蝉「無敵(i-frames)」など6件）。
  理由文は必ず相手の実キット（検証済みスキルデータ）に照らして書く

---

## 🛒 おすすめビルドの解説（`src/content/buildNotes.ts`）

手順とルールの全体は [`docs/BUILD_NOTES.md`](docs/BUILD_NOTES.md)。ビルドを撮り直したら必ず読む。
材料は `node scripts/build_notes_source.mjs` で作る。要点は3つ。

### スキルには触れない

スキル名・「スキル1」〜「スキル4」・「奥義」を本文に出さない。
根拠にしてよいのは `hok_items.json` と `hok_arcanas.json` だけで、
材料生成スクリプトがスキルを渡さない作りになっている。

2026-08-31 の初版ではスキル説明も渡して「スキルと装備の噛み合いを書け」と指示した。
結果、27本中15本がスキルの解説になり（白起ビルド1は装備に触れる文が0）、
検証で出た78件の指摘はほぼ全部がスキル仕様の読み違いだった。
材料からスキルを外して書き直したら、スキル名の出現は0件になった。

上の「4. スキル説明に解説を混ぜない」と対になる。書き起こしに解説を混ぜないのと同じく、
解説に書き起こしを混ぜない。

### 装備の並びは買う順

`hero_item_builds.json` の `items` は買う順に並んでいる。227本中226本で靴が1〜2品目に来ること、
品目別の平均価格が 1,370G → 2,173G と単調に上がることから確認した（2026-08-31）。
だから買う順そのものが解説の材料になる。

### 差が小さいビルドに対立軸を作らない

2本あるヒーロー111体のうち、装備の違いが1品以下は40体。うち9体は装備が完全に同じで、
公孫離とタイガーは買う順以外まったく同一だった。ここで「攻めの型」対「守りの型」と書けば嘘になる。
差が無いときは、無いと正直に書く。

`npm run audit` の13番が、ビルド本数と解説本数のずれ、`when` の重複を見張る。

---

## 📌 Recent Handover & Updates
- **Handover Doc**: See [`HANDOVER.md`](file:///c:/Users/81901/Desktop/%E3%82%AA%E3%83%8A%E3%83%BC%E3%82%AA%E3%83%96%E3%82%AD%E3%83%B3%E3%82%B0%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88/HANDOVER.md) for full audit history and text refactoring details.
- **Latest Fixes (Commit `4a2f14e` + follow-up)**:
  - Japanese prose polished across `messages/ja.json`, `src/data/skills/ja.json`, `macro/page.tsx`, and `src/content/listNotes.ts`.
  - Machine-translated pronouns ("彼", "彼女") replaced with actual hero names. `4a2f14e` covered 22 entries but **left 11 behind**; those were fixed afterwards, so表示データ側の代名詞は 0 件になっている。
    `meta.counters` / `meta.synergy` の文は「そのページのヒーローが**相手**をどう扱うか」を書いているため、代名詞が指すのは同じ配列内の `hero_name`（相手側）である。取り違えると別ヒーローの名前が入るので注意。
  - `meta.advantages`（有利な相手）は廃止した。他ヒーローの `counters` を逆引きしてコピーしていただけで、掲載数が「何体から苦手と書かれたか」で決まってしまい、読者に示せる根拠がなかったため。相性欄に載せるのは `counters` と `synergy` のみ。
  - `src/data/parsed_skills/` にはまだ代名詞が残っているが、`translate_skills.py` が同ディレクトリ内で読み書きするだけの中間データで、サイトには表示されない。
  - Typo fixes: `ギャンク` -> `ガンク`, `初回清掃` -> `初回のジャングルクリア`, `川の川の精霊` -> `川の精霊`.
  - All 500 pages compile cleanly with 0 TS/Turbopack errors and pass `npm run audit`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
