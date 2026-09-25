'use client';

import { useEffect, useMemo, useState } from 'react';
import { ShareButton } from '@/components/common/ShareButton';
import { readQuery, replaceQuery } from '@/lib/urlState';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { BarChart3, ChevronRight, LayoutGrid, Map as MapIcon, Users } from 'lucide-react';
import { Dropdown, type DropdownOption } from '@/components/common/Dropdown';
import type { ItemUsage } from '@/lib/itemUsage';

/**
 * 装備の採用率ランキングの表示部。
 *
 * 集計はサーバー側（itemUsage.ts）で済ませてあり、ここは切り口の切り替えだけを持つ。
 * 母数が切り口ごとに違うので、選んだ切り口の「N通り中」を常に添える。
 *
 * 切り口は1つのプルダウンにまとめてある（2026-09-25）。以前はチップ12個が 390px 幅で
 * 約245px の枠を取り、最初の画面に見えるランキングが2位までだった。
 * 行は装備一覧の詳細（/items?item=<id>）へのリンク。ここの id は hok_items.json の
 * サイト内部IDで、装備一覧が ?item= で照合するIDと同じ（公式の equipId ではない）。
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

  const topRate = group.rows.length > 0 ? group.rows[0][1] / group.sets : 1;

  // 並びは groups の順（全体 → ロール6 → レーン5）。Dropdown に小見出しが無いので、
  // ロールとレーンでアイコンを分けて、一覧の中で切れ目が見えるようにする
  const axisIcon = {
    all: <LayoutGrid className="h-5 w-5 text-slate-500" aria-hidden="true" />,
    role: <Users className="h-5 w-5 text-slate-500" aria-hidden="true" />,
    lane: <MapIcon className="h-5 w-5 text-slate-500" aria-hidden="true" />,
  };
  const options: DropdownOption<string>[] = usage.groups.map(g => ({
    value: g.key,
    // 閉じたボタンに「全体」とだけ出ると、何を切り替える部品か読めない
    label: g.key === 'all'
      ? (isJa ? 'すべてのロール・レーン' : 'All roles and lanes')
      : labels[g.key] ?? g.key,
    icon: axisIcon[g.axis],
  }));

  return (
    <div className="w-full bg-background font-sans text-slate-800">

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

        <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <Dropdown
            className="w-full sm:w-72"
            label={isJa ? 'ロール・レーンで絞り込む' : 'Filter by role or lane'}
            options={options}
            value={group.key}
            onChange={setActiveKey}
            defaultValue="all"
          />

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-slate-100">
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
                <li key={id}>
                  {/* 行全体で装備の詳細を開く。効果はここでは1行に切り詰めていて、
                      全文は装備一覧の詳細シートにしか無い。
                      先読みは切る。Next 16.3 の経路キャッシュは検索文字列ごとに別の項目になる
                      （segment-cache/vary-path.js）。先読みを残すと、同じ /items の RSC
                      （開発サーバーで約124KB）を、画面に入った行の数（最大62＋9）だけ取りに行く */}
                  <Link
                    href={`/items?item=${id}`}
                    prefetch={false}
                    className="-mx-2 flex min-h-11 items-center gap-2 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <span className="w-5 shrink-0 text-right text-[12px] font-black tabular-nums text-slate-500">
                      {i + 1}
                    </span>
                    {item.icon && (
                      <Image src={item.icon} alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-lg" />
                    )}
                    {/* 採用率は名前の行、件数は棒の行の右端に置き、効果の行には右の列を作らない。
                        右に列を立てると 390px で名前が「シャドーア／ックス」と折れ、
                        効果は「+80 …」までしか見えなかった */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        {/* 360px では名前の幅が107pxしかなく、「ガーディアン・閃／光」と語の途中で折れていた。
                            行の間隔と順位の列を詰めて10px空け、折り返しは「・」の後ろに寄せる。
                            それでも入らない10文字の名前だけ、任意の位置で折る */}
                        <span className="min-w-0 flex-1 break-keep wrap-anywhere text-[13px] font-black leading-snug text-slate-800">{item.name}</span>
                        <span className="shrink-0 text-[14px] font-black tabular-nums text-slate-900">{rate.toFixed(1)}%</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {/* 1位を満幅にして、上位との差が目で分かるようにする */}
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-brand-500"
                            style={{ width: `${Math.max(2, (rate / 100 / topRate) * 100)}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-[10px] font-bold tabular-nums text-slate-500">
                          {count} / {group.sets}
                        </span>
                      </div>
                      <div className="mt-1 truncate text-xs font-bold text-slate-500">
                        <span className="tabular-nums">{item.price.toLocaleString(locale)}G</span>
                        {/* 「・」は仮名の範囲（U+30FB）で、英語ページでは日本語の残りとして数えられる */}
                        {item.stats && (isJa ? ` ・ ${item.stats}` : ` • ${item.stats}`)}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  </Link>
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
                // ランキングの行と同じく、装備一覧の詳細を開く
                <Link
                  key={id}
                  href={`/items?item=${id}`}
                  prefetch={false}
                  className="flex min-h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 transition-colors hover:border-slate-300 hover:bg-white"
                >
                  {usage.items[id].icon && (
                    <Image src={usage.items[id].icon!} alt="" width={20} height={20} className="h-5 w-5 rounded" />
                  )}
                  <span className="text-[11px] font-bold text-slate-600">{usage.items[id].name}</span>
                  <span className="text-[10px] font-bold tabular-nums text-slate-500">
                    {usage.items[id].price.toLocaleString(locale)}G
                  </span>
                </Link>
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
          {/* 文字だけだと押せる高さが16pxしかなかったので、24px を確保する */}
          <Link
            href="/items"
            className="mt-3 inline-flex min-h-6 items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
          >
            <BarChart3 size={13} />
            {isJa ? 'アイテム一覧で全114種の効果を見る' : 'See all item effects on the Items page'} →
          </Link>
        </section>
      </div>
    </div>
  );
}
