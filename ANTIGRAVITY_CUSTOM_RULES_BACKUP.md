# Antigravity AI - カスタムルール & システム設定バックアップ (PC移行用)

PC初期化後、新しい環境やセッションへAntigravity AIの各種ルールを移行するための完全バックアップドキュメントです。
新しいPCでAntigravityを再セットアップする際、以下をカスタム設定（Global Rules / `AGENTS.md`）にコピペしてご使用ください。

---

## 🌐 1. グローバルユーザー定義ルール (Global User Rules)
> **設定場所**: `C:\Users\<ユーザー名>\.gemini\antigravity\user_global` または Antigravity カスタムルール設定画面

```xml
<RULE[user_global]>
<!-- BEGIN:data-rollback-rule -->
# データ・ファイルを巻き戻す・削除する際の厳格なルール
データを巻き戻す操作（`git checkout`、`git reset`、過去のバックアップファイルでの上書き、ファイルの一括削除など）を実行する前に、**必ず以下のステップを踏んでユーザーに説明し、明示的な許可を得ること**を絶対のルールとする。

1. **巻き戻し・削除対象の明示**: どのファイルを、どの時点（コミットハッシュや日時）の状態に巻き戻すのか、どのファイルを削除するのかを具体的に説明する。
2. **失われるデータの明示**: 巻き戻しや削除によって「消去されてしまう未保存（未コミット）の変更やデータ」が何なのかをリストアップして警告する。
3. **許可の要求**: 「本当に実行してよろしいですか？」と問いかけ、ユーザーが「はい」と答えるまで実行をブロックする。
<!-- END:data-rollback-rule -->

<!-- BEGIN:subagent-planning-rule -->
# 作業実行前のサブエージェント必要性検討ルール
何らかの作業（タスク）を実行する前に、必ず**「この作業にはサブエージェント（並列処理や専門特化エージェント）を起動した方が効率的・安全か？」**を自ら検討すること。

サブエージェントを起動したほうが良いと判断した場合、作業を開始する前（または計画段階）で**必ずユーザーへ以下の情報を提示すること**：
1. **必要数**: 起動するサブエージェントの数
2. **用途**: それぞれのサブエージェントが担当する具体的なタスク内容
<!-- END:subagent-planning-rule -->

<!-- BEGIN:force-pro-subagents-rule -->
# サブエージェントの最高スペック（Proモデル）強制ルール
サブエージェントを起動（invoke_subagent）する際は、クレジット消費をいとわず、必ず最高スペックのモデル（Model: 'pro'）を指定することを絶対のルールとする。
デフォルトの軽量モデル（Flash等）は精度の問題から使用せず、常に最も精度の高い解析・推論を行わせるため、明示的にProモデルを選択すること。
<!-- END:force-pro-subagents-rule -->
</RULE[user_global]>
```

---

## ⚔️ 2. Honor of Kings プロジェクト固有ルール (`AGENTS.md`)
> **設定場所**: プロジェクト直下の `AGENTS.md`

```markdown
# AGENTS.md - Developer & Agent Guidance

This project is a Next.js 16 (Turbopack) web application for **Honor of Kings Global (HoK)**.

---

## ⚡ Quick Start & Verification Rules

1. **Local Development**:
   - `npm run dev` starts the dev server on `http://localhost:3000`.
   - Never deploy to production without explicit user confirmation.
2. **Build Verification**:
   - Always run `npm run build` after editing components or data. All 512 static pages must compile cleanly with 0 TypeScript / Turbopack errors.

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
```

---

## 📝 3. PC初期化後の引き継ぎ・セットアップ手順
1. リポジトリを `git clone` して `npm install` を実行。
2. 上記の「1. グローバルユーザー定義ルール」を Antigravity のカスタムルール設定に入力。
3. `AGENTS.md` および `PROJECT.md` は本リポジトリにコミット済みのため、そのまま Git 経由で復元されます。
