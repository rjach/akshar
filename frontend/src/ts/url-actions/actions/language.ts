// Language links (?language=<id>), a url action (../action.ts): the landing
// pages open the test in a typing mode, eg. ?language=nepali_traditional

import { LanguageSchema } from "@monkeytype/schemas/languages";

import { setConfig } from "../../config/setters";
import { restartTest } from "../../test/test-logic";
import { defineSearchAction } from "../action";

export const languageAction = defineSearchAction({
  in: "search",
  param: "language",
  encoding: "plain",
  failure: "Failed to load language from URL",
  schema: LanguageSchema,
  apply: async (language) => {
    setConfig("language", language);
    await restartTest();
  },
});
