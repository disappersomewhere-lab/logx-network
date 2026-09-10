import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const isProduction = process.env.NODE_ENV === 'production';

// Next injects inline bootstrap scripts and styles, so a nonce-free policy has
// to allow 'unsafe-inline' for those two directives. The rest of the policy
// still does real work: it blocks script and frame sources this site never
// uses, and pins where forms may post. Turbopack needs 'unsafe-eval' in dev.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Dev needs the Turbopack HMR socket; production talks to nothing but itself.
  `connect-src 'self'${isProduction ? '' : ' ws: wss:'}`,
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests'
].join('; ');

const securityHeaders = [
  {key: 'Content-Security-Policy', value: contentSecurityPolicy},
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'X-Frame-Options', value: 'DENY'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'},
  // Only meaningful over HTTPS, so it is left off local development.
  ...(isProduction
    ? [{key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'}]
    : [])
];

const nextConfig: NextConfig = {
  // Do not advertise the framework and version to scanners.
  poweredByHeader: false,

  async headers() {
    return [{source: '/:path*', headers: securityHeaders}];
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
