import type { Layout } from "@monkeytype/schemas/configs";
import type { Language } from "@monkeytype/schemas/languages";

/**
 * Languages that come with their own keyboard. Picking one types through that
 * layout from any physical keyboard, so no Nepali input method is needed.
 * Plain `nepali` keeps the system keyboard for people who already have one.
 */
const LANGUAGE_INPUT_LAYOUTS: Partial<Record<Language, Layout>> = {
  nepali_unicode: "nepali_unicode_romanized",
  nepali_traditional: "nepali_traditional",
  nepali_preeti: "nepali_preeti",
};

/** The language a keyboard variant types: same words, quotes and script. */
const BASE_LANGUAGES: Partial<Record<Language, Language>> = {
  nepali_unicode: "nepali",
  nepali_traditional: "nepali",
  nepali_preeti: "nepali",
};

/** `language` without its keyboard variant, eg. nepali_traditional -> nepali. */
export function getBaseLanguage(language: Language): Language {
  return BASE_LANGUAGES[language] ?? language;
}

/**
 * The layout keystrokes are emulated with: an explicitly chosen layout wins,
 * otherwise the language's own keyboard, otherwise none ("default").
 */
export function getEffectiveInputLayout(
  layout: Layout,
  language: Language,
): Layout {
  if (layout !== "default") return layout;
  return LANGUAGE_INPUT_LAYOUTS[language] ?? "default";
}
