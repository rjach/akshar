import { createMemo, JSXElement } from "solid-js";

import { getConfig } from "../../../../config/store";
import { getFormatting } from "../../../../states/core";
import { getCurrentQuote } from "../../../../states/test";
import { getLocalAverage } from "../../../../stores/local-results";
import { getMode2 } from "../../../../utils/misc";
import { Notice } from "./Notice";

export function AverageNotice(): JSXElement {
  const last10 = createMemo(() =>
    getLocalAverage({
      mode: getConfig.mode,
      mode2: getMode2(getConfig, getCurrentQuote()),
      language: getConfig.language,
      punctuation: getConfig.punctuation,
      numbers: getConfig.numbers,
      difficulty: getConfig.difficulty,
      lazyMode: getConfig.lazyMode,
    }),
  );

  const displayText = createMemo(() => {
    const average = last10();
    if (average === undefined) return "no average";

    const format = getFormatting();
    let speed = undefined;
    let acc = undefined;

    if (getConfig.showAverage === "both" || getConfig.showAverage === "speed") {
      speed = format.typingSpeed(average.wpm, {
        suffix: ` ${getConfig.typingSpeedUnit}`,
      });
    }

    if (getConfig.showAverage === "both" || getConfig.showAverage === "acc") {
      acc = format.accuracy(average.acc, {
        suffix: " acc",
      });
    }

    return [speed, acc].filter((it) => it !== undefined).join(" ");
  });

  return (
    <Notice
      when={getConfig.showAverage !== "off"}
      icon="fa-chart-bar"
      openCommandline="showAverage"
      text={displayText()}
    />
  );
}
