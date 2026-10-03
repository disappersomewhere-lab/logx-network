import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import Link from 'next/link';
import {alternatesFor} from '@/lib/site';
import {locales} from '@/i18n';
import UtpPassiveSheet from '@/components/UtpPassiveSheet';

type Props = {params: Promise<{locale: string}>};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isAr = locale === 'ar';
  return {
    title: isAr
      ? 'منتجات شبكة UTP السلبية | لوجكس شبكات'
      : 'UTP Passive Network Infrastructure Products | LOGX Network',
    description: isAr
      ? 'مصفوفة المواصفات الهندسية الرسمية لمنتجات UTP السلبية من لوجكس شبكات — الكابلات، وصلات التوصيل، لوحات التوزيع، وإدارة الكابلات.'
      : 'Official engineering specification matrix for LOGX Network UTP passive products — cables, patch cords, keystones, patch panels and cable management.',
    alternates: alternatesFor(locale, '/datasheets/utp-passive')
  };
}

export default async function UtpPassivePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const isAr = locale === 'ar';

  return (
    <div className="utp-page-wrapper">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" style={{marginBottom: 24, fontSize: '0.82rem', color: 'var(--ink-faint)'}}>
        <Link href={`/${locale}`} style={{color: 'var(--ink-soft)', textDecoration: 'none'}}>
          {t('nav.home')}
        </Link>
        {' / '}
        <Link href={`/${locale}/datasheets`} style={{color: 'var(--ink-soft)', textDecoration: 'none'}}>
          {t('nav.products')}
        </Link>
        {' / '}
        <span>{isAr ? 'منتجات UTP السلبية' : 'UTP Passive'}</span>
      </nav>

      {/* Page heading */}
      <p className="utp-page-eyebrow">
        <span aria-hidden="true">◈</span>
        {isAr ? 'مصفوفة المواصفات الهندسية' : 'Engineering Specification Matrix'}
      </p>
      <h1 className="utp-page-heading">
        {isAr
          ? 'منتجات البنية التحتية السلبية UTP'
          : 'UTP Passive Network Infrastructure Products'}
      </h1>
      <p className="utp-page-lead">
        {isAr
          ? 'المصفوفة الرسمية لمنتجات UTP السلبية من لوجكس شبكات — مُصنّعة وفق معايير ANSI/TIA-568.2-D وISO/IEC 11801 بتغطية قياس 100% بجهاز Fluke.'
          : 'Official specification matrix for LOGX Network UTP passive products — manufactured to ANSI/TIA-568.2-D & ISO/IEC 11801 with 100% Fluke channel verification.'}
      </p>

      {/* The main sheet component */}
      <UtpPassiveSheet locale={locale} />

      {/* Navigation CTA */}
      <div style={{
        marginTop: 32,
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <Link href={`/${locale}/datasheets`} className="button button-primary">
          {isAr ? '← عرض جميع أوراق البيانات' : '← All Datasheets'}
        </Link>
      </div>
    </div>
  );
}
