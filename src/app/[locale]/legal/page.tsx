import { setRequestLocale } from 'next-intl/server';
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
    description: isJa ? "Honor of Kings Hub の著作権表記・免責事項・コンテンツポリシーについて。" : "Copyright notices, disclaimers, and content policy for Honor of Kings Hub.",
  });
}

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
            <h2 className="section-title [word-break:auto-phrase] mb-3">Accuracy of Information</h2>
            <p>
              While we strive to keep the data on this site as accurate and up-to-date as possible, we do not guarantee its absolute correctness. Game data, stats, and mechanics are subject to change by the developers via patch updates.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase] mb-3">Disclaimer Regarding AI Usage</h2>
            <p>
              Some of the content, translations, and data processing on this site are assisted by Artificial Intelligence (AI). While we strive for accuracy, please be aware that AI can occasionally produce incorrect information or &quot;hallucinations.&quot; Always use your best judgment and refer to official sources when necessary.
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
            当サイトは個人が運営する非公式のファンサイトであり、Tencent社およびLevel Infiniteとは一切関係ありません。
            当サイト内で使用されているゲーム内の画像、アイコン、テキスト、データ等の著作権・知的財産権は、すべて Tencent Inc. およびその他の権利者に帰属します。
          </p>
          <p className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500 italic">
            当サイトはTencentまたはLevel Infiniteの承認を得たものではなく、Tencent、Level Infinite、またはHonor of Kingsのプロパティの制作・管理に公式に関与している人物の意見や見解を反映するものではありません。Honor of Kings、および関連するすべてのプロパティは、Tencent Inc.の商標または登録商標です。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">情報の正確性について</h2>
          <p>
            当サイトに掲載されている攻略情報、パッチノート、スキルデータ等は可能な限り正確であるよう努めておりますが、
            ゲームのアップデート等により情報が古くなる場合や、独自の解析による誤差が含まれる場合があります。
            当サイトの情報を利用したことによって生じるいかなる損害についても、当サイト運営者は一切の責任を負いません。
          </p>
        </section>

        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">AI活用に関する免責事項</h2>
          <p>
            当サイトのコンテンツ作成、翻訳、およびデータ処理の一部にはAI（人工知能）を活用しています。
            情報の正確性には細心の注意を払っておりますが、AIの性質上、誤った情報（ハルシネーション）が含まれる可能性があります。
            閲覧の際はご自身の判断も併せてご活用いただき、必要に応じて公式情報等もご参照ください。
          </p>
        </section>
      </div>
    </div>
  );
}
