import { vi } from "vitest";
vi.mock("../src/ts/constants/env-config", () => ({
  envConfig: {
    isDevelopment: true,
  },
}));
