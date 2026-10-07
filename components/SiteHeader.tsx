'use client';

import {useEffect, useRef, useState, type FormEvent} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import Logo from '@/components/Logo';
import MobileNav, {type NavItem} from '@/components/MobileNav';

export type MegaColumn = {
  id: string;
  title: string;
  description: string;
  count: string;
  href: string;
  links: {label: string; href: string}[];
};

type SiteHeaderProps = {
  locale: 'en' | 'ar';
  /** Plain links, in order, shown after the Products menu. */
  links: NavItem[];
  products: {label: string; href: string; allLabel: string; columns: MegaColumn[]};
  utility: {phone: string; phoneHref: string; email: string; emailHref: string};
  quote: {label: string; href: string};
  language: {href: string; lang: string; label: string};
  labels: {
    primary: string;
    openMenu: string;
    closeMenu: string;
    search: string;
    searchPlaceholder: string;
    searchSubmit: string;
    closeSearch: string;
  };
};

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

/**
 * Two-tier header after corning.com: a slim utility bar over a sticky main bar
 * whose Products entry opens a full-width mega menu. Search opens a drawer
 * under the bar rather than a page of its own.
 */
export default function SiteHeader({
  locale,
  links,
  products,
  utility,
  quote,
  language,
  labels
}: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mega, setMega] = useState(false);
  const [search, setSearch] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // A mouse hover has already opened the menu by the time the click lands, so
  // that click must not toggle it shut again.
  const openedByHover = useRef(false);

  // Close both panels on navigation. Adjusted during render rather than in an
  // effect: https://react.dev/learn/you-might-not-need-an-effect
  const [priorPathname, setPriorPathname] = useState(pathname);
  if (pathname !== priorPathname) {
    setPriorPathname(pathname);
    setMega(false);
    setSearch(false);
  }

  const anyOpen = mega || search;

  useEffect(() => {
    if (!anyOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMega(false);
        setSearch(false);
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setMega(false);
        setSearch(false);
      }
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [anyOpen]);

  useEffect(() => {
    if (search) searchRef.current?.focus();
  }, [search]);

  useEffect(() => {
    if (!mega) openedByHover.current = false;
  }, [mega]);

  function openMega(byHover = false) {
    clearTimeout(closeTimer.current);
    openedByHover.current = byHover;
    setSearch(false);
    setMega(true);
  }

  function scheduleClose() {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(false), 140);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get('q') ?? '').trim();
    setSearch(false);
    router.push(`/${locale}/products${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const mobileItems: NavItem[] = [
    {
      href: products.href,
      label: products.label,
      children: products.columns.map((column) => ({href: column.href, label: column.title}))
    },
    ...links
  ];

  return (
    <>
      <div className="cx-utility">
        <div className="shell cx-utility-inner">
          <div className="cx-utility-contact">
            <a href={utility.phoneHref} dir="ltr">
              {utility.phone}
            </a>
            <a href={utility.emailHref}>{utility.email}</a>
          </div>
          <Link
            href={language.href}
            className="cx-utility-lang"
            lang={language.lang}
            hrefLang={language.lang}
          >
            <GlobeIcon />
            {language.label}
          </Link>
        </div>
      </div>

      <header className="cx-header" ref={barRef}>
        <div className="shell cx-header-inner">
          <Link href={`/${locale}`} aria-label="LOGX NETWORK" className="cx-logo">
            <Logo />
          </Link>

          <nav className="cx-nav" aria-label={labels.primary}>
            <div
              className="cx-nav-item"
              onPointerEnter={(event) => event.pointerType === 'mouse' && openMega(true)}
              onPointerLeave={(event) => event.pointerType === 'mouse' && scheduleClose()}
            >
              <button
                type="button"
                className="cx-nav-link cx-nav-trigger"
                aria-expanded={mega}
                aria-controls="cx-mega"
                data-active={isActive(products.href) || undefined}
                onClick={() => {
                  if (openedByHover.current) {
                    openedByHover.current = false;
                    return;
                  }
                  if (mega) setMega(false);
                  else openMega();
                }}
              >
                {products.label}
                <svg className="cx-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m2 3.5 3 3 3-3" />
                </svg>
              </button>
            </div>

            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="cx-nav-link"
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="cx-header-actions">
            <button
              type="button"
              className="cx-icon-button"
              aria-label={search ? labels.closeSearch : labels.search}
              aria-expanded={search}
              aria-controls="cx-search"
              onClick={() => {
                setMega(false);
                setSearch((open) => !open);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <Link href={quote.href} className="button button-primary cx-quote">
              {quote.label}
            </Link>
            <MobileNav
              items={mobileItems}
              cta={quote}
              langSwitch={{
                href: language.href,
                lang: language.lang,
                label: (
                  <span className="cx-mobile-lang">
                    <GlobeIcon />
                    {language.label}
                  </span>
                )
              }}
              menuLabel={labels.openMenu}
              closeLabel={labels.closeMenu}
            />
          </div>
        </div>

        {/* Mega menu: one column per product system. */}
        <div
          id="cx-mega"
          className="cx-mega"
          data-open={mega || undefined}
          onPointerEnter={(event) => event.pointerType === 'mouse' && openMega(true)}
          onPointerLeave={(event) => event.pointerType === 'mouse' && scheduleClose()}
          {...(!mega ? {inert: true} : {})}
        >
          <div className="shell cx-mega-inner">
            {products.columns.map((column) => (
              <div className="cx-mega-column" key={column.id}>
                <Link href={column.href} className="cx-mega-title">
                  {column.title}
                  <span className="cx-mega-count">{column.count}</span>
                </Link>
                <p>{column.description}</p>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="cx-mega-aside">
              <Link href={products.href} className="cx-mega-all">
                {products.allLabel}
                <span className="cx-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Search drawer. */}
        <div
          id="cx-search"
          className="cx-search"
          data-open={search || undefined}
          {...(!search ? {inert: true} : {})}
        >
          <form className="shell cx-search-form" role="search" onSubmit={submitSearch}>
            <input
              ref={searchRef}
              type="search"
              name="q"
              placeholder={labels.searchPlaceholder}
              aria-label={labels.search}
              autoComplete="off"
            />
            <button type="submit" className="button button-primary">
              {labels.searchSubmit}
            </button>
          </form>
        </div>
      </header>
    </>
  );
}
