/**
 * App-shell test harness: the real route tree in a real RouterProvider with
 * in-memory history, stub pages and animations that finish at once.
 *
 * Its vi.mock calls stub the pages and animejs for modules loaded after it, so
 * a test file should get src modules that load pages (routes, PageSwitcher)
 * through the harness, not import them itself.
 *
 * ```tsx
 * afterEach(() => cleanupApp());
 *
 * it("shows the stats page", async () => {
 *   const app = renderApp({ url: "/stats" });
 *   await app.settle();
 *   expect(app.shownPage()).toBe("stats");
 * });
 * ```
 *
 * Pages are stubs rendering their name, except the real loading page;
 * `shownPage()` returns the name of the page on screen (eg. "test", "404").
 */
// static json (layouts...) read from disk, the test state module loads some
import "./mock-static";
import { cleanup, render } from "@solidjs/testing-library";
import { createMemoryHistory, RouterProvider } from "@tanstack/solid-router";
import { JSXElement } from "solid-js";
import { vi } from "vitest";

import { __testing as configTesting } from "../../src/ts/config/testing";
import {
  AppRouter,
  createAppRouter,
  setPreloading,
} from "../../src/ts/router/create-router";
import { setRouter } from "../../src/ts/router/instance";
import { resetLoadingBar } from "../../src/ts/router/loading-bar";
import { isLoadingBarShown } from "../../src/ts/states/loading-page";
import { setTestPhase } from "../../src/ts/test/engine/state";

vi.mock("animejs", () => ({
  animate: (
    el: HTMLElement,
    params: { opacity?: number; width?: string; onComplete?: () => void },
  ) => {
    if (params.opacity !== undefined) {
      el.style.opacity = String(params.opacity);
    }
    if (params.width !== undefined) el.style.width = params.width;
    params.onComplete?.();
    return {
      pause: vi.fn(),
      then: async (callback: () => void): Promise<void> => callback(),
    };
  },
}));

function stubPage(
  name: string,
): () => Promise<Record<string, () => JSXElement>> {
  return async () => {
    return {
      [name]: () => {
        const el = document.createElement("span");
        el.textContent = name;
        return el;
      },
    };
  };
}
vi.mock("../../src/ts/components/pages/404Page", stubPage("NotFoundPage"));
vi.mock("../../src/ts/components/pages/AboutPage", stubPage("AboutPage"));
vi.mock(
  "../../src/ts/components/pages/settings/SettingsPage",
  stubPage("SettingsPage"),
);
vi.mock("../../src/ts/components/pages/stats/StatsPage", stubPage("StatsPage"));
vi.mock("../../src/ts/components/pages/test/TestPage", stubPage("TestPage"));

vi.mock("../../src/ts/test/test-logic", async () => {
  const { setTestPhase } = await import("../../src/ts/test/engine/state");
  return {
    leaveTestPage: () => setTestPhase("idle"),
    restartTest: () => undefined,
  };
});

export type App = {
  router: AppRouter;
  /** Current url: path, search and hash. */
  url: () => string;
  /** Name of the page in the DOM, eg. "stats" (undefined if none). */
  shownPage: () => string | undefined;
  /** Waits for the router to be idle and the page swap to finish. */
  settle: () => Promise<void>;
};

let destroyRouter: (() => void) | undefined;

export function renderApp(options: { url?: string } = {}): App {
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

  const router = createAppRouter({
    history: createMemoryHistory({ initialEntries: [options.url ?? "/"] }),
  });
  destroyRouter = () => {
    router.history.destroy();
    router.subscribers.clear();
  };
  setRouter(router);

  const { container } = render(() => <RouterProvider router={router} />);

  async function settle(): Promise<void> {
    await vi.waitFor(
      () => {
        if (router.state.status !== "idle" || router.state.isLoading) {
          throw new Error("router busy");
        }
        if (isLoadingBarShown()) throw new Error("loading bar finishing");
      },
      { interval: 5 },
    );
    for (let i = 0; i < 3; i++) await flush();
  }

  return {
    router,
    url: () => {
      const { pathname, searchStr, hash } = router.state.location;
      return pathname + searchStr + (hash === "" ? "" : `#${hash}`);
    },
    shownPage: () => {
      const el = container.querySelector(".page");
      return el === null ? undefined : pageName(el);
    },
    settle,
  };
}

/** Unmounts the app and resets shared state. Call in afterEach. */
export function cleanupApp(): void {
  cleanup();
  destroyRouter?.();
  destroyRouter = undefined;
  setRouter(undefined);
  setPreloading(true);
  resetLoadingBar();
  setTestPhase("idle");
  configTesting.replaceConfig({});
}

function pageName(el: Element): string {
  const name = el.id.replace(/^page/, "");
  return name.charAt(0).toLowerCase() + name.slice(1);
}

/** Lets the app react: waits for pending timers and the next animation frame. */
export async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 0));
}
