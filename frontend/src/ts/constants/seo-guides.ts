/**
 * The static Nepali typing guide pages (built by scripts/generate-seo.ts),
 * linked from the footer. __tests__/seo keeps this list equal to the
 * generator's LANDING_PAGES.
 */
export const SEO_GUIDES: readonly {
  slug: string;
  label: string;
  lang: "ne" | "en";
}[] = [
  { slug: "nepali-typing-test", label: "नेपाली टाइपिङ टेस्ट", lang: "ne" },
  { slug: "nepali-unicode-typing", label: "नेपाली युनिकोड टाइपिङ", lang: "ne" },
  {
    slug: "nepali-traditional-typing",
    label: "ट्रेडिसनल नेपाली टाइपिङ",
    lang: "ne",
  },
  { slug: "nepali-typing-practice", label: "नेपाली टाइपिङ अभ्यास", lang: "ne" },
  { slug: "english-typing-test", label: "English typing test", lang: "en" },
];
