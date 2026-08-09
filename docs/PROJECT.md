# Honor of Kings Global (HoK) Official Data & Community Site

Honor of Kings (オナー・オブ・キングス / 王者栄耀 グローバル版) の完全検証済み公式データ・コミュニティWebアプリケーションです。

---

## 🎯 プロジェクト概要 & 設計方針

本リポジトリは、**Honor of Kings Global (HoK Global)** の公式データ、実機日本語/英語UI、上位ランクマッチ戦術データに基づき構築されています。
過去の初期データに含まれていた League of Legends (Wild Rift) 由来の不要データや中国本土版 (王者栄耀) の不自然な直訳表現は全件排除・完全ローカライズ済みです。

### 🌟 主な機能と特徴
1. **全ヒーローデータベース & 相性・カウンターUI (`/heroes`, `/heroes/[id]`)**
   - 確定ダメージ、CC無効、シールド特効、アンチ回復等の公式特性に基づき `src/data/hero_counters.json` から「有利な相手」「苦手な相手」「相棒」および戦術的理由を画面上に動的表示。
2. **全5大ロール時間軸マクロ立ち回りマップ (`/guide/macro`)**
   - **Clash Lane / Jungle / Mid Lane / Farm Lane / Roam** の全5大ロールについて、1分蟹、2分ドラゴン、4分タワー保護解除、10分暗影ドラゴン、20分テンペストドラゴン等の重要タイムライン別立ち回りをサブタイプ（タンク vs ファイター、ポーク vs アサシン等）で網羅。
3. **ボスバフ完全攻略ガイド (`/guide/bosses`)**
   - タイラント (Tyrant), オーバーロード (Overlord), テンペストドラゴン (Tempest Dragon) の獲得バフ・効果数値・出現タイミングを解説。
4. **サモナースペル & アルカナデータベース (`/spells`, `/arcana`)**
   - 全サモナースペルのCD・効果・解放条件およびアルカナ検索フィルター。
5. **完全多言語対応 (i18n)**
   - 日本語 (`/ja`) および 英語 (`/en`) に完全対応。Next-intl と `@/i18n/routing` によるクリーンなルーティング。

---

## 📁 ディレクトリ構造と主要ファイルの役割

```
├── src/
│   ├── app/                      # Next.js App Router (i18n 対応)
│   │   └── [locale]/
│   │       ├── heroes/           # ヒーロー一覧 (/heroes) & 詳細 (/heroes/[id])
│   │       ├── guide/
│   │       │   ├── macro/        # 全5大ロールマクロ立ち回りマップ
│   │       │   └── bosses/       # ボスバフ完全攻略ガイド
│   │       ├── spells/           # サモナースペル一覧
│   │       ├── arcana/           # アルカナ検索
│   │       ├── items/            # 装備アイテム一覧
│   │       └── tier-list/        # Tier List ページ
│   │
│   ├── components/               # フロントエンドUIコンポーネント
│   │   ├── heroes/               # ヒーロー詳細 (HeroDetailClient.tsx 等)
│   │   ├── spells/               # スペル一覧 (SpellsClient.tsx)
│   │   └── layout/               # ヘッダー・サイドバー・ナビゲーション
│   │
│   └── data/                     # サイトの中核構造化データ (JSON)
│       ├── hok_heroes.json       # HoK公式全ヒーローマスターデータ (ID 105〜)
│       ├── hero_counters.json    # 有利・不利・シナジー・相性アドバイスデータ
│       ├── hok_spells.json       # サモナースペルマスターデータ
│       ├── hok_arcanas.json      # アルカナマスターデータ
│       └── hero_stats.json       # ヒーローステータス・スケーリング
│
├── public/data/                  # 公開API・ガイドJSONデータ
│   ├── guide/
│   │   ├── ja.json               # 日本語版ガイドマスターデータ
│   │   └── en.json               # 英語版ガイドマスターデータ
│   └── skills/                   # 各言語スキル詳細
│
├── messages/                     # Next-intl 国際化辞書ファイル
│   ├── ja.json                   # 日本語 UI メッセージ
│   └── en.json                   # 英語 UI メッセージ
│
└── scripts/                      # データ検証・保守スクリプト
```

---

## 💡 AIアシスタント・開発者向け重要ルール

1. **データ整合性ルール**:
   - ヒーローID 105（廉頗 / Lian Po）以降が正当な HoK ヒーローデータです。旧 LoL データ（ID 1〜104）は完全に削除されています。
   - サモナースペルは `src/data/hok_spells.json` を使用してください（`hok_summoners.json` は空配列です）。
2. **実機表記ルール**:
   - ヒーロー名は HoK Global 日本語実機の表記（中国名ヒーローは漢字表記、英名ヒーローはカタカナ/英語表記）を厳守します。
   - モンスター/アイテム名はグローバル版公式カタカナ名（タイラント、オーバーロード、テンペストドラゴン、モータルパニッシャー等）を優先使用します。
3. **i18n ルーティングルール**:
   - リンク生成には必ず `@/i18n/routing` の `<Link>` を使用します。
   - ヒーロー詳細URLは `/heroes/${id}` (複数形) を使用してください（`/heros/${id}` は 404 になります）。
