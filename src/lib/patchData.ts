// パッチノートのデータをサーバー側で読み、必要な分だけをクライアントへ渡すための入口。
//
// patches.json は184KB、patch_meta.json は32KB ある。クライアントコンポーネントから
// import するとバンドルに丸ごと載り、しかも共有チャンクに入るため、パッチと関係の
// ないページ（トップ・ヒーロー詳細）でも同じ180KBを読み込むことになっていた。
// このモジュールはサーバーコンポーネントからだけ呼ぶこと。
import patches from '@/data/patches.json';
import heroes from '@/data/hok_heroes.json';
import { patchIconKind, type PatchIconKind } from '@/lib/patchIconKind';

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
  /** 顔アイコンのパス。サーバーでここに入れる（下の withIcon） */
  hero_image?: string | null;
  /** ヒーロー以外の行の図柄の種類。サーバーでここに入れる（下の withIcon） */
  icon_kind?: PatchIconKind | null;
}

// 顔アイコンはここで引いて渡す。以前は PatchTable（'use client'）が hok_heroes.json（38KB）を
// 丸ごと import して名前で探していた。パッチのヒーロー項目は全件 hero_id で引ける（2026-09-25 確認）
const imageById = new Map((heroes as { id: string; image?: string }[]).map((h) => [String(h.id), h.image ?? null]));

// ヒーロー以外の行には図柄の種類を付ける（patchIconKind.ts）。以前は一律に「⚔️」だった
const withIcon = (p: PatchEntry): PatchEntry => {
  if (p.is_hero === false) return { ...p, icon_kind: patchIconKind(p.hero_name_en) };
  return p.hero_id ? { ...p, hero_image: imageById.get(String(p.hero_id)) ?? null } : p;
};

const ALL: PatchEntry[] = (patches as PatchEntry[]).map(withIcon);

/** パッチノートページ用。全件をそのまま渡す（このページではデータ自体が本文） */
export function getAllPatches(): PatchEntry[] {
  return ALL;
}

/**
 * ヒーロー詳細の「パッチ履歴」用。1体あたり0〜3件しかないので、
 * 全77件のうち該当分だけを渡す。heroId は hok_heroes の id（hero_004 形式）
 */
export function getPatchesForHero(heroId: string): PatchEntry[] {
  return ALL.filter((p) => p.hero_id === heroId);
}
