import heroes from '@/data/hok_heroes.json';
import skillsJa from '@/data/skills/ja.json';
import dataFreshness from '@/data/data_freshness.json';
import spells from '@/data/hok_spells.json';
import items from '@/data/hok_items.json';
import campStats from '@/data/hero_stats_camp.json';
import guideJa from '@/data/guide/ja.json';
import { ITEM_SLOTS } from '@/lib/itemSimulatorShared';
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

/** 値が読めなければビルドを止める。答えに undefined や空欄が出るより、気づけるほうがよい */
function must<T>(value: T | undefined | null, what: string): T {
  if (value === undefined || value === null || value === '') throw new Error(`faqSlots: ${what} が読めない`);
  return value;
}

const itemById = (id: number) => must(items.find((i) => i.id === id), `装備 ${id}`);
// 忍びの靴（上位の靴の代表）と神速の靴。上位の靴6種は価格と切り替え条件が同じ
const UPPER_BOOT_ID = 1421;
const BASIC_BOOT_ID = 1411;
// 答えは「どれも同じ秒数・減少率」と言い切るので、1件でも値が違えばビルドを止める
const grievousItems = items.filter((i) => (i.passive ?? '').includes('重傷'));
const grievousValues = new Set(grievousItems.map((i) =>
  must((i.passive ?? '').match(/(\d+(?:\.\d+)?)秒間、敵のHP回復とライフスティール(?:効果)?を(\d+)%/), `${i.name} の重傷`).slice(1, 3).join('/'),
));
if (grievousValues.size !== 1) throw new Error(`faqSlots: 重傷の値が装備によって違う ${[...grievousValues].join(', ')}`);
const [grievousSeconds, grievousPercent] = [...grievousValues][0].split('/');
// タイラントとオーバーロードの出現時刻。答えは「どちらも」と言うので、食い違えばビルドを止める
const spawnMinutes = new Set(['タイラント', 'オーバーロード'].map((n) =>
  must(guideJa.objectives.find((o) => o.name.startsWith(n))?.spawn_time.match(/(\d+)分/)?.[1], `${n}の出現時刻`),
));
if (spawnMinutes.size !== 1) throw new Error(`faqSlots: タイラントとオーバーロードの出現時刻が違う ${[...spawnMinutes].join(', ')}`);
const laneIds = new Set(Object.values(campStats as Record<string, { lane: string }>).map((s) => s.lane));

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
  spellCount: () => spells.length,
  flashUnlockLevel: () => must(spells.find((s) => s.id === 'flash')?.unlock_level, 'フラッシュの解放レベル'),
  sprintUnlockLevel: () => must(spells.find((s) => s.id === 'sprint')?.unlock_level, 'ダッシュの解放レベル'),
  itemSlotCount: () => ITEM_SLOTS,
  bootSwitchCooldownMinutes: () => must((itemById(UPPER_BOOT_ID).passive ?? '').match(/クールダウンは(\d+)分/)?.[1], '靴の切り替えクールダウン'),
  upperBootPrice: () => itemById(UPPER_BOOT_ID).price,
  basicBootPrice: () => itemById(BASIC_BOOT_ID).price,
  grievousItemCount: () => grievousItems.length,
  grievousDurationSeconds: () => grievousSeconds,
  grievousReductionPercent: () => grievousPercent,
  bossSpawnMinute: () => [...spawnMinutes][0],
  laneCount: () => [...laneIds].filter((l) => l !== 'JUNGLE' && l !== 'ROAM').length,
  positionCount: () => laneIds.size,
};

export function fillFaqSlots(text: string): string {
  return text.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in SLOTS ? String(SLOTS[name as FaqSlotName]()) : whole,
  );
}
