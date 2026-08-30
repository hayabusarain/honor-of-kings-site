import heroItemBuilds from '@/data/hero_item_builds.json';
import itemsData from '@/data/hok_items.json';
import spellsData from '@/data/hok_spells.json';
import arcanaData from '@/data/hok_arcanas.json';
import { BUILD_NOTES, type BuildNote } from '@/content/buildNotes';

/**
 * おすすめビルドを、表示に必要な形へ解決する。
 *
 * データはゲーム内「推奨セット装備」の人気タブから読み取ったもの
 * （画面にアイテム名が無いため、アイコン画像を手持ちのものと突き合わせて特定した）。
 *
 * 勝利数と勝率は持たない。あの画面の順位と集計値は日替わりで入れ替わり、
 * 撮影日の数字を置くと翌日には食い違う（2026-08-30 に同じヒーローで確認）。
 * 装備とアルカナの中身は日をまたいでも変わらなかったので、そこだけを載せている。
 *
 * ここをサーバー側に置くのは、装備マスタ（100KB）と全体のビルド（50KB）を
 * クライアントバンドルへ入れないため。1ページで要るのは最大12個ぶんだけ。
 */

export type ResolvedItem = {
  id: number;
  name: string;
  icon?: string;
  price: number;
  stats: string;
  passive: string;
  active: string;
};

/** 装着するアルカナ1種。count は30枠のうち何枠に入れるか（同じ色で合計10） */
export type ResolvedArcana = {
  id: string;
  name: string;
  icon?: string;
  type: string;
  count: number;
};

export type ResolvedBuild = {
  items: ResolvedItem[];
  spell: { name: string; icon?: string } | null;
  arcana: ResolvedArcana[];
  /** そのビルドを当サイトが解説した文。まだ書けていないビルドは null */
  note: BuildNote | null;
};

type RawBuild = { items: number[]; spell: string; arcana: { id: string; count: number }[] };
type RawItem = {
  id: number; name: string; name_en?: string; price: number; totalPrice?: number;
  stats?: string; stats_en?: string; passive?: string | null; passive_en?: string | null;
  active?: string | null; active_en?: string | null; icon?: string;
};
type RawSpell = { id: string; japanese_name: string; english_name: string; icon?: string };
type RawArcana = { id: string; type: string; name: string; name_en?: string; icon?: string };

const BUILDS = heroItemBuilds as Record<string, RawBuild[]>;
const ITEM_BY_ID = new Map((itemsData as RawItem[]).map(i => [i.id, i]));
const SPELL_BY_ID = new Map((spellsData as RawSpell[]).map(s => [s.id, s]));
const ARCANA_BY_ID = new Map((arcanaData as RawArcana[]).map(a => [a.id, a]));

// 効果テキストにHTMLタグが混じることがある（アイテム一覧と同じ処理）
const stripHtml = (html: string | null | undefined) =>
  (html || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');

/** ビルドを載せているヒーローか。ページ表題の出し分けに使う */
export function hasHeroItemBuilds(heroId: string): boolean {
  return (BUILDS[heroId]?.length ?? 0) > 0;
}

/** 数値のヒーローIDで引く。撮影できていないヒーローは空配列 */
export function getHeroItemBuilds(heroId: string, locale: string): ResolvedBuild[] {
  const raw = BUILDS[heroId];
  if (!raw) return [];
  const isJa = locale !== 'en';
  const notes = BUILD_NOTES[heroId];
  return raw.map((b, bi) => ({
    note: notes?.[bi]?.[isJa ? 'ja' : 'en'] ?? null,
    items: b.items.flatMap(id => {
      const it = ITEM_BY_ID.get(id);
      if (!it) return [];
      return [{
        id: it.id,
        name: !isJa && it.name_en ? it.name_en : it.name,
        icon: it.icon,
        price: it.totalPrice ?? it.price,
        stats: stripHtml(!isJa && it.stats_en ? it.stats_en : it.stats),
        passive: stripHtml(!isJa && it.passive_en ? it.passive_en : it.passive),
        active: stripHtml(!isJa && it.active_en ? it.active_en : it.active),
      }];
    }),
    spell: (() => {
      const s = SPELL_BY_ID.get(b.spell);
      if (!s) return null;
      return { name: isJa ? s.japanese_name : s.english_name, icon: s.icon };
    })(),
    arcana: b.arcana.flatMap(a => {
      const m = ARCANA_BY_ID.get(a.id);
      if (!m) return [];
      return [{
        id: m.id,
        name: !isJa && m.name_en ? m.name_en : m.name,
        icon: m.icon,
        type: m.type,
        count: a.count,
      }];
    }),
  }));
}
