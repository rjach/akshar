import { describe, expect, it } from "vitest";

import { checkForCheating } from "../../src/ts/test/anticheat";

// a human-ish rhythm: gaps and holds that wander
const humanSpacing = Array.from(
  { length: 40 },
  (_, i) => 120 + ((i * 37) % 90),
);
const humanHolds = Array.from({ length: 40 }, (_, i) => 70 + ((i * 13) % 40));

describe("checkForCheating", () => {
  it("passes a human rhythm", () => {
    expect(
      checkForCheating({
        untrustedEvents: 0,
        keydowns: 40,
        insertedCharacters: 40,
        keySpacing: humanSpacing,
        keyDuration: humanHolds,
      }),
    ).toEqual({ flagged: false });
  });

  it("flags scripted key events", () => {
    expect(
      checkForCheating({
        untrustedEvents: 3,
        keydowns: 40,
        insertedCharacters: 40,
        keySpacing: humanSpacing,
        keyDuration: humanHolds,
      }),
    ).toEqual({ flagged: true, reason: "untrusted input" });
  });

  it("flags a fixed typing delay", () => {
    expect(
      checkForCheating({
        untrustedEvents: 0,
        keydowns: 40,
        insertedCharacters: 40,
        keySpacing: Array.from({ length: 40 }, () => 100),
        keyDuration: humanHolds,
      }),
    ).toEqual({ flagged: true, reason: "robotic timing" });
  });

  it("flags identical key hold times", () => {
    expect(
      checkForCheating({
        untrustedEvents: 0,
        keydowns: 40,
        insertedCharacters: 40,
        keySpacing: humanSpacing,
        keyDuration: Array.from({ length: 40 }, () => 50),
      }),
    ).toEqual({ flagged: true, reason: "robotic timing" });
  });

  it("flags text inserted without key presses", () => {
    expect(
      checkForCheating({
        untrustedEvents: 0,
        keySpacing: [],
        keyDuration: [],
        keydowns: 0,
        insertedCharacters: 57,
      }),
    ).toEqual({ flagged: true, reason: "missing key presses" });
  });

  it("allows conjunct keys typing several characters per press", () => {
    expect(
      checkForCheating({
        untrustedEvents: 0,
        keySpacing: humanSpacing,
        keyDuration: humanHolds,
        keydowns: 40,
        insertedCharacters: 70,
      }),
    ).toEqual({ flagged: false });
  });

  it("doesn't judge timing on very short tests", () => {
    expect(
      checkForCheating({
        untrustedEvents: 0,
        keydowns: 3,
        insertedCharacters: 3,
        keySpacing: [100, 100, 100],
        keyDuration: [50, 50, 50],
      }),
    ).toEqual({ flagged: false });
  });
});
