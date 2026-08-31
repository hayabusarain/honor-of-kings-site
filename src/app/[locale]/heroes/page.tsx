import { HeroesListClient } from '@/components/heroes/HeroesListClient';
import { getLatestPatchChanges } from '@/lib/patchBadges';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { COMPOUND_ROLE_LABELS, normalizeSubRole } from '@/content/subRoleNames';
// 難易度と戦い方タイプはスキルデータから hero_id → ラベルの小さなマップだけを
// ここ（サーバー側）で作って渡す。skills/ja.json は1.6MBあるため、
// クライアントコンポーネントから import してはいけない（バンドルに丸ごと載る）
import skillsJa from '@/data/skills/ja.json';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/heroes',
    title: isJa ? "全ヒーロー一覧（ロール別・Tier付き）" : "All Heroes List by Role & Tier",
    description: isJa ? "オナーオブキングス（HoK）の全116ヒーローをロール別に一覧掲載。Tier・勝率データ付きで最強ヒーローがすぐ分かる！" : "Browse all 116 Honor of Kings (HoK) heroes by role, with tier ratings and win rates at a glance.",
  });
}

interface SkillEntry {
  difficulty?: string;
  sub_role?: string;
}

export default async function HeroesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // patches.json（156KB）もサーバー側で読み、導出結果の小さなオブジェクトだけを渡す
  const patchChanges = getLatestPatchChanges();

  const difficultyById: Record<string, string> = {};
  const subRoleById: Record<string, string> = {};
  for (const [heroId, entry] of Object.entries(skillsJa as Record<string, SkillEntry>)) {
    // difficulty / sub_role とも公式表記のあるヒーローのみ。無いヒーローはキー自体を作らず、
    // 表示側は「値が無ければ出さない」だけで済むようにする
    if (entry.difficulty) difficultyById[heroId] = entry.difficulty;
    if (entry.sub_role) {
      const subRole = normalizeSubRole(entry.sub_role);
      // 「アサシン/ファイター」等の複合ロール名は戦い方タイプではないので、
      // タイプ絞り込みの選択肢に混ざらないようキーを作らない
      if (!COMPOUND_ROLE_LABELS.has(subRole)) subRoleById[heroId] = subRole;
    }
  }

  return (
    <HeroesListClient
      locale={locale}
      patchChanges={patchChanges}
      difficultyById={difficultyById}
      subRoleById={subRoleById}
    />
  );
}
