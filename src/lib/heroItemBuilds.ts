import heroItemBuilds from '@/data/hero_item_builds.json';
import itemsData from '@/data/hok_items.json';
import spellsData from '@/data/hok_spells.json';

/**
 * 人気の装備セットを、表示に必要な形へ解決する。
 *
 * データはゲーム内「推奨セット装備」の人気タブから読み取ったもの
 * （画面にアイテム名が無いため、アイコン画像を手持ちのものと突き合わせて特定した）。
 *
 * ここをサーバー側に置くのは、装備マスタ（100KB）と全体の装備セット（33KB）を
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

export type ResolvedBuild = {
  items: ResolvedItem[];
  spell: { name: string; icon?: string } | null;
  /** その構成での勝利数 */
  wins: number;
  /** その構成での勝率（%） */
  winRate: number;
};

type RawBuild = { items: number[]; spell: string; wins: number; winRate: number };
type RawItem = {
  id: number; name: string; name_en?: string; price: number; totalPrice?: number;
  stats?: string; stats_en?: string; passive?: string | null; passive_en?: string | null;
  active?: string | null; active_en?: string | null; icon?: string;
};
type RawSpell = { id: string; japanese_name: string; english_name: string; icon?: string };

const BUILDS = heroItemBuilds as Record<string, RawBuild[]>;
const ITEM_BY_ID = new Map((itemsData as RawItem[]).map(i => [i.id, i]));
const SPELL_BY_ID = new Map((spellsData as RawSpell[]).map(s => [s.id, s]));

// 効果テキストにHTMLタグが混じることがある（アイテム一覧と同じ処理）
const stripHtml = (html: string | null | undefined) =>
  (html || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');

/** 装備セットを載せているヒーローか。ページ表題の出し分けに使う */
export function hasHeroItemBuilds(heroId: string): boolean {
  return (BUILDS[heroId]?.length ?? 0) > 0;
}

/** 数値のヒーローIDで引く。実測できていないヒーローは空配列 */
export function getHeroItemBuilds(heroId: string, locale: string): ResolvedBuild[] {
  const raw = BUILDS[heroId];
  if (!raw) return [];
  const isJa = locale !== 'en';
  return raw.map(b => ({
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
    wins: b.wins,
    winRate: b.winRate,
  }));
}
