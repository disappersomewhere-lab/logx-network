'use client';

import {useState, useCallback, useEffect} from 'react';
import Image from 'next/image';

type ProductGalleryProps = {
  images: string[];
  alt: string;
  thumbLabel: string;
  representativeImage?: boolean;
  representativeImageLabel?: string;
  representativeImageNote?: string;
};

export default function ProductGallery({
  images,
  alt,
  thumbLabel,
  representativeImage,
  representativeImageLabel,
  representativeImageNote
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const current = images[Math.min(active, images.length - 1)];

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, closeLightbox, prevImage, nextImage]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  if (!images.length) return null;

  return (
    <>
      {/* Main gallery */}
      <div className="gallery-wrap">
        <div
          className="gallery-main gallery-main-clickable"
          onClick={() => openLightbox(active)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openLightbox(active)}
          aria-label={`${thumbLabel} — ${alt}`}
        >
          <Image
            src={current}
            alt={alt}
            fill
            sizes="(max-width: 860px) 92vw, 560px"
            priority
          />
          {representativeImage && representativeImageLabel ? (
            <span className="representative-image-badge">{representativeImageLabel}</span>
          ) : null}
          {/* Zoom hint overlay */}
          <div className="gallery-zoom-hint" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
        </div>
        {representativeImage && representativeImageNote ? (
          <p className="representative-image-note" role="note">
            {representativeImageNote}
          </p>
        ) : null}

        {/* Counter badge */}
        {images.length > 1 && (
          <div className="gallery-counter" aria-live="polite">
            {active + 1} / {images.length}
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="gallery-thumbs">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                className="gallery-thumb"
                aria-current={index === active ? 'true' : undefined}
                aria-label={`${thumbLabel} ${index + 1}`}
                onClick={() => setActive(index)}
              >
                <Image src={image} alt="" fill sizes="90px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close"
              type="button"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* Prev button */}
            {images.length > 1 && (
              <button
                className="lightbox-nav lightbox-prev"
                onClick={prevImage}
                aria-label="Previous image"
                type="button"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
            )}

            {/* Main image */}
            <div className="lightbox-image-wrap">
              <Image
                src={images[lightboxIndex]}
                alt={`${alt} — ${lightboxIndex + 1}`}
                fill
                sizes="90vw"
                priority
              />
            </div>

            {/* Next button */}
            {images.length > 1 && (
              <button
                className="lightbox-nav lightbox-next"
                onClick={nextImage}
                aria-label="Next image"
                type="button"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            )}

            {/* Counter */}
            {images.length > 1 && (
              <div className="lightbox-counter">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
