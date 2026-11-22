import { format } from "date-fns/format";
import { createMemo, createSignal, For, JSXElement, Show } from "solid-js";

import Format from "../../../singletons/format";
import {
  clearLocalResults,
  getLocalPb,
  getLocalResults,
  LocalResult,
} from "../../../stores/local-results";
import { secondsToString } from "../../../utils/date-and-time";
import { getLanguageDisplayString } from "../../../utils/strings";
import { Button } from "../../common/Button";
import { H2 } from "../../common/Headers";

const RECENT_RESULTS_SHOWN = 50;
const PB_MODES: { mode: "time" | "words"; mode2: string[] }[] = [
  { mode: "time", mode2: ["15", "30", "60", "120"] },
  { mode: "words", mode2: ["10", "25", "50", "100"] },
];

function describeTest(result: LocalResult): string {
  const mode2 = result.mode === "time" ? `${result.mode2}s` : result.mode2;
  const extras = [
    result.punctuation ? "punctuation" : "",
    result.numbers ? "numbers" : "",
  ].filter((extra) => extra !== "");
  return [result.mode, mode2, ...extras].join(" ");
}

function StatTile(props: { label: string; value: string }): JSXElement {
  return (
    <div class="grid gap-1 rounded bg-sub-alt p-4">
      <div class="text-sm text-sub">{props.label}</div>
      <div class="text-3xl text-text">{props.value}</div>
    </div>
  );
}

/** This browser's typing history: totals, personal bests and recent tests. */
export function StatsPage(): JSXElement {
  const [confirmingClear, setConfirmingClear] = createSignal(false);

  const totals = createMemo(() => {
    const results = getLocalResults();
    const recent = results.slice(-10);
    const secondsTyped = results.reduce(
      (sum, result) => sum + result.testDuration - result.afkDuration,
      0,
    );
    const average = (pick: (result: LocalResult) => number): number =>
      recent.length === 0
        ? 0
        : recent.reduce((sum, result) => sum + pick(result), 0) / recent.length;
    return {
      count: results.length,
      secondsTyped,
      bestWpm: results.reduce((best, result) => Math.max(best, result.wpm), 0),
      averageWpm: average((result) => result.wpm),
      averageAcc: average((result) => result.acc),
    };
  });

  const languages = createMemo(() =>
    [...new Set(getLocalResults().map((result) => result.language))].sort(),
  );

  const recentResults = createMemo(() =>
    getLocalResults().slice(-RECENT_RESULTS_SHOWN).reverse(),
  );

  const pbFor = (
    language: LocalResult["language"],
    mode: "time" | "words",
    mode2: string,
  ): LocalResult | undefined =>
    getLocalPb({
      language,
      mode,
      mode2,
      punctuation: false,
      numbers: false,
      difficulty: "normal",
      lazyMode: false,
    });

  return (
    <div class="content-grid grid gap-8">
      <section class="text-center text-sub">
        Your results are stored only in this browser. Clearing site data or
        switching devices starts a fresh history.
      </section>

      <Show
        when={totals().count > 0}
        fallback={
          <section class="grid place-items-center gap-4 py-16 text-center">
            <div class="text-2xl text-sub">No tests yet</div>
            <Button variant="button" text="start typing" to="/" />
          </section>
        }
      >
        <section class="grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatTile label="tests completed" value={String(totals().count)} />
          <StatTile
            label="time typing"
            value={secondsToString(Math.round(totals().secondsTyped), true)}
          />
          <StatTile
            label="best speed"
            value={Format.typingSpeed(totals().bestWpm)}
          />
          <StatTile
            label="average speed (last 10)"
            value={Format.typingSpeed(totals().averageWpm)}
          />
          <StatTile
            label="average accuracy (last 10)"
            value={Format.accuracy(totals().averageAcc)}
          />
        </section>

        <section>
          <H2 fa={{ icon: "fa-crown" }} text="personal bests" />
          <div class="grid gap-6">
            <For each={languages()}>
              {(language) => (
                <div class="grid gap-2">
                  <div class="text-sub">
                    {getLanguageDisplayString(language)}
                  </div>
                  <div class="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                    <For each={PB_MODES}>
                      {({ mode, mode2 }) => (
                        <For each={mode2}>
                          {(value) => {
                            const pb = () => pbFor(language, mode, value);
                            return (
                              <div class="grid gap-1 rounded bg-sub-alt p-3 text-center">
                                <div class="text-xs text-sub">
                                  {mode} {value}
                                </div>
                                <div class="text-xl text-text">
                                  {pb() === undefined
                                    ? "-"
                                    : Format.typingSpeed(pb()?.wpm ?? 0)}
                                </div>
                                <div class="text-xs text-sub">
                                  {pb() === undefined
                                    ? ""
                                    : Format.accuracy(pb()?.acc ?? 0)}
                                </div>
                              </div>
                            );
                          }}
                        </For>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </section>

        <section>
          <H2 fa={{ icon: "fa-history" }} text="recent tests" />
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="text-sub">
                <tr>
                  <th class="p-2 font-normal">date</th>
                  <th class="p-2 font-normal">test</th>
                  <th class="p-2 font-normal">language</th>
                  <th class="p-2 text-right font-normal">speed</th>
                  <th class="p-2 text-right font-normal">raw</th>
                  <th class="p-2 text-right font-normal">accuracy</th>
                  <th class="p-2 text-right font-normal">consistency</th>
                </tr>
              </thead>
              <tbody>
                <For each={recentResults()}>
                  {(result) => (
                    <tr class="odd:bg-sub-alt">
                      <td class="p-2 whitespace-nowrap text-sub">
                        {format(result.timestamp, "dd MMM yyyy HH:mm")}
                      </td>
                      <td class="p-2">
                        {describeTest(result)}
                        <Show when={result.isPb}>
                          {" "}
                          <span class="text-main">pb</span>
                        </Show>
                      </td>
                      <td class="p-2">
                        {getLanguageDisplayString(result.language)}
                      </td>
                      <td class="p-2 text-right">
                        {Format.typingSpeed(result.wpm)}
                      </td>
                      <td class="p-2 text-right">
                        {Format.typingSpeed(result.rawWpm)}
                      </td>
                      <td class="p-2 text-right">
                        {Format.accuracy(result.acc)}
                      </td>
                      <td class="p-2 text-right">
                        {Format.percentage(result.consistency)}
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </section>

        <section class="flex justify-center">
          <Button
            variant="button"
            danger
            text={
              confirmingClear()
                ? "click again to delete all results"
                : "clear history"
            }
            fa={{ icon: "fa-trash" }}
            onClick={() => {
              if (!confirmingClear()) {
                setConfirmingClear(true);
                return;
              }
              clearLocalResults();
              setConfirmingClear(false);
            }}
          />
        </section>
      </Show>
    </div>
  );
}
