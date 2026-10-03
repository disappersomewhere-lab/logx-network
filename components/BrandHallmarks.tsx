import React from 'react';

type Props = {
  locale: string;
  className?: string;
};

/**
 * Recreates the official circular hallmark badges from Page 3 and Page 5 of the PDF:
 * - Reliable. High-Performance
 * - Environmentally Friendly
 * - Direct Replacement Warranty
 * - Showroom Stock Ready
 */
export default function BrandHallmarks({ locale, className = '' }: Props) {
  const isAr = locale === 'ar';

  const items = [
    {
      id: 'reliable',
      title: isAr ? 'موثوقية وأداء فائق' : 'Reliable. High-Performance',
      desc: isAr ? 'كابلات ووصلات مختبرة 100% بأجهزة Fluke' : '100% Channel Tested & Fluke Certified',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    },
    {
      id: 'eco',
      title: isAr ? 'صديق للبيئة' : 'Environmentally Friendly',
      desc: isAr ? 'مطابق لمواصفات RoHS و REACH و LSZH' : 'RoHS, REACH & Low-Smoke Zero Halogen',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      )
    },
    {
      id: 'warranty',
      title: isAr ? 'ضمان استبدال مباشر فوري' : 'Direct Replacement Warranty',
      desc: isAr ? 'سياسة استبدال فورية بدون أي تعقيدات' : '“No questions asked” replacement policy',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'stock',
      title: isAr ? 'توفر فوري في المعرض' : 'Always in Stock & Ready',
      desc: isAr ? 'تسليم فوري للمشاريع والمقاولين' : 'Immediate showroom dispatch for projects',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    }
  ];

  return (
    <div className={`brand-hallmarks-strip ${className}`}>
      <div className="hallmarks-grid">
        {items.map((item) => (
          <div className="hallmark-badge-card" key={item.id}>
            <div className="hallmark-circle-icon" aria-hidden="true">
              {item.icon}
            </div>
            <div className="hallmark-content">
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
