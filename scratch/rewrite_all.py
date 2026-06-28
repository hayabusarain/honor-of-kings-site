import os
import re

def rewrite_all():
    # 1. Update HomeClient.tsx
    with open('src/components/home/HomeClient.tsx', 'r', encoding='utf-8') as f:
        home_content = f.read()
    
    if 'getHeroSlug' not in home_content:
        home_content = home_content.replace('export function HomeClient',
'''import HOK_HEROES from "@/data/hok_heroes.json";
const getHeroSlug = (id: string) => {
  const hero = (HOK_HEROES as any[]).find((h: any) => h.id === id);
  return hero?.slug || id;
};

export function HomeClient''')
    
    home_content = re.sub(
        r'href=\{`/heroes/\$\{pick\.hero_id\}`\}',
        r'href={`/heroes/${getHeroSlug(pick.hero_id)}`}',
        home_content
    )
    with open('src/components/home/HomeClient.tsx', 'w', encoding='utf-8') as f:
        f.write(home_content)


    # 2. Update HeroDetailClient.tsx
    with open('src/components/heroes/HeroDetailClient.tsx', 'r', encoding='utf-8') as f:
        detail_content = f.read()

    if 'const getHeroSlug' not in detail_content:
        detail_content = detail_content.replace('export function HeroDetailClient',
'''const getHeroSlug = (id: string) => {
  const h = hokHeroes.find((x: any) => x.id === id);
  return (h as any)?.slug || id;
};

export function HeroDetailClient''')

    detail_content = re.sub(
        r'href=\{`/heroes/\$\{syn\.hero_id\}` as any\}',
        r'href={`/heroes/${getHeroSlug(syn.hero_id)}` as any}',
        detail_content
    )
    detail_content = re.sub(
        r'href=\{`/heroes/\$\{cnt\.hero_id\}` as any\}',
        r'href={`/heroes/${getHeroSlug(cnt.hero_id)}` as any}',
        detail_content
    )
    with open('src/components/heroes/HeroDetailClient.tsx', 'w', encoding='utf-8') as f:
        f.write(detail_content)


    # 3. Update TierListClient.tsx
    with open('src/components/tier-list/TierListClient.tsx', 'r', encoding='utf-8') as f:
        tier_content = f.read()

    if 'HOK_HEROES' not in tier_content:
        tier_content = tier_content.replace("import Image from 'next/image';", "import Image from 'next/image';\nimport HOK_HEROES from \"@/data/hok_heroes.json\";")
    
    if 'getHeroSlug' not in tier_content:
        tier_content = tier_content.replace('export function TierListClient',
'''const getHeroSlug = (id: string) => {
  const hero = (HOK_HEROES as any[]).find((h: any) => h.id === id);
  return hero?.slug || id;
};

export function TierListClient''')

    tier_content = re.sub(
        r'href=\{`/heroes/\$\{hero\.id\}`\}',
        r'href={`/heroes/${getHeroSlug(String(hero.id))}`}',
        tier_content
    )
    with open('src/components/tier-list/TierListClient.tsx', 'w', encoding='utf-8') as f:
        f.write(tier_content)

rewrite_all()
