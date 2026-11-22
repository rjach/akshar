import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  applySiteUrl,
  generateSeoFiles,
  LAYOUT_NAMES,
  parseLayout,
  resolveBuildDate,
  resolveSiteUrl,
  siteHomeJsonLd,
  typingSequence,
  type Layouts,
  type SeoContext,
} from "../../scripts/seo/build";
import { LANDING_PAGES } from "../../scripts/seo/pages";
import { SEO_GUIDES } from "../../src/ts/constants/seo-guides";

const FRONTEND = resolve(fileURLToPath(import.meta.url), "../../..");
const readText = (path: string): string =>
  readFileSync(resolve(FRONTEND, path), "utf8");

function rawLayout(name: string): { keys: Record<string, string[][]> } {
  return JSON.parse(readText(`static/layouts/${name}.json`)) as {
    keys: Record<string, string[][]>;
  };
}

const layouts = Object.fromEntries(
  LAYOUT_NAMES.map((name) => [name, parseLayout(name, rawLayout(name))]),
) as Layouts;

const ctx: SeoContext = {
  siteUrl: resolveSiteUrl({ SITE_URL: "https://akshar.example/" }),
  buildDate: "2026-11-22",
};
const files = generateSeoFiles(ctx, layouts);

function pageDoc(slug: string): Document {
  const html = files.get(`${slug}/index.html`);
  if (html === undefined) throw new Error(`no page for ${slug}`);
  return new DOMParser().parseFromString(html, "text/html");
}

const attr = (doc: Document, selector: string, name: string): string =>
  doc.querySelector(selector)?.getAttribute(name) ?? "";

type JsonLdNode = Record<string, unknown> & { "@type": string };

function graph(doc: Document): JsonLdNode[] {
  const script = doc.querySelector('script[type="application/ld+json"]');
  const parsed = JSON.parse(script?.textContent ?? "") as {
    "@graph": JsonLdNode[];
  };
  return parsed["@graph"];
}

const textOf = (el: Element): string =>
  (el.textContent ?? "").replace(/\s+/g, " ").trim();

