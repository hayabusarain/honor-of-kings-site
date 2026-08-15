import SpellsClient from "@/components/spells/SpellsClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa
      ? "サモナースペル一覧（能力・CD・おすすめヒーロー）"
      : "Summoner Spells List (Cooldowns & Guide)",
    description: isJa
      ? "オナー・オブ・キングス（Honor of Kings）の全サモナースペルの詳細効果、クールダウン（CD）、解放レベル、おすすめロール解説。"
      : "Complete guide to all Summoner Spells in Honor of Kings, including cooldowns, unlock levels, and recommended roles.",
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
