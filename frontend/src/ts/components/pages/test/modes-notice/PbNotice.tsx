import { createMemo } from "solid-js";

import { getConfig } from "../../../../config/store";
import { getFormatting } from "../../../../states/core";
import { getCurrentQuote } from "../../../../states/test";
import { getLocalPb } from "../../../../stores/local-results";
import { getActiveFunboxes } from "../../../../test/funbox/list";
import { getMode2 } from "../../../../utils/misc";
import { Notice } from "./Notice";

export function PbNotice() {
  const displayText = createMemo(() => {
    const format = getFormatting();
    // reads config.funbox, so a funbox change updates the notice
    if (!getActiveFunboxes().every((funbox) => funbox.canGetPb)) {
      return "no pb";
    }

    const pb = getLocalPb({
      mode: getConfig.mode,
      mode2: getMode2(getConfig, getCurrentQuote()),
      language: getConfig.language,
      punctuation: getConfig.punctuation,
      numbers: getConfig.numbers,
      difficulty: getConfig.difficulty,
      lazyMode: getConfig.lazyMode,
    });

    if (pb === undefined) return "no pb";

    const speed = format.typingSpeed(pb.wpm, {
      showDecimalPlaces: true,
      suffix: ` ${getConfig.typingSpeedUnit}`,
    });

    const acc = format.accuracy(pb.acc, { suffix: ` acc` });

    return `${speed} ${acc}`;
  });

  return (
    <Notice
      when={getConfig.showPb}
      icon="fa-crown"
      openCommandline="showPb"
      text={displayText()}
    />
  );
}
