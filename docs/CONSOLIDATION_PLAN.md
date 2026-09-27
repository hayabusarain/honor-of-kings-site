# サイト統合の計画（2026-09-27 確定版）

4サイト（ポータル・HoK・MLBB・Wild Rift）を hub-game.com の1つにまとめる計画。
サイトごとの「直すものの一覧」（ファイル・行・直し方、121件）は付録の `docs/CONSOLIDATION_FINDINGS.md` にある。
4つのリポジトリを読むだけで洗い出し、別のエージェントが1件ずつ反証した（反証で消えたもの0件、見落としの追加16件）。
Cloudflare・Next.js・Google の仕様は、出典つきで同じ付録の末尾にまとめた。

## 1. 決まっていること（運営者了承、2026-09-27）

- URL は `hub-game.com/hok/ja/…`・`/mlbb/ja/…`・`/wildrift/ja/…`。ポータルはドメイン直下（`/ja`）のまま
- アプリは4つのまま別々に残す（Next.js のマルチゾーン）
- ホスティングは Cloudflare に一本化する。DNS はすでに Cloudflare
- 旧サブドメインは新しいパスへページ単位で 301 し、最低1年は残す（Google の目安）

静的書き出し（サーバーを持たない形）にそろえる。ワイリフのカウンター投票（サーバーが要る唯一のもの）はやめ、Supabase も外すことになった（6章）。

## 2. ドメイン直下での振り分け（おすすめ）

4つとも Workers の静的アセットにして、Workers のルートでパスごとに振り分ける。
スクリプトは言語の付いていない入口（`/`・`/hok`・`/wildrift`）でだけ動かし、ほかのリクエストは静的アセットが直接返す（7章）。

| アプリ | 割り当て | 置き場所 |
|---|---|---|
| ポータル | hub-game.com のカスタムドメイン（ルートに当たらないパスはすべてここ） | `out/` をそのまま（前置きが無いので後処理は要らない） |
| HoK | ルート `hub-game.com/hok*` | `dist/hok/` |
| MLBB | ルート `hub-game.com/mlbb*` | `dist/mlbb/` |
| Wild Rift | ルート `hub-game.com/wildrift*` | `dist/wildrift/` |

選ぶ理由は4つある。
Pages はパスの途中に割り当てられず、Workers はできる。静的アセットへのリクエストは無料で回数の上限も無い。
同じホスト名ではルートがカスタムドメインより先に当たる。各アプリを別の Worker として出せるので、サイトごとのセッションの担当もそのまま保てる。

組むときの決まり:

- `next build` の `out/` には `/hok` の階層ができない。`out/` を `dist/hok/` へ移し、`_redirects` と `_headers` の各行に前置きを付けて出し直す。
  この後処理は4サイト共通のスクリプトにする
- ルートは1アプリ1本。`/hok*` と `/hok/*` を混ぜない（末尾 `/*` の優先順位に既知の不具合がある）
- 旧サブドメインは Single Redirects で送る（無料で10本）。転送先は `concat("https://hub-game.com/hok", http.request.uri.path)`、クエリは保つ。
  DNS はプロキシした仮レコードに差し替える
- **旧サブドメインの `/sw.js` だけは転送から外す**（例: `http.host eq "hok.hub-game.com" and http.request.uri.path ne "/sw.js"`）。
  転送すると、訪問者の端末に残った旧 Service Worker が更新も解除もできずに残る（Service Worker のスクリプトは転送を受け付けない）。
  旧サブドメインの `/sw.js` には、自分の登録を解除し、キャッシュを消して窓を読み直すだけのワーカーを 200 で返す
  （仮レコードの先にはオリジンが無いので、Workers のルートで返す。ポータルのリポジトリの `workers/legacy-sw/`）。残す期間は 301 と同じく最低1年。
  対象は Service Worker を登録していた HoK と MLBB。Wild Rift は使ったことが無いので、転送から外す必要も無い。
  2026-09-27 に試した（HoK の `scratch/check_legacy_sw_0927.mjs`）。HoK の今・8/15・7/23 の版と MLBB の今の版を入れた状態から、
  旧 URL を開き直すだけで登録とキャッシュが消えた（7/23 の版はページをキャッシュから出すので、旧ページが一瞬出てから新しい URL に移る）。
  `/sw.js` も転送した対照では、旧 Service Worker が残った
- セキュリティヘッダー（HSTS など5種）は、ゾーンの Transform Rules で全パスにまとめて付ける。いまは Vercel が暗黙に付けている分もある
- 上限は、ファイル数が1バージョン2万（無料）、`_redirects` が静的2,000本・動的100本、`_headers` が100ルール。
  HoK の転送は、言語ごとに展開して764本（静的742・動的22。7章）で収まる

代わりの案: 振り分け用の Worker スクリプトを1本置き、4つを Service Binding で呼ぶ形もある。
言語判定を柔軟に書けるが、全リクエストでスクリプトが動く（無料は1日10万回まで）。
振り分け役が止まると4サイトとも止まるので、おすすめにはしない。

