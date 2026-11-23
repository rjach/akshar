import { PreetiComposer } from "../../test/preeti";
import { getActiveWordIndex, getTestId } from "../../test/engine/state";
import { emulateInsertText } from "../handlers/insert-text";

const composer = new PreetiComposer();
let heldWordKey = "";

/** A held syllable belongs to one word of one test: drop it once either changes. */
function forgetStaleSyllable(): void {
  const wordKey = `${getTestId()}:${getActiveWordIndex()}`;
  if (wordKey === heldWordKey) return;
  composer.reset();
  heldWordKey = wordKey;
}

/**
 * Types one Preeti key: inserts whatever syllable or separator it finishes.
 *
 * @param piece - The key's legend from the Preeti layout
 * @param now - Keydown timestamp
 */
export async function typePreetiKey(piece: string, now: number): Promise<void> {
  forgetStaleSyllable();
  const { syllable, separator } = composer.push(piece);
  if (syllable !== "") await emulateInsertText({ data: syllable, now });
  if (separator !== "") await emulateInsertText({ data: separator, now });
}

/**
 * Handles backspace while typing Preeti.
 *
 * @param event - The backspace keydown
 * @returns true when it only undid a held key, so the input must stay as is
 */
export function undoPreetiKey(event: KeyboardEvent): boolean {
  forgetStaleSyllable();
  if (event.ctrlKey || event.altKey || event.metaKey) {
    // a word delete takes the held keys with it
    composer.reset();
    return false;
  }
  return composer.backspace();
}
