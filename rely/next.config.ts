import type { NextConfig } from "next";

/**
 * Static export: `npm run build` emits a fully static site to `out/`,
 * which Netlify (or any static host) can serve as-is.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