## 3. 4サイト共通の決め事

**前置きとURL**

- `basePath` を `/hok` などにする。JS と CSS も自動で `/hok/_next/…` に出るので、ポータルの `/_next` とはぶつからない
- **`next/image` の `src` には前置きが自動で付かない。** データ JSON の `/images/...` も同じ。前置きを付ける関数を1つ作り、そこを通す
- `metadataBase` はオリジンだけ（`https://hub-game.com`）にする。前置きを入れると、ファイルで置いた OGP 画像の URL が `/hok/hok/…` になる。
  canonical・hreflang・og:url の側に前置きを付ける
- 別のゾーンへのリンクは `<Link>` ではなく素の `<a>` にする。`<Link>` だと先読みと画面遷移が壊れる
- 静的書き出しでは、Link の先読みが存在しない RSC ファイルを取りに行き、404 が並ぶ（MLBB で実測）。先読みを止める包みを使う
- ドメインの直書き（`hok.hub-game.com` など）は定数1か所にまとめる。監査の許可ホストも直す

**ドメイン直下にしか置けないもの**

- `robots.txt`・`ads.txt`・サイトマップの索引は、ポータルが出す。各サイトのサイトマップと Disallow（管理画面など）も、ポータルの `robots.txt` で束ねる

**同じドメインになると衝突するもの**

- Service Worker: 各サイトは `/hok/sw.js` をスコープ `/hok/` で登録する。
  **HoK と MLBB の `activate` は自分以外のキャッシュを全部消している。** 同じオリジンでは他サイトのキャッシュまで消すので、自分の接頭辞のものだけ消すように直す
- manifest: `id`・`scope`・`start_url` を前置きの下にする（いまは HoK・MLBB とも `id "/"` で、同じアプリとみなされる）
- ブラウザ保存のキー: HoK は `hok_`、MLBB は `mlbb_`、ポータルは `hubgame_`。HoK の sessionStorage の2つとワイリフは接頭辞が無いので付ける
- 言語の cookie（`NEXT_LOCALE`）: next-intl は前置きを path にするので、各サイトの分は分かれる。ポータルの分は path が `/` で全サイトに届く

**デプロイと運用**

- **`basePath` を固定で入れたコミットを main に push すると、その時点でいまの本番（Vercel や Pages）が壊れる。**
  前置きとドメインをビルド時の環境変数で切り替える形にしたので（7章）、main に入れてよい。環境変数が無ければ今の出力のまま。
  Vercel の Git 連携は、切り替えのあとに止める（5章の手順9。先に止めると、切り替えまでの push が今の本番に出なくなる）
- Node の版は `.nvmrc` で固定する（Next 16.3 は 20.9 以上）。`engines` は入れない（Vercel はプロジェクト設定より engines を優先するので、今の本番の Node の版が変わりうる）。
  Cloudflare のビルド環境の npm 10.9.2 で `npm ci` が通るかを確かめる（MLBB の README に前例あり。ポータルは 7章で直した）
- `next start` は書き出しでは使えない。手元の確認は `out/` を静的サーバーで配る形に変える
- アクセス解析（GA）の測定 ID を3サイトで共有している。いまはホスト名で分けているので、統合後はパスで分けるか、データストリームを分ける
- 権限設定（`.claude/settings.json`）が止めているのは vercel CLI だけ。wrangler の直接デプロイも止める

**検索と広告**

- 旧サブドメインの URL は、ページ単位で新しいパスへ 301 する。内部の転送と重なって2〜3段にならないよう、転送先は最終の URL にする
- Search Console のドメインプロパティは、全サブドメインを含む。アドレス変更ツールは「サブドメイン → 同じ親ドメインのパスの下」を受け付けるか未確認。
  301 とサイトマップの出し直しを本筋にする
- 検索結果に出るサイト名とファビコンはホスト名単位なので、統合後は4サイトともポータルのものになる
- AdSense に登録できるのはドメイン単位（`example.com/directory` は登録できない）。審査の対象は hub-game.com の1つになる

## 4. サイトごとの要点（詳細は付録）

| サイト | 影響 | 止めるもの | 主な中身 |
|---|---|---|---|
| ポータル | 24 | 5 | 未知URL用の catch-all、診断結果のサーバー側の searchParams、画像の最適化、`/` の転送、npm のロック |
| HoK | 35 | 9 | robots と sitemap の force-static、言語振り分け、metadataBase、画像の前置き、監査の検査6、デプロイの切り替え |
| MLBB | 25 | 6 | すでに静的。`out/` の階層、画像の前置き、canonical、`_redirects` の前置き、デプロイの切り替え |
| Wild Rift | 37 | 12 | サーバー機能が多い（下） |

**ポータル**: 各サイトの `/api/latest` を30分ごとに取り直している部分（ISR）は使えなくなる。
「タイトル別の最新データ」表は初期 HTML に数字を出す決まりがあるので、ブラウザで読む形にはしない。
姉妹サイトが変わったらポータルを作り直す（2026-09-28〜、GitHub Actions が1時間ごとに変化を見る。5章の手順3）。
適性診断は廃止した（6章）。

