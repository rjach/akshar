import {
  BRAND,
  CTA_LABEL,
  LANDING_PAGES,
  TYPING_MODES,
  type Bilingual,
  type Block,
  type FaqItem,
  type LandingPage,
  type LayoutName,
  type TypingLanguageId,
} from "./pages";

export type SeoContext = { siteUrl: string; buildDate: string };

const ROW_NAMES = ["row1", "row2", "row3", "row4", "row5"] as const;
type RowName = (typeof ROW_NAMES)[number];

export type KeyLegend = [normal: string, shift?: string];
export type Layout = { keys: Record<RowName, KeyLegend[]> };
export type Layouts = Record<LayoutName, Layout>;

export const LAYOUT_NAMES: LayoutName[] = [
  "nepali_unicode_romanized",
  "nepali_traditional",
];

/** US QWERTY (ANSI) key caps, in the same order as the layout JSON rows. */
const ANSI_KEY_CAPS: Record<RowName, string[]> = {
  row1: ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  row2: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  row3: ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
  row4: ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
  row5: ["Space"],
};

const ROW_LABELS: Record<RowName, Bilingual> = {
  row1: { ne: "अंक पङ्क्ति", en: "Number row" },
  row2: { ne: "माथिल्लो पङ्क्ति", en: "Top row" },
  row3: { ne: "होम रो", en: "Home row" },
  row4: { ne: "तल्लो पङ्क्ति", en: "Bottom row" },
  row5: { ne: "स्पेस", en: "Space bar" },
};

const HALANT = "्";
const INVISIBLE_LEGENDS: Record<string, string> = {
  "‍": "ZWJ",
  "‌": "ZWNJ",
  " ": "Space",
};
const DOTTED_CIRCLE = "◌";
const LEADING_COMBINING_MARK = /^\p{M}/u;
const SITE_URL_PLACEHOLDER = "%SITE_URL%";

// ---------------------------------------------------------------- boundary

/**
 * Resolves the public origin, without a trailing slash.
 * SITE_URL overrides the production domain (eg. for a staging deploy).
 */
export function resolveSiteUrl(
  env: Record<string, string | undefined>,
): string {
  const explicit = env["SITE_URL"]?.trim();
  const raw =
    explicit !== undefined && explicit !== "" ? explicit : BRAND.siteUrl;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`SEO: site URL "${raw}" is not a valid absolute URL`);
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`SEO: site URL "${raw}" must use http or https`);
  }
  return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, "");
}

/** YYYY-MM-DD in UTC. SOURCE_DATE_EPOCH (seconds) pins it for reproducible builds. */
export function resolveBuildDate(
  env: Record<string, string | undefined>,
  now: Date,
): string {
  const epoch = env["SOURCE_DATE_EPOCH"]?.trim();
  const date =
    epoch !== undefined && epoch !== "" ? new Date(Number(epoch) * 1000) : now;
  if (Number.isNaN(date.getTime())) {
    throw new Error(`SEO: SOURCE_DATE_EPOCH "${epoch}" is not a unix time`);
  }
  return date.toISOString().slice(0, 10);
}

export function parseLayout(name: string, json: unknown): Layout {
  const fail = (why: string): never => {
    throw new Error(`SEO: layout "${name}" ${why}`);
  };
  if (typeof json !== "object" || json === null || !("keys" in json)) {
    return fail("has no keys object");
  }
  const keys = json.keys;
  if (typeof keys !== "object" || keys === null) return fail("has no keys");
  const rows = {} as Record<RowName, KeyLegend[]>;
  for (const row of ROW_NAMES) {
    const value = (keys as Record<string, unknown>)[row];
    if (!Array.isArray(value)) return fail(`is missing ${row}`);
    if (value.length !== ANSI_KEY_CAPS[row].length) {
      fail(
        `${row} has ${value.length} keys, expected ${ANSI_KEY_CAPS[row].length} (ansi)`,
      );
    }
    rows[row] = value.map((legend: unknown, index) => {
      const valid =
        Array.isArray(legend) &&
        legend.length >= 1 &&
        legend.length <= 2 &&
        legend.every((l) => typeof l === "string");
      if (!valid) return fail(`${row}[${index}] is not [normal, shift?]`);
      return legend as KeyLegend;
    });
  }
  return { keys: rows };
}

