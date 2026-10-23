import type { NextConfig } from "next";

// GovMithra AI — Next.js configuration
// Default: standalone (for dev server + production server)
// For Android/Capacitor builds: use `bun run build:mobile` which sets
// CAPACITOR_BUILD=1 env var → switches to static export mode.

const isCapacitorBuild = process.env.CAPACITOR_BUILD === '1';

const nextConfig: NextConfig = {
  // Standalone for dev/production server. Export for Capacitor (static HTML/JS/CSS).
  output: isCapacitorBuild ? 'export' : 'standalone',
  // Static export requires trailing slashes for compatibility with Capacitor's WebView
  trailingSlash: isCapacitorBuild,
  // Disable image optimization for static export (Capacitor serves local files)
  images: isCapacitorBuild ? { unoptimized: true } : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
