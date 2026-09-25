import { setRequestLocale } from 'next-intl/server';
import { Breadcrumb, BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { CompareClient } from '@/components/compare/CompareClient';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { buildCompareHeroes, buildCompareMeta, type CompareLocale } from '@/lib/compare';

/**
 * ヒーロー比較。2体を1つの表に並べる。
 *
 * JSON はここ（サーバー）で読み、表に出す項目だけに絞って渡す（src/lib/compare.ts）。
 * 選択は ?h=lian-po,mulan のクエリで動くが、searchParams は読まない。
 * 読むとページが動的になり、静的生成から外れる。クエリはクライアントがマウント後に読む。
 */

const CRUMB = { ja: 'ヒーロー比較', en: 'Compare Heroes' };

const toLocale = (locale: string): CompareLocale => (locale === 'ja' ? 'ja' : 'en');

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  // layout の title.template が屋号を付けるので、ここでは接尾辞を書かない
  return buildPageMetadata({
    locale,
    path: '/compare',
    title: isJa ? 'ヒーロー2体比較｜基本ステータス・勝率・Tier' : 'Compare Two Heroes: Base Stats, Win Rate & Tier',
    description: isJa
      ? 'オナーオブキングス（HoK）のヒーローを2体選び、最大HP・物理攻撃・移動速度などのゲーム内ステータスと、公式HoK Campの勝率・出現率・BAN率・Tierを1つの表で見比べられます。選んだ組み合わせはURLで共有できます。'
      : 'Pick two Honor of Kings (HoK) heroes and compare their in-game base stats, such as max HP, physical attack and movement speed, with win, pick and ban rates and tier from the official HoK Camp in one table. The URL keeps the pair, so you can share it.',
  });
}

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = toLocale(locale);
  const trail = [{ name: CRUMB[loc], path: '/compare' }];

  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={trail} />
      <div className="mx-auto w-full max-w-4xl">
        <Breadcrumb locale={locale} trail={trail} className="px-1 pt-3 pb-1" />
        <CompareClient locale={loc} heroes={buildCompareHeroes(loc)} meta={buildCompareMeta(loc)} />
      </div>
    </>
  );
}
