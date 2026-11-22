// static json (layouts...) read from disk, the test state module loads some
import "../../../../__harness__/mock-static";
import { render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

// no canvas in jsdom - show the pb line labels instead
vi.mock("../../../../../src/ts/components/common/ChartJs", () => ({
  ChartJs: (props: {
    options: {
      plugins: {
        annotation: { annotations: { label: { content: string } }[] };
      };
    };
  }) => (
    <div data-testid="chart">
      {props.options.plugins.annotation.annotations
        .map((a) => a.label.content)
        .join("|")}
    </div>
  ),
}));

import { ResultChart } from "../../../../../src/ts/components/pages/test/result/ResultChart";
import { CompletedResult } from "../../../../../src/ts/states/test";
import {
  addLocalResult,
  clearLocalResults,
} from "../../../../../src/ts/stores/local-results";

describe("ResultChart", () => {
  afterEach(() => {
    clearLocalResults();
  });

  const result = {
    mode: "time",
    mode2: "15",
    language: "nepali_unicode",
    punctuation: false,
    numbers: false,
    difficulty: "normal",
    lazyMode: false,
    funbox: [],
    chartData: "toolong",
  } as unknown as CompletedResult;

  it("draws no pb line without saved results", () => {
    const { getByTestId } = render(() => (
      <ResultChart result={result} eventLog={[] as never} />
    ));
    expect(getByTestId("chart")).not.toHaveTextContent("PB");
  });

  it("draws the pb line from this browser's results", () => {
    addLocalResult(
      {
        timestamp: 1,
        wpm: 42,
        rawWpm: 45,
        acc: 97,
        consistency: 80,
        mode: "time",
        mode2: "15",
        language: "nepali_unicode",
        punctuation: false,
        numbers: false,
        difficulty: "normal",
        lazyMode: false,
        funbox: [],
        testDuration: 15,
        afkDuration: 0,
      },
      true,
    );
    const { getByTestId } = render(() => (
      <ResultChart result={result} eventLog={[] as never} />
    ));
    expect(getByTestId("chart")).toHaveTextContent("PB: 42.00");
  });
});
