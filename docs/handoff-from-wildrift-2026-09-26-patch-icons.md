# パッチノートの「⚔️」をやめ、行の中身に合ったアイコンにする（Wild Rift Hub からの申し送り 2026-09-26）

Wild Rift Hub（`C:\Users\81901\Desktop\ワイリフサイト`）で 2026-09-26 に、パッチノートのアイコンを直した。
運営者から「オナーオブキングスでも同じように実装したい」と頼まれたので、HoK 向けに要点をまとめる。
書いたのはワイリフを担当しているセッション。このファイルは未コミットで置いてあり、作業のコミットに含めてよい。

ワイリフの実物は main の f6da2bf（`git -C "C:/Users/81901/Desktop/ワイリフサイト" show f6da2bf`）。読むだけなら承認は要らない。

## 1. 運営者が言ったこと

> パッチノートのアイコン無いやつなんとかなんない？ フェイとかはアイコン入れれるでしょ
> 他の剣のアイコンももっとましなアイコンにして

ワイリフでは、チャンピオン以外の行（アイテム・ルーン・システムなど）を一律に「⚔️」で描いていた。
タワーもワイルドパスも新チャンピオンも、同じ剣になっていた。

## 2. HoK の今の状態（2026-09-26 に数えた）

`src/components/patches/PatchTable.tsx` の `PatchIcon`（94 行）が、`is_hero === false` の行に「⚔️」を出している。
`src/data/patches.json` は 99 行で、ヒーロー以外は 29 行ある。個々の装備やアルカナの行は無く、どれも話題の行になっている。

| 件数 | 行の名前（日本語／英語） |
|---|---|
| 9 | その他のイベント／Other Events |
| 9 | 不具合の修正と最適化／Fixes & Optimizations |
| 2 | 超流大乱闘／Super Frenzy |
| 1 | シーズンと新ヒーロー／Season & New Heroes |
| 1 | ゲームシステム／Game Systems |
| 1 | 装備の調整／Item Changes |
| 1 | アルカナの調整／Arcana Changes |
| 1 | 新ヒーロー実装／New Heroes |
| 1 | 王者の峡谷 全体バランス調整／Battlefield Adjustments |
| 1 | シーズンモード調整／Season Mode Adjustments |
| 1 | 賞金バトル／Bounty Battle |
| 1 | システム最適化／System Optimization |

このため HoK で効くのは、下の 3 章の手順のうち (3)「行の中身から図柄の種類を決める」になる。
(1) と (2) は、今後、装備やアルカナ、ヒーローを 1 件ずつ行にしたときのために入れておくとよい。
HoK は装備（`hok_items.json` の `icon`）、アルカナ（`hok_arcanas.json`）、召喚師スキル（`hok_spells.json`）の画像を自前で持っている。

## 3. ワイリフでの決め方

アイコンは、サーバー側で行ごとに次の順で決める（ワイリフの `src/lib/patchIcons.ts`）。

1. 当サイトが持っている画像。行の英語名か日本語名が、アイテム・ルーン・スペルの名前と一致したら、その画像を使う。
   画像のパスが当サイトの WebP（`/` で始まる）ものだけを使い、仮の画像や外部 CDN の名前は使わない。
2. 行の名前がチャンピオン名で始まる行は、そのチャンピオンの顔にする。例は「フェイ（新チャンピオン）」と「Zoe Bug Fix」。
   誤爆を防ぐため、英語名が前方一致し、かつ日本語名にチャンピオンの日本語名が含まれるときだけにした。
3. どちらでもなければ、行の英語名から図柄の種類（kind）を決める。規則を上から順に当て、最初に合ったものを使う。

ワイリフの種類と図柄（lucide-react、ISC ライセンス）は次のとおり。