// ---------------------------------------------------------------- keyboard model

export type KeyChartRow = {
  row: RowName;
  keyCap: string;
  normal: string;
  shift: string | undefined;
};

export function keyChartRows(layout: Layout): KeyChartRow[] {
  return ROW_NAMES.flatMap((row) =>
    layout.keys[row].map(([normal, shift], index) => ({
      row,
      keyCap: ANSI_KEY_CAPS[row][index] ?? "?",
      normal,
      shift,
    })),
  );
}

/** Keys to press for `text`, longest legend first. Throws if a character has no key. */
export function typingSequence(layout: Layout, text: string): string[] {
  const keyForLegend = new Map<string, string>();
  for (const { keyCap, normal, shift } of keyChartRows(layout)) {
    if (!keyForLegend.has(normal)) keyForLegend.set(normal, keyCap);
    if (shift !== undefined && !keyForLegend.has(shift)) {
      keyForLegend.set(shift, `Shift + ${keyCap}`);
    }
  }
  const legends = [...keyForLegend.keys()].sort((a, b) => b.length - a.length);
  const keys: string[] = [];
  let rest = text;
  while (rest.length > 0) {
    const legend = legends.find((l) => l !== "" && rest.startsWith(l));
    if (legend === undefined) {
      throw new Error(`SEO: no key types "${rest[0]}" in "${text}"`);
    }
    keys.push(keyForLegend.get(legend) as string);
    rest = rest.slice(legend.length);
  }
  return keys;
}

/** Keys whose legend is a conjunct or half letter (contains a halant plus more). */
export function conjunctKeys(
  layout: Layout,
): { key: string; legend: string }[] {
  return keyChartRows(layout).flatMap(({ keyCap, normal, shift }) =>
    [
      { key: keyCap, legend: normal },
      { key: `Shift + ${keyCap}`, legend: shift ?? "" },
    ].filter(({ legend }) => legend.length > 1 && legend.includes(HALANT)),
  );
}

export function displayLegend(legend: string): string {
  const invisible = INVISIBLE_LEGENDS[legend];
  if (invisible !== undefined) return invisible;
  return LEADING_COMBINING_MARK.test(legend)
    ? `${DOTTED_CIRCLE}${legend}`
    : legend;
}

// ---------------------------------------------------------------- urls

export function homeUrl(ctx: SeoContext): string {
  return `${ctx.siteUrl}/`;
}

export function pageUrl(ctx: SeoContext, slug: string): string {
  return `${ctx.siteUrl}/${slug}`;
}

export function startTypingHref(languageId: TypingLanguageId): string {
  return `/?language=${languageId}`;
}

export function absoluteAsset(ctx: SeoContext, path: string): string {
  return `${ctx.siteUrl}${path}`;
}

// ---------------------------------------------------------------- html helpers

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** JSON for a <script> body: "<" is escaped so content can never close the tag. */
export function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function bilingualInline(text: Bilingual): string {
  return `<span lang="ne">${escapeHtml(text.ne)}</span> <span class="en" lang="en">${escapeHtml(text.en)}</span>`;
}

function bilingualParagraphs(text: Bilingual): string {
  return `<p lang="ne">${escapeHtml(text.ne)}</p>\n<p class="en" lang="en">${escapeHtml(text.en)}</p>`;
}

/** The visible text of a bilingual pair, as JSON-LD repeats it. */
export function bilingualText(text: Bilingual): string {
  return `${text.ne} ${text.en}`;
}

function kbd(key: string): string {
  return key
    .split(" + ")
    .map((part) => `<kbd>${escapeHtml(part)}</kbd>`)
    .join(" + ");
}

