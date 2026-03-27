import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  workers: 1,
  fullyParallel: false,
  retries: 2,
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  webServer: {
    command: "npm run dev",
    port: 4321,
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
  use: {
    baseURL: "http://localhost:4321",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  testMatch: "**/*.spec.ts",
});