**HoK**: 転送は最大361本（ヒーローID → slug など。言語ごとに展開すると764本）で、`_redirects` の上限2,000に収まる。
OGP 画像324枚が拡張子なしで出るので、`_headers` で `image/png` を付ける（ルールは100本まで、ワイルドカードで1本にまとめる）。
フィードの `id` は旧ドメインのまま据え置く（変えるとリーダーで全件が新着になる）。`public/sw.js` の `CACHE_NAME` は上げない決まりを保つ。

**Wild Rift**（別のセッションの担当。この計画を申し送りとして渡す）:

- チャンピオン詳細とパッチの過去版は、Supabase から読む ISR（`dynamicParams = true`）。ビルド時に一度読む形にし、Supabase を直したら作り直す運用にする
- **カウンター投票（`/api/counters`）は、票の保存にサーバーが要る。** Worker で持つか、投票をやめるかを決める。
  ブラウザから公開キーで直接書き込む案は、共通ルール2（ブラウザに露出するキーで書き込めるテーブルを作らない）に反する
- パッチ検索（`/api/patches`）は、全件の JSON を言語別に書き出してブラウザで絞り込む形にする
- OGP 画像（`/api/og?t=…`）は任意のタイトルを焼く作りなので、ページごとにビルド時に焼く形に変える
- 管理画面と管理 API は、本番の書き出しから外す
- ビルド環境に Supabase の環境変数が要る。プライバシーポリシーの Cookie と投票の記述も、実装に合わせて直す

## 5. 進める順番

1. **決め事**（6章）
2. **試作**（MLBB、ブランチで。**2026-09-27 に済み、7章**）: `basePath=/mlbb`、`dist/mlbb/` への後処理、静的アセットの Worker を試験用のホスト名に出す。
   確かめること: `_redirects` と `_headers` を `dist/` 直下から読むか、Turbopack で OGP 画像の URL に前置きが1回だけ付くか、404 の返り方、先読み
3. **共通の決め事と後処理スクリプト**を `hub-game-rules` に置き、`sync.mjs` で4サイトへ配る
4. **ポータル → HoK → MLBB → Wild Rift** の順に、ブランチで作業して試験用のホスト名で確かめる
   （**HoK とポータルは 2026-09-27 に済み、7章。** 環境変数で切り替える形にしたので、ブランチでなく main に入れてある。MLBB は試作ブランチ、Wild Rift は Wild Rift のセッション）
5. **切り替え日**: ルートを本番に向ける。旧サブドメインを 301 にする（`/sw.js` だけは除いて解除用のワーカーを返す。2章）。ポータルの姉妹サイトの URL を新しいパスにする。サイトマップを出し直す
6. **監視と後片付け**: 検索の移り具合を見る。転送が落ち着いてから Vercel のプロジェクトを止める

**2026-09-27 夜に切り替えた。** 実際にやった順番と、下の案から変わったところは、この節の末尾の「切り替えの記録」。

切り替え日の手順（2026-09-27 にポータルまで作った時点の案。Cloudflare の操作は運営者のアカウントで行う）。

切り替え前の DNS（2026-09-27 に nslookup で確認）: hub-game.com は Vercel の A レコード、www・hok・wildrift は `cname.vercel-dns.com`。この4つはプロキシしていなかった。
**mlbb だけは Cloudflare Pages のカスタムドメインで、すでにプロキシしていた。** www は Vercel が `https://hub-game.com/` へ 308 で送っていた。

ルートとカスタムドメインは各サイトの `wrangler.jsonc` に書く（1か所に決める。管理画面で付けたものは、wrangler.jsonc に routes があると次のデプロイで上書きされる。
routes が無い wrangler.jsonc でデプロイしても、付いているルートには触れない。wrangler の triggersDeploy で確認）。
**カスタムドメインは、同じ名前の既存の A レコードがあると付かない**（code 100117「externally managed DNS records」。wrangler は置き換えなかった。
点検で「確認なしで置き換える」と読んでいたのは誤り）。Vercel 向けの A を消してからすぐにデプロイした（1分ほど hub-game.com がつながらない時間が出る）。

0. **前もって作るもの**: 旧サブドメインの `/sw.js` に返す解除用のワーカー（登録の解除、キャッシュの削除、窓の読み直し）と、それを返す小さな Worker。
   **2026-09-27 に作った**: ポータルのリポジトリの `workers/legacy-sw/`（hub-game-rules は git で管理していないので、Workers Builds から出せるポータルに置いた）。
   Worker の名前は `hub-game-legacy-sw`。Workers Builds で作るならルートのフォルダを `workers/legacy-sw` にする。一度 `npx wrangler deploy` するだけでもよい
