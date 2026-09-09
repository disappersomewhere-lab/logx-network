'use client';

export default function Error({reset}: {error: Error & {digest?: string}; reset: () => void}) {
  return <div className="route-state"><p className="eyebrow">500</p><h1>Something went wrong.</h1><button className="button button-primary" onClick={reset}>Try again</button></div>;
}