function ctaButton(languageId: TypingLanguageId): string {
  return `<p class="cta-wrap"><a class="cta" href="${escapeHtml(startTypingHref(languageId))}"><span lang="ne">${escapeHtml(CTA_LABEL.ne)}</span> <span lang="en">/ ${escapeHtml(CTA_LABEL.en)}</span></a></p>`;
}

// ---------------------------------------------------------------- blocks

function renderModes(): string {
  const items = TYPING_MODES.map((mode) => {
    const guide =
      mode.guideSlug === undefined
        ? ""
        : `<a href="/${mode.guideSlug}"><span lang="ne">गाइड</span> <span lang="en">/ Guide</span></a>`;
    return `<li class="mode">
<h3>${bilingualInline(mode.name)}</h3>
${bilingualParagraphs(mode.summary)}
<p class="mode-links"><a href="${escapeHtml(startTypingHref(mode.languageId))}"><span lang="ne">टाइप गर्नुहोस्</span> <span lang="en">/ Type</span></a>${guide === "" ? "" : ` ${guide}`}</p>
</li>`;
  });
  return `<ul class="modes">\n${items.join("\n")}\n</ul>`;
}

function renderExamples(layout: Layout, words: string[]): string {
  const rows = words.map((word) => {
    const keys = typingSequence(layout, word).map(kbd).join(" ");
    return `<li><span class="word" lang="ne">${escapeHtml(word)}</span> <span class="keys">${keys}</span></li>`;
  });
  return `<h3><span lang="ne">उदाहरण</span> <span class="en" lang="en">Examples</span></h3>
<ul class="examples">\n${rows.join("\n")}\n</ul>`;
}

function renderHomeRow(layout: Layout): string {
  const keys = keyChartRows(layout)
    .filter((key) => key.row === "row3")
    .map(
      (key) =>
        `<li>${kbd(key.keyCap)} <span lang="ne">${escapeHtml(displayLegend(key.normal))}</span></li>`,
    );
  const legends = layout.keys.row3.map(([normal]) => normal).join(" ");
  const [qLegend] = layout.keys.row2[0] ?? [""];
  return `${bilingualParagraphs({
    ne: `होम रोमा औंला राख्नुहोस्: ${legends}। Q थिच्दा ${qLegend} आउँछ।`,
    en: `Rest your fingers on the home row: ${legends}. Q types ${qLegend}.`,
  })}
<ul class="home-row">\n${keys.join("\n")}\n</ul>`;
}

function renderConjunctKeys(layout: Layout): string {
  const rows = conjunctKeys(layout).map(
    ({ key, legend }) =>
      `<li>${kbd(key)} <span lang="ne">${escapeHtml(displayLegend(legend))}</span></li>`,
  );
  return `<ul class="conjuncts">\n${rows.join("\n")}\n</ul>`;
}

function renderKeyChart(layout: Layout, layoutName: LayoutName): string {
  const bodies = ROW_NAMES.map((row) => {
    const keys = keyChartRows(layout)
      .filter((key) => key.row === row)
      .map((key) => {
        const conjunct = (legend: string | undefined): string =>
          legend !== undefined && legend.length > 1 && legend.includes(HALANT)
            ? ' class="conjunct"'
            : "";
        return `<tr data-key="${escapeHtml(key.keyCap)}"><th scope="row">${kbd(key.keyCap)}</th><td lang="ne"${conjunct(key.normal)}>${escapeHtml(displayLegend(key.normal))}</td><td lang="ne"${conjunct(key.shift)}>${key.shift === undefined ? "" : escapeHtml(displayLegend(key.shift))}</td></tr>`;
      });
    return `<tbody>
<tr class="row-label"><th colspan="3" scope="rowgroup">${bilingualInline(ROW_LABELS[row])}</th></tr>
${keys.join("\n")}
</tbody>`;
  });
  return `<div class="table-scroll" role="region" aria-label="Key chart" tabindex="0">
<table class="key-chart" data-layout="${layoutName}">
<thead><tr><th scope="col"><span lang="ne">कुञ्जी</span> <span lang="en">/ Key</span></th><th scope="col"><span lang="ne">सामान्य</span> <span lang="en">/ Normal</span></th><th scope="col">Shift</th></tr></thead>
${bodies.join("\n")}
</table>
</div>`;
}

