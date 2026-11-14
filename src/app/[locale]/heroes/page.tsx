import { HeroesListClient } from '@/components/heroes/HeroesListClient';
import { getLatestPatchChanges } from '@/lib/patchBadges';
import { PageFaq } from '@/components/common/PageFaq';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { COMPOUND_ROLE_LABELS, normalizeSubRole } from '@/content/subRoleNames';
// 難易度と戦い方タイプはスキルデータから hero_id → ラベルの小さなマップだけを
// ここ（サーバー側）で作って渡す。skills/ja.json は1.6MBあるため、
// クライアントコンポーネントから import してはいけない（バンドルに丸ごと載る）
import skillsJa from '@/data/skills/ja.json';
import hokHeroes from '@/data/hok_heroes.json';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/heroes',
    // 日本語の検索は「キャラ一覧」「ヒーロー一覧」の両方が出る（2026-10-04 の Google の検索候補）。英語も characters と heroes の両方。
    // 英語は Search Console（10/14〜11/10）で "hok heroes" "honor of kings characters" "hok characters" "honor of kings heroes" が上位なので、
    // ゲーム名を頭に置く（2026-11-14。以前は "All 120 Heroes & Characters by Role and Tier" でゲーム名が無く、表示4,620・クリック44だった）
    title: isJa ? `キャラ一覧（全${hokHeroes.length}体）｜ヒーローのTierと勝率` : `Honor of Kings Heroes & Characters List (HoK) - All ${hokHeroes.length} by Role and Tier`,
    description: isJa ? `Honor of Kings（オナーオブキングス・HoK）のキャラ（ヒーロー）全${hokHeroes.length}体の一覧。ロール・レーン・難易度で絞り込め、公式統計のTierと勝率も並べて見られます。` : `Browse all ${hokHeroes.length} Honor of Kings (HoK) heroes by role, with tier ratings and win rates at a glance.`,
    searchPrefix: true,
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
    <>
      <HeroesListClient
        locale={locale}
        patchChanges={patchChanges}
        difficultyById={difficultyById}
        subRoleById={subRoleById}
      />
      {/* 答えの全文は src/content/faq.ts。置き場の対応は監査の検査23が見ている */}
      <div className="px-4 pb-8">
        <PageFaq page="/heroes" locale={locale} className="mt-6" />
      </div>
    </>
  );
}