1. 4つの Worker を Workers Builds（Git 連携）で作る。ビルドの環境変数は4つとも `NEXT_PUBLIC_SITE_ORIGIN=https://hub-game.com`、
   前置きのある3つは `NEXT_PUBLIC_BASE_PATH=/hok` などを足す。この時点ではルートもカスタムドメインも付けない（workers.dev で確かめる）。
   **ポータルの Worker ではビルドキャッシュを有効にしない**（既定は無効。有効にすると `.next/cache` が残る。ポータルの `scripts/prebuild_static.mjs` が姉妹サイトの取得結果の保存分を毎回消すが、念のため）
2. ポータルのビルドの環境変数に `SISTER_ORIGIN_HOK=https://hok.hub-game.com` など3つを置き、今のサブドメインから `/api/latest` を取る。
   **手順8で外すまで置いたままにする**（途中で外すと、hub-game.com/hok/api/latest がまだ無いのでポータルのビルドが止まる。欠けたまま出さない作り）
3. ~~ポータルの Worker にデプロイフックを作り、3サイトのデプロイのコマンドの後ろに `curl -X POST "$PORTAL_DEPLOY_HOOK"` を足す~~
   （2026-09-28 にやめた。代わりにポータルの GitHub Actions `refresh-sister-data` が1時間ごとに3サイトの `/api/latest` を見て、
   変わっていれば記録を main へ push し、Workers Builds がポータルを作り直す。各サイトの Cloudflare の設定に秘密の URL を置かずに済む）
4. ゾーンの Transform Rules でセキュリティヘッダー5つ（HSTS など。ポータルの `next.config.ts` と同じ値）を全パスに付ける
5. 3サイトの `wrangler.jsonc` にルート（`hub-game.com/hok*` など）を書いて push する。hub-game.com がまだ Vercel を向いている（プロキシしていない）間は効かない
6. ポータルの `wrangler.jsonc` に hub-game.com のカスタムドメインを書いて push する。ここで4サイトが同時に新しい形になる
7. 旧サブドメインを Single Redirects で 301 にする。**hub-game.com/hok などが動いたのを確かめてから作る**（mlbb はプロキシ済みなので、作った瞬間に効く）。
   - hok: DNS をプロキシした仮レコードに差し替え、`/sw.js` を除いて `https://hub-game.com/hok` ＋パスへ（クエリは保つ）
   - wildrift: 同じく `/wildrift` ＋パスへ。Service Worker を使っていないので `/sw.js` も除かなくてよい
   - mlbb: Cloudflare Pages のプロジェクトから mlbb.hub-game.com を外し、プロキシした仮レコードに替える。`/sw.js` を除いて `/mlbb` ＋パスへ
   - www: プロキシした仮レコードに替え、`https://hub-game.com` ＋パスへ（今 Vercel が返している 308 の代わり）
   - `hok.hub-game.com/sw.js` と `mlbb.hub-game.com/sw.js` の2つのルートを、手順0の Worker に付ける（`workers/legacy-sw/wrangler.jsonc` のコメントを外してデプロイ）
   - 転送は4本で、無料の10本に収まる
8. ポータルの `SISTER_ORIGIN_*` を外して作り直す。`/`・`/hok`・`/wildrift` の言語の振り分け、`/mlbb` → `/mlbb/ja`、旧サブドメインと www の 301 を1回ずつ確かめる。
   確かめ終わったら4つの `wrangler.jsonc` に `"workers_dev": false` を足す（既定では workers.dev でも同じ中身が配られ続ける）
9. Vercel の Git 連携（ポータル・HoK・Wild Rift）と、MLBB の Cloudflare Pages の Git 連携を止める（main への push が古い置き場所に出ないように）。
   Search Console にサイトマップ4本を出し直す。Vercel のプロジェクトを止めるのは、www の転送を手順7で移したあと

ロールバックの注意: `_headers` の `/_next/static/*`（1年・immutable）と `/images/*`（1週間）は、404 の応答にも付く（wrangler dev で確認）。
デプロイのあとに古いタブが消えたチャンクを取りに行くと、その 404 がブラウザに1年残る。前の版へ戻して同じ名前のチャンクが戻っても、その人のブラウザでは読めない。
通常のデプロイではチャンクの名前が変わるので害は無い。戻すときは、読み直しても直らない人が出ることを頭に置く

**切り替えの記録（2026-09-27 夜、運営者と HoK のセッション）**

- 運営者の Cloudflare に `wrangler login` し、DNS・転送・ヘッダー・Pages 用の API トークン（翌日に切れる）を運営者が作ってファイルに置いた（`C:/Users/81901/hub-game-switch-token.txt`。
  中身は画面にもログにも出していない。**使い終わったら削除する**）。DNS と転送の操作は HoK の `scratch/cf_switch_0927.mjs`（check・headers・redirects-prep・apex-release・apex-restore・old-all）
- デプロイと DNS の変更は、自動の安全確認がエージェントからの実行を止めたので、運営者がターミナルで実行した
- 4サイトは各サイトの手元のビルド（統合後の形）をそのまま出した。MLBB と Wild Rift は GitHub から一時フォルダへ取ってビルドし、ルートを足した wrangler.jsonc で出した
  （**各サイトのリポジトリの wrangler.jsonc にはまだルートが無い**。routes が無いデプロイはルートに触れないので壊れはしないが、各セッションが足す）
