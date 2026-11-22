import { afterEach, describe, expect, it } from "vitest";

import { cleanupApp, renderApp } from "../__harness__/app-shell";

afterEach(() => cleanupApp());

describe("routes", () => {
  it.each([
    ["/", "test"],
    ["/about", "about"],
    ["/settings", "settings"],
    ["/stats", "stats"],
  ])("shows %s as the %s page", async (url, page) => {
    const app = renderApp({ url });
    await app.settle();
    expect(app.shownPage()).toBe(page);
  });

  it.each(["/login", "/account", "/leaderboards", "/profile/someone"])(
    "has no %s page (frontend-only)",
    async (url) => {
      const app = renderApp({ url });
      await app.settle();
      expect(app.shownPage()).toBe("404");
    },
  );

  it("moves between pages", async () => {
    const app = renderApp({ url: "/" });
    await app.settle();
    await app.router.navigate({ to: "/stats" });
    await app.settle();
    expect(app.url()).toBe("/stats");
    expect(app.shownPage()).toBe("stats");
  });
});
