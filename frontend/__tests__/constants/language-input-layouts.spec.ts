import { describe, expect, it } from "vitest";

import { getEffectiveInputLayout } from "../../src/ts/constants/language-input-layouts";
import traditional from "../../static/layouts/nepali_traditional.json";
import unicode from "../../static/layouts/nepali_unicode_romanized.json";

describe("getEffectiveInputLayout", () => {
  it("types nepali unicode through the romanized keyboard", () => {
    expect(getEffectiveInputLayout("default", "nepali_unicode")).toBe(
      "nepali_unicode_romanized",
    );
  });

  it("types nepali traditional through the traditional keyboard", () => {
    expect(getEffectiveInputLayout("default", "nepali_traditional")).toBe(
      "nepali_traditional",
    );
  });

  it("keeps the system keyboard for plain nepali and english", () => {
    expect(getEffectiveInputLayout("default", "nepali")).toBe("default");
    expect(getEffectiveInputLayout("default", "english")).toBe("default");
  });

  it("lets an explicitly chosen layout win", () => {
    expect(getEffectiveInputLayout("dvorak", "nepali_traditional")).toBe(
      "dvorak",
    );
  });
});

describe("nepali layouts", () => {
  it("maps the romanized home row phonetically", () => {
    const homeRow = unicode.keys.row3.map((legends) => legends[0]).join("");
    expect(homeRow).toBe("ासदउगहजकल;'");
  });

  it("maps the traditional home row and conjunct keys", () => {
    const homeRow = traditional.keys.row3.map((legends) => legends[0]).join("");
    expect(homeRow).toBe("बकमानजवपिसु");
    // Q types त्र, shift+1 types ज्ञ
    expect(traditional.keys.row2[0]?.[0]).toBe("त्र");
    expect(traditional.keys.row1[1]?.[1]).toBe("ज्ञ");
  });
});