- 順番: ヘッダーのルールと hok・wildrift・www の転送ルール（まだ効かない）→ 3サイトのルート（まだ効かない）→ hub-game.com の A を消してポータルにカスタムドメイン（ここで切り替わった）
  → 本番で4サイトの点検（ポータル51・HoK 40・Wild Rift 30 項目が通過、MLBB は切り替え前と同じ既知の2点だけ）→ `old-all`（mlbb の転送ルール、hok・wildrift・www の仮レコード、
  mlbb を Pages から外して仮レコード）→ 解除用の Worker に `hok.hub-game.com/sw.js`・`mlbb.hub-game.com/sw.js` のルート（wrangler の `--route` で付けた。ファイルには書いていない）
- 確かめたこと: 旧 URL は1回の 301 で新しいパスへ（クエリも保つ）、古いヒーロー番号の URL も最後は slug のページに着く、旧サブドメインの /sw.js は解除用のスクリプト（200、JavaScript）、
  セキュリティヘッダー5つは Worker の応答にも付く（Transform Rules が静的アセットにも効く）。ルートを付けたので4つの Worker の workers.dev は自動で閉じた
- 続けて同じ夜に: 4つの Worker を Workers Builds で GitHub の main につないだ（ビルドは `npm run build`、デプロイは `npx wrangler deploy`、プレビューのビルドとビルドキャッシュは切った）。
  ポータルと HoK は push からの最初のビルドが通って本番に出た（HoK のビルドは約5分）。Vercel の Git 連携（3つ）を運営者が外し、MLBB の Pages（mlbb-site）の自動デプロイを API で止めた
- 2026-09-28: ポータルの作り直しは、デプロイフックの代わりに GitHub Actions（`refresh-sister-data`、1時間ごと）にした（手順3）
- 2026-09-28 未明: GitHub Actions の1回目が通り、ボットの push で Workers Builds がポータルを作り直すことを確かめた（ボットの push でも Cloudflare のビルドが起きる）。
  4サイトのサイトマップを束ねる索引 https://hub-game.com/sitemap_index.xml を足した（Search Console にはこの1本を出せばよい）。
  API トークンのファイルを消した（トークン自体は 2026-09-28 23:59 UTC に切れる）
- **まだのもの**: ~~API トークンの片付け~~（ファイルの削除と管理画面での削除。翌日に切れる）、MLBB と Wild Rift の wrangler.jsonc に routes を書く（各セッション）。
  ポータルの wrangler.jsonc の冒頭のコメントは切り替え前の書き方のまま（書き換えが自動の安全確認に止められた）

作業量の目安（AI のセッションで進めた場合）は、試作2〜3時間、ポータル2〜3時間、HoK 3〜4時間、MLBB 1〜2時間、
Wild Rift 半日前後（投票をやめるなら短くなる）、切り替え1〜2時間。121件のうち102件は数行の直し（手間 S）で、
「大」はワイリフの投票の1件だけ。時間の大半は、ビルドして全ページを確かめる周回（HoK は1周数十分）にかかる。
Cloudflare の管理画面での操作（ルート・DNS・転送ルール・wrangler のログイン）は運営者のアカウントが要る。
（初版は人が手で作業する前提の日数で書いており、大きすぎた。2026-09-27 に直した）

## 6. 運営者の答え（2026-09-27）

1. **Cloudflare のプラン**: 無料で進める。スクリプトが動くのは、言語の付いていない入口（`/`・`/hok`・`/hok/`・`/wildrift`・`/wildrift/`）を開いたときだけ（`/mlbb` は `_redirects` で `/mlbb/ja` へ送るのでスクリプトは要らない）。
   Search Console の検索クリックは多い日でも1日70前後で、無料枠（1日10万回）とは桁が違う
2. **Wild Rift のカウンター投票はやめる。Supabase も使わない**（Wild Rift のセッションの作業）。
   **Supabase を外す前に、いまの中身（`patches`・`wr_champion_details`・`localization_dictionary`）をリポジトリの JSON へ書き出す。**
   同梱の JSON は控えで、Supabase のほうが新しい可能性がある。これで Wild Rift も完全な静的書き出しにでき、4サイトとも同じ形になる
3. **ポータルの適性診断は廃止した**（hub-game-portal の c918799、push 済み）。旧 URL は各言語のトップへ恒久転送
4. **言語はブラウザの言語で振り分ける。** 入口のスクリプトは、サイトごとに持っている言語を知っていればよい。
   ポータル・HoK・Wild Rift は日本語のブラウザなら `/ja`、それ以外は `/en`。**MLBB は日本語しかないので、どの言語のブラウザでも `/mlbb/ja` に送る**（今の mlbb.hub-game.com と同じ動き）。
   ポータルから MLBB へのリンクは `/mlbb/ja` を指す（英語のページには、日本語だけの MLBB へのリンクを今も出していない）。
   入口のスクリプトの `DEFAULT_LOCALE`（日本語も英語も当たらないとき・Accept-Language が無いときの行き先）は3サイトとも `en` にする。
   `routing.ts` の既定の言語（Wild Rift は `ja`）とは別の値
