# Deploying Akshar

Akshar is a static, frontend-only site. There is no backend, no Firebase and no
account system. Everything runs and is stored in the browser:

- the typing test in every Nepali mode and English
- results history, personal bests, settings, theme and font (localStorage)
- anticheat checks (untrusted/synthetic keystrokes and robotic timing invalidate a result)

No environment variables are required.

## Run locally

Requires Node 24 and pnpm (`corepack enable` installs the pinned pnpm).

```bash
pnpm install
cd frontend && npx vite dev        # http://localhost:3000
```

Check the production build:

```bash
bash frontend/scripts/vercel-build.sh
cd frontend && npx vite preview --port 4173
```

The build script runs `vite build`, then `scripts/generate-seo.ts`, which writes
into `frontend/dist`:

- static Nepali/English landing pages (`/nepali-typing-test`, `/nepali-unicode-typing`,
  `/nepali-traditional-typing`, `/nepali-typing-practice`, `/english-typing-test`)
  with unique title, description, canonical URL and JSON-LD
- `sitemap.xml`, `robots.txt`, `llms.txt`

## Deploy on Vercel

`vercel.json` at the repo root holds all settings: pnpm install, the build
script, `frontend/dist` output, rewrites for the landing pages and the SPA, and
security headers.

### Dashboard (Git)

1. Push the repo to GitHub, GitLab or Bitbucket.
2. In Vercel: **Add New → Project**, import the repo.
3. Keep **Root Directory** as the repo root (not `frontend`). Framework preset:
   **Other**. Don't override build, output or install commands.
4. Deploy. Pushes to the production branch deploy to production; other branches
   get preview URLs.

### CLI

```bash
npm i -g vercel
vercel login
vercel            # links the project, creates a preview deployment
vercel --prod     # production deployment
```

### Custom domain and canonical URLs

Add `akshar.rojanacharya.com` under **Project → Settings → Domains** and point a
`CNAME akshar → cname.vercel-dns.com` record at it. Canonical URLs, the
sitemap and robots.txt use `https://akshar.rojanacharya.com` (`BRAND.siteUrl` in
`frontend/scripts/seo/pages.ts`). Set `SITE_URL` only to override it, eg. for a
staging deploy; it is baked in at build time, so redeploy after changing it.

## Other static hosts

Any static host works: run `bash frontend/scripts/vercel-build.sh` and serve
`frontend/dist`. Configure the equivalent of the `vercel.json` rewrites:
`/<guide>` → `/<guide>/index.html` for each landing page, and every other path
without a file extension → `/index.html`.

## CI

`.github/workflows/ci.yml` runs lint + typecheck, unit tests, asset checks and
the same production build Vercel runs.

## Before going public

- Review `frontend/src/privacy-policy.html`, `terms-of-service.html` and
  `security-policy.html` for your jurisdiction.
- Keep the "based on monkeytype" footer link and the About page credit. GPL-3.0
  requires crediting upstream and publishing your modified source.
