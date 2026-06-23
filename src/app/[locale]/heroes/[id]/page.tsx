import { HeroDetailClient } from "@/components/heroes/HeroDetailClient";

export const revalidate = 3600;

export default async function HeroDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  console.log("HeroDetailsPage params:", resolvedParams);
  return <HeroDetailClient id={resolvedParams.id} />;
}
