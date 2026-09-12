import type {Locale} from '@/lib/catalog';

/**
 * "338 KB" / "1.2 MB", localised — Arabic gets Arabic-Indic digits and the
 * Arabic unit name from Intl rather than a hand-written string.
 */
export function formatBytes(bytes: number, locale: Locale) {
  const megabytes = bytes >= 1024 * 1024;
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: megabytes ? 'megabyte' : 'kilobyte',
    unitDisplay: 'short',
    maximumFractionDigits: megabytes ? 1 : 0
  }).format(megabytes ? bytes / (1024 * 1024) : bytes / 1024);
}
