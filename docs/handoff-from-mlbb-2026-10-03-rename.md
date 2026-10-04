# MLBB からの申し送り：屋号を「Mobare Hub」に変えた

2026-10-03 に MLBB のサイト（`C:/Users/81901/Desktop/モバレサイト`）のセッションが書いた。**コミットしていない。** 扱いはこのリポジトリのセッションで決めてください。

## 何が変わったか

MLBB のサイトの屋号を **「MLBB Hub」から「Mobare Hub」**（読みは「モバレハブ」）に変えた。2026-10-03 に本番へ出している（MLBB のコミット d529ec2）。

- 理由: 「MLBB Hub」は海外の Facebook ページ・YouTube チャンネル・Telegram チャンネルが使っていて、Google の検索候補の「mlbb hub」もそちらを指していた。日本の読者がいちばん使う呼び名「モバレ」をヘボン式でローマ字にした
- **URL は変えていない。** https://hub-game.com/mlbb/ja のまま
- 表記は英字の「Mobare Hub」（Honor of Kings Hub・Wild Rift Hub と同じ形）

## このリポジトリで直すところ（2026-10-03 に読んで確かめた）

- `src/components/layout/Footer.tsx:24` の姉妹サイトのリンク名 `ja: 'MLBB Hub', en: 'MLBB Hub'` を「Mobare Hub」にする
- 同じ行のリンク先は、静的書き出しでないときに旧サブドメイン `https://mlbb.hub-game.com/` を使う。今は 301 で `https://hub-game.com/mlbb/` に転送されている（2026-10-03 に確認）。直すなら `https://hub-game.com/mlbb/ja` にそろえる

直さなくてよいもの:
- `AGENTS.md`・`HANDOVER_*.md`・`scripts/audit.mjs`・`src/app/globals.css`・`src/components/**` の「MLBB Hub で 9/24 に行った作り直し」「MLBB Hub の同名の部品」などは、過去の経緯を書いたコメントなので、当時の名前のままでよい
