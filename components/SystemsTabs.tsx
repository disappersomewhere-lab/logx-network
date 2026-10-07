'use client';

import {useRef, useState, type KeyboardEvent} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LineCard, {type LineCardData} from '@/components/LineCard';

export type SystemTab = {
  id: string;
  label: string;
  tag: string;
  description: string;
  image: string;
  imageFit?: 'cover' | 'contain';
  highlights: string[];
  count: string;
  browse: {href: string; label: string};
  lines: LineCardData[];
};

/**
 * "Explore the ways …" module after corning.com: a tab per product system, each
 * with a scene photograph, what the system covers, and the product lines in it.
 * Every panel is rendered into the page (inactive ones are `hidden`), so the
 * whole range is in the markup for search engines and works without a click.
 */
export default function SystemsTabs({tabs}: {tabs: SystemTab[]}) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const rtl = document.dir === 'rtl';
    let next = active;
    if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight') || event.key === 'ArrowDown') next = active + 1;
    else if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft') || event.key === 'ArrowUp') next = active - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;

    event.preventDefault();
    next = (next + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="cx-systems">
      <div className="cx-systems-tabs" role="tablist" onKeyDown={onKeyDown}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`system-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`system-panel-${tab.id}`}
            tabIndex={index === active ? 0 : -1}
            className="cx-systems-tab"
            onClick={() => setActive(index)}
          >
            <span className="cx-systems-tab-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          id={`system-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`system-tab-${tab.id}`}
          className="cx-systems-panel"
          hidden={index !== active}
        >
          <div className="cx-systems-feature">
            <div className="cx-systems-scene" data-fit={tab.imageFit}>
              <Image src={tab.image} alt="" fill sizes="(max-width: 900px) 100vw, 520px" />
              <span className="cx-systems-tag">{tab.tag}</span>
            </div>
            <div className="cx-systems-copy">
              <p className="cx-systems-count">{tab.count}</p>
              <h3>{tab.label}</h3>
              <p>{tab.description}</p>
              <ul className="cx-systems-highlights">
                {tab.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <Link href={tab.browse.href} className="button button-primary">
                {tab.browse.label}
              </Link>
            </div>
          </div>

          <div className="product-grid cx-systems-lines">
            {tab.lines.map((line) => (
              <LineCard key={line.href} {...line} />
            ))}
            {/* Closing tile, like corning.com's "Learn more" card. */}
            <Link href={tab.browse.href} className="cx-more-tile">
              <span className="cx-more-count">{tab.count}</span>
              <span className="cx-more-label">
                {tab.browse.label}
                <span className="cx-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
