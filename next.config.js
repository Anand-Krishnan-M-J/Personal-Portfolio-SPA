// This existing Next config is CommonJS; the content JSON remains the canonical
// SEO source instead of duplicating the production hostname here.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const portfolioConfig = require("./content/portfolio.config.json");

const canonicalSiteUrl = new URL(portfolioConfig.seo.siteUrl);
const canonicalHostname = canonicalSiteUrl.hostname;
const apexHostname = canonicalHostname.startsWith("www.")
  ? canonicalHostname.slice(4)
  : null;
const isDevelopment = process.env.NODE_ENV !== "production";
const privateRobotsDirective =
  "noindex, nofollow, noarchive, nosnippet, noimageindex";
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  `connect-src 'self'${isDevelopment ? " ws: wss:" : ""}`,
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'self' blob:",
  "img-src 'self' data: blob:",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "worker-src 'self' blob:",
].join("; ");

module.exports = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
  images: {
    qualities: [64, 68, 75],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      ...(apexHostname
        ? [
            {
              source: "/:path*",
              has: [{ type: "host", value: apexHostname }],
              destination: `${canonicalSiteUrl.origin}/:path*`,
              permanent: true,
            },
          ]
        : []),
      {
        source: "/projects/:path*",
        destination: "/#work",
        permanent: true,
      },
      {
        source: "/blogs/:path*",
        destination: "/#about",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/",
        permanent: true,
      },
      {
        source: "/superadmin/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        source: "/resume-builder/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: privateRobotsDirective,
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/skills/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};
