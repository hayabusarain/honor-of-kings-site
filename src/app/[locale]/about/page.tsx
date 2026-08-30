import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { buildPageMetadata } from '@/lib/buildMetadata';
import dataFreshness from '@/data/data_freshness.json';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/about',
    title: isJa ? "このサイトについて｜データの出どころと確認のしかた" : "About｜Where the Data Comes From",
    description: isJa
      ? "Honor of Kings Hub が掲載しているデータの出どころ、実機で確認している範囲、AIの使い方、できていないことをまとめています。"
      : "Where Honor of Kings Hub's data comes from, what is checked against the game itself, how AI is used, and what this site cannot verify.",
  });
}

/**
 * データの出どころと最終確認日の一覧。
 *
 * 日付は data_freshness.json だけを見る。ここに直書きすると、データを更新したときに
 * このページだけ古い日付が残る。パッチノートとスキルの書き起こしは「いつ時点」という
 * 一点の日付を持たない（パッチごとに随時）ので表には入れず、地の文で説明する。
 */
const SOURCES = [
  { ja: 'Tier・勝率・出現率・BAN率', en: 'Tier, win rate, pick rate, ban rate', official: true, at: dataFreshness.campStats.updatedAt },
  { ja: '最初に上げるスキル', en: 'First skill to level', official: true, at: dataFreshness.skillPriority.updatedAt },
  { ja: '装備', en: 'Items', official: false, at: dataFreshness.staticData.items.updatedAt },
  { ja: 'アルカナ', en: 'Arcana', official: false, at: dataFreshness.staticData.arcana.updatedAt },
  { ja: 'バトルスペル', en: 'Battle spells', official: false, at: dataFreshness.staticData.spells.updatedAt },
  { ja: '基本ステータス', en: 'Base stats', official: false, at: dataFreshness.staticData.baseStats.updatedAt },
  { ja: '人気の装備セット', en: 'Popular item sets', official: false, at: dataFreshness.staticData.itemBuilds.updatedAt },
];

