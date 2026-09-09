import Link from 'next/link';
import Image from 'next/image';
import type {Locale, Product} from '@/lib/catalog';

type ProductCardProps = {
  product: Product;
  locale: Locale;
  viewLabel: string;
  /** Set on the handful of cards above the fold so they are not lazy-loaded. */
  priority?: boolean;
};

export default function ProductCard({product, locale, viewLabel, priority}: ProductCardProps) {
  const [cover] = product.images;

  return (
    <Link href={`/${locale}/products/${product.slug}`} className="product-card">
      <div className="product-card-image">
        {cover ? (
          <Image
            src={cover}
            alt={product.name[locale]}
            fill
            sizes="(max-width: 720px) 45vw, (max-width: 1024px) 30vw, 250px"
            priority={priority}
          />
        ) : null}
      </div>
      <div className="product-card-body">
        <span className="product-code">{product.partNumber}</span>
        <h3>{product.name[locale]}</h3>
        <p>{product.summary[locale]}</p>
        <span className="product-card-foot">
          {viewLabel}
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
