/**
 * Client-side anticheat. Akshar has no server to re-check results, so this
 * only stops casual cheating (scripts that dispatch key events or insert
 * text, auto-typers with a fixed rhythm); anyone editing the page can still
 * bypass it. Results it
 * flags are invalid: shown, but never saved or counted as a pb.
 */

/** Below this many keystrokes the timing is too short to judge. */
const MIN_KEYSTROKES_FOR_TIMING = 20;
/**
 * Spread of the gaps between keystrokes relative to their mean. People land
 * well above 0.3 even when drilling one word; a scripted typer with a fixed
 * delay sits near 0.
 */
const MIN_SPACING_VARIATION = 0.1;
/** Hold times that are all within this many ms of each other are scripted. */
const MIN_HOLD_SPREAD_MS = 2;
/**
 * Key presses per typed character. Every keyboard, on-screen ones included,
 * fires a keydown per key; a script inserting text fires none. Kept low
 * because a Nepali Traditional conjunct key types up to 3 characters.
 */
const MIN_KEYDOWNS_PER_CHARACTER = 0.3;

export type AnticheatInput = {
  /** key or input events the browser didn't mark as user-initiated */
  untrustedEvents: number;
  /** ms between consecutive keydowns */
  keySpacing: readonly number[];
  /** ms each key was held down */
  keyDuration: readonly number[];
  /** keydown events during the test */
  keydowns: number;
  /** characters the user inserted (the app's own automatic inserts excluded) */
  insertedCharacters: number;
};

export type AnticheatVerdict =
  | { flagged: false }
  | {
      flagged: true;
      reason: "untrusted input" | "robotic timing" | "missing key presses";
    };

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function coefficientOfVariation(values: readonly number[]): number {
  const average = mean(values);
  if (average <= 0) return 0;
  const variance =
    values.reduce((sum, value) => sum + (value - average) ** 2, 0) /
    values.length;
  return Math.sqrt(variance) / average;
}

function hasRoboticTiming(input: AnticheatInput): boolean {
  const spacing = input.keySpacing.filter((ms) => ms > 0);
  if (spacing.length >= MIN_KEYSTROKES_FOR_TIMING) {
    if (coefficientOfVariation(spacing) < MIN_SPACING_VARIATION) return true;
  }

  const holds = input.keyDuration.filter((ms) => ms >= 0);
  if (holds.length >= MIN_KEYSTROKES_FOR_TIMING) {
    const spread = Math.max(...holds) - Math.min(...holds);
    if (spread < MIN_HOLD_SPREAD_MS) return true;
  }
  return false;
}

/** Judges a finished test's input. Pure: the caller gathers the numbers. */
export function checkForCheating(input: AnticheatInput): AnticheatVerdict {
  if (input.untrustedEvents > 0) {
    return { flagged: true, reason: "untrusted input" };
  }
  if (
    input.insertedCharacters >= MIN_KEYSTROKES_FOR_TIMING &&
    input.keydowns < input.insertedCharacters * MIN_KEYDOWNS_PER_CHARACTER
  ) {
    return { flagged: true, reason: "missing key presses" };
  }
  if (hasRoboticTiming(input)) {
    return { flagged: true, reason: "robotic timing" };
  }
  return { flagged: false };
}

let untrustedEvents = 0;

/** Untrusted key and input events since the last reset. */
export function getUntrustedEventCount(): number {
  return untrustedEvents;
}

/** Starts a fresh count, call when a test restarts. */
export function resetUntrustedEventCount(): void {
  untrustedEvents = 0;
}

const TYPING_INPUT_ID = "wordsInput";

function countIfUntrusted(event: Event): void {
  // only typing counts: the app dispatches its own events on form fields
  const isTypingInput =
    event.target instanceof HTMLElement && event.target.id === TYPING_INPUT_ID;
  if (isTypingInput && !event.isTrusted) untrustedEvents++;
}

// capture phase: counted before any handler can stop the event
for (const type of ["keydown", "keyup", "beforeinput", "input"] as const) {
  document.addEventListener(type, countIfUntrusted, { capture: true });
}
