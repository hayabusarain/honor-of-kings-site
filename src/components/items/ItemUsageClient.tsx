'use client';

import { useEffect, useMemo, useState } from 'react';
import { ShareButton } from '@/components/common/ShareButton';
import { readQuery, replaceQuery, pickEnum } from '@/lib/urlState';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { BarChart3 } from 'lucide-react';
import type { ItemUsage } from '@/lib/itemUsage';

/**
 * 装備の採用率ランキングの表示部。
 *
 * 集計はサーバー側（itemUsage.ts）で済ませてあり、ここは切り口の切り替えだけを持つ。
 * 母数が切り口ごとに違うので、選んだ切り口の「N通り中」を常に添える。
 */

type Props = {
  usage: ItemUsage;
  /** 切り口の表示名。サーバー側で messages の Role 名前空間から解決して渡す */
  labels: Record<string, string>;
  /** 装備データを書き起こした日 */
  itemsUpdatedAt: string;
  /** おすすめビルドを読み取った日 */
  buildsUpdatedAt: string;
};

export function ItemUsageClient({ usage, labels, itemsUpdatedAt, buildsUpdatedAt }: Props) {
  const locale = useLocale();
  const isJa = locale === 'ja';
  const [activeKey, setActiveKey] = useState('all');
  const [isMounted, setIsMounted] = useState(false);

  // 見ているレーンをURLに載せる。共有されたリンクで同じ表が開く
  useEffect(() => {
    const key = readQuery()?.get('lane');
    // 渡された groups に実在するキーだけを通す
    if (key && usage.groups.some(g => g.key === key)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveKey(key);
    }
    setIsMounted(true);
  }, [usage.groups]);

  useEffect(() => {
    if (!isMounted) return;
    replaceQuery({ lane: activeKey === 'all' ? null : activeKey });
  }, [activeKey, isMounted]);

  const group = useMemo(
    () => usage.groups.find(g => g.key === activeKey) ?? usage.groups[0],
    [usage.groups, activeKey],
  );

  const roleGroups = usage.groups.filter(g => g.axis === 'role');
  const laneGroups = usage.groups.filter(g => g.axis === 'lane');
  const topRate = group.rows.length > 0 ? group.rows[0][1] / group.sets : 1;

  const chip = (key: string, label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setActiveKey(key)}
      className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
        activeKey === key
          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full bg-slate-50 font-sans text-slate-800">

      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          {isJa ? 'アイテム採用率ランキング' : 'Item Pick Rate Rankings'}
        </h1>
        {/* 並び替え・絞り込み・構成は replaceState でURLに載っている。
            ShareButton は location.href を読むので、そのまま共有に乗る */}
        <ShareButton title={isJa ? '【オナーオブキングス】アイテム採用率ランキング' : 'Honor of Kings Item Pick Rates'} className="mt-3" />
        <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-slate-500">
          {isJa
            ? `ヒーロー${usage.heroCount}体のおすすめビルド${usage.totalSets}通りを集計し、実際に組まれている装備を多い順に並べています。`
            : `Built from ${usage.totalSets} popular item sets across ${usage.heroCount} heroes, ranked by how often each item actually appears.`}
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4">

        <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {chip('all', isJa ? '全体' : 'All')}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 shrink-0 text-[11px] font-black text-slate-500">
              {isJa ? 'ロール' : 'Role'}
            </span>
            {roleGroups.map(g => chip(g.key, labels[g.key] ?? g.key))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 shrink-0 text-[11px] font-black text-slate-500">
              {isJa ? 'レーン' : 'Lane'}
            </span>
            {laneGroups.map(g => chip(g.key, labels[g.key] ?? g.key))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-900">
              {activeKey === 'all' ? (isJa ? '全体' : 'All') : labels[activeKey] ?? activeKey}
            </h2>
            <span className="text-[11px] font-bold text-slate-500 tabular-nums">
              {isJa
                ? `${group.sets}通りのセットを集計 ／ ${group.rows.length}種が登場`
                : `${group.sets} sets counted / ${group.rows.length} items appear`}
            </span>
          </div>

          <ol className="mt-1 divide-y divide-slate-100">
            {group.rows.map(([id, count], i) => {
              const item = usage.items[id];
              const rate = (count / group.sets) * 100;
              return (
                <li key={id} className="flex items-center gap-3 py-2.5">
                  <span className="w-6 shrink-0 text-right text-[12px] font-black tabular-nums text-slate-500">
                    {i + 1}
                  </span>
                  {item.icon && (
                    <Image src={item.icon} alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-lg" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[13px] font-black text-slate-800">{item.name}</span>
                      <span className="text-[10px] font-bold tabular-nums text-slate-500">
                        {item.price.toLocaleString()}G
                      </span>
                    </div>
                    {item.stats && (
                      <div className="mt-0.5 truncate text-[11px] font-bold text-slate-500">{item.stats}</div>
                    )}
                    {/* 1位を満幅にして、上位との差が目で分かるようにする */}
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${Math.max(2, (rate / 100 / topRate) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 shrink-0 text-right">
                    <div className="text-[14px] font-black tabular-nums text-slate-900">{rate.toFixed(1)}%</div>
                    <div className="text-[10px] font-bold tabular-nums text-slate-500">
                      {count} / {group.sets}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* 出てこない完成装備。素材を混ぜると数が膨らんで「使われない装備が多い」と
            誤読されるので、6枠に入りうるものだけを出す */}
        {usage.unusedFinished.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h2 className="text-base font-black text-slate-900">
              {isJa ? 'おすすめビルドに出てこない完成装備' : 'Finished items that never appear'}
            </h2>
            <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-slate-500">
              {isJa
                ? `${usage.totalSets}通りのどれにも入っていない完成装備です。`
                : `${usage.unusedFinished.length} finished items appear in none of the ${usage.totalSets} sets.`}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {usage.unusedFinished.map(id => (
                <span
                  key={id}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1"
                >
                  {usage.items[id].icon && (
                    <Image src={usage.items[id].icon!} alt="" width={20} height={20} className="h-5 w-5 rounded" />
                  )}
                  <span className="text-[11px] font-bold text-slate-600">{usage.items[id].name}</span>
                  <span className="text-[10px] font-bold tabular-nums text-slate-500">
                    {usage.items[id].price.toLocaleString()}G
                  </span>
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm font-medium leading-relaxed text-slate-600">
            {isJa
              ? '採用率は、絞り込んだセットのうち何通りにその装備が入っていたかです。'
              : 'The pick rate is the share of sets in the current slice that include the item.'}
          </p>
          <p className="mt-3 text-xs font-medium leading-relaxed text-slate-500">
            {isJa
              ? `おすすめビルドは${buildsUpdatedAt}、装備の効果と価格は${itemsUpdatedAt}時点の書き起こしです。`
              : `Item sets were read on ${buildsUpdatedAt}; item effects and prices were transcribed on ${itemsUpdatedAt}.`}
          </p>
          <Link
            href="/items"
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
          >
            <BarChart3 size={13} />
            {isJa ? 'アイテム一覧で全114種の効果を見る' : 'See all item effects on the Items page'} →
          </Link>
        </section>
      </div>
    </div>
  );
}
