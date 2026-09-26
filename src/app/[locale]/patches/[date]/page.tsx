import { notFound } from 'next/navigation';
import { History } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PatchTable, type PatchMeta } from '@/components/patches/PatchTable';
import { ShareButton } from '@/components/common/ShareButton';
import { BreadcrumbJsonLd, Breadcrumb } from '@/components/seo/BreadcrumbJsonLd';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { getAllPatches } from '@/lib/patchData';
import { patchShortLabel } from '@/lib/patchText';
import { routing } from '@/i18n/routing';
import patchMetas from '@/data/patch_meta.json';

/**
 * 版ごとのパッチノート。
 *
 * これまでは /patches の1枚に8版ぶんが入っていて、特定の版を指すURLが無かった。
 * 「8月27日の変更」を人に見せたくても、開いてからプルダウンで選び直してもらう
 * しかない。版ごとにURLを与えて、そこへ直接送れるようにする。
 *
 * スラッグは patch_meta.json の created_at から作る YYYY-MM-DD。
 * version 文字列は「8月27日アップデートのお知らせ」という日本語の文なので
 * URLには使わない。
 *
 * 表示は既存の PatchTable をそのまま使う。その版のぶんだけ渡せば
 * uniqueVersions が1件になり、版の選択プルダウンも「過去のアップデート」も
 * 自動で消える。buff/nerf/adjust の絞り込みは残るので機能は減らない。
 */
const metas = patchMetas as PatchMeta[];

const slugOf = (m: PatchMeta) => m.created_at.slice(0, 10);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => metas.map((m) => ({ locale, date: slugOf(m) })));
}

// generateStaticParams に無い日付は、ページ本体を実行せずに404へ落とす
export const dynamicParams = false;

function findMeta(date: string) {
  return metas.find((m) => slugOf(m) === date);
}

/**
 * 「8月27日アップデートのお知らせ」から見出し用の短い名前を作る（8月27日パッチ / August 27 patch）。
 * 以前は英語でも日付を訳さず、英語ページの h1 と title が「9月23日 patch」になっていた
 */
function shortLabel(meta: PatchMeta, locale: string) {
  return patchShortLabel(String(meta.version), locale);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; date: string }> }) {
  const { locale, date } = await params;
  const meta = findMeta(date);
  if (!meta) return {};
  const isJa = locale === 'ja';
  const label = shortLabel(meta, locale);
  return buildPageMetadata({
    locale,
    path: `/patches/${date}`,
    title: isJa
      ? `【オナーオブキングス】${label}の変更点まとめ`
      : `Honor of Kings ${label}: full change list`,
    description: isJa
      ? `${label}で変わったヒーローと装備の一覧。数値の変化と、それが実戦で何を意味するかの解説つき。`
      : `Every hero and item changed in the ${label}, with the numbers and what each change means in play.`,
    ogType: 'article',
  });
}

export default async function PatchVersionPage({ params }: { params: Promise<{ locale: string; date: string }> }) {
  const { locale, date } = await params;
  setRequestLocale(locale);
  const meta = findMeta(date);
  if (!meta) notFound();

  const t = await getTranslations({ locale, namespace: 'PatchTable' });
  const isJa = locale === 'ja';
  const label = shortLabel(meta, locale);
  const rows = getAllPatches().filter((p) => p.version === meta.version);

  const trail = [
    { name: isJa ? 'パッチノート' : 'Patch Notes', path: '/patches' },
    { name: label, path: `/patches/${date}` },
  ];

  return (
    <div className="w-full bg-background font-sans text-slate-800">
      <BreadcrumbJsonLd locale={locale} trail={trail} />
      {/* 冒頭の帯は一覧（/patches）と同じ page-hero。影は墨の地で見えないので枠線で区切る。
          装飾のアイコンはスマホで畳む（一覧と同じ） */}
      <div className="page-hero pt-6 pb-5 px-4 border-b border-slate-200 flex items-center gap-3">
        <div className="hidden sm:flex w-11 h-11 rounded-xl bg-brand-50 border border-brand-200 items-center justify-center shrink-0">
          <History className="text-brand-700" size={22} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          {/* 英語は「September 23 patch」が390px幅で2行になるので、行間を詰めすぎない */}
          <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
            {label}
          </h1>
          <p className="mt-1 text-slate-600 text-sm font-bold leading-snug [word-break:auto-phrase]">
            {isJa ? `変更されたのは ${rows.length} 件` : `${rows.length} entries changed`}
          </p>
        </div>
        <ShareButton
          title={isJa ? `【オナーオブキングス】${label}の変更点まとめ` : `Honor of Kings ${label}`}
          className="ml-auto shrink-0"
        />
      </div>

      <div className="px-4 mt-4 space-y-4">
        <Breadcrumb locale={locale} trail={trail} className="px-1" />
        {/* 版ページから一覧へ戻れるようにする。パンくずと重ねて出すのは、
            モバイルでパンくずの文字が小さいため */}
        <Link
          href="/patches"
          className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2"
        >
          {isJa ? '← すべてのアップデート' : '← All updates'}
        </Link>
        <PatchTable patches={rows} patchMetas={[meta]} />
        <p className="px-1 text-sm font-medium leading-relaxed text-slate-600">
          {t('subtitle')}
        </p>
      </div>
    </div>
  );
}
