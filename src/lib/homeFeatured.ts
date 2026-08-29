// トップページの「直近パッチで強化されたヒーロー / アイテム」を組み立てる。
//
// もとは HomeClient の useMemo にあったが、この計算のためだけに
// patches.json（184KB）と hok_items.json（108KB）をクライアントへ運んでいた。
// 出来上がるのはカード数枚分の小さな配列なので、サーバー側で解決して props で渡す。
// このモジュールはサーバーコンポーネントからだけ呼ぶこと。
import itemsData from '@/data/hok_items.json';
import hokHeroes from '@/data/hok_heroes.json';
import { getAllPatches, type PatchEntry } from '@/lib/patchData';

export interface FeaturedItem {
  id: string;
  name_ja: string;
  name_en: string;
  image: string;
  isCompleted: boolean;
  patchDescription: string;
  patchVersion: string;
  isBuffed: boolean;
}

export interface FeaturedHero {
  id: string;
  hero_name: string;
  hero_name_en: string;
  patchDescription: string;
  patchVersion: string;
  isBuffed: boolean;
}

/** パッチ名の並び替え。「7月16日アップデートのお知らせ」形式と「1.24b」形式の両方を扱う */
const compareVersions = (a: string, b: string): number => {
  const jpDateRegex = /^(\d+)月(\d+)日/;
  const jpMatchA = a.match(jpDateRegex);
  const jpMatchB = b.match(jpDateRegex);

  if (jpMatchA && jpMatchB) {
    const monthA = parseInt(jpMatchA[1], 10);
    const dayA = parseInt(jpMatchA[2], 10);
    const monthB = parseInt(jpMatchB[1], 10);
    const dayB = parseInt(jpMatchB[2], 10);

    if (monthA !== monthB) return monthA - monthB;
    if (dayA !== dayB) return dayA - dayB;
  }

  const regex = /^(\d+)\.(\d+)([a-z])?$/i;
  const matchA = a.match(regex);
  const matchB = b.match(regex);

  if (!matchA && !matchB) return a.localeCompare(b);
  if (!matchA) return -1;
  if (!matchB) return 1;

  const majorA = parseInt(matchA[1], 10);
  const minorA = parseInt(matchA[2], 10);
  const suffixA = matchA[3] || '';

  const majorB = parseInt(matchB[1], 10);
  const minorB = parseInt(matchB[2], 10);
  const suffixB = matchB[3] || '';

  if (majorA !== majorB) return majorA - majorB;
  if (minorA !== minorB) return minorA - minorB;
  return suffixA.localeCompare(suffixB);
};

const normalize = (name: string) => name.toLowerCase().replace(/[\s・_]/g, '');

/** 最新のパッチ名だけを残す */
const latestOnly = (list: PatchEntry[]): PatchEntry[] => {
  if (list.length === 0) return [];
  const versions = Array.from(new Set(list.map((p) => p.version || '')))
    .sort((a, b) => compareVersions(b, a));
  return list.filter((p) => (p.version || '') === versions[0]);
};

export function getHomeFeatured(locale: string): { featuredItems: FeaturedItem[]; featuredHeros: FeaturedHero[] } {
  const buffs = getAllPatches().filter((p) => p.change_type === 'buff');

  // 1. アイテム。パッチ側の名前（日本語・英語のどちらか）でアイテムマスタと突き合わせる
  const items = (itemsData as Record<string, any>[]);
  const matchItem = (patch: PatchEntry) => {
    const jp = normalize(patch.hero_name || '');
    const en = normalize(patch.hero_name_en || '');
    return items.find((item) => {
      const n = normalize(item.name || '');
      return (!!jp && !!n && n === jp) || (!!en && !!n && n === en);
    });
  };

  const seenItemIds = new Set<string>();
  const featuredItems = latestOnly(buffs.filter((p) => !p.is_hero && matchItem(p)))
    .map((patch) => {
      const matched = matchItem(patch);
      if (!matched || seenItemIds.has(matched.id)) return null;
      seenItemIds.add(matched.id);
      return {
        id: matched.id,
        name_ja: matched.name,
        // 公式英名が無いアイテムだけ日本語名にフォールバックする。
        // 以前は常に日本語名を入れており、英語版トップに日本語が出ていた
        name_en: matched.name_en || matched.name,
        image: matched.icon,
        isCompleted: true,
        patchDescription: (locale === 'ja' ? patch.description : patch.description_en) || '',
        patchVersion: (locale === 'en' ? patch.version_en || patch.version : patch.version) || '',
        isBuffed: true,
      } as FeaturedItem;
    })
    .filter((x): x is FeaturedItem => x !== null);

  // 2. ヒーロー
  const seenHeroNames = new Set<string>();
  const featuredHeros = latestOnly(buffs.filter((p) => p.is_hero))
    .map((patch) => {
      const nameKey = (patch.hero_name_en || patch.hero_name || '').toLowerCase().trim();
      if (seenHeroNames.has(nameKey)) return null;
      seenHeroNames.add(nameKey);

      // name(日本語) と name_en(公式英名) の両方でパッチとヒーローを紐付ける
      const matched = (hokHeroes as Record<string, any>[]).find(
        (h) => h.name === patch.hero_name || (patch.hero_name_en && h.name_en === patch.hero_name_en)
      );

      return {
        id: matched ? matched.id : patch.hero_name_en || '',
        hero_name: locale === 'en' && matched?.name_en
          ? matched.name_en
          : (locale === 'ja' ? patch.hero_name : patch.hero_name_en || patch.hero_name) || '',
        hero_name_en: patch.hero_name_en || '',
        patchDescription: (locale === 'ja' ? patch.description : patch.description_en) || '',
        patchVersion: (locale === 'en' ? patch.version_en || patch.version : patch.version) || '',
        isBuffed: true,
      } as FeaturedHero;
    })
    .filter((x): x is FeaturedHero => x !== null);

  return { featuredItems, featuredHeros };
}
