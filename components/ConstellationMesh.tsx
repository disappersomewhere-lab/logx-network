import React from 'react';

type Props = {
  className?: string;
  variant?: 'subtle' | 'vibrant' | 'dense';
  opacity?: number;
};

/**
 * LOGX Constellation Network Mesh
 * Recreates the signature brand identity seen across the official LOGX Profile & Catalogue:
 * delicate polygonal lattice lines with vivid LOGX Red network nodes (#E31E24).
 */
export default function ConstellationMesh({
  className = '',
  opacity = 0.85
}: Props) {
  return (
    <div
      className={`constellation-mesh-wrap ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg
        className="constellation-mesh-svg"
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d3131b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d3131b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lineGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d3131b" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#c9c9c5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#d3131b" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="lineGradGrey" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c9c9c5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#e2e2df" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Major Lattice Interconnects */}
        <g stroke="url(#lineGradGrey)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6">
          <line x1="80" y1="120" x2="220" y2="80" />
          <line x1="220" y1="80" x2="380" y2="160" />
          <line x1="380" y1="160" x2="520" y2="100" />
          <line x1="520" y1="100" x2="680" y2="210" />
          <line x1="680" y1="210" x2="840" y2="140" />
          <line x1="840" y1="140" x2="1020" y2="240" />
          <line x1="1020" y1="240" x2="1180" y2="130" />
          <line x1="1180" y1="130" x2="1360" y2="190" />

          <line x1="140" y1="360" x2="310" y2="280" />
          <line x1="310" y1="280" x2="490" y2="390" />
          <line x1="490" y1="390" x2="690" y2="320" />
          <line x1="690" y1="320" x2="880" y2="420" />
          <line x1="880" y1="420" x2="1080" y2="350" />
          <line x1="1080" y1="350" x2="1280" y2="460" />
        </g>

        {/* Secondary Cross-Lines */}
        <g stroke="url(#lineGradRed)" strokeWidth="1.2" opacity="0.45">
          <line x1="220" y1="80" x2="310" y2="280" />
          <line x1="380" y1="160" x2="490" y2="390" />
          <line x1="520" y1="100" x2="690" y2="320" />
          <line x1="680" y1="210" x2="880" y2="420" />
          <line x1="840" y1="140" x2="1080" y2="350" />
          <line x1="1020" y1="240" x2="1280" y2="460" />
          <line x1="690" y1="320" x2="1020" y2="240" />
          <line x1="380" y1="160" x2="680" y2="210" />
          <line x1="1180" y1="130" x2="1080" y2="350" />
        </g>

        {/* Tertiary Webbing for High-Tech Depth */}
        <g stroke="#d3131b" strokeWidth="0.8" opacity="0.25">
          <line x1="80" y1="120" x2="140" y2="360" />
          <line x1="220" y1="80" x2="490" y2="390" />
          <line x1="520" y1="100" x2="880" y2="420" />
          <line x1="840" y1="140" x2="1280" y2="460" />
          <line x1="1180" y1="130" x2="1360" y2="190" />
          <line x1="680" y1="210" x2="490" y2="390" />
        </g>

        {/* Glowing Halo Nodes */}
        <g>
          {[
            [220, 80],
            [380, 160],
            [520, 100],
            [680, 210],
            [840, 140],
            [1020, 240],
            [1180, 130],
            [310, 280],
            [490, 390],
            [690, 320],
            [880, 420],
            [1080, 350],
            [1280, 460]
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="14"
              fill="url(#nodeGlow)"
              opacity="0.35"
            />
          ))}
        </g>

        {/* Core LOGX Brand Red Nodes */}
        <g fill="#d3131b">
          <circle cx="80" cy="120" r="3.5" />
          <circle cx="220" cy="80" r="4.5" />
          <circle cx="380" cy="160" r="4" />
          <circle cx="520" cy="100" r="5" />
          <circle cx="680" cy="210" r="4.5" />
          <circle cx="840" cy="140" r="5.5" />
          <circle cx="1020" cy="240" r="4.5" />
          <circle cx="1180" cy="130" r="4" />
          <circle cx="1360" cy="190" r="3.5" />

          <circle cx="140" cy="360" r="3" />
          <circle cx="310" cy="280" r="4.5" />
          <circle cx="490" cy="390" r="5" />
          <circle cx="690" cy="320" r="5.5" />
          <circle cx="880" cy="420" r="4.5" />
          <circle cx="1080" cy="350" r="5" />
          <circle cx="1280" cy="460" r="3.5" />
        </g>

        {/* Minor Grey Auxiliary Nodes */}
        <g fill="#94a3b8">
          <circle cx="160" cy="200" r="2.5" opacity="0.6" />
          <circle cx="440" cy="260" r="2.5" opacity="0.6" />
          <circle cx="600" cy="160" r="2.5" opacity="0.6" />
          <circle cx="760" cy="280" r="2.5" opacity="0.6" />
          <circle cx="950" cy="180" r="2.5" opacity="0.6" />
          <circle cx="1140" cy="290" r="2.5" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
