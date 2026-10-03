'use client';

import {useEffect, useState, type ReactNode} from 'react';
import Link from 'next/link';
import {formatBytes} from '@/lib/format';
import type {Locale} from '@/lib/catalog';
import {defaultProfileTheme, isProfileTheme, profileThemes, type ProfileTheme} from '@/lib/profile-themes';

type Pdf = {url: string; bytes: number};

type Props = {
  locale: Locale;
  pdfs: Partial<Record<ProfileTheme, Pdf>>;
  labels: {
    back: string;
    theme: string;
    themes: Record<ProfileTheme, string>;
    print: string;
    download: string;
  };
  children: ReactNode;
};

/**
 * The profile's screen chrome: a theme switcher, print and download. The
 * slides arrive as server-rendered children; switching theme only changes the
 * `data-theme` the stylesheet keys on.
 *
 * The theme lives in `?theme=` so a shared link (and the PDF build, which
 * prints each theme's URL) opens on the same look. It is read after mount
 * rather than through `searchParams`, which would opt the page out of static
 * rendering.
 */
export default function ProfileDeck({locale, pdfs, labels, children}: Props) {
  const [theme, setTheme] = useState<ProfileTheme>(defaultProfileTheme);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('theme');
    // Syncing from the URL once on mount, after hydration, is the intent here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isProfileTheme(requested)) setTheme(requested);
  }, []);

  function choose(next: ProfileTheme) {
    setTheme(next);
    const url = new URL(window.location.href);
    if (next === defaultProfileTheme) url.searchParams.delete('theme');
    else url.searchParams.set('theme', next);
    window.history.replaceState(null, '', url);
  }

  const pdf = pdfs[theme];

  return (
    <div className="pf-page">
      <div className="pf-toolbar">
        <Link href={`/${locale}/about`} className="back-link">
          <span className="arrow" aria-hidden="true">
            ←
          </span>
          {labels.back}
        </Link>

        <div className="pf-themes" role="radiogroup" aria-label={labels.theme}>
          {profileThemes.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={theme === option}
              className="pf-theme-option"
              data-option={option}
              onClick={() => choose(option)}
            >
              <span className="pf-theme-swatch" aria-hidden="true" />
              {labels.themes[option]}
            </button>
          ))}
        </div>

        <div className="pf-toolbar-actions">
          <button type="button" className="button button-quiet" onClick={() => window.print()}>
            {labels.print}
          </button>
          {pdf ? (
            <a href={pdf.url} className="button button-primary" download>
              <span className="pdf-badge" aria-hidden="true">
                PDF
              </span>
              {labels.download}
              <small className="ds-size">{formatBytes(pdf.bytes, locale)}</small>
            </a>
          ) : null}
        </div>
      </div>

      <article className="pf-deck" data-theme={theme} lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </article>
    </div>
  );
}
