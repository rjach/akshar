import { describe, expect, it, vi } from "vitest";

const { setConfig, restartTest } = vi.hoisted(() => ({
  setConfig: vi.fn(),
  restartTest: vi.fn(async () => undefined),
}));
vi.mock("../../src/ts/config/setters", () => ({ setConfig }));
vi.mock("../../src/ts/test/test-logic", () => ({ restartTest }));

import { languageAction } from "../../src/ts/url-actions/actions/language";

describe("languageAction", () => {
  it("accepts a known language", () => {
    expect(languageAction.schema.parse("nepali_traditional")).toBe(
      "nepali_traditional",
    );
  });

  it("rejects an unknown language", () => {
    expect(languageAction.schema.safeParse("not_a_language").success).toBe(
      false,
    );
  });

  it("switches the typing language and restarts the test", async () => {
    await languageAction.apply("nepali_unicode");
    expect(setConfig).toHaveBeenCalledWith("language", "nepali_unicode");
    expect(restartTest).toHaveBeenCalledOnce();
  });
});