function renderBlock(block: Block, layouts: Layouts): string {
  switch (block.kind) {
    case "paragraph":
      return bilingualParagraphs(block.text);
    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      const items = block.items.map(
        (item) =>
          `<li><span lang="ne">${escapeHtml(item.ne)}</span><br><span class="en" lang="en">${escapeHtml(item.en)}</span></li>`,
      );
      return `<${tag}>\n${items.join("\n")}\n</${tag}>`;
    }
    case "modes":
      return renderModes();
    case "examples":
      return renderExamples(layouts[block.layout], block.words);
    case "homeRow":
      return renderHomeRow(layouts[block.layout]);
    case "conjunctKeys":
      return renderConjunctKeys(layouts[block.layout]);
    case "keyChart":
      return renderKeyChart(layouts[block.layout], block.layout);
    default:
      return unknownBlock(block);
  }
}

function unknownBlock(block: never): never {
  throw new Error(`SEO: unknown block ${JSON.stringify(block)}`);
}

function renderFaq(faq: FaqItem[]): string {
  if (faq.length === 0) return "";
  const items = faq.map(
    (item) => `<div class="faq-item">
<h3>${bilingualInline(item.question)}</h3>
${bilingualParagraphs(item.answer)}
</div>`,
  );
  return `<section aria-labelledby="faq">
<h2 id="faq"><span lang="ne">प्रायः सोधिने प्रश्न</span> <span class="en" lang="en">FAQ</span></h2>
${items.join("\n")}
</section>`;
}

// ---------------------------------------------------------------- structured data

function websiteNode(ctx: SeoContext): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": `${homeUrl(ctx)}#website`,
    url: homeUrl(ctx),
    name: BRAND.name,
    alternateName: BRAND.nameNe,
    description: BRAND.tagline,
    inLanguage: ["ne", "en"],
  };
}

export function webApplicationNode(ctx: SeoContext): Record<string, unknown> {
  return {
    "@type": "WebApplication",
    "@id": `${homeUrl(ctx)}#app`,
    name: BRAND.name,
    alternateName: BRAND.nameNe,
    url: homeUrl(ctx),
    description: `${BRAND.tagline}. Type Devanagari with the Nepali Unicode or Traditional keyboard from any keyboard, or switch to English.`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    inLanguage: ["ne", "en"],
    image: absoluteAsset(ctx, BRAND.socialImage.path),
    offers: { "@type": "Offer", price: "0", priceCurrency: "NPR" },
  };
}

export function siteHomeJsonLd(ctx: SeoContext): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [websiteNode(ctx), webApplicationNode(ctx)],
  };
}

export function pageJsonLd(
  page: LandingPage,
  ctx: SeoContext,
): Record<string, unknown> {
  const url = pageUrl(ctx, page.slug);
  const webPage: Record<string, unknown> = {
    "@type": page.faq.length > 0 ? "FAQPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: "ne",
    isPartOf: { "@id": `${homeUrl(ctx)}#website` },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    dateModified: ctx.buildDate,
  };
  if (page.faq.length > 0) {
    webPage["mainEntity"] = page.faq.map((item) => ({
      "@type": "Question",
      name: bilingualText(item.question),
      acceptedAnswer: { "@type": "Answer", text: bilingualText(item.answer) },
    }));
  }
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: BRAND.name,
        item: homeUrl(ctx),
      },
      { "@type": "ListItem", position: 2, name: page.h1.ne, item: url },
    ],
  };
  const graph: Record<string, unknown>[] = [
    websiteNode(ctx),
    webPage,
    breadcrumb,
  ];
  if (page.isMainPage) graph.push(webApplicationNode(ctx));
  return { "@context": "https://schema.org", "@graph": graph };
}

