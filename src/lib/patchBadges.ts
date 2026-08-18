// 最新パッチで調整されたヒーローの一覧を patches.json から導出する。
// Tier表・ヒーロー一覧の「直近パッチで強化/弱体」バッジに使う。
//
// 注意: patches.json は156KBあるため、このモジュールをクライアントコンポーネントから
// import しないこと（バンドルに丸ごと載ってしまう）。サーバーコンポーネント側で
// getLatestPatchChanges() を呼び、結果の小さなオブジェクトだけを props で渡す。
import patches from '@/data/patches.json';
import patchMeta from '@/data/patch_meta.json';

export type PatchChangeType = 'buff' | 'nerf' | 'adjust';

export interface LatestPatchChanges {
  /** パッチ名（例: 8月13日アップデートのお知らせ） */
  version: string;
  versionEn: string;
  /** 取得元パッチの日付 YYYY-MM-DD */
  date: string;
  /** hero_id → 変更種別 */
  changes: Record<string, PatchChangeType>;
}

interface PatchEntry {
  version: string;
  change_type: string;
  hero_id?: string;
}

export function getLatestPatchChanges(): LatestPatchChanges {
  const latest = [...patchMeta].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  const changes: Record<string, PatchChangeType> = {};
  for (const p of patches as PatchEntry[]) {
    if (p.version !== latest.version || !p.hero_id) continue;
    // 'new'（新ヒーロー）など buff/nerf/adjust 以外は対象外
    const type = p.change_type;
    if (type !== 'buff' && type !== 'nerf' && type !== 'adjust') continue;
    // 同一ヒーローに複数の変更がある場合、buff/nerf のほうが adjust より情報量が多い。
    // ただし buff と nerf が両方あるときは一方向の調整に見えないよう adjust に落とす
    const prev = changes[p.hero_id];
    if (!prev || prev === 'adjust') changes[p.hero_id] = type;
    else if (prev !== type) changes[p.hero_id] = 'adjust';
  }

  return {
    version: latest.version,
    versionEn: latest.version_en ?? latest.version,
    date: latest.created_at.slice(0, 10),
    changes,
  };
}
