'use client';

type PrintButtonProps = {
  label: string;
  className?: string;
};

/** Opens the browser's print dialog; the datasheet's print stylesheet does the rest. */
export default function PrintButton({label, className = 'button button-quiet'}: PrintButtonProps) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      {label}
    </button>
  );
}