| 種類 | 図柄 | 英語名で拾う語（抜粋） |
|---|---|---|
| bugfix | Bug | bug fix, cache cleanup |
| ranked | Trophy | ranked, season, sovereign |
| mode | Gamepad2 | aram, arena, modes, gameplay, augment … |
| minion | Users | minion |
| turret | TowerControl | turret |
| dragon | Flame | dragon |
| baron | Crown | baron |
| jungle | PawPrint | jungle, brambleback（スマイトはスペルの絵） |
| pass | Ticket | wild pass |
| cosmetic | Palette | skin, collab, collection, store |
| rune | Gem | rune |
| item | Package | enchant, boots, item, potion … |
| stat | Gauge | lifesteal, critical, attack speed, armor pen … |
| system | SlidersHorizontal | どれにも当たらない行 |

規則の並びには意味がある。「Ranked Rewards」は cosmetic より先に ranked で拾い、「Baron Lane Minions」は baron より先に minion で拾う。
ワイリフでは全 437 行のうち 307 行が当サイトの画像になり、残る 130 行が図柄になった。⚔️ は 0 になった。

描くのはクライアントの `PatchKindIcon`。四角の中に、藍の淡い塗りと藍の図柄を置く（ワイリフは `bg-indigo-50 text-indigo-600`）。
HoK では、サイトの差し色（金）に合わせる。見出しに名前が文字で出ているので、画像も図柄も読み上げない（`alt=""`・`aria-hidden`）。

## 4. HoK への当てはめ方（案）

HoK の 29 行に当てるなら、例えば次の対応になる。語の拾い方は、行の英語名（`hero_name_en`）で決める。

| 行 | 種類の案 | 図柄の案 |
|---|---|---|
| Other Events | event | PartyPopper か CalendarDays |
| Fixes & Optimizations、System Optimization | bugfix | Bug（または Wrench） |
| Super Frenzy、Bounty Battle、Season Mode Adjustments | mode | Gamepad2 |
| Season & New Heroes | ranked | Trophy |
| New Heroes | hero | UserPlus（新ヒーローが 1 体なら、2 章の (2) でその顔にしてもよい） |
| Item Changes | item | Package（ワイリフと同じ） |
| Arcana Changes | arcana | Gem（ワイリフのルーンと同じ） |
| Battlefield Adjustments | map | Map か TowerControl |
| Game Systems | system | SlidersHorizontal |

図柄は運営者の好みもあるので、画面で見せて確かめるとよい。

## 5. 作りの要点と、ワイリフで踏んだこと

- 決める処理はサーバー側（行をページに渡す手前）に置く。アイテムやアルカナの JSON をクライアントの JS に載せないため。
  ワイリフは `src/lib/patchRows.ts` の `attachIcons` で、行に `icon`（画像の URL）か `icon_kind`（種類）を足している。
  版を切り替えたときに行を返す API（ワイリフは `/api/patches`）も、同じ関数を通す。片方だけだと、切り替えたあとの行が ⚔️ に戻る。
- 型（ワイリフは `PatchRow`）に `icon_kind?: string | null` を足す。
- 目次のチップ（小さな顔の列）も同じ図柄で描く。本文のカードだけ直すと、目次に頭文字が残る。
- ワイリフは PC 版 LoL の DataDragon の画像で補っていた。PC 版の絵はワイルドリフトと違うことがあるので、この機会に外した。
  HoK でも、ほかのゲームや外部 wiki の画像では補わない（OFFICIAL_ASSETS.md の決まりに従う）。
- 確かめ方: ワイリフは puppeteer で次の 4 点を見た（`scratch/check-patch-icons.mjs`）。
  - パッチノートの全カードにアイコンがあり、⚔️ が 0 件か
  - 読めない画像が無いか
  - 新チャンピオンの行が顔か
  - 版を切り替えた API の行にも `icon` か `icon_kind` が付くか
- ワイリフでの変更の中身は、ほかの作業（ダークテーマの作り直し）とは別のコミットに分けてある。HoK もこの変更だけで 1 コミットにできる。
