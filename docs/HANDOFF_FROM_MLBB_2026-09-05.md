# MLBB Hub の作業からの引継ぎ（2026-09-05）

MLBB Hub（`C:\Users\81901\Desktop\モバレサイト`）を作っていたセッションから、HoK Hub を担当するエージェントへの申し送り。
運営者の指示で 3 サイト（HoK・ワイリフ・MLBB）を同じ物差しで比べ、HoK 側で直せるものは直した。
以下は「このリポジトリに今日入れた変更」「比較で分かった HoK の強みと弱み」「MLBB から持ってこられる道具」「落とし穴」の順。

## 1. 今日このリポジトリに入れたもの（コミット `d05575b`）

`scripts/audit.mjs` に検査を 2 本足した。既存の 20 本は触っていない。

- **検査21 統計の健全性** — `hero_stats_camp.json` の `win_rate` / `pick_rate` / `ban_rate` が 0〜100 の範囲か、`tier` と `lane` が欠けていないか、`data_freshness.campStats.updatedAt` が `YYYY-MM-DD` か。
- **検査22 クライアントJSON** — `'use client'` のファイルが `@/data/*.json` を直接 import している箇所を数える。今は **8 ファイル 23 箇所**（`data_freshness.json` は除外）。`BASELINE = 23` を超えたら止まる。減らしたら `BASELINE` を下げること。

監査は `npm run audit` で通る状態（警告 1 件＝上の 23 箇所）。

## 2. 比較で分かったこと

### HoK の強み（3 サイトの中で）

- **読者の一番の質問「何を積むか」に答えられる唯一のサイト。** 装備 105KB、装備シミュレータ、採用率、アルカナ計算機、ビルド 2 型と理由付き解説。MLBB は装備データが無く、ワイリフは AI 生成のビルド解説。
- **詳細の第一画面**が「誰で・どれくらい強く・何を積むか」で完結している（左に固定カード、右にビルド）。
- **一覧の見渡し**は 1 行 10 体で 3 サイト最多。
- 監査 20 本は 3 サイトで最も多く、MLBB の監査はここから継いだもの。

### HoK の弱み

1. **クライアント部品が JSON を丸ごと抱えている。** 内訳（サイズは `src/data` の実測）:
   - `src/components/search/GlobalSearchModal.tsx` — `patches.json` 183KB、`hok_items.json` 105KB、`hok_heroes.json` 36KB、`patch_meta.json` 28KB、`hok_spells.json`、`hok_arcanas.json`、`guide/ja.json`、`guide/en.json`
   - `src/components/heroes/HeroDetailClient.tsx` — `hok_heroes.json`、`hero_base_stats.json` 53KB、`hero_stats_camp.json` 17KB、`hok_arcanas.json`
   - `HeroesListClient.tsx`、`home/HomeClient.tsx`、`patches/PatchTable.tsx`、`tier-list/TierListClient.tsx`、`spells/SpellsClient.tsx`、`app/[locale]/arcana/page.tsx`、`items/page.tsx`、`guide/beginner-heroes/page.tsx`
   
   MLBB で同じ問題を直した手順: (a) 検索モーダルは `MobileAppShell` から `next/dynamic` の `ssr:false` で開くまで読まない、(b) それ以外はサーバー部品（page.tsx や `src/lib/*.ts`）で JSON を読んで、必要な形に絞って props で渡す。参考は MLBB の `src/components/mobile/MobileAppShell.tsx` と `src/lib/heroSkills.ts`。MLBB はこれと先読み制御（`src/lib/prefetchPolicy.ts`）・64px アイコン（`scripts/make_icon_sizes.mjs`）で 1 ページ 2.0MB → 1.4MB になった。**転送量は `performance.getEntriesByType('resource')` の transferSize で測る**こと。content-length は非圧縮の値を返すので 3 倍に見える。

2. **翻訳がページ内の三項演算に散っている。** `messages` は 99 キーしか無く、`locale === 'ja' ?` が 467 か所。動いてはいるが、EN 日本語残留の検査（検査2）は JSX の中の文字列を見ないので、英語ページに日本語が混じっても気づけない。急がないが、触ったページから `messages` へ寄せると検査が効くようになる。

3. **統計が 1 期間の snapshot。** HoK Camp の 2026-08-28 取得分だけ。MLBB は公式 API が 5 期間 × 6 ランク帯と 30 日推移を出すので、詳細ページで期間とランク帯を切り替えられる（`src/components/heroes/HeroStatsPanel.tsx`、`HeroTrendChart.tsx`）。HoK Camp に期間やランク帯の切り口があるなら、同じ部品構成で載せられる。

### 見た目

MLBB は今日、HoK と見分けが付くよう紺と金・青白の地に変えた。HoK は金と白磁のまま。両方の運営者は同じ人なので、**HoK 側で色を変える必要は無い**。変えるなら MLBB の `AGENTS.md` の「デザイン規約」にコントラスト比の表と検算方法（`scratch/contrast.mjs`）がある。

## 3. MLBB から持ってこられる道具（パスは MLBB リポジトリ内）

- `scratch/shot.mjs` — puppeteer で任意のページを 1440px / 390px で撮る。`next start -p 3011` を先に立て、path は先頭の `/` 無しで渡す（Git Bash が `/ja` を `C:/Program Files/Git/ja` に化けさせる）。3 サイトの比較画像は `scratch/shots/hok-*.png` `wr-*.png` `final-*.png`。
- `scratch/contrast.mjs` — WCAG のコントラスト比を地の候補 × 文字色で一覧にする。
- `scripts/find_unused_messages.mjs` — どこからも参照されない翻訳キーを洗う。
- スキル本文の書き起こし手順 — 1 体 1 エージェントで画像を読む → 別エージェントが同じ画像で反証 → 指摘が出た体だけ書き直す、の 3 段。数値は公式英語データと機械照合（`scratch/check_skills_ja.mjs`）。HoK のスキルデータを見直すときに同じ型で回せる。切り出し座標は 1920×1080 の `left:90, top:55, width:1725, height:830`。

## 4. 落とし穴（今日踏んだもの）

- **Bash のヒアドキュメントはバックスラッシュを削る。** `<<'EOF'` でも `\s` が `s` になり、正規表現を含む JS を流すと壊れる。ファイルは Write ツールで作ってから `node` で実行する。今日これで監査を一度壊し、`git checkout -- scripts/audit.mjs` で戻した。
- **python の `io.open(p, 'w')` は LF を CRLF に変える。** 置換は node（`fs.writeFileSync` は改行を触らない）か Edit ツールで。
- このリポジトリは checkout 時に CRLF へ正規化する設定（git の警告「LF will be replaced by CRLF」）。逆らわず、改行は git に任せる。
- **`next build` の前に開発サーバーを止める。** 同じ `.next` で build と dev を交互に走らせると、開発サーバーがアイドルで 10 コア・9GB を食い続けた（MLBB で実測）。`.next` を消して dev を立て直すと直る。

## 5. 運営者の決まり（3 サイト共通）

- やり取りは日本語。掲載文の書き方は `~/.claude/CLAUDE.md` の「自然な日本語のルール」。
- サブエージェントは最低 Opus（Sonnet は使わない）。監査・一次走査は Opus、反証・判断・執筆は Fable。4 本以上回す前に本数・目的・モデルを提示する。
- `git push` とデプロイは明示の指示があるときだけ。コミットは作業の区切りごとに行ってよい。
- `scratch/` は消さない。
