import { applyEngineSettings } from "./anim";
import { loadFromLocalStorage } from "./config/lifecycle";
import { setAppReady } from "./states/core";
import * as TodayTracker from "./test/today-tracker";
import { isDevEnvironment } from "./utils/env";

/** App startup work that doesn't touch the DOM: loads the config from this
 * browser, then marks the app ready. Call once, right after render. */
export async function boot(): Promise<void> {
  applyEngineSettings();
  const configLoaded = loadFromLocalStorage();
  TodayTracker.addAllFromToday();

  await configLoaded;

  setAppReady(true);

  registerServiceWorker();
}

function registerServiceWorker(): void {
  if (isDevEnvironment()) {
    void navigator.serviceWorker
      .getRegistrations()
      .then(function (registrations) {
        for (const registration of registrations) {
          void registration.unregister();
        }
      });
  } else {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope,
            );
          })
          .catch((error: unknown) => {
            console.error("ServiceWorker registration failed: ", error);
          });
      });
    }
  }
}