// ---------------------------------------------------------------- page

const PAGE_CSS = `@font-face{font-family:"Lexend Deca";src:url(/webfonts/LexendDeca-Regular.woff2) format("woff2");font-display:swap}
@font-face{font-family:"Noto Sans Devanagari";src:url(/webfonts/NotoSansDevanagari-Regular.woff2) format("woff2");font-display:swap}
:root{--bg:#323437;--main:#e2b714;--sub:#646669;--sub-alt:#2c2e31;--text:#d1d0c5;--muted:#a8a79e;color-scheme:dark}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--text);font-family:"Lexend Deca","Noto Sans Devanagari",system-ui,sans-serif;line-height:1.7;font-size:1.0625rem}
a{color:var(--main)}
a:focus-visible,.table-scroll:focus-visible{outline:2px solid var(--main);outline-offset:3px;border-radius:4px}
.skip{position:absolute;left:-999px;top:0;background:var(--main);color:var(--bg);padding:.5rem 1rem}
.skip:focus{left:1rem}
.wrap{max-width:52rem;margin:0 auto;padding:0 1rem}
header.site{border-bottom:1px solid var(--sub-alt)}
header.site .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem 1.5rem;padding-top:1rem;padding-bottom:1rem}
.brand{display:inline-flex;align-items:center;gap:.5rem;color:var(--text);text-decoration:none;font-size:1.25rem}
.brand img{display:block}
.brand [lang=ne]{color:var(--main)}
nav.guides ul{display:flex;flex-wrap:wrap;gap:.25rem 1rem;list-style:none;margin:0;padding:0}
nav.guides a{color:var(--muted);text-decoration:none}
nav.guides a:hover,nav.guides a[aria-current=page]{color:var(--main)}
.crumbs ol{display:flex;flex-wrap:wrap;gap:.5rem;list-style:none;margin:1.5rem 0 0;padding:0;font-size:.875rem;color:var(--muted)}
.crumbs li+li::before{content:"/";margin-right:.5rem;color:var(--sub)}
h1{font-size:clamp(1.75rem,5vw,2.5rem);line-height:1.3;margin:1rem 0 .5rem;font-weight:400}
h1 .en{display:block;font-size:.55em;color:var(--muted)}
h2{font-size:1.5rem;font-weight:400;margin:2.5rem 0 1rem;color:var(--main);line-height:1.35}
h3{font-size:1.125rem;font-weight:400;margin:1.5rem 0 .5rem;line-height:1.4}
h2 .en,h3 .en{color:var(--muted);font-size:.8em}
p{margin:0 0 .75rem}
.en{color:var(--muted)}
p.en{margin-top:-.5rem}
li{margin:.5rem 0}
.cta-wrap{margin:1.5rem 0}
.cta{display:inline-block;background:var(--main);color:var(--bg);text-decoration:none;padding:.75rem 1.5rem;border-radius:.5rem;font-size:1.125rem}
.cta:hover{filter:brightness(1.1)}
.cta:focus-visible{outline:2px solid var(--text);outline-offset:3px}
.modes{list-style:none;padding:0;display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))}
.mode{background:var(--sub-alt);border-radius:.5rem;padding:1rem;margin:0}
.mode h3{margin-top:0}
.mode-links{display:flex;gap:1rem;margin:0}
kbd{display:inline-block;min-width:1.6em;text-align:center;font-family:inherit;font-size:.875em;background:var(--sub-alt);border:1px solid var(--sub);border-bottom-width:2px;border-radius:.3rem;padding:0 .35em;color:var(--text)}
.examples,.home-row,.conjuncts{list-style:none;padding:0}
.examples .word{display:inline-block;min-width:5rem;font-size:1.25rem}
.home-row,.conjuncts{display:flex;flex-wrap:wrap;gap:.5rem 1.25rem}
.home-row li,.conjuncts li{margin:0}
.table-scroll{overflow-x:auto}
table{border-collapse:collapse;width:100%;min-width:18rem}
th,td{text-align:left;padding:.35rem .75rem;border-bottom:1px solid var(--sub-alt)}
thead th{color:var(--muted);font-weight:400}
td[lang=ne]{font-size:1.25rem}
td.conjunct{color:var(--main)}
.row-label th{padding-top:1.25rem;color:var(--main);font-weight:400}
.faq-item{border-top:1px solid var(--sub-alt);padding-top:.25rem}
footer.site{border-top:1px solid var(--sub-alt);margin-top:3rem;padding:1.5rem 0 2.5rem;font-size:.875rem;color:var(--muted)}
footer.site a{color:var(--muted)}
@media (prefers-reduced-motion:no-preference){a{transition:color .15s}}`;

