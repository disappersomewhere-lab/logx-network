import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import {datasheetIndex, contentFor} from '@/lib/families';
import {datasheetFor} from '@/lib/datasheets';
import {formatBytes} from '@/lib/format';
import {alternatesFor} from '@/lib/site';
import type {Locale} from '@/lib/catalog';
import DatasheetDirectory, {type DatasheetItem} from '@/components/DatasheetDirectory';
import MasterDataSheetViewer from '@/components/MasterDataSheetViewer';

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

  const items: DatasheetItem[] = [];
  for (const group of groups) {
    for (const product of group.products) {
      const pdf = datasheetFor(product.partNumber);
      items.push({
        partNumber: product.partNumber,
        slug: product.slug,
        name: product.name[language],
        category: product.category,
        familyTitle: group.family.title,
        pdfUrl: pdf ? pdf.url : null,
        pdfBytes: pdf ? pdf.bytes : null,
        formattedSize: pdf ? formatBytes(pdf.bytes, language) : null,
        hasSheet: Boolean(contentFor(product.partNumber))
      });
    }
  }

  const masterSheetLabels = {
    eyebrow: t('masterSheet.eyebrow'),
    title: t('masterSheet.title'),
    subtitle: t('masterSheet.subtitle'),
    badge: t('masterSheet.badge'),
    ctaInspect: t('masterSheet.ctaInspect'),
    ctaDownload: t('masterSheet.ctaDownload'),
    ctaWebp: t('masterSheet.ctaWebp'),
    inspectHint: t('masterSheet.inspectHint'),
    zoomIn: t('masterSheet.zoomIn'),
    zoomOut: t('masterSheet.zoomOut'),
    resetZoom: t('masterSheet.resetZoom'),
    close: t('masterSheet.close'),
    categoriesCount: t('masterSheet.categoriesCount'),
    partsCount: t('masterSheet.partsCount'),
    standards: t('masterSheet.standards'),
    dragHint: t('masterSheet.dragHint'),
    categoriesTitle: t('masterSheet.categoriesTitle'),
    browseCategory: t('masterSheet.browseCategory'),
    categories: {
      copperCables: t('masterSheet.categories.copperCables'),
      patchCordsCat6: t('masterSheet.categories.patchCordsCat6'),
      patchCordsCat6A: t('masterSheet.categories.patchCordsCat6A'),
      rackAccessories: t('masterSheet.categories.rackAccessories'),
      faceplatesKeystones: t('masterSheet.categories.faceplatesKeystones'),
      fiberPatchPanels: t('masterSheet.categories.fiberPatchPanels'),
      fiberOpticCables: t('masterSheet.categories.fiberOpticCables'),
      fiberCordsSM: t('masterSheet.categories.fiberCordsSM'),
      fiberCordsOM3: t('masterSheet.categories.fiberCordsOM3'),
      fiberPigtails: t('masterSheet.categories.fiberPigtails'),
      toolsEquipment: t('masterSheet.categories.toolsEquipment'),
      fiberTerminalBoxes: t('masterSheet.categories.fiberTerminalBoxes'),
      powerDistribution: t('masterSheet.categories.powerDistribution')
    }
  };

  return (
    <div>
      <div className="catalog-intro">
        <div>
          <p className="eyebrow">{t('nav.products')}</p>
          <h1>{t('datasheet.indexTitle')}</h1>
        </div>
        <p>{t('datasheet.indexIntro')}</p>
      </div>

      <MasterDataSheetViewer labels={masterSheetLabels} locale={locale} />

      {/* Featured Spec Sheet */}
      <div style={{
        margin: '32px 0 0',
        padding: '20px 24px',
        background: 'var(--ink)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div>
          <span style={{
            display: 'inline-block',
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#d3131b',
            marginBottom: '4px'
          }}>
            ◈ {locale === 'ar' ? 'مصفوفة هندسية' : 'Engineering Matrix'}
          </span>
          <p style={{margin: 0, color: '#fff', fontWeight: 700, fontSize: '1rem'}}>
            {locale === 'ar'
              ? 'منتجات البنية التحتية السلبية UTP'
              : 'UTP Passive Network Infrastructure Products'}
          </p>
          <p style={{margin: '4px 0 0', color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem'}}>
            {locale === 'ar'
              ? 'الكابلات · وصلات التوصيل · الكيستون · لوحات التوزيع · إدارة الكابلات'
              : 'Cables · Patch Cords · Keystones · Patch Panels · Cable Management'}
          </p>
        </div>
        <a
          href={`/${locale}/datasheets/utp-passive`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#d3131b',
            color: '#fff',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          {locale === 'ar' ? 'عرض المصفوفة ←' : 'View Matrix →'}
        </a>
      </div>

      <DatasheetDirectory
        items={items}
        locale={locale}
        labels={{
          searchPlaceholder: t('datasheet.searchPlaceholder'),
          allCategories: t('datasheet.allCategories'),
          view: t('datasheet.view'),
          download: t('datasheet.download'),
          parts: t('datasheet.parts'),
          noResults: t('datasheet.noResults'),
          categories: {
            copper: t('categories.copper'),
            fiber: t('categories.fiber'),
            accessories: t('categories.accessories')
          }
        }}
      />
    </div>
  );
}
