import AdvancedCalculator from '@/components/calculator/AdvancedCalculator';
import { useTranslations } from 'next-intl';

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function CalculatorPage() {
  const t = useTranslations('Calculator');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
        <p className="text-slate-500 mt-2">{t('description')}</p>
      </div>
      
      <AdvancedCalculator />
    </div>
  );
}
