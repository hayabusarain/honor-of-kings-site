# AGENTS.md - Developer & Agent Guidance

This project is a Next.js 16 (Turbopack) web application for **Honor of Kings Global (HoK)**.

---

## ⚡ Quick Start & Verification Rules

1. **Local Development**:
   - `npm run dev` starts the dev server on `http://localhost:3000`.
   - Never deploy to production without explicit user confirmation.
2. **Build Verification**:
   - Always run `npm run build` after editing components or data. All static pages must compile cleanly with 0 TypeScript / Turbopack errors.
3. **Data Audit (must pass before commit)**:
   - `npm run audit` — checks i18n key parity, Japanese leakage in EN data, broken image references, ja/en skill data gaps, and hero naming conventions. Run it after ANY data file change.
   - `npm run smoke` — opens 26 key pages in a real browser (requires `npm run dev` running) and checks for console errors, 404s, and Japanese text on EN pages.
   - CI (GitHub Actions) runs audit + lint + build on every push.
4. **Hero Naming Convention**:
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

## 📌 Recent Handover & Updates
- **Handover Doc**: See [`HANDOVER.md`](file:///c:/Users/81901/Desktop/%E3%82%AA%E3%83%8A%E3%83%BC%E3%82%AA%E3%83%96%E3%82%AD%E3%83%B3%E3%82%B0%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88/HANDOVER.md) for full audit history and text refactoring details.
- **Latest Fixes (Commit `4a2f14e` + follow-up)**:
  - Japanese prose polished across `messages/ja.json`, `public/data/skills/ja.json`, `macro/page.tsx`, and `src/content/listNotes.ts`.
  - Machine-translated pronouns ("彼", "彼女") replaced with actual hero names. `4a2f14e` covered 22 entries but **left 11 behind**; those were fixed afterwards, so表示データ側の代名詞は 0 件になっている。
    `meta.counters` / `meta.synergy` の文は「そのページのヒーローが**相手**をどう扱うか」を書いているため、代名詞が指すのは同じ配列内の `hero_name`（相手側）である。取り違えると別ヒーローの名前が入るので注意。
  - `meta.advantages`（有利な相手）は廃止した。他ヒーローの `counters` を逆引きしてコピーしていただけで、掲載数が「何体から苦手と書かれたか」で決まってしまい、読者に示せる根拠がなかったため。相性欄に載せるのは `counters` と `synergy` のみ。
  - `src/data/parsed_skills/` にはまだ代名詞が残っているが、`translate_skills.py` が同ディレクトリ内で読み書きするだけの中間データで、サイトには表示されない。
  - Typo fixes: `ギャンク` -> `ガンク`, `初回清掃` -> `初回のジャングルクリア`, `川の川の精霊` -> `川の精霊`.
  - All 500 pages compile cleanly with 0 TS/Turbopack errors and pass `npm run audit`.
