import { getFunbox } from "@monkeytype/funbox";

import Format from "../singletons/format";
import { hideCrown, showCrown } from "../states/result";
import { getLocalPb } from "../stores/local-results";
import { CompletedResult } from "../states/test";

export type PbEligibility = {
  value: boolean;
  reason?: string;
};

/**
 * null when pbs don't apply at all (quote mode or the result isn't saved)
 */
export function getPbEligibility(
  result: CompletedResult,
  dontSave: boolean,
): PbEligibility | null {
  if (result.mode === "quote" || dontSave) return null;

  const funboxesOk =
    result.funbox.length === 0 ||
    getFunbox(result.funbox).every((f) => f?.canGetPb);
  // allow stopOnError:letter to be PB only if 100% accuracy, since it doesn't affect gameplay
  const stopOnLetterTriggered = result.stopOnLetter && result.acc < 100;

  if (!funboxesOk) return { value: false, reason: "funbox" };
  if (stopOnLetterTriggered) return { value: false, reason: "stop on letter" };
  if (result.bailedOut) return { value: false, reason: "bailed out" };
  return { value: true };
}

/** Shows the pb crown, compared against this browser's saved results. */
export function updateCrown(
  result: CompletedResult,
  canGet: PbEligibility | null,
): void {
  if (canGet === null) {
    hideCrown();
    return;
  }

  console.debug("Result can get PB:", canGet.value, canGet.reason ?? "");

  const localPb = getLocalPb(result);
  const pbDiff = result.wpm - (localPb?.wpm ?? 0);
  console.debug("Local PB", localPb, "diff", pbDiff);
  const diffText = Format.typingSpeed(pbDiff, { showDecimalPlaces: true });

  if (canGet.value) {
    if (pbDiff <= 0) {
      hideCrown();
    } else {
      showCrown("normal", `+${diffText}`);
    }
  } else if (pbDiff <= 0) {
    showCrown(
      "warning",
      `This result is not eligible for a new PB (${canGet.reason})`,
      true,
    );
  } else {
    showCrown(
      "ineligible",
      `You could've gotten a new PB (+${diffText}), but your config does not allow it (${canGet.reason})`,
      true,
    );
  }
}
