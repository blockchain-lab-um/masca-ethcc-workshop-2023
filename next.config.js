// Content-Security-Policy
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' cdn.vercel-insights.com vercel.live;
  child-src 'none';
  img-src 'self' assets.vercel.com data:;
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  connect-src *;
  frame-src vercel.live;
`;

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    loader: 'default',
  },
  optimizeFonts: true,
  // Security headers and CSP
  // https://nextjs.org/docs/advanced-features/security-headers
  // Not supported with `next export`
  headers: async () => {
    return isProd
      ? [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Strict-Transport-Security',
                value: 'max-age=31536000; includeSubDomains; preload',
              },
              {
                key: 'X-XSS-Protection',
                value: '1; mode=block',
              },
              {
                key: 'X-Frame-Options',
                value: 'DENY',
              },
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
              },
              {
                key: 'X-DNS-Prefetch-Control',
                value: 'on',
              },
              {
                key: 'Referrer-Policy',
                value: 'origin-when-cross-origin',
              },
              {
                key: 'Content-Security-Policy',
                value: contentSecurityPolicy.replace(/\n/g, ''),
              },
            ],
          },
        ]
      : [];
  },
};

module.exports = nextConfig;