describe("generate-seo", () => {
  it("writes one page per landing page plus sitemap, robots and llms.txt", () => {
    expect([...files.keys()]).toEqual([
      "english-typing-test/index.html",
      "nepali-traditional-typing/index.html",
      "nepali-typing-practice/index.html",
      "nepali-typing-test/index.html",
      "nepali-unicode-typing/index.html",
      "llms.txt",
      "robots.txt",
      "sitemap.xml",
    ]);
  });

  it("gives every page a unique title, description and canonical on SITE_URL", () => {
    const docs = LANDING_PAGES.map((page) => pageDoc(page.slug));
    const titles = docs.map((doc) => doc.title);
    const descriptions = docs.map((doc) =>
      attr(doc, 'meta[name="description"]', "content"),
    );
    const canonicals = docs.map((doc) =>
      attr(doc, 'link[rel="canonical"]', "href"),
    );

    expect(new Set(titles).size).toBe(LANDING_PAGES.length);
    expect(new Set(descriptions).size).toBe(LANDING_PAGES.length);
    expect(canonicals).toEqual(
      LANDING_PAGES.map((page) => `https://akshar.example/${page.slug}`),
    );
    for (const doc of docs) {
      expect(attr(doc, 'meta[property="og:url"]', "content")).toBe(
        attr(doc, 'link[rel="canonical"]', "href"),
      );
      expect(attr(doc, 'meta[property="og:image"]', "content")).toBe(
        "https://akshar.example/images/mtsocial.png",
      );
      expect(doc.querySelectorAll("h1")).toHaveLength(1);
    }
  });

  it("links the CTA to the page's typing language", () => {
    const ctas = (slug: string): string[] =>
      [...pageDoc(slug).querySelectorAll("a.cta")].map(
        (a) => a.getAttribute("href") ?? "",
      );
    expect(ctas("nepali-traditional-typing")).toEqual([
      "/?language=nepali_traditional",
      "/?language=nepali_traditional",
    ]);
    expect(ctas("english-typing-test")[0]).toBe("/?language=english");
  });

  it("describes the main page as a free bilingual WebApplication", () => {
    const app = graph(pageDoc("nepali-typing-test")).find(
      (node) => node["@type"] === "WebApplication",
    );
    expect(app?.["offers"]).toEqual({
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    });
    expect(app?.["inLanguage"]).toEqual(["ne", "en"]);
    expect(app?.["url"]).toBe("https://akshar.example/");
  });

  it("puts in FAQPage exactly the questions and answers visible on the page", () => {
    const doc = pageDoc("nepali-typing-test");
    const faq = graph(doc).find((node) => node["@type"] === "FAQPage");
    const questions = faq?.["mainEntity"] as {
      name: string;
      acceptedAnswer: { text: string };
    }[];
    const visible = [...doc.querySelectorAll(".faq-item")].map((item) => ({
      name: textOf(item.querySelector("h3") as Element),
      answer: [...item.querySelectorAll("p")].map(textOf).join(" "),
    }));

    expect(questions.map((q) => q.name)).toEqual(visible.map((v) => v.name));
    expect(questions.map((q) => q.acceptedAnswer.text)).toEqual(
      visible.map((v) => v.answer),
    );
    expect(questions[0]?.name).toBe(
      "के मलाई नेपाली किबोर्ड इन्स्टल गर्नुपर्छ? Do I need a Nepali keyboard installed?",
    );
  });

  it("gives guide pages a two-level BreadcrumbList with absolute URLs", () => {
    const crumbs = graph(pageDoc("nepali-unicode-typing")).find(
      (node) => node["@type"] === "BreadcrumbList",
    );
    expect(crumbs?.["itemListElement"]).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Akshar",
        item: "https://akshar.example/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "नेपाली युनिकोड टाइपिङ",
        item: "https://akshar.example/nepali-unicode-typing",
      },
    ]);
  });

  it("lists home and every page in the sitemap with absolute URLs and lastmod", () => {
    const sitemap = files.get("sitemap.xml") ?? "";
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toEqual([
      "https://akshar.example/",
      "https://akshar.example/english-typing-test",
      "https://akshar.example/nepali-traditional-typing",
      "https://akshar.example/nepali-typing-practice",
      "https://akshar.example/nepali-typing-test",
      "https://akshar.example/nepali-unicode-typing",
    ]);
    expect(sitemap.match(/<lastmod>2026-11-22<\/lastmod>/g)).toHaveLength(6);
    expect(files.get("robots.txt")).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://akshar.example/sitemap.xml\n",
    );
  });

  it.each([
    ["nepali-unicode-typing", "nepali_unicode_romanized"],
    ["nepali-traditional-typing", "nepali_traditional"],
  ])("renders a %s key chart row for every key in %s.json", (slug, layout) => {
    const raw = rawLayout(layout);
    const table = pageDoc(slug).querySelector(
      `table.key-chart[data-layout="${layout}"]`,
    );
    const bodies = [...(table?.querySelectorAll("tbody") ?? [])];
    expect(
      bodies.map((body) => body.querySelectorAll("tr[data-key]").length),
    ).toEqual(
      ["row1", "row2", "row3", "row4", "row5"].map((r) => raw.keys[r]?.length),
    );
  });

  it("shows normal and shift legends from the traditional layout", () => {
    const row = pageDoc("nepali-traditional-typing").querySelector(
      'tr[data-key="Q"]',
    );
    expect([...(row?.querySelectorAll("td") ?? [])].map(textOf)).toEqual([
      "त्र",
      "त्त",
    ]);
  });

  it("derives example keystrokes from the layout", () => {
    expect(typingSequence(layouts.nepali_unicode_romanized, "नेपाल")).toEqual([
      "N",
      "E",
      "P",
      "A",
      "L",
    ]);
    expect(typingSequence(layouts.nepali_traditional, "त्रिभुवन")).toEqual([
      "Q",
      "L",
      "E",
      "'",
      "J",
      "G",
    ]);
  });

  it("is deterministic for the same SITE_URL and date", () => {
    expect(generateSeoFiles(ctx, layouts)).toEqual(files);
  });
});

describe("site URL and build date", () => {
  it("uses SITE_URL, else the production domain", () => {
    expect(resolveSiteUrl({ SITE_URL: "https://akshar.np/" })).toBe(
      "https://akshar.np",
    );
    expect(resolveSiteUrl({})).toBe("https://akshar.rojanacharya.com");
    expect(() => resolveSiteUrl({ SITE_URL: "akshar" })).toThrow(
      'SEO: site URL "akshar" is not a valid absolute URL',
    );
  });

  it("pins lastmod with SOURCE_DATE_EPOCH", () => {
    expect(
      resolveBuildDate({ SOURCE_DATE_EPOCH: "1767225600" }, new Date(0)),
    ).toBe("2026-01-01");
  });
});

describe("SPA snippets", () => {
  it("keeps the app's JSON-LD equal to the generator's home JSON-LD", () => {
    const head = readText("src/index.html");
    const json =
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(
        head,
      )?.[1];
    expect(JSON.parse(json ?? "")).toEqual(
      siteHomeJsonLd({ siteUrl: "%SITE_URL%", buildDate: "" }),
    );
    expect(applySiteUrl(head, ctx)).toContain(
      '<link rel="canonical" href="https://akshar.example/" />',
    );
  });

  it("links every landing page from the app footer", () => {
    expect(SEO_GUIDES.map((guide) => guide.slug)).toEqual(
      LANDING_PAGES.map((page) => page.slug),
    );
  });
});

describe("vercel.json", () => {
  it("serves every landing page before the app's catch-all rewrite", () => {
    const config = JSON.parse(readText("../vercel.json")) as {
      rewrites: { source: string; destination: string }[];
    };
    const [guides, catchAll] = config.rewrites;
    const slugs = /^\/:guide\((.+)\)$/.exec(guides?.source ?? "")?.[1];
    expect(slugs?.split("|")).toEqual(LANDING_PAGES.map((page) => page.slug));
    expect(guides?.destination).toBe("/:guide/index.html");
    expect(catchAll?.destination).toBe("/index.html");
  });
});
