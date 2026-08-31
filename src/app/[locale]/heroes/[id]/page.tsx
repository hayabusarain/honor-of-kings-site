import { HeroDetailClient } from "@/components/heroes/HeroDetailClient";
import hokHeroes from "@/data/hok_heroes.json";
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { HokHero } from '@/types/database';
import { parseHeroSkills } from '@/lib/parseHeroSkills';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { getHeroPageText } from '@/lib/heroPageTitle';
import dataFreshness from '@/data/data_freshness.json';
import { getHeroItemBuilds, hasHeroItemBuilds } from '@/lib/heroItemBuilds';
import { getPatchesForHero } from '@/lib/patchData';
import { contentUpdatedAt, HERO_PAGE_PUBLISHED } from '@/lib/contentDates';
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
  const { title, description } = getHeroPageText(locale, heroName, hasHeroItemBuilds(String(hero?.id ?? id)));

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
    // ヒーロー画像は 128x128 しか無い。summary_large_image は最小 300x157、
    // Facebook は 200x200 未満だと画像を出さないため、共通の 1200x630 に任せる
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

  // ゲーム内の公式4軸評価（生存/攻撃/スキル/操作難度、各1〜10）と難易度表記は
  // ja.json だけが持っている（en.json に stats / difficulty フィールドは無い）。
  // 数値とゲーム内の固定4区分なので言語に依存せず、両ロケールとも ja 側から取り、
  // 英語ラベルへの写しは表示側（HeroDetailClient）で行う
  const rawSkillsJa = (skillsJa as Record<string, any>)[hero.id];
  // 各軸は「1〜10 の有限整数」だけを採用し、それ以外は null（未確認）にする。
  // ja.json には difficulty に文字列（'ハード' 等）が入っている行や、skill / attack が
  // 0 の行がある（書き起こし漏れの疑い）。Number() でそのまま通すと NaN や 0 の
  // バーが出てしまっていた。データ側はゲーム内で確認するまで触らない
  const toRating = (v: unknown): number | null => {
    const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
    return Number.isInteger(n) && n >= 1 && n <= 10 ? n : null;
  };
  const officialRatings = rawSkillsJa?.stats
    ? {
        survival: toRating(rawSkillsJa.stats.survival),
        attack: toRating(rawSkillsJa.stats.attack),
        skill: toRating(rawSkillsJa.stats.skill),
        difficulty: toRating(rawSkillsJa.stats.difficulty),
      }
    : null;
  const officialDifficulty =
    typeof rawSkillsJa?.difficulty === 'string' && rawSkillsJa.difficulty
      ? (rawSkillsJa.difficulty as string)
      : null;

  // <title>・JSON-LD・共有ボタンの文言は heroPageTitle.ts から1本で引く
  const pageText = getHeroPageText(locale, heroName, hasHeroItemBuilds(String(hero?.id ?? id)));

  // 注意: URL は locale プレフィックス付きの正規URL（canonical と一致）を使う。
  // headline に「Build」は入れない（ビルドセクション非表示中のため）
  // 掲載データの更新日のうち最新のものを、記事の dateModified として使う。
  // 求め方は src/lib/contentDates.ts に1本化した。以前はここで独自に4キーを
  // 並べていて、sitemap.ts の式とキー集合がずれていた（ここは site.lastUpdated を
  // 落としており、本文の校正だけを直した日は日付が動かなかった）
  const contentDateModified = contentUpdatedAt();

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
        // Article の image は 50,000px² 以上が要件。ヒーロー画像(128x128)では足りないため共通OG画像を使う
        "image": 'https://hok.hub-game.com/images/og-image.jpg',
        "inLanguage": locale === 'ja' ? 'ja-JP' : 'en-US',
        // datePublished と dateModified はどちらも src/lib/contentDates.ts から出す
        "datePublished": HERO_PAGE_PUBLISHED,
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
        id={id}
        initialDetails={initialDetails}
        officialRatings={officialRatings}
        officialDifficulty={officialDifficulty}
        shareTitle={pageText.title}
        itemBuilds={getHeroItemBuilds(String(hero?.id ?? id), locale)}
        heroPatches={getPatchesForHero(String(hero.id))}
      />
    </>
  );
}
