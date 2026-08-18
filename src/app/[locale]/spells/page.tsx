import SpellsClient, { type SpellUserMap } from "@/components/spells/SpellsClient";
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import hokHeroes from '@/data/hok_heroes.json';
import { normalizeSummonerSpells } from '@/content/summonerSpellNames';
// 1.6MB あるスキルデータはサーバー側だけで読む。逆引きに必要な数項目だけを
// props で渡し、クライアントバンドルには載せない（ヒーロー詳細ページと同じ方針）
import skillsJa from '../../../../public/data/skills/ja.json';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === "ja";
  return buildPageMetadata({
    locale,
    path: '/spells',
    // 看板と実態を一致させる。ページに無いものはタイトルにも説明にも書かない
    title: isJa
      ? "サモナースペル全11種の効果・CD・使いどころ"
      : "All 11 Summoner Spells: Effects, Cooldowns & When to Take Them",
    description: isJa
      ? "オナーオブキングス（Honor of Kings）の全11種のサモナースペルについて、ゲーム内表示どおりの効果とクールダウン・解放レベルに加えて、どんなヒーローがなぜ持つのかを1種ずつ解説しています。"
      : "All 11 Honor of Kings summoner spells with their in-game effects, cooldowns and unlock levels, plus a written breakdown of which heroes take each one and why.",
  });
}

// スペル名 → そのスペルを推奨されるヒーローの逆引きマップ。
// skills/ja.json の meta.summoner_spells は表記が乱れているため
// normalizeSummonerSpells で正式名（hok_spells.json の japanese_name）に寄せる。
// hok_heroes.json を基準に回すことで、並び順と slug・名前の対応も揃える
function buildSpellUsers(): SpellUserMap {
  const skills = skillsJa as Record<string, { meta?: { summoner_spells?: unknown } }>;
  const map: SpellUserMap = {};
  for (const hero of hokHeroes as { id: string; name: string; name_en?: string; slug?: string; image?: string }[]) {
    const spellNames = normalizeSummonerSpells(skills[hero.id]?.meta?.summoner_spells);
    for (const spellName of spellNames) {
      if (!map[spellName]) map[spellName] = [];
      map[spellName].push({
        id: hero.id,
        name: hero.name,
        name_en: hero.name_en || hero.name,
        slug: hero.slug || hero.id,
        image: hero.image || `/images/heroes/${hero.id}.webp`,
      });
    }
  }
  return map;
}

export default async function SpellsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const spellUsers = buildSpellUsers();
  return (
    <>
      <BreadcrumbJsonLd locale={locale} trail={[{ name: locale === 'ja' ? 'サモナースペル' : 'Summoner Spells', path: '/spells' }]} />
      <SpellsClient spellUsers={spellUsers} />
    </>
  );
}
