// トップページの「直近パッチで強化されたヒーロー」を組み立てる。
//
// 「注目アイテム」は 2026-09-01 に撤去した。パッチのアイテム項目と
// hok_items.json の名前が一致する行を探す作りだったが、条件を満たす行が
// 出てこない。データ側に条件を足しても出るものが無いので、枠ごと畳んだ。
//
// もとは HomeClient の useMemo にあったが、この計算のためだけに
// patches.json（184KB）と hok_items.json（108KB）をクライアントへ運んでいた。
// 出来上がるのはカード数枚分の小さな配列なので、サーバー側で解決して props で渡す。
// このモジュールはサーバーコンポーネントからだけ呼ぶこと。
import hokHeroes from '@/data/hok_heroes.json';
import { getAllPatches, type PatchEntry } from '@/lib/patchData';
import { getLatestPatchChanges } from '@/lib/patchBadges';

export interface FeaturedHero {
  id: string;
  hero_name: string;
  hero_name_en: string;
  patchDescription: string;
  patchVersion: string;
  isBuffed: boolean;
}

/**
 * 最新のパッチ名だけを残す。
 *
 * 以前はここで独自の compareVersions を持っていたが、
 * 「7月16日アップデートのお知らせ」形式を月日だけで比べていたため、
 * 年をまたぐと 12月 > 1月 になって前年のパッチが最新扱いになる。
 * patch_meta.json の created_at（実日付）で決める getLatestPatchChanges に寄せる。
 */
const latestOnly = (list: PatchEntry[]): PatchEntry[] => {
  if (list.length === 0) return [];
  const { version } = getLatestPatchChanges();
  return list.filter((p) => (p.version || '') === version);
};

export function getHomeFeatured(locale: string): { featuredHeros: FeaturedHero[] } {
  const buffs = getAllPatches().filter((p) => p.change_type === 'buff');

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

  return { featuredHeros };
}
