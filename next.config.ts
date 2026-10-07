import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permanent IA redirects — query strings are preserved by Next.js defaults.
  // Evaluated before `/collections/[slug]`, so label slugs never render there.
  async redirects() {
    return [
      {
        source: "/collections/new-arrivals",
        destination: "/new-arrivals",
        permanent: true,
      },
      {
        source: "/collections/best-sellers",
        destination: "/best-sellers",
        permanent: true,
      },
    ];
  },
  images: {
    // Mostly-static ecommerce imagery — cache optimized variants for 30 days.
    minimumCacheTTL: 2592000,
    // Demo uses trusted local SVG placeholders; real raster photos later still
    // benefit from optimization. Sandboxed CSP keeps the SVGs inert.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "https", hostname: "localhost", pathname: "/**" },
      // Cloudflare R2 public bucket hosts (API catalogue media)
      { protocol: "https", hostname: "**.r2.dev", pathname: "/**" },
    ],
  },
};

export default nextConfig;
