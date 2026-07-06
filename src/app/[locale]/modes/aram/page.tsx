import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { Swords, Info, Shield, Zap, Trophy } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Modes' });

  return {
    title: t('aramTitle'),
    description: t('aramDesc'),
    robots: {
      index: false,
    },
  };
}

export default function AramPage() {
  const t = useTranslations("Modes");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-16">
        <div className="px-4 py-8 max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-indigo-100">
            <Swords className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
            {t("aramTitle")}
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-md">
            {t("aramDesc")}
          </p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        
        {/* Rules Section */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-bold text-slate-800">{t("aramRules")}</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
            {t("aramRulesDesc")}
          </p>
        </section>

        {/* Tier List Placeholder */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-800">{t("aramTierList")}</h2>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-center min-h-[120px] text-slate-400 text-sm font-medium border-dashed">
              [Placeholder] Hero data will be displayed here
            </div>
          </div>
        </section>

        {/* Exclusive Items Placeholder */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-bold text-slate-800">{t("aramItems")}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-3 items-center border-dashed">
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex-shrink-0" />
                <div className="flex flex-col gap-1 w-full">
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                  <div className="h-2 w-full bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Placeholder */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-500" />
            <h2 className="text-base font-bold text-slate-800">{t("aramSkills")}</h2>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-center min-h-[100px] text-slate-400 text-sm font-medium border-dashed">
             [Placeholder] Snowball skill details
          </div>
        </section>

      </div>
    </div>
  );
}
