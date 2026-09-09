'use client';

import {useState} from 'react';
import Image from 'next/image';

type ProductGalleryProps = {
  images: string[];
  alt: string;
  thumbLabel: string;
};

export default function ProductGallery({images, alt, thumbLabel}: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="gallery-main">
        <Image
          src={current}
          alt={alt}
          fill
          sizes="(max-width: 860px) 92vw, 560px"
          priority
        />
      </div>

      {images.length > 1 ? (
        <div className="gallery-thumbs">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className="gallery-thumb"
              aria-current={index === active}
              aria-label={`${thumbLabel} ${index + 1}`}
              onClick={() => setActive(index)}
            >
              <Image src={image} alt="" fill sizes="90px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
