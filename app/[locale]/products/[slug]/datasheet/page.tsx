import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';
import PrintButton from '@/components/PrintButton';
import {catalog, getProduct, type Locale} from '@/lib/catalog';
import {contentFor, productsInFamily} from '@/lib/families';
import {alternatesFor, contact, productionUrl} from '@/lib/site';
import {datasheetFor} from '@/lib/datasheets';
import {formatBytes} from '@/lib/format';
import {locales} from '@/i18n';

type Props = {
  params: Promise<{locale: string; slug: string}>;
};

// Only parts with authored engineering content get a sheet; an ungenerated
// slug is a real 404 rather than an empty page.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    catalog
      .filter((product) => contentFor(product.partNumber))
      .map((product) => ({locale, slug: product.slug}))
  );
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.partNumber} — ${locale === 'ar' ? 'ورقة البيانات' : 'Datasheet'}`,
    description: `Technical datasheet for the LOGX ${product.name.en} (${product.partNumber}): specifications, standards, characteristics and ordering information.`,
    alternates: alternatesFor(locale, `/products/${slug}/datasheet`)
  };
}

// Lays a key/value list out two pairs per row, as technical sheets do.
function pairs<T>(rows: T[]) {
  const out: [T, T | undefined][] = [];
  for (let i = 0; i < rows.length; i += 2) out.push([rows[i], rows[i + 1]]);
  return out;
}

export default async function DatasheetPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const product = getProduct(slug);
  if (!product) notFound();
  const family = contentFor(product.partNumber);
  if (!family) notFound();

  const t = await getTranslations();
  const language = locale as Locale;
  const siblings = productsInFamily(family);
  const [photo] = product.images;
  const pdf = datasheetFor(product.partNumber);
  const productUrl = `${productionUrl}/${locale}/products/${product.slug}`;

  return (
    <div className="ds-page">
      {/* Screen-only controls; the print stylesheet removes them. */}
      <div className="ds-toolbar">
        <Link href={`/${locale}/products/${product.slug}`} className="back-link">
          <span className="arrow" aria-hidden="true">
            ←
          </span>
          {t('datasheet.backToProduct')}
        </Link>
        <div className="ds-toolbar-actions">
          <PrintButton label={t('datasheet.print')} />
          {pdf ? (
            <a href={pdf.url} className="button button-primary" download>
              <span className="pdf-badge" aria-hidden="true">
                PDF
              </span>
              {t('datasheet.download')}
              <small className="ds-size">{formatBytes(pdf.bytes, language)}</small>
            </a>
          ) : null}
        </div>
      </div>

      {/* The sheet itself is an English technical document regardless of the
          surrounding site locale, as vendor datasheets conventionally are. */}
      <article className="ds-sheet" lang="en" dir="ltr">
        <header className="ds-head">
          <Logo size="1.6rem" />
          <div className="ds-doc-type">
            <span>Technical datasheet</span>
            <small>Rev. {family.revision}</small>
          </div>
        </header>

        <div className="ds-title">
          <div>
            <p className="ds-family">{family.title}</p>
            <h1>{product.name.en}</h1>
            <p className="ds-model">{family.modelLine}</p>
          </div>
          <div className="ds-part">
            <span>Part number</span>
            <strong>{product.partNumber}</strong>
          </div>
        </div>

        <div className="ds-columns">
          <div className="ds-main">
            <section>
              <h2>Description</h2>
              <p>{family.description}</p>
            </section>

            <section>
              <h2>Features &amp; benefits</h2>
              <ul className="ds-list">
                {family.features.map((feature, index) => (
                  <li key={index}>
                    {feature.lead ? <strong>{feature.lead}</strong> : null}
                    {feature.lead && feature.text ? ' ' : null}
                    {feature.text}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Typical applications</h2>
              <ul className="ds-list">
                {family.applications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="ds-side">
            {photo ? (
              <figure className="ds-photo">
                <Image
                  src={photo}
                  alt={
                    product.representativeImage
                      ? 'Representative CAT6 cable photo, not the exact CAT6A product'
                      : product.name.en
                  }
                  fill
                  sizes="260px"
                  priority
                />
                {product.representativeImage ? (
                  <span className="ds-photo-representative">
                    Representative photo: CAT6 cable, not this CAT6A product
                  </span>
                ) : null}
              </figure>
            ) : null}

            <section>
              <h2>Compliance &amp; standards</h2>
              <ul className="ds-checks">
                {family.compliance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {family.sideTable ? (
              <section>
                <h2>{family.sideTable.title}</h2>
                <table className="ds-table ds-table-compact">
                  <tbody>
                    {family.sideTable.rows.map(([key, value]) => (
                      <tr key={key}>
                        <th scope="row">{key}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ) : null}
          </aside>
        </div>

        <section className="ds-block">
          <h2>{family.specsTitle}</h2>
          <table className="ds-table ds-table-pairs">
            <tbody>
              {pairs(family.specs).map(([left, right], index) => (
                <tr key={index}>
                  <th scope="row">{left[0]}</th>
                  <td>{left[1]}</td>
                  {right ? (
                    <>
                      <th scope="row">{right[0]}</th>
                      <td>{right[1]}</td>
                    </>
                  ) : (
                    <>
                      <th aria-hidden="true" />
                      <td aria-hidden="true" />
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {family.mechanical || family.electrical ? (
          <div className="ds-columns ds-characteristics">
            {[family.mechanical, family.electrical]
              .filter((block): block is NonNullable<typeof block> => Boolean(block))
              .map((block) => (
                <section key={block.title}>
                  <h2>{block.title}</h2>
                  <table className="ds-table">
                    <tbody>
                      {block.rows.map(([key, value]) => (
                        <tr key={key}>
                          <th scope="row">{key}</th>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              ))}
          </div>
        ) : null}

        <section className="ds-block ds-ordering">
          <h2>Ordering information</h2>
          {/* A long family (the fibre patch cords run to 24 lengths) is laid out
              as two side-by-side tables so the sheet stays on one page; the
              description column is dropped there since the variant carries it. */}
          {(() => {
            const wide = family.parts.length > 12;
            const halves = wide
              ? [family.parts.slice(0, Math.ceil(family.parts.length / 2)), family.parts.slice(Math.ceil(family.parts.length / 2))]
              : [family.parts];
            return (
              <div className={wide ? 'ds-ordering-split' : undefined}>
                {halves.map((rows, half) => (
                  <table className="ds-table" key={half}>
                    <thead>
                      <tr>
                        <th scope="col">Part number</th>
                        {!wide ? <th scope="col">Description</th> : null}
                        <th scope="col">{family.variantHeader}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((part) => {
                        const current = part.partNumber === product.partNumber;
                        const sibling = siblings.find((item) => item.partNumber === part.partNumber);
                        return (
                          <tr key={part.partNumber} className={current ? 'ds-current' : undefined} aria-current={current ? 'true' : undefined}>
                            <td className="ds-mono">
                              {sibling && !current ? (
                                <Link href={`/${locale}/products/${sibling.slug}/datasheet`}>{part.partNumber}</Link>
                              ) : (
                                part.partNumber
                              )}
                            </td>
                            {!wide ? <td>{sibling ? sibling.name.en : part.description}</td> : null}
                            <td>{part.variant}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ))}
              </div>
            );
          })()}
        </section>

        <footer className="ds-foot">
          <span>© LOGX NETWORK · Specifications subject to change without notice.</span>
          <span className="ds-mono">
            {productUrl.replace(/^https?:\/\//, '')} · {contact.email}
          </span>
        </footer>
      </article>
    </div>
  );
}
