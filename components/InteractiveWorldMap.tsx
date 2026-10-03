'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';

type Hub = {
  id: 'uk' | 'sa';
  city: string;
  country: string;
  name: string;
  roleBadge: string;
  isMain?: boolean;
  coords: { x: number; y: number }; // percentage on map (0-100)
  phones?: string[];
  email: string;
  address: string;
  directionsUrl?: string;
};

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  locale: string;
  hubs: Hub[];
  pageNumber?: string;
};

/**
 * Recreates Page 9 of the official LOGX Catalogue:
 * Stylized World Map with pinpoint markers, red leader tags,
 * and high-fidelity hub details for London HQ and Riyadh Main Distributor.
 */
export default function InteractiveWorldMap({
  eyebrow,
  title,
  subtitle,
  locale,
  hubs,
  pageNumber
}: Props) {
  const [activeHubId, setActiveHubId] = useState<'uk' | 'sa'>('sa');
  const isAr = locale === 'ar';

  const activeHub = hubs.find((h) => h.id === activeHubId) || hubs[0];

  return (
    <section className="locations-map-section">
      <div className="section-heading-centered">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {subtitle && <p className="section-subtitle-max">{subtitle}</p>}
      </div>

      <div className="world-map-canvas-card">
        {/* World Map SVG Canvas */}
        <div className="world-map-container" aria-label="Interactive global footprint map">
          <svg
            className="world-map-svg"
            viewBox="0 0 1000 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* World Landmass Silhouettes (Simplified clean geometric representation) */}
            <g className="world-continents" fill="#dcdcd8" opacity="0.75">
              {/* North America */}
              <path d="M120 70 Q160 50 250 60 Q280 80 270 140 Q220 180 180 220 Q170 260 140 220 Q120 180 90 140 Q100 90 120 70 Z" />
              {/* Central & South America */}
              <path d="M210 240 Q240 240 260 270 Q300 320 280 400 Q250 460 220 440 Q200 380 210 320 Q190 270 210 240 Z" />
              {/* Europe & UK */}
              <path d="M470 70 Q520 60 560 80 Q570 120 540 140 Q500 150 480 130 Q460 110 470 70 Z" />
              {/* British Isles */}
              <circle cx="468" cy="98" r="9" />
              {/* Africa */}
              <path d="M480 160 Q560 160 580 220 Q590 300 550 380 Q510 420 480 380 Q450 320 450 240 Q450 180 480 160 Z" />
              {/* Middle East & Arabian Peninsula */}
              <path d="M570 170 Q620 160 640 190 Q650 240 620 260 Q580 250 560 220 Q560 190 570 170 Z" />
              {/* Asia & Russia */}
              <path d="M570 60 Q720 50 860 80 Q900 130 840 200 Q760 240 680 220 Q640 160 600 130 Q580 90 570 60 Z" />
              {/* India */}
              <path d="M680 190 Q720 200 730 250 Q700 290 680 270 Q660 230 680 190 Z" />
              {/* East Asia & Japan */}
              <path d="M820 140 Q880 150 870 230 Q820 240 800 200 Z" />
              <circle cx="880" cy="140" r="7" />
              {/* Southeast Asia */}
              <path d="M760 270 Q810 270 820 320 Q780 340 750 300 Z" />
              {/* Australia */}
              <path d="M780 340 Q860 330 880 380 Q880 430 820 440 Q770 420 760 380 Q760 350 780 340 Z" />
            </g>

            {/* Connecting Geodesic Flight Paths between London and Riyadh */}
            <g stroke="#d3131b" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
              {/* London (468, 98) to Riyadh (610, 220) */}
              <path d="M468 98 Q520 130 610 220" />
            </g>

            {/* Pulsing Radar Beacons for each location */}
            {hubs.map((hub) => {
              const isActive = activeHubId === hub.id;
              return (
                <g
                  key={hub.id}
                  className={`map-beacon-group ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveHubId(hub.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer Pulsing Wave */}
                  <circle
                    cx={hub.coords.x * 10}
                    cy={hub.coords.y * 5}
                    r={isActive ? '18' : '12'}
                    fill="none"
                    stroke="#d3131b"
                    strokeWidth={isActive ? '2.5' : '1.5'}
                    opacity={isActive ? '0.8' : '0.4'}
                    className="beacon-pulse"
                  />
                  {/* Inner Solid Hub */}
                  <circle
                    cx={hub.coords.x * 10}
                    cy={hub.coords.y * 5}
                    r={isActive ? '7' : '5'}
                    fill="#d3131b"
                  />
                  <circle
                    cx={hub.coords.x * 10}
                    cy={hub.coords.y * 5}
                    r="2.5"
                    fill="#ffffff"
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating Callout Badges mirroring Page 9 layout */}
          <div className="map-callout-overlay">
            {hubs.map((hub) => {
              const isActive = activeHubId === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  className={`map-leader-tag ${hub.id} ${isActive ? 'is-selected' : ''}`}
                  onClick={() => setActiveHubId(hub.id)}
                  style={{
                    left: `${hub.coords.x}%`,
                    top: `${hub.coords.y}%`
                  }}
                >
                  <span className="leader-role-pill">{hub.roleBadge}</span>
                  <strong className="leader-city">{hub.city}</strong>
                  <span className="leader-name">{hub.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Hub Interactive Detail Panel */}
        <div className="active-hub-detail-panel">
          <div className="hub-panel-head">
            <div className="hub-panel-titles">
              <span className="hub-role-tag">{activeHub.roleBadge}</span>
              <h3>{activeHub.city}</h3>
              <p className="hub-company-name">{activeHub.name}</p>
            </div>
            <div className="hub-tab-switches">
              {hubs.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  className={`hub-switch-btn ${h.id === activeHubId ? 'is-active' : ''}`}
                  onClick={() => setActiveHubId(h.id)}
                >
                  {h.city}
                </button>
              ))}
            </div>
          </div>

          <div className="hub-panel-body">
            <div className="hub-info-col">
              <span className="hub-label">{isAr ? 'العنوان' : 'Location Address'}</span>
              <p className="hub-address-text">{activeHub.address}</p>
            </div>

            <div className="hub-info-col">
              <span className="hub-label">{isAr ? 'الاتصال المباشر' : 'Direct Contact'}</span>
              <div className="hub-contacts">
                {activeHub.phones?.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} dir="ltr" className="hub-contact-link">
                    📞 {p}
                  </a>
                ))}
                <a href={`mailto:${activeHub.email}`} className="hub-contact-link">
                  ✉️ {activeHub.email}
                </a>
              </div>
            </div>

            <div className="hub-info-col hub-actions-col">
              {activeHub.directionsUrl && (
                <a
                  href={activeHub.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-primary button-sm"
                >
                  {isAr ? 'الاتجاهات عبر Google Maps ↗' : 'Google Maps Directions ↗'}
                </a>
              )}
            </div>
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
