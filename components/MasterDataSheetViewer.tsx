'use client';

import {useState, useEffect, useRef, useCallback} from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type MasterSheetLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaInspect: string;
  ctaDownload: string;
  ctaWebp: string;
  inspectHint: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  close: string;
  categoriesCount: string;
  partsCount: string;
  standards: string;
  dragHint: string;
  categoriesTitle: string;
  browseCategory: string;
  categories: {
    copperCables: string;
    patchCordsCat6: string;
    patchCordsCat6A: string;
    rackAccessories: string;
    faceplatesKeystones: string;
    fiberPatchPanels: string;
    fiberOpticCables: string;
    fiberCordsSM: string;
    fiberCordsOM3: string;
    fiberPigtails: string;
    toolsEquipment: string;
    fiberTerminalBoxes: string;
    powerDistribution: string;
  };
};

type Props = {
  labels: MasterSheetLabels;
  locale: string;
  variant?: 'featured' | 'compact';
};

const CATEGORIES_MAPPING = [
  {id: 'copperCables', linkCategory: 'copper', icon: '⚡'},
  {id: 'patchCordsCat6', linkCategory: 'copper', icon: '🔗'},
  {id: 'patchCordsCat6A', linkCategory: 'copper', icon: '⚡'},
  {id: 'rackAccessories', linkCategory: 'accessories', icon: '🗄️'},
  {id: 'faceplatesKeystones', linkCategory: 'accessories', icon: '🔌'},
  {id: 'fiberPatchPanels', linkCategory: 'fiber', icon: '📦'},
  {id: 'fiberOpticCables', linkCategory: 'fiber', icon: '💡'},
  {id: 'fiberCordsSM', linkCategory: 'fiber', icon: '🟡'},
  {id: 'fiberCordsOM3', linkCategory: 'fiber', icon: '🟢'},
  {id: 'fiberPigtails', linkCategory: 'fiber', icon: '🧵'},
  {id: 'toolsEquipment', linkCategory: 'accessories', icon: '🛠️'},
  {id: 'fiberTerminalBoxes', linkCategory: 'fiber', icon: '🔲'},
  {id: 'powerDistribution', linkCategory: 'accessories', icon: '🔌'}
] as const;

