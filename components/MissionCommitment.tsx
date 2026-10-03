import React from 'react';
import Logo from '@/components/Logo';

type Props = {
  eyebrow?: string;
  title?: string;
  missionPill: string;
  missionText: string;
  commitmentPill: string;
  commitmentText: string;
  pageNumber?: string;
  locale?: string;
};

/**
 * Recreates the iconic dual-card layout from Page 4 of the official LOGX Catalogue:
 * - Red pill with vertical stem & pin for "Our Mission"
 * - Dark pill with vertical stem & pin for "Our Commitment"
 */
export default function MissionCommitment({
  eyebrow,
  title,
  missionPill,
  missionText,
  commitmentPill,
  commitmentText,
  pageNumber,
  locale = 'en'
}: Props) {
  const isAr = locale === 'ar';

  return (
    <section className="mission-commitment-section">
      {(eyebrow || title) && (
        <div className="section-heading-centered">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2>{title}</h2>}
        </div>
      )}

      <div className="mission-commitment-grid">
        {/* Card 1: Our Mission */}
        <div className="mc-column">
          <div className="mc-pill-wrapper">
            <span className="mc-pill mc-pill-red">{missionPill}</span>
            <div className="mc-connector mc-connector-red" aria-hidden="true">
              <span className="mc-connector-line" />
              <span className="mc-connector-node" />
            </div>
          </div>

          <div className="mc-card mc-card-mission">
            <div className="mc-card-head">
              <Logo size="1.25rem" />
              <span className="mc-card-badge">{isAr ? 'رسالة لوجكس' : 'Core Mission'}</span>
            </div>
            <p className="mc-card-text">{missionText}</p>
          </div>
        </div>

        {/* Card 2: Our Commitment */}
        <div className="mc-column">
          <div className="mc-pill-wrapper">
            <span className="mc-pill mc-pill-dark">{commitmentPill}</span>
            <div className="mc-connector mc-connector-dark" aria-hidden="true">
              <span className="mc-connector-line" />
              <span className="mc-connector-node" />
            </div>
          </div>

          <div className="mc-card mc-card-commitment">
            <div className="mc-card-head">
              <Logo size="1.25rem" />
              <span className="mc-card-badge">{isAr ? 'عهد الجودة' : 'Unwavering Promise'}</span>
            </div>
            <p className="mc-card-text">{commitmentText}</p>
          </div>
        </div>
      </div>

      {pageNumber && (
        <div className="mc-editorial-footer" aria-hidden="true">
          <span className="mc-page-number">{pageNumber}</span>
          <span className="mc-footer-line" />
          <Logo size="0.95rem" />
        </div>
      )}
    </section>
  );
}
