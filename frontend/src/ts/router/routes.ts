// The route tree: every page of the site. Akshar is frontend-only, so no
// route waits for auth or downloads data.

import { createRootRoute, createRoute, redirect } from "@tanstack/solid-router";

import { PageSwitcher } from "../components/core/PageSwitcher";
import { AboutPage } from "../components/pages/AboutPage";
import { createRouterPage } from "../components/core/Page";
import { SettingsPage } from "../components/pages/settings/SettingsPage";
import { StatsPage } from "../components/pages/stats/StatsPage";
import { TestPage } from "../components/pages/test/TestPage";
import { SettingsSearchSchema } from "../states/settings-highlight";
import { applyUrlActions } from "../url-actions/apply";

// Paths without a dot fall through to index.html via the SPA rewrite in vercel.json.

/** A page of the site, rendered by its route (see `staticData.page`). */
export type PageName =
  | "loading"
  | "test"
  | "about"
  | "settings"
  | "stats"
  | "404";

declare module "@tanstack/solid-router" {
  // oxlint-disable-next-line typescript/consistent-type-definitions -- module augmentation needs an interface
  interface StaticDataRouteOption {
    /** The page the route renders (its component is a `createRouterPage`). */
    page?: PageName;
  }
}

// each route renders its page, the page switcher fades between them
const root = createRootRoute({
  component: PageSwitcher,
});

const test = createRoute({
  getParentRoute: () => root,
  path: "/",
  staticData: { page: "test" },
  component: createRouterPage(TestPage),
  // shared links (test settings, custom theme, challenge, language): applied
  // once, then dropped from the url so a reload doesn't apply them again
  beforeLoad: ({ location, preload }) => {
    if (preload) return;
    const rest = applyUrlActions(location);
    if (rest === undefined) return;
    redirect({
      to: "/",
      search: rest.search,
      hash: rest.hash,
      replace: true,
      throw: true,
    });
  },
});

const about = createRoute({
  getParentRoute: () => root,
  path: "/about",
  staticData: { page: "about" },
  component: createRouterPage(AboutPage),
});

const settings = createRoute({
  getParentRoute: () => root,
  path: "/settings",
  staticData: { page: "settings" },
  component: createRouterPage(SettingsPage),
  validateSearch: SettingsSearchSchema,
});

const stats = createRoute({
  getParentRoute: () => root,
  path: "/stats",
  staticData: { page: "stats" },
  component: createRouterPage(StatsPage),
});

export const routeTree = root.addChildren([test, about, settings, stats]);
