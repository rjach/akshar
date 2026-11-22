#!/usr/bin/env bash
# Production build for static hosting (Vercel): the app, then the SEO landing
# pages, sitemap.xml, robots.txt and llms.txt. No backend, no env vars needed;
# SITE_URL (or Vercel's VERCEL_PROJECT_PRODUCTION_URL) sets the canonical URLs.
set -euo pipefail
cd "$(dirname "$0")/.."

npx vite build
npx tsx scripts/generate-seo.ts
