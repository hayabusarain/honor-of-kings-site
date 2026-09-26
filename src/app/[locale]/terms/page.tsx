import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
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
    path: '/terms',
    title: isJa ? "利用規約" : "Terms of Service",
    description: isJa ? "Honor of Kings Hub のご利用条件について。" : "Terms and conditions for using Honor of Kings Hub.",
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
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
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Terms of Service</h1>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 pt-4 text-base leading-relaxed text-slate-700">
          <p className="px-5 sm:px-7">
            Welcome to Honor of Kings Hub. By accessing or using our website, you agree to comply with and be bound by these Terms of Service.
          </p>
          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase] mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing Honor of Kings Hub, you accept these terms in full. If you disagree with any part of these terms, please do not use our website.
            </p>
          </section>
          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase] mb-3">2. Intellectual Property</h2>
            <p>
              All game data, images, icons, and assets shown on this site belong to Tencent Inc. or their respective owners. Original content, custom tools, and site designs are property of Honor of Kings Hub.
            </p>
          </section>
          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase] mb-3">3. Prohibited Activities</h2>
            <p>You agree not to engage in any of the following activities:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Using the site for any unlawful purpose, or in a way that offends public order and morals.</li>
              <li>Attempting to disrupt or interfere with the server, network, or security of the site.</li>
              <li>Scraping or harvesting data from the site without prior authorization.</li>
            </ul>
          </section>
          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase] mb-3">4. Limitation of Liability</h2>
            <p>
              The content on this website is provided &quot;as is&quot;. We make no warranties, expressed or implied, regarding the accuracy, completeness, or reliability of any data. Please refer to our <Link href="/legal" className="text-brand-700 underline">Legal Disclaimer</Link> for more details.
            </p>
          </section>
          <section className={CARD}>
            <h2 className="section-title [word-break:auto-phrase] mb-3">5. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the website following any changes constitutes your acceptance of the new Terms of Service.
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
          <h1 className="text-2xl font-black tracking-tight text-slate-900">利用規約</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-4 pt-4 text-base leading-relaxed text-slate-700">
        <p className="px-5 sm:px-7">
          Honor of Kings Hub（以下「当サイト」）をご利用いただきありがとうございます。当サイトをご利用いただくにあたり、以下の利用規約（以下「本規約」）にご同意いただいたものとみなします。
        </p>
        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">第1条（規約の適用）</h2>
          <p>
            本規約は、当サイトの利用者すべてに適用されます。本規約に同意できない場合は、当サイトのご利用をお控えください。
          </p>
        </section>
        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">第2条（知的財産権）</h2>
          <p>
            当サイト内で使用されているゲーム内の画像、アイコン、キャラクターデータ等の知的財産権は、すべて Tencent Inc. およびその他の権利者に帰属します。
            当サイトが独自に作成したテキスト、デザイン、計算ツール等に関する著作権は当サイト運営者に帰属します。
          </p>
        </section>
        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">第3条（禁止事項）</h2>
          <p>利用者は、当サイトの利用にあたり、以下の行為を行ってはなりません。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>法令または公序良俗に違反する目的で当サイトを利用する行為。</li>
            <li>当サイトのサーバー・ネットワーク・セキュリティを破壊または妨害しようとする行為。</li>
            <li>事前の許可なく、当サイトのデータをスクレイピング・収集する行為。</li>
          </ul>
        </section>
        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">第4条（免責事項）</h2>
          <p>
            当サイトに掲載されている情報の正確性や最新性については細心の注意を払っておりますが、その保証はいたしかねます。当サイトの利用により生じた損害等について、運営者は一切の責任を負いません。
            詳細は<Link href="/legal" className="text-brand-700 underline">免責事項</Link>のページをご確認ください。
          </p>
        </section>
        <section className={CARD}>
          <h2 className="section-title [word-break:auto-phrase] mb-3">第5条（規約の変更）</h2>
          <p>
            当サイトは、必要に応じて本規約を変更することがあります。変更後の規約は当サイト上に掲載された時点で効力を生じるものとします。
          </p>
        </section>
      </div>
    </div>
  );
}
