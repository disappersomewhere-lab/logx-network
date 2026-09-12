import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import Link from 'next/link';
import {datasheetIndex} from '@/lib/families';
import {datasheetFor} from '@/lib/datasheets';
import {formatBytes} from '@/lib/format';
import {alternatesFor} from '@/lib/site';
import type {Locale} from '@/lib/catalog';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});
  return {
    title: t('datasheet.indexTitle'),
    description: t('datasheet.indexIntro'),
    alternates: alternatesFor(locale, '/datasheets')
  };
}

export default async function DatasheetsPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const language = locale as Locale;
  const groups = datasheetIndex();
  const total = groups.reduce((sum, group) => sum + group.products.length, 0);

  return (
    <div>
      <div className="catalog-intro">
        <div>
          <p className="eyebrow">{t('nav.products')}</p>
          <h1>{t('datasheet.indexTitle')}</h1>
        </div>
        <p>{t('datasheet.indexIntro')}</p>
      </div>

      <p className="catalog-count" style={{marginBottom: 28}}>
        {total} {t('datasheet.parts')} · {groups.length} {t('home.stats.families')}
      </p>

      {groups.map(({family, products}) => (
        <section className="catalog-group" key={family.key}>
          <div className="group-heading">
            <h2>{family.title}</h2>
            <span>
              {String(products.length).padStart(2, '0')} {t('datasheet.parts')}
            </span>
          </div>

          <table className="ds-index">
            <tbody>
              {products.map((product) => {
                const pdf = datasheetFor(product.partNumber);
                return (
                  <tr key={product.slug}>
                    <td className="ds-index-part">
                      <span className="product-code">{product.partNumber}</span>
                    </td>
                    <td className="ds-index-name">
                      <Link href={`/${locale}/products/${product.slug}`}>{product.name[language]}</Link>
                    </td>
                    <td className="ds-index-actions">
                      <Link href={`/${locale}/products/${product.slug}/datasheet`} className="text-link">
                        {t('datasheet.view')}
                      </Link>
                      {pdf ? (
                        <a href={pdf.url} className="ds-index-pdf" download>
                          <span className="pdf-badge" aria-hidden="true">
                            PDF
                          </span>
                          <span>{formatBytes(pdf.bytes, language)}</span>
                        </a>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