export default function MasterDataSheetViewer({labels, locale, variant = 'featured'}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({x: 0, y: 0});
  const panStartRef = useRef({x: 0, y: 0});
  const containerRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({x: 0, y: 0});
  }, []);

  const handleOpen = () => {
    resetZoom();
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resetZoom();
  }, [resetZoom]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPan({x: 0, y: 0});
      return next;
    });
  };

  const handleToggleZoom = () => {
    if (zoom === 1) {
      setZoom(2);
    } else {
      resetZoom();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        resetZoom();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleClose, resetZoom]);

  // Mouse pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {x: e.clientX, y: e.clientY};
    panStartRef.current = {x: pan.x, y: pan.y};
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {x: touch.clientX, y: touch.clientY};
    panStartRef.current = {x: pan.x, y: pan.y};
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoom <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className={`master-sheet-card ${variant}`} id="master-sheet">
      <div className="master-sheet-grid">
        {/* Left / Info Side */}
        <div className="master-sheet-info">
          <div className="master-sheet-badge">
            <span className="badge-dot" aria-hidden="true" />
            <span>{labels.badge}</span>
          </div>

          <p className="eyebrow">{labels.eyebrow}</p>
          <h2 className="master-sheet-title">{labels.title}</h2>
          <p className="master-sheet-subtitle">{labels.subtitle}</p>

          <div className="master-sheet-highlights">
            <div className="highlight-item">
              <strong>13</strong>
              <span>{labels.categoriesCount}</span>
            </div>
            <div className="highlight-item">
              <strong>60+</strong>
              <span>{labels.partsCount}</span>
            </div>
            <div className="highlight-item">
              <strong>100%</strong>
              <span>{labels.standards}</span>
            </div>
          </div>

          <div className="master-sheet-actions">
            <button
              type="button"
              onClick={handleOpen}
              className="button button-primary master-btn-inspect"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <span>{labels.ctaInspect}</span>
            </button>

            <a
              href="/logx-product-data-sheet.jpg"
              download="LOGX-Product-Data-Sheet.jpg"
              className="button button-quiet master-btn-download"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{labels.ctaDownload}</span>
            </a>
          </div>

          {/* Quick Category Chips */}
          <div className="master-sheet-chips-wrap">
            <p className="chips-title">{labels.categoriesTitle}</p>
            <div className="master-sheet-chips">
              {CATEGORIES_MAPPING.map((cat) => {
                const labelText = labels.categories[cat.id as keyof typeof labels.categories];
                if (!labelText) return null;
                return (
                  <Link
                    key={cat.id}
                    href={`/${locale}/products?category=${cat.linkCategory}`}
                    className="category-chip"
                    title={`${labels.browseCategory}: ${labelText}`}
                  >
                    <span className="chip-icon" aria-hidden="true">{cat.icon}</span>
                    <span className="chip-text">{labelText}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right / Visual Preview Side */}
        <div className="master-sheet-preview-wrap">
          <div
            className="master-sheet-frame"
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpen();
              }
            }}
            aria-label={labels.inspectHint}
          >
            <div className="master-sheet-image-box">
              <Image
                src="/logx-product-data-sheet.webp"
                alt="LOGX Connectivity Solutions - Complete Product Data Sheet"
                width={1024}
                height={643}
                priority
                className="master-sheet-img"
              />
              <div className="master-sheet-hover-overlay">
                <div className="hover-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>{labels.inspectHint}</span>
                </div>
              </div>
            </div>

            <div className="master-sheet-frame-footer">
              <div className="frame-meta">
                <span className="brand-tag">LOGX® MASTER SHEET</span>
                <span className="meta-sub">High-Resolution Technical Vector & Matrix</span>
              </div>
              <span className="frame-hint">{labels.inspectHint}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Interactive Lightbox Modal */}
      {isOpen && (
        <div
          className="master-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={labels.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          {/* Header Controls HUD */}
          <header className="master-modal-hud">
            <div className="hud-title-col">
              <div className="hud-brand">
                <span className="brand-dot" />
                <strong>LOGX CONNECTIVITY SOLUTIONS</strong>
              </div>
              <span className="hud-desc">{labels.title}</span>
            </div>

            <div className="hud-controls">
              <div className="zoom-indicator">
                {Math.round(zoom * 100)}%
              </div>

              <button
                type="button"
                onClick={handleZoomIn}
                className="hud-btn"
                title={labels.zoomIn}
                aria-label={labels.zoomIn}
                disabled={zoom >= 3.5}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleZoomOut}
                className="hud-btn"
                title={labels.zoomOut}
                aria-label={labels.zoomOut}
                disabled={zoom <= 1}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              <button
                type="button"
                onClick={resetZoom}
                className="hud-btn"
                title={labels.resetZoom}
                aria-label={labels.resetZoom}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>

              <div className="hud-divider" />

              <a
                href="/logx-product-data-sheet.jpg"
                download="LOGX-Product-Data-Sheet.jpg"
                className="hud-btn hud-btn-accent"
                title={labels.ctaDownload}
                aria-label={labels.ctaDownload}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="hud-btn hud-btn-close"
                title={labels.close}
                aria-label={labels.close}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          {/* Canvas Area with Pan & Zoom */}
          <div
            ref={containerRef}
            className={`master-modal-canvas ${zoom > 1 ? 'is-zoomed' : ''} ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleToggleZoom}
          >
            <div
              className="master-modal-stage"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logx-product-data-sheet.jpg"
                alt="LOGX Master Product Data Sheet"
                className="master-modal-image"
                draggable={false}
              />
            </div>
          </div>

          {/* Footer instruction banner */}
          <div className="master-modal-footer">
            <span className="footer-tip">
              💡 {zoom > 1 ? labels.dragHint : labels.inspectHint} · (Esc to close)
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
