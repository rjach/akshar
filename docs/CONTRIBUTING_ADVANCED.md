# Contributing - Advanced

Use this guide when you need to run Akshar locally, test behaviour, or take screenshots of a change.

## Prerequisites

- [Git](https://git-scm.com/)
- Node.js 24.22.1 (see `.nvmrc`; [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) pick it up automatically)
- pnpm: run `corepack enable` once and the version pinned in `package.json` is used

No database, Firebase project, Docker or config file is needed. Akshar is a static site.

## Run locally

```bash
git clone https://github.com/<your-username>/akshar.git
cd akshar
pnpm install
pnpm dev-fe            # http://localhost:3000, rebuilds on change
```

## Checks before opening a PR

Run these from `frontend/`:

```bash
pnpm oxlint --type-aware --type-check   # lint + typecheck
npx vitest run                          # unit tests
npx vitest run path/to/test.ts          # a single test file
```

From the repo root:

```bash
pnpm build-pkg && pnpm --filter @monkeytype/frontend check-assets   # languages, layouts, themes, quotes
bash frontend/scripts/vercel-build.sh                                # production build + SEO pages
cd frontend && npx vite preview --port 4173                          # serve the production build
```

CI (`.github/workflows/ci.yml`) runs the same steps on every pull request.

## Standards and Guidelines

Formatting and linting are enforced by [Oxc (Oxfmt and Oxlint)](https://github.com/oxc-project/oxc), which runs on every commit through lint-staged. Format files by hand with `npx oxfmt <files>`.

For commit messages and for adding themes, languages, quotes or layouts, see [CONTRIBUTING.md](./CONTRIBUTING.md). Code style rules live in [CODING_STANDARDS.md](../CODING_STANDARDS.md).

## Questions

If you have questions, open a [GitHub discussion or issue](https://github.com/rjach/akshar/issues) or email [hello@rojanacharya.com](mailto:hello@rojanacharya.com).
