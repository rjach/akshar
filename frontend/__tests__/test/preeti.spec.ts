import { describe, expect, it } from "vitest";

import { PreetiComposer } from "../../src/ts/test/preeti";
import preeti from "../../static/layouts/nepali_preeti.json";

// US ANSI keys in the order of the layout rows: [unshifted, shifted]
const ANSI_ROWS = [
  [
    "`~",
    "1!",
    "2@",
    "3#",
    "4$",
    "5%",
    "6^",
    "7&",
    "8*",
    "9(",
    "0)",
    "-_",
    "=+",
  ],
  [
    "qQ",
    "wW",
    "eE",
    "rR",
    "tT",
    "yY",
    "uU",
    "iI",
    "oO",
    "pP",
    "[{",
    "]}",
    "\\|",
  ],
  ["aA", "sS", "dD", "fF", "gG", "hH", "jJ", "kK", "lL", ";:", "'\""],
  ["zZ", "xX", "cC", "vV", "bB", "nN", "mM", ",<", ".>", "/?"],
];

const legendOf = new Map<string, string>([[" ", " "]]);
const layoutRows = [
  preeti.keys.row1,
  preeti.keys.row2,
  preeti.keys.row3,
  preeti.keys.row4,
];
ANSI_ROWS.forEach((row, rowIndex) =>
  row.forEach((keys, keyIndex) => {
    const legends = layoutRows[rowIndex]?.[keyIndex] ?? [];
    [...keys].forEach((key, shift) => legendOf.set(key, legends[shift] ?? ""));
  }),
);

/** Types ASCII keys as on a Preeti keyboard, returning what was inserted. */
function type(keys: string, composer = new PreetiComposer()): string {
  let inserted = "";
  for (const key of keys) {
    const legend = legendOf.get(key);
    if (legend === undefined) throw new Error(`no Preeti legend for "${key}"`);
    const { syllable, separator } = composer.push(legend);
    inserted += syllable + separator;
  }
  return inserted + composer.flush();
}

describe("Preeti composer", () => {
  it.each([
    ["gd:t]", "नमस्ते"],
    ["sfo{", "कार्य"],
    ["lstfa", "किताब"],
    ["lk|o", "प्रिय"],
    ['km"n', "फूल"],
    ["cfdf", "आमा"],
    ["cf]vf", "ओखा"],
    ["O{Zj/", "ईश्वर"],
    ["If]q", "क्षेत्र"],
    ["c+u", "अंग"],
    [">L", "श्री"],
    ["wd{", "धर्म"],
    ["s]6L", "केटी"],
    ["/fd}", "रामै"],
    ["emf]nf", "झोला"],
    ["pmg", "ऊन"],
  ])("types %s as %s", (keys, word) => {
    expect(type(keys)).toBe(word);
  });

  it("holds a syllable until the next one starts", () => {
    const composer = new PreetiComposer();
    expect(composer.push(legendOf.get("s") as string)).toEqual({
      syllable: "",
      separator: "",
    });
    expect(composer.push(legendOf.get("f") as string).syllable).toBe("");
    expect(composer.push(legendOf.get("d") as string).syllable).toBe("का");
  });

  it("releases the held syllable with a space", () => {
    const composer = new PreetiComposer();
    composer.push(legendOf.get("l") as string);
    composer.push(legendOf.get("s") as string);
    expect(composer.push(" ")).toEqual({ syllable: "कि", separator: " " });
  });

  it("undoes held keys before touching the input", () => {
    const composer = new PreetiComposer();
    expect(composer.backspace()).toBe(false);
    composer.push(legendOf.get("s") as string);
    composer.push(legendOf.get("f") as string);
    expect(composer.backspace()).toBe(true);
    expect(composer.flush()).toBe("क");
  });

  it("puts ङ, an Alt-code glyph in the font, on altgr+`", () => {
    expect(preeti.keys.row1[0]?.[2]).toBe("ङ");
    const composer = new PreetiComposer();
    const pieces = ["अ", "ङ", "्", "ग", "ा"];
    const inserted = pieces.map((piece) => composer.push(piece).syllable);
    expect(inserted.join("") + composer.flush()).toBe("अङ्गा");
  });

  it("types digits on shift, as the Preeti font does", () => {
    expect(type("!)")).toBe("१०");
  });
});
