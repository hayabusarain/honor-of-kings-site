import SpellsClient from "@/components/spells/SpellsClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === "ja";
  return {
    title: isJa
      ? "サモナースペル一覧（能力・CD・おすすめヒーロー）| Honor of Kings (HoK) 攻略Hub"
      : "Summoner Spells List (Cooldowns & Guide) | Honor of Kings (HoK) Hub",
    description: isJa
      ? "オナー・オブ・キングス（Honor of Kings）の全サモナースペルの詳細効果、クールダウン（CD）、解放レベル、おすすめロール解説。"
      : "Complete guide to all Summoner Spells in Honor of Kings, including cooldowns, unlock levels, and recommended roles.",
  };
}

export default function SpellsPage() {
  return <SpellsClient />;
}
