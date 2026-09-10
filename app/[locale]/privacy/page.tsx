import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {alternatesFor} from '@/lib/site';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const arabic = locale === 'ar';
  return {
    title: arabic ? 'سياسة الخصوصية' : 'Privacy policy',
    description: arabic
      ? 'كيف تستخدم LOGX NETWORK البيانات المرسلة عبر نموذج التواصل.'
      : 'How LOGX NETWORK uses information submitted through the contact form.',
    alternates: alternatesFor(locale, '/privacy')
  };
}

export default async function PrivacyPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const arabic = locale === 'ar';

  return (
    <article className="legal-page">
      <p className="eyebrow">{arabic ? 'السياسة' : 'Policy'}</p>
      <h1>{arabic ? 'سياسة الخصوصية' : 'Privacy policy'}</h1>
      <p>
        {arabic
          ? 'نستخدم البيانات التي ترسلها عبر نموذج التواصل للرد على استفسارك وتقديم المعلومات المطلوبة فقط.'
          : 'We use information submitted through the contact form only to respond to your enquiry and provide the requested information.'}
      </p>

      <h2>{arabic ? 'البيانات التي نجمعها' : 'Information we collect'}</h2>
      <p>
        {arabic
          ? 'قد نجمع الاسم والبريد المهني واسم الشركة ومحتوى الرسالة. لا نبيع هذه البيانات أو نشاركها لأغراض تسويقية غير مصرح بها.'
          : 'We may collect your name, work email, company and message. We do not sell this information or share it for unrelated marketing.'}
      </p>

      <h2>{arabic ? 'ملفات تعريف الارتباط' : 'Cookies'}</h2>
      <p>
        {arabic
          ? 'لا يستخدم هذا الموقع كوكيز تتبّع أو إعلانات. يُحفظ كوكي واحد لتذكّر لغتك المختارة، وهو ضروري لعمل الموقع.'
          : 'This site uses no tracking or advertising cookies. A single cookie stores your language preference, which is strictly necessary for the site to work.'}
      </p>

      <h2>{arabic ? 'التواصل' : 'Contact'}</h2>
      <p>sales@logxconnect.com</p>
    </article>
  );
}
