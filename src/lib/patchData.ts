// パッチノートのデータをサーバー側で読み、必要な分だけをクライアントへ渡すための入口。
//
// patches.json は184KB、patch_meta.json は32KB ある。クライアントコンポーネントから
// import するとバンドルに丸ごと載り、しかも共有チャンクに入るため、パッチと関係の
// ないページ（トップ・ヒーロー詳細）でも同じ180KBを読み込むことになっていた。
// このモジュールはサーバーコンポーネントからだけ呼ぶこと。
import patches from '@/data/patches.json';

export interface PatchEntry {
  id: string;
  version: string | null;
  version_en?: string | null;
  hero_id?: string | null;
  hero_name?: string | null;
  hero_name_en?: string | null;
  change_type?: string | null;
  description?: string | null;
  description_en?: string | null;
  is_hero?: boolean | null;
}

/** パッチノートページ用。全件をそのまま渡す（このページではデータ自体が本文） */
export function getAllPatches(): PatchEntry[] {
  return patches as PatchEntry[];
}

/**
 * ヒーロー詳細の「パッチ履歴」用。1体あたり0〜3件しかないので、
 * 全77件のうち該当分だけを渡す。heroId は hok_heroes の id（hero_004 形式）
 */
export function getPatchesForHero(heroId: string): PatchEntry[] {
  return (patches as PatchEntry[]).filter((p) => p.hero_id === heroId);
}
