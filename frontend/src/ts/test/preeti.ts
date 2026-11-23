/**
 * Preeti keyboard: the key layout of the legacy Preeti font, still how most
 * Nepali typists learned. Each key types a glyph piece, in visual order:
 * ि comes before its consonant, reph (र्) after its syllable, ो is ा then े,
 * a half form plus ा is the full letter and `m` completes उ→ऊ, प→फ, भ→झ.
 *
 * The test compares Unicode, so keystrokes are composed into Unicode one
 * syllable at a time: a syllable is held until the next one starts (or a
 * space or punctuation key ends it), because its later keys can still
 * rewrite it. The pieces come from `static/layouts/nepali_preeti.json`;
 * ङ, an Alt-code glyph in the font, sits on altgr+`.
 */

/** Layout legend of the reph key; never typed as is, see `REPH`. */
const REPH_LEGEND = "र्";
/** Placeholder for a reph until the syllable it sits on is known. */
const REPH = "{";
/** The `m` key: a glyph completer with no Unicode of its own. */
const COMPLETER = "m";

const SIGNS = "ािीुूृेैोौंःँ";
const VIRAMA = "्";
const PRE_BASE_I = "ि";

/**
 * Rewrites a syllable typed in Preeti order into Unicode. Order matters:
 * glyph completers first, then reordering, then vowel sign combinations.
 */
const COMPOSE_RULES: readonly (readonly [RegExp, string])[] = [
  // the ा bar completes a half form: ष् + ा = ष, क्ष् + ा = क्ष
  [/्ा/gu, ""],
  // `m` typed after a vowel sign still completes the letter before it
  [new RegExp(`([${SIGNS}]+)${COMPLETER}`, "gu"), `${COMPLETER}$1`],
  [/उm/gu, "ऊ"],
  [/पm/gu, "फ"],
  [/भm/gu, "झ"],
  [/त्रm/gu, "क्र"],
  [/त्तm/gu, "क्त"],
  // इ plus the reph glyph draws ई
  [new RegExp(`इ\\${REPH}`, "gu"), "ई"],
  // ि is typed before the consonant cluster it follows in Unicode
  [new RegExp(`${PRE_BASE_I}((?:.${VIRAMA})*[^${VIRAMA}])`, "gu"), "$1ि"],
  // reph is typed after the cluster (and its signs) it sits on
  [
    new RegExp(`((?:.${VIRAMA})*.[${SIGNS}]*)\\${REPH}`, "gu"),
    `${REPH_LEGEND}$1`,
  ],
  // ं and ँ may be typed before the vowel sign they sit on
  [/([ंँ])([ािीुूृेैोौः]+)/gu, "$2$1"],
  [/अ(?:ाे|ेा)/gu, "ओ"],
  [/अ(?:ाै|ैा)/gu, "औ"],
  [/अा/gu, "आ"],
  [/एे/gu, "ऐ"],
  [/ाे|ेा/gu, "ो"],
  [/ाै|ैा/gu, "ौ"],
];

/** Consonants, independent vowels and ि each begin a new syllable. */
const SYLLABLE_START = /^[अ-औक-ह]|^ि$/u;
/** Letters, signs and the two placeholders join the open syllable. */
const SYLLABLE_PART = /^[ऀ-ॣ]|^[{m]$/u;

/**
 * Converts the pieces of one syllable, typed in Preeti order, to Unicode.
 *
 * @param pieces - Key pieces in the order typed, reph as its placeholder
 * @returns The syllable in Unicode (logical) order
 */
export function composePreeti(pieces: readonly string[]): string {
  let text = pieces.join("");
  for (const [pattern, replacement] of COMPOSE_RULES) {
    text = text.replace(pattern, replacement);
  }
  return text;
}

/**
 * Whether the held syllable still waits for its consonant: a lone ि, or a
 * half form, takes the next consonant into the same syllable.
 */
function isWaitingForConsonant(pieces: readonly string[]): boolean {
  const typed = pieces.join("");
  return typed === PRE_BASE_I || typed.endsWith(VIRAMA);
}

/** Text a keystroke releases: a finished syllable and/or a separator. */
export type PreetiOutput = { syllable: string; separator: string };

/**
 * Holds the syllable being typed and releases each one once it can no
 * longer change.
 */
export class PreetiComposer {
  private pieces: string[] = [];

  /**
   * Adds one key's legend.
   *
   * @param legend - The legend the layout emulator produced for the key
   * @returns What to insert now: a finished syllable, a separator, or nothing
   */
  push(legend: string): PreetiOutput {
    // the reph key's legend reads as the consonant र, but it never starts one
    const piece = legend === REPH_LEGEND ? REPH : legend;
    if (!SYLLABLE_PART.test(piece)) {
      return { syllable: this.flush(), separator: piece };
    }
    const startsNew =
      SYLLABLE_START.test(piece) &&
      this.pieces.length > 0 &&
      !isWaitingForConsonant(this.pieces);
    const syllable = startsNew ? this.flush() : "";
    this.pieces.push(piece);
    return { syllable, separator: "" };
  }

  /**
   * Undoes the last held key.
   *
   * @returns false when nothing is held, so the backspace edits the input
   */
  backspace(): boolean {
    return this.pieces.pop() !== undefined;
  }

  /** @returns The held syllable in Unicode, now no longer held */
  flush(): string {
    const syllable = composePreeti(this.pieces);
    this.pieces = [];
    return syllable;
  }

  reset(): void {
    this.pieces = [];
  }
}
