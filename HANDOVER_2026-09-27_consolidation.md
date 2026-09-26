# 引き継ぎ（2026-09-27）サイト統合の調査と、この日の作業

クレジット切れで中断されたときに、続きから再開するための書き置き。
**再開したら、まず下の「1. 動いていた調査」を見る。**

## 0. 運営者の決定（2026-09-27）

- 4サイトを hub-game.com の1つにまとめる。ポータルが直下（/ja）、各サイトは前置きの下で
  `/hok/ja/…`・`/mlbb/ja/…`・`/wildrift/ja/…`。前置きの名前は今のサブドメインと同じ
- アプリは4つのまま別々に残す（Next.js のマルチゾーン）。1つのアプリには作り直さない
- ホスティングは Cloudflare に一本化。4つとも MLBB と同じ静的書き出し（`output: 'export'`）にそろえる
- 旧サブドメインは新しいパスへページ単位で 301
- **ワイリフのフォルダ（`Desktop\ワイリフサイト`）は、この計画のために「読むだけ」許可を得た。** 編集・ビルド・npm install はしない
- 記憶: `hub-game-consolidation-plan.md`

## 1. 動いていた調査（ワークフロー）

4サイトのリポジトリを読むだけで洗い出し、検証するワークフロー。エージェント9本。

- 調べる係 4本（portal / hok / mlbb / wildrift）→ 検証係 4本 → 別に Cloudflare と Next.js の仕様の調査 1本
- Run ID: `wf_771f4c77-660`（タスク `wg6jvutzj`）
- スクリプト: `C:\Users\81901\.claude\projects\C--Users-81901-Desktop-------------\00a09a67-0a73-4ada-ac6e-c3cb0365ab43\workflows\scripts\hub-game-consolidation-survey-wf_771f4c77-660.js`
- 途中結果: `C:\Users\81901\.claude\projects\c--Users-81901-Desktop-------------\00a09a67-0a73-4ada-ac6e-c3cb0365ab43\subagents\workflows\wf_771f4c77-660\journal.jsonl`
  （終わったエージェント1本ごとに `{"type":"result",...}` が1行ずつ入る）

再開のしかた:

- **同じセッションが続いているとき**: `Workflow({ scriptPath: <上のスクリプト>, resumeFromRunId: "wf_771f4c77-660" })`。
  終わったエージェントは記録から即座に返り、残りだけ動く
- **新しいセッションのとき**: resume は同じセッションでしか効かない。まず journal.jsonl を読み、
  終わっているエージェントの結果を取り出す。足りない分だけ、同じスクリプトの該当部分を新しく回す
  （サブエージェントを4本以上回すときは、本数・目的・モデルを先に運営者へ出す）

結果が揃ったら `scratch/wf_consolidation_survey_0927_result.json` に写してから使う。

## 2. 次にやること

1. 調査結果（4サイトの影響一覧・検証・Cloudflare の仕様）を読み、プランを確定版にする
   - サイトごとの「直すものの一覧」（ファイルと行、止めるものか、手間）
   - ドメイン直下での振り分けの組み方（Workers のルートか、Pages を Worker の後ろに置くか）
   - 試作 → ポータル → HoK → ワイリフ → 切り替え → 後片付け、の順番と目安
2. 確定版を共通の置き場に書く案: `Desktop\hub-game-rules\docs\CONSOLIDATION_PLAN.md`
   （4つのセッションが読むため。他リポジトリへの書き込みなので、書く前に運営者へ一言確認する）
3. 運営者へ日本語で報告する

## 3. ここまでに自分で確かめた事実（調査の結果が消えても残るように）

- ホスティング: ポータル・HoK・ワイリフは Vercel、MLBB は Cloudflare（Pages、静的書き出し）。
  DNS はすでに Cloudflare（NS は malcolm / rita.ns.cloudflare.com）。hok は `cname.vercel-dns.com`、ルートは Vercel の 76.76.21.21
- 地の色（theme-color）: HoK `#0e0c09`、MLBB `#0a1122`、ワイリフ `#0b0d22`、ポータル `#090c13`（9/27 に夜の配色へ）
- MLBB: `output: 'export'`。ミドルウェアと headers() を `public/_redirects` と `public/_headers` に移してある。書き出しは 2,559 ファイル
- HoK がサーバーに頼っている所は3つ。proxy（next-intl の言語振り分け）、next.config の redirects()（ヒーローID→slug）と headers()（画像キャッシュ）、
  `/api/latest` と `/feed.xml` の revalidate 1800（中身はリポジトリの JSON なのでビルド時に固定できる）。
  書き出しの規模は概算 3,000〜5,000 ファイル（HTML 331・RSC 1,653・public 769・static 303 を数えた）
- HoK に `hok.hub-game.com` を直書きしているファイルが 12
- ブラウザ保存のキーの接頭辞: HoK `hok_`、MLBB `mlbb_`、ポータル `hubgame_`。ワイリフは未確認
- ポータルは各サイトの `/api/latest` を revalidate 1800 で取り込んでいる（`src/lib/sisterSites.ts`）。静的書き出しでは使えないので、
  統合後はブラウザ側で `/hok/api/latest` などを読む形に変える案
- next/image の src に basePath が自動で付かない（Next.js の docs で要確認。付かなければ、データ JSON の `/images/...` に前置きが要る）
- Cloudflare の上限（1プロジェクト2万ファイル）は未確認

## 4. この日に済ませたこと（すべて push 済み）

| リポジトリ | コミット | 中身 |
|---|---|---|
| HoK | 24f7409 | 元流の子（アサシン・サポート）の立ち回りを書き直し |
| HoK | d4cb4ae | アジア競技大会ページ（出場10か国・組み分け・形式・観かた、日程を9/27〜28に訂正） |
| HoK | 1338f9d | フッターの姉妹サイトに MLBB Hub |
| HoK | 837bfd7 | HoK Camp 9/25 版の統計、新ヒーロー2体を Tier 表へ、レーン講評、初心者向けミッドを小喬→アンジェラ |
| HoK | a776a8d | パッチノートの「⚔️」をやめ、中身に合った図柄に（ワイリフからの申し送り） |
| ポータル | 55aa94f | 夜の配色（青みの墨 #090c13、琥珀）。18ページでコントラスト不足0 |

ワイリフの「パッチ 7.3 が出ない」件: ワイリフの `/api/latest` がまだ 7.2e（9/9）を返している。ワイリフのセッションの担当。

## 5. 残した課題

- ポータルの文字の14px化（3サイトではやった。ポータルは配色だけ）
- アジア競技大会: 9/28 の決勝後にメダル結果を載せ、ページを過去形に直す（`src/content/asianGames2026.ts` 冒頭の手順）。
  トップのバナーは 9/29 0時以降の再ビルドで消える
- 未確認のまま: 本大会の BAN/PICK 方式、9/27 の観戦チケット、Asian Games TV の HoK 配信、使える85体の名前、ネパールとベトナムが出ない理由
