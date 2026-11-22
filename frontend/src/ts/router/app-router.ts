// The app's router instance: the router type registration and app-only side
// effects (title, og:url, focus). Importing it creates the router - tests use
// createAppRouter instead

import { BRAND } from "../constants/brand";
import { getRoutePage } from "../states/router";
import { setFocusMode } from "../states/test";
import type { PageName } from "./routes";
import { updateTitle } from "../utils/misc";
import { capitalizeFirstLetterOfEachWord } from "../utils/strings";
import { createAppRouter } from "./create-router";
import { setRouter } from "./instance";

export const router = createAppRouter();

declare module "@tanstack/solid-router" {
  // oxlint-disable-next-line typescript/consistent-type-definitions -- module augmentation needs an interface
  interface Register {
    router: typeof router;
  }
}

setRouter(router);

let isInitialLoad = true;
let prevPage: PageName = "loading";

router.subscribe("onResolved", () => {
  updateOpenGraphUrl();

  if (isInitialLoad) {
    isInitialLoad = false;
    document.body.classList.remove("loading");
  }

  const page = getRoutePage();
  if (page === prevPage) return;
  prevPage = page;

  updatePageTitle(page);
  setFocusMode(false);
});

function updatePageTitle(page: PageName): void {
  if (page === "test") {
    updateTitle();
  } else {
    updateTitle(`${capitalizeFirstLetterOfEachWord(page)} | ${BRAND.name}`);
  }
}

function updateOpenGraphUrl(): void {
  let tag = document.querySelector('meta[property="og:url"]');
  if (tag === null) {
    tag = document.createElement("meta");
    tag.setAttribute("property", "og:url");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", window.location.href);
}
