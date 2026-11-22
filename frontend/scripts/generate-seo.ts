/**
 * Writes the static SEO landing pages, sitemap.xml, robots.txt and llms.txt
 * into the Vite build output. Run after `vite build`:
 *
 *   npx tsx scripts/generate-seo.ts
 *
 * Env: SITE_URL overrides the production origin (https://akshar.rojanacharya.com).
 * SOURCE_DATE_EPOCH pins the sitemap lastmod.
 * SEO_DIST_DIR overrides the output directory (default: frontend/dist).
 * Rerunning overwrites every file it owns with the same content.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  applySiteUrl,
  generateSeoFiles,
  LAYOUT_NAMES,
  parseLayout,
  resolveBuildDate,
  resolveSiteUrl,
  type Layouts,
  type SeoContext,
} from "./seo/build";

const FRONTEND_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadLayouts(): Layouts {
  const layouts = {} as Layouts;
  for (const name of LAYOUT_NAMES) {
    const path = join(FRONTEND_ROOT, "static/layouts", `${name}.json`);
    layouts[name] = parseLayout(name, JSON.parse(readFileSync(path, "utf8")));
  }
  return layouts;
}

function writeFile(
  distDir: string,
  relativePath: string,
  content: string,
): void {
  const target = join(distDir, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function main(): void {
  const distDir = resolve(
    process.env["SEO_DIST_DIR"] ?? join(FRONTEND_ROOT, "dist"),
  );
  const shellPath = join(distDir, "index.html");
  if (!existsSync(shellPath)) {
    throw new Error(
      `SEO: ${shellPath} not found. Run vite build before generate-seo.`,
    );
  }
  const ctx: SeoContext = {
    siteUrl: resolveSiteUrl(process.env),
    buildDate: resolveBuildDate(process.env, new Date()),
  };

  const files = generateSeoFiles(ctx, loadLayouts());
  for (const [relativePath, content] of files) {
    writeFile(distDir, relativePath, content);
  }
  writeFileSync(shellPath, applySiteUrl(readFileSync(shellPath, "utf8"), ctx));

  console.log(
    `SEO: wrote ${files.size} files to ${distDir} for ${ctx.siteUrl} (lastmod ${ctx.buildDate})`,
  );
  for (const relativePath of files.keys()) console.log(`  ${relativePath}`);
}

main();
