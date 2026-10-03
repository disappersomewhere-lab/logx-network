'use client';

import {useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

type NavItem = {href: string; label: string};

type MobileNavProps = {
  items: NavItem[];
  langSwitch: {href: string; label: string | React.ReactNode; lang: string};
  menuLabel: string;
  closeLabel: string;
};

export default function MobileNav({items, langSwitch, menuLabel, closeLabel}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on route change. Adjusted during render (not an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [priorPathname, setPriorPathname] = useState(pathname);
  if (pathname !== priorPathname) {
    setPriorPathname(pathname);
    setOpen(false);
  }

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        className="nav-hamburger"
        aria-label={open ? closeLabel : menuLabel}
        aria-expanded={open}
        aria-controls="mobile-menu"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={`hamburger-icon ${open ? 'is-open' : ''}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="nav-backdrop"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        {...(!open ? {inert: true} : {})}
      >
        <nav className="mobile-menu-nav" aria-label={menuLabel}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-menu-foot">
          <Link
            href={langSwitch.href}
            className="language-switch"
            lang={langSwitch.lang}
            hrefLang={langSwitch.lang}
            onClick={() => setOpen(false)}
          >
            {langSwitch.label}
          </Link>
        </div>
      </div>
    </>
  );
}