function renderHead(page: LandingPage, ctx: SeoContext): string {
  const url = pageUrl(ctx, page.slug);
  const image = absoluteAsset(ctx, BRAND.socialImage.path);
  const imageAlt = `${BRAND.name} (${BRAND.nameNe}): ${BRAND.tagline}`;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(page.title)}</title>
<meta name="description" content="${escapeHtml(page.description)}">
<link rel="canonical" href="${escapeHtml(url)}">
<meta name="theme-color" content="${BRAND.themeColor}">
<link rel="icon" type="image/svg+xml" href="${BRAND.favicon}">
<link rel="apple-touch-icon" sizes="180x180" href="${BRAND.appleTouchIcon}">
<link rel="preload" href="/webfonts/NotoSansDevanagari-Regular.woff2" as="font" type="font/woff2" crossorigin>
<meta property="og:type" content="website">
<meta property="og:site_name" content="${BRAND.name}">
<meta property="og:locale" content="ne_NP">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:title" content="${escapeHtml(page.title)}">
<meta property="og:description" content="${escapeHtml(page.description)}">
<meta property="og:url" content="${escapeHtml(url)}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:image:width" content="${BRAND.socialImage.width}">
<meta property="og:image:height" content="${BRAND.socialImage.height}">
<meta property="og:image:alt" content="${escapeHtml(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(page.title)}">
<meta name="twitter:description" content="${escapeHtml(page.description)}">
<meta name="twitter:image" content="${escapeHtml(image)}">
<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}">
<script type="application/ld+json">${jsonForScript(pageJsonLd(page, ctx))}</script>
<style>${PAGE_CSS}</style>`;
}

function renderGuideNav(current: LandingPage): string {
  const links = LANDING_PAGES.map((page) => {
    const currentAttr =
      page.slug === current.slug ? ' aria-current="page"' : "";
    return `<li><a href="/${page.slug}"${currentAttr}><span lang="ne">${escapeHtml(page.navLabel.ne)}</span></a></li>`;
  });
  return `<nav class="guides" aria-label="Guides">\n<ul>\n${links.join("\n")}\n</ul>\n</nav>`;
}

export function renderLandingPage(
  page: LandingPage,
  ctx: SeoContext,
  layouts: Layouts,
): string {
  const sections = page.sections.map(
    (section) => `<section aria-labelledby="${section.id}">
<h2 id="${section.id}">${bilingualInline(section.heading)}</h2>
${section.blocks.map((block) => renderBlock(block, layouts)).join("\n")}
</section>`,
  );
  return `<!doctype html>
