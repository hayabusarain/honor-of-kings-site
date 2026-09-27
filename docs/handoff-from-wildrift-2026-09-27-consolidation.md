# サイト統合の返信（Wild Rift のセッションから、2026-09-27）

`ワイリフサイト/docs/handoff-from-hok-2026-09-27-consolidation.md` の 2 章（今すぐ始められる作業）を Wild Rift の main で済ませ、
本番（Vercel）に出した。コミットは 8104816。書いたのは Wild Rift のセッションで、このファイルは未コミットで置いてある。

## 1. 済んだこと（申し送りの 2 章の 1〜7）

1. **Supabase の中身の書き出し**: 5 表（patches・patch_meta・wr_champion_details・localization_dictionary・champion_counters）を読むだけで書き出し、同梱 JSON と比べた。
   patches と patch_meta は行の集合が同じで、本文の差（87 行・3 行）はすべて JSON 側の推敲だった。
   wr_champion_details は 168 行すべてで skills が空、localization_dictionary は 2 行で、どちらも表示に使われていなかった。
   控えはリポジトリには入れていない（本番データをリポジトリへ写す操作が自動で止められた。扱いは運営者に確認中）。
2. **Supabase を外した**。ビルドに環境変数は要らない。revalidate・unstable_cache・fetch の next.revalidate も外し、全ルートが ○/● になった。
   ただし `champions/[id]` と `patches/[version]` の `dynamicParams = true` は残した。小文字や英語名の URL の 308（/champions/aatrox・/champions/Wukong）と、
   最新版の URL（/patches/7.3 → /patches）の転送を、今の本番で保つため。書き出しのブランチで false にし、転送は `_redirects` に移す。
3. **カウンター投票をやめた**。counters.json の weak_against を並べるだけの一覧にした。プライバシーポリシーの投票の節を外した（6 節に詰めた）。
4. **管理画面と管理 API を消した**（ページ 3・API 3。チャンピオン詳細とアイテム一覧の開発時だけの編集ボタンも）。
5. **パッチ検索**: `/api/patches?q=` をやめ、全行を言語ごとに `/api/patches/ja.json`・`en.json` に焼いてブラウザで絞り込む。
   本文はページの言語だけ（もう一方の言語の本文にしか無い語は当たらなくなった）。行の名前は日英とも当たる。
6. **OG 画像**: `/api/og?t=` をやめ、23 ルートに `opengraph-image.tsx` を置いた（MLBB と同じ。見出しは各ルートの generateMetadata の title）。
   MLBB と違う点が 3 つある。どれも Wild Rift のレビューで見つかったもので、MLBB と HoK にも当てはまるかもしれない。
   - **URL に絵の中身の版を付けた。** ファイル規約が付ける `?<ハッシュ>` は opengraph-image.tsx のソースからしか作られず、
     統計の日付やパッチの版を描き直しても URL が変わらない。Facebook などは画像を URL 単位で持つので古い絵が残る。
     `buildPageMetadata` で `/<ページ>/opengraph-image?v=<見出し・版・日付のハッシュ>` を og:image に明示し、`og:image:alt` も付けた
   - **opengraph-image.tsx に `dynamicParams = false`。** 無いと `/ja/patches/<任意の文字列>/opengraph-image` や `/api/opengraph-image` を
     その場で描いて 200 を返し、URL の文字列をサイトの体裁で焼く（/api/og をやめた理由と同じ穴が残る）
   - **フォントを prebuild で取り、`fonts` に渡す。** 渡さないと next/og は 1 枚ごとに Google Fonts へ字形を取りに行き、
     失敗しても字の抜けた PNG を黙って焼く。`scripts/fetch-og-font.mjs` が Noto Sans JP（400・全部入り・約 5MB）を
     `node_modules/.cache/og-fonts/` に置き、取れなければビルドを止める。英字は next/og 既定の Geist を先に並べたので、絵は /api/og のころと同じ
7. **404**: `experimental.globalNotFound` と `src/app/global-not-found.tsx` にした。`not-found.tsx` は force-dynamic を外して残した。
   **注意**: ルートレイアウトが [locale] を兼ねる作りでは、`[locale]/layout.tsx` が言語の不正で投げた notFound() を
   `src/app/not-found.tsx` が受ける（/api/items・/data/… など）。「予備」と思って消すと、その 404 が壊れる

ついでに見つけて直したもの:
- **ポータルに 7.3 が出ない件**: /api/latest が「解説（patch_meta）がある版の最大」を最新にしていて、7.3 の解説が無かった。
  最新版をパッチ行から決める形にし、7.3 の解説も足した。ポータルには 30 分以内に出るはず。最新版の解説が無いと監査が止める。
- **/api・/api/items・/api/champions などが本番で 500** だった。proxy を通らない /api/… が「言語 = api」のページとして描かれ、
  setRequestLocale を呼んでいないページで next-intl が headers() を読んでいた。9 ページに足して 404 にした。
  CONSOLIDATION_FINDINGS の「未確認: setRequestLocale を呼んでいないページ」の件も、これで片付いた。
  **[locale]/layout.tsx に dynamicParams = false を置く直し方は使えない**。子の champions/[id] などの dynamicParams = true まで効かなくなった（手元で実測）

## 2. 3 章（ブランチの作業）の見積もり

2 章が済んだので、残りはほぼ「手間 S」の項目で、Wild Rift のセッションで **4〜5 時間**（全ページの確認の周回を含む）と見ている。
共通ルール 8 章のとおり前置きをビルド時の環境変数で切り替えるなら、ほとんどは main に入れても今の本番を壊さない。

| 項目 | 量 | 手間 |
|---|---|---|
| `NEXT_PUBLIC_BASE_PATH`・`NEXT_PUBLIC_SITE_ORIGIN` で basePath・output・metadataBase を切り替える。`postbuild_basepath.mjs` を postbuild に | 設定 1 か所 | S |
| `next/image` と画像データの前置き（包み関数） | `<Image>` 40 か所・15 ファイル、onError の既定画像 12 か所、画像パスを返す関数 3 本 | M |
| ブラウザの fetch の前置き | search-index・calc_skills.json・patches/{ja,en}.json の 3 本 | S |
| `wildrift.hub-game.com` の直書きを定数へ | src の 10 か所 | S |
| `location.pathname` の判定（NotFoundLinks・GlobalSearchModal） | 2 か所 | S |
| proxy.ts と next.config の転送 5 本を `_redirects` へ。小文字 ID 142 体・Wukong・Nunu・最新版の転送を生成し、2 ページの dynamicParams を false に | 生成スクリプト 1 本 | M |
| `_headers`（セキュリティヘッダー・キャッシュ・拡張子の無い OG 画像と /api/latest の Content-Type） | 1 本 | S |
| manifest の id・scope・start_url、ブラウザ保存のキーに `wr_`（sessionStorage 5 つ。投票の localStorage は消えた） | — | S |
| Link の先読みを止める包み、Atom フィードの id を旧 URL で固定、GA の content_group | — | S |
| Node の版の固定、npm 10.9.2 で `npm ci`、wrangler の直接デプロイを止める権限設定（運営者） | — | S |
| robots・ads.txt・サイトマップの索引をポータルへ | ポータル側の作業 | S |

## 3. hub-game-rules から届いたもの

AGENTS.md の共通ブロック（8 章 サイト統合）と `scripts/postbuild_basepath.mjs` が Wild Rift の作業ツリーに届いている。
手で直さない決まりなので、Wild Rift のセッションはコミットに含めていない（配ったセッションか運営者がコミットする想定）。
