'use client';

import {useState, useSyncExternalStore} from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  primary: {href: string; label: string};
  secondary?: {href: string; label: string};
  /** Full-bleed scene behind the caption. Slides without one sit on the brand ink. */
  image?: string;
  /** Visual treatment: keeps a tinted photograph inside the LOGX palette. */
  tone: 'fiber' | 'network' | 'rack';
  /** A real product shown beside the caption. */
  product?: {src: string; alt: string; caption: string};
};

type HeroCarouselProps = {
  slides: HeroSlide[];
  labels: {
    region: string;
    prev: string;
    next: string;
    pause: string;
    play: string;
    /** Contains `{n}`. */
    goTo: string;
  };
};

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeToMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/**
 * Full-bleed story hero after corning.com's home page: one large image per
 * slide with a caption card over it. Advances itself, but only while nothing
 * is hovering or focused in it, never under reduced-motion, and the viewer can
 * always pause it.
 *
 * The auto-advance is driven by the active dot's own progress animation
 * (`animationend`), so the bar the viewer sees and the timer are one thing and
 * cannot drift apart when the slideshow is paused and resumed.
 */
export default function HeroCarousel({slides, labels}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false
  );

  const running = playing && !reducedMotion;
  const go = (next: number) => setIndex((next + slides.length) % slides.length);

  return (
    <section
      className="cx-hero"
      aria-roledescription="carousel"
      aria-label={labels.region}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(index + (document.dir === 'rtl' ? -1 : 1));
        if (event.key === 'ArrowLeft') go(index + (document.dir === 'rtl' ? 1 : -1));
      }}
    >
      <div className="cx-slides" aria-live={running ? 'off' : 'polite'}>
        {slides.map((slide, position) => {
          const active = position === index;
          return (
            <div
              key={slide.id}
              className="cx-slide"
              data-tone={slide.tone}
              data-active={active || undefined}
              role="group"
              aria-roledescription="slide"
              aria-label={`${position + 1} / ${slides.length}`}
              {...(!active ? {inert: true} : {})}
            >
              {slide.image ? (
                <Image
                  className="cx-slide-image"
                  src={slide.image}
                  alt=""
                  fill
                  sizes="100vw"
                  preload={position === 0}
                />
              ) : null}
              <div className="cx-slide-shade" aria-hidden="true" />

              <div className="shell cx-slide-inner">
                <div className="cx-caption">
                  <p className="cx-caption-eyebrow">{slide.eyebrow}</p>
                  {position === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
                  <p className="cx-caption-text">{slide.text}</p>
                  <div className="cx-caption-actions">
                    <Link href={slide.primary.href} className="button button-primary">
                      {slide.primary.label}
                    </Link>
                    {slide.secondary ? (
                      <Link href={slide.secondary.href} className="button button-ghost-light">
                        {slide.secondary.label}
                      </Link>
                    ) : null}
                  </div>
                </div>

                {slide.product ? (
                  <figure className="cx-slide-product">
                    <div className="cx-slide-product-frame">
                      <Image src={slide.product.src} alt={slide.product.alt} fill sizes="(max-width: 900px) 70vw, 460px" />
                    </div>
                    <figcaption>{slide.product.caption}</figcaption>
                  </figure>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="shell cx-controls-wrap">
        <div className="cx-controls" data-hold={held || undefined}>
          <button type="button" className="cx-control" aria-label={labels.prev} onClick={() => go(index - 1)}>
            <svg className="cx-flip" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>

          <div className="cx-dots">
            {slides.map((slide, position) => (
              <button
                key={slide.id}
                type="button"
                className="cx-dot"
                data-active={position === index || undefined}
                aria-label={labels.goTo.replace('{n}', String(position + 1))}
                aria-current={position === index ? 'true' : undefined}
                onClick={() => go(position)}
              >
                {position === index && running ? (
                  <span className="cx-dot-progress" onAnimationEnd={() => go(index + 1)} />
                ) : null}
              </button>
            ))}
          </div>

          <button type="button" className="cx-control" aria-label={labels.next} onClick={() => go(index + 1)}>
            <svg className="cx-flip" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>

          <button
            type="button"
            className="cx-control cx-control-play"
            aria-label={running ? labels.pause : labels.play}
            aria-pressed={!running}
            onClick={() => setPlaying((value) => !value)}
          >
            {running ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="cx-flip" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
