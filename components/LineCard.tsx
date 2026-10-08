import Link from 'next/link';
import Image from 'next/image';

export type LineCardData = {
  href: string;
  image?: string;
  title: string;
  /** Part number, for a line with a single part. */
  code?: string;
  /** Size / variant range, for a line with several parts. */
  range?: string | null;
  /** Whether the line cover is illustrative for at least one included part. */
  representativeImage?: boolean;
  representativeImageLabel?: string;
  /** "12 part numbers" — present only when the line has more than one. */
  parts?: string | null;
  cta: string;
};

type LineCardProps = LineCardData & {
  /** Set on cards above the fold so they are not lazy-loaded. */
  preload?: boolean;
  sizes?: string;
};

/**
 * One card per product line. The photo is the line's cover; the card says how
 * many part numbers sit behind it, so twelve lengths of one patch cord read as
 * one product rather than twelve identical pictures.
 */
export default function LineCard({
  href,
  image,
  title,
  code,
  range,
  representativeImage,
  representativeImageLabel,
  parts,
  cta,
  preload,
  sizes = '(max-width: 720px) 45vw, (max-width: 1024px) 30vw, 250px'
}: LineCardProps) {
  return (
    <Link href={href} className="product-card line-card">
      <div className="product-card-image">
        {image ? (
          <Image
            src={image}
            alt={representativeImage && representativeImageLabel ? representativeImageLabel : title}
            fill
            sizes={sizes}
            preload={preload}
          />
        ) : null}
        {representativeImage && representativeImageLabel ? (
          <span className="representative-image-badge">{representativeImageLabel}</span>
        ) : null}
        {parts ? <span className="line-card-badge">{parts}</span> : null}
      </div>
      <div className="product-card-body">
        {code ? <span className="product-code">{code}</span> : null}
        <h3>{title}</h3>
        {range ? <p className="line-card-range">{range}</p> : null}
        <span className="product-card-foot">
          {cta}
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