function SourceTable({ isJa }: { isJa: boolean }) {
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="py-2 pr-4 font-bold">{isJa ? 'データ' : 'Data'}</th>
            <th className="py-2 pr-4 font-bold">{isJa ? '出どころ' : 'Source'}</th>
            <th className="py-2 font-bold whitespace-nowrap tabular-nums">{isJa ? '最終確認' : 'Last checked'}</th>
          </tr>
        </thead>
        <tbody>
          {SOURCES.map((s) => (
            <tr key={s.en} className="border-b border-slate-100">
              <td className="py-2 pr-4 font-bold text-slate-700">{isJa ? s.ja : s.en}</td>
              <td className="py-2 pr-4 text-slate-600">
                {s.official
                  ? (isJa ? 'ゲーム内公式「HoK Camp」' : 'The official in-game HoK Camp')
                  : (isJa ? 'ゲーム内表示の書き起こし' : 'Transcribed from the in-game display')}
              </td>
              <td className="py-2 text-slate-600 whitespace-nowrap tabular-nums">{s.at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AboutPage() {
  const locale = useLocale();
  const isJa = locale !== 'en';

  if (!isJa) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-6">About this site</h1>
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section className="space-y-4">
            <p>
              Honor of Kings Hub is an unofficial fan site run by one person. It has no connection to Tencent or Level Infinite.
            </p>
            <p>
              Numbers on a fan site should not be taken on trust. This page sets out where each piece of data comes from,
              how much of it is checked against the game itself, and what this site cannot verify.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Three kinds of content</h2>
            <p>
              <strong className="text-slate-800">Figures published by the game.</strong> Tier, win rate, pick rate, ban rate
              and the first skill to level are pulled from the official in-game HoK Camp. The tier letter is the game&apos;s own
              rating, not a judgement made by this site. The sync is run by hand, so the figures can lag the live game.
            </p>
            <p>
              <strong className="text-slate-800">Text transcribed from the game.</strong> Skill values and descriptions, items,
              arcana, battle spells, base stats and the popular item sets. These are read off the game on a real device and
              checked against screenshots.
            </p>
            <p>
              <strong className="text-slate-800">Commentary written here.</strong> Strategy, difficult matchups and what to do
              about them, who a hero suits, what a patch change means in play, and the arcana builds by role. These rest on the
              numbers above. They are not official recommendations.
            </p>
            <SourceTable isJa={false} />
            <p className="text-sm text-slate-500">
              Patch notes and skill text are not in the table because they have no single date: each patch is transcribed as it
              lands, and a hero page carries a notice while its rewrite is still pending.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">What checking against the game turns up</h2>
            <p>
              On 2026-08-14 the &quot;first skill to level&quot; data was replaced wholesale. It had been taken from the Chinese
              version and disagreed with the Global client for 42 of 116 heroes.
            </p>
            <p>
              On 2026-08-24 and 25, the stat screens of 113 heroes were re-shot. That is when it became clear the game shows
              health regeneration <em>per second</em>, not per five seconds. The values and the label were both wrong and were fixed.
            </p>
            <p>
              On 2026-08-29 the twenty English sub-role labels were compared against the English client and ten were wrong.
              Guardian Tank and Defensive Support had their names swapped. The same day all thirty arcana were checked against
              the game; those matched with no discrepancies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">How AI is used</h2>
            <p>
              AI is used to write code and to organise data, and this site does not hide that. Numbers are a different matter:
              nothing is published straight from a model. Every figure goes through a comparison with the in-game display, and
              each of the corrections above came out of exactly that comparison.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">What is missing</h2>
            <p>
              Annette, Florentino and Lorien cannot be opened in the hero detail screen on the account this site is built from,
              so their sub-role and difficulty are left blank. Leaving a gap is more accurate than filling it with a guess.
            </p>
            <p>
              Statistics are synced manually. Right after a patch there is a lag before the skill text catches up.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Found a mistake?</h2>
            <p>
              Please report it through the{' '}
              <Link href="/contact" className="text-brand-600 font-bold hover:underline">contact page</Link>. It will be checked
              against the game and corrected. Copyright notices and the full disclaimer are on the{' '}
              <Link href="/legal" className="text-brand-600 font-bold hover:underline">legal page</Link>.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
      <h1 className="text-3xl font-black text-slate-800 mb-6">このサイトについて</h1>
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <section className="space-y-4">
          <p>
            Honor of Kings Hub は、個人が運営する非公式のファンサイトです。TencentおよびLevel Infiniteとは関係がありません。
          </p>
          <p>
            攻略サイトの数値は鵜呑みにできません。判断の材料になるよう、どのデータをどこから取っていて、
            どこまで実機で確かめているかをこのページに書いておきます。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">掲載内容は3種類に分かれます</h2>
          <p>
            <strong className="text-slate-800">公式が出している数値。</strong>
            Tier・勝率・出現率・BAN率と、「最初に上げるスキル」。ゲーム内公式の「HoK Camp」から取得しています。
            Tierは公式が付けた評価で、当サイトの判定ではありません。取得は手動なので、常に最新とは限りません。
          </p>
          <p>
            <strong className="text-slate-800">ゲーム内表示の書き起こし。</strong>
            スキルの数値と説明文、装備、アルカナ、バトルスペル、基本ステータス、人気の装備セット。
            実機でゲームを開き、画面を撮影して突き合わせています。
          </p>
          <p>
            <strong className="text-slate-800">当サイトが書いている解説。</strong>
            立ち回り、苦手な相手とその対処、向いている人、パッチの変更が実戦で何を意味するか、ロール別のアルカナ構成。
            根拠は上の2つの数値です。公式のおすすめではありません。
          </p>
          <SourceTable isJa />
          <p className="text-sm text-slate-500">
            パッチノートとスキルの説明文は表に入れていません。「いつ時点」という一点の日付を持たず、パッチごとに順次書き起こすためです。
            書き起こしが済んでいないヒーローのページには、その旨の注記が出ます。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">実機で確かめると何が出てくるか</h2>
          <p>
            2026-08-14、「最初に上げるスキル」を全面的に差し替えました。中国版から取っていたもので、
            グローバル版とは116体中42体で食い違っていました。
          </p>
          <p>
            2026-08-24から25日にかけて、113体のステータス画面を撮り直しています。
            このときHP回復がゲーム内では「1秒ごと」の表記だと分かりました。5秒あたりで書いていた数値もラベルも誤りで、両方を直しています。
          </p>
          <p>
            2026-08-29には、英語版の副ロール表記20種を英語クライアントと突き合わせて、10種の誤りを修正しました。
            守護系サポートと防衛型タンクの英語名がちょうど入れ替わっていた。同じ日にアルカナ30種の効果値も全数照合しています。
            こちらは食い違いがありませんでした。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">AIの使い方</h2>
          <p>
            コードの生成とデータの整理にAIを使っています。隠していません。
            ただし数値は別で、AIの出力をそのまま載せることはしていません。必ずゲーム内表示との照合を通します。
            上に挙げた修正は、どれもその照合で見つかったものです。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">できていないこと</h2>
          <p>
            アネット・フロレンティーノ・ロリアンの3体は、運営者の環境でヒーロー詳細を開けません。
            そのため副ロールと難易度が空欄のままです。分からないものを埋めるより、空けておくほうが正確だと考えています。
          </p>
          <p>
            統計の取得は手動です。パッチ直後は、スキルの書き起こしが追いつくまでに時間差が出ます。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">誤りを見つけたら</h2>
          <p>
            <Link href="/contact" className="text-brand-600 font-bold hover:underline">お問い合わせページ</Link>
            からご報告ください。実機で確認して直します。
            著作権表記と免責事項は<Link href="/legal" className="text-brand-600 font-bold hover:underline">免責事項のページ</Link>にあります。
          </p>
        </section>
      </div>
    </div>
  );
}
