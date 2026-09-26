import Image from 'next/image';
import type {CSSProperties} from 'react';

type LogoProps = {
  /** Overrides the displayed logo height; anything CSS accepts for height. */
  size?: string;
  className?: string;
};

export default function Logo({size, className = ''}: LogoProps) {
  return (
    <span
      className={`brand-logo brand-logo-image ${className}`.trim()}
      style={size ? {'--logo-height': size} as CSSProperties : undefined}
    >
      <Image
        src="/logx-logo.png"
        alt="LOGX NETWORK"
        width={122}
        height={57}
        priority
      />
    </span>
  );
}
