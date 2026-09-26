import { Fragment } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Link } from "@/i18n/routing";
import { buildPageMetadata } from '@/lib/buildMetadata';
import dataFreshness from '@/data/data_freshness.json';
import { PageFaq } from '@/components/common/PageFaq';

// 夜の配色（2026-09-26）の固定ページ。冒頭は見本（Tier表・ヒーロー一覧）と同じ .page-hero の帯、
// 節は金の縦線の見出し（.section-title）を持つカードにする。影は暗い地で見えないので線で区切る
// 見出しと短い説明は [word-break:auto-phrase]（Chrome は文節で折る。ガイドのページと同じ）。
// 360px で「につい／て」「アク／セス」「ゲ／ーム攻略」など語の途中で折れていた
const CARD = 'space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7';

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
 *
 * 日本語の | は折ってよい位置（表示には出ない。JaPhrases を参照）。
 */
const SOURCES = [
  { ja: 'Tier・|勝率・|出現率・|BAN率', en: 'Tier, win rate, pick rate, ban rate', official: true, at: dataFreshness.campStats.updatedAt },
  { ja: '最初に|上げる|スキル', en: 'First skill to level', official: true, at: dataFreshness.skillPriority.updatedAt },
  { ja: '装備', en: 'Items', official: false, at: dataFreshness.staticData.items.updatedAt },
  { ja: 'アルカナ', en: 'Arcana', official: false, at: dataFreshness.staticData.arcana.updatedAt },
  { ja: 'サモナー|スペル', en: 'Summoner spells', official: false, at: dataFreshness.staticData.spells.updatedAt },
  { ja: '基本|ステータス', en: 'Base stats', official: false, at: dataFreshness.staticData.baseStats.updatedAt },
  { ja: 'おすすめ|ビルド|（装備と|アルカナ）', en: 'Recommended builds (items and arcana)', official: false, at: dataFreshness.staticData.itemBuilds.updatedAt },
];

/**
 * 日本語の表の文字を、| の位置でだけ折る（ヒーロー一覧の SubRoleText と同じ考え方）。
 * 何もしないと 390px で「出／現率」「ス／キル」「アルカ／ナ」と語の途中で折れた。
 * 列の幅は自動に任せると区切り方しだいで揺れ、390px で全行が3行になったりした。出どころの列を
 * 116px（「「HoK Camp」」100.2px＋列の間 12px＋端末のフォントで広がる分の余り）に決め、残りをデータの列に回す。
 * データの列の文字幅は 390px で約114px あり「サモナースペル」（98px）は1行、360px では約84px なので
 * 「サモナー／スペル」で折れる
 */
function JaPhrases({ text }: { text: string }) {
  return (
    <>
      {text.split('|').map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          <span className="whitespace-nowrap">{part}</span>
        </Fragment>
      ))}
    </>
  );
}

