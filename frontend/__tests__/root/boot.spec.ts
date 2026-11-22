import { describe, expect, it, vi } from "vitest";

const config = vi.hoisted(() => {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => (resolve = res));
  return { promise, resolve };
});

vi.mock("../../src/ts/config/lifecycle", () => ({
  loadFromLocalStorage: vi.fn(async () => config.promise),
}));
vi.mock("../../src/ts/test/today-tracker", () => ({
  addAllFromToday: vi.fn(),
}));
vi.mock("../../src/ts/utils/env", () => ({ isDevEnvironment: () => false }));

import { boot } from "../../src/ts/boot";
import { loadFromLocalStorage } from "../../src/ts/config/lifecycle";
import { isAppReady } from "../../src/ts/states/core";
import { addAllFromToday } from "../../src/ts/test/today-tracker";

describe("boot", () => {
  it("loads the local config and today's time, then marks the app ready", async () => {
    const booted = boot();

    expect(loadFromLocalStorage).toHaveBeenCalledOnce();
    expect(addAllFromToday).toHaveBeenCalledOnce();
    await Promise.resolve();
    expect(isAppReady()).toBe(false);

    config.resolve();
    await booted;

    expect(isAppReady()).toBe(true);
  });
});
