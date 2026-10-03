import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ConstellationMesh from '@/components/ConstellationMesh';

type Props = {
  locale: string;
  isInteractive?: boolean;
};

/**
 * Recreates the official "UTP Passive Network Infrastructure Products" Sheet
 * from the PDF (Publication.pdf) with 100% vector clarity, high-definition photos,
 * and direct links to catalog products.
 */
export default function UtpPassiveSheet({ locale }: Props) {
  return (
    <div className="utp-sheet-document" dir="ltr">
      {/* Background Constellation Mesh */}
      <ConstellationMesh opacity={0.3} />

      {/* Top Banner Header */}
      <header className="utp-sheet-header">
        <div className="utp-header-brand">
          <Logo size="1.6rem" />
          <span className="utp-header-tagline">Connect with confidence</span>
        </div>
        <div className="utp-header-title-box">
          <h1 className="utp-sheet-title">UTP Passive Network Infrastructure Products</h1>
          <span className="utp-sheet-subtitle">Official Engineering Specification & Matrix</span>
        </div>
      </header>

      {/* 5 Column Grid matching the PDF */}
      <div className="utp-sheet-grid">
        {/* Column 1: Cables */}
        <div className="utp-col">
          <div className="utp-col-tab utp-tab-coral">
            <span>Cables</span>
          </div>

          <div className="utp-col-content">
            {/* CAT6 UTP */}
            <div className="utp-item-card">
              <div className="utp-item-photo">
                <Image
                  src="/products/photos/cat6-cable-01.webp"
                  alt="LOGX CAT6 UTP"
                  width={140}
                  height={110}
                  className="utp-img"
                />
              </div>
              <div className="utp-item-details">
                <div className="utp-brand-badge">
                  <Logo size="0.85rem" /> <strong>CAT6 UTP</strong>
                </div>
                <p className="utp-spec-text">
                  LAN CABLE(305M) 24 AWG, BARE COPPER 0.52 MM PASS FLUKE TEST, UTP, SOLID CABLE GREY
                </p>
                <div className="utp-part-tags">
                  <Link
                    href={`/${locale}/products/cat6-utp-cable`}
                    className="utp-part-chip"
                    title="View Product & Datasheet"
                  >
                    LXC6UUPVG305
                  </Link>
                </div>
              </div>
            </div>

            {/* CAT6A UTP */}
            <div className="utp-item-card">
              <div className="utp-item-photo">
                <Image
                  src="/products/photos/cat6-cable-01.webp"
                  alt="LOGX CAT6A UTP"
                  width={140}
                  height={110}
                  className="utp-img"
                />
              </div>
              <div className="utp-item-details">
                <div className="utp-brand-badge">
                  <Logo size="0.85rem" /> <strong>CAT6A UTP</strong>
                </div>
                <p className="utp-spec-text">
                  LAN CABLE(305M) COPPER CABLE 0.54MM, CATEGORY 6A, 4 PAIR, U/UTP, 23 AWG SOLID
                </p>
                <div className="utp-part-tags">
                  <Link
                    href={`/${locale}/products/cat6a-utp-cable`}
                    className="utp-part-chip"
                    title="View Product & Datasheet"
                  >
                    LXC6AUUPVG305
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Patch Cord */}
        <div className="utp-col">
          <div className="utp-col-tab utp-tab-coral">
            <span>Patch Cord</span>
          </div>

          <div className="utp-col-content">
            {/* CAT6A Patch Cords */}
            <div className="utp-item-card">
              <div className="utp-item-photo">
                <Image
                  src="/products/photos/patch-cord-cat6a-01.webp"
                  alt="LOGX Cat6A UTP Patch Cords"
                  width={140}
                  height={110}
                  className="utp-img"
                />
              </div>
              <div className="utp-item-details">
                <div className="utp-brand-badge">
                  <Logo size="0.85rem" /> <strong>Cat6A UTP</strong>
                </div>
                <p className="utp-spec-text">
                  Stranded 4PX28AWG + cross + PVC + RJ45, gold plated pins, 10G verified
                </p>
                <div className="utp-part-tags">
                  {['LXPC6AUUPVG0.5', 'LXPC6AUUPVG1', 'LXPC6AUUPVG3', 'LXPC6AUUPVG5', 'LXPC6AUUPVG10', 'LXPC6UUPVG0.25'].map((pn) => (
                    <Link
                      key={pn}
                      href={`/${locale}/datasheets`}
                      className="utp-part-chip"
                      title="Part Number Specification"
                    >
                      {pn}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* CAT6 Patch Cords */}
            <div className="utp-item-card">
              <div className="utp-item-photo">
                <Image
                  src="/products/photos/patch-cord-cat6-long-01.webp"
                  alt="LOGX Cat6 UTP Patch Cords"
                  width={140}
                  height={110}
                  className="utp-img"
                />
              </div>
              <div className="utp-item-details">
                <div className="utp-brand-badge">
                  <Logo size="0.85rem" /> <strong>Cat6 UTP</strong>
                </div>
                <p className="utp-spec-text">
                  4PX28AWG + cross + PVC + RJ45, gold plated pins, pass fluke test
                </p>
                <div className="utp-part-tags">
                  {['LXPC6UUPVG0.5', 'LXPC6UUPVG1', 'LXPC6UUPVG3', 'LXPC6UUPVG5', 'LXPC6UUPVG10'].map((pn) => (
                    <Link
                      key={pn}
                      href={`/${locale}/datasheets`}
                      className="utp-part-chip"
                      title="Part Number Specification"
                    >
                      {pn}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Faceplate & Keystone */}
        <div className="utp-col">
          <div className="utp-col-tab utp-tab-coral">
            <span>Faceplate & Keystone</span>
          </div>

          <div className="utp-col-content">
            {/* Faceplates */}
            <div className="utp-item-card">
              <div className="utp-item-photo">
                <Image
                  src="/products/photos/faceplate-2-port-01.webp"
                  alt="LOGX F1007 Faceplates"
                  width={140}
                  height={110}
                  className="utp-img"
                />
              </div>
              <div className="utp-item-details">
                <div className="utp-brand-badge">
                  <Logo size="0.85rem" /> <strong>F1007 1 / 2 Port</strong>
                </div>
                <p className="utp-spec-text">
                  Glossy UK Standard Faceplate with shuttered dust covers
                </p>
                <div className="utp-part-tags">
                  <Link href={`/${locale}/products/faceplate-single`} className="utp-part-chip">
                    LXA10 (1-Port)
                  </Link>
                  <Link href={`/${locale}/products/faceplate-dual`} className="utp-part-chip">
                    LXA12 (2-Port)
                  </Link>
                </div>
              </div>
            </div>

            {/* Keystones */}
            <div className="utp-item-card">
              <div className="utp-item-photo">
                <Image
                  src="/products/photos/keystone-cat6a-01.webp"
                  alt="LOGX K1014 Keystone Jacks"
                  width={140}
                  height={110}
                  className="utp-img"
                />
              </div>
              <div className="utp-item-details">
                <div className="utp-brand-badge">
                  <Logo size="0.85rem" /> <strong>K1014 Keystones</strong>
                </div>
                <p className="utp-spec-text">
                  UTP Cat6 & Cat6A Keystone Jack 180 Degree Toolless termination
                </p>
                <div className="utp-part-tags">
                  <Link href={`/${locale}/products/cat6-keystone`} className="utp-part-chip">
                    LXCJ6UFT (Cat6)
                  </Link>
                  <Link href={`/${locale}/products/cat6a-keystone`} className="utp-part-chip">
                    LXCJ6AUFT (Cat6A)
                  </Link>
                </div>
              </div>
            </div>

            {/* Plug & Boot Section embedded in Column */}
            <div className="utp-sub-section">
              <div className="utp-col-tab utp-tab-coral utp-tab-sm">
                <span>Plug & Boot</span>
              </div>
              <div className="utp-item-card utp-item-compact">
                <div className="utp-item-photo">
                  <Image
                    src="/products/photos/rj45-plug-01.webp"
                    alt="LOGX RJ45 Plugs"
                    width={100}
                    height={75}
                    className="utp-img"
                  />
                </div>
                <div className="utp-item-details">
                  <p className="utp-spec-text" style={{ margin: 0 }}>
                    <strong>LOGX Boot</strong> (Blue, Grey, Yellow, Green): <code>LXCPPTC6</code><br />
                    <strong>LOGX S0288</strong> 8P8C FTP RJ45 Plug: <code>LXCPSTC6A</code><br />
                    <strong>LOGX S0088</strong> 8P8C UTP RJ45 Plug (3U): <code>LXCPUTC6</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 4 & 5: Patch Panel & Cable Management */}
        <div className="utp-col utp-col-wide">
          <div className="utp-col-tab utp-tab-coral">
            <span>Patch Panel & Cable Management</span>
          </div>

          <div className="utp-col-content">
            {/* Cable Managers */}
            <div className="utp-item-card">
              <div className="utp-item-photo">
                <Image
                  src="/products/photos/cable-manager-1u-01.webp"
                  alt="LOGX Cable Managers"
                  width={150}
                  height={80}
                  className="utp-img"
                />
              </div>
              <div className="utp-item-details">
                <div className="utp-brand-badge">
                  <Logo size="0.85rem" /> <strong>Metal Cable Managers</strong>
                </div>
                <p className="utp-spec-text">
                  1U & 2U 19-inch Rackmount Metal Cable Managers with brush / finger slots
                </p>
                <div className="utp-part-tags">
                  <Link href={`/${locale}/products/cable-manager-1u`} className="utp-part-chip">
                    LXCPCMNM1 (1U 24)
                  </Link>
                  <Link href={`/${locale}/products/cable-manager-2u`} className="utp-part-chip">
                    LXCPCMNM2 (2U 48)
                  </Link>
                </div>
              </div>
            </div>

            {/* Patch Panels */}
            <div className="utp-item-card">
              <div className="utp-item-photo">
                <Image
                  src="/products/photos/patch-panel-24-01.webp"
                  alt="LOGX Patch Panels"
                  width={150}
                  height={80}
                  className="utp-img"
                />
              </div>
              <div className="utp-item-details">
                <div className="utp-brand-badge">
                  <Logo size="0.85rem" /> <strong>UTP Patch Panels Blank</strong>
                </div>
                <p className="utp-spec-text">
                  P1224 (24-Port 1U) & P1248 (48-Port 2U) Loaded / Blank Keystone Snap-in Panels
                </p>
                <div className="utp-part-tags">
                  <Link href={`/${locale}/products/patch-panel-24`} className="utp-part-chip">
                    LXPP6U2410 (24-Port)
                  </Link>
                  <Link href={`/${locale}/products/patch-panel-48`} className="utp-part-chip">
                    LXPP6U4820 (48-Port)
                  </Link>
                </div>
              </div>
            </div>

            {/* Fiber Optic & Rack Accessory Callout */}
            <div className="utp-banner-callout">
              <div className="callout-head">
                <span className="callout-tag">Complete System Integration</span>
                <strong>Fluke Certified Copper & Optical Backbone</strong>
              </div>
              <p className="callout-desc">
                Manufactured to ANSI/TIA-568.2-D, ISO/IEC 11801, and IEEE 802.3 standards with 100% channel verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sheet Footer matching PDF */}
      <footer className="utp-sheet-footer">
        <div className="utp-footer-ref">
          <span>LOGX Network 2024 / PNIP /MB/V1.1/24</span>
          <span className="utp-footer-dot">•</span>
          <span>100% Fluke Tested & RoHS Compliant</span>
        </div>
        <div className="utp-footer-brand">
          <Logo size="1.2rem" />
        </div>
      </footer>
    </div>
  );
}
