import { afterEach, describe, expect, it } from "vitest";

import {
  addLocalResult,
  clearLocalResults,
  getLocalAverage,
  getLocalPb,
  getLocalResults,
  LocalResult,
  MAX_STORED_RESULTS,
} from "../../src/ts/stores/local-results";

function result(
  overrides: Partial<LocalResult> = {},
): Omit<LocalResult, "isPb" | "pbEligible"> {
  return {
    timestamp: 1,
    wpm: 40,
    rawWpm: 42,
    acc: 95,
    consistency: 80,
    mode: "time",
    mode2: "30",
    language: "nepali_unicode",
    punctuation: false,
    numbers: false,
    difficulty: "normal",
    lazyMode: false,
    funbox: [],
    testDuration: 30,
    afkDuration: 0,
    ...overrides,
  };
}

afterEach(() => clearLocalResults());

describe("local results", () => {
  it("marks a faster result in the same test type as a pb", () => {
    expect(addLocalResult(result({ wpm: 40 }), true)).toEqual({ isPb: true });
    expect(addLocalResult(result({ wpm: 35 }), true)).toEqual({ isPb: false });
    expect(addLocalResult(result({ wpm: 50 }), true)).toEqual({ isPb: true });
    expect(getLocalPb(result())?.wpm).toBe(50);
  });

  it("keeps pbs per test type and language", () => {
    addLocalResult(result({ wpm: 60, language: "english" }), true);
    expect(addLocalResult(result({ wpm: 30 }), true)).toEqual({ isPb: true });
    expect(getLocalPb(result({ mode2: "60" }))).toBeUndefined();
  });

  it("saves ineligible results without making them pbs", () => {
    expect(addLocalResult(result({ wpm: 99 }), false)).toEqual({
      isPb: false,
    });
    expect(getLocalResults()).toHaveLength(1);
    expect(getLocalPb(result())).toBeUndefined();
  });

  it("persists to localStorage", () => {
    addLocalResult(result({ wpm: 44 }), true);
    const stored = JSON.parse(
      localStorage.getItem("aksharResults") ?? "[]",
    ) as LocalResult[];
    expect(stored.map((it) => it.wpm)).toEqual([44]);
  });

  it("drops the oldest results past the cap", () => {
    for (let i = 0; i < MAX_STORED_RESULTS + 5; i++) {
      addLocalResult(result({ timestamp: i }), true);
    }
    const results = getLocalResults();
    expect(results).toHaveLength(MAX_STORED_RESULTS);
    expect(results[0]?.timestamp).toBe(5);
  });

  it("averages the last 10 results of a test type", () => {
    for (let i = 1; i <= 12; i++) {
      addLocalResult(result({ wpm: i * 10, acc: 90 }), true);
    }
    expect(getLocalAverage(result())).toEqual({ wpm: 75, acc: 90 });
  });
});
