import { HeroDetailClient } from "@/components/heroes/HeroDetailClient";
import hokHeroes from "@/data/hok_heroes.json";
import { routing } from '@/i18n/routing';

export const revalidate = 3600;

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  
  for (const locale of routing.locales) {
    for (const hero of hokHeroes) {
      params.push({ locale, id: hero.id });
      if ((hero as any).slug) {
        params.push({ locale, id: (hero as any).slug });
      }
    }
  }
  
  return params;
}

export default async function HeroDetailsPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const hero = hokHeroes.find(h => h.id === id || (h as any).slug === id);
  const heroName = hero?.name_en || hero?.name || id;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://hok.hub-game.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Heroes",
            "item": "https://hok.hub-game.com/heroes"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": heroName,
            "item": `https://hok.hub-game.com/heroes/${id}`
          }
        ]
      },
      {
        "@type": "Article",
        "headline": `${heroName} Build, Tier, and Patch Notes - Honor of Kings`,
        "url": `https://hok.hub-game.com/heroes/${id}`,
        "image": `https://hok.hub-game.com/images/heroes/${hero?.id}.jpg`,
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
      <HeroDetailClient id={id} />
    </>
  );
}
