export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      patches: {
        Row: {
          id: string
          version: string
          hero_name: string
          hero_name_en?: string | null
          change_type: "buff" | "nerf" | "adjust" | "new"
          description: string
          description_en?: string | null
          impact_json: Json | null
          created_at?: string
          is_hero?: boolean
        }
        Insert: {
          id?: string
          version: string
          hero_name: string
          hero_name_en?: string | null
          change_type: "buff" | "nerf" | "adjust" | "new"
          description: string
          description_en?: string | null
          impact_json?: Json | null
          created_at?: string
          is_hero?: boolean
        }
        Update: {
          id?: string
          version?: string
          hero_name?: string
          hero_name_en?: string | null
          change_type?: "buff" | "nerf" | "adjust" | "new"
          description?: string
          description_en?: string | null
          impact_json?: Json | null
          created_at?: string
          is_hero?: boolean
        }
      }
      tactical_boards: {
        Row: {
          id: string
          title: string
          board_state: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          board_state?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          board_state?: Json | null
          created_at?: string
        }
      }
    }
  }
}

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
