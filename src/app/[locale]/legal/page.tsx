import { setRequestLocale } from 'next-intl/server';
import { Link } from "@/i18n/routing";
import { buildPageMetadata } from '@/lib/buildMetadata';

// 夜の配色（2026-09-26）の固定ページ。冒頭は見本（Tier表・ヒーロー一覧）と同じ .page-hero の帯、
// 節は金の縦線の見出し（.section-title）を持つカードにする。影は暗い地で見えないので線で区切る
// 見出しと短い説明は [word-break:auto-phrase]（Chrome は文節で折る。ガイドのページと同じ）。
// 360px で「につい／て」「アク／セス」「ゲ／ーム攻略」など語の途中で折れていた
const CARD = 'rounded-2xl border border-slate-200 bg-white p-5 sm:p-7';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/legal',
    title: isJa ? "著作権・免責事項" : "Legal & Disclaimer",
    description: isJa
      ? "Honor of Kings Hub の著作権表記、非公式である旨、掲載画像の扱い、情報の正確性、削除・訂正のご依頼。"
      : "Copyright notices, unofficial status, how official images are handled, accuracy, and takedown or correction requests for Honor of Kings Hub.",
  });
}

/**
 * 権利表記と免責。
 *
 * 載せるのは読者と権利者に必要な表記だけ。AI の利用の開示は、読者の判断に使われないので
 * 2026-10-28 に外した（運営者の指示。MLBB と同じ基準）。代わりに、掲載している公式画像の範囲と
 * 削除・訂正の窓口を足した。Tencent と Level Infinite の表記は監査（広告と法務）が必須にしている
 */
export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 静的プリレンダに載せるために必要。これが無いと next-intl の useLocale が
  // リクエスト時解決になり、このページだけ動的レンダリング（ƒ）に落ちる
  setRequestLocale(locale);
  // TODO: Move these hardcoded strings to messages/*.json and use useTranslations

  if (locale === 'en') {
    return (
      <div className="pb-10">
        <div className="page-hero border-b border-slate-200">
          <div className="mx-auto max-w-3xl px-5 pt-6 pb-5 sm:px-7">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Legal Disclaimer</h1>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 pt-4 text-base leading-relaxed text-slate-700">
          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase] mb-3">Intellectual Property</h2>
            <p>
              This website is a non-official fan site run by an individual.
              The copyright and intellectual property rights in the in-game images, icons, text and data used on this site belong to Tencent Inc. and the other rights holders.
            </p>
            <p className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500 italic">
              Honor of Kings Hub isn&apos;t endorsed by Tencent or Level Infinite and doesn&apos;t reflect the views or opinions of Tencent, Level Infinite, or anyone officially involved in producing or managing Honor of Kings properties. Honor of Kings, and all associated properties are trademarks or registered trademarks of Tencent Inc.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase] mb-3">Official images used here</h2>
            <p>
              The only official images shown here are icons for heroes, skills, items, arcana and summoner spells. No full-size art is published. If a rights holder asks for an image to be taken down, it will be removed promptly.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase] mb-3">Accuracy of Information</h2>
            <p>
              The figures here are checked, but they are not guaranteed. Values and mechanics change with each patch, and the numbers on a page are as of the date shown on it. We accept no liability for any loss arising from use of the information published here.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase] mb-3">Takedown and correction requests</h2>
            <p>
              Rights holders, and anyone who has spotted a mistake, can reach us through the{' '}
              <Link href="/contact" className="text-brand-700 font-bold underline">contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="page-hero border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-5 pt-6 pb-5 sm:px-7">
          {/* 390px で「（Legal／Disclaimer）」と括弧の中で折れたので、括弧の前でだけ折る */}
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            免責事項<wbr />
            <span className="whitespace-nowrap">（Legal Disclaimer）</span>
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-4 pt-4 text-base leading-relaxed text-slate-700">
        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">著作権・知的財産権について</h2>
          <p>
            当サイトは個人が運営する非公式のファンサイトであり、Tencent社およびLevel Infiniteとは一切関係ありません。当サイト内で使用されているゲーム内の画像、アイコン、テキスト、データ等の著作権・知的財産権は、すべて Tencent Inc. およびその他の権利者に帰属します。
          </p>
          <p className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500 italic">
            当サイトはTencentまたはLevel Infiniteの承認を得たものではなく、Tencent、Level Infinite、またはHonor of Kingsのプロパティの制作・管理に公式に関与している人物の意見や見解を反映するものではありません。Honor of Kings、および関連するすべてのプロパティは、Tencent Inc.の商標または登録商標です。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">掲載している公式画像について</h2>
          <p>
            当サイトに掲載している公式の画像は、ヒーロー・スキル・装備・アルカナ・サモナースペルのアイコンだけで、原寸のイラストは掲載していません。権利者から削除のご要請があれば、速やかに削除します。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">情報の正確性について</h2>
          <p>
            掲載している数値は確認したうえで載せていますが、正確性を保証するものではありません。仕様も数値もパッチで変わるため、各ページの数値はそこに書かれた日付時点のものです。当サイトの情報を利用したことで生じた損害について、運営者は責任を負いかねます。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">削除・訂正のご依頼</h2>
          <p>
            権利者の方からの削除要請、および掲載内容の誤りのご指摘は
            <Link href="/contact" className="text-brand-700 font-bold underline">お問い合わせページ</Link>
            からお願いします。
          </p>
        </section>
      </div>
    </div>
  );
}
