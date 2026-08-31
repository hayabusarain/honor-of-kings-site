// Supabase は撤去済み（src・scripts に参照0件、package.json にも依存無し）。
// 旧 Database / Json 型は 2026-08-31 に削除した。以下はこのサイト自身のデータ型。

export interface HokHero {
  id: string;
  name: string;
  /** 名前のふりがな。漢字を含む82体だけが持つ。ゲーム内のヒーロー画面に出ている読み */
  reading?: string;
  role: string[];
  image: string;
  title: string;
  search_alias?: string;
  title_alias?: string;
  name_en?: string;
  slug?: string;
}

export interface HokItem {
  id: string | number;
  name: string;
  name_en?: string;
  description?: string;
  price?: number;
  icon?: string;
  category?: string;
  stats?: Record<string, any> | string;
  [key: string]: any;
}

export interface HokArcana {
  id: string | number;
  name: string;
  name_en?: string;
  tier?: number;
  icon?: string;
  stats?: Record<string, any> | string;
  [key: string]: any;
}

export interface HokSpell {
  id: string | number;
  name?: string;
  japanese_name?: string;
  english_name?: string;
  name_en?: string;
  description?: string;
  japanese_description?: string;
  english_description?: string;
  cooldown?: number;
  icon?: string;
  [key: string]: any;
}

export interface HeroCampStats {
  jpName: string;
  tier: string;
  lane: string;
  win_rate: number;
  pick_rate: number;
  ban_rate: number;
}

export interface HeroCounter {
  counters: string[];
  countered_by: string[];
  synergy: string[];
  reason_en?: string;
  reason_ja?: string;
}
