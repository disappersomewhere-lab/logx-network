type LogoProps = {
  /** Overrides the wordmark size; anything CSS accepts for font-size. */
  size?: string;
  className?: string;
};

export default function Logo({size, className = ''}: LogoProps) {
  return (
    <span
      className={`brand-logo ${className}`.trim()}
      style={size ? {fontSize: size} : undefined}
      role="img"
      aria-label="LOGX NETWORK"
    >
      <span aria-hidden="true">LOG</span>
      <b aria-hidden="true">X</b>
      <small aria-hidden="true">NETWORK</small>
    </span>
  );
}
