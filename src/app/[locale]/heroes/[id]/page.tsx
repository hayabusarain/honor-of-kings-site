import { HeroDetailClient } from "@/components/heroes/HeroDetailClient";
import { SITE_ORIGIN } from '@/lib/basePath';
import hokHeroes from "@/data/hok_heroes.json";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { HokHero } from '@/types/database';
import { parseHeroSkills } from '@/lib/parseHeroSkills';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { getHeroPageText, hasHeroTier } from '@/lib/heroPageTitle';
import { getHeroItemBuilds, hasHeroItemBuilds } from '@/lib/heroItemBuilds';
import { getPatchesForHero } from '@/lib/patchData';
import { heroPublishedAt, heroUpdatedAt } from '@/lib/contentDates';
import { getHeroDetailData } from '@/lib/heroDetailData';
// スキル解説をサーバー側で読み込み初期HTMLに含める（AdSense/SEO対策）。
// クライアント fetch 任せだとクローラには本文の無いページに見えてしまう
import skillsJa from '@/data/skills/ja.json';
import skillsEn from '@/data/skills/en.json';

// generateStaticParams に無いIDは、ページ本体を実行せずに404へ落とす。
// これが無いと未知のIDでエラーシェル（可視テキスト57文字）が返る。
// 数値ID は next.config.ts の redirects() が116体ぶん308で slug へ送り、
// リダイレクトはルーティングより先に走るのでここでは塞がれない
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];

  // slug のみ生成する。以前は数値IDとslugの両方を積んでいて、同一内容の
  // ページが464枚（116体×2表記×2言語）ビルドされていた。旧ID URLは
  // next.config.ts の redirects() が301でslugへ送る。ページ本体の find は
  // id / slug 両対応のまま残してあり、リダイレクトが効かない環境でも壊れない
  for (const locale of routing.locales) {
    for (const hero of hokHeroes as HokHero[]) {
      params.push({ locale, id: hero.slug || hero.id });
    }
  }

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  const hero = (hokHeroes as HokHero[]).find(h => h.id === id || h.slug === id);
  const heroName = locale === 'ja' ? (hero?.name || id) : (hero?.name_en || hero?.name || id);
  // 文言は heroPageTitle.ts に1本化してある（JSON-LD・共有ボタンと同じ出所）。
  // 「ビルド」を約束しない理由などもそちらのコメントを参照
  const heroId = String(hero?.id ?? id);
  const { title, description } = getHeroPageText(locale, heroName, hasHeroItemBuilds(heroId), hasHeroTier(heroId));

  const heroSlug = hero?.slug || id;

  // 以前は openGraph を title/description/images だけで丸ごと上書きしており、
  // siteName / locale / url が消えていた。共通ヘルパーで揃える
  return buildPageMetadata({
    locale,
    path: `/heroes/${heroSlug}`,
    title,
    description,
    ogType: 'article',
    // 接尾辞「 | Honor of Kings Hub」を付けない。日本語で61→40文字、英語で
    // 93→68文字に収まり、キーワードは1語も減らない。英語では
    // 「Honor of Kings」の3回目の繰り返しが消えるだけ。
    // 文言そのものは縮めない。何を入れるかは heroPageTitle.ts に理由がある
    absoluteTitle: true,
    // images は渡さない。同じフォルダの opengraph-image.tsx（1200x630）が
    // ヒーローごとの og:image になる。ここで渡すとそちらが上書きされる
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
  const baseUrl = `${SITE_ORIGIN}/${locale}`;

  // スキル・戦略解説をサーバー側で解決し、初期HTMLに本文を含める
  const skillsData = (locale === 'ja' ? skillsJa : skillsEn) as Record<string, any>;
  const rawSkills = skillsData[hero.id];
  const initialDetails = rawSkills ? parseHeroSkills(rawSkills, hero.id, locale) : null;

  // ゲーム内の難易度表記（イージー/ノーマル/ハード/ベリーハード）は ja.json だけが持つ。
  // ゲーム内の固定4区分なので言語に依存せず、両ロケールとも ja 側から取り、
  // 英語ラベルへの写しは表示側（HeroDetailClient）で行う。
  //
  // かつてここで skills/ja.json の stats（生存/攻撃/スキル/操作難度、各1〜10）を
  // 「公式の能力評価」として渡していたが、2026-09-07 に表示ごと廃止した。
  // 出所を追うと初回コミット（2026-06-22）から入ったまま94体が一度も更新されておらず、
  // 取得手順の記録がどこにも無く、公式 HoK Camp の API にも存在しない。
  // 8体は skill か attack が 0（実機では起こりえない）、19体は stats ごと欠落と、
  // 116体中30体が壊れた状態でもあった。裏の取れないものを「公式」と称して
  // 出し続けるより消すという判断（運営者の指示）。データ自体は skills/ja.json に残っている。
  const rawSkillsJa = (skillsJa as Record<string, any>)[hero.id];
  const officialDifficulty =
    typeof rawSkillsJa?.difficulty === 'string' && rawSkillsJa.difficulty
      ? (rawSkillsJa.difficulty as string)
      : null;

  // <title>・JSON-LD・共有ボタンの文言は heroPageTitle.ts から1本で引く
  const pageText = getHeroPageText(
    locale,
    heroName,
    hasHeroItemBuilds(String(hero?.id ?? id)),
    hasHeroTier(String(hero?.id ?? id)),
  );

  // 注意: URL は locale プレフィックス付きの正規URL（canonical と一致）を使う。
  // headline に「Build」は入れない（ビルドセクション非表示中のため）
  // 記事の dateModified は sitemap の lastmod と同じ heroUpdatedAt（そのヒーローのページに
  // 載るデータの日付）。以前は contentUpdatedAt() で、site.lastUpdated を含むため
  // プッシュのたびに全ヒーローが当日になり、sitemap の lastmod とも食い違っていた
  const heroIdForDates = String(hero?.id ?? id);
  const contentDateModified = heroUpdatedAt(heroIdForDates);

  // ヒーロー1体ぶんの基礎値・統計と、相性・編成・同レーンに出る他のヒーローの名前と画像。
  // HeroDetailClient が全ヒーロー分の JSON を import していたのを、ここで必要な分だけにした
  const detailData = getHeroDetailData(hero, locale, initialDetails?.meta);

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
        "headline": pageText.headline,
        "description": pageText.description,
        "url": `${baseUrl}/heroes/${heroSlug}`,
        // og:image と同じ絵を指す。同じフォルダの opengraph-image.tsx がビルド時に焼く
        // 1200x630 で、Article の image の要件（50,000px² 以上）を満たす。
        // ヒーロー画像（128x128）では足りないので使わない
        "image": `${SITE_ORIGIN}/${locale}/heroes/${heroSlug}/opengraph-image`,
        "inLanguage": locale === 'ja' ? 'ja-JP' : 'en-US',
        // datePublished と dateModified はどちらも src/lib/contentDates.ts から出す
        "datePublished": heroPublishedAt(heroIdForDates),
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
      <HeroDetailClient
        {...detailData}
        initialDetails={initialDetails}
        officialDifficulty={officialDifficulty}
        shareTitle={pageText.title}
        itemBuilds={getHeroItemBuilds(String(hero?.id ?? id), locale)}
        heroPatches={getPatchesForHero(String(hero.id))}
      />
    </>
  );
}