5. **アクセス解析は任された。** 測定 ID は1つ（G-65P6KEVN7X、HoK と MLBB が今使っているもの）のまま、各サイトが
   `gtag('config', …, { content_group: 'hok' })` のようにサイト名をコンテンツグループとして送る。GA4 の標準レポートでサイト別に見られる。
   統合後はサイトをまたぐ移動が同じサイト内の移動になり、自サイトからの参照として数えられる問題も消える。
   ポータルに測定のタグが無ければ、同じ ID で `portal` を付けて足す（実装時に確かめる）。
   **2026-09-27 の状況**: Wild Rift は `wildrift` を入れ済み（Wild Rift のセッション）。HoK は `hok` を足した（監査の検査31が見張る）。
   ポータルにはタグが無かったので、同じ ID で `portal` を付けて足し、プライバシーポリシーの「アクセス解析は利用していません」を、
   利用とオプトアウトのアドオンの案内に書き換えた（日英。ポータルの監査の検査5が、タグとポリシーの食い違いを見張る）。
   ブラウザで page_view が `content_group=portal` で送られることを確かめた（送信は止めて中身だけ見た）。MLBB の `mlbb` は MLBB のセッションに申し送った。
   サイト別に見るには、GA4 の「レポート → エンゲージメント → ページとスクリーン」で「コンテンツ グループ」を選ぶ。
   統合の前でも、今のうちから入れておけば、切り替えの前後でサイト別の数字がつながる
6. **Search Console**: hub-game.com のドメインプロパティがある（2026-09-27 に運営者の画面で確認）。
   サブドメインも含むので、統合後も同じプロパティで計測が続き、アドレス変更ツールは要らない。
   **AdSense の再審査**は、切り替えのあと、転送が落ち着いてから出すのがよい（中身が hub-game.com の下にそろってから審査されるため）。時期は運営者が決める

## 7. 試作（MLBB、2026-09-27）で分かったこと

MLBB のリポジトリに別の作業フォルダ（`Desktop\hub-game-worktrees\mlbb-poc`、ブランチ `consolidation/mlbb-basepath-poc`、fa587b5）を作って試した。
MLBB のセッションの作業フォルダ（main）には触っていない。手元の確認は `npx wrangler dev`（ログイン不要）で、Workers の静的アセットを本番と同じ規則で配った。

- **前置きとドメインはビルド時の環境変数で切り替える形にした**（`NEXT_PUBLIC_BASE_PATH=/mlbb`、`NEXT_PUBLIC_SITE_ORIGIN=https://hub-game.com`）。
  無ければ今と同じ出力になる（2,559 ファイル、canonical・OGP・manifest・画像のパスが同じことを確かめた）。
  **このため、試作のコードは切り替え日を待たずに main へ入れられる。** 3章の「basePath を入れたコミットで本番が壊れる」問題はこれで消える
- **`_redirects` と `_headers` は `dist/` 直下から読まれた**（未確認だった点）。後処理が `out/` を `dist/mlbb/` へ写し、規則に前置きを付けて直下に置く
- **Turbopack（Next 16.3.6）は、ファイルで置いた OGP 画像の URL に basePath を付けない**（調査では webpack の挙動から「付く」と読んでいたが逆だった）。
  ファビコンと JS・CSS には付く。対策として metadataBase を前置き込み（`https://hub-game.com/mlbb`）にし、canonical は前置きを手で付けない。
  後処理が全ページの canonical・og:url・og:image・twitter:image（713件）を検査し、前置きがずれたらビルドを止める
- 画像は `next/image` の包み（`src/components/common/Image.tsx`）で前置きを付ける。直接の import は監査で止める
- Service Worker は前置きを登録の範囲から読む形にし、他サイトのキャッシュを消さないようにした
- 転送（`/mlbb` → `/mlbb/ja` など）、ヘッダー（API の CORS、OGP 画像の `image/png`、画像のキャッシュ）、404、manifest はすべて期待どおり
- 先読みの RSC ファイルの 404 は、前置きとは関係なく今の本番でも出ている既知の不具合（vercel/next.js#85374）
- 後処理（`scripts/postbuild_basepath.mjs`）は4サイト共通にできる。**2026-09-27 に `hub-game-rules` へ移し、`sync.mjs` で hok・mlbb・wildrift に配った**
  （`sites.json` に各サイトの `basePath` を書いた。共通ルールの本文にも「8. サイト統合」を足した。sha=ce8d9777ed9f）。
  `package.json` の postbuild には入れていない。静的書き出しへ移すときに各サイトが足す（移す前に足すと、環境変数を入れたビルドで `out/` が無く止まる）
