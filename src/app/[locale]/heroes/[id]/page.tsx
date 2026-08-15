import { HeroDetailClient } from "@/components/heroes/HeroDetailClient";
import hokHeroes from "@/data/hok_heroes.json";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { HokHero } from '@/types/database';
import { parseHeroSkills } from '@/lib/parseHeroSkills';
import { buildPageMetadata } from '@/lib/buildMetadata';
import dataFreshness from '@/data/data_freshness.json';
// スキル解説をサーバー側で読み込み初期HTMLに含める（AdSense/SEO対策）。
// クライアント fetch 任せだとクローラには本文の無いページに見えてしまう
import skillsJa from '../../../../../public/data/skills/ja.json';
import skillsEn from '../../../../../public/data/skills/en.json';

export const revalidate = 3600;

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  
  for (const locale of routing.locales) {
    for (const hero of hokHeroes as HokHero[]) {
      params.push({ locale, id: hero.id });
      if (hero.slug) {
        params.push({ locale, id: hero.slug });
      }
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  const hero = (hokHeroes as HokHero[]).find(h => h.id === id || h.slug === id);
  const heroName = locale === 'ja' ? (hero?.name || id) : (hero?.name_en || hero?.name || id);
  // 注意: ビルド（推奨装備）セクションは現在非表示のため、タイトル・説明文で
  // 「ビルド」を約束しない（看板と実態の不一致は SEO・AdSense 双方に不利）
  // 全116体に理由つきの「苦手な相手」を計228件持っているのに、日本語タイトルだけ
  // カウンター系の語が無く、その検索を取りに行けていなかった（英語版には Counters がある）
  const title = locale === 'ja'
    ? `【オナーオブキングス】${heroName}の評価・カウンター対策・立ち回り解説`
    : `${heroName} Guide: Skills, Counters & Strategy - Honor of Kings (HoK)`;
  const description = locale === 'ja'
    ? `オナーオブキングス（HoK）の${heroName}の最新Tier評価、スキル解説、カウンター、立ち回りを徹底解説！`
    : `Complete ${heroName} guide for Honor of Kings (HoK): latest tier rating, skill breakdown, counters, and strategy tips.`;

  const heroSlug = hero?.slug || id;

  // 以前は openGraph を title/description/images だけで丸ごと上書きしており、
  // siteName / locale / url が消えていた。共通ヘルパーで揃える
  return buildPageMetadata({
    locale,
    path: `/heroes/${heroSlug}`,
    title,
    description,
    ogType: 'article',
    images: [{ url: hero?.image || `/images/heroes/${hero?.id || id}.webp`, alt: heroName }],
  });
}

export default async function HeroDetailsPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const resolvedParams = await params;
  const { id, locale } = resolvedParams;

  const heroEntry = (hokHeroes as HokHero[]).find(h => h.id === id || h.slug === id);
  // 存在しないスラッグでも中身の無いページを 200 で返してしまうと、
  // 検索エンジンにソフト404（低品質ページ）と判定される。明示的に 404 を返す。
  if (!heroEntry) notFound();
  const hero = heroEntry;

  const heroName = locale === 'ja' ? (hero.name || id) : (hero.name_en || hero.name || id);
  const heroSlug = hero.slug || id;
  const baseUrl = `https://hok.hub-game.com/${locale}`;

  // スキル・戦略解説をサーバー側で解決し、初期HTMLに本文を含める
  const skillsData = (locale === 'ja' ? skillsJa : skillsEn) as Record<string, any>;
  const rawSkills = skillsData[hero.id];
  const initialDetails = rawSkills ? parseHeroSkills(rawSkills, hero.id, locale) : null;

  // 注意: URL は locale プレフィックス付きの正規URL（canonical と一致）を使う。
  // headline に「Build」は入れない（ビルドセクション非表示中のため）
  // 掲載データの更新日のうち最新のものを、記事の dateModified として使う
  const contentDateModified = [
    dataFreshness.campStats.updatedAt,
    dataFreshness.skillPriority.updatedAt,
    dataFreshness.teamCombos.updatedAt,
    dataFreshness.combos.updatedAt,
  ]
    .filter(Boolean)
    .sort()
    .at(-1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": locale === 'ja' ? 'ホーム' : 'Home',
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": locale === 'ja' ? 'ヒーロー一覧' : 'Heroes',
            "item": `${baseUrl}/heroes`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": heroName,
            "item": `${baseUrl}/heroes/${heroSlug}`
          }
        ]
      },
      {
        "@type": "Article",
        "headline": locale === 'ja'
          ? `${heroName}の評価・カウンター対策・立ち回り解説 - Honor of Kings`
          : `${heroName} Guide: Skills, Counters & Strategy - Honor of Kings`,
        "description": locale === 'ja'
          ? `オナーオブキングス（HoK）の${heroName}の最新Tier評価、スキル解説、カウンター、立ち回りを徹底解説！`
          : `Complete ${heroName} guide for Honor of Kings (HoK): latest tier rating, skill breakdown, counters, and strategy tips.`,
        "url": `${baseUrl}/heroes/${heroSlug}`,
        "image": `https://hok.hub-game.com${hero.image || `/images/heroes/${hero.id}.webp`}`,
        "inLanguage": locale === 'ja' ? 'ja-JP' : 'en-US',
        // 手書きの日付ではなく data_freshness の更新日から機械的に出す。
        // ページ本体（統計・スキル優先度・編成・コンボ）のうち最も新しいもの
        "dateModified": contentDateModified,
        "author": {
          "@type": "Organization",
          "name": "Honor of Kings Hub"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroDetailClient id={id} initialDetails={initialDetails} />
    </>
  );
}
