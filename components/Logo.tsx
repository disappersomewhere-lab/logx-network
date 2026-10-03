import Image from 'next/image';
import type {CSSProperties} from 'react';

type LogoProps = {
  /** Overrides the displayed logo height; anything CSS accepts for height. */
  size?: string;
  /** `light` is the white-lettered artwork for ink backgrounds; the X stays red. */
  tone?: 'ink' | 'light';
  className?: string;
};

// Vector artwork lifted from the brand's own profile deck, so it stays sharp
// at cover sizes and in print.
const SOURCES = {
  ink: '/logx-logo.svg',
  light: '/logx-logo-light.svg'
} as const;

export default function Logo({size, tone = 'ink', className = ''}: LogoProps) {
  return (
    <span
      className={`brand-logo brand-logo-image ${className}`.trim()}
      style={size ? {'--logo-height': size} as CSSProperties : undefined}
    >
      <Image src={SOURCES[tone]} alt="LOGX NETWORK" width={323} height={137} priority />
    </span>
  );
}
