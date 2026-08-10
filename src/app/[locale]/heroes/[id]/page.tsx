import { HeroDetailClient } from "@/components/heroes/HeroDetailClient";
import hokHeroes from "@/data/hok_heroes.json";
import { routing } from '@/i18n/routing';
import { HokHero } from '@/types/database';
import { parseHeroSkills } from '@/lib/parseHeroSkills';
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
  const title = locale === 'ja'
    ? `【オナーオブキングス】${heroName}の評価とスキル・立ち回り解説`
    : `${heroName} Guide: Skills, Counters & Strategy - Honor of Kings (HoK)`;
  const description = locale === 'ja'
    ? `オナーオブキングス（HoK）の${heroName}の最新Tier評価、スキル解説、カウンター、立ち回りを徹底解説！`
    : `Complete ${heroName} guide for Honor of Kings (HoK): latest tier rating, skill breakdown, counters, and strategy tips.`;

  const heroSlug = hero?.slug || id;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/heroes/${heroSlug}`,
      languages: {
        'ja': `/ja/heroes/${heroSlug}`,
        'en': `/en/heroes/${heroSlug}`,
        'x-default': `/en/heroes/${heroSlug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [hero?.image || `/images/heroes/${id}.jpg`],
    }
  };
}

export default async function HeroDetailsPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const resolvedParams = await params;
  const { id, locale } = resolvedParams;

  const hero = (hokHeroes as HokHero[]).find(h => h.id === id || h.slug === id);
  const heroName = locale === 'ja' ? (hero?.name || id) : (hero?.name_en || hero?.name || id);
  const heroSlug = hero?.slug || id;
  const baseUrl = `https://hok.hub-game.com/${locale}`;

  // スキル・戦略解説をサーバー側で解決し、初期HTMLに本文を含める
  const skillsData = (locale === 'ja' ? skillsJa : skillsEn) as Record<string, any>;
  const rawSkills = hero ? skillsData[hero.id] : undefined;
  const initialDetails = rawSkills ? parseHeroSkills(rawSkills, hero!.id, locale) : null;

  // 注意: URL は locale プレフィックス付きの正規URL（canonical と一致）を使う。
  // headline に「Build」は入れない（ビルドセクション非表示中のため）
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
          ? `${heroName}の評価とスキル・立ち回り解説 - Honor of Kings`
          : `${heroName} Guide: Skills, Counters & Strategy - Honor of Kings`,
        "url": `${baseUrl}/heroes/${heroSlug}`,
        "image": `https://hok.hub-game.com${hero?.image || `/images/heroes/${hero?.id}.jpg`}`,
        "inLanguage": locale === 'ja' ? 'ja-JP' : 'en-US',
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
