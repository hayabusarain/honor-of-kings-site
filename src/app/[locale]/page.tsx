import { HomeClient } from "@/components/home/HomeClient";

export const revalidate = 3600;

export default function Home() {
  return <HomeClient />;
}
