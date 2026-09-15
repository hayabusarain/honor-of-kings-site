import heroes from '@/data/hok_heroes.json';
import skillsJa from '@/data/skills/ja.json';
import dataFreshness from '@/data/data_freshness.json';
import { DIFFICULTY_IDS } from '@/content/heroDifficulty';
import type { FaqSlotName } from '@/content/faq';

/**
 * FAQ の本文にある {slotName} を、データから読んだ値で埋める。
 *
 * 数値や日付を faq.ts に直書きすると、データを更新したときに答えだけが古いまま残る。
 * 名前の一覧は faq.ts の FAQ_SLOT_NAMES にあり、Record の型でここに実装の抜けがあれば止まる。
 * skills/ja.json を読むので、サーバー部品からだけ呼ぶ（'use client' のページは layout.tsx から出す）。
 */

const difficultyCount = (id: string) =>
  Object.values(skillsJa as Record<string, { difficulty?: string }>).filter((h) => h.difficulty === id).length;

const SLOTS: Record<FaqSlotName, () => string | number> = {
  statsDate: () => dataFreshness.campStats.updatedAt,
  heroCount: () => heroes.length,
  difficultyLevelCount: () => DIFFICULTY_IDS.length,
  easyHeroCount: () => difficultyCount('イージー'),
  normalHeroCount: () => difficultyCount('ノーマル'),
  hardHeroCount: () => difficultyCount('ハード'),
  veryHardHeroCount: () => difficultyCount('ベリーハード'),
  unratedDifficultyCount: () =>
    Object.values(skillsJa as Record<string, { difficulty?: string }>).filter((h) => !h.difficulty).length,
  roleCount: () => new Set(heroes.flatMap((h) => h.role)).size,
  multiRoleHeroCount: () => heroes.filter((h) => h.role.length > 1).length,
};

export function fillFaqSlots(text: string): string {
  return text.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in SLOTS ? String(SLOTS[name as FaqSlotName]()) : whole,
  );
}