<html lang="ne" dir="ltr">
<head>
${renderHead(page, ctx)}
</head>
<body>
<a class="skip" href="#main"><span lang="ne">मुख्य भागमा जानुहोस्</span> <span lang="en">/ Skip to content</span></a>
<header class="site">
<div class="wrap">
<a class="brand" href="/"><img src="${BRAND.favicon}" width="28" height="28" alt=""><span lang="en">${BRAND.name}</span> <span lang="ne">${BRAND.nameNe}</span></a>
${renderGuideNav(page)}
</div>
</header>
<main id="main" class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">${BRAND.name}</a></li><li aria-current="page"><span lang="ne">${escapeHtml(page.h1.ne)}</span></li></ol></nav>
<h1>${bilingualInline(page.h1)}</h1>
${bilingualParagraphs(page.lead)}
${ctaButton(page.languageId)}
${sections.join("\n")}
${renderFaq(page.faq)}
${ctaButton(page.languageId)}
</main>
<footer class="site">
<div class="wrap">
<p><span lang="ne">${BRAND.nameNe}: ${BRAND.taglineNe}।</span> <span lang="en">${BRAND.name}: ${BRAND.tagline}.</span></p>
<p lang="en">Akshar is an open source fork of <a href="${BRAND.upstreamUrl}" rel="noopener">${BRAND.upstreamName}</a>, licensed under <a href="${BRAND.licenseUrl}" rel="noopener license">${BRAND.license}</a>.</p>
</div>
</footer>
</body>
</html>
`;
}

// ---------------------------------------------------------------- site files

function sortedPages(): LandingPage[] {
  return [...LANDING_PAGES].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function buildSitemap(ctx: SeoContext): string {
  const urls = [
    homeUrl(ctx),
    ...sortedPages().map((p) => pageUrl(ctx, p.slug)),
  ];
  const entries = urls.map(
    (url) =>
      `  <url>\n    <loc>${escapeHtml(url)}</loc>\n    <lastmod>${ctx.buildDate}</lastmod>\n  </url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
}

export function buildRobots(ctx: SeoContext): string {
  return `User-agent: *
Allow: /

Sitemap: ${ctx.siteUrl}/sitemap.xml
`;
}

export function buildLlmsTxt(ctx: SeoContext): string {
  const modes = TYPING_MODES.map(
    (mode) =>
      `- ${mode.name.en} (${mode.name.ne}), \`language=${mode.languageId}\`: ${mode.summary.en}`,
  );
  const guides = sortedPages().map(
    (page) =>
      `- [${page.title}](${pageUrl(ctx, page.slug)}): ${page.description}`,
  );
  return `# ${BRAND.name} (${BRAND.nameNe})

> ${BRAND.tagline}. Free, no account or sign up, runs in the browser. Results and settings are stored in the browser's localStorage. Open source fork of ${BRAND.upstreamName} under ${BRAND.license}.

Akshar types standard Unicode Devanagari. The Nepali Unicode and Traditional modes emulate those keyboard layouts from any physical keyboard, so no Nepali keyboard needs to be installed. Preeti is a legacy non-Unicode font and is not used.

WPM = characters of correctly typed words (spaces included) / 5 / minutes. Every Unicode character counts, so क्ष is three characters.

Start a test in a given mode: ${homeUrl(ctx)}?language=<id>

## Typing modes

${modes.join("\n")}

## Guides

- [${BRAND.name} typing test](${homeUrl(ctx)}): the app itself.
${guides.join("\n")}
`;
}

/** Replaces the placeholder used by seo/index-head.html in the built SPA shell. */
export function applySiteUrl(html: string, ctx: SeoContext): string {
  return html.split(SITE_URL_PLACEHOLDER).join(ctx.siteUrl);
}

/** Every generated file, keyed by path relative to dist, in a stable order. */
export function generateSeoFiles(
  ctx: SeoContext,
  layouts: Layouts,
): Map<string, string> {
  const files = new Map<string, string>();
  for (const page of sortedPages()) {
    files.set(`${page.slug}/index.html`, renderLandingPage(page, ctx, layouts));
  }
  files.set("llms.txt", buildLlmsTxt(ctx));
  files.set("robots.txt", buildRobots(ctx));
  files.set("sitemap.xml", buildSitemap(ctx));
  return files;
}
