import dataFreshness from '@/data/data_freshness.json';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd, Breadcrumb } from '@/components/seo/BreadcrumbJsonLd';
import { getSimulatorData } from '@/lib/itemSimulator';
import { ItemSimulatorClient } from '@/components/items/ItemSimulatorClient';

/**
 * 装備シミュレータ。
 *
 * アイテム一覧は1つずつの効果を並べているだけで、6枠そろえたときの数字は
 * どこにも無かった。効果文の解析とヒーロー基礎値の読み込みはサーバー側で済ませ、
 * 枠の出し入れだけをクライアントに渡す（装備マスタ100KBを持ち込まないため）。
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/items/simulator',
    title: isJa ? '装備シミュレータ｜6枠の合計ステータス' : 'Item Build Simulator: Combined Stats',
    description: isJa
      ? 'オナーオブキングス（HoK）の装備を6枠まで選び、ステータスの合計と必要ゴールドを計算します。ヒーローの基礎値に足した数値の確認と、おすすめビルドの読み込みにも対応。'
      : 'Combine up to six Honor of Kings (HoK) items and see the total stats and gold cost, apply them to a hero’s base stats, or load a recommended build in one click.',
  });
}

export default async function ItemSimulatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const data = getSimulatorData(locale);

  const trail = [
    { name: isJa ? 'アイテム一覧' : 'Items', path: '/items' },
    { name: isJa ? '装備シミュレータ' : 'Item Build Simulator', path: '/items/simulator' },
  ];

  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={trail} />
      {/* 構造化データと同じトレイルを可視の導線にも渡す */}
      <Breadcrumb locale={locale} trail={trail} className="px-1 pt-3 pb-1" />
      <ItemSimulatorClient data={data} itemsUpdatedAt={dataFreshness.staticData.items.updatedAt} />
    </>
  );
}