- **HoK も同じ形にした（1cce30d、2026-09-27）。** 環境変数なしのビルドを変更前と比べ、転送361本・ヘッダー・ページ・canonical・OGP が同じことを確かめた。
  HoK はサーバーの機能（proxy・redirects・headers・ISR）を使っているので、静的書き出し（`output: 'export'`）自体も同じ環境変数で切り替える。
  転送の一覧は `src/lib/redirectRules.ts` にまとめ、next.config（今の本番）と `src/app/%5Fredirects`（`_redirects` を書き出すルート）で共有する。
  前置き付きの確認は wrangler dev で41項目すべて通過（転送756本、主要20ページ、Service Worker、manifest など）
- **Node 24 の Windows では、日本語を含むパスで `fs.cpSync` がフォルダを写すと、何も出さずに終了コード127で落ちる。**
  試作の作業フォルダ（英数字だけ）では通っていたので気づかなかった。共通の後処理をファイルを1つずつ写す形に直して配り直した
- HoK の変更は push の前に反証した（3観点・4本、指摘7件はすべて軽いもの）。直したのは次のとおり。
  - Cloudflare は `/…/offline.html` を `/…/offline` へ 307 で送るので、Service Worker が保存したオフライン用ページが「転送を経た応答」になり、
    画面遷移に返すとネットワークエラーになっていた。応答を作り直して返す形にした（MLBB の試作も同じ）。
    別のホスト名に見せかけて Service Worker を動かし、サーバーを止めた後にオフライン用ページが出ることを確かめた
  - Cloudflare の `/*` は0段に一致しないので、`/ja/admin` のような素のパスの行も出す。言語なしの旧 URL（`/skills`・`/calculator` など）も最終の行き先へ1段で送る
  - 完全一致の行を先、動的な行を後にまとめた（動的な行より後の完全一致は、Cloudflare が動的として数えて遅い判定に回す）
  - 末尾スラッシュ付きの旧 URL（`/ja/heroes/105/`）は拾わないと決めた。静的な行が倍になるわりに、旧サイトの Next.js が末尾スラッシュを外していたので外部に残っている見込みが薄い
  - Node の版: `engines` は入れない（Vercel はプロジェクト設定より engines を優先するので、今の本番の Node 版が変わりうる）。`.nvmrc` は CI・手元と同じ 24
- `npx wrangler dev` を止めるときは、親の npx ごと止める。子の `workerd` が立ち上がり直して `dist/` を掴み続け、
  次のビルドの後処理が「EPERM（使用中）」で止まった

**ポータルと入口のスクリプト（2026-09-27）**

- ポータルも `NEXT_PUBLIC_SITE_ORIGIN` があるときだけ統合後の形（静的書き出し）になる。ドメイン直下なので前置きは無く、`out/` をそのまま配る
- 変わるのは、姉妹サイトの URL（`hub-game.com/hok` など）、robots.txt が4サイト分の Disallow とサイトマップを束ねること、
  JSON-LD の sameAs から姉妹サイトを外すこと、言語の cookie を書かないこと、先読みを止めること
- 姉妹サイトへのリンクに読者の言語を付けた（`/hok/ja`。MLBB は `/ja`）。これは今の本番にも入る変更で、
  言語の無い入口で1回転送されていたのが無くなる。ほかに今の本番で変わるものは無い（全ページの出力を変更前と比べた）
- 入口の言語の振り分けは `worker/entry.js` 1本を hub-game-rules から配る（`sites.json` の `entryWorker`。今はポータルと HoK）。
  `assets.run_worker_first` に入口のパス（ポータルは `/`、HoK は `/hok` と `/hok/`）だけを並べ、ほかはスクリプトを通さない
- 未知のパスの各言語の 404 は、静的書き出しのときだけ `/ja/404`・`/en/404` を書き出し、Cloudflare の「いちばん近い 404.html」で返す。
  **`[...rest]` に `generateStaticParams` を置くだけで、今の本番（Vercel）では未知のパスの 404 がパスごとに1年キャッシュされる**（next start で確認）。
  関数を静的書き出しのときだけ出す形にした（`dynamicParams = false` はナビの無い英語の 404 に、`connection()` は 500 になった）
- package-lock.json は npm 10.9.2（Cloudflare のビルド環境）で `npm ci` が落ちていた。入れ子の `@swc/helpers@0.5.23` を1件足して、
  npm 10.9.2 と 11 の両方で通るようにした（ロックを作り直すとほかの依存の版まで動くので、足すだけにした）
- 手元の Cloudflare 環境（wrangler dev）で、入口の振り分け、ページ、404、転送、Content-Type、キャッシュ、ブラウザでの読み込み失敗・エラー・画像、
  言語の切り替えを確かめた（`scratch/check_portal_static_0927.mjs`）。HoK も入口のスクリプトを足したうえで41項目を通し直した
- ポータルの 404 は、初期 HTML が中身の無い殻（`__next_error__`）で、本文とナビは JS が動いてから出る。**今の本番も同じ**（統合とは別の課題。HoK は `globalNotFound` で直した）

