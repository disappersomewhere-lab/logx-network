'use client';

import {useState, useSyncExternalStore} from 'react';

type OfficeMapProps = {
  src: string;
  title: string;
  name: string;
  href?: string;
  openLabel: string;
};

const subscribe = () => () => {};

/**
 * Google's embed is a blank white box until its frame loads, and only paints
 * tiles a moment after that — and never, if the viewer blocks Google. So the
 * card carries its own pin, office name and "open in maps" link from the first
 * paint, and the live map fades in over it once the frame has loaded. The
 * frame is mounted after hydration so its load event can't fire before React
 * is listening for it.
 */
export default function OfficeMap({src, title, name, href, openLabel}: OfficeMapProps) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [ready, setReady] = useState(false);

  return (
    <div className="office-map" data-ready={ready}>
      <div className="office-map-fallback">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p>{name}</p>
        {href && (
          <a href={href} target="_blank" rel="noreferrer">
            {openLabel}
          </a>
        )}
      </div>

      {hydrated && (
        <iframe
          src={src}
          title={title}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          // Give the tiles a beat to paint before the placeholder lets go.
          onLoad={() => window.setTimeout(() => setReady(true), 600)}
        />
      )}
    </div>
  );
}