function SourceTable({ isJa }: { isJa: boolean }) {
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th scope="col" className="py-2 pr-3 font-bold">{isJa ? 'データ' : 'Data'}</th>
            <th scope="col" className="w-29 py-2 pr-3 font-bold">{isJa ? '出どころ' : 'Source'}</th>
            <th scope="col" className="py-2 font-bold whitespace-nowrap tabular-nums">{isJa ? '最終確認' : 'Last checked'}</th>
          </tr>
        </thead>
        <tbody>
          {SOURCES.map((s) => (
            <tr key={s.en} className="border-b border-slate-100">
              <th scope="row" className="py-2 pr-3 font-bold text-slate-700 text-left">{isJa ? <JaPhrases text={s.ja} /> : s.en}</th>
              <td className="py-2 pr-3 text-slate-600">
                {s.official
                  ? (isJa ? <JaPhrases text="ゲーム内|公式|「HoK Camp」" /> : 'The official in-game HoK Camp')
                  : (isJa ? <JaPhrases text="ゲーム内|表示の|書き起こし" /> : 'Transcribed from the in-game display')}
              </td>
              <td className="py-2 text-slate-600 whitespace-nowrap tabular-nums">{s.at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 静的プリレンダに載せるために必要。これが無いと next-intl の useLocale が
  // リクエスト時解決になり、このページだけ動的レンダリング（ƒ）に落ちる
  setRequestLocale(locale);
  const isJa = locale !== 'en';

  if (!isJa) {
    return (
      <div className="pb-10">
        <div className="page-hero border-b border-slate-200">
          <div className="mx-auto max-w-3xl px-5 pt-6 pb-5 sm:px-7">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">About this site</h1>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 pt-4 text-base leading-relaxed text-slate-700">
          {/* 見出しの無い前置きは、帯の文字と同じ左端で地の上に置く */}
          <section className="space-y-4 px-5 sm:px-7">
            <p>
              Honor of Kings Hub is an unofficial fan site run by one person. It has no connection to Tencent or Level Infinite.
            </p>
            <p>
              Numbers on a fan site should not be taken on trust. This page sets out where each piece of data comes from,
              how much of it is checked against the game itself, and what this site cannot verify.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">Three kinds of content</h2>
            <p>
              <strong className="text-slate-900">Figures published by the game.</strong> Tier, win rate, pick rate, ban rate
              and the first skill to level are pulled from the official in-game HoK Camp. The tier letter is the game&apos;s own
              rating, not a judgement made by this site. The figures are as of the date they were taken and can lag the live game.
            </p>
            <p>
              <strong className="text-slate-900">Text transcribed from the game.</strong> Skill values and descriptions, items,
              arcana, summoner spells, base stats and the popular item sets. Each of these is checked line by line against what
              the game itself displays.
            </p>
            <p>
              <strong className="text-slate-900">Commentary written here.</strong> Strategy, difficult matchups and what to do
              about them, who a hero suits, what a patch change means in play, and the arcana builds by role. These rest on the
              numbers above. They are not official recommendations.
            </p>
            <SourceTable isJa={false} />
            <p className="text-sm text-slate-500">
              Patch notes and skill text are not in the table because they have no single date: each patch is transcribed as it
              lands, and a hero page carries a notice while its rewrite is still pending.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">What checking against the game turns up</h2>
            <p>
              On 2026-08-14 the &quot;first skill to level&quot; data was replaced wholesale. It had been taken from the Chinese
              version and disagreed with the Global client for 42 of 116 heroes.
            </p>
            <p>
              On 2026-08-24 and 25, the stat screens of all 113 heroes were gone through again. That is when it became clear the game shows
              health regeneration <em>per second</em>, not per five seconds. The values and the label were both wrong and were fixed.
            </p>
            <p>
              On 2026-08-29 the twenty English sub-role labels were compared against the English client and ten were wrong.
              Guardian Tank and Defensive Support had their names swapped. The same day all thirty arcana were checked against
              the game; those matched with no discrepancies.
            </p>
            <p>
              On 2026-09-24 the arcana screen turned out to read <em>per five seconds</em> — a different unit from the hero stat screen.
              Dividing by five would line them up, but that figure appears nowhere in the game. The calculator therefore stops adding
              arcana regeneration to a hero&apos;s base value and shows the arcana total on its own.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">How AI is used</h2>
            <p>
              AI is used to write code and to organise data, and this site does not hide that. Numbers are a different matter:
              nothing is published straight from a model. Every figure goes through a comparison with the in-game display, and
              each of the corrections above came out of exactly that comparison.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">What is missing</h2>
            <p>
              Annette, Florentino and Lorien have no sub-role or difficulty listed.
              Leaving a gap is more accurate than filling it with a guess.
            </p>
            <p>
              Right after a patch there is a lag before the skill text catches up.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">Related sites</h2>
            <p>
              The game itself is published by Level Infinite. Patch notes and announcements are posted on the{' '}
              <a
                href="https://www.honorofkings.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 font-bold underline"
              >
                official Honor of Kings site
              </a>
              . Anything on this site that disagrees with the official wording is a mistake here.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">Found a mistake?</h2>
            <p>
              Please report it through the{' '}
              <Link href="/contact" className="text-brand-700 font-bold underline">contact page</Link>. It will be checked
              against the game and corrected. Copyright notices and the full disclaimer are on the{' '}
              <Link href="/legal" className="text-brand-700 font-bold underline">legal page</Link>.
            </p>
          </section>
          <PageFaq page="/about" locale={locale} />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="page-hero border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-5 pt-6 pb-5 sm:px-7">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">このサイトについて</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-4 pt-4 text-base leading-relaxed text-slate-700">
        {/* 見出しの無い前置きは、帯の文字と同じ左端で地の上に置く */}
        <section className="space-y-4 px-5 sm:px-7">
          <p>
            Honor of Kings Hub は、個人が運営する非公式のファンサイトです。TencentおよびLevel Infiniteとは関係がありません。
          </p>
          <p>
            攻略サイトの数値は鵜呑みにできません。判断の材料になるよう、どのデータをどこから取っていて、
            どこまで実機で確かめているかをこのページに書いておきます。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">掲載内容は3種類に分かれます</h2>
          <p>
            <strong className="text-slate-900">公式が出している数値。</strong>
            Tier・勝率・出現率・BAN率と、「最初に上げるスキル」。ゲーム内公式の「HoK Camp」から取得しています。
            Tierは公式が付けた評価で、当サイトの判定ではありません。数値は取得した時点のもので、ゲーム内の最新値とはずれることがあります。
          </p>
          <p>
            <strong className="text-slate-900">ゲーム内表示の書き起こし。</strong>
            スキルの数値と説明文、装備、アルカナ、サモナースペル、基本ステータス、おすすめビルド。
            ゲーム内の表示と1件ずつ突き合わせています。
          </p>
          <p>
            <strong className="text-slate-900">当サイトが書いている解説。</strong>
            立ち回り、苦手な相手とその対処、向いている人、パッチの変更が実戦で何を意味するか、ロール別のアルカナ構成。
            根拠は上の2つの数値です。公式のおすすめではありません。
          </p>
          <SourceTable isJa />
          <p className="text-sm text-slate-500">
            パッチノートとスキルの説明文は表に入れていません。「いつ時点」という一点の日付を持たず、パッチごとに順次書き起こすためです。
            書き起こしが済んでいないヒーローのページには、その旨の注記が出ます。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">実機で確かめると何が出てくるか</h2>
          <p>
            2026-08-14、「最初に上げるスキル」を全面的に差し替えました。中国版から取っていたもので、
            グローバル版とは116体中42体で食い違っていました。
          </p>
          <p>
            2026-08-24から25日にかけて、113体のステータス画面を確認し直しています。
            このときHP回復がゲーム内では「1秒ごと」の表記だと分かりました。5秒あたりで書いていた数値もラベルも誤りで、両方を直しています。
          </p>
          <p>
            2026-08-29には、英語版の副ロール表記20種を英語クライアントと突き合わせて、10種の誤りを修正しました。
            守護系サポートと防衛型タンクの英語名がちょうど入れ替わっていた。同じ日にアルカナ30種の効果値も全数照合しています。
            こちらは食い違いがありませんでした。
          </p>
          <p>
            2026-09-24、アルカナ画面のほうは「5秒ごと」だと分かりました。ヒーローのステータス画面とは単位が違う。
            5で割れば揃いますが、その値はゲームのどこにも出ません。計算機では基礎値に足すのをやめて、アルカナぶんの合計だけを出しています。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">AIの使い方</h2>
          <p>
            コードの生成とデータの整理にAIを使っています。隠していません。
            ただし数値は別で、AIの出力をそのまま載せることはしていません。必ずゲーム内表示との照合を通します。
            上に挙げた修正は、どれもその照合で見つかったものです。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">できていないこと</h2>
          <p>
            アネット・フロレンティーノ・ロリアンの3体は、副ロールと難易度を掲載していません。
            分からないものを埋めるより、空けておくほうが正確だと考えています。
          </p>
          <p>
            パッチ直後は、スキルの書き起こしが追いつくまでに時間差が出ます。
          </p>
        </section>

        {/* 外部リンクが1件も無く、公式との関係を文章でしか示せていなかった。
            姉妹サイトとポータルはフッターに常設してあるので、ここには重ねない */}
        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">関連サイト</h2>
          <p>
            ゲーム本体の運営は Level Infinite です。パッチノートと告知は
            <a
              href="https://www.honorofkings.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 font-bold underline"
            >
              Honor of Kings 公式サイト
            </a>
            に出ます。当サイトの記述が公式の表記と食い違っていたら、こちらの誤りです。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">誤りを見つけたら</h2>
          <p>
            <Link href="/contact" className="text-brand-700 font-bold underline">お問い合わせページ</Link>
            からご報告ください。実機で確認して直します。
            著作権表記と免責事項は<Link href="/legal" className="text-brand-700 font-bold underline">免責事項のページ</Link>にあります。
          </p>
        </section>
        {/* 答えの全文は src/content/faq.ts。置き場の対応は監査の検査23が見ている */}
        <PageFaq page="/about" locale={locale} />
      </div>
    </div>
  );
}
