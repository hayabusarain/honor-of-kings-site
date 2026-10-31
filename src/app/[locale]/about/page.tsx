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
    title: isJa ? "このサイトについて｜データの出どころ" : "About｜Where the Data Comes From",
    description: isJa
      ? "Honor of Kings Hub が掲載しているデータの出どころと最終確認日、運営者と掲載方針について。"
      : "Where Honor of Kings Hub's data comes from, when it was last checked, who runs the site, and its editorial policy.",
  });
}

/**
 * データの出どころと最終確認日の一覧。
 *
 * 日付は data_freshness.json だけを見る。ここに直書きすると、データを更新したときに
 * このページだけ古い日付が残る。パッチノートとスキルの説明文は「いつ時点」という
 * 一点の日付を持たない（パッチごとに随時）ので表には入れず、地の文で説明する。
 *
 * 載せるのは読者と権利者に必要な表記だけ。確認の経緯（過去の修正の記録）・AI の利用・
 * 未掲載の項目は、読者の判断に使われないので 2026-10-28 に外した（運営者の指示。MLBB と同じ基準）
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
                  : (isJa ? <JaPhrases text="ゲーム内の|表示" /> : 'The in-game display')}
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
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">Three kinds of content</h2>
            <p>
              <strong className="text-slate-900">Figures published by the game.</strong> Tier, win rate, pick rate, ban rate
              and the first skill to level are pulled from the official in-game HoK Camp. The tier letter is the game&apos;s own
              rating, not a judgement made by this site. The figures are as of the date they were taken and can lag the live game.
            </p>
            <p>
              <strong className="text-slate-900">Taken from the in-game display.</strong> Skill values and descriptions, items,
              arcana, summoner spells, base stats and the popular item sets. All of these follow what the game itself shows.
            </p>
            <p>
              <strong className="text-slate-900">Commentary written here.</strong> Strategy, difficult matchups and what to do
              about them, who a hero suits, what a patch change means in play, and the arcana builds by role. These rest on the
              numbers above. They are not official recommendations.
            </p>
            <SourceTable isJa={false} />
            <p className="text-sm text-slate-500">
              Patch notes and skill text are updated with each patch. A hero page shows a notice while its update is still pending.
            </p>
          </section>

          {/* 運営者と掲載方針の文は MLBB（Mobare Hub）と同じ（2026-10-31 の案D）。片方だけ直さない */}
          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">Operator</h2>
            <p>
              <a href="https://hub-game.com/" className="text-brand-700 font-bold underline">HUB-GAME</a> (https://hub-game.com/) is run by one person.
              Contact: <a href="mailto:contact@hub-game.com" className="text-brand-700 font-bold underline">contact@hub-game.com</a> or X (
              <a href="https://x.com/hub_gamecom" target="_blank" rel="noopener noreferrer" className="text-brand-700 font-bold underline">@hub_gamecom</a>).
              The same operator publishes Honor of Kings Hub for Honor of Kings and Mobare Hub for Mobile Legends on hub-game.com.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">Editorial policy</h2>
            <p>
              Official numbers are copied exactly, with the same digits and units. Explanations of what those numbers do
              are written by this site, not copied from official text. Patches make data go stale, so numbers carry the
              date they were collected. Anything we have not verified is marked &quot;unverified&quot; instead of being guessed.
              If you spot an error, please tell us through the{' '}
              <Link href="/contact" className="text-brand-700 font-bold underline">contact page</Link>.
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
              Copyright notices and the full disclaimer are on the{' '}
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
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">掲載内容は3種類に分かれます</h2>
          <p>
            <strong className="text-slate-900">公式が出している数値。</strong>
            Tier・勝率・出現率・BAN率と、「最初に上げるスキル」。ゲーム内公式の「HoK Camp」から取得しています。Tierは公式が付けた評価で、当サイトの判定ではありません。数値は取得した時点のもので、ゲーム内の最新値とはずれることがあります。
          </p>
          <p>
            <strong className="text-slate-900">ゲーム内の表示から取ったもの。</strong>
            スキルの数値と説明文、装備、アルカナ、サモナースペル、基本ステータス、おすすめビルド。いずれもゲーム内の表示に合わせています。
          </p>
          <p>
            <strong className="text-slate-900">当サイトが書いている解説。</strong>
            立ち回り、苦手な相手とその対処、向いている人、パッチの変更が実戦で何を意味するか、ロール別のアルカナ構成。根拠は上の2つの数値です。公式のおすすめではありません。
          </p>
          <SourceTable isJa />
          <p className="text-sm text-slate-500">
            パッチノートとスキルの説明文は、パッチごとに更新しています。反映が済んでいないヒーローのページには、その旨の注記が出ます。
          </p>
        </section>

        {/* 運営者と掲載方針の文は MLBB（Mobare Hub）と同じ（2026-10-31 の案D）。片方だけ直さない。
            プレイ歴などの体験は、運営者に確かめるまで書かない */}
        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">運営者</h2>
          <p>
            <a href="https://hub-game.com/" className="text-brand-700 font-bold underline">HUB-GAME</a>（https://hub-game.com/）は個人で運営しています。連絡先はメール（
            <a href="mailto:contact@hub-game.com" className="text-brand-700 font-bold underline">contact@hub-game.com</a>）と X（
            <a href="https://x.com/hub_gamecom" target="_blank" rel="noopener noreferrer" className="text-brand-700 font-bold underline">@hub_gamecom</a>）。同じ運営者が hub-game.com で、オナー・オブ・キングスの「Honor of Kings Hub」とモバイル・レジェンドの「Mobare Hub」を公開しています。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">掲載方針</h2>
          <p>
            公式が出している数値は、桁も単位も変えずに転記します。数値が何に効くかの解説は、公式の文章を写さずに当サイトが書いたものです。パッチで古くなるので、数値には取得日を添えています。確かめていないことは「未確認」と書き、推測では埋めません。誤りに気づいたら、
            <Link href="/contact" className="text-brand-700 font-bold underline">お問い合わせ</Link>
            からお知らせください。
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
            著作権表記と免責事項は<Link href="/legal" className="text-brand-700 font-bold underline">免責事項のページ</Link>にあります。
          </p>
        </section>

        {/* 答えの全文は src/content/faq.ts。置き場の対応は監査の検査23が見ている */}
        <PageFaq page="/about" locale={locale} />
      </div>
    </div>
  );
}
