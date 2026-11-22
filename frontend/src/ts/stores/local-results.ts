/**
 * Every saved result lives in this browser's localStorage: Akshar has no
 * server. Personal bests and averages are derived from the list, never stored
 * on their own, so they can't drift out of sync with it.
 */
import { DifficultySchema, ModeSchema } from "@monkeytype/schemas/shared";
import { LanguageSchema } from "@monkeytype/schemas/languages";
import { createSignal } from "solid-js";
import { z } from "zod";

import { LocalStorageWithSchema } from "../utils/local-storage-with-schema";

const STORAGE_KEY = "aksharResults";
/** Oldest results are dropped past this, keeping localStorage well under its quota. */
export const MAX_STORED_RESULTS = 1000;
const AVERAGE_WINDOW = 10;

export const LocalResultSchema = z.object({
  timestamp: z.number(),
  wpm: z.number().nonnegative(),
  rawWpm: z.number().nonnegative(),
  acc: z.number().min(0).max(100),
  consistency: z.number().min(0).max(100),
  mode: ModeSchema,
  mode2: z.string(),
  language: LanguageSchema,
  punctuation: z.boolean(),
  numbers: z.boolean(),
  difficulty: DifficultySchema,
  lazyMode: z.boolean(),
  funbox: z.array(z.string()),
  testDuration: z.number().nonnegative(),
  afkDuration: z.number().nonnegative(),
  /**
   * whether it may count as a pb at all (not bailed out, no funbox that
   * forbids pbs...): ineligible results stay in the history only
   */
  pbEligible: z.boolean(),
  /** whether this was a personal best when it was saved */
  isPb: z.boolean(),
});
export type LocalResult = z.infer<typeof LocalResultSchema>;

/** What makes two results comparable for a personal best. */
export type PbCategory = Pick<
  LocalResult,
  | "mode"
  | "mode2"
  | "language"
  | "punctuation"
  | "numbers"
  | "difficulty"
  | "lazyMode"
>;

const storage = new LocalStorageWithSchema({
  key: STORAGE_KEY,
  schema: z.array(LocalResultSchema),
  fallback: [],
});

const [getLocalResults, setLocalResults] = createSignal<LocalResult[]>(
  storage.get(),
);

/** All saved results, oldest first. */
export { getLocalResults };

function isSameCategory(a: PbCategory, b: PbCategory): boolean {
  return (
    a.mode === b.mode &&
    a.mode2 === b.mode2 &&
    a.language === b.language &&
    a.punctuation === b.punctuation &&
    a.numbers === b.numbers &&
    a.difficulty === b.difficulty &&
    a.lazyMode === b.lazyMode
  );
}

/** The best pb-eligible result in `category`, or undefined if there's none yet. */
export function getLocalPb(
  category: PbCategory,
  results: readonly LocalResult[] = getLocalResults(),
): LocalResult | undefined {
  let best: LocalResult | undefined;
  for (const result of results) {
    if (!result.pbEligible || !isSameCategory(result, category)) continue;
    if (best === undefined || result.wpm > best.wpm) best = result;
  }
  return best;
}

/**
 * Saves a result. An ineligible one (eg. bailed out, or a funbox that doesn't
 * allow pbs) still goes to the history, it just can't become the pb.
 */
export function addLocalResult(
  result: Omit<LocalResult, "isPb" | "pbEligible">,
  pbEligible: boolean,
): { isPb: boolean } {
  const previousPb = getLocalPb(result);
  const isPb = pbEligible && result.wpm > (previousPb?.wpm ?? 0);

  const next = [...getLocalResults(), { ...result, pbEligible, isPb }].slice(
    -MAX_STORED_RESULTS,
  );
  storage.set(next);
  setLocalResults(next);
  return { isPb };
}

export function clearLocalResults(): void {
  storage.set([]);
  setLocalResults([]);
}

/** Average speed and accuracy of the last 10 results in `category`. */
export function getLocalAverage(
  category: PbCategory,
): { wpm: number; acc: number } | undefined {
  const recent = getLocalResults()
    .filter((result) => isSameCategory(result, category))
    .slice(-AVERAGE_WINDOW);
  if (recent.length === 0) return undefined;
  const sum = recent.reduce(
    (total, result) => ({
      wpm: total.wpm + result.wpm,
      acc: total.acc + result.acc,
    }),
    { wpm: 0, acc: 0 },
  );
  return { wpm: sum.wpm / recent.length, acc: sum.acc / recent.length };
}
