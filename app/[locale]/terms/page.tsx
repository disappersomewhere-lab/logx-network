import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {alternatesFor} from '@/lib/site';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const arabic = locale === 'ar';
  return {
    title: arabic ? 'شروط الاستخدام' : 'Terms of use',
    description: arabic
      ? 'شروط استخدام موقع LOGX NETWORK وطلبات عروض الأسعار.'
      : 'Terms covering use of the LOGX NETWORK website and quotation requests.',
    alternates: alternatesFor(locale, '/terms')
  };
}

export default async function TermsPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const arabic = locale === 'ar';

  return (
    <article className="legal-page">
      <p className="eyebrow">{arabic ? 'الشروط' : 'Terms'}</p>
      <h1>{arabic ? 'شروط الاستخدام' : 'Terms of use'}</h1>
      <p>
        {arabic
          ? 'المعلومات المنشورة في هذا الموقع لأغراض تعريفية وقد تتغير المواصفات أو التوفر دون إشعار مسبق.'
          : 'Information on this website is provided for general product information. Specifications and availability may change without notice.'}
      </p>

      <h2>{arabic ? 'طلبات الأسعار' : 'Quotation requests'}</h2>
      <p>
        {arabic
          ? 'إرسال النموذج لا يمثل عقد بيع أو التزامًا بتوريد المنتجات. يتم تأكيد الأسعار والمهل من خلال عرض رسمي من LOGX.'
          : 'Submitting a form does not create a sales contract or a supply commitment. Pricing and lead times are confirmed through an official LOGX quotation.'}
      </p>

      <h2>{arabic ? 'التواصل' : 'Contact'}</h2>
      <p>sales@logxconnect.com</p>
    </article>
  );
}