**本物の Cloudflare の試験用 URL で4サイトを確かめた（2026-09-27 午後）**

運営者の Cloudflare アカウントに `wrangler login` し、統合後の形でビルドした4サイトを workers.dev に出した（ルートもカスタムドメインも付けていないので本番は変わらない）。
デプロイは運営者が命令を指示して実行した（自動の安全確認がデプロイを止めるため）。MLBB とワイリフは、各セッションのフォルダに触れないよう、GitHub から一時フォルダへ取ってビルドした。

| サイト | 試験用の URL | 結果 |
|---|---|---|
| ポータル | https://hub-game-portal.hayabusa-rain.workers.dev | 51項目すべて通過（404 の初期 HTML の殻は今の本番と同じ） |
| HoK | https://hok-hub.hayabusa-rain.workers.dev | 40項目すべて通過、`/hok` の言語の振り分けも |
| MLBB | https://mlbb-hub.hayabusa-rain.workers.dev | 転送・API・OGP・404・SW・manifest・主要ページは通過。`/mlbb/ja/guide` は今の本番にも無いページ（確認の表の誤り）。404 画面での先読みの 404 は今の本番でも出る既知のもの |
| Wild Rift | https://wildrift-hub.hayabusa-rain.workers.dev | すべて通過。**`_redirects` は大文字小文字を区別する**（Aatrox は 200、aatrox は 308 で Aatrox へ。別名の転送が輪にならない） |

確認の道具は HoK の `scratch/check_portal_static_0927.mjs`・`_check_hok_export_0927.mjs`・`_check_mlbb_poc_0927.mjs`・`check_wildrift_cf_0927.mjs`（どれも URL を渡して走らせる）。
試験用の URL を開いた分は、Google アナリティクスにホスト名 workers.dev として少し入る。
Wild Rift は GitHub の 21cf9ea（その時点で push 済みの最新）で作った。手元の未 push の3コミットは入っていない

## 8. 未確認のまま残したこと

- ~~`_redirects` と `_headers` を `dist/` 直下からしか読まないか~~（試作で確認済み。直下から読まれる）
- `_redirects` で `:locale(ja|en)` のような絞り込みが書けるか（今は ja と en を別の行に展開する前提）
- HoK のビルドが Cloudflare のビルド環境（無料 2 vCPU・8GB・20分で打ち切り）に収まるか。収まらなければ GitHub Actions でビルドして `wrangler deploy` する
- **Workers Builds の無料枠は、アカウント全体で月3,000分・同時に1本**（developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing、2026-09-27 に確認）。
  過去30日の main のコミットは HoK 152・MLBB 145・Wild Rift 201・ポータル35（push ごとにビルドするので回数はこれ以下）。そこに姉妹サイトのデプロイのたびのポータルの作り直しが乗る。
  各ビルドの所要時間は未確認で、月3,000分に収まるかも未確認。切り替え前に、HoK とポータルのビルド時間を Workers Builds で測る。
  文書だけのコミットは Build watch paths でビルドから外す
- ~~旧サブドメインと `www.hub-game.com` の DNS レコードの種類とプロキシの状態~~（2026-09-27 に確認。5章の手順の前置きに書いた）
- AdSense が、サブドメインにあった中身とパスの下へ移った中身を同じように評価するか（公式の記述が見つからない）
- ~~Workers Builds のデプロイフックが無料プランで使えるか~~（使える。無料プランの列に「1 Worker あたり毎分10回・アカウントで毎分100回」とある。上の limits-and-pricing、2026-09-27 に確認）
- ~~Workers Builds のビルド環境が `.nvmrc` を読むか~~（読む。`.nvmrc` か `.node-version`、環境変数 `NODE_VERSION`。既定は Node 24.18.0・npm 10.9.2。`engines` は挙がっていない。
  developers.cloudflare.com/workers/ci-cd/builds/build-image、2026-09-27 に確認）
- ~~`run_worker_first` の `"/"`（ちょうど `/` だけに当たるか）は wrangler dev でしか確かめていない~~
  （2026-09-27 に本物の Workers で確認。運営者の Cloudflare に試験用として出した https://hub-game-portal.hayabusa-rain.workers.dev と
  https://hok-hub.hayabusa-rain.workers.dev で、ポータル51項目・HoK 40項目がすべて通り、`/` と `/hok` の言語の振り分けも同じ動きだった）
- Vercel のプロジェクトに `NEXT_PUBLIC_SITE_ORIGIN` が入っていないこと（入っていれば、次のデプロイで静的書き出しに切り替わる。リポジトリの履歴にこの名前を使った版は無い）。
  なお Vercel の Node の版はプロジェクト設定で決まり、`engines` だけがそれを上書きする（vercel.com/docs/functions/runtimes/node-js/node-js-versions）。
  `.nvmrc` は挙がっていないので、ポータルと HoK に足した `.nvmrc` は今の本番に効かないと見ている
