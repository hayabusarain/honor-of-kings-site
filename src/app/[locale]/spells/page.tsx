import SpellsClient from "@/components/spells/SpellsClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    // 看板と実態を一致させる。ページに無いものはタイトルにも説明にも書かない
    title: isJa
      ? "サモナースペル全11種の効果・CD・使いどころ"
      : "All 11 Summoner Spells: Effects, Cooldowns & When to Take Them",
    description: isJa
      ? "オナーオブキングス（Honor of Kings）の全11種のサモナースペルについて、ゲーム内表示どおりの効果とクールダウン・解放レベルに加えて、どんなヒーローがなぜ持つのかを1種ずつ解説しています。"
      : "All 11 Honor of Kings summoner spells with their in-game effects, cooldowns and unlock levels, plus a written breakdown of which heroes take each one and why.",
    // alternates は親レイアウトから継承される。ここで指定しないと canonical が
    // トップページ（/ja）のままになり、このページが自らインデックスを外してしまう
    alternates: {
      canonical: `/${locale}/spells`,
      languages: {
        'ja': '/ja/spells',
        'en': '/en/spells',
        'x-default': '/en/spells',
      },
    },
  };
}

export default function SpellsPage() {
  return <SpellsClient />;
}